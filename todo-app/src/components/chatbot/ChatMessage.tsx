// Chat message component
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  text, 
  sender, 
  timestamp 
}) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3',
          sender === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-muted-foreground rounded-bl-none'
        )}
      >
        <p>{text}</p>
        <p className={`text-xs mt-1 ${sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};