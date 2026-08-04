import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Monitor, Smartphone, Layers, Search, CheckCircle2 } from 'lucide-react';
import { HeroSection } from '../HeroSection';
import { PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import { Project, NavPage } from '../../types';

interface PortfolioPageProps {
  onSelectProject: (project: Project) => void;
  onOpenCalendly: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onSelectProject, onOpenCalendly }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Website Design',
    'Website Redesign',
    'Wix Studio',
    'Landing Pages',
    'SEO & Design'
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter(project => {
    if (selectedCategory === 'All') return true;
    return project.category === selectedCategory;
  });

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <HeroSection
        badgeText="Featured Work & Case Studies"
        title="Bespoke Digital Showcase &"
        titleAccent="Project Gallery."
        description="Explore recent website design, redesign, and SEO projects. Every project represents a tailored design strategy built for client impact and search engine performance."
        imageSrc="/src/assets/images/portfolio_hero_mockup_1785814687532.jpg"
        imageAlt="Portfolio Device Mockups Collage"
        primaryCtaText="Book Discovery Call"
        onPrimaryCtaClick={onOpenCalendly}
        secondaryCtaText="Explore Projects Below"
        onSecondaryCtaClick={() => {
          const gallery = document.getElementById('portfolio-gallery');
          gallery?.scrollIntoView({ behavior: 'smooth' });
        }}
        highlights={[
          'Desktop, Mobile & Tablet Responsive Mockups',
          'In-Depth Project Process & Tool Details',
          'Authentic Design Architecture & UX Solutions',
          'Search Engine Structured Layouts'
        ]}
      />

      {/* 2. Portfolio Gallery Section */}
      <section id="portfolio-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-28">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`portfolio-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                  : 'bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-neutral-700 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800/80 dark:border-neutral-800 light:border-stone-300 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-lg"
            >
              {/* Mockup Preview */}
              <div
                onClick={() => onSelectProject(project)}
                className="relative aspect-[16/10] overflow-hidden bg-neutral-950 cursor-pointer"
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-neutral-800">
                    {project.category}
                  </span>
                </div>

                {/* Hover CTA prompt */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-5 py-2.5 rounded-full bg-amber-500 text-neutral-950 text-xs font-semibold shadow-xl flex items-center gap-1.5">
                    <span>View Case Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Client: <strong className="text-neutral-300">{project.client}</strong></span>
                  </div>

                  <h3
                    onClick={() => onSelectProject(project)}
                    className="text-2xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 group-hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Tools Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.toolsUsed.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-950 border border-neutral-800 text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-neutral-800 dark:border-neutral-800 light:border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Role: {project.myRole.split(',')[0]}
                  </span>

                  <button
                    onClick={() => onSelectProject(project)}
                    id={`portfolio-case-btn-${project.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-amber-400 text-xs font-medium border border-neutral-800 transition-colors focus:outline-none"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </section>

    </div>
  );
};
