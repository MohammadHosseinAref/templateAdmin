'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { usePackages } from '@/contexts/PackagesContext';
import PackageDetailPanel from './PackageDetailPanel';

export default function PackageList() {
  const t = useLocale().packages;
  const { data, startEdit } = usePackages();
  const { packages, categories } = data;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = packages.find((p) => p.id === selectedId) ?? null;

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <svg className="w-14 h-14 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-sm text-slate-400 dark:text-slate-500">{t.labels.noItems}</p>
      </div>
    );
  }

  return (
    <div className="px-3 pt-3 pb-8">
      <div className="flex gap-4 items-start">

        {/* Cards grid */}
        <div className={`grid gap-3 flex-1 ${selected ? 'sm:grid-cols-1 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {packages.map((pkg) => {
            const cat        = categories.find((c) => c.id === pkg.categoryId);
            const isSelected = pkg.id === selectedId;
            const visibleCfg = {
              visible:  { bg: '#f0f9ff', color: '#0284c7' },
              inactive: { bg: '#fffbeb', color: '#b45309' },
              hidden:   { bg: '#f8fafc', color: '#94a3b8' },
            }[pkg.visible];
            const visibleLabel = pkg.visible === 'visible'
              ? t.labels.shownOnMenu
              : pkg.visible === 'inactive'
              ? t.labels.inactiveOnMenu
              : t.labels.hiddenFromMenu;

            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(isSelected ? null : pkg.id)}
                className="text-start bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 transition-all space-y-3 w-full"
                style={{
                  borderColor: isSelected ? '#14b8a6' : '#e2e8f0',
                  boxShadow: isSelected ? '0 0 0 3px rgba(20,184,166,0.15)' : 'none',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{pkg.name}</p>
                    {cat && <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">{cat.name}</p>}
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform" style={{ color: isSelected ? '#14b8a6' : '#cbd5e1', transform: isSelected ? 'rotate(90deg)' : 'none' }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{pkg.dishes.length} {t.sections.dishes.toLowerCase()}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {pkg.price > 0 ? `${pkg.price.toFixed(2)} €` : '—'}
                  </span>
                  {pkg.discountPercent > 0 && (
                    <><span>·</span><span style={{ color: '#f59e0b' }}>-{pkg.discountPercent}%</span></>
                  )}
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-lg font-medium" style={{ backgroundColor: visibleCfg.bg, color: visibleCfg.color }}>
                    {visibleLabel}
                  </span>
                  {pkg.maxQuantity > 0 && (
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-lg font-medium" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                      Max {pkg.maxQuantity}
                    </span>
                  )}
                  {pkg.addons.length > 0 && (
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-lg font-medium" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                      +{pkg.addons.length} {t.sections.addons}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 lg:sticky lg:top-4">
            <PackageDetailPanel
              pkg={selected}
              onEdit={() => startEdit(selected.id)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
