'use client';

import type { PillProps } from '@/types/layout/ui';

export default function Pill({ on }: PillProps) {
  return (
    <div className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 flex-shrink-0 ${on ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? 'left-[1.35rem]' : 'left-[3px]'}`} />
    </div>
  );
}
