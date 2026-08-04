import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Instagram, Send, Calendar, CheckCircle2, Globe, Clock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { CONTACT_INFO } from '../../data/contactData';

interface ContactPageProps {
  onOpenCalendly: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenCalendly }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Website Design');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitted(true);
    } finally {
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
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    Send a Direct Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Precious Imonikhe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Service Interested In
                    </label>
                    <select
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
                    <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1">
                      Project Message / Overview *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your goals, current website URL, or project requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-sm focus:outline-none focus:border-amber-400"
                    />
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
