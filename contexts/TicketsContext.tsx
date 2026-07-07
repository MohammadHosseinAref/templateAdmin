'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Ticket, TicketStatus, NewTicketData, TicketsContextValue } from '@/types/tickets';
import { initialTickets } from '@/data/ticketsData';

const TicketsContext = createContext<TicketsContextValue | null>(null);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addTicket = useCallback((data: NewTicketData): string => {
    const id = `tkt-${Date.now()}`;
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id,
      ...data,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      unreadCount: 1,
      replies: [
        {
          id: `r-${Date.now()}`,
          sender: 'user',
          text: data.description,
          createdAt: now,
        },
      ],
    };
    setTickets((prev) => [ticket, ...prev]);
    return id;
  }, []);

  const addReply = useCallback((ticketId: string, text: string, sender: 'admin' | 'user') => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id !== ticketId
          ? t
          : {
              ...t,
              updatedAt: now,
              status: t.status === 'open' && sender === 'admin' ? 'in_progress' : t.status,
              replies: [
                ...t.replies,
                { id: `r-${Date.now()}`, sender, text, createdAt: now },
              ],
            }
      )
    );
  }, []);

  const setStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id !== ticketId ? t : { ...t, status, updatedAt: new Date().toISOString() }
      )
    );
  }, []);

  const markRead = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id !== ticketId ? t : { ...t, unreadCount: 0 }))
    );
  }, []);

  return (
    <TicketsContext.Provider value={{ tickets, addTicket, addReply, setStatus, markRead }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error('useTickets must be used inside TicketsProvider');
  return ctx;
}
