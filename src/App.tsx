import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { ContactPage } from './components/pages/ContactPage';

import { ProjectModal } from './components/ProjectModal';
import { VideoModal } from './components/VideoModal';
import { CalendlyModal } from './components/CalendlyModal';

import { NavPage, Project, VideoTestimonial } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState<boolean>(false);

  // Read URL hash on initial load if available
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as NavPage;
      if (['home', 'about', 'services', 'portfolio', 'contact'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handlePageChange = (page: NavPage) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neutral-950 dark:bg-neutral-950 light:bg-stone-50 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 transition-colors duration-300 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
        
        {/* Sleek Custom Interactive Cursor */}
        <CustomCursor />

        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onOpenCalendly={() => setIsCalendlyOpen(true)}
        />

        {/* Main Content View Container with smooth page transition */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentPage === 'home' && (
                <HomePage
                  onPageChange={handlePageChange}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onSelectVideo={(vid) => setSelectedVideo(vid)}
                  onOpenCalendly={() => setIsCalendlyOpen(true)}
                />
              )}

              {currentPage === 'about' && (
                <AboutPage
                  onPageChange={handlePageChange}
                  onOpenCalendly={() => setIsCalendlyOpen(true)}
                />
              )}

              {currentPage === 'services' && (
                <ServicesPage
                  onPageChange={handlePageChange}
                  onOpenCalendly={() => setIsCalendlyOpen(true)}
                />
              )}

              {currentPage === 'portfolio' && (
                <PortfolioPage
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onOpenCalendly={() => setIsCalendlyOpen(true)}
                />
              )}

              {currentPage === 'contact' && (
                <ContactPage
                  onOpenCalendly={() => setIsCalendlyOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer
          onPageChange={handlePageChange}
          onOpenCalendly={() => setIsCalendlyOpen(true)}
        />

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenCalendly={() => {
            setSelectedProject(null);
            setIsCalendlyOpen(true);
          }}
        />

        {/* Video Testimonial Modal */}
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />

        {/* Calendly Booking Modal */}
        <CalendlyModal
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
        />

      </div>
    </ThemeProvider>
  );
}
