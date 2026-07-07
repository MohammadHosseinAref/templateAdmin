'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Conversation, ConversationsContextValue } from '@/types/messages';
import { SAMPLE_CONVERSATIONS } from '@/data/messagesData';

const Ctx = createContext<ConversationsContextValue | null>(null);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);

  const findOrCreate = useCallback((customerName: string, phone: string): string => {
    const id = phone.replace(/[\s\-+]/g, '');
    setConversations((prev) => {
      if (prev.find((c) => c.id === id)) return prev;
      return [{ id, customerName, phone, lastMessage: '', lastAt: new Date().toISOString(), unreadCount: 0 }, ...prev];
    });
    return id;
  }, []);

  const markRead = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const updateLast = useCallback((id: string, text: string, at: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lastMessage: text, lastAt: at } : c))
    );
  }, []);

  return (
    <Ctx.Provider value={{ conversations, findOrCreate, markRead, updateLast }}>
      {children}
    </Ctx.Provider>
  );
}

export function useConversations(): ConversationsContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConversations must be used within ConversationsProvider');
  return ctx;
}
