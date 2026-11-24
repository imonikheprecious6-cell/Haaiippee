import {
  ADMIN_EMAIL,
  MailerError,
  escapeHtml,
  getMailConfig,
  sanitizeHeaderValue,
  sendTransactionalPair,
} from './mailer';
import type { ServiceResult } from './bookingService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function processContactSubmission(rawBodyInput: unknown): Promise<ServiceResult> {
  try {
    const rawBody =
      rawBodyInput && typeof rawBodyInput === 'object'
        ? (rawBodyInput as Record<string, unknown>)
        : {};

    const name = typeof rawBody.name === 'string' ? rawBody.name.trim() : '';
    const email = typeof rawBody.email === 'string' ? rawBody.email.trim() : '';
    const phone = typeof rawBody.phone === 'string' ? rawBody.phone.trim() : '';
    const service =
      typeof rawBody.service === 'string' ? rawBody.service.trim() : 'General Inquiry';
    const message = typeof rawBody.message === 'string' ? rawBody.message.trim() : '';

    const fieldErrors: Record<string, string> = {};

    if (!name) {
      fieldErrors.name = 'Please enter your name.';
    } else if (name.length < 2) {
      fieldErrors.name = 'Name must be at least 2 characters.';
    } else if (name.length > 120) {
      fieldErrors.name = 'Name must be 120 characters or fewer.';
    }

    if (!email) {
      fieldErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(email) || /[\r\n]/.test(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }

    if (phone) {
      const digitsOnly = phone.replace(/\D/g, '');
      if (!/^[+\d\s().-]{7,25}$/.test(phone) || digitsOnly.length < 7) {
        fieldErrors.phone = 'Please enter a valid phone number or leave it blank.';
      }
    }

    if (!message) {
      fieldErrors.message = 'Please enter your project message.';
    } else if (message.length < 10) {
      fieldErrors.message = 'Please provide at least 10 characters describing your inquiry.';
    } else if (message.length > 5000) {
      fieldErrors.message = 'Message must be 5,000 characters or fewer.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      const firstError = Object.values(fieldErrors)[0];
      return {
        status: 400,
        body: {
          error: firstError,
          fieldErrors,
        },
      };
    }

    const now = new Date();
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
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeService = escapeHtml(service || 'General Inquiry');
    const safeServiceLabel = escapeHtml(service || 'website');
    const safeMessage = escapeHtml(message);

    // Email 1: Notification to Precious Imonikhe (imonikheprecious6@gmail.com)
    const adminMailOptions = {
      from: `"Portfolio Contact Form" <${fromAddress}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `🔔 New Website Enquiry — ${headerSafeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #fafafa;">
          <h2 style="color: #d97706; margin-top: 0;">🔔 New Website Enquiry Received</h2>
          <p>Someone has submitted an inquiry on your portfolio website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${safeName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${safePhone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Subject / Service:</td><td>${safeService}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Full Message:</td><td style="white-space: pre-wrap;">${safeMessage}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date Submitted:</td><td>${submissionDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Time Submitted:</td><td>${submissionTime}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Tip: Reply directly to this email to respond to <strong>${safeName}</strong> (${safeEmail}).</p>
        </div>
      `,
    };

    // Email 2: Automatic confirmation email to the Sender
    const senderMailOptions = {
      from: `"Precious Imonikhe" <${fromAddress}>`,
      to: email,
      subject: `We've Received Your Message`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #d97706; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Thank you for getting in touch regarding your <strong>${safeServiceLabel}</strong> project. I have received your message and will review your details shortly.</p>
          
          <div style="background: #f4f4f5; border-left: 4px solid #d97706; border-radius: 4px; padding: 12px 16px; margin: 20px 0; font-size: 14px;">
            <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${safeMessage}"</p>
          </div>

          <p>You can expect a response within <strong>24 hours</strong>. If your request is urgent, feel free to connect directly via:</p>
          <ul>
            <li>Email: <a href="mailto:imonikheprecious6@gmail.com">imonikheprecious6@gmail.com</a></li>
            <li>Telegram: @haaiippee</li>
            <li>Instagram: @haaiippee</li>
          </ul>

          <p style="margin-top: 24px;">Best regards,<br /><strong>Precious Imonikhe</strong><br />Website Designer & SEO Specialist</p>
        </div>
      `,
    };

    const delivery = await sendTransactionalPair({
      route: '/api/contact',
      adminMail: adminMailOptions,
      clientMail: senderMailOptions,
    });

    console.log(
      `[CONTACT SUCCESS] (${delivery.mode}) Inquiry notification sent to ${ADMIN_EMAIL} and receipt sent to ${email}`
    );

    return {
      status: 200,
      body: {
        success: true,
        transportMode: delivery.mode,
        message: 'Contact form message received and confirmation email sent.',
        details: { name, email, service, submissionDate, submissionTime },
      },
    };
  } catch (err: unknown) {
    if (err instanceof MailerError) {
      return {
        status: err.statusCode,
        body: { error: err.userMessage },
      };
    }
    console.error('[CONTACT UNEXPECTED ERROR]', err);
    return {
      status: 500,
      body: {
        error:
          'We could not deliver your inquiry email right now. Please try again in a moment or contact Precious directly via email or WhatsApp.',
      },
    };
  }
}
