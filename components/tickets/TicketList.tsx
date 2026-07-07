'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketStatus } from '@/types/tickets';
import dayjs from '@/lib/dayjs';

const TYPE_COLORS: Record<string, string> = {
  support:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  complaint: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  internal:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

const STATUS_DOT: Record<string, string> = {
  open:        'bg-teal-400',
  in_progress: 'bg-amber-400',
  closed:      'bg-slate-300 dark:bg-slate-600',
};

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-rose-400',
  medium: 'bg-amber-400',
  low:    'bg-slate-300 dark:bg-slate-600',
};

type FilterStatus = 'all' | TicketStatus;

export default function TicketList({
  selectedId,
  onSelect,
  onNew,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const t  = useLocale();
  const tr = t.tickets;
  const { tickets, markRead } = useTickets();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = tickets.filter((tk) => filter === 'all' || tk.status === filter);

  const TABS: { key: FilterStatus; label: string }[] = [
    { key: 'all',         label: tr.filterAll                  },
    { key: 'open',        label: tr.statuses.open              },
    { key: 'in_progress', label: tr.statuses.in_progress       },
    { key: 'closed',      label: tr.statuses.closed            },
  ];

  function handleSelect(id: string) {
    markRead(id);
    onSelect(id);
  }

  return (
    <div className="flex flex-col h-full">

      {/* header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
          {tr.title}
        </h2>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {tr.newTicket}
        </button>
      </div>

      {/* filter tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-700 flex-shrink-0 px-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              filter === key
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {label}
            {key !== 'all' && (
              <span className="ms-1 tabular-nums opacity-70">
                ({tickets.filter((tk) => tk.status === key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-12">{tr.noTickets}</p>
        ) : (
          filtered.map((tk) => (
            <button
              key={tk.id}
              type="button"
              onClick={() => handleSelect(tk.id)}
              className={`w-full text-start px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                selectedId === tk.id
                  ? 'bg-teal-50 dark:bg-teal-900/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
              }`}
            >
              <div className="flex items-start gap-2">
                {/* priority dot */}
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[tk.priority]}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {tk.subject}
                    </span>
                    {tk.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-teal-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[tk.type]}`}>
                      {tr.types[tk.type]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[tk.status]}`} />
                      {tr.statuses[tk.status]}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ms-auto tabular-nums">
                      {dayjs(tk.updatedAt).fromNow()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {tk.submittedBy}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
