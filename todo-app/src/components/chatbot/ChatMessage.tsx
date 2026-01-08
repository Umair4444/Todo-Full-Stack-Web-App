// Chat message component
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

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
          'max-w-[80%] rounded-2xl p-4 relative',
          sender === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none border'
        )}
      >
        <div className="flex items-start space-x-2">
          {sender === 'bot' && (
            <div className="flex-shrink-0 pt-0.5">
              <div className="p-1 bg-primary/10 rounded-full">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}
          <div>
            <p className="whitespace-pre-wrap">{text}</p>
            <p className={`text-xs mt-2 ${sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {sender === 'user' && (
            <div className="flex-shrink-0 pt-0.5">
              <div className="p-1 bg-primary-foreground/10 rounded-full">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};