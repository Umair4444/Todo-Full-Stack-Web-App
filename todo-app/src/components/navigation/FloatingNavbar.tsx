// Floating navbar component with glass-bar effect that hides/shows based on scroll direction
'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { NavigationLinks } from './NavigationLinks';

export const FloatingNavbar: React.FC = () => {
  const scrollDirection = useScrollDirection();

  return (
    <AnimatePresence>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 glass-effect backdrop-blur-md transition-all duration-300 ${
          scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              TodoApp
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile, shown on larger screens */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationLinks />
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {/* Mobile menu button - shown on small screens */}
            <button className="md:hidden p-2 rounded-md hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - shown on small screens */}
        <div className="md:hidden mt-4">
          <NavigationLinks orientation="vertical" />
        </div>
      </motion.header>
    </AnimatePresence>
  );
};