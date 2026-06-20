'use client';

import { useState } from 'react';
import './layout.css';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import type { AppSettings } from '@/types/settings';
import type { TopbarNotification } from '@/types/layout/topbar';
import type { BottomNavItem } from '@/types/layout/bottomnav';

interface DashboardLayoutProps {
  settings: AppSettings;
  notifications: TopbarNotification[];
  bottomNavItems: BottomNavItem[];
  isFullscreen: boolean;
  onSet: <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => void;
  onReset: () => void;
  onFullscreenToggle: () => void;
  onOpenFontPicker: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  settings,
  notifications,
  bottomNavItems,
  isFullscreen,
  onSet,
  onReset,
  onFullscreenToggle,
  onOpenFontPicker,
  children,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen((v) => !v);
    } else {
      onSet('sidebarCollapsed', !settings.sidebarCollapsed);
    }
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Sidebar
          direction={settings.direction}
          width={settings.sidebarWidth}
          isCollapsed={settings.sidebarCollapsed}
          bgColor={settings.sidebarBg}
          textColor={settings.sidebarTextColor}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          onWidthChange={(w) => onSet('sidebarWidth', w)}
          onBgColorChange={(c) => onSet('sidebarBg', c)}
          onTextColorChange={(c) => onSet('sidebarTextColor', c)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar
            direction={settings.direction}
            isDark={settings.isDark}
            isFullscreen={isFullscreen}
            fontSize={settings.fontSize}
            topbarBg={settings.topbarBg}
            notificationCount={notifications.length}
            notifications={notifications}
            fontFamily={settings.fontFamily}
            showBottomNav={settings.showBottomNav}
            onSidebarToggle={toggleSidebar}
            onDarkToggle={() => onSet('isDark', !settings.isDark)}
            onDirectionToggle={() => onSet('direction', settings.direction === 'rtl' ? 'ltr' : 'rtl')}
            onFontSizeChange={(n) => onSet('fontSize', n)}
            onFullscreenToggle={onFullscreenToggle}
            onTopbarBgChange={(c) => onSet('topbarBg', c)}
            language={settings.language}
            onToggleBottomNav={() => onSet('showBottomNav', !settings.showBottomNav)}
            onReset={onReset}
            onOpenFontPicker={onOpenFontPicker}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>

      <BottomNav items={bottomNavItems} visible={settings.showBottomNav} />
    </>
  );
}
