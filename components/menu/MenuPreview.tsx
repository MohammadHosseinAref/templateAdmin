'use client';

import { useState } from 'react';
import type { MenuPreviewProps } from '@/types/menu';
import { Card } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';

export default function MenuPreview({ draft, categories, stockItems }: MenuPreviewProps) {
  const t = useLocale().menu;
  const [showRecipe, setShowRecipe] = useState(false);

  const cat    = categories.find((c) => c.id === draft.categoryId);
  const sub    = cat?.subs.find((s) => s.name === draft.subCategory);
  const catParts = [cat?.name, sub?.name, draft.subSubCategory].filter(Boolean);
  const catLabel = catParts.length > 0 ? catParts.join(' › ') : null;

  return (
    <Card title={t.labels.previewTitle}>

      {/* Photo */}
      <div className="w-full h-44 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
        {draft.photo ? (
          <img src={draft.photo} alt={draft.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-10 h-10 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        )}
      </div>

      {/* Category breadcrumb */}
      {catLabel && (
        <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
          {catLabel}
        </p>
      )}

      {/* Name */}
      <p className={`text-xl font-bold leading-tight ${
        draft.name ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-600 italic'
      }`}>
        {draft.name || t.placeholders.name}
      </p>

      {/* Tags */}
      {draft.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {draft.tags.map((tag, i) => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border ${
              i === 0
                ? 'bg-teal-500 text-white border-teal-500'
                : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800'
            }`}>
              {i === 0 && '★ '}{tag}
            </span>
          ))}
        </div>
      )}

      {/* Price + Prep time */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
        <span className={`text-2xl font-bold ${
          draft.price > 0 ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-600'
        }`}>
          {draft.price > 0 ? `${draft.price.toFixed(2)} €` : '—'}
        </span>
        {draft.prepTime > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {draft.prepTime} {t.labels.prepTimeUnit}
          </span>
        )}
      </div>

      {/* Description */}
      {draft.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {draft.description}
        </p>
      )}

      {/* Recipe toggle */}
      {draft.recipe.length > 0 && (
        <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRecipe((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              {t.labels.viewRecipe} ({draft.recipe.length})
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${showRecipe ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {showRecipe && (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {draft.recipe.map((ing) => {
                const stock = stockItems.find((s) => s.id === ing.stockId);
                return (
                  <li key={ing.stockId} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{stock?.name ?? ing.stockId}</span>
                    <span className="tabular-nums text-slate-500 dark:text-slate-400">
                      {ing.quantity} <span className="text-xs">{stock?.unit}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Branches */}
      {draft.branches.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
          {draft.branches.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Status badges */}
      <div className="flex gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-700">
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium ${
          draft.available
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${draft.available ? 'bg-green-500' : 'bg-red-400'}`} />
          {draft.available ? t.labels.inService : t.labels.outOfService}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium ${
          draft.visible
            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
        }`}>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={
              draft.visible
                ? 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                : 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
            } />
          </svg>
          {draft.visible ? t.labels.shownOnMenu : t.labels.hiddenFromMenu}
        </span>
      </div>

    </Card>
  );
}
