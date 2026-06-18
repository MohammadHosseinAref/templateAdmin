export type LangCode = 'fa' | 'en' | 'fr';

export interface AppSettings {
  isDark: boolean;
  direction: 'rtl' | 'ltr';
  fontSize: number;
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  sidebarBg: string;
  sidebarTextColor: string;
  topbarBg: string;
  showBottomNav: boolean;
  fontFamily: string;
  language: LangCode;
}

export const DEFAULTS: AppSettings = {
  isDark: false,
  direction: 'ltr',
  fontSize: 14,
  sidebarWidth: 256,
  sidebarCollapsed: false,
  sidebarBg: '#134e4a',
  sidebarTextColor: '#ccfbf1',
  topbarBg: '',
  showBottomNav: true,
  fontFamily: '',
  language: 'fr',
};

export const SETTINGS_KEY = 'smartdine-settings';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}
