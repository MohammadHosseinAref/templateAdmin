'use client';

import type { PackageDetailPanelProps } from '@/types/packages';
import { useLocale } from '@/contexts/LocaleContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { MENU_ITEMS } from '@/contexts/PackagesContext';

type DishRow  = { name: string; qty: number; price: number };
type SubGroup = { sub: string; rows: DishRow[] };
type CatGroup = { cat: string; subs: SubGroup[] };

export default function PackageDetailPanel({ pkg, onEdit, onClose }: PackageDetailPanelProps) {
  const t = useLocale().packages;
  const { categories } = useCategories();

  const discountAmt = pkg.discountPercent > 0 ? pkg.price * (pkg.discountPercent / 100) : 0;
  const finalPrice  = pkg.price - discountAmt;

  const visibleCfg = {
    visible:  { bg: '#f0f9ff', color: '#0284c7', label: t.labels.shownOnMenu },
    inactive: { bg: '#fffbeb', color: '#b45309', label: t.labels.inactiveOnMenu },
    hidden:   { bg: '#f8fafc', color: '#94a3b8', label: t.labels.hiddenFromMenu },
  }[pkg.visible];

  const groups: CatGroup[] = [];
  const catIdx: Record<string, number> = {};
  const subIdx: Record<string, number> = {};

  for (const pd of pkg.dishes) {
    const dish = MENU_ITEMS.find((m) => m.id === pd.dishId);
    if (!dish) continue;
    const catKey = dish.categoryId || '—';
    const subKey = `${catKey}::${dish.subCategory || ''}`;

    if (catIdx[catKey] === undefined) { catIdx[catKey] = groups.length; groups.push({ cat: catKey, subs: [] }); }
    const grp = groups[catIdx[catKey]];
    if (subIdx[subKey] === undefined) { subIdx[subKey] = grp.subs.length; grp.subs.push({ sub: dish.subCategory || '', rows: [] }); }
    grp.subs[subIdx[subKey]].rows.push({ name: dish.name, qty: pd.quantity, price: dish.price });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{pkg.description}</p>
          )}
        </div>
        <button type="button" onClick={onClose}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Dishes */}
        {pkg.dishes.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.sections.dishes}</p>
            <div className="space-y-4">
              {groups.map((grp) => {
                const catName = categories.find((c) => c.id === grp.cat)?.name ?? grp.cat;
                return (
                  <div key={grp.cat}>
                    <p className="text-xs font-bold mb-2 px-2 py-0.5 rounded-lg inline-block" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>{catName}</p>
                    <div className="space-y-3 ms-1">
                      {grp.subs.map((sub) => (
                        <div key={`${grp.cat}-${sub.sub}`}>
                          {sub.sub && <p className="text-xs font-semibold mb-1.5" style={{ color: '#6366f1' }}>{sub.sub}</p>}
                          <div className="space-y-1.5">
                            {sub.rows.map((row, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#14b8a6', color: '#fff' }}>
                                  {row.qty}
                                </span>
                                <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{row.name}</span>
                                <span className="text-xs tabular-nums text-slate-400">{row.price.toFixed(2)} €</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Addons */}
        {pkg.addons.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.sections.addons}</p>
            <div className="space-y-1.5">
              {pkg.addons.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-200">{a.name}</span>
                  <span className="tabular-nums font-semibold" style={{ color: '#0d9488' }}>+{a.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="rounded-xl p-3 space-y-2" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">{t.labels.saleLabel}</span>
            <span className="font-semibold text-slate-700">{pkg.price > 0 ? `${pkg.price.toFixed(2)} €` : '—'}</span>
          </div>
          {pkg.discountPercent > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  {t.labels.discountLabel}
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>{pkg.discountPercent}%</span>
                </span>
                <span className="font-semibold" style={{ color: '#f59e0b' }}>− {discountAmt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm pt-1.5" style={{ borderTop: '1px solid #e2e8f0' }}>
                <span className="font-bold text-slate-700">{t.labels.finalPrice}</span>
                <span className="font-black" style={{ color: '#14b8a6' }}>{finalPrice.toFixed(2)} €</span>
              </div>
            </>
          )}
        </section>

        {/* Meta */}
        <section className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.sections.settings}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: visibleCfg.bg, color: visibleCfg.color }}>{visibleCfg.label}</span>
            {pkg.alwaysAvailable ? (
              <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>{t.labels.alwaysAvailable}</span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>{pkg.dateFrom} → {pkg.dateTo}</span>
            )}
            {pkg.maxQuantity > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>{t.labels.globalQty}: {pkg.maxQuantity}</span>
            )}
            {pkg.maxQuantityPerPerson > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>{t.labels.perPerson}: {pkg.maxQuantityPerPerson}</span>
            )}
          </div>
          {pkg.branches.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {pkg.branches.map((b) => (
                <span key={b} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>{b}</span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
        <button type="button" onClick={onEdit}
          className="w-full py-2.5 text-sm font-semibold rounded-xl transition-colors"
          style={{ backgroundColor: '#14b8a6', color: '#fff' }}
        >
          {t.labels.edit}
        </button>
      </div>
    </div>
  );
}
