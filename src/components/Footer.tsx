import React from 'react';
import { Mail, MessageSquare, Instagram, Send, Calendar, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';
import { NavPage } from '../types';
import { CONTACT_INFO } from '../data/contactData';

interface FooterProps {
  onPageChange: (page: NavPage) => void;
  onOpenCalendly: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange, onOpenCalendly }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (page: NavPage) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-neutral-950 dark:bg-neutral-950 light:bg-stone-900 text-neutral-300 dark:text-neutral-300 light:text-stone-300 border-t border-neutral-800/80 dark:border-neutral-800 light:border-stone-800 overflow-hidden pt-16 pb-12 transition-colors duration-300">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Callout Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-900/80 border border-neutral-800/80 mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Over 5 Years of Experience</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-100 tracking-tight">
              Ready to elevate your business with exceptional web design?
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 font-normal">
              Let's craft a high-converting website and search engine strategy built specifically for your brand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenCalendly}
              id="footer-calendly-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-100 text-neutral-950 font-medium text-sm hover:bg-white transition-all shadow-md hover:scale-[1.02] focus:outline-none"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Book Discovery Call</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              id="footer-whatsapp-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-700 hover:border-neutral-600 font-medium text-sm transition-all focus:outline-none"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Navigation & Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-amber-500 text-xl">
                P
              </div>
              <span className="text-xl font-semibold text-neutral-100 tracking-tight">
                Precious Imonikhe
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Website Designer, SEO Specialist, and Digital Marketing Partner helping entrepreneurs, growing businesses, and agencies build confident online presences.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>Available Worldwide for Remote Projects & Consultancy</span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('home')} id="footer-nav-home" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} id="footer-nav-about" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  About Me
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} id="footer-nav-services" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('portfolio')} id="footer-nav-portfolio" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  Portfolio Work
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} id="footer-nav-contact" className="text-neutral-400 hover:text-amber-400 transition-colors">
                  Contact Me
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Services Offered */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Key Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>Website Design & Redesign</li>
              <li>WordPress & Elementor</li>
              <li>Webflow & Wix Studio</li>
              <li>Squarespace & Landing Pages</li>
              <li>Search Engine Optimization (SEO)</li>
              <li>Branding & Logo Design</li>
            </ul>
          </div>

          {/* Col 5: Direct Contact Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Connect Directly
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{CONTACT_INFO.email}</span>
              </a>

              <a
                href={CONTACT_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp Message</span>
              </a>

              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                <span>@haaiippee</span>
              </a>

              <a
                href={CONTACT_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-sky-400 transition-colors"
              >
                <Send className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Telegram (@haaiippee)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {currentYear} Precious Imonikhe. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Website Designer</span>
            <span>•</span>
            <span>SEO Specialist</span>
            <span>•</span>
            <span>Marketing Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
