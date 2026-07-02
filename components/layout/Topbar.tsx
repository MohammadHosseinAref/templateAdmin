'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Ico from './Ico';
import Pill from './ui/Pill';
import SettingsRow from './ui/SettingsRow';
import DropdownPanel from './ui/DropdownPanel';
import { TopbarColorSwatch } from './ui/ColorSwatch';
import { ICONS } from './data/topbar-data';
import { getDropdownStyle } from './utils/dropdown-utils';
import type { TopbarNotification, TopbarProps } from '@/types/layout/topbar';
import { useLocale } from '@/contexts/LocaleContext';
import { LANG_NAMES, LANG_FLAGS } from '@/lib/locale';

export type { TopbarNotification, TopbarProps };

export default function Topbar({
  direction, isDark, isFullscreen, fontSize, topbarBg, notificationCount,
  notifications, fontFamily, showBottomNav, language, onSidebarToggle, onDarkToggle, onDirectionToggle,
  onFontSizeChange, onFullscreenToggle, onTopbarBgChange, onToggleBottomNav, onReset,
  onOpenFontPicker,
}: TopbarProps) {
  const t = useLocale();
  const router = useRouter();

  const [showSettings, setShowSettings] = useState(false);
  const [settingsStyle, setSettingsStyle] = useState<React.CSSProperties>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifStyle, setNotifStyle] = useState<React.CSSProperties>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileStyle, setProfileStyle] = useState<React.CSSProperties>({});

  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 30);
  }

  function toggleSettings() {
    if (!showSettings && settingsBtnRef.current) {
      setSettingsStyle(getDropdownStyle(settingsBtnRef.current, direction));
    }
    setShowSettings((v) => !v);
    setShowNotifications(false);
    setShowProfile(false);
  }

  function toggleNotifications() {
    if (!showNotifications && notifBtnRef.current) {
      setNotifStyle(getDropdownStyle(notifBtnRef.current, direction));
    }
    setShowNotifications((v) => !v);
    setShowSettings(false);
    setShowProfile(false);
  }

  function toggleProfile() {
    if (!showProfile && profileBtnRef.current) {
      setProfileStyle(getDropdownStyle(profileBtnRef.current, direction));
    }
    setShowProfile((v) => !v);
    setShowSettings(false);
    setShowNotifications(false);
  }

  const headerBg = topbarBg ? { backgroundColor: topbarBg } : undefined;

  return (
    <>
      {/* â”€â”€ Header bar â”€â”€ */}
      <header
        className="sticky top-0 z-20 flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md"
        style={headerBg}
      >
        {/* Hamburger */}
        <button
          onClick={onSidebarToggle}
          aria-label={t.topbar.menuLabel}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0"
        >
          <Ico d={ICONS.hamburger} />
        </button>

        {/* Desktop search */}
        <div className="hidden md:block flex-1 max-w-xs">
          <div className="relative">
            <input
              type="text"
              placeholder={t.topbar.searchPlaceholder}
              className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 rounded-xl py-2 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <Ico d={ICONS.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1" />

        {/* Mobile search overlay */}
        {searchOpen && (
          <div
            className="md:hidden absolute inset-0 z-10 flex items-center gap-2 px-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
            style={headerBg}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.topbar.searchPlaceholder}
              className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0"
            >
              <Ico d={ICONS.close} />
            </button>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Mobile: search */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            onClick={openSearch}
            aria-label={t.topbar.searchPlaceholder}
          >
            <Ico d={ICONS.search} />
          </button>

          {/* Desktop: dark mode */}
          <button
            onClick={onDarkToggle}
            aria-label={t.topbar.toggleDark}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <Ico d={isDark ? ICONS.sun : ICONS.moon} />
          </button>

          {/* Notifications bell */}
          <button
            ref={notifBtnRef}
            onClick={toggleNotifications}
            aria-label={t.topbar.notifications}
            className={`relative p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400
              ${showNotifications ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
            `}
          >
            <Ico d={ICONS.bell} />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none border-2 border-white dark:border-slate-800">
                {notificationCount > 9 ? t.notifications.overflowCount : notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            ref={settingsBtnRef}
            onClick={toggleSettings}
            aria-label={t.topbar.settings}
            className={`p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400 ${showSettings ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Ico d={ICONS.settings} />
          </button>

          {/* Topbar color */}
          <div className="mx-1">
            <TopbarColorSwatch value={topbarBg || '#ffffff'} onChange={onTopbarBgChange} title={t.topbar.headerColor} />
          </div>

          <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Profile */}
          <button
            ref={profileBtnRef}
            onClick={toggleProfile}
            aria-label={t.topbar.profile}
            className={`p-1.5 rounded-xl transition-colors ${showProfile ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">Ù…</span>
            </div>
          </button>
        </div>
      </header>

      {/* â”€â”€ Profile dropdown â”€â”€ */}
      {showProfile && (
        <DropdownPanel style={profileStyle} onClose={() => setShowProfile(false)}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-base">Ù…</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 leading-none">{t.topbar.adminName}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.topbar.adminEmail}</p>
            </div>
          </div>
          <div className="py-1">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              <Ico d={ICONS.user} className="w-4 h-4 text-slate-400" />
              {t.topbar.profile}
            </button>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Ico d={ICONS.logout} className="w-4 h-4" />
              {t.topbar.logout}
            </button>
          </div>
        </DropdownPanel>
      )}

      {/* â”€â”€ Notification dropdown â”€â”€ */}
      {showNotifications && (
        <DropdownPanel style={notifStyle} onClose={() => setShowNotifications(false)}>
          <div className="flex-shrink-0 px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.notifications.title}</p>
            {notifications.length > 0 && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                {notifications.length} {t.notifications.newSuffix}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto settings-scroll">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                  <Ico d={ICONS.bell} className="w-5 h-5 text-slate-300 dark:text-slate-500" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500">{t.notifications.empty}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Ico d={ICONS.bell} className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">{notif.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{notif.subtitle}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                className="w-full px-4 py-2.5 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors font-medium"
              >
                {t.notifications.viewAll}
              </button>
            </div>
          )}
        </DropdownPanel>
      )}

      {/* â”€â”€ Settings dropdown â”€â”€ */}
      {showSettings && (
        <DropdownPanel style={settingsStyle} onClose={() => setShowSettings(false)}>
          <div className="flex-shrink-0 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.settingsPanel.title}</p>
          </div>

          <div className="flex-1 overflow-y-auto settings-scroll">
            <SettingsRow
              onClick={onDarkToggle}
              icon={<Ico d={isDark ? ICONS.sun : ICONS.moon} className="w-4 h-4 text-slate-400" />}
              label={isDark ? t.settingsPanel.lightMode : t.settingsPanel.darkMode}
              right={<Pill on={isDark} />}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <SettingsRow
              onClick={onDirectionToggle}
              icon={<Ico d={ICONS.direction} className="w-4 h-4 text-slate-400" />}
              label={t.settingsPanel.direction}
              right={
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                  {direction.toUpperCase()}
                </span>
              }
            />
            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                <Ico d={ICONS.textSize} className="w-4 h-4 text-slate-400" />
                {t.settingsPanel.fontSize}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-600 dark:text-slate-300 hover:text-teal-600 font-bold text-sm transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full min-w-[2rem] text-center tabular-nums">
                  {fontSize}
                </span>
                <button
                  onClick={() => onFontSizeChange(Math.min(35, fontSize + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-600 dark:text-slate-300 hover:text-teal-600 font-bold text-sm transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <SettingsRow
              onClick={onFullscreenToggle}
              icon={<Ico d={isFullscreen ? ICONS.compress : ICONS.expand} className="w-4 h-4 text-slate-400" />}
              label={t.settingsPanel.fullscreen}
              right={<Pill on={isFullscreen} />}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <SettingsRow
              onClick={() => { onOpenFontPicker(); setShowSettings(false); }}
              icon={<Ico d={ICONS.font} className="w-4 h-4 text-slate-400" />}
              label={t.settingsPanel.fontPicker}
              right={
                fontFamily
                  ? <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full max-w-[7rem] truncate">{fontFamily}</span>
                  : undefined
              }
            />
            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            <SettingsRow
              onClick={() => { router.push('/language'); setShowSettings(false); }}
              icon={<Ico d={ICONS.globe} className="w-4 h-4 text-slate-400" />}
              label={t.settingsPanel.language}
              right={
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                  {LANG_FLAGS[language]} {LANG_NAMES[language]}
                </span>
              }
            />

            <div className="md:hidden">
              <div className="h-px bg-slate-100 dark:bg-slate-700" />
              <SettingsRow
                onClick={onToggleBottomNav}
                icon={<Ico d={ICONS.bottomBar} className="w-4 h-4 text-slate-400" />}
                label={t.settingsPanel.bottomNav}
                right={<Pill on={showBottomNav} />}
              />
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { onReset(); setShowSettings(false); }}
              className="w-full px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-start flex items-center gap-2"
            >
              <Ico d={ICONS.reset} className="w-4 h-4" />
              {t.settingsPanel.reset}
            </button>
          </div>
        </DropdownPanel>
      )}
    </>
  );
}
