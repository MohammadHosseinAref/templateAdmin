import type { Request } from '@/types/requests';
import type { CustomerRow } from '@/types/customers';

export function buildCustomers(items: Request[]): CustomerRow[] {
  const map = new Map<string, { phone: string; name: string; types: Set<string>; count: number; spend: number; lastAt: string }>();

  for (const req of items.filter((r) => r.type !== 'delivery')) {
    const key = req.phone.replace(/\s/g, '');
    if (!map.has(key)) {
      map.set(key, { phone: req.phone, name: req.customerName, types: new Set(), count: 0, spend: 0, lastAt: req.createdAt });
    }
    const c = map.get(key)!;
    c.types.add(req.type);
    c.count++;
    c.spend += req.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? 0;
    if (req.createdAt > c.lastAt) c.lastAt = req.createdAt;
  }

  return Array.from(map.values())
    .map((c) => ({ ...c, types: Array.from(c.types) }))
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
}

const AVATAR_COLORS = [
  'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
];

export function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export function avatarColor(phone: string) {
  let hash = 0;
  for (const ch of phone) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
