'use client';

import { useState, useRef, useEffect } from 'react';
import { COUNTRIES, type CountryCode } from '@/data/geo/countries';
import type { CountrySelectProps } from '@/types/baseInfo';
import { inputCls } from '@/components/ui/styles';

const COUNTRY_FALLBACK_NAMES: Record<CountryCode, string> = {
  FR: 'France',
};

export default function CountrySelect({ value, onChange, countryNames = {}, searchPlaceholder = 'Search...', noResultsText = 'No results' }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCodes = Object.keys(COUNTRIES) as CountryCode[];

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  function getName(code: CountryCode): string {
    return countryNames[code] || COUNTRY_FALLBACK_NAMES[code] || code;
  }

  const filtered = allCodes.filter((code) => {
    const name = getName(code);
    return name.toLowerCase().includes(query.toLowerCase()) || code.toLowerCase().includes(query.toLowerCase());
  });

  function select(code: CountryCode) {
    onChange(code);
    setOpen(false);
    setQuery('');
  }

  const current = COUNTRIES[value];
  const currentName = getName(value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${inputCls} flex items-center justify-between gap-2 text-left`}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg leading-none">{current.flag}</span>
          <span className="text-slate-700 dark:text-slate-200">{currentName}</span>
          <span className="text-xs text-slate-400">{current.phoneCode}</span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {allCodes.length > 4 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-700">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto settings-scroll">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-4">{noResultsText}</p>
            ) : (
              filtered.map((code) => {
                const c = COUNTRIES[code];
                const name = getName(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); select(code); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      code === value
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="flex-1 text-left">{name}</span>
                    <span className="text-xs text-slate-400">{c.phoneCode}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
