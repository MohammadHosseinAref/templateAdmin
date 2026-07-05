'use client';

import { useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import type { DetailModalProps } from '@/types/requests';
import { TYPE_COLORS } from '../helpers';
import dayjs from '@/lib/dayjs';

export default function DetailModal({ req, onClose }: DetailModalProps) {
  const t  = useLocale();
  const tr = t.requests;
  const c  = TYPE_COLORS[req.type];
  const total   = req.items?.reduce((s, i) => s + i.price * i.qty, 0);
  const created = dayjs(req.createdAt);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        <div className={`${c.header} px-5 py-4 flex items-center justify-between`}>
          <span className={`text-sm font-bold uppercase tracking-wide ${c.text}`}>
            {tr.types[req.type]}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-black/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">

          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{req.customerName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {req.phone}
            </p>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">

            {req.tableNumber != null && (
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">{tr.labels.table}</span>
                <span className="font-medium">{req.tableNumber}</span>
              </div>
            )}

            {req.type === 'reservation' && (
              <>
                {req.date && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">{tr.labels.date}</span>
                    <span className="font-medium">{req.date}</span>
                  </div>
                )}
                {req.time && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">{tr.labels.time}</span>
                    <span className="font-medium">{req.time}</span>
                  </div>
                )}
                {req.guests != null && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">{tr.labels.guests}</span>
                    <span className="font-medium">{req.guests}</span>
                  </div>
                )}
                {req.date && req.time && (() => {
                  const arrival  = dayjs(`${req.date}T${req.time}`);
                  const isFuture = arrival.isAfter(dayjs());
                  return (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 dark:text-slate-500">{tr.labels.timeUntil}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isFuture
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                      }`}>
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {arrival.fromNow()}
                      </span>
                    </div>
                  );
                })()}
              </>
            )}

            {req.type === 'delivery' && req.address && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">{tr.labels.address}</span>
                <span className="font-medium text-end">{req.address}</span>
              </div>
            )}
            {req.type === 'delivery' && req.zone && (
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">{tr.labels.zone}</span>
                <span className="font-medium">{req.zone}</span>
              </div>
            )}

            {req.items && req.items.length > 0 && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-700/40 px-3 py-2 space-y-1 mt-1">
                {req.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{item.qty}× {item.name}</span>
                    <span className="tabular-nums font-medium">{(item.price * item.qty).toFixed(2)} €</span>
                  </div>
                ))}
                {total != null && (
                  <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-slate-200 dark:border-slate-600 mt-1 text-slate-700 dark:text-slate-200">
                    <span>{tr.labels.total}</span>
                    <span className="tabular-nums">{total.toFixed(2)} €</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {req.notes && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">{req.notes}</p>
          )}

          <div className="h-px bg-slate-100 dark:bg-slate-700" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {created.format('DD MMM YYYY')}
              <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
              {created.format('HH:mm')}
              <span className="ms-1 text-slate-400 dark:text-slate-500">({created.fromNow()})</span>
            </p>
            <button
              type="button"
              title={tr.labels.sendMessage}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              {tr.labels.sendMessage}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
