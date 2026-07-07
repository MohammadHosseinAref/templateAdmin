'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketDetailPageProps } from '@/types/tickets';
import { TYPE_BADGE, STATUS_BADGE, PRIORITY_BADGE, initials, ticketNum } from './helpers';
import dayjs from '@/lib/dayjs';

export default function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  const t      = useLocale();
  const tr     = t.tickets;
  const router = useRouter();
  const { tickets, addReply, setStatus } = useTickets();
  const ticket = tickets.find((tk) => tk.id === ticketId);

  const [text, setText] = useState('');
  const bottomRef       = useRef<HTMLDivElement>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.replies.length]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
        {tr.noTickets}
      </div>
    );
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addReply(ticketId, trimmed, 'admin');
    setText('');
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isClosed = ticket.status === 'closed';

  return (
    <div className="flex flex-col h-full gap-4">

      {/* ── breadcrumb ── */}
      <div className="flex-shrink-0 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <button
          type="button"
          onClick={() => router.push('/tickets')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
        >
          {tr.title}
        </button>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{ticket.subject}</span>
      </div>

      {/* ── header card ── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400" />
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex flex-col items-center justify-center shadow-inner">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 leading-none">#</span>
            <span className="text-sm font-black text-slate-700 dark:text-slate-200 font-mono tabular-nums leading-tight">
              {ticketNum(ticket.id)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[ticket.type]}`}>
                {tr.types[ticket.type]}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[ticket.status]}`}>
                {tr.statuses[ticket.status]}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[ticket.priority]}`}>
                {tr.priorities[ticket.priority]}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ms-1">
                {tr.labels.from}: <span className="font-semibold text-slate-600 dark:text-slate-300">{ticket.submittedBy}</span>
                {ticket.phone && ` · ${ticket.phone}`}
                {' · '}{dayjs(ticket.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── thread ── */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {ticket.replies.map((reply, idx) => {
            const isAdmin = reply.sender === 'admin';
            return (
              <div
                key={reply.id}
                className={`group relative rounded-2xl border shadow-sm transition-shadow hover:shadow-md overflow-hidden ${
                  isAdmin
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/60'
                    : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                {/* colored accent strip */}
                <div className={`absolute inset-y-0 start-0 w-1 rounded-s-2xl ${isAdmin ? 'bg-teal-400' : 'bg-slate-300 dark:bg-slate-500'}`} />

                <div className="ps-5 pe-4 pt-3.5 pb-4">
                  {/* row: avatar + name + time */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {isAdmin ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-sm flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 shadow-sm flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-slate-600 dark:text-slate-200">
                          {initials(ticket.submittedBy)}
                        </div>
                      )}
                      <div>
                        <p className={`text-xs font-bold ${isAdmin ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>
                          {isAdmin ? tr.labels.admin : ticket.submittedBy}
                        </p>
                        {!isAdmin && ticket.phone && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">{ticket.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="tabular-nums">{dayjs(reply.createdAt).format('HH:mm')}</span>
                      <span className="opacity-50">·</span>
                      <span>{dayjs(reply.createdAt).format('D MMM')}</span>
                      <span className="opacity-30 tabular-nums">#{idx + 1}</span>
                    </div>
                  </div>

                  {/* message text */}
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-7 whitespace-pre-wrap">
                    {reply.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* ── reply area ── */}
        <div className={`flex-shrink-0 border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-3 ${isClosed ? '' : 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80'}`}>
          {isClosed ? (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {tr.statuses.closed}
              </div>
              <button
                type="button"
                onClick={() => setStatus(ticketId, 'open')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                {tr.labels.reopen}
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-sm flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={tr.replyPlaceholder}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-600 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 px-3.5 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md flex-shrink-0"
                >
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setStatus(ticketId, 'closed')}
                className="w-full py-1.5 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                {tr.labels.close}
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
