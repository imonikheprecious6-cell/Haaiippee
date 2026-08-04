import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Award, Users, Search, Code, Palette, Globe, ArrowRight } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { NavPage } from '../../types';

interface AboutPageProps {
  onPageChange: (page: NavPage) => void;
  onOpenCalendly: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onPageChange, onOpenCalendly }) => {
  const coreValues = [
    {
      title: 'Intentional Design',
      desc: 'Every element, typographic choice, and spacing decision is purposeful—never added for arbitrary decoration.'
    },
    {
      title: 'Honest Storytelling',
      desc: 'I communicate your brand value authentically without relying on exaggerated claims or hype.'
    },
    {
      title: 'Search Engine Visibility',
      desc: 'Design and SEO work hand-in-hand to ensure your website is discovered by high-intent clients.'
    },
    {
      title: 'Reliable Partnership',
      desc: 'Direct communication, clear milestones, and ongoing support for long-term growth.'
    }
  ];

  const platformSkills = [
    'Webflow',
    'Wix Studio',
    'WordPress',
    'Elementor Pro',
    'Squarespace',
    'Landing Pages',
    'Technical SEO',
    'Local SEO Strategy',
    'Branding & Logos',
    'Figma UI/UX',
    'Meta Social Ads',
    'Social Management'
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. About Hero Section */}
      <HeroSection
        badgeText="About Precious Imonikhe"
        title="Website Designer, SEO Specialist &"
        titleAccent="Digital Marketing Partner."
        description="With over 5 years of hands-on experience, I help businesses, entrepreneurs, and agencies establish confident online presences through strategic web design and search engine optimization."
        imageSrc="https://res.cloudinary.com/od2xp6v3/image/upload/v1785811456/Wix_Shopify_Squarespace_and_WordPress_Designer_zziz0k.png"
        imageAlt="Wix, Shopify, Squarespace and WordPress Designer Precious Imonikhe"
        primaryCtaText="Book Discovery Call"
        onPrimaryCtaClick={onOpenCalendly}
        secondaryCtaText="Explore Services"
        onSecondaryCtaClick={() => onPageChange('services')}
        highlights={[
          'Over 5 Years of Active Design Experience',
          'Bespoke Web Design & Technical SEO',
          'Direct One-on-One Client Collaboration',
          'Multi-Platform Expertise (Webflow, WordPress, Wix)'
        ]}
      />

      {/* 2. Personal Story & Background */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              My Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight leading-tight">
              Crafting Purposeful Digital Experiences for Over 5 Years
            </h2>

            <div className="space-y-4 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 text-sm sm:text-base leading-relaxed">
              <p>
                Hello, I’m <strong className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-semibold">Precious Imonikhe</strong>. Over the past five years, I’ve dedicated my career to mastering the intersection of web design, search engine optimization, and digital brand strategy.
              </p>
              <p>
                My clients range from growing startups and professional service firms to boutique agencies and local business owners. What unites them all is the need for a trusted digital partner who understands how to blend visual elegance with real-world usability and search visibility.
              </p>
              <p>
                I believe that a truly successful website must be built with intention. It should communicate confidence through clean layout, strong typography, and thoughtful interactions—not through aggressive popups or exaggerated claims.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-6">
              <div>
                <span className="block text-2xl font-bold text-amber-400">5+ Years</span>
                <span className="text-xs text-neutral-400">Industry Experience</span>
              </div>
              <div className="h-8 w-[1px] bg-neutral-800" />
              <div>
                <span className="block text-2xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">100% Direct</span>
                <span className="text-xs text-neutral-400">No Account Middlemen</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-8 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4">
              <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                My Role as Your Digital Partner
              </h3>
              <ul className="space-y-3 text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Website Designer:</strong> Creating bespoke, responsive layouts that align seamlessly with your brand identity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>SEO Specialist:</strong> Structuring page headings, metadata, site speed, and search schema so your site gets found organically.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Marketing Partner:</strong> Advising on customer journeys, landing page conversion flows, and social advertising campaigns.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values */}
      <section className="bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-stone-100 py-16 border-y border-neutral-800/60 dark:border-neutral-800 light:border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Guiding Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              Design & Business Philosophy
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal">
              The foundational standards that shape every client relationship and digital deliverable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-white border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Platform & Technical Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
            Platform & Skillset Expertise
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Versatile development across major content management systems and visual web builders.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {platformSkills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full text-xs font-medium bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 border border-neutral-800 dark:border-neutral-800 light:border-stone-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
};
