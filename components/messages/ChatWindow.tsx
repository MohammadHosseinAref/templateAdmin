'use client';

import { useEffect, useRef } from 'react';
import type { ChatWindowProps } from '@/types/messages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { initials, groupByDate } from './helpers';

export default function ChatWindow({ conversation, messages, onSend, onBack }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-300 dark:text-slate-600 select-none">
        <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <p className="text-sm">یک مکالمه انتخاب کنید</p>
      </div>
    );
  }

  const groups = groupByDate(messages);

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
          {initials(conversation.customerName)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{conversation.customerName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {conversation.phone}
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50 dark:bg-slate-900/30">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-8">هنوز پیامی نیست</p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex items-center gap-2 py-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 px-2 font-medium">{group.label}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>
              {group.items.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isAdmin={msg.sender === 'admin'} />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}
