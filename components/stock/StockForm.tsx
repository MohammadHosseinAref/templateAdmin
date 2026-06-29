'use client';

import { useState, useRef, useEffect } from 'react';
import type { StockFormProps } from '@/types/stock';
import { Card, Field } from '@/components/ui/card';
import { inputCls, dateCls } from '@/components/ui/styles';
import SearchSelect from '@/components/ui/SearchSelect';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';
import { SaveProgress } from '@/components/ui/FormWidgets';


export default function StockForm({
  items,
  selectedId,
  editId,
  draft,
  onSelectId,
  onCancelEdit,
  onDraftChange,
  onSave,
  saved,
  fieldErrors,
}: StockFormProps) {
  const t = useLocale().stock;
  const isEditMode = editId !== null;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (dropdownOpen) setTimeout(() => searchRef.current?.focus(), 30);
  }, [dropdownOpen]);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );
  const selectedItem = items.find((i) => i.id === selectedId) ?? null;
  const editItem     = items.find((i) => i.id === editId)     ?? null;

  const set = makeSetField(draft, onDraftChange);

  const cardTitle = isEditMode
    ? `${t.labels.edit} — ${editItem?.name ?? ''}`
    : t.labels.new;

  return (
    <Card title={cardTitle}>

      {/* ── Pre-select (add mode only) ── */}
      {!isEditMode && (
        <Field label={t.labels.preSelect}>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`${inputCls} w-full flex items-center justify-between gap-2 text-left`}
            >
              <span className={selectedItem ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}>
                {selectedItem
                  ? `${selectedItem.name} — ${selectedItem.unit}`
                  : t.placeholders.selectItem}
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.placeholders.search}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto settings-scroll">
                  {filtered.length === 0 ? (
                    <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-4">
                      {t.labels.noItems}
                    </p>
                  ) : (
                    filtered.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectId(item.id === selectedId ? null : item.id);
                          setDropdownOpen(false);
                          setQuery('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          item.id === selectedId
                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="ms-2 text-xs text-slate-400">— {item.unit}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </Field>
      )}

      <div className="border-t border-slate-100 dark:border-slate-700" />

      {/* ── Fields ── */}
      <Field label={t.fields.name} required error={fieldErrors.name}>
        <input
          type="text"
          className={inputCls}
          placeholder={t.placeholders.name}
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </Field>

      <Field label={t.fields.unit} required error={fieldErrors.unit}>
        <SearchSelect
          value={draft.unit}
          onChange={(v) => set('unit', v)}
          options={t.units}
          placeholder={t.placeholders.selectUnit}
          searchPlaceholder={t.placeholders.search}
          noResultsText={t.labels.noItems}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t.fields.inventory} required>
          <input
            type="number"
            min={0}
            className={inputCls}
            placeholder={t.placeholders.inventory}
            value={draft.inventory}
            onChange={(e) => set('inventory', Number(e.target.value))}
          />
        </Field>
        <Field label={t.fields.minInventory}>
          <input
            type="number"
            min={0}
            className={inputCls}
            placeholder={t.placeholders.minInventory}
            value={draft.minInventory}
            onChange={(e) => set('minInventory', Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label={t.fields.pricePerUnit}>
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          placeholder={t.placeholders.pricePerUnit}
          value={draft.pricePerUnit}
          onChange={(e) => set('pricePerUnit', Number(e.target.value))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t.fields.dateAdded} required>
          <input
            type="date"
            className={dateCls}
            value={draft.dateAdded}
            onChange={(e) => set('dateAdded', e.target.value)}
          />
        </Field>
        <Field label={t.fields.expiryDate}>
          <input
            type="date"
            className={dateCls}
            value={draft.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
          />
        </Field>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2">
        {isEditMode && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {t.labels.cancelEdit}
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className={`relative overflow-hidden flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed ${
            saved
              ? 'bg-green-500 text-white'
              : isEditMode
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
                : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
          }`}
        >
          {saved && <SaveProgress />}
          {saved
            ? `✓ ${t.labels.saved}`
            : isEditMode
              ? t.labels.edit
              : t.labels.add}
        </button>
      </div>

    </Card>
  );
}
