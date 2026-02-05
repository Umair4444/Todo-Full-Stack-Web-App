"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RedesignedChatInterface from '@/components/RedesignedChatInterface';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
     
        <RedesignedChatInterface height="calc(100vh - 200px)" />
      </div>
    </ProtectedRoute>
  );
}