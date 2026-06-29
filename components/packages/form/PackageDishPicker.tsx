'use client';

import { useState } from 'react';
import type { PackageDish, PackageDishPickerProps } from '@/types/packages';
import { useLocale } from '@/contexts/LocaleContext';
import { InlineAdd } from '@/components/ui/FormWidgets';

export default function PackageDishPicker({
  dishes, menuCategories, menuItems,
  onDishesChange, onAddMenuCategory, onAddMenuSub,
}: PackageDishPickerProps) {
  const t = useLocale().packages;

  const [dishSearch,    setDishSearch]    = useState('');
  const [dishCatFilter, setDishCatFilter] = useState<string | null>(null);
  const [dishSubFilter, setDishSubFilter] = useState<string | null>(null);
  const [addingMenuCat, setAddingMenuCat] = useState(false);
  const [addingMenuSub, setAddingMenuSub] = useState(false);

  const catFiltered    = menuItems.filter((m) => {
    if (dishCatFilter === null) return true;
    if (dishCatFilter === '__none__') return !m.categoryId || m.categoryId === '';
    return m.categoryId === dishCatFilter;
  });
  const subFiltered    = dishSubFilter ? catFiltered.filter((m) => m.subCategory === dishSubFilter) : catFiltered;
  const filteredDishes = dishSearch ? subFiltered.filter((m) => m.name.toLowerCase().includes(dishSearch.toLowerCase())) : subFiltered;
  const activeCat      = dishCatFilter && dishCatFilter !== '__none__' ? menuCategories.find((c) => c.id === dishCatFilter) ?? null : null;

  function getDishQty(dishId: string) {
    return dishes.find((d) => d.dishId === dishId)?.quantity ?? 0;
  }

  function toggleDish(dishId: string) {
    const existing = dishes.find((d) => d.dishId === dishId);
    onDishesChange(existing ? dishes.filter((d) => d.dishId !== dishId) : [...dishes, { dishId, quantity: 1 }]);
  }

  function setDishQty(dishId: string, qty: number) {
    if (qty <= 0) { onDishesChange(dishes.filter((d) => d.dishId !== dishId)); return; }
    onDishesChange(dishes.map((d): PackageDish => d.dishId === dishId ? { ...d, quantity: qty } : d));
  }

  return (
    <div className="space-y-4">

      {/* Category filter */}
      <div className="space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              {t.fields.category}
            </label>
            <select
              value={dishCatFilter ?? ''}
              onChange={(e) => { const v = e.target.value; setDishCatFilter(v === '' ? null : v); setDishSubFilter(null); }}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">{t.labels.allDishes}</option>
              {menuCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="__none__">{t.labels.uncategorized}</option>
            </select>
          </div>
          {addingMenuCat ? (
            <div className="flex-1">
              <InlineAdd
                placeholder={t.placeholders.addCategory}
                onAdd={(name) => { onAddMenuCategory(name); setAddingMenuCat(false); }}
                onCancel={() => setAddingMenuCat(false)}
              />
            </div>
          ) : (
            <button type="button" onClick={() => setAddingMenuCat(true)}
              className="flex-shrink-0 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors mb-0.5"
              style={{ color: '#14b8a6', border: '1.5px dashed #99f6e4', backgroundColor: 'transparent' }}
            >
              + {t.labels.addCategory}
            </button>
          )}
        </div>

        {activeCat && (
          <div className="flex gap-2 items-end ps-3 border-s-2 border-teal-200 dark:border-teal-800">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
                {t.fields.subCategory}
              </label>
              <select
                value={dishSubFilter ?? ''}
                onChange={(e) => setDishSubFilter(e.target.value === '' ? null : e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="">— {activeCat.name} ({t.labels.allDishes}) —</option>
                {activeCat.subs.map((sub) => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            {addingMenuSub ? (
              <div className="flex-1">
                <InlineAdd
                  placeholder={t.placeholders.addSub}
                  onAdd={(sub) => { onAddMenuSub(activeCat.id, sub); setAddingMenuSub(false); }}
                  onCancel={() => setAddingMenuSub(false)}
                />
              </div>
            ) : (
              <button type="button" onClick={() => setAddingMenuSub(true)}
                className="flex-shrink-0 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors mb-0.5"
                style={{ color: '#94a3b8', border: '1px dashed #cbd5e1', backgroundColor: 'transparent' }}
              >
                + {t.labels.addSub}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        value={dishSearch}
        onChange={(e) => setDishSearch(e.target.value)}
        placeholder={t.placeholders.selectDish}
        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      />

      {/* Dish grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredDishes.map((dish) => {
          const qty      = getDishQty(dish.id);
          const selected = qty > 0;
          return (
            <div
              key={dish.id}
              className="relative rounded-xl border-2 p-3 cursor-pointer transition-all"
              style={{ borderColor: selected ? '#14b8a6' : '#e2e8f0', backgroundColor: selected ? '#f0fdfa' : 'transparent' }}
              onClick={() => toggleDish(dish.id)}
            >
              {selected && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#14b8a6' }}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight pr-1">{dish.name}</p>
              <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-1">{dish.price.toFixed(2)} €</p>
              {dish.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="inline-block text-xs px-1.5 py-0.5 rounded-full mr-1 mt-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {tag}
                </span>
              ))}
              {selected && (
                <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => setDishQty(dish.id, qty - 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-teal-600 border border-teal-300 hover:bg-teal-50 transition-colors text-sm font-bold">−</button>
                  <span className="text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#14b8a6', color: '#fff' }}>
                    {qty}
                  </span>
                  <button type="button" onClick={() => setDishQty(dish.id, qty + 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-teal-600 border border-teal-300 hover:bg-teal-50 transition-colors text-sm font-bold">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">{t.labels.noDishes}</p>
      )}

      {/* Selected summary */}
      {dishes.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.labels.includesItems}</p>
          {dishes.map((pd) => {
            const dish = menuItems.find((m) => m.id === pd.dishId);
            if (!dish) return null;
            return (
              <div key={pd.dishId} className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate flex-1">{dish.name}</span>
                <span className="text-xs text-slate-400 flex-shrink-0">×{pd.quantity}</span>
                <button type="button" onClick={() => toggleDish(pd.dishId)}
                  className="text-slate-300 dark:text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {dishes.length === 0 && filteredDishes.length > 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">{t.labels.noDishes}</p>
      )}
    </div>
  );
}
