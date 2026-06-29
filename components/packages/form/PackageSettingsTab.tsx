'use client';

import type { PackageSettingsTabProps } from '@/types/packages';
import { Card, Field } from '@/components/ui/card';
import { inputCls, dateCls } from '@/components/ui/styles';
import { useLocale } from '@/contexts/LocaleContext';
import { Toggle } from '@/components/ui/FormWidgets';
import { makeSetField } from '@/lib/formUtils';

export default function PackageSettingsTab({ draft, branches, onDraftChange }: PackageSettingsTabProps) {
  const t = useLocale().packages;
  const set = makeSetField(draft, onDraftChange);

  return (
    <Card title={t.sections.settings}>

      {/* Always available toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.labels.alwaysAvailable}</p>
          <p className="text-xs mt-0.5" style={{ color: draft.alwaysAvailable ? '#16a34a' : '#f59e0b' }}>
            {draft.alwaysAvailable ? t.labels.alwaysAvailable : t.labels.dateRange}
          </p>
        </div>
        <Toggle value={draft.alwaysAvailable} onChange={(v) => set('alwaysAvailable', v)} colorOn="#22c55e" />
      </div>

      {/* Date + time range */}
      {!draft.alwaysAvailable && (
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.fields.dateFrom}>
            <input type="datetime-local" className={dateCls} value={draft.dateFrom} onChange={(e) => set('dateFrom', e.target.value)} />
          </Field>
          <Field label={t.fields.dateTo}>
            <input type="datetime-local" className={dateCls} value={draft.dateTo} onChange={(e) => set('dateTo', e.target.value)} />
          </Field>
        </div>
      )}

      {/* Visible — 3-state */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t.fields.visible}</p>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
          {([
            { value: 'visible',  label: t.labels.shownOnMenu,    color: '#0ea5e9' },
            { value: 'inactive', label: t.labels.inactiveOnMenu, color: '#f59e0b' },
            { value: 'hidden',   label: t.labels.hiddenFromMenu, color: '#94a3b8' },
          ] as const).map((opt) => {
            const active = draft.visible === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => set('visible', opt.value)}
                className="flex-1 py-2.5 text-xs font-semibold transition-colors"
                style={{ backgroundColor: active ? opt.color : 'transparent', color: active ? '#fff' : '#94a3b8' }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max quantity */}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.fields.maxQuantity}>
          <input type="number" min={0} className={inputCls} value={draft.maxQuantity || ''} onChange={(e) => set('maxQuantity', Number(e.target.value))} />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.labels.maxQtyHint}</p>
        </Field>
        <Field label={t.fields.maxQuantityPerPerson}>
          <input type="number" min={0} className={inputCls} value={draft.maxQuantityPerPerson || ''} onChange={(e) => set('maxQuantityPerPerson', Number(e.target.value))} />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.labels.maxQtyHint}</p>
        </Field>
      </div>

      {/* Discount percent */}
      <Field label={t.fields.discountPercent}>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={100} step={1}
            className={`${inputCls} flex-1`}
            value={draft.discountPercent || ''}
            onChange={(e) => set('discountPercent', Math.min(100, Math.max(0, Number(e.target.value))))}
          />
          <span className="text-lg font-bold text-slate-400 flex-shrink-0">%</span>
        </div>
      </Field>

      {/* Branches */}
      {branches.length > 0 && (
        <Field label={t.fields.branches}>
          <div className="flex flex-wrap gap-2">
            {branches.map((branch) => {
              const selected = draft.branches.includes(branch);
              return (
                <button key={branch} type="button"
                  onClick={() => set('branches', selected ? draft.branches.filter((b) => b !== branch) : [...draft.branches, branch])}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: selected ? '#14b8a615' : 'transparent',
                    color: selected ? '#0d9488' : '#94a3b8',
                    border: `1.5px solid ${selected ? '#14b8a6' : '#cbd5e1'}`,
                  }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={selected ? 2.5 : 1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {branch}
                  {selected && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {draft.branches.length === 0 && (
            <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">{t.labels.allBranches}</p>
          )}
        </Field>
      )}

      {/* Sale price */}
      <Field label={t.fields.price}>
        <input type="number" min={0} step={0.01} className={inputCls} value={draft.price || ''} onChange={(e) => set('price', Number(e.target.value))} />
      </Field>

    </Card>
  );
}
