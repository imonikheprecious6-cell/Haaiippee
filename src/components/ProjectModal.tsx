import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Monitor, Smartphone, Tablet, Layers, ShieldCheck, Wrench } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenCalendly: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenCalendly }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 dark:bg-neutral-900 light:bg-stone-50 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 rounded-2xl shadow-2xl text-neutral-100 dark:text-neutral-100 light:text-neutral-900 z-10 my-auto"
        >
          
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-stone-100/90 backdrop-blur-md border-b border-neutral-800 dark:border-neutral-800 light:border-stone-300">
            <div>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {project.category}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                {project.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              id="close-project-modal-btn"
              className="p-2 rounded-full bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-10">
            
            {/* Hero Banner Mockup */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-stone-300 aspect-[16/9] shadow-lg">
              <img
                src={project.heroImage}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider">Client</p>
                  <p className="text-sm font-medium text-neutral-100">{project.client}</p>
                </div>
              </div>
            </div>

            {/* Overview & Core Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-stone-100 border border-neutral-800 dark:border-neutral-800 light:border-stone-200">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Project Overview
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed font-normal">
                  {project.overview}
                </p>
              </div>

              <div className="space-y-3 pt-4 md:pt-0 md:border-l md:border-neutral-800 dark:md:border-neutral-800 light:md:border-stone-300 md:pl-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    My Role
                  </h4>
                  <p className="text-sm font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-800 mt-1">
                    {project.myRole}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tools Used</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsUsed.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 border border-neutral-700/60 dark:border-neutral-700 light:border-stone-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Goal */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Client Goal
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                {project.clientGoal}
              </p>
            </div>

            {/* Challenges & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-stone-100 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 space-y-2">
                <h4 className="text-sm font-semibold text-rose-400 dark:text-rose-400 light:text-rose-600 flex items-center gap-2">
                  <span>The Challenge</span>
                </h4>
                <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                  {project.challenges}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-stone-100 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 space-y-2">
                <h4 className="text-sm font-semibold text-emerald-400 dark:text-emerald-400 light:text-emerald-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Solution</span>
                </h4>
                <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Design Process */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Design Process
              </h3>
              <div className="space-y-2.5">
                {project.designProcess.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-lg bg-neutral-950/30 dark:bg-neutral-950/30 light:bg-stone-100 border border-neutral-800/60 dark:border-neutral-800 light:border-stone-200"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 pt-0.5">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsive Device Showcase Mockups */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                Responsive Device Showcase
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop view */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    <span>Desktop Interface</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-stone-300 aspect-[16/10] bg-neutral-950 shadow-md">
                    <img
                      src={project.desktopMockup}
                      alt={`${project.title} Desktop View`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Mobile & Tablet views */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Mobile & Tablet Layout</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-stone-300 aspect-[16/10] bg-neutral-950 shadow-md">
                    <img
                      src={project.mobileMockup}
                      alt={`${project.title} Mobile View`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  Image Gallery & Final Design Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-stone-300 aspect-[4/3] bg-neutral-950"
                    >
                      <img
                        src={img}
                        alt={`${project.title} gallery detail ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom CTA */}
            <div className="pt-6 border-t border-neutral-800 dark:border-neutral-800 light:border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                  Need a similar website for your business?
                </h4>
                <p className="text-xs text-neutral-400">
                  Let's discuss your custom requirements, timeline, and strategy.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCalendly();
                }}
                id="modal-discovery-call-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-sm transition-all shadow-md focus:outline-none"
              >
                Book Discovery Call
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
