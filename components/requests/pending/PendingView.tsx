'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import type { Request } from '@/types/requests';
import RequestCard from './RequestCard';

interface PendingViewProps {
  items:     Request[];
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
  onUndo:    (id: string) => void;
  onDone:    (id: string) => void;
}

export default function PendingView({ items, onApprove, onReject, onUndo, onDone }: PendingViewProps) {
  const t  = useLocale();
  const tr = t.requests;
  const active = items.filter((r) => r.status === 'pending' || r.status === 'approved');

  return (
    <div className="space-y-4">
      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-600 select-none">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{tr.labels.noPending}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {active.map((req) => (
            <RequestCard
              key={req.id} request={req} t={t}
              onApprove={onApprove} onReject={onReject}
              onUndo={onUndo} onDone={onDone}
            />
          ))}
        </div>
      )}

      <div className="pt-1">
        <Link
          href="/requests/list"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          {tr.labels.viewList}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
