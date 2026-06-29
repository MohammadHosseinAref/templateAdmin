'use client';

import { useState } from 'react';
import type { PackageAddon, PackageAddonsTabProps } from '@/types/packages';
import { Card } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';

export default function PackageAddonsTab({ draft, stockItems, onDraftChange }: PackageAddonsTabProps) {
  const t = useLocale().packages;

  const [stockAddonId,    setStockAddonId]    = useState('');
  const [stockAddonPrice, setStockAddonPrice] = useState<number>(0);
  const [customAddonName,  setCustomAddonName]  = useState('');
  const [customAddonPrice, setCustomAddonPrice] = useState<number>(0);

  const set = makeSetField(draft, onDraftChange);

  const stockAddons    = draft.addons.filter((a) => a.stockId);
  const customAddons   = draft.addons.filter((a) => !a.stockId);
  const usedStockIds   = new Set(stockAddons.map((a) => a.stockId));
  const availableStock = stockItems.filter((s) => !usedStockIds.has(s.id));

  function addStockAddon() {
    const stock = stockItems.find((s) => s.id === stockAddonId);
    if (!stock) return;
    const addon: PackageAddon = { id: Date.now().toString(), name: stock.name, price: stockAddonPrice, stockId: stock.id };
    set('addons', [...draft.addons, addon]);
    setStockAddonId('');
    setStockAddonPrice(0);
  }

  function addCustomAddon() {
    if (!customAddonName.trim()) return;
    const addon: PackageAddon = { id: Date.now().toString(), name: customAddonName.trim(), price: customAddonPrice };
    set('addons', [...draft.addons, addon]);
    setCustomAddonName('');
    setCustomAddonPrice(0);
  }

  function removeAddon(id: string) {
    set('addons', draft.addons.filter((a) => a.id !== id));
  }

  return (
    <Card title={t.sections.addons}>

      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-1">{t.labels.addonsHint}</p>

      {/* From stock */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.labels.fromStock}</p>
        <div className="flex gap-2 items-center">
          <select
            value={stockAddonId}
            onChange={(e) => setStockAddonId(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="">{t.labels.noStock}</option>
            {availableStock.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="number" min={0} step={0.01}
            value={stockAddonPrice || ''}
            onChange={(e) => setStockAddonPrice(Number(e.target.value))}
            placeholder="€"
            className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-xl px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-center"
          />
          <button
            type="button" onClick={addStockAddon} disabled={!stockAddonId}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: '#14b8a6' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#0d9488'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14b8a6'; }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        {stockAddons.length > 0 && (
          <div className="space-y-2">
            {stockAddons.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 bg-white dark:bg-slate-800" style={{ border: '2px solid #5eead4' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#14b8a6' }}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <span className="flex-1 text-base font-bold text-slate-800 dark:text-white truncate">{a.name}</span>
                <span className="text-base tabular-nums font-black flex-shrink-0" style={{ color: '#0d9488' }}>{a.price.toFixed(2)} €</span>
                <button type="button" onClick={() => removeAddon(a.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ color: '#94a3b8', backgroundColor: '#f1f5f9' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700" />

      {/* Custom addons */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.labels.customAddon}</p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={customAddonName}
            onChange={(e) => setCustomAddonName(e.target.value)}
            placeholder={t.placeholders.addonName}
            className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="number" min={0} step={0.01}
            value={customAddonPrice || ''}
            onChange={(e) => setCustomAddonPrice(Number(e.target.value))}
            placeholder="€"
            className="w-20 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-xl px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-center"
          />
          <button
            type="button" onClick={addCustomAddon} disabled={!customAddonName.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: '#6366f1' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#4f46e5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6366f1'; }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        {customAddons.length > 0 && (
          <div className="space-y-2">
            {customAddons.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 bg-white dark:bg-slate-800" style={{ border: '2px solid #a5b4fc' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6366f1' }}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="flex-1 text-base font-bold text-slate-800 dark:text-white truncate">{a.name}</span>
                <span className="text-base tabular-nums font-black flex-shrink-0" style={{ color: '#4f46e5' }}>{a.price.toFixed(2)} €</span>
                <button type="button" onClick={() => removeAddon(a.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ color: '#94a3b8', backgroundColor: '#f1f5f9' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
