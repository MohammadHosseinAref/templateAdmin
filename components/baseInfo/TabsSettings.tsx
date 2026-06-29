'use client';

import { useState } from 'react';
import type { BaseInfoData } from '@/types/baseInfo';
import { BASEiNFO_DEFAULTS } from '@/types/baseInfo';
import { useLocale } from '@/contexts/LocaleContext';
import BaseInfo from './BaseInfo';
import Amenities from './Amenities';
import ErrorModal from '@/components/ui/ErrorModal';
import { validateFields } from '@/lib/formUtils';

type TabKey = 'info' | 'amenities';

export default function TabsSettings() {
  const t = useLocale().baseInfo;
  const [tab, setTab] = useState<TabKey>('info');
  const [data, setData]               = useState<BaseInfoData>(BASEiNFO_DEFAULTS);
  const [saved, setSaved]             = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const VALIDATION_RULES: Array<{ key: keyof BaseInfoData; message: string }> = [
    { key: 'name', message: t.labels.nameRequired },
  ];

  function handleChange(next: BaseInfoData) {
    setData(next);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors(validateFields(next, VALIDATION_RULES));
  }

  function handleSave() {
    const errors = validateFields(data, VALIDATION_RULES);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); setFormError(t.labels.requiredFields); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'info',      label: t.tabs.info },
    { key: 'amenities', label: t.tabs.amenities },
  ];

  return (
    <div className="px-3 pt-2 pb-8 space-y-3">
      {formError && <ErrorModal message={formError} onClose={() => setFormError(null)} />}

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === key
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {tab === 'info' && (
        <BaseInfo data={data} onChange={handleChange} onSave={handleSave} saved={saved} fieldErrors={fieldErrors} />
      )}
      {tab === 'amenities' && (
        <Amenities data={data} onChange={setData} onSave={handleSave} saved={saved} />
      )}

    </div>
  );
}
