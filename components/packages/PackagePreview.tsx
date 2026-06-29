'use client';

import { useState } from 'react';
import type { MenuItem } from '@/types/menu';
import type { PackagePreviewProps } from '@/types/packages';
import { Card } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { EditableLabel } from '@/components/ui/FormWidgets';

export default function PackagePreview({
  draft,
  menuItems,
  stockItems,
  categories,
  menuCategories,
  onNameChange,
  onCategoryLabelChange,
}: PackagePreviewProps) {
  const t = useLocale().packages;

  /* Track which sub-category headers the user has hidden */
  const [hiddenSubs, setHiddenSubs] = useState<Set<string>>(new Set());

  const toggleSub = (key: string) =>
    setHiddenSubs((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const cat      = categories.find((c) => c.id === draft.categoryId);
  const catLabel = [cat?.name, draft.subCategory].filter(Boolean).join(' › ');

  type DishItem  = { dishId: string; qty: number; dish: MenuItem };
  type SubGroup  = { subName: string; items: DishItem[] };
  type CatGroup  = { catId: string; label: string; subs: SubGroup[] };

  /* Build nested category → sub-category tree */
  const groups: CatGroup[]          = [];
  const catIdx:  Record<string, number> = {};
  const subIdx:  Record<string, number> = {};

  for (const pd of draft.dishes) {
    const dish = menuItems.find((m) => m.id === pd.dishId);
    if (!dish) continue;

    const catId       = dish.categoryId || '__none__';
    const subName     = dish.subCategory || '';
    const defaultCatLabel = catId === '__none__'
      ? t.labels.uncategorized
      : (menuCategories.find((c) => c.id === catId)?.name ?? t.labels.uncategorized);
    const label = draft.categoryLabels[catId] || defaultCatLabel;

    if (catIdx[catId] === undefined) {
      catIdx[catId] = groups.length;
      subIdx[catId] = 0;
      groups.push({ catId, label, subs: [] });
    }
    const grp = groups[catIdx[catId]];

    const subKey = `${catId}::${subName}`;
    if (subIdx[subKey] === undefined) {
      subIdx[subKey] = grp.subs.length;
      grp.subs.push({ subName, items: [] });
    }
    grp.subs[subIdx[subKey]].items.push({ dishId: pd.dishId, qty: pd.quantity, dish });
  }

  /* Ingredient cost */
  let ingredientCost   = 0;
  let hasRecipePricing = false;
  for (const pd of draft.dishes) {
    const dish = menuItems.find((m) => m.id === pd.dishId);
    if (!dish) continue;
    const dishCost = dish.recipe.reduce((sum, ing) => {
      const price = ing.price ?? 0;
      hasRecipePricing = hasRecipePricing || price > 0;
      return sum + price * pd.quantity;
    }, 0);
    ingredientCost += dishCost;
  }

  const salePrice     = draft.price;
  const discountAmt   = draft.discountPercent > 0 ? salePrice * (draft.discountPercent / 100) : 0;
  const finalPrice    = salePrice - discountAmt;
  const profit        = finalPrice - ingredientCost;

  return (
    <Card title={t.labels.previewTitle}>

      {/* Package name — editable */}
      <div>
        <p className="text-xs font-medium text-teal-500 dark:text-teal-400 mb-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          {t.fields.name}
        </p>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t.placeholders.name}
          className="w-full text-xl font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
          style={{
            color: draft.name ? '#0f172a' : '#94a3b8',
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        />
      </div>

      {/* Category breadcrumb */}
      {catLabel && (
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#14b8a6' }}>
          {catLabel}
        </p>
      )}

      {/* Dishes — nested tree: category → sub-category → dishes */}
      {groups.length > 0 && (
        <div className="space-y-4">
          {groups.map((group) => {
            const totalDishes = group.subs.reduce((n, s) => n + s.items.length, 0);
            return (
              <div key={group.catId}>
                {/* Category header — editable */}
                <div className="flex items-center gap-2 mb-2">
                  <EditableLabel
                    value={group.label}
                    onChange={(v) => onCategoryLabelChange(group.catId, v)}
                  />
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}
                  >
                    {totalDishes}
                  </span>
                </div>

                {/* Sub-categories */}
                <div className="space-y-2 ps-3 border-s-2 border-teal-100 dark:border-teal-900">
                  {group.subs.map((sub) => {
                    const subKey    = `${group.catId}::${sub.subName}`;
                    const subHidden = hiddenSubs.has(subKey);
                    const hasSub    = sub.subName !== '';

                    return (
                      <div key={subKey}>
                        {/* Sub-category header — only when sub exists and not hidden */}
                        {hasSub && !subHidden && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className="text-xs font-semibold"
                              style={{ color: '#6366f1' }}
                            >
                              {sub.subName}
                            </span>
                            <button
                              type="button"
                              title="حذف نمایش زیردسته"
                              onClick={() => toggleSub(subKey)}
                              className="w-4 h-4 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                              style={{ color: '#cbd5e1', backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Dishes */}
                        <div className={`space-y-1 ${hasSub && !subHidden ? 'ps-3 border-s border-indigo-100 dark:border-indigo-900' : ''}`}>
                          {sub.items.map(({ dishId, qty, dish }) => (
                            <div key={dishId} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-300 truncate flex-1 leading-tight">
                                {dish.name}
                              </span>
                              <span className="text-xs text-slate-400 flex-shrink-0 mx-2">×{qty}</span>
                              <span className="text-xs font-semibold text-teal-600 flex-shrink-0">
                                {(dish.price * qty).toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {draft.dishes.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">{t.labels.noDishes}</p>
      )}

      {/* Add-ons list */}
      {draft.addons.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.labels.extras}</p>
          {draft.addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300 truncate flex-1">{addon.name}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold ml-2"
                style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
              >
                +{addon.price.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Date badge */}
      <div>
        {draft.alwaysAvailable ? (
          <span
            className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
          >
            {t.labels.alwaysAvailable}
          </span>
        ) : (
          <span
            className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ backgroundColor: '#fffbeb', color: '#b45309' }}
          >
            {draft.dateFrom || '—'} → {draft.dateTo || '—'}
          </span>
        )}
      </div>

      {/* Branch badges */}
      {draft.branches.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {draft.branches.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs" style={{ color: '#f59e0b' }}>{t.labels.allBranches}</p>
      )}

      {/* Price breakdown */}
      <div
        className="rounded-xl p-3 space-y-2"
        style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t.labels.costLabel}</span>
          <span className="font-semibold" style={{ color: '#ef4444' }}>
            {hasRecipePricing ? `${ingredientCost.toFixed(2)} €` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t.labels.saleLabel}</span>
          <span className="font-semibold" style={{ color: '#0ea5e9' }}>
            {salePrice > 0 ? `${salePrice.toFixed(2)} €` : '—'}
          </span>
        </div>
        {draft.discountPercent > 0 && salePrice > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1">
                {t.labels.discountLabel}
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
                  {draft.discountPercent}%
                </span>
              </span>
              <span className="font-semibold" style={{ color: '#f59e0b' }}>
                − {discountAmt.toFixed(2)} €
              </span>
            </div>
            <div
              className="flex items-center justify-between text-sm pt-2"
              style={{ borderTop: '1px solid #e2e8f0' }}
            >
              <span className="font-bold text-slate-700">{t.labels.finalPrice}</span>
              <span className="font-black text-base" style={{ color: '#14b8a6' }}>
                {finalPrice.toFixed(2)} €
              </span>
            </div>
          </>
        )}
        <div
          className="flex items-center justify-between text-sm pt-2"
          style={{ borderTop: '1px solid #e2e8f0' }}
        >
          <span className="font-semibold text-slate-600">{t.labels.profitLabel}</span>
          <span
            className="font-bold text-base"
            style={{ color: hasRecipePricing && finalPrice > 0 ? (profit >= 0 ? '#16a34a' : '#ef4444') : '#94a3b8' }}
          >
            {hasRecipePricing && finalPrice > 0 ? `${profit.toFixed(2)} €` : '—'}
          </span>
        </div>
      </div>

      {/* Max quantity badges */}
      {(draft.maxQuantity > 0 || draft.maxQuantityPerPerson > 0) && (
        <div className="flex gap-2 flex-wrap">
          {draft.maxQuantity > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
              {t.labels.globalQty}: {draft.maxQuantity}
            </span>
          )}
          {draft.maxQuantityPerPerson > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {t.labels.perPerson}: {draft.maxQuantityPerPerson}
            </span>
          )}
        </div>
      )}

      {/* Visibility badge */}
      <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
        {(() => {
          const cfg = {
            visible:  { bg: '#f0f9ff', color: '#0284c7', label: t.labels.shownOnMenu,    eyePath: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            inactive: { bg: '#fffbeb', color: '#b45309', label: t.labels.inactiveOnMenu, eyePath: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            hidden:   { bg: '#f8fafc', color: '#94a3b8', label: t.labels.hiddenFromMenu, eyePath: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' },
          }[draft.visible];
          return (
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={cfg.eyePath} />
              </svg>
              {cfg.label}
            </span>
          );
        })()}
      </div>
    </Card>
  );
}
