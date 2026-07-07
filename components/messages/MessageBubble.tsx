import dayjs from '@/lib/dayjs';
import type { MessageBubbleProps } from '@/types/messages';

export default function MessageBubble({ message, isAdmin }: MessageBubbleProps) {
  const time = dayjs(message.createdAt).format('HH:mm');

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isAdmin
            ? 'bg-teal-500 text-white rounded-br-sm'
            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-sm'
        }`}>
          {message.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 px-1 ${isAdmin ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{time}</span>
          {isAdmin && (
            <svg
              className="w-3.5 h-2.5 text-teal-400 flex-shrink-0"
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
          )}
        </div>
      </div>
    </div>
  );
}
