import {
  ADMIN_EMAIL,
  MailerError,
  escapeHtml,
  getMailConfig,
  sanitizeHeaderValue,
  sendTransactionalPair,
} from './mailer';
import {
  BookingStoreError,
  BookedSlotRecord,
  SlotReservation,
  listBookedSlots,
  releaseBookingSlotIfOwned,
  reserveBookingSlot,
} from './bookingStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface ServiceResult<T = Record<string, unknown>> {
  status: number;
  body: T;
}

export function isValidIsoCalendarDate(dateStr: string): boolean {
  const match = ISO_DATE_REGEX.exec(dateStr);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

export function getTodayUtcIsoDate(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function fetchBookedSlotsResult(): Promise<
  ServiceResult<{ bookedSlots: BookedSlotRecord[] } | { error: string }>
> {
  try {
    const bookedSlots = await listBookedSlots();
    return {
      status: 200,
      body: { bookedSlots },
    };
  } catch (err: unknown) {
    if (err instanceof BookingStoreError) {
      console.error('[BOOKED SLOTS STORE ERROR]', err.message);
      return {
        status: err.statusCode,
        body: { error: err.userMessage },
      };
    }
    console.error('[BOOKED SLOTS UNEXPECTED ERROR]', err);
    return {
      status: 500,
      body: { error: 'Unable to load available booking slots right now.' },
    };
  }
}

export async function processBookingSubmission(
  rawBodyInput: unknown,
  options?: { now?: Date }
): Promise<ServiceResult> {
  let reservation: SlotReservation | null = null;

  try {
    const rawBody =
      rawBodyInput && typeof rawBodyInput === 'object'
        ? (rawBodyInput as Record<string, unknown>)
        : {};

    const name = typeof rawBody.name === 'string' ? rawBody.name.trim() : '';
    const email = typeof rawBody.email === 'string' ? rawBody.email.trim() : '';
    const phone = typeof rawBody.phone === 'string' ? rawBody.phone.trim() : '';
    const selectedDate =
      typeof rawBody.selectedDate === 'string' ? rawBody.selectedDate.trim() : '';
    const selectedTime =
      typeof rawBody.selectedTime === 'string' ? rawBody.selectedTime.trim() : '';
    const projectType =
      typeof rawBody.projectType === 'string' ? rawBody.projectType.trim() : 'Website Design';
    const notes = typeof rawBody.notes === 'string' ? rawBody.notes.trim() : '';

    if (!name || name.length < 2) {
      return {
        status: 400,
        body: { error: 'Please enter your full name (at least 2 characters).' },
      };
    }
    if (name.length > 120) {
      return {
        status: 400,
        body: { error: 'Name must be 120 characters or fewer.' },
      };
    }
    if (!email || !EMAIL_REGEX.test(email) || /[\r\n]/.test(email)) {
      return {
        status: 400,
        body: { error: 'Please enter a valid email address.' },
      };
    }
    if (!selectedDate || !isValidIsoCalendarDate(selectedDate)) {
      return {
        status: 400,
        body: { error: 'Please choose a valid booking date (YYYY-MM-DD).' },
      };
    }

    const now = options?.now ?? new Date();
    const todayUtcIso = getTodayUtcIsoDate(now);
    if (selectedDate < todayUtcIso) {
      return {
        status: 400,
        body: { error: 'Past dates cannot be booked. Please select an upcoming date.' },
      };
    }

    if (!selectedTime || selectedTime.length > 30 || /[\r\n]/.test(selectedTime)) {
      return {
        status: 400,
        body: { error: 'Please choose a valid time slot.' },
      };
    }

    // Atomically reserve the slot using Redis SET NX before sending emails
    const lockResult = await reserveBookingSlot({
      selectedDate,
      selectedTime,
      bookedAt: now.toISOString(),
      now,
    });

    if (!lockResult.acquired) {
      return {
        status: 409,
        body: {
          code: 'SLOT_BOOKED',
          error: 'This time slot is no longer available. Please select another time slot or date.',
        },
      };
    }

    reservation = lockResult.reservation;

    const submissionDate = now.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const submissionTime = now.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    const config = getMailConfig();
    const fromAddress = config.user || 'no-reply@preciousimonikhe.com';
    const headerSafeName = sanitizeHeaderValue(name);
    const headerSafeDate = sanitizeHeaderValue(selectedDate);
    const headerSafeTime = sanitizeHeaderValue(selectedTime);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeDate = escapeHtml(selectedDate);
    const safeTime = escapeHtml(selectedTime);
    const safeProjectType = escapeHtml(projectType || 'Website Design');
    const safeNotes = escapeHtml(notes || 'None provided');

    // Email 1: Notification to Precious Imonikhe (imonikheprecious6@gmail.com)
    const adminMailOptions = {
      from: `"Precious Imonikhe Studio" <${fromAddress}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `📅 New Discovery Call Booking — ${headerSafeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #fafafa;">
          <h2 style="color: #d97706; margin-top: 0;">📅 New Discovery Call Booking</h2>
          <p>A new discovery call has been booked on your portfolio website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Client Name:</td><td>${safeName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Client Email:</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Booking Date:</td><td><strong style="color: #d97706;">${safeDate}</strong></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Booking Time:</td><td><strong style="color: #d97706;">${safeTime}</strong></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${safePhone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Service Needed:</td><td>${safeProjectType}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Additional Notes:</td><td>${safeNotes}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date Submitted:</td><td>${submissionDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Time Submitted:</td><td>${submissionTime}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Tip: Reply directly to this email to contact <strong>${safeName}</strong> (${safeEmail}).</p>
        </div>
      `,
    };

    // Email 2: Confirmation email to Client
    const clientMailOptions = {
      from: `"Precious Imonikhe" <${fromAddress}>`,
      to: email,
      subject: `Discovery Call Confirmed — Precious Imonikhe (${headerSafeDate} at ${headerSafeTime})`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #d97706; margin-top: 0;">Your Discovery Call is Confirmed!</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Thank you for scheduling a discovery call. Your appointment has been received and confirmed.</p>
          
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin: 0 0 8px 0; color: #92400e;">Booking Summary:</h3>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${safeDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${safeTime}</p>
            <p style="margin: 4px 0;"><strong>Service:</strong> ${safeProjectType}</p>
          </div>

          <p>I look forward to discussing your project and custom strategy.</p>
          
          <p>If you need to reschedule or ask any questions before our call, reply directly to this email or reach out via:</p>
          <ul>
            <li>Email: <a href="mailto:imonikheprecious6@gmail.com">imonikheprecious6@gmail.com</a></li>
            <li>Telegram: @haaiippee</li>
            <li>Instagram: @haaiippee</li>
          </ul>

          <p style="margin-top: 24px;">Warm regards,<br /><strong>Precious Imonikhe</strong><br />Website Designer & SEO Specialist</p>
        </div>
      `,
    };

    const delivery = await sendTransactionalPair({
      route: '/api/book-call',
      adminMail: adminMailOptions,
      clientMail: clientMailOptions,
    });

    // Delivery succeeded — keep the reservation
    reservation = null;

    console.log(
      `[BOOKING SUCCESS] (${delivery.mode}) Notification sent to ${ADMIN_EMAIL} and confirmation sent to ${email}`
    );

    return {
      status: 200,
      body: {
        success: true,
        transportMode: delivery.mode,
        message: 'Booking request processed and confirmation emails sent successfully.',
        details: { name, email, selectedDate, selectedTime },
      },
    };
  } catch (err: unknown) {
    if (reservation) {
      try {
        const released = await releaseBookingSlotIfOwned(reservation);
        console.log('[BOOKING ROLLBACK]', { released });
      } catch (rollbackErr) {
        console.error('[BOOKING ROLLBACK ERROR]', rollbackErr);
      }
    }

    if (err instanceof BookingStoreError) {
      console.error('[BOOKING STORE ERROR]', err.message);
      return {
        status: err.statusCode,
        body: { error: err.userMessage },
      };
    }

    if (err instanceof MailerError) {
      return {
        status: err.statusCode,
        body: { error: err.userMessage },
      };
    }

    console.error('[BOOKING UNEXPECTED ERROR]', err);
    return {
      status: 500,
      body: {
        error:
          'We could not complete your booking email right now. Please try again in a moment or contact Precious directly via WhatsApp or email.',
      },
    };
  }
}
