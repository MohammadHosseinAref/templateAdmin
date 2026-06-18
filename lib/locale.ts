import faData from '@/locales/fa.json';
import enData from '@/locales/en.json';
import frData from '@/locales/fr.json';
import type { LangCode } from '@/types/settings';

export type LocaleData = typeof faData;

export const LOCALES: Record<LangCode, LocaleData> = {
  fa: faData,
  en: enData as LocaleData,
  fr: frData as LocaleData,
};

export const LANG_NAMES: Record<LangCode, string> = {
  fa: 'فارسی',
  en: 'English',
  fr: 'Français',
};

export const LANG_FLAGS: Record<LangCode, string> = {
  fa: '🇮🇷',
  en: '🇬🇧',
  fr: '🇫🇷',
};

export const LANG_DIR: Record<LangCode, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
  fr: 'ltr',
};

export const LOCALE_CUSTOM_KEY = 'smartdine-locale-custom';

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base } as T;
  for (const key in override) {
    const ov = override[key as keyof T];
    const bv = base[key as keyof T];
    if (
      ov !== undefined &&
      typeof ov === 'object' &&
      !Array.isArray(ov) &&
      bv !== undefined &&
      typeof bv === 'object' &&
      !Array.isArray(bv)
    ) {
      result[key as keyof T] = deepMerge(bv as object, ov as object) as T[keyof T];
    } else if (ov !== undefined) {
      result[key as keyof T] = ov as T[keyof T];
    }
  }
  return result;
}

export function loadLocale(lang: LangCode): LocaleData {
  const base = LOCALES[lang];
  if (typeof window === 'undefined') return base;
  try {
    const raw = localStorage.getItem(`${LOCALE_CUSTOM_KEY}-${lang}`);
    if (!raw) return base;
    return deepMerge(base, JSON.parse(raw) as Partial<LocaleData>);
  } catch {
    return base;
  }
}
