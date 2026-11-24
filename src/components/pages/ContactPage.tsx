import React, { useRef, useState } from 'react';
import { Mail, MessageSquare, Instagram, Send, Calendar, CheckCircle2, Globe, Clock, Loader2, AlertCircle } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { CONTACT_INFO } from '../../data/contactData';

interface ContactPageProps {
  onOpenCalendly: () => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenCalendly }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Website Design');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const errorBannerRef = useRef<HTMLDivElement | null>(null);

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    const errors: FieldErrors = {};

    if (!trimmedName) {
      errors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 120) {
      errors.name = 'Name must be 120 characters or fewer.';
    }

    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. you@company.com).';
    }

    if (trimmedPhone) {
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      if (!/^[+\d\s().-]{7,25}$/.test(trimmedPhone) || digitsOnly.length < 7) {
        errors.phone = 'Please enter a valid phone number (at least 7 digits) or leave this blank.';
      }
    }

    if (!trimmedMessage) {
      errors.message = 'Please share a brief overview of your project.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Please write at least 10 characters so we understand your inquiry.';
    } else if (trimmedMessage.length > 5000) {
      errors.message = 'Message must be 5,000 characters or fewer.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      payload: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        service: service.trim() || 'Website Design',
        message: trimmedMessage,
      },
    };
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const { isValid, errors, payload } = validateForm();
    if (!isValid) {
      setFieldErrors(errors);
      setErrorMessage('Please review the highlighted fields below before sending your inquiry.');

      if (errors.name) nameInputRef.current?.focus();
      else if (errors.email) emailInputRef.current?.focus();
      else if (errors.phone) phoneInputRef.current?.focus();
      else if (errors.message) messageInputRef.current?.focus();
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const rawText = await res.text();
      let data: {
        success?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      } | null = null;

      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = null;
        }
      }

      if (!res.ok || !data?.success || data?.error) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        let friendlyMessage = data?.error;
        if (!friendlyMessage) {
          if (res.status >= 500) {
            friendlyMessage =
              'We could not deliver your email right now due to a server issue. Please try again in a moment or email Precious directly.';
          } else if (res.status === 400) {
            friendlyMessage = 'Please check your details and make sure all required fields are valid.';
          } else {
            friendlyMessage =
              'Something went wrong while sending your message. Please try again or reach out directly via email or WhatsApp.';
          }
        }

        setErrorMessage(friendlyMessage);
        requestAnimationFrame(() => {
          errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        return;
      }

      setName(payload.name);
      setEmail(payload.email);
      setPhone(payload.phone);
      setMessage(payload.message);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMessage(
          'Sending your inquiry took longer than expected. Please check your connection and try again, or contact Precious directly.'
        );
      } else {
        setErrorMessage(
          'Unable to reach the server to send your email. Please check your internet connection and try again, or use direct email / WhatsApp.'
        );
      }
      requestAnimationFrame(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'What is your typical project timeline?',
      a: 'Most custom website design and redesign projects take between 2 to 4 weeks depending on the page count, custom functionality, and content readiness.'
    },
    {
      q: 'Will I work directly with you?',
      a: 'Yes, 100%. You work directly with Precious Imonikhe from initial discovery call to final deployment. There are no account managers or outsourced junior teams.'
    },
    {
      q: 'Do you help with search engine optimization (SEO)?',
      a: 'Absolutely. Every website I build includes foundational on-page SEO, optimized metadata, clean heading hierarchies, image compression, fast loading, and search console indexing.'
    },
    {
      q: 'Which web platform is best for my business?',
      a: 'We will evaluate your specific goals during our discovery call. Webflow is ideal for bespoke visual design and CMS power; Wix Studio is great for responsive flexibility; WordPress fits complex custom fields; Squarespace excels for boutique simple sites.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <HeroSection
        badgeText="Get In Touch"
        title="Let's Discuss Your Next"
        titleAccent="Website & SEO Project."
        description="Have a question, need a custom proposal, or ready to start? Reach out via email, WhatsApp, Instagram, Telegram, or book a direct discovery call."
        imageSrc="https://res.cloudinary.com/od2xp6v3/image/upload/v1785811432/web_mockup_03_neilot.png"
        imageAlt="Web Mockup Studio Showcase"
        primaryCtaText="Book Discovery Call"
        onPrimaryCtaClick={onOpenCalendly}
        secondaryCtaText="Send Direct Email"
        onSecondaryCtaClick={() => window.location.href = `mailto:${CONTACT_INFO.email}`}
        highlights={[
          'Fast Response Within 24 Hours',
          'Free Initial Project Consultation',
          'Direct Contact via WhatsApp & Email',
          'Flexible Global Timezone Scheduling'
        ]}
      />

      {/* 2. Primary Contact Methods Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Email Card */}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            id="contact-email-card"
            className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 hover:border-amber-500/50 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Email Me</span>
              <p className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 truncate mt-1">
                {CONTACT_INFO.email}
              </p>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href={CONTACT_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-whatsapp-card"
            className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 hover:border-emerald-500/50 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">WhatsApp Chat</span>
              <p className="text-sm font-semibold text-emerald-400 truncate mt-1">
                {CONTACT_INFO.whatsappNumber}
              </p>
            </div>
          </a>

          {/* Telegram Card */}
          <a
            href={CONTACT_INFO.telegram}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-telegram-card"
            className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 hover:border-sky-500/50 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Telegram</span>
              <p className="text-sm font-semibold text-sky-400 truncate mt-1">
                @haaiippee
              </p>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-instagram-card"
            className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 hover:border-pink-500/50 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Instagram DM</span>
              <p className="text-sm font-semibold text-pink-400 truncate mt-1">
                @haaiippee
              </p>
            </div>
          </a>

        </div>
      </section>

      {/* 3. Contact Form & Direct Booking Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Details & Calendly trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Direct Communication
            </div>
            <h2 className="text-3xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              Ready to start your project?
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-normal">
              Whether you need a new website designed from scratch, an existing website redesigned, or search engine optimization for your brand, I am here to assist.
            </p>

            <div className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 space-y-4">
              <div className="flex items-center space-x-3 text-amber-400">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-semibold">Book a Calendly Discovery Call</span>
              </div>
              <p className="text-xs text-neutral-400">
                Prefer to lock in a dedicated 30-minute time slot on my calendar right now?
              </p>
              <button
                onClick={onOpenCalendly}
                id="contact-page-calendly-btn"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all shadow-md"
              >
                Schedule Discovery Call
              </button>
            </div>

            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Working with clients globally</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Typical response time: Under 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300">
              
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-100">
                    Message Sent & Email Delivered!
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-amber-400">{name}</span>. Your inquiry has been sent to <span className="font-semibold text-amber-400">imonikheprecious6@gmail.com</span> and a receipt was sent to <span className="font-semibold text-amber-400">{email}</span>. Expect a response within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setService('Website Design');
                      setMessage('');
                      setErrorMessage(null);
                      setFieldErrors({});
                    }}
                    className="px-6 py-2.5 rounded-full bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    Send a Direct Inquiry
                  </h3>

                  {errorMessage && (
                    <div
                      ref={errorBannerRef}
                      role="alert"
                      id="contact-form-error-banner"
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 dark:text-red-300 light:text-red-700 text-xs space-y-2"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{errorMessage}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pl-6 text-[11px]">
                        <a
                          href={`mailto:${CONTACT_INFO.email}`}
                          className="underline hover:text-amber-400 transition-colors"
                        >
                          Email {CONTACT_INFO.email}
                        </a>
                        <span aria-hidden="true">·</span>
                        <a
                          href={CONTACT_INFO.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-amber-400 transition-colors"
                        >
                          Message on WhatsApp
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name-input" className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name-input"
                        type="text"
                        required
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        placeholder="Precious Imonikhe"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          clearFieldError('name');
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border text-sm focus:outline-none ${
                          fieldErrors.name
                            ? 'border-red-500/70 focus:border-red-400'
                            : 'border-neutral-800 dark:border-neutral-800 light:border-stone-300 focus:border-amber-400'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p id="contact-name-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 light:text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email-input" className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        ref={emailInputRef}
                        id="contact-email-input"
                        type="email"
                        required
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError('email');
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border text-sm focus:outline-none ${
                          fieldErrors.email
                            ? 'border-red-500/70 focus:border-red-400'
                            : 'border-neutral-800 dark:border-neutral-800 light:border-stone-300 focus:border-amber-400'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p id="contact-email-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 light:text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-phone-input" className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="contact-phone-input"
                      type="tel"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError('phone');
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border text-sm focus:outline-none ${
                        fieldErrors.phone
                          ? 'border-red-500/70 focus:border-red-400'
                          : 'border-neutral-800 dark:border-neutral-800 light:border-stone-300 focus:border-amber-400'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p id="contact-phone-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 light:text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-service-select" className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Service Interested In
                    </label>
                    <select
                      id="contact-service-select"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400 text-neutral-200 dark:text-neutral-200 light:text-neutral-800"
                    >
                      <option value="Website Design">Website Design</option>
                      <option value="Website Redesign">Website Redesign</option>
                      <option value="WordPress / Elementor">WordPress & Elementor Development</option>
                      <option value="Webflow / Wix Studio">Webflow or Wix Studio Build</option>
                      <option value="Landing Page">Landing Page Development</option>
                      <option value="SEO Strategy">Search Engine Optimization (SEO)</option>
                      <option value="Branding & Logo Design">Branding & Logo Design</option>
                      <option value="Social Media Advertising">Social Media Advertising</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message-input" className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Project Message / Overview *
                    </label>
                    <textarea
                      ref={messageInputRef}
                      id="contact-message-input"
                      required
                      rows={4}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                      placeholder="Describe your goals, current website URL, or project requirements..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        clearFieldError('message');
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border text-sm focus:outline-none ${
                        fieldErrors.message
                          ? 'border-red-500/70 focus:border-red-400'
                          : 'border-neutral-800 dark:border-neutral-800 light:border-stone-300 focus:border-amber-400'
                      }`}
                    />
                    {fieldErrors.message && (
                      <p id="contact-message-error" className="mt-1.5 text-xs text-red-500 dark:text-red-400 light:text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white font-medium text-sm transition-all shadow-md hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Inquiry Email...</span>
                      </>
                    ) : (
                      <span>Send Inquiry Message</span>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Clear answers regarding project collaboration, timelines, and deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-2"
            >
              <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
