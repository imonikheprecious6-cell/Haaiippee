import assert from 'node:assert/strict';
import test, { afterEach, beforeEach } from 'node:test';
import nodemailer from 'nodemailer';
import bookedSlotsHandler from '../netlify/functions/booked-slots';
import bookCallHandler from '../netlify/functions/book-call';
import {
  getTodayUtcIsoDate,
  isValidIsoCalendarDate,
  processBookingSubmission,
} from './bookingService';

interface StoredRedisEntry {
  value: string;
  ttlSeconds: number;
}

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const originalCreateTransport = nodemailer.createTransport;

let redisKv = new Map<string, StoredRedisEntry>();
let sentEmails: Array<{ to?: unknown; subject?: unknown; html?: unknown }> = [];

function installMocks() {
  redisKv = new Map();
  sentEmails = [];

  process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  process.env.SMTP_HOST = 'smtp.gmail.com';
  process.env.SMTP_PORT = '465';
  process.env.SMTP_SECURE = 'true';
  process.env.SMTP_USER = 'imonikheprecious6@gmail.com';
  process.env.SMTP_PASS = 'test-app-password';
  process.env.ADMIN_EMAIL = 'imonikheprecious6@gmail.com';

  nodemailer.createTransport = (() =>
    ({
      verify: async () => true,
      sendMail: async (mailOptions: { to?: unknown; subject?: unknown; html?: unknown }) => {
        sentEmails.push({
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html,
        });
        return { messageId: `<msg-${sentEmails.length}@test>`, rejected: [] };
      },
    }) as unknown as ReturnType<typeof nodemailer.createTransport>) as typeof nodemailer.createTransport;

  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    if (String(url).startsWith('https://mock-upstash.upstash.io')) {
      const cmd = JSON.parse(String(init?.body || '[]')) as Array<string | number>;
      const op = cmd[0];

      if (op === 'SET' && cmd[3] === 'NX') {
        const key = String(cmd[1]);
        const value = String(cmd[2]);
        const ttlSeconds = Number(cmd[5] || 0);
        if (redisKv.has(key)) {
          return new Response(JSON.stringify({ result: null }), { status: 200 });
        }
        redisKv.set(key, { value, ttlSeconds });
        return new Response(JSON.stringify({ result: 'OK' }), { status: 200 });
      }

      if (op === 'SCAN') {
        const keys = Array.from(redisKv.keys()).filter((k) => k.startsWith('booking:slot:'));
        return new Response(JSON.stringify({ result: ['0', keys] }), { status: 200 });
      }

      if (op === 'MGET') {
        const vals = cmd.slice(1).map((k) => redisKv.get(String(k))?.value ?? null);
        return new Response(JSON.stringify({ result: vals }), { status: 200 });
      }

      if (op === 'EVAL') {
        const key = String(cmd[3]);
        const expected = String(cmd[4]);
        const current = redisKv.get(key);
        if (current && current.value === expected) {
          redisKv.delete(key);
          return new Response(JSON.stringify({ result: 1 }), { status: 200 });
        }
        return new Response(JSON.stringify({ result: 0 }), { status: 200 });
      }
    }
    return originalFetch(url, init);
  }) as typeof fetch;
}

function restoreMocks() {
  globalThis.fetch = originalFetch;
  nodemailer.createTransport = originalCreateTransport;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, originalEnv);
}

beforeEach(() => {
  installMocks();
});

afterEach(() => {
  restoreMocks();
});

test('isValidIsoCalendarDate validates YYYY-MM-DD format and real calendar dates including leap years', () => {
  assert.equal(isValidIsoCalendarDate('2026-11-30'), true);
  assert.equal(isValidIsoCalendarDate('2028-02-29'), true);
  assert.equal(isValidIsoCalendarDate('2026-02-29'), false);
  assert.equal(isValidIsoCalendarDate('2026-02-30'), false);
  assert.equal(isValidIsoCalendarDate('2026-13-01'), false);
  assert.equal(isValidIsoCalendarDate('Monday, Nov 30'), false);
});

