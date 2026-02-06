"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AiTodoChatInterface } from "@/components/ai-todo/AiTodoChatInterface";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto px-4 py-8">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <AiTodoChatInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
