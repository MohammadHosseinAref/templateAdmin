'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LangCode } from '@/types/settings';
import { type LocaleData, LOCALES, loadLocale } from '@/lib/locale';

const LocaleCtx = createContext<LocaleData>(LOCALES.fa);

export function LocaleProvider({ lang, children }: { lang: LangCode; children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleData>(LOCALES[lang]);

  useEffect(() => {
    setLocale(loadLocale(lang));
  }, [lang]);

  return <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): LocaleData {
  return useContext(LocaleCtx);
}