test('rejects legacy un-yeared dates and past dates', async () => {
  const fixedNow = new Date('2026-11-24T12:00:00Z');
  assert.equal(getTodayUtcIsoDate(fixedNow), '2026-11-24');

  const legacyRes = await processBookingSubmission(
    {
      name: 'Alice Vance',
      email: 'alice@example.com',
      selectedDate: 'Monday, Nov 30',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(legacyRes.status, 400);

  const yesterdayRes = await processBookingSubmission(
    {
      name: 'Alice Vance',
      email: 'alice@example.com',
      selectedDate: '2026-11-23',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(yesterdayRes.status, 400);
  assert.match(String(yesterdayRes.body.error), /Past dates cannot be booked/);

  const pastYearRes = await processBookingSubmission(
    {
      name: 'Alice Vance',
      email: 'alice@example.com',
      selectedDate: '2025-11-30',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(pastYearRes.status, 400);
  assert.equal(redisKv.size, 0);
});

test('supports bookings on the same month/day across different years with distinct YYYY-MM-DD Redis keys and proper TTL', async () => {
  const fixedNow = new Date('2026-11-24T12:00:00Z');

  const res2026 = await processBookingSubmission(
    {
      name: 'Alice 2026',
      email: 'alice2026@example.com',
      selectedDate: '2026-11-30',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(res2026.status, 200);

  // Same month/day and time slot in 2027 must succeed independently
  const res2027 = await processBookingSubmission(
    {
      name: 'Bob 2027',
      email: 'bob2027@example.com',
      selectedDate: '2027-11-30',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(res2027.status, 200);

  // Redis keys must include YYYY-MM-DD
  const keys = Array.from(redisKv.keys()).sort();
  assert.deepEqual(keys, [
    'booking:slot:2026-11-30|10%3A00%20AM',
    'booking:slot:2027-11-30|10%3A00%20AM',
  ]);

  // 2027 booking TTL must exceed 365 days so it does not expire before the appointment
  const entry2027 = redisKv.get('booking:slot:2027-11-30|10%3A00%20AM');
  assert.ok(entry2027 && entry2027.ttlSeconds > 365 * 24 * 60 * 60);

  // Duplicate booking in 2027 must still be rejected with 409 SLOT_BOOKED
  const dup2027 = await processBookingSubmission(
    {
      name: 'Charlie 2027',
      email: 'charlie2027@example.com',
      selectedDate: '2027-11-30',
      selectedTime: '10:00 AM',
    },
    { now: fixedNow }
  );
  assert.equal(dup2027.status, 409);
  assert.equal(dup2027.body.code, 'SLOT_BOOKED');

  // Reopening calendar (/api/booked-slots) returns both ISO dates unambiguously
  const slotsRes = await bookedSlotsHandler(new Request('https://example.com/api/booked-slots'));
  assert.equal(slotsRes.status, 200);
  const slotsJson = (await slotsRes.json()) as {
    bookedSlots: Array<{ selectedDate: string; selectedTime: string }>;
  };
  assert.deepEqual(
    slotsJson.bookedSlots.map((s) => `${s.selectedDate}@${s.selectedTime}`).sort(),
    ['2026-11-30@10:00 AM', '2027-11-30@10:00 AM']
  );

  // Email templates must contain the unambiguous YYYY-MM-DD dates
  assert.equal(sentEmails.length, 4);
  assert.match(String(sentEmails[0].html), /2026-11-30/);
  assert.match(String(sentEmails[1].subject), /2026-11-30/);
  assert.match(String(sentEmails[2].html), /2027-11-30/);
  assert.match(String(sentEmails[3].subject), /2027-11-30/);
});

test('prevents concurrent double-booking and preserves another owner slot during rollback', async () => {
  // Use a future year-end date beyond today so Netlify handler works with real clock
  const futureDate = `${new Date().getUTCFullYear() + 1}-12-31`;

  const reqA = new Request('https://example.com/api/book-call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Customer A',
      email: 'a@example.com',
      selectedDate: futureDate,
      selectedTime: '02:00 PM',
    }),
  });
  const reqB = new Request('https://example.com/api/book-call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Customer B',
      email: 'b@example.com',
      selectedDate: futureDate,
      selectedTime: '02:00 PM',
    }),
  });

  const [resA, resB] = await Promise.all([bookCallHandler(reqA), bookCallHandler(reqB)]);
  assert.deepEqual([resA.status, resB.status].sort(), [200, 409]);

  // Simulate email failure and verify ownership-checked rollback leaves nothing dangling
  const failDate = `${new Date().getUTCFullYear() + 1}-12-30`;
  nodemailer.createTransport = (() =>
    ({
      verify: async () => true,
      sendMail: async () => {
        throw new Error('SMTP connection failed');
      },
    }) as unknown as ReturnType<typeof nodemailer.createTransport>) as typeof nodemailer.createTransport;

  const failRes = await bookCallHandler(
    new Request('https://example.com/api/book-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Customer Fail',
        email: 'fail@example.com',
        selectedDate: failDate,
        selectedTime: '03:00 PM',
      }),
    })
  );
  assert.equal(failRes.status, 500);
  assert.equal(redisKv.has(`booking:slot:${failDate}|03%3A00%20PM`), false);
  // Existing Customer A/B slot remains intact
  assert.equal(redisKv.has(`booking:slot:${futureDate}|02%3A00%20PM`), true);
});
