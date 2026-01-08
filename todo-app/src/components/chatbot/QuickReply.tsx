// Quick reply component for chatbot
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickReplyProps {
  text: string;
  onClick: () => void;
}

export const QuickReply: React.FC<QuickReplyProps> = ({ text, onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="rounded-full text-xs px-3 py-1.5 h-auto hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={`Quick reply: ${text}`}
    >
      {text}
    </Button>
  );
};