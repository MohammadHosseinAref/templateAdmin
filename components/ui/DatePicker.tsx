'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import dayjs, { type Dayjs } from 'dayjs';

interface DatePickerProps {
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

const NAV_BTN = 'w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors';

export default function DatePicker({ value, onChange, placeholder = '—' }: DatePickerProps) {
  const [open,  setOpen]  = useState(false);
  const [month, setMonth] = useState<Dayjs>(value ? dayjs(value) : dayjs());
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + 'T00:00:00') : undefined;
  const display  = value ? dayjs(value).format('DD MMM YYYY') : '';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* ── trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-sm rounded-lg border px-3 py-2 w-[180px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
          open
            ? 'border-teal-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
        }`}
      >
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
        <span className={`flex-1 text-start ${!value ? 'text-slate-400 dark:text-slate-500' : ''}`}>
          {display || placeholder}
        </span>
        {value && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="text-slate-300 hover:text-red-400 dark:text-slate-600 dark:hover:text-red-400 transition-colors text-sm leading-none"
          >
            ×
          </span>
        )}
      </button>

      {/* ── popover ── */}
      {open && (
        <div className="absolute top-full mt-1.5 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 start-0 w-56">

          {/* custom nav header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button type="button" className={NAV_BTN} onClick={() => setMonth((m) => m.subtract(1, 'month'))}>
              <ChevronLeft />
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              {month.format('MMM YYYY')}
            </span>
            <button type="button" className={NAV_BTN} onClick={() => setMonth((m) => m.add(1, 'month'))}>
              <ChevronRight />
            </button>
          </div>

          {/* today shortcut */}
          <button
            type="button"
            onClick={() => {
              const today = dayjs();
              setMonth(today);
              onChange(today.format('YYYY-MM-DD'));
              setOpen(false);
            }}
            className="w-full mb-2 text-[11px] font-semibold text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg py-1 transition-colors"
          >
            Today · {dayjs().format('DD MMM')}
          </button>

          <DayPicker
            hideNavigation
            mode="single"
            month={month.toDate()}
            onMonthChange={(d) => setMonth(dayjs(d))}
            selected={selected}
            onSelect={(date) => {
              onChange(date ? dayjs(date).format('YYYY-MM-DD') : '');
              if (date) setOpen(false);
            }}
            classNames={{
              month_caption: 'hidden',
              month_grid:    'w-full',
              weekdays:      'flex',
              weekday:       'flex-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase py-1',
              week:          'flex',
              day:           'flex-1 flex items-center justify-center p-0.5',
              day_button:    'w-full h-7 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors',
              selected:      '[&>button]:!bg-teal-500 [&>button]:!text-white',
              today:         '[&>button]:font-bold [&>button]:text-teal-500',
              outside:       '[&>button]:text-slate-300 dark:[&>button]:text-slate-600 [&>button]:hover:bg-transparent',
              disabled:      '[&>button]:opacity-30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
            }}
          />
        </div>
      )}
    </div>
  );
}
