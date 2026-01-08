// Floating chatbot widget
'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50 bg-primary hover:bg-primary/90"
          aria-label="Open chatbot"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};