// Reusable layout component with header, main content area, and footer
import React from 'react';
import { FloatingNavbar } from '../navigation/FloatingNavbar';
import { Footer } from '../navigation/Footer';
import { ChatbotWidget } from '../chatbot/ChatbotWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating Navbar */}
      <FloatingNavbar />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-16"> {/* Add padding to account for fixed navbar */}
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};