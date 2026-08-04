import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, Calendar, Mail, Sparkles, Volume2 } from 'lucide-react';
import { VIDEO_TESTIMONIALS } from '../data/testimonialsData';
import { VideoTestimonial } from '../types';

interface VerifiedClientStoriesProps {
  onOpenCalendly: () => void;
}

export const VerifiedClientStories: React.FC<VerifiedClientStoriesProps> = ({ onOpenCalendly }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial>(VIDEO_TESTIMONIALS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectVideo = (video: VideoTestimonial) => {
    if (selectedVideo.id !== video.id) {
      setSelectedVideo(video);
      setIsPlaying(false);
    }
  };

  return (
    <section className="bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-stone-100 py-16 sm:py-24 border-y border-neutral-800/60 dark:border-neutral-800 light:border-stone-200 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real Results & Direct Feedback</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight leading-tight">
            Verified Client Stories
          </h2>
          
          <p className="text-base sm:text-lg text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-normal leading-relaxed">
            Hear directly from business owners and professionals I've worked with on real website projects.
          </p>
        </div>

        {/* Two Column Interactive Video Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (65% / lg:col-span-8) - Featured Video Frame */}
          <div className="lg:col-span-8 w-full">
            <div className="relative rounded-2xl bg-neutral-950 dark:bg-neutral-950 light:bg-stone-900 border border-neutral-800/90 dark:border-neutral-800 light:border-stone-800 shadow-2xl overflow-hidden group">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVideo.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="relative aspect-[16/9] w-full bg-neutral-950 flex items-center justify-center overflow-hidden"
                >
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`${selectedVideo.clientName} Video Testimonial`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* Premium Dark Placeholder Poster */
                    <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-stone-950 p-6 sm:p-10 flex flex-col justify-between select-none">
                      
                      {/* Geometric Minimal Pattern Accent */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

                      {/* Header Badge */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-amber-400 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span>Verified Client Story</span>
                        </span>

                        <span className="text-xs text-neutral-400 font-medium px-2.5 py-1 rounded-md bg-neutral-900/80 border border-neutral-800">
                          {selectedVideo.projectType}
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-4">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="group/btn relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-amber-500/20 focus:outline-none"
                          aria-label={`Play video story from ${selectedVideo.clientName}`}
                        >
                          <span className="absolute -inset-2 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-neutral-950" />
                        </button>
                        <p className="text-xs sm:text-sm font-medium text-neutral-300 tracking-wide">
                          Click to Watch Full Video Story
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-100 flex items-center gap-2">
                            <span>{selectedVideo.clientName}</span>
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-400">
                            {selectedVideo.role} • <span className="text-amber-400/90">{selectedVideo.company}</span>
                          </p>
                        </div>

                        <div className="text-xs text-neutral-400 italic max-w-sm font-normal line-clamp-1">
                          "{selectedVideo.description}"
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* Right Column (35% / lg:col-span-4) - Testimonial Selection List */}
          <div className="lg:col-span-4 w-full space-y-3">
            <div className="px-1 text-xs font-semibold text-neutral-400 dark:text-neutral-400 light:text-neutral-600 uppercase tracking-wider flex items-center justify-between">
              <span>Select Video Story</span>
              <span className="text-amber-400">{VIDEO_TESTIMONIALS.length} Testimonials</span>
            </div>

            <div className="space-y-3">
              {VIDEO_TESTIMONIALS.map((item) => {
                const isActive = selectedVideo.id === item.id;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectVideo(item)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      isActive
                        ? 'bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-white border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-stone-200/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Play Badge */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-amber-500 text-neutral-950' 
                          : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                      }`}>
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>

                      {/* Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                            isActive ? 'text-amber-400' : 'text-neutral-400'
                          }`}>
                            {item.projectType}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 dark:bg-neutral-900 light:bg-stone-300 text-neutral-400 font-mono">
                            {item.duration}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 truncate">
                          {item.clientName}
                        </h4>

                        <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 truncate">
                          {item.company}
                        </p>

                        <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 line-clamp-2 pt-1 font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
