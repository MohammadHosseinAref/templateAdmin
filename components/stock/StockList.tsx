'use client';

import { useState } from 'react';
import type { StockListProps } from '@/types/stock';
import { Card } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';

type ExpiryStatus = 'expired' | 'soon' | 'ok' | 'none';

function expiryStatus(expiryDate: string): ExpiryStatus {
  if (!expiryDate) return 'none';
  const diff = Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / 86_400_000,
  );
  if (diff < 0)  return 'expired';
  if (diff <= 7) return 'soon';
  return 'ok';
}

export default function StockList({
  items,
  selectedId,
  editId,
  onSelectId,
  onEdit,
  onDelete,
}: StockListProps) {
  const t = useLocale().stock;
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    onDelete(id);
    setConfirmId(null);
  }

  if (items.length === 0) {
    return (
      <Card title={t.sections.list}>
        <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-6">
          {t.labels.noItems}
        </p>
      </Card>
    );
  }

  return (
    <Card title={t.sections.list}>
      <div className="space-y-1.5">
        {items.map((item) => {
          const isSelected   = item.id === selectedId;
          const isEditing    = item.id === editId;
          const isConfirming = item.id === confirmId;
          const isLow        = item.minInventory > 0 && item.inventory < item.minInventory;
          const expiry       = expiryStatus(item.expiryDate);

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors border ${
                isEditing
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  : isSelected
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              {/* Mode dot */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                isEditing  ? 'bg-amber-500' :
                isSelected ? 'bg-teal-500'  : 'bg-transparent'
              }`} />

              {/* Name / unit — click to pre-select */}
              <button
                type="button"
                onClick={() => { setConfirmId(null); onSelectId(isSelected ? null : item.id); }}
                className="flex-1 min-w-0 text-left"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium truncate ${
                    isEditing  ? 'text-amber-700 dark:text-amber-300' :
                    isSelected ? 'text-teal-700 dark:text-teal-300'   :
                                 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {item.name}
                  </span>

                  {isLow && (
                    <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">
                      {t.labels.lowStock}
                    </span>
                  )}

                  {expiry === 'expired' && (
                    <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium">
                      {t.labels.expired}
                    </span>
                  )}
                  {expiry === 'soon' && (
                    <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium">
                      {t.labels.expirySoon}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{item.unit}</span>
                  {item.expiryDate && (
                    <span className={`text-xs ${
                      expiry === 'expired' ? 'text-red-400 dark:text-red-500' :
                      expiry === 'soon'    ? 'text-orange-400 dark:text-orange-500' :
                                            'text-slate-400 dark:text-slate-500'
                    }`}>
                      · exp. {item.expiryDate}
                    </span>
                  )}
                </div>
              </button>

              {/* Inventory — masqué pendant la confirmation */}
              {!isConfirming && (
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold tabular-nums ${
                    isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.inventory}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    min {item.minInventory}
                  </p>
                </div>
              )}

              {/* Price — masqué pendant la confirmation */}
              {!isConfirming && (
                <div className="text-right flex-shrink-0 w-20">
                  <p className="text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                    {item.pricePerUnit.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">/ {item.unit}</p>
                </div>
              )}

              {/* Edit + Delete */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {isConfirming ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                    >
                      {t.labels.confirmDelete}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {t.labels.cancel}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => { setConfirmId(null); onEdit(item.id); }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isEditing
                          ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/30'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      }`}
                      aria-label={t.labels.edit}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label={t.labels.delete}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
