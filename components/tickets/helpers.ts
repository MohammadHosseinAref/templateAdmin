import type { TicketType, TicketPriority } from '@/types/tickets';

export function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function ticketNum(id: string) {
  const m = id.match(/tkt-(\d+)$/);
  if (m) return m[1].length <= 6 ? m[1].padStart(3, '0') : m[1].slice(-4);
  return id.slice(-4);
}

export const TICKET_TYPES: TicketType[]         = ['support', 'complaint', 'internal'];
export const TICKET_PRIORITIES: TicketPriority[] = ['high', 'medium', 'low'];

export const TYPE_COLORS: Record<TicketType, string> = {
  support:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-400',
  complaint: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-rose-400',
  internal:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-400',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  high:   'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-rose-400',
  medium: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-400',
  low:    'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 ring-slate-400',
};

export const TYPE_RING: Record<TicketType, string> = {
  support:   'ring-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  complaint: 'ring-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
  internal:  'ring-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
};

export const PRIORITY_RING: Record<TicketPriority, string> = {
  high:   'ring-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
  medium: 'ring-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  low:    'ring-slate-400 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
};

export const PILL_DEFAULT = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600';
export const INPUT_BASE   = 'w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow shadow-sm';

export const TYPE_BADGE: Record<TicketType, string> = {
  support:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  complaint: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  internal:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

export const STATUS_BADGE: Record<string, string> = {
  open:        'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  in_progress: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  closed:      'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
};

export const PRIORITY_BADGE: Record<TicketPriority, string> = {
  high:   'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  medium: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  low:    'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
};
