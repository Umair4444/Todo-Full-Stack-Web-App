"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ChatGPTStyleChatInterface from '@/components/ChatGPTStyleChatInterface';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ChatGPTStyleChatInterface />
      </MainLayout>
    </ProtectedRoute>
  );
}