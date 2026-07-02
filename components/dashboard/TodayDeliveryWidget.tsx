'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { SAMPLE_COURIERS } from '@/data/deliveryData';
import type { DayOfWeek } from '@/types/delivery';

const DAY_MAP: Record<number, DayOfWeek> = {
  0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat',
};

export default function TodayDeliveryWidget() {
  const { dashboard: d } = useLocale();
  const td = d.todayDelivery;
  const todayKey = DAY_MAP[new Date().getDay()];
  const [enabled, setEnabled] = useState(true);

  const availableToday   = SAMPLE_COURIERS.filter(c => c.active && c.availability[todayKey].active);
  const unavailableToday = SAMPLE_COURIERS.filter(c => c.active && !c.availability[todayKey].active);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            enabled ? 'bg-teal-50 dark:bg-teal-900/30' : 'bg-slate-100 dark:bg-slate-700'
          }`}>
            <svg className={`w-4 h-4 transition-colors ${enabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </span>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{td.title}</p>
        </div>
        {enabled && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
              {availableToday.length} {td.available}
            </span>
            {unavailableToday.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                {unavailableToday.length} {td.unavailableToday}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Service toggle row */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{td.serviceLabel}</p>
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-semibold transition-colors ${
            enabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {enabled ? td.serviceOn : td.serviceOff}
          </span>
          {/* Toggle switch */}
          <button
            type="button"
            onClick={() => setEnabled((v) => !v)}
            aria-pressed={enabled}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
              enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className="absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
              style={{ top: '2px', left: enabled ? '20px' : '2px' }}
            />
          </button>
        </div>
      </div>

      {/* Courier rows */}
      <div className={`divide-y divide-slate-50 dark:divide-slate-700/60 transition-opacity duration-200 ${!enabled ? 'opacity-40 pointer-events-none select-none' : ''}`}>
        {SAMPLE_COURIERS.length === 0 ? (
          <p className="px-5 py-8 text-sm text-center text-slate-400 dark:text-slate-500">{td.noCouriers}</p>
        ) : (
          SAMPLE_COURIERS.map((courier) => {
            const avail = courier.availability[todayKey];
            const isAvailableToday = courier.active && avail.active;
            const isInactive = !courier.active;

            return (
              <div key={courier.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500 dark:text-slate-300 select-none">
                  {courier.firstName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {courier.firstName} {courier.lastName}
                  </p>
                  {isAvailableToday && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{avail.from} – {avail.to}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  isInactive
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    : isAvailableToday
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {isInactive ? td.inactive : isAvailableToday ? td.available : td.unavailableToday}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700">
        <Link
          href="/delivery"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          {td.viewAll}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
