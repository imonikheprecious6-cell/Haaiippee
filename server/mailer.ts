import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'imonikheprecious6@gmail.com').trim();

export type MailStage = 'config' | 'verify' | 'send';

export class MailerError extends Error {
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly stage: MailStage;
  public readonly code?: string;
  public readonly responseCode?: number;

  constructor(params: {
    message: string;
    userMessage: string;
    statusCode: number;
    stage: MailStage;
    code?: string;
    responseCode?: number;
  }) {
    super(params.message);
    this.name = 'MailerError';
    this.statusCode = params.statusCode;
    this.userMessage = params.userMessage;
    this.stage = params.stage;
    this.code = params.code;
    this.responseCode = params.responseCode;
  }
}

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sanitizeHeaderValue = (value: string): string =>
  value.replace(/[\r\n]+/g, ' ').trim();

export const getMailConfig = () => {
  const rawHost = process.env.SMTP_HOST?.trim() || '';
  const user = process.env.SMTP_USER?.trim() || '';
  const pass = process.env.SMTP_PASS?.trim() || '';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secureEnv = process.env.SMTP_SECURE?.trim();
  const secure =
    secureEnv !== undefined && secureEnv !== ''
      ? secureEnv.toLowerCase() === 'true'
      : port === 465;

  // Infer Gmail SMTP host only if SMTP_USER is a Gmail address and SMTP_HOST wasn't set
  const host =
    rawHost || (user.toLowerCase().endsWith('@gmail.com') && pass ? 'smtp.gmail.com' : '');

  const missingVariables: string[] = [];
  if (!host) missingVariables.push('SMTP_HOST');
  if (!user) missingVariables.push('SMTP_USER');
  if (!pass) missingVariables.push('SMTP_PASS');

  return {
    host,
    port,
    secure,
    user,
    pass,
    isSmtpConfigured: Boolean(host && user && pass),
    envStatus: {
      SMTP_HOST: Boolean(rawHost),
      SMTP_HOST_EFFECTIVE: host || null,
      SMTP_PORT: port,
      SMTP_PORT_EXPLICIT: Boolean(process.env.SMTP_PORT?.trim()),
      SMTP_SECURE: secure,
      SMTP_SECURE_EXPLICIT: Boolean(secureEnv),
      SMTP_USER: Boolean(user),
      SMTP_PASS: Boolean(pass),
      ADMIN_EMAIL: Boolean(process.env.ADMIN_EMAIL?.trim()),
    },
    missingVariables,
  };
};

export function classifyNodemailerError(
  err: unknown,
  stage: MailStage,
  context?: { route?: string; emailType?: 'admin_notification' | 'client_confirmation' }
): MailerError {
  if (err instanceof MailerError) {
    return err;
  }

  const anyErr = (err && typeof err === 'object' ? err : {}) as {
    code?: string;
    responseCode?: number;
    command?: string;
    response?: string;
    message?: string;
  };

  const code = anyErr.code || '';
  const responseCode = typeof anyErr.responseCode === 'number' ? anyErr.responseCode : undefined;
  const rawMessage = anyErr.message || String(err || 'Unknown email error');
  const lowerMsg = rawMessage.toLowerCase();

  console.error('[MAIL ERROR]', {
    timestamp: new Date().toISOString(),
    route: context?.route || 'unknown',
    emailType: context?.emailType || 'n/a',
    stage,
    code: code || undefined,
    responseCode,
    command: anyErr.command || undefined,
    message: rawMessage,
  });

  if (
    code === 'EAUTH' ||
    responseCode === 535 ||
    responseCode === 534 ||
    responseCode === 530 ||
    lowerMsg.includes('invalid login') ||
    lowerMsg.includes('authentication')
  ) {
    return new MailerError({
      message: rawMessage,
      userMessage:
        'Our email service is temporarily unable to authenticate. Please contact Precious directly via email or WhatsApp while this is resolved.',
      statusCode: 503,
      stage,
      code,
      responseCode,
    });
  }

  if (
    code === 'ETIMEDOUT' ||
    code === 'ESOCKET' ||
    code === 'ECONNECTION' ||
    code === 'ECONNREFUSED' ||
    code === 'ECONNRESET' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    lowerMsg.includes('timeout')
  ) {
    return new MailerError({
      message: rawMessage,
      userMessage:
        'Unable to connect to the email server right now. Please try again in a moment or reach out via direct email or WhatsApp.',
      statusCode: 503,
      stage,
      code,
      responseCode,
    });
  }

  if (
    code === 'EENVELOPE' ||
    code === 'EMESSAGE' ||
    responseCode === 550 ||
    responseCode === 551 ||
    responseCode === 552 ||
    responseCode === 553 ||
    responseCode === 554
  ) {
    const isClientConfirmation = context?.emailType === 'client_confirmation';
    return new MailerError({
      message: rawMessage,
      userMessage: isClientConfirmation
        ? 'Your inquiry could not be confirmed at the email address entered. Please double-check your email address and try again.'
        : 'The email server rejected the message envelope. Please verify your email details and try again.',
      statusCode: 400,
      stage,
      code,
      responseCode,
    });
  }

  if (responseCode === 421 || responseCode === 450 || responseCode === 451 || responseCode === 452) {
    return new MailerError({
      message: rawMessage,
      userMessage:
        'The email server is temporarily busy. Please wait a moment and try sending again.',
      statusCode: 503,
      stage,
      code,
      responseCode,
    });
  }

  return new MailerError({
    message: rawMessage,
    userMessage:
      'We could not deliver your email right now. Please try again shortly or reach out directly via email or WhatsApp.',
    statusCode: 500,
    stage,
    code,
    responseCode,
  });
}

