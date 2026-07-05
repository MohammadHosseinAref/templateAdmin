'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { SAMPLE_REQUESTS } from '@/data/requestsData';
import type { Request, RequestStatus } from '@/types/requests';

interface RequestsContextValue {
  items:  Request[];
  update: (id: string, status: RequestStatus) => void;
}

const Ctx = createContext<RequestsContextValue | null>(null);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Request[]>(SAMPLE_REQUESTS);

  function update(id: string, status: RequestStatus) {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  return <Ctx.Provider value={{ items, update }}>{children}</Ctx.Provider>;
}

export function useRequests(): RequestsContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}
