'use client';

import { useId } from 'react';
import type { TopbarColorSwatchProps, SidebarColorSwatchProps } from '@/types/layout/ui';

export function TopbarColorSwatch({ value, onChange, title }: TopbarColorSwatchProps) {
  return (
    <div
      className="relative w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden flex-shrink-0 shadow-sm"
      style={{ backgroundColor: value || '#ffffff' }}
      title={title}
    >
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
    </div>
  );
}

export function SidebarColorSwatch({ value, onChange, label, textColor }: SidebarColorSwatchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <label
        htmlFor={id}
        className="text-[11px] font-medium truncate cursor-pointer select-none"
        style={{ color: textColor, opacity: 0.7 }}
      >
        {label}
      </label>
      <label
        htmlFor={id}
        className="relative w-6 h-6 rounded-lg border-2 border-white/25 cursor-pointer flex-shrink-0 overflow-hidden block"
        style={{ backgroundColor: value }}
        title={label}
      >
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ width: '100%', height: '100%' }}
        />
      </label>
    </div>
  );
}
