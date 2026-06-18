'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Ico from './Ico';
import { SidebarColorSwatch } from './ui/ColorSwatch';
import { PATHS, getNavItems } from './data/sidebar-data';
import type { SidebarProps, SidebarBodyProps } from '@/types/layout/sidebar';
import { useLocale } from '@/contexts/LocaleContext';

export type { SidebarProps };

// â”€â”€ Sidebar body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SidebarBody({
  isCollapsed, direction, bgColor, textColor, pathname,
  onLinkClick, onBgColorChange, onTextColorChange,
}: SidebarBodyProps) {
  const t = useLocale();
  const navItems = getNavItems(t);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [subExpanded, setSubExpanded] = useState<Set<string>>(new Set());

  function toggleItem(href: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  function toggleSubItem(href: string) {
    setSubExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  return (
    <>
      {/* â”€â”€ Logo â”€â”€ */}
      <div
        className={`flex items-center gap-3 flex-shrink-0 py-4 border-b ${isCollapsed ? 'flex-col px-3' : 'px-4'}`}
        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
      >
        <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base">S</span>
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-none" style={{ color: textColor }}>{t.app.name}</p>
            <p className="text-[10px] mt-1 leading-none" style={{ color: textColor, opacity: 0.55 }}>{t.app.subtitle}</p>
          </div>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          style={{ color: textColor, opacity: 0.6 }}
          title={t.sidebar.logout}
        >
          <Ico d={PATHS.logout} className="w-4 h-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* â”€â”€ Navigation â”€â”€ */}
      <div
        className="flex-1 overflow-y-auto sidebar-scroll"
        style={{
          '--sb-thumb': textColor,
          direction: direction === 'rtl' ? 'ltr' : 'rtl',
        } as React.CSSProperties}
      >
        <nav className="py-3 px-2" style={{ direction }}>
          {navItems.map(({ href, label, key, children }) => {
            const hasChildren = !!children?.length;
            const isOpen = expanded.has(href);
            const isActive = pathname === href
              || (children?.some((c) => pathname === c.href || c.children?.some((g) => pathname === g.href)) ?? false);

            return (
              <div key={href}>
                {/* â”€â”€ Level 1 â”€â”€ */}
                {hasChildren && !isCollapsed ? (
                  <div
                    className={`flex items-center rounded-xl mb-0.5 overflow-hidden transition-colors duration-150
                      ${isActive ? 'bg-teal-500' : 'hover:bg-white/10'}
                    `}
                  >
                    <Link
                      href={href}
                      onClick={onLinkClick}
                      className="flex-1 flex items-center gap-3 py-2.5 ps-3 min-w-0"
                      style={{ color: isActive ? '#ffffff' : textColor }}
                    >
                      <Ico d={PATHS[key]} strokeWidth={1.6} />
                      <span className="flex-1 text-sm font-medium truncate text-start">{label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleItem(href)}
                      className="flex-shrink-0 p-3 hover:bg-white/15 transition-colors"
                      style={{ color: isActive ? '#ffffff' : textColor }}
                      aria-label={isOpen ? t.sidebar.collapseSubmenu : t.sidebar.expandSubmenu}
                    >
                      <Ico
                        d={PATHS.chevronDown}
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={1.6}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={href}
                    onClick={onLinkClick}
                    title={isCollapsed ? label : undefined}
                    className={`flex items-center gap-3 rounded-xl mb-0.5 transition-all duration-150
                      ${isCollapsed ? 'justify-center py-3 px-0' : 'py-2.5 px-3'}
                      ${isActive ? 'bg-teal-500' : 'hover:bg-white/10 active:bg-white/15'}
                    `}
                    style={{ color: isActive ? '#ffffff' : textColor }}
                  >
                    <Ico d={PATHS[key]} strokeWidth={1.6} />
                    {!isCollapsed && <span className="flex-1 text-sm font-medium truncate">{label}</span>}
                  </Link>
                )}

                {/* â”€â”€ Level 2 â”€â”€ */}
                {hasChildren && !isCollapsed && isOpen && children && (
                  <div
                    className="ms-3 mb-1 border-s-2 ps-2"
                    style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                  >
                    {children.map((sub) => {
                      const hasGrand = !!sub.children?.length;
                      const isSubActive = pathname === sub.href;
                      const isSubOpen = subExpanded.has(sub.href);

                      return (
                        <div key={sub.href}>
                          {hasGrand ? (
                            <div
                              className={`flex items-center rounded-lg mb-0.5 overflow-hidden transition-colors duration-150
                                ${isSubActive ? 'bg-white/20' : 'hover:bg-white/10'}
                              `}
                            >
                              <Link
                                href={sub.href}
                                onClick={onLinkClick}
                                className="flex-1 flex items-center gap-2 py-2 ps-3 text-sm min-w-0"
                                style={{ color: textColor }}
                              >
                                <span
                                  className="w-1 h-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: textColor, opacity: 0.5 }}
                                />
                                <span className={`truncate ${isSubActive ? 'font-semibold' : ''}`}>{sub.label}</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleSubItem(sub.href)}
                                className="flex-shrink-0 px-2.5 py-2 hover:bg-white/15 transition-colors"
                                style={{ color: textColor }}
                                aria-label={isSubOpen ? t.sidebar.collapse : t.sidebar.expand}
                              >
                                <Ico
                                  d={PATHS.chevronDown}
                                  className={`w-3 h-3 transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`}
                                  strokeWidth={1.6}
                                />
                              </button>
                            </div>
                          ) : (
                            <Link
                              href={sub.href}
                              onClick={onLinkClick}
                              className={`flex items-center gap-2 rounded-lg py-2 px-3 text-sm transition-all duration-150
                                ${isSubActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10 active:bg-white/15'}
                              `}
                              style={{ color: textColor }}
                            >
                              <span
                                className="w-1 h-1 rounded-full flex-shrink-0"
                                style={{ backgroundColor: textColor, opacity: 0.5 }}
                              />
                              {sub.label}
                            </Link>
                          )}

                          {/* â”€â”€ Level 3 â”€â”€ */}
                          {hasGrand && isSubOpen && sub.children && (
                            <div
                              className="ms-4 mb-1 border-s ps-2"
                              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                            >
                              {sub.children.map((grand) => {
                                const isGrandActive = pathname === grand.href;
                                return (
                                  <Link
                                    key={grand.href}
                                    href={grand.href}
                                    onClick={onLinkClick}
                                    className={`flex items-center gap-2 rounded-lg py-1.5 px-3 text-xs transition-all duration-150
                                      ${isGrandActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10 active:bg-white/15'}
                                    `}
                                    style={{ color: textColor, opacity: isGrandActive ? 1 : 0.8 }}
                                  >
                                    <span
                                      className="w-0.5 h-3 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: textColor, opacity: 0.4 }}
                                    />
                                    {grand.label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* â”€â”€ Bottom color pickers â”€â”€ */}
      <div className="flex-shrink-0 border-t p-3" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        {!isCollapsed && (
          <div className="px-1">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: textColor, opacity: 0.45 }}>
              {t.sidebar.colorSection}
            </p>
            <SidebarColorSwatch value={bgColor} onChange={onBgColorChange} label={t.sidebar.bgColor} textColor={textColor} />
            <SidebarColorSwatch value={textColor} onChange={onTextColorChange} label={t.sidebar.textColor} textColor={textColor} />
          </div>
        )}
      </div>
    </>
  );
}

// â”€â”€ Main Sidebar component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Sidebar({
  direction, width, isCollapsed, bgColor, textColor,
  isMobileOpen, onMobileClose, onWidthChange, onBgColorChange, onTextColorChange,
}: SidebarProps) {
  const pathname = usePathname();
  const isResizingRef = useRef(false);
  const onWidthChangeRef = useRef(onWidthChange);
  const directionRef = useRef(direction);

  useEffect(() => { onWidthChangeRef.current = onWidthChange; }, [onWidthChange]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizingRef.current) return;
      const isRTL = directionRef.current === 'rtl';
      const raw = isRTL ? window.innerWidth - e.clientX : e.clientX;
      onWidthChangeRef.current(Math.max(160, Math.min(420, Math.round(raw))));
    }
    function onMouseUp() {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.classList.remove('resizing');
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.classList.add('resizing');
  }

  const displayW = isCollapsed ? 64 : width;
  const effectiveCollapsed = isCollapsed || displayW < 180;

  const bodyProps: SidebarBodyProps = {
    isCollapsed: effectiveCollapsed,
    direction,
    bgColor, textColor, pathname,
    onLinkClick: onMobileClose,
    onBgColorChange, onTextColorChange,
  };

  return (
    <>
      {/* â”€â”€ Desktop: in-flow flex item â”€â”€ */}
      <aside
        className="relative hidden md:flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-300 h-full"
        style={{ width: `${displayW}px`, backgroundColor: bgColor, color: textColor }}
      >
        {!isCollapsed && (
          <div
            className="absolute top-0 bottom-0 w-1.5 z-10 cursor-col-resize hover:bg-white/25 transition-colors touch-none"
            style={{ [direction === 'rtl' ? 'left' : 'right']: 0 }}
            onMouseDown={startResize}
          />
        )}
        <SidebarBody {...bodyProps} />
      </aside>

      {/* â”€â”€ Mobile: fixed overlay â”€â”€ */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside
            className={`absolute top-0 bottom-0 flex flex-col overflow-hidden shadow-2xl w-64
              ${direction === 'rtl' ? 'right-0' : 'left-0'}
            `}
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <SidebarBody {...bodyProps} isCollapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}
