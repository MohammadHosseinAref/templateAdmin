'use client';

import type { DeliveryHistoryModalProps, DeliveryStatus } from '@/types/delivery';
import { useLocale } from '@/contexts/LocaleContext';

const STATUS_STYLE: Record<DeliveryStatus, { bg: string; color: string }> = {
  delivered: { bg: '#f0fdf4', color: '#16a34a' },
  cancelled: { bg: '#fef2f2', color: '#dc2626' },
  failed:    { bg: '#fffbeb', color: '#b45309' },
};

export default function DeliveryHistoryModal({ courierName, history, onClose }: DeliveryHistoryModalProps) {
  const t = useLocale().delivery;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.history.title}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 truncate">{courierName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 settings-scroll">
          {history.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">{t.history.empty}</p>
          ) : (
            <div className="space-y-2 py-2">
              {history.map((entry) => {
                const style = STATUS_STYLE[entry.status];
                return (
                  <div key={entry.id} className="rounded-xl border border-slate-100 dark:border-slate-700 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{entry.customerName}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {t.history.statuses[entry.status]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{entry.address}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-slate-400 dark:text-slate-500">{entry.date}</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                        {entry.durationMinutes} {t.history.minutesSuffix}
                      </span>
                      <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">{entry.amount.toFixed(2)} €</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
