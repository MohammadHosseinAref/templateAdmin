'use client';

import type {  AmenityKey, AmenitiesProps } from '@/types/baseInfo';
import { AMENITY_KEYS } from '@/types/baseInfo';
import { useLocale } from '@/contexts/LocaleContext';
import { AMENITY_ICONS } from '@/data/amenity-icons';
import { Card } from '@/components/ui/card';
import { inputCls } from '@/components/ui/styles';

export default function Amenities({ data, onChange, onSave, saved }: AmenitiesProps) {
  const t = useLocale().baseInfo;

  function toggleAmenity(key: AmenityKey) {
    const has = data.amenities.includes(key);
    onChange({
      ...data,
      amenities: has ? data.amenities.filter((a) => a !== key) : [...data.amenities, key],
    });
  }

  function setCapacity(key: 'totalCapacity' | 'indoorCapacity' | 'outdoorCapacity', val: string) {
    const num = parseInt(val, 10);
    onChange({ ...data, [key]: isNaN(num) ? 0 : num });
  }

  const sum = data.indoorCapacity + data.outdoorCapacity;

  return (
    <div className="space-y-4">

      {/* ── Amenities ── */}
      <Card title={t.sections.amenities}>
        <div className="space-y-1.5">
          {AMENITY_KEYS.map((key) => {
            const active = data.amenities.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleAmenity(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <div className={`flex-shrink-0 transition-colors ${active ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`}>
                  {AMENITY_ICONS[key]}
                </div>
                <span className="flex-1 text-sm font-medium text-start">{t.amenityNames[key]}</span>
                {active && <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {data.amenities.length > 0 && (
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
            {data.amenities.length} {t.labels.selectedCount}
          </p>
        )}
      </Card>

      {/* ── Capacity ── */}
      <Card title={t.sections.capacity}>
        <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">{t.labels.capacityNote}</p>

        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'totalCapacity',   label: t.fields.totalCapacity,   icon: '👥' },
            { key: 'indoorCapacity',  label: t.fields.indoorCapacity,  icon: '🏠' },
            { key: 'outdoorCapacity', label: t.fields.outdoorCapacity, icon: '🌿' },
          ] as { key: 'totalCapacity' | 'indoorCapacity' | 'outdoorCapacity'; label: string; icon: string }[]).map(
            ({ key, label, icon }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>{icon}</span> {label}
                </label>
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  placeholder="0"
                  value={data[key] || ''}
                  onChange={(e) => setCapacity(key, e.target.value)}
                />
              </div>
            ),
          )}
        </div>

        {sum > 0 && (
          <div className={`text-xs px-3 py-2 rounded-lg ${
            sum === data.totalCapacity
              ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
          }`}>
            {sum === data.totalCapacity
              ? t.labels.capacityValid
              : `${t.labels.capacityMismatch} ${sum}`}
          </div>
        )}
      </Card>

      {/* ── Save ── */}
      <button
        type="button"
        onClick={onSave}
        className={`w-full py-3 text-sm font-semibold rounded-2xl transition-colors ${
          saved ? 'bg-green-500 text-white' : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
        }`}
      >
        {saved ? `✓ ${t.labels.saved}` : t.labels.save}
      </button>

    </div>
  );
}
