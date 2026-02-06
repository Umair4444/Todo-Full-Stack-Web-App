"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ChatGPTStyleChatInterface } from "@/components/ai-todo/ChatGPTStyleChatInterface";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto px-4 py-8">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <ChatGPTStyleChatInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
