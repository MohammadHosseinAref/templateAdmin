'use client';

import type { SettingsRowProps } from '@/types/layout/ui';

export default function SettingsRow({ icon, label, right, onClick }: SettingsRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
    >
      <span className="flex items-center gap-2.5">{icon}{label}</span>
      {right}
    </button>
  );
}
