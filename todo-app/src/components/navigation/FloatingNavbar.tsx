// Floating navbar component with glass-bar effect that hides/shows based on scroll direction
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { ThemeToggle } from "../theme/ThemeToggle";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { NavigationLinks } from "./NavigationLinks";
import AuthNavigation from "../auth/AuthNavigation";

export const FloatingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.header
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl glass-effect backdrop-blur-md border border-accent/20 shadow-xl transition-all duration-300 max-w-lg md:max-w-3xl lg:max-w-4xl w-full mx-auto ${
            // On small screens, always show (no scroll effect)
            // On large screens, hide when scrolling down, show when scrolling up
            (scrollDirection === "down"
              ? "lg:opacity-0 -translate-y-40"
              : "lg:opacity-100 translate-y-0")
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-blue-500">
                <div className="h-6 w-6 text-white">📋</div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                {process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'}
              </span>
            </Link>

            {/* Navigation Links - Hidden on mobile, shown on larger screens */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavigationLinks />
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <AuthNavigation />

              {/* Mobile menu button - shown on small screens */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>

      {/* Full-screen mobile menu overlay - appears when menu is open */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="p-8 rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the menu
            >
              <NavigationLinks orientation="vertical" onCloseMenu={closeMobileMenu} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
