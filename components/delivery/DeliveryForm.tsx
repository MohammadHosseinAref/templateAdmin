'use client';

import { useRef } from 'react';
import type { DeliveryFormProps } from '@/types/delivery';
import { VEHICLE_TYPES } from '@/types/delivery';
import { Card, Field } from '@/components/ui/card';
import { inputCls, textareaCls } from '@/components/ui/styles';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';
import { Toggle, SaveProgress } from '@/components/ui/FormWidgets';
import DeliveryAvailability from './DeliveryAvailability';

export default function DeliveryForm({
  items,
  editId,
  draft,
  zones,
  onCancelEdit,
  onDraftChange,
  onSave,
  saved,
  fieldErrors,
}: DeliveryFormProps) {
  const t = useLocale().delivery;
  const isEditMode = editId !== null;
  const photoRef = useRef<HTMLInputElement>(null);

  const set = makeSetField(draft, onDraftChange);

  const editItem = items.find((i) => i.id === editId) ?? null;
  const cardTitle = isEditMode
    ? `${t.labels.edit} — ${editItem?.firstName ?? ''} ${editItem?.lastName ?? ''}`
    : t.labels.new;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleZone(zone: string) {
    set('zones', draft.zones.includes(zone) ? draft.zones.filter((z) => z !== zone) : [...draft.zones, zone]);
  }

  return (
    <div className="space-y-4">

      {/* ── Personal info ── */}
      <Card title={cardTitle}>

        <div onClick={() => photoRef.current?.click()} className="cursor-pointer group">
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          {draft.photo ? (
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600">
              <img src={draft.photo} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">{t.labels.changePhoto}</span>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
              <svg className="w-6 h-6 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-xs text-slate-400">{t.labels.uploadPhoto}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t.fields.firstName} required error={fieldErrors.firstName}>
            <input
              type="text"
              className={inputCls}
              placeholder={t.placeholders.firstName}
              value={draft.firstName}
              onChange={(e) => set('firstName', e.target.value)}
            />
          </Field>
          <Field label={t.fields.lastName} required error={fieldErrors.lastName}>
            <input
              type="text"
              className={inputCls}
              placeholder={t.placeholders.lastName}
              value={draft.lastName}
              onChange={(e) => set('lastName', e.target.value)}
            />
          </Field>
        </div>

        <Field label={t.fields.phone} required error={fieldErrors.phone}>
          <input
            type="tel"
            className={inputCls}
            placeholder={t.placeholders.phone}
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </Field>

        <Field label={t.fields.email}>
          <input
            type="email"
            className={inputCls}
            placeholder={t.placeholders.email}
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>

        <Field label={t.fields.nationalId}>
          <input
            type="text"
            className={inputCls}
            placeholder={t.placeholders.nationalId}
            value={draft.nationalId}
            onChange={(e) => set('nationalId', e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.labels.status}</p>
            <p className="text-xs mt-0.5" style={{ color: draft.active ? '#16a34a' : '#94a3b8' }}>
              {draft.active ? t.labels.active : t.labels.inactive}
            </p>
          </div>
          <Toggle value={draft.active} onChange={(v) => set('active', v)} colorOn="#22c55e" />
        </div>
      </Card>

      {/* ── Vehicle ── */}
      <Card title={t.fields.vehicleType}>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((vt) => {
            const selected = draft.vehicleType === vt;
            return (
              <button
                key={vt}
                type="button"
                onClick={() => set('vehicleType', vt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: selected ? '#14b8a615' : 'transparent',
                  color: selected ? '#0d9488' : '#94a3b8',
                  border: `1.5px solid ${selected ? '#14b8a6' : '#cbd5e1'}`,
                }}
              >
                {t.vehicleTypes[vt]}
                {selected && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {draft.vehicleType !== 'foot' && draft.vehicleType !== 'bike' && (
          <Field label={t.fields.licensePlate}>
            <input
              type="text"
              className={inputCls}
              placeholder={t.placeholders.licensePlate}
              value={draft.licensePlate}
              onChange={(e) => set('licensePlate', e.target.value)}
            />
          </Field>
        )}
      </Card>

      {/* ── Zones ── */}
      <Card title={t.fields.zones}>
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => {
            const selected = draft.zones.includes(zone);
            return (
              <button
                key={zone}
                type="button"
                onClick={() => toggleZone(zone)}
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
                {zone}
                {selected && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {draft.zones.length === 0 && (
          <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">{t.labels.noZones}</p>
        )}
      </Card>

      {/* ── Availability ── */}
      <DeliveryAvailability value={draft.availability} onChange={(availability) => set('availability', availability)} />

      {/* ── Notes ── */}
      <Card title={t.fields.notes}>
        <textarea
          className={`${textareaCls} resize-none h-24`}
          placeholder={t.placeholders.notes}
          value={draft.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </Card>

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
              ? t.labels.save
              : t.labels.add}
        </button>
      </div>

    </div>
  );
}
