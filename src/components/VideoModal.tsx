import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Quote } from 'lucide-react';
import { VideoTestimonial } from '../types';

interface VideoModalProps {
  video: VideoTestimonial | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-neutral-900 dark:bg-neutral-900 light:bg-stone-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto text-neutral-100"
        >
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
            <div>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                Video Testimonial
              </span>
              <h3 className="text-base font-semibold text-neutral-100">
                {video.clientName} — {video.company}
              </h3>
            </div>

            <button
              onClick={onClose}
              id="close-video-modal-btn"
              className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors focus:outline-none"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={video.thumbnail}
                  alt={video.clientName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-neutral-950/40" />
                <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 ml-1 fill-neutral-950" />
                  </div>
                  <p className="text-sm font-medium text-neutral-200">
                    Client Video Testimonial Preview ({video.duration})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Testimonial Details */}
          <div className="p-6 bg-neutral-900 space-y-3">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <div>
                <p className="text-base text-neutral-200 font-normal italic leading-relaxed">
                  {video.quote}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-300">{video.clientName}</span>
                  <span>•</span>
                  <span>{video.role}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">{video.projectType}</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
