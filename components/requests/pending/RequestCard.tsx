'use client';

import { useState } from 'react';
import type { RequestCardProps } from '@/types/requests';
import { timeAgo, TYPE_COLORS, TypeIcon } from '../helpers';
import dayjs from '@/lib/dayjs';
import MessageModal from './MessageModal';

export default function RequestCard({ request, t, onApprove, onReject, onUndo, onDone }: RequestCardProps) {
  const tr    = t.requests;
  const c     = TYPE_COLORS[request.type];
  const total = request.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? 0;
  const [showMessage, setShowMessage] = useState(false);
  const [removing,    setRemoving]    = useState(false);

  const animateThen = (fn: () => void) => {
    setRemoving(true);
    setTimeout(fn, 280);
  };

  return (
    <>
    <div className={`transition-all duration-300 ease-in-out ${removing ? 'opacity-0 scale-95 -translate-y-1 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'}`}>
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border ${c.border} overflow-hidden flex flex-col`}>

      {/* ── type header ── */}
      <div className={`${request.status === 'approved' ? 'bg-teal-50 dark:bg-teal-900/20' : c.header} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <TypeIcon
            type={request.type}
            className={`w-4 h-4 ${request.status === 'approved' ? 'text-teal-600 dark:text-teal-400' : c.text}`}
          />
          <span className={`text-xs font-bold uppercase tracking-wide ${request.status === 'approved' ? 'text-teal-600 dark:text-teal-400' : c.text}`}>
            {tr.types[request.type]}
          </span>
          {request.status === 'approved' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {tr.status.approved}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {timeAgo(request.createdAt)}
        </span>
      </div>

      {/* ── customer ── */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{request.customerName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{request.phone}</p>
        </div>
        {request.tableNumber != null && (
          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium flex-shrink-0">
            {tr.labels.table} {request.tableNumber}
          </span>
        )}
      </div>

      {/* ── details ── */}
      <div className="px-4 pb-3 flex-1 space-y-1.5">

        {request.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{item.qty}× {item.name}</span>
            <span className="font-medium tabular-nums">{(item.price * item.qty).toFixed(2)} €</span>
          </div>
        ))}

        {(request.items?.length ?? 0) > 0 && (
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 pt-1.5 border-t border-slate-100 dark:border-slate-700">
            <span>{tr.labels.total}</span>
            <span className="tabular-nums">{total.toFixed(2)} €</span>
          </div>
        )}

        {request.type === 'reservation' && (
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {request.date}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                {request.time}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              {request.guests} {tr.labels.guests}
            </span>
            {request.date && request.time && (() => {
              const arrival  = dayjs(`${request.date}T${request.time}`);
              const isFuture = arrival.isAfter(dayjs());
              return (
                <span className={`self-start inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isFuture
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                }`}>
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {arrival.fromNow()}
                </span>
              );
            })()}
          </div>
        )}

        {request.type === 'delivery' && request.address && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="truncate">{request.address}</span>
          </p>
        )}

        {request.notes && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">{request.notes}</p>
        )}
      </div>

      {/* ── actions ── */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex gap-2">
        {request.status === 'pending' ? (
          <>
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {tr.labels.approve}
            </button>
            <button
              type="button"
              onClick={() => animateThen(() => onReject(request.id))}
              className="flex-1 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {tr.labels.reject}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onUndo(request.id)}
              className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              {tr.labels.undo}
            </button>
            <button
              type="button"
              onClick={() => animateThen(() => onDone(request.id))}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tr.labels.done}
            </button>
          </>
        )}
        </div>
        <button
          type="button"
          onClick={() => setShowMessage(true)}
          className="w-full py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          {tr.labels.sendMessage}
        </button>
      </div>

    </div>
    </div>

    {showMessage && (
      <MessageModal request={request} onClose={() => setShowMessage(false)} />
    )}
    </>
  );
}
