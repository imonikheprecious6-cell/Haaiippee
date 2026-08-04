import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Calendar, Menu, X, ArrowUpRight } from 'lucide-react';
import { NavPage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentPage: NavPage;
  onPageChange: (page: NavPage) => void;
  onOpenCalendly: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, onOpenCalendly }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: NavPage) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/80 dark:bg-neutral-950/85 light:bg-stone-50/85 border-b border-neutral-800/60 dark:border-neutral-800/80 light:border-stone-200/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center space-x-3 text-left focus:outline-none"
          id="brand-logo-btn"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-neutral-800 to-neutral-700 dark:from-neutral-900 dark:to-neutral-800 light:from-stone-200 light:to-stone-300 border border-neutral-700/60 dark:border-neutral-700/80 light:border-stone-300 flex items-center justify-center font-semibold text-amber-500 text-lg shadow-sm group-hover:border-amber-500/50 transition-colors">
            P
          </div>
          <div>
            <span className="block text-base font-medium tracking-tight text-neutral-100 dark:text-neutral-100 light:text-neutral-900 group-hover:text-amber-400 dark:group-hover:text-amber-400 transition-colors">
              Precious Imonikhe
            </span>
            <span className="block text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 tracking-wide font-normal">
              Website Designer & SEO Specialist
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-neutral-900/60 dark:bg-neutral-900/70 light:bg-stone-100/80 p-1.5 rounded-full border border-neutral-800/80 dark:border-neutral-800 light:border-stone-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`nav-link-${item.id}`}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none ${
                  isActive
                    ? 'text-neutral-100 dark:text-neutral-100 light:text-neutral-900'
                    : 'text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-neutral-200 dark:hover:text-neutral-200 light:hover:text-neutral-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-neutral-800 dark:bg-neutral-800 light:bg-white rounded-full shadow-sm border border-neutral-700/60 dark:border-neutral-700/80 light:border-stone-300"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2.5 rounded-full bg-neutral-900/80 dark:bg-neutral-900 light:bg-stone-100 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:text-amber-400 dark:hover:text-amber-400 transition-all duration-200 hover:border-neutral-700 focus:outline-none"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Book Discovery Call CTA */}
          <button
            onClick={onOpenCalendly}
            id="book-discovery-call-nav-btn"
            className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-100 dark:to-neutral-200 light:from-neutral-900 light:to-neutral-800 text-neutral-950 dark:text-neutral-950 light:text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none"
          >
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-600 light:text-amber-400" />
            <span>Book Discovery Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleTheme}
            id="mobile-theme-toggle-btn"
            className="p-2 rounded-full bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 border border-neutral-800 text-neutral-300 dark:text-neutral-300 light:text-neutral-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="p-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-900 light:bg-stone-200 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 border border-neutral-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-neutral-800/80 bg-neutral-950/95 dark:bg-neutral-950/95 light:bg-stone-100/95 px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`mobile-nav-${item.id}`}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-neutral-900 dark:bg-neutral-900 light:bg-white text-amber-400 dark:text-amber-400 light:text-amber-600 border border-neutral-800'
                      : 'text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentPage === item.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-800 dark:border-neutral-800 light:border-stone-300">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCalendly();
                }}
                id="mobile-book-call-btn"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-colors shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Discovery Call</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
