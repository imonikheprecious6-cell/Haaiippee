import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Layout, Search, Sparkles, Box, Layers, Monitor, Grid, Code, Palette, Share2, Target, RefreshCw } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { SERVICES_LIST } from '../../data/servicesData';
import { NavPage, ServiceItem } from '../../types';

interface ServicesPageProps {
  onPageChange: (page: NavPage) => void;
  onOpenCalendly: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onPageChange, onOpenCalendly }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'design' | 'platform' | 'marketing'>('all');

  const filteredServices = SERVICES_LIST.filter(service => {
    if (activeFilter === 'all') return true;
    return service.category === activeFilter;
  });

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Layout': return <Layout className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Box': return <Box className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Grid': return <Grid className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Share2': return <Share2 className="w-5 h-5" />;
      case 'Target': return <Target className="w-5 h-5" />;
      default: return <Layout className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <HeroSection
        badgeText="Services & Platform Expertise"
        title="Comprehensive Digital Solutions for"
        titleAccent="Growing Brands & Businesses."
        description="From bespoke website design and platform development to technical SEO and strategic social advertising, I offer dedicated solutions engineered to elevate your brand."
        imageSrc="https://res.cloudinary.com/od2xp6v3/image/upload/v1785811300/Anchor_myhcxi.png"
        imageAlt="Anchor Digital Solutions & Web Design Portfolio"
        primaryCtaText="Book Discovery Call"
        onPrimaryCtaClick={onOpenCalendly}
        secondaryCtaText="View Portfolio"
        onSecondaryCtaClick={() => onPageChange('portfolio')}
        highlights={[
          'Website Design & Complete Redesign',
          'WordPress, Elementor, Webflow, Wix Studio, Squarespace',
          'Search Engine Optimization (SEO)',
          'Branding, Landing Pages & Social Media Marketing'
        ]}
      />

      {/* 2. Services Grid & Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All 13 Services' },
            { id: 'design', label: 'Website & Visual Design' },
            { id: 'platform', label: 'CMS & Platform Development' },
            { id: 'marketing', label: 'SEO & Digital Marketing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              id={`service-tab-${tab.id}`}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                  : 'bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-neutral-700 border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-5 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-md group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.platforms && (
                    <div className="flex flex-wrap gap-1">
                      {service.platforms.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-amber-400 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-neutral-800/60">
                <button
                  onClick={onOpenCalendly}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium transition-colors"
                >
                  <span>Discuss {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </section>

    </div>
  );
};
