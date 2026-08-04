import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowUpRight, CheckCircle2, Play } from 'lucide-react';

interface HeroSectionProps {
  badgeText?: string;
  title: string;
  titleAccent?: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  youtubeId?: string;
  primaryCtaText?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  highlights?: string[];
  imagePosition?: 'right' | 'left';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  badgeText,
  title,
  titleAccent,
  description,
  imageSrc,
  imageAlt = 'Precious Imonikhe Studio',
  youtubeId,
  primaryCtaText = 'Book Discovery Call',
  onPrimaryCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  highlights,
  imagePosition = 'right'
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-neutral-950 dark:bg-neutral-950 light:bg-stone-50 transition-colors duration-300">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-neutral-800/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
          imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`space-y-6 ${imagePosition === 'left' ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7'}`}
          >
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 dark:bg-neutral-900 light:bg-stone-200 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-amber-400 dark:text-amber-400 light:text-amber-600 text-xs font-medium tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{badgeText}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-100 dark:text-neutral-100 light:text-neutral-900 leading-[1.12]">
              {title}{' '}
              {titleAccent && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  {titleAccent}
                </span>
              )}
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed font-normal max-w-2xl">
              {description}
            </p>

            {highlights && highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {onPrimaryCtaClick && (
                <button
                  onClick={onPrimaryCtaClick}
                  id="hero-primary-cta-btn"
                  className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none"
                >
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-600 light:text-amber-400" />
                  <span>{primaryCtaText}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}

              {secondaryCtaText && onSecondaryCtaClick && (
                <button
                  onClick={onSecondaryCtaClick}
                  id="hero-secondary-cta-btn"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900/80 dark:bg-neutral-900 light:bg-stone-200 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 font-medium text-sm hover:border-neutral-700 dark:hover:border-neutral-700 transition-all duration-300 focus:outline-none"
                >
                  <span>{secondaryCtaText}</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Large Hero Media (Image or YouTube Video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative ${imagePosition === 'left' ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5'}`}
          >
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-neutral-800/80 to-neutral-900/60 dark:from-neutral-800/80 dark:to-neutral-900/60 light:from-stone-200 light:to-stone-300 border border-neutral-700/60 dark:border-neutral-700/80 light:border-stone-300 shadow-2xl overflow-hidden group">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[16/10] bg-neutral-950">
                {youtubeId ? (
                  isPlayingVideo ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title="Hero Intro Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      onClick={() => setIsPlayingVideo(true)}
                      className="relative w-full h-full cursor-pointer bg-gradient-to-br from-neutral-900 via-neutral-950 to-stone-900 flex flex-col items-center justify-center p-6 text-center group/play"
                    >
                      {imageSrc ? (
                        <>
                          <img
                            src={imageSrc}
                            alt={imageAlt}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/play:opacity-80 transition-opacity duration-500"
                          />
                          <div className="absolute inset-0 bg-neutral-950/40" />
                        </>
                      ) : null}

                      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/play:scale-110">
                        <Play className="w-8 h-8 sm:w-9 sm:h-9 ml-1 fill-neutral-950" />
                      </div>
                      <span className="relative z-10 mt-3 text-xs sm:text-sm font-semibold text-neutral-200 tracking-wide bg-neutral-950/70 px-3 py-1 rounded-full border border-neutral-800">
                        Watch Intro Video
                      </span>
                    </div>
                  )
                ) : (
                  <>
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-80" />
                  </>
                )}
              </div>

              {/* Decorative Subtle Accent Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-3 rounded-lg backdrop-blur-md bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-white/90 border border-neutral-800/90 dark:border-neutral-800 light:border-stone-300 flex items-center justify-between text-xs">
                <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-800 font-medium">
                  Precious Imonikhe Studio
                </span>
                <span className="text-amber-400 font-medium">
                  5+ Yrs Experience
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

