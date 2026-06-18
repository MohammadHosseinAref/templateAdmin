'use client';

import type { BottomNavItem } from '@/types/layout/bottomnav';

export type { BottomNavItem };

interface Props {
  items: BottomNavItem[];
  visible: boolean;
}

export default function BottomNav({ items, visible }: Props) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors duration-150
            ${item.active
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-400 dark:text-slate-500 active:text-teal-600 dark:active:text-teal-400'
            }`}
        >
          <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
          {item.active && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-500" />
          )}
        </button>
      ))}
    </nav>
  );
}
