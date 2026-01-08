// Notification component using Sonner
'use client';

import React from 'react';
import { Toaster } from 'sonner';

export const Notification: React.FC = () => {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-background border border-border rounded-md shadow-lg',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          error: 'bg-destructive text-destructive-foreground',
          success: 'bg-success text-success-foreground',
          warning: 'bg-warning text-warning-foreground',
          info: 'bg-primary text-primary-foreground',
        },
      }}
    />
  );
};