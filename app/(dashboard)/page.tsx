'use client';

import { useLocale } from '@/contexts/LocaleContext';

export default function DashboardPage() {
  const t = useLocale();
  return (
    <div className="flex items-center justify-center h-full min-h-64 text-slate-300 dark:text-slate-600 select-none">
      <p className="text-sm">{t.dashboard.title}</p>
    </div>
  );
}
