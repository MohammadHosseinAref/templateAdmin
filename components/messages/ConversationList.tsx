'use client';

import { useState } from 'react';
import dayjs from '@/lib/dayjs';
import type { ConversationListProps } from '@/types/messages';
import { initials, avatarColor } from './helpers';

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = conversations
    .filter((c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    )
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));

  return (
    <div className="flex flex-col h-full">

      {/* search */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <div className="relative">
          <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="w-full ps-9 pe-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700/60 border-none outline-none focus:ring-2 focus:ring-teal-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-10">نتیجه‌ای پیدا نشد</p>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === selectedId;
            const color      = avatarColor(conv.id);
            const time        = dayjs(conv.lastAt).fromNow();

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-start transition-colors ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                {/* avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${color}`}>
                  {initials(conv.customerName)}
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-sm font-semibold truncate ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>
                      {conv.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      {/* double tick */}
                      <svg
                        className={`w-3.5 h-2.5 flex-shrink-0 ${conv.unreadCount > 0 ? 'text-slate-300 dark:text-slate-600' : 'text-teal-500'}`}
                        viewBox="0 0 16 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 5l3 3 5-7" />
                        <path d="M5 5l3 3 5-7" />
                      </svg>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{conv.lastMessage || '...'}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 text-[10px] font-bold bg-teal-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
