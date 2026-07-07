import dayjs from '@/lib/dayjs';
import type { Message } from '@/types/messages';

export function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

const AVATAR_COLORS = [
  'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
];

export function avatarColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function groupByDate(messages: Message[]): { label: string; items: Message[] }[] {
  const groups: { label: string; items: Message[] }[] = [];
  for (const msg of messages) {
    const d     = dayjs(msg.createdAt);
    const label = d.isAfter(dayjs().startOf('day')) ? 'امروز' : d.format('DD MMM YYYY');
    const last  = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(msg);
    } else {
      groups.push({ label, items: [msg] });
    }
  }
  return groups;
}
