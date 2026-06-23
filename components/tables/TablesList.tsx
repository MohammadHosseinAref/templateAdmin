'use client';

import { useState } from 'react';
import type { TablesListProps, TableItem } from '@/types/tables';
import { inputCls } from '@/components/ui/styles';
import { useLocale } from '@/contexts/LocaleContext';

export default function TablesList({ scene, onChange, onSave, saved }: TablesListProps) {
  const t = useLocale().tables;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName,  setFormName]  = useState('');
  const [formCap,   setFormCap]   = useState(4);

  function startEdit(table: TableItem) {
    setEditingId(table.id);
    setFormName(table.name);
    setFormCap(table.capacity);
  }

  function confirmEdit() {
    onChange({ ...scene, tables: scene.tables.map((t) => t.id === editingId ? { ...t, name: formName, capacity: formCap } : t) });
    setEditingId(null);
  }

  function deleteTable(id: string) {
    onChange({ ...scene, tables: scene.tables.filter((t) => t.id !== id) });
    if (editingId === id) setEditingId(null);
  }

  function toggleStatus(id: string) {
    onChange({ ...scene, tables: scene.tables.map((t) => t.id === id ? { ...t, status: t.status === 'free' ? 'busy' : 'free' } : t) });
  }

  if (scene.tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400 dark:text-slate-500">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
        <p className="text-sm text-center max-w-xs">{t.labels.noTables}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {scene.tables.map((table, i) => (
          <div key={table.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${table.status === 'busy' ? 'bg-red-500' : 'bg-teal-500'}`}>
                {i + 1}
              </div>
              {editingId === table.id ? (
                <input autoFocus className={`${inputCls} flex-1`} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={t.placeholders.tableName} />
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{table.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{table.capacity} {t.labels.persons}</p>
                </div>
              )}
            </div>

            {editingId === table.id && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFormCap((v) => Math.max(1, v - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">−</button>
                <span className="text-lg font-bold text-teal-600 dark:text-teal-400 min-w-[2ch] text-center tabular-nums">{formCap}</span>
                <button type="button" onClick={() => setFormCap((v) => Math.min(20, v + 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">+</button>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t.labels.persons}</span>
              </div>
            )}

            {editingId === table.id ? (
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingId(null)} className="flex-1 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t.labels.cancel}</button>
                <button type="button" onClick={confirmEdit} className="flex-1 py-2 text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors">{t.labels.confirm}</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={() => toggleStatus(table.id)} className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors ${table.status === 'free' ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400'}`}>
                  {table.status === 'free' ? t.labels.free : t.labels.busy}
                </button>
                <button type="button" onClick={() => startEdit(table)} className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">✎</button>
                <button type="button" onClick={() => deleteTable(table.id)} className="px-3 py-2 text-xs border border-red-200 dark:border-red-900 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">🗑</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={onSave} className={`w-full py-3 text-sm font-semibold rounded-2xl transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}>
        {saved ? `✓ ${t.labels.saved}` : t.labels.save}
      </button>
    </div>
  );
}
