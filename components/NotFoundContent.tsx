'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadSettings } from '@/types/settings';
import { loadLocale, LOCALES } from '@/lib/locale';
import type { LocaleData } from '@/lib/locale';

export default function NotFoundContent() {
  const [t, setT] = useState<LocaleData>(LOCALES.fa);

  useEffect(() => {
    const settings = loadSettings();
    setT(loadLocale(settings.language));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-center px-6 py-16">

      {/* Brand mark */}
      <div className="flex items-center gap-2.5 mb-14 opacity-50">
        <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm leading-none">S</span>
        </div>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
          {t.app.fullName}
        </span>
      </div>

      {/* Ghost 404 */}
      <div className="relative mb-6 select-none">
        <p className="text-[8rem] sm:text-[11rem] lg:text-[14rem] font-black leading-none tracking-tight text-slate-200 dark:text-slate-800">
          ۴۰۴
        </p>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-float">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-teal-400/20 dark:bg-teal-400/10 blur-xl scale-125" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/35">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-1.5-.75m0 0V12a3 3 0 016 0v1.5m6 0V12a3 3 0 00-6 0v1.5m6 0V12a3 3 0 016 0v1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
        {t.notFound.heading}
      </h1>

      {/* Subtext */}
      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-xs sm:max-w-sm">
        {t.notFound.descriptionPart1}
        <br className="hidden sm:block" />
        {' '}{t.notFound.descriptionPart2}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-colors shadow-lg shadow-teal-500/25"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          {t.notFound.backToDashboard}
        </Link>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm px-6 py-3 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          {t.notFound.goBack}
        </button>
      </div>

      {/* Decorative dots */}
      <div className="flex items-center gap-2 mt-16 opacity-30">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        <span className="text-xs text-slate-400 dark:text-slate-600 font-mono tracking-[0.2em] uppercase">
          {t.notFound.mono}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
      </div>
    </div>
  );
}
