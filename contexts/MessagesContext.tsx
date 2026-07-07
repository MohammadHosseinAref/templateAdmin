'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Message, MessagesContextValue } from '@/types/messages';
import { SAMPLE_MESSAGES } from '@/data/messagesData';
import { useConversations } from './ConversationsContext';

const Ctx = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const { updateLast } = useConversations();

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, conversationId, sender: 'admin', text, createdAt: now },
    ]);
    updateLast(conversationId, text, now);
  }, [updateLast]);

  return (
    <Ctx.Provider value={{ messages, sendMessage }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMessages(): MessagesContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
