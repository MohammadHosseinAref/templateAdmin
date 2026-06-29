'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useMenu } from '@/contexts/MenuContext';

function QuickToggle({
  value,
  onChange,
  labelOn,
  labelOff,
  colorOn,
}: {
  value: boolean;
  onChange: () => void;
  labelOn: string;
  labelOff: string;
  colorOn: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
      style={{
        backgroundColor: value ? `${colorOn}18` : '#94a3b818',
        color: value ? colorOn : '#94a3b8',
        border: `1px solid ${value ? colorOn : '#cbd5e1'}`,
      }}
    >
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{
          width: 7,
          height: 7,
          backgroundColor: value ? colorOn : '#94a3b8',
        }}
      />
      {value ? labelOn : labelOff}
    </button>
  );
}

export default function MenuList() {
  const t = useLocale().menu;
  const { data, stockItems, startEdit, toggleAvailable, toggleVisible } = useMenu();
  const { items, categories } = data;
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
        <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        <p className="text-sm">{t.labels.noItems}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-3 pt-2 pb-8">
      {items.map((item) => {
        const cat = categories.find((c) => c.id === item.categoryId);
        const sub = cat?.subs.find((s) => s.name === item.subCategory);
        const catParts = [cat?.name, sub?.name, item.subSubCategory].filter(Boolean);

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
          >
            {/* Photo */}
            <div className="h-36 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 relative">
              {item.photo ? (
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
              {/* Price badge */}
              {item.price > 0 && (
                <span className="absolute top-2 end-2 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  {item.price.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-3.5 gap-2">
              {/* Category */}
              {catParts.length > 0 && (
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide truncate">
                  {catParts.join(' › ')}
                </p>
              )}

              {/* Name */}
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2">
                {item.name}
              </p>

              {/* Branches */}
              {item.branches.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.branches.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${
                      i === 0
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {i === 0 && '★ '}{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Info row */}
              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-auto">
                {item.prepTime > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.prepTime} {t.labels.prepTimeUnit}
                  </span>
                )}
                {item.recipe.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOpenRecipeId(openRecipeId === item.id ? null : item.id)}
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors"
                    style={{
                      backgroundColor: openRecipeId === item.id ? '#14b8a610' : 'transparent',
                      color: openRecipeId === item.id ? '#14b8a6' : undefined,
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75m-7.5 5.25h13.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v13.5a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {item.recipe.length}
                    <svg
                      className="w-3 h-3 transition-transform"
                      style={{ transform: openRecipeId === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Recipe expand panel */}
              {openRecipeId === item.id && item.recipe.length > 0 && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 overflow-hidden">
                  <ul className="divide-y divide-slate-200 dark:divide-slate-600">
                    {item.recipe.map((ing) => {
                      const stock = stockItems.find((s) => s.id === ing.stockId);
                      return (
                        <li key={ing.stockId} className="flex items-center justify-between px-3 py-1.5 text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                            {stock?.name ?? ing.stockId}
                          </span>
                          <span className="flex items-center gap-2 flex-shrink-0 text-slate-400 dark:text-slate-500 ms-2">
                            <span>{ing.quantity} {stock?.unit ?? ''}</span>
                            {ing.price != null && ing.price > 0 && (
                              <span className="text-teal-600 dark:text-teal-400 font-semibold">{ing.price.toFixed(2)} €</span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {(() => {
                    const total = item.recipe.reduce((s, r) => s + (r.price ?? 0), 0);
                    return total > 0 ? (
                      <div className="flex justify-between px-3 py-1.5 text-xs font-bold border-t border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                        <span>{t.labels.totalCost}</span>
                        <span className="text-teal-600 dark:text-teal-400">{total.toFixed(2)} €</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Quick toggles */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <QuickToggle
                  value={item.available}
                  onChange={() => toggleAvailable(item.id)}
                  labelOn={t.labels.inService}
                  labelOff={t.labels.outOfService}
                  colorOn="#22c55e"
                />
                <QuickToggle
                  value={item.visible}
                  onChange={() => toggleVisible(item.id)}
                  labelOn={t.labels.shownOnMenu}
                  labelOff={t.labels.hiddenFromMenu}
                  colorOn="#0ea5e9"
                />
              </div>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => startEdit(item.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                {t.labels.edit}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
