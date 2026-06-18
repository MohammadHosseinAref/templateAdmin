'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Ico from '@/components/layout/Ico';
import FontPicker from '@/components/layout/FontPicker';
import { type AppSettings, DEFAULTS, SETTINGS_KEY, loadSettings } from '@/types/settings';
import { type BottomNavItem } from '@/types/layout/bottomnav';
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext';
import { UPLOADED_FONT_KEY, injectUploadedFont } from '@/components/layout/utils/font-utils';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  useEffect(() => { setSettings(loadSettings()); }, []);

  return (
    <LocaleProvider lang={settings.language}>
      <DashboardShell settings={settings} onSettings={setSettings}>
        {children}
      </DashboardShell>
    </LocaleProvider>
  );
}

function DashboardShell({
  settings,
  onSettings,
  children,
}: {
  settings: AppSettings;
  onSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  children: React.ReactNode;
}) {
  const t = useLocale();
  const [hydrated, setHydrated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle('dark', settings.isDark);
    root.dir = settings.direction;
    root.style.fontSize = `${settings.fontSize}px`;
    if (settings.fontFamily) {
      root.style.setProperty('--applied-font', `'${settings.fontFamily}', var(--font-vazirmatn), Tahoma, sans-serif`);
    } else {
      root.style.removeProperty('--applied-font');
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated || !settings.fontFamily) return;
    const family = settings.fontFamily;
    try {
      const raw = localStorage.getItem(UPLOADED_FONT_KEY);
      if (raw) {
        const { name, base64 } = JSON.parse(raw) as { name: string; base64: string };
        if (name === family) { injectUploadedFont(name, base64); return; }
      }
    } catch {}
    const id = `gfont-${family.replace(/\s/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;700&display=swap`;
    document.head.appendChild(link);
  }, [hydrated, settings.fontFamily]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  function set<K extends keyof AppSettings>(key: K, val: AppSettings[K]) {
    onSettings((prev) => ({ ...prev, [key]: val }));
  }

  const bottomNavItems: BottomNavItem[] = [
    {
      label: t.bottomNav.home,
      icon: <Ico d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" className="w-6 h-6" />,
      active: true,
      onClick: () => {},
    },
    {
      label: t.bottomNav.reservations,
      icon: <Ico d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" className="w-6 h-6" />,
      active: false,
      onClick: () => {},
    },
    {
      label: t.bottomNav.reports,
      icon: <Ico d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" className="w-6 h-6" />,
      active: false,
      onClick: () => {},
    },
  ];

  return (
    <>
      <DashboardLayout
        settings={settings}
        notifications={[]}
        bottomNavItems={bottomNavItems}
        isFullscreen={isFullscreen}
        onSet={set}
        onReset={() => onSettings(DEFAULTS)}
        onFullscreenToggle={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        }}
        onOpenFontPicker={() => setShowFontPicker(true)}
      >
        {children}
      </DashboardLayout>

      {showFontPicker && (
        <FontPicker
          currentFont={settings.fontFamily}
          onApply={(font) => set('fontFamily', font)}
          onClose={() => setShowFontPicker(false)}
        />
      )}
    </>
  );
}
