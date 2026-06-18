import type { LangCode } from '@/types/settings';

export interface TopbarNotification {
  id: number;
  title: string;
  subtitle: string;
  time: string;
}

export interface TopbarProps {
  direction: 'rtl' | 'ltr';
  isDark: boolean;
  isFullscreen: boolean;
  fontSize: number;
  topbarBg: string;
  notificationCount: number;
  notifications: TopbarNotification[];
  fontFamily: string;
  showBottomNav: boolean;
  language: LangCode;
  onSidebarToggle: () => void;
  onOpenFontPicker: () => void;
  onDarkToggle: () => void;
  onDirectionToggle: () => void;
  onFontSizeChange: (n: number) => void;
  onFullscreenToggle: () => void;
  onTopbarBgChange: (c: string) => void;
  onToggleBottomNav: () => void;
  onReset: () => void;
}
