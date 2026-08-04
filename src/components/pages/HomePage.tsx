import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Play, CheckCircle2, Star, Sparkles, ShieldCheck, Layers, ArrowRight, Monitor, Search, Layout, MessageSquare, Quote, RefreshCw, Box, Code } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { VerifiedClientStories } from '../VerifiedClientStories';
import { PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import { SERVICES_LIST } from '../../data/servicesData';
import { WRITTEN_TESTIMONIALS, VIDEO_TESTIMONIALS } from '../../data/testimonialsData';
import { Project, VideoTestimonial, NavPage } from '../../types';

interface HomePageProps {
  onPageChange: (page: NavPage) => void;
  onSelectProject: (project: Project) => void;
  onSelectVideo: (video: VideoTestimonial) => void;
  onOpenCalendly: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPageChange,
  onSelectProject,
  onSelectVideo,
  onOpenCalendly,
}) => {
  const featuredProjects = PORTFOLIO_PROJECTS.slice(0, 3);
  const featuredServices = SERVICES_LIST.slice(0, 6);

  const processSteps = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We align on your business goals, target audience, brand positioning, and search engine objectives before writing a single line of code or drawing a pixel.'
    },
    {
      number: '02',
      title: 'UX Wireframing & Design',
      description: 'Crafting modern, bespoke user interfaces with clean typography, intuitive spatial hierarchy, and clear conversion paths for your visitors.'
    },
    {
      number: '03',
      title: 'Development & Technical SEO',
      description: 'Building your site on modern platforms like Webflow, Wix Studio, WordPress, or Squarespace with fast load times, responsive breakpoints, and search engine schema.'
    },
    {
      number: '04',
      title: 'Launch & Growth Partnership',
      description: 'Thorough pre-launch QA testing, domain deployment, Google Search Console indexing, and ongoing digital marketing support to ensure long-term success.'
    }
  ];

  const whyChooseMe = [
    {
      title: 'Over 5 Years of Experience',
      desc: 'Tested design principles, platform expertise, and deep search engine knowledge gained over half a decade of active client partnerships.'
    },
    {
      title: 'Direct Access to Me',
      desc: 'You work directly with Precious Imonikhe—no account managers, no communication delays, and no diluted design quality.'
    },
    {
      title: 'Design + SEO Alignment',
      desc: 'A beautiful website is useless if nobody finds it. I integrate search engine structure and conversion design into every build.'
    },
    {
      title: 'Honest & Transparent Communication',
      desc: 'Clear project milestones, realistic timelines, and believable storytelling built on real craftsmanship.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section with Intro Video */}
      <HeroSection
        badgeText="Website Designer & SEO Specialist • Over 5 Years Experience"
        title="Elevate Your Business With"
        titleAccent="Confident Digital Design & SEO."
        description="I partner with business owners, startups, entrepreneurs, and agencies to build high-converting websites and search engine strategies that command trust and drive growth."
        youtubeId="6ogIaQZsrsY"
        imageSrc="https://res.cloudinary.com/od2xp6v3/image/upload/v1785811284/Runaway_dint4h.png"
        imageAlt="Precious Imonikhe Studio - Introduction & Portfolio Showcase"
        primaryCtaText="Book Discovery Call"
        onPrimaryCtaClick={onOpenCalendly}
        secondaryCtaText="Explore Featured Work"
        onSecondaryCtaClick={() => onPageChange('portfolio')}
        highlights={[
          'Bespoke Web Design & Redesign',
          'Search Engine Optimization (SEO)',
          'Webflow, Wix Studio & WordPress',
          'Landing Pages & Conversion Strategy'
        ]}
      />

      {/* 2. Featured Work Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Selected Projects
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              Featured Case Studies
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-xl font-normal">
              A collection of bespoke web design, redesign, and SEO projects crafted for clients across architecture, coffee, financial wealth, and luxury services.
            </p>
          </div>

          <button
            onClick={() => onPageChange('portfolio')}
            id="view-all-projects-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 border border-neutral-800 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-neutral-700 text-sm font-medium transition-all"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-md"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-neutral-800">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-neutral-800/60 dark:border-neutral-800 light:border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Client: {project.client}
                  </span>
                  <button
                    onClick={() => onSelectProject(project)}
                    id={`home-project-detail-${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors focus:outline-none"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Services Preview Section */}
      <section className="bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-stone-100 py-16 border-y border-neutral-800/60 dark:border-neutral-800 light:border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Core Expertise
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              Tailored Digital Services
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal">
              Specialized website design, platform development, and search engine optimization crafted specifically to meet business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 hover:border-neutral-700 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  {service.iconName === 'Layout' && <Layout className="w-5 h-5" />}
                  {service.iconName === 'RefreshCw' && <RefreshCw className="w-5 h-5" />}
                  {service.iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                  {service.iconName === 'Code' && <Code className="w-5 h-5" />}
                  {service.iconName === 'Box' && <Box className="w-5 h-5" />}
                  {service.iconName === 'Layers' && <Layers className="w-5 h-5" />}
                  {service.iconName === 'Search' && <Search className="w-5 h-5" />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-900 dark:border-neutral-900 light:border-stone-100">
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    {service.deliverables.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onPageChange('services')}
              id="view-all-services-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 border border-neutral-800 font-medium text-sm hover:border-neutral-700 transition-colors"
            >
              <span>View All 13 Services & Platforms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. My Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Structured Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
            My Design & Development Process
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal">
            A reliable 4-step collaborative methodology focused on clarity, design quality, and predictable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 relative"
            >
              <span className="text-3xl font-bold text-amber-500/80 tracking-tight block">
                {step.number}
              </span>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Why Work With Me Section */}
      <section className="bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-stone-100 py-16 border-y border-neutral-800/60 dark:border-neutral-800 light:border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                Partner Principles
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight leading-tight">
                Why Clients Trust Precious Imonikhe
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal leading-relaxed">
                I do not treat websites as mere online brochures. I build them as tailored digital flagships designed to reflect your brand's authority, drive conversions, and establish organic search dominance.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onPageChange('about')}
                  id="why-work-about-btn"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white font-medium text-sm transition-all"
                >
                  <span>Read My Story & Philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseMe.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-white border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Client Written Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Client Words
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
            What Business Partners Say
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal">
            Real feedback from business owners, agency directors, and practice leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WRITTEN_TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {item.projectType}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-neutral-800 dark:border-neutral-800 light:border-stone-200">
                <img
                  src={item.avatar}
                  alt={item.clientName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Dedicated VERIFIED CLIENT STORIES & VIDEO TESTIMONIALS */}
      <VerifiedClientStories onSelectVideo={onSelectVideo} />

    </div>
  );
};
