// Floating chatbot widget
'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Bot, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';
import { MobileChatWindow } from './MobileChatWindow';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Check if the device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Handle scroll for showing/hiding the button
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when scrolling up or at top of page
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Initial check
    checkIsMobile();

    // Add event listeners
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {isOpen && isMobile ? (
        <MobileChatWindow onClose={() => setIsOpen(false)} />
      ) : isOpen ? (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="group relative rounded-full p-5 shadow-lg z-50 bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 hover:from-slate-600 hover:via-gray-700 hover:to-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Open chatbot"
            size="icon"
          >
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
              Need help?
            </div>
          </Button>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full opacity-30 blur-xl bg-gradient-to-br from-slate-700 to-slate-900"></div>
        </div>
      )}
    </>
  );
};