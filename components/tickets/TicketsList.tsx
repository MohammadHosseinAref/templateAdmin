'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketStatus } from '@/types/tickets';
import dayjs from '@/lib/dayjs';

const TYPE_COLORS: Record<string, string> = {
  support:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  complaint: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  internal:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

const STATUS_COLORS: Record<string, string> = {
  open:        'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  in_progress: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  closed:      'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
};

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-rose-400',
  medium: 'bg-amber-400',
  low:    'bg-slate-300 dark:bg-slate-600',
};

type FilterStatus = 'all' | TicketStatus;

function ticketNum(id: string) {
  const m = id.match(/tkt-(\d+)$/);
  if (m) return m[1].length <= 6 ? m[1].padStart(3, '0') : m[1].slice(-4);
  return id.slice(-4);
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

const AVATAR_COLORS = [
  'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
  'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
  'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
];

function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function TicketsList() {
  const t      = useLocale();
  const tr     = t.tickets;
  const router = useRouter();
  const { tickets, markRead } = useTickets();

  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = tickets.filter((tk) => filter === 'all' || tk.status === filter);

  const TABS: { key: FilterStatus; label: string }[] = [
    { key: 'all',         label: tr.filterAll            },
    { key: 'open',        label: tr.statuses.open        },
    { key: 'in_progress', label: tr.statuses.in_progress },
    { key: 'closed',      label: tr.statuses.closed      },
  ];

  function handleClick(id: string) {
    markRead(id);
    router.push(`/tickets/${id}`);
  }

  const totalUnread = tickets.filter((tk) => tk.unreadCount > 0).length;

  return (
    <div className="space-y-4">

      {/* page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            {tr.title}
          </h1>
          {totalUnread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold tabular-nums">
              {totalUnread}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => router.push('/tickets/new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {tr.newTicket}
        </button>
      </div>

      {/* card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">

        {/* tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700 px-2">
          {TABS.map(({ key, label }) => {
            const count = key === 'all' ? tickets.length : tickets.filter((tk) => tk.status === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                  filter === key
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {label}
                <span className="opacity-50 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* table */}
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-16">{tr.noTickets}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                  <th className="px-4 py-3 text-start w-16">#</th>
                  <th className="px-4 py-3 text-start">موضوع</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">ثبت‌کننده</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">نوع</th>
                  <th className="px-4 py-3 text-center">وضعیت</th>
                  <th className="px-4 py-3 text-end hidden sm:table-cell">زمان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/60">
                {filtered.map((tk) => {
                  const num   = ticketNum(tk.id);
                  const color = avatarColor(tk.submittedBy);
                  const last  = tk.replies[tk.replies.length - 1];
                  return (
                    <tr
                      key={tk.id}
                      onClick={() => handleClick(tk.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors"
                    >
                      {/* ticket number */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[tk.priority]}`} />
                          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                            #{num}
                          </span>
                          {tk.unreadCount > 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* subject + preview */}
                      <td className="px-4 py-3.5 max-w-[260px]">
                        <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{tk.subject}</p>
                        {last && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {last.text}
                          </p>
                        )}
                      </td>

                      {/* submitter */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${color}`}>
                            {initials(tk.submittedBy)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{tk.submittedBy}</p>
                            {tk.phone && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">{tk.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* type */}
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tk.type]}`}>
                          {tr.types[tk.type]}
                        </span>
                      </td>

                      {/* status */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[tk.status]}`}>
                          {tr.statuses[tk.status]}
                        </span>
                      </td>

                      {/* time */}
                      <td className="px-4 py-3.5 text-end hidden sm:table-cell">
                        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                          {dayjs(tk.updatedAt).fromNow()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
