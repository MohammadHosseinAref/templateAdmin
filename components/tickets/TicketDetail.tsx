'use client';

import { useRef, useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketDetailProps } from '@/types/tickets';
import { TYPE_BADGE, STATUS_BADGE, PRIORITY_BADGE } from './helpers';
import dayjs from '@/lib/dayjs';

export default function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  const t  = useLocale();
  const tr = t.tickets;
  const { tickets, addReply, setStatus } = useTickets();
  const ticket = tickets.find((tk) => tk.id === ticketId);

  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.replies.length]);

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
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
    <div className="flex flex-col h-full">

      {/* header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-0.5 w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{ticket.subject}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {tr.labels.from}: {ticket.submittedBy}
              {ticket.phone && ` · ${ticket.phone}`}
              {' · '}{dayjs(ticket.createdAt).fromNow()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_BADGE[ticket.type]}`}>
              {tr.types[ticket.type]}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_BADGE[ticket.status]}`}>
              {tr.statuses[ticket.status]}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[ticket.priority]}`}>
              {tr.priorities[ticket.priority]}
            </span>
          </div>
        </div>
      </div>

      {/* thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {ticket.replies.map((reply) => {
          const isAdmin = reply.sender === 'admin';
          return (
            <div key={reply.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <p className={`text-[10px] font-medium ${isAdmin ? 'text-teal-600 dark:text-teal-400 text-end' : 'text-slate-400 dark:text-slate-500'}`}>
                  {isAdmin ? tr.labels.admin : ticket.submittedBy}
                </p>
                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isAdmin
                    ? 'bg-teal-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-sm'
                }`}>
                  {reply.text}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                  {dayjs(reply.createdAt).format('HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* reply input */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0 space-y-2">

        {isClosed ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">{tr.statuses.closed}</p>
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
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tr.replyPlaceholder}
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim()}
                className="self-end w-9 h-9 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStatus(ticketId, 'closed')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              {tr.labels.close}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
