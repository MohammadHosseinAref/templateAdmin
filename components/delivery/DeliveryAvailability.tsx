'use client';

import type { DayOfWeek, DeliveryAvailabilityProps } from '@/types/delivery';
import { DAY_KEYS } from '@/types/delivery';
import { Card } from '@/components/ui/card';
import Pill from '@/components/layout/ui/Pill';
import { useLocale } from '@/contexts/LocaleContext';

export default function DeliveryAvailability({ value, onChange }: DeliveryAvailabilityProps) {
  const t = useLocale().delivery;

  function setDay(day: DayOfWeek, field: 'active' | 'from' | 'to', val: string | boolean) {
    onChange({ ...value, [day]: { ...value[day], [field]: val } });
  }

  return (
    <Card title={t.sections.availability}>
      <div className="space-y-1.5">
        {DAY_KEYS.map((day) => {
          const h = value[day];
          return (
            <div
              key={day}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                h.active ? 'bg-slate-50 dark:bg-slate-700/50' : 'bg-slate-50 dark:bg-slate-700/30'
              }`}
            >
              <span className={`text-sm font-medium w-20 flex-shrink-0 ${h.active ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                {t.days[day]}
              </span>

              {!h.active ? (
                <span className="flex-1 text-sm text-slate-400 dark:text-slate-500 italic">{t.labels.unavailable}</span>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <svg className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                    <input
                      type="time"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500 text-slate-700 dark:text-slate-200 text-sm rounded-xl ps-8 pe-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors"
                      value={h.from}
                      onChange={(e) => setDay(day, 'from', e.target.value)}
                    />
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 flex-shrink-0 text-base font-light">→</span>
                  <div className="relative flex-1">
                    <svg className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                    <input
                      type="time"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 text-sm rounded-xl ps-8 pe-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors"
                      value={h.to}
                      onChange={(e) => setDay(day, 'to', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex-shrink-0 cursor-pointer" onClick={() => setDay(day, 'active', !h.active)}>
                <Pill on={h.active} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
