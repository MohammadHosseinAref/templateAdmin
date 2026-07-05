import type { RequestType, RequestStatus } from '@/types/requests';
import dayjs from '@/lib/dayjs';

// ── STATUS_STYLE ─────────────────────────────────────────────────────────────

export const STATUS_STYLE: Record<RequestStatus, { bg: string; text: string }> = {
  pending:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20',    text: 'text-yellow-600 dark:text-yellow-400'    },
  approved:  { bg: 'bg-teal-50 dark:bg-teal-900/20',       text: 'text-teal-600 dark:text-teal-400'       },
  rejected:  { bg: 'bg-red-50 dark:bg-red-900/20',         text: 'text-red-500 dark:text-red-400'         },
  completed: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
};

// ── timeAgo ───────────────────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  return dayjs(iso).fromNow();
}

// ── TYPE_COLORS ───────────────────────────────────────────────────────────────

export const TYPE_COLORS: Record<RequestType, { header: string; border: string; badge: string; text: string }> = {
  food:        { header: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/50', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', text: 'text-amber-600 dark:text-amber-400' },
  reservation: { header: 'bg-blue-50 dark:bg-blue-900/20',  border: 'border-blue-200 dark:border-blue-800/50',   badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',   text: 'text-blue-600 dark:text-blue-400'   },
  delivery:    { header: 'bg-teal-50 dark:bg-teal-900/20',  border: 'border-teal-200 dark:border-teal-800/50',   badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',   text: 'text-teal-600 dark:text-teal-400'   },
};

// ── TypeIcon ──────────────────────────────────────────────────────────────────

export function TypeIcon({ type, className }: { type: RequestType; className: string }) {
  if (type === 'food') return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-1.5-.75m0 0V12a3 3 0 016 0v1.5m6 0V12a3 3 0 00-6 0v1.5m6 0V12a3 3 0 016 0v1.5" />
    </svg>
  );
  if (type === 'reservation') return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}