export async function createVerifiedTransporter(
  route = 'startup',
  options?: { verify?: boolean }
) {
  const config = getMailConfig();
  const shouldVerify = options?.verify !== false;
  const isServerlessRuntime = Boolean(
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (config.isSmtpConfigured) {
    const transportOptions: SMTPTransport.Options = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 7000,
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(transportOptions);

    if (shouldVerify) {
      try {
        await transporter.verify();
      } catch (err) {
        throw classifyNodemailerError(err, 'verify', { route });
      }
    }

    return { transporter, mode: 'smtp' as const, config };
  }

  if (isServerlessRuntime) {
    console.error(
      `[MAIL CONFIG] (${route}) Missing SMTP variables (${config.missingVariables.join(', ')}) in serverless runtime.`
    );
    throw new MailerError({
      message: 'SMTP environment variables are not configured.',
      userMessage:
        'Our email service is currently unavailable. Please contact Precious directly via email or WhatsApp.',
      statusCode: 503,
      stage: 'config',
    });
  }

  console.warn(
    `[MAIL CONFIG] (${route}) Missing SMTP variables (${config.missingVariables.join(', ')}). Falling back to jsonTransport (emails will NOT be delivered externally).`
  );

  const transporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  return { transporter, mode: 'jsonTransport' as const, config };
}

async function sendSingleEmail(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
  context: {
    route: string;
    mode: 'smtp' | 'jsonTransport';
    emailType: 'admin_notification' | 'client_confirmation';
  }
) {
  try {
    const info = await transporter.sendMail(mailOptions);

    const rejected = Array.isArray((info as { rejected?: unknown[] })?.rejected)
      ? ((info as { rejected: unknown[] }).rejected)
      : [];

    if (rejected.length > 0) {
      console.error('[MAIL RECIPIENT REJECTED]', {
        timestamp: new Date().toISOString(),
        route: context.route,
        emailType: context.emailType,
        rejected,
      });
      throw new MailerError({
        message: `SMTP server rejected recipient(s): ${rejected.map(String).join(', ')}`,
        userMessage:
          context.emailType === 'client_confirmation'
            ? 'The email address you entered could not receive confirmation emails. Please double-check your email address and try again.'
            : 'Unable to deliver the notification email right now. Please try again or contact Precious directly.',
        statusCode: context.emailType === 'client_confirmation' ? 400 : 502,
        stage: 'send',
        code: 'EENVELOPE',
      });
    }

    console.log('[MAIL SENT]', {
      route: context.route,
      mode: context.mode,
      emailType: context.emailType,
      messageId: info?.messageId || null,
    });

    return info;
  } catch (err) {
    throw classifyNodemailerError(err, 'send', {
      route: context.route,
      emailType: context.emailType,
    });
  }
}

export async function sendTransactionalPair(params: {
  route: string;
  adminMail: nodemailer.SendMailOptions;
  clientMail: nodemailer.SendMailOptions;
}) {
  const { transporter, mode, config } = await createVerifiedTransporter(params.route, {
    verify: false,
  });

  const adminInfo = await sendSingleEmail(transporter, params.adminMail, {
    route: params.route,
    mode,
    emailType: 'admin_notification',
  });

  try {
    const clientInfo = await sendSingleEmail(transporter, params.clientMail, {
      route: params.route,
      mode,
      emailType: 'client_confirmation',
    });

    return {
      mode,
      config,
      adminMessageId: adminInfo?.messageId || null,
      clientMessageId: clientInfo?.messageId || null,
    };
  } catch (err) {
    const classified = classifyNodemailerError(err, 'send', {
      route: params.route,
      emailType: 'client_confirmation',
    });
    console.error('[MAIL PARTIAL DELIVERY FAILURE]', {
      timestamp: new Date().toISOString(),
      route: params.route,
      adminNotificationSent: true,
      adminMessageId: adminInfo?.messageId || null,
      clientConfirmationFailed: true,
      reason: classified.message,
    });
    throw classified;
  }
}
