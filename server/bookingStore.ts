import crypto from 'crypto';

export interface BookedSlotRecord {
  selectedDate: string;
  selectedTime: string;
  bookedAt: string;
}

export interface SlotReservation {
  slotKey: string;
  payload: string;
  reservationId: string;
}

export class BookingStoreError extends Error {
  public readonly statusCode: number;
  public readonly userMessage: string;

  constructor(message: string, userMessage: string, statusCode = 503) {
    super(message);
    this.name = 'BookingStoreError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}

const SLOT_KEY_PREFIX = 'booking:slot:';
// 30 days TTL so un-yeared display dates like "Monday, Nov 30" do not collide a year later
const SLOT_TTL_SECONDS = 30 * 24 * 60 * 60;

// Local-only fallback when Upstash env vars are absent in Express dev
const memorySlotStore = new Map<string, string>();

const RELEASE_IF_OWNED_LUA = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
end
return 0
`.trim();

function buildSlotKey(selectedDate: string, selectedTime: string): string {
  // selectedDate is validated as ISO YYYY-MM-DD before reaching the store
  return `${SLOT_KEY_PREFIX}${selectedDate}|${encodeURIComponent(selectedTime)}`;
}

function computeSlotTtlSeconds(selectedDate: string, now = new Date()): number {
  const [yearStr, monthStr, dayStr] = selectedDate.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
    const endOfBookedDayMs = Date.UTC(year, month - 1, day, 23, 59, 59, 999);
    const graceMs = 7 * 24 * 60 * 60 * 1000;
    const ttlSeconds = Math.ceil((endOfBookedDayMs + graceMs - now.getTime()) / 1000);
    if (ttlSeconds > 86400) {
      return ttlSeconds;
    }
  }

  return SLOT_TTL_SECONDS;
}

function getUpstashConfig(): { url: string; token: string } | null {
  const rawUrl = process.env.UPSTASH_REDIS_REST_URL?.trim() || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';

  if (!rawUrl || !token) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new BookingStoreError(
      'UPSTASH_REDIS_REST_URL is not a valid URL.',
      'Booking storage is temporarily unavailable. Please try again shortly or contact Precious via WhatsApp.',
      503
    );
  }

  if (parsed.protocol !== 'https:') {
    throw new BookingStoreError(
      'UPSTASH_REDIS_REST_URL must use HTTPS.',
      'Booking storage is temporarily unavailable. Please try again shortly or contact Precious via WhatsApp.',
      503
    );
  }

  return {
    url: parsed.origin + parsed.pathname.replace(/\/+$/, ''),
    token,
  };
}

function assertUpstashOrAllowLocalFallback(): { url: string; token: string } | null {
  const upstash = getUpstashConfig();
  if (upstash) {
    return upstash;
  }

  const isServerlessRuntime = Boolean(
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (isServerlessRuntime) {
    console.error(
      '[BOOKING STORE] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in serverless runtime.'
    );
    throw new BookingStoreError(
      'Upstash Redis environment variables are not configured.',
      'Booking calendar storage is temporarily unavailable. Please try again shortly or contact Precious via WhatsApp.',
      503
    );
  }

  return null;
}

async function runRedisCommand<T = unknown>(
  upstash: { url: string; token: string },
  command: Array<string | number>
): Promise<T> {
  const response = await fetch(upstash.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${upstash.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(4000),
  });

  if (!response.ok) {
    throw new BookingStoreError(
      `Upstash Redis HTTP ${response.status}`,
      'Booking storage could not be reached right now. Please try again in a moment.',
      503
    );
  }

  const data = (await response.json()) as { result?: T; error?: string };
  if (data.error) {
    throw new BookingStoreError(
      `Upstash Redis command error: ${data.error}`,
      'Booking storage returned an unexpected error. Please try again shortly.',
      503
    );
  }

  return data.result as T;
}

export async function listBookedSlots(): Promise<BookedSlotRecord[]> {
  const upstash = assertUpstashOrAllowLocalFallback();

  if (!upstash) {
    const records: BookedSlotRecord[] = [];
    for (const raw of memorySlotStore.values()) {
      try {
        const parsed = JSON.parse(raw) as Partial<BookedSlotRecord>;
        if (parsed.selectedDate && parsed.selectedTime && parsed.bookedAt) {
          records.push({
            selectedDate: parsed.selectedDate,
            selectedTime: parsed.selectedTime,
            bookedAt: parsed.bookedAt,
          });
        }
      } catch {
        // Skip malformed entries
      }
    }
    return records;
  }

  const keys: string[] = [];
  let cursor = '0';

  do {
    const scanResult = await runRedisCommand<[string, string[]]>(upstash, [
      'SCAN',
      cursor,
      'MATCH',
      `${SLOT_KEY_PREFIX}*`,
      'COUNT',
      '200',
    ]);
    cursor = scanResult?.[0] ?? '0';
    const batch = Array.isArray(scanResult?.[1]) ? scanResult[1] : [];
    for (const k of batch) {
      keys.push(k);
    }
  } while (cursor !== '0');

  if (keys.length === 0) {
    return [];
  }

  const values = await runRedisCommand<Array<string | null>>(upstash, ['MGET', ...keys]);
  const slots: BookedSlotRecord[] = [];

  for (const raw of values || []) {
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as Partial<BookedSlotRecord>;
      if (parsed.selectedDate && parsed.selectedTime && parsed.bookedAt) {
        slots.push({
          selectedDate: parsed.selectedDate,
          selectedTime: parsed.selectedTime,
          bookedAt: parsed.bookedAt,
        });
      }
    } catch {
      // Skip non-JSON values
    }
  }

  return slots;
}

export async function reserveBookingSlot(params: {
  selectedDate: string;
  selectedTime: string;
  bookedAt: string;
  now?: Date;
}): Promise<{ acquired: true; reservation: SlotReservation } | { acquired: false }> {
  const upstash = assertUpstashOrAllowLocalFallback();
  const slotKey = buildSlotKey(params.selectedDate, params.selectedTime);
  const reservationId = crypto.randomUUID();
  const payload = JSON.stringify({
    selectedDate: params.selectedDate,
    selectedTime: params.selectedTime,
    bookedAt: params.bookedAt,
    reservationId,
  });

  if (!upstash) {
    if (memorySlotStore.has(slotKey)) {
      return { acquired: false };
    }
    memorySlotStore.set(slotKey, payload);
    return {
      acquired: true,
      reservation: { slotKey, payload, reservationId },
    };
  }

  const ttlSeconds = computeSlotTtlSeconds(params.selectedDate, params.now);
  const setResult = await runRedisCommand<string | null>(upstash, [
    'SET',
    slotKey,
    payload,
    'NX',
    'EX',
    ttlSeconds,
  ]);

  if (setResult !== 'OK') {
    return { acquired: false };
  }

  return {
    acquired: true,
    reservation: { slotKey, payload, reservationId },
  };
}

export async function releaseBookingSlotIfOwned(reservation: SlotReservation): Promise<boolean> {
  const upstash = assertUpstashOrAllowLocalFallback();

  if (!upstash) {
    if (memorySlotStore.get(reservation.slotKey) === reservation.payload) {
      memorySlotStore.delete(reservation.slotKey);
      return true;
    }
    return false;
  }

  const deleted = await runRedisCommand<number>(upstash, [
    'EVAL',
    RELEASE_IF_OWNED_LUA,
    1,
    reservation.slotKey,
    reservation.payload,
  ]);

  return deleted === 1;
}
