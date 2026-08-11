import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'imonikheprecious6@gmail.com';

// In-memory store for booked time slots to prevent double-booking
interface BookedSlot {
  selectedDate: string;
  selectedTime: string;
  bookedAt: string;
}

const bookedSlots: BookedSlot[] = [];

// Transporter configuration: uses SMTP env vars if present, or JSON/console transport
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Fallback jsonTransport for dev/staging logging
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

// 0. API Route: Fetch booked time slots
app.get('/api/booked-slots', (req, res) => {
  res.json({ bookedSlots });
});

// 1. API Route: Book Discovery Call
app.post('/api/book-call', async (req, res) => {
  try {
    const { name, email, phone, selectedDate, selectedTime, projectType, notes } = req.body;

    if (!name || !email || !selectedDate || !selectedTime) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    // Double-booking prevention check
    const isAlreadyBooked = bookedSlots.some(
      (slot) => slot.selectedDate === selectedDate && slot.selectedTime === selectedTime
    );

    if (isAlreadyBooked) {
      return res.status(400).json({
        error: 'This time slot is no longer available. Please select another time slot or date.',
      });
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

    const transporter = await createTransporter();

    // Email 1: Notification to Precious Imonikhe (imonikheprecious6@gmail.com)
    const adminMailOptions = {
      from: `"Precious Imonikhe Studio" <${process.env.SMTP_USER || 'no-reply@preciousimonikhe.com'}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `📅 New Discovery Call Booking — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #fafafa;">
          <h2 style="color: #d97706; margin-top: 0;">📅 New Discovery Call Booking</h2>
          <p>A new discovery call has been booked on your portfolio website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Client Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Client Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Booking Date:</td><td><strong style="color: #d97706;">${selectedDate}</strong></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Booking Time:</td><td><strong style="color: #d97706;">${selectedTime}</strong></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Service Needed:</td><td>${projectType || 'Website Design'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Additional Notes:</td><td>${notes || 'None provided'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date Submitted:</td><td>${submissionDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Time Submitted:</td><td>${submissionTime}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Tip: Reply directly to this email to contact <strong>${name}</strong> (${email}).</p>
        </div>
      `,
    };

    // Email 2: Confirmation email to Client
    const clientMailOptions = {
      from: `"Precious Imonikhe" <${process.env.SMTP_USER || 'no-reply@preciousimonikhe.com'}>`,
      to: email,
      subject: `Discovery Call Confirmed — Precious Imonikhe (${selectedDate} at ${selectedTime})`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #d97706; margin-top: 0;">Your Discovery Call is Confirmed!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for scheduling a discovery call. Your appointment has been received and confirmed.</p>
          
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin: 0 0 8px 0; color: #92400e;">Booking Summary:</h3>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${selectedDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${selectedTime}</p>
            <p style="margin: 4px 0;"><strong>Service:</strong> ${projectType || 'Website Design'}</p>
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

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);

    // Save slot as booked
    bookedSlots.push({
      selectedDate,
      selectedTime,
      bookedAt: now.toISOString(),
    });

    console.log(`[BOOKING SUCCESS] Notification sent to ${ADMIN_EMAIL} and confirmation sent to ${email}`);

    return res.json({
      success: true,
      message: 'Booking request processed and confirmation emails sent successfully.',
      details: { name, email, selectedDate, selectedTime },
    });
  } catch (err: any) {
    console.error('Error in /api/book-call:', err);
    return res.status(500).json({ error: 'Failed to process booking email.', message: err?.message });
  }
});

// 2. API Route: Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required contact form fields.' });
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

    const transporter = await createTransporter();

    // Email 1: Notification to Precious Imonikhe (imonikheprecious6@gmail.com)
    const adminMailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER || 'no-reply@preciousimonikhe.com'}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `🔔 New Website Enquiry — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #fafafa;">
          <h2 style="color: #d97706; margin-top: 0;">🔔 New Website Enquiry Received</h2>
          <p>Someone has submitted an inquiry on your portfolio website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Subject / Service:</td><td>${service || 'General Inquiry'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Full Message:</td><td style="white-space: pre-wrap;">${message}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date Submitted:</td><td>${submissionDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Time Submitted:</td><td>${submissionTime}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Tip: Reply directly to this email to respond to <strong>${name}</strong> (${email}).</p>
        </div>
      `,
    };

    // Email 2: Automatic confirmation email to the Sender
    const senderMailOptions = {
      from: `"Precious Imonikhe" <${process.env.SMTP_USER || 'no-reply@preciousimonikhe.com'}>`,
      to: email,
      subject: `We've Received Your Message`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #d97706; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for getting in touch regarding your <strong>${service || 'website'}</strong> project. I have received your message and will review your details shortly.</p>
          
          <div style="background: #f4f4f5; border-left: 4px solid #d97706; border-radius: 4px; padding: 12px 16px; margin: 20px 0; font-size: 14px;">
            <p style="margin: 0; font-style: italic;">"${message}"</p>
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

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(senderMailOptions);

    console.log(`[CONTACT SUCCESS] Inquiry notification sent to ${ADMIN_EMAIL} and receipt sent to ${email}`);

    return res.json({
      success: true,
      message: 'Contact form message received and confirmation email sent.',
      details: { name, email, service, submissionDate, submissionTime },
    });
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ error: 'Failed to process contact email.', message: err?.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
