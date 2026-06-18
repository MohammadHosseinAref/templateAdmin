'use client';

import type { DropdownPanelProps } from '@/types/layout/ui';

export default function DropdownPanel({ style, children, onClose }: DropdownPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-[49]" onClick={onClose} />
      <div
        className="z-50 w-80 max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl flex flex-col"
        style={{ ...style, maxHeight: 'calc(100vh - 5rem)' }}
      >
        {children}
      </div>
    </>
  );
}
