'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type LangCode, loadSettings, SETTINGS_KEY } from '@/types/settings';
import {
  type LocaleData,
  LOCALES,
  LANG_NAMES,
  LANG_FLAGS,
  LANG_DIR,
  LOCALE_CUSTOM_KEY,
  loadLocale,
} from '@/lib/locale';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flattenSection(
  sectionData: Record<string, string | Record<string, string>>,
): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(sectionData)) {
    if (typeof v === 'string') {
      flat[k] = v;
    } else if (v && typeof v === 'object') {
      for (const [k2, v2] of Object.entries(v)) {
        if (typeof v2 === 'string') flat[`${k}.${k2}`] = v2;
      }
    }
  }
  return flat;
}

function unflattenSection(
  flat: Record<string, string>,
): Record<string, string | Record<string, string>> {
  const result: Record<string, string | Record<string, string>> = {};
  for (const [k, v] of Object.entries(flat)) {
    const dot = k.indexOf('.');
    if (dot === -1) {
      result[k] = v;
    } else {
      const parent = k.slice(0, dot);
      const child = k.slice(dot + 1);
      if (!result[parent] || typeof result[parent] === 'string') result[parent] = {};
      (result[parent] as Record<string, string>)[child] = v;
    }
  }
  return result;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LanguagePage() {
  const router = useRouter();

  const [activeLang, setActiveLang] = useState<LangCode>('fa');
  const [editLang, setEditLang] = useState<LangCode>('fa');
  const [section, setSection] = useState<keyof LocaleData | ''>('');
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState(false);
  const [t, setT] = useState<LocaleData>(LOCALES.fa);

  useEffect(() => {
    const saved = loadSettings();
    const lang = saved.language;
    setActiveLang(lang);
    setEditLang(lang);
    setT(loadLocale(lang));
  }, []);

  useEffect(() => {
    if (!section) { setEditValues({}); return; }
    const locale = loadLocale(editLang);
    const sectionData = locale[section] as Record<string, string | Record<string, string>>;
    setEditValues(flattenSection(sectionData));
  }, [section, editLang]);

  function applyLanguage() {
    const current = loadSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      ...current,
      language: activeLang,
      direction: LANG_DIR[activeLang],
    }));
    router.push('/');
  }

  function saveSection() {
    if (!section) return;
    const storageKey = `${LOCALE_CUSTOM_KEY}-${editLang}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, unknown>;
    const updated = { ...existing, [section]: unflattenSection(editValues) };
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  function resetSection() {
    if (!section) return;
    const storageKey = `${LOCALE_CUSTOM_KEY}-${editLang}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, unknown>;
    delete existing[section];
    if (Object.keys(existing).length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(existing));
    }
    const base = LOCALES[editLang];
    const sectionData = base[section] as Record<string, string | Record<string, string>>;
    setEditValues(flattenSection(sectionData));
  }

  function resetAllOverrides(lang: LangCode) {
    localStorage.removeItem(`${LOCALE_CUSTOM_KEY}-${lang}`);
    setT(loadLocale(lang));
    if (section) {
      const sectionData = LOCALES[lang][section] as Record<string, string | Record<string, string>>;
      setEditValues(flattenSection(sectionData));
    }
  }

  const sections = Object.keys(LOCALES.fa) as Array<keyof LocaleData>;
  const allLangs = Object.keys(LOCALES) as LangCode[];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0"
          aria-label={t.languagePage.backToDashboard}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h1 className="text-base font-bold text-slate-700 dark:text-slate-100">{t.languagePage.title}</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── Language selector ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            {t.languagePage.displayLanguage}
          </p>
          <div className={`grid gap-3 mb-4 ${allLangs.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {allLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  activeLang === lang
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{LANG_NAMES[lang]}</span>
                {activeLang === lang && (
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    {t.languagePage.active}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={applyLanguage}
            className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            {t.languagePage.apply}
          </button>
        </div>

        {/* ── Translation editor ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {t.languagePage.editTranslations}
            </p>
            <button
              type="button"
              onClick={() => resetAllOverrides(editLang)}
              className="text-xs text-red-500 dark:text-red-400 hover:underline"
            >
              پاک کردن همه تغییرات
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                {t.languagePage.editLang}
              </label>
              <select
                value={editLang}
                onChange={(e) => { setEditLang(e.target.value as LangCode); setSection(''); }}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                {allLangs.map((lang) => (
                  <option key={lang} value={lang}>{LANG_FLAGS[lang]} {LANG_NAMES[lang]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                {t.languagePage.editSection}
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as keyof LocaleData | '')}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="">{t.languagePage.selectSection}</option>
                {sections.map((s) => (
                  <option key={s} value={s}>
                    {t.languagePage.sectionNames[s as keyof typeof t.languagePage.sectionNames] ?? s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {section && Object.keys(editValues).length > 0 && (
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto pr-1">
              {Object.entries(editValues).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="text-xs text-slate-400 dark:text-slate-500 font-mono flex-shrink-0 w-36 truncate"
                    title={key}
                  >
                    {key}
                  </span>
                  <input
                    type="text"
                    value={value}
                    dir="auto"
                    onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
              ))}
            </div>
          )}

          {section && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveSection}
                className={`flex-1 text-white text-sm font-semibold py-2 rounded-xl transition-colors ${
                  savedMsg ? 'bg-green-500' : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {savedMsg ? t.languagePage.saved : t.languagePage.saveChanges}
              </button>
              <button
                type="button"
                onClick={resetSection}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-sm rounded-xl transition-colors"
              >
                {t.languagePage.resetSection}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
