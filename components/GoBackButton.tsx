'use client';

import { useLocale } from '@/contexts/LocaleContext';

export default function GoBackButton() {
  const t = useLocale();
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm px-6 py-3 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
      {t.notFound.goBack}
    </button>
  );
}
