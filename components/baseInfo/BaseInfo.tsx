'use client';

import { useRef } from 'react';
import type { BaseInfoData, DayOfWeek, WorkingHours, BaseInfoProps } from '@/types/baseInfo';
import { DAY_KEYS } from '@/types/baseInfo';
import { COUNTRIES } from '@/data/geo/countries';
import { Card, Field } from '@/components/ui/card';
import { inputCls } from '@/components/ui/styles';
import { GEO_REGIONS, GEO_CITIES } from '@/data/geo/geo-index';
import SearchSelect from '@/components/ui/SearchSelect';
import CountrySelect from './CountrySelect';
import Pill from '@/components/layout/ui/Pill';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';
import { SaveProgress } from '@/components/ui/FormWidgets';

export default function BaseInfo({ data, onChange, onSave, saved, fieldErrors }: BaseInfoProps) {
  const t = useLocale().baseInfo;
  const logoRef = useRef<HTMLInputElement>(null);

  const DAYS = DAY_KEYS.map((key) => ({ key, label: t.days[key] }));

  const set = makeSetField(data, onChange);

  function setAddr(key: keyof BaseInfoData['address'], val: string) {
    onChange({ ...data, address: { ...data.address, [key]: val } });
  }

  function setHours(day: DayOfWeek, field: keyof WorkingHours, val: string | boolean) {
    onChange({
      ...data,
      workingHours: { ...data.workingHours, [day]: { ...data.workingHours[day], [field]: val } },
    });
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => set('logoUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const country = data.address.country;
  const regionOptions = GEO_REGIONS[country] ?? [];
  const cityOptions = data.address.region
    ? (GEO_CITIES[country] ?? []).filter((c) => c.region === data.address.region).map((c) => c.name)
    : (GEO_CITIES[country] ?? []).map((c) => c.name);
  const phoneCode = COUNTRIES[country]?.phoneCode ?? '';

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        {/* ── Col 1: Basic Info + Contact ── */}
        <div className="space-y-4">

          <Card title={t.sections.basic}>
            <Field label={t.fields.name} required error={fieldErrors.name}>
              <input
                type="text"
                className={inputCls}
                placeholder={t.placeholders.restaurantName}
                value={data.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </Field>

            <Field label={t.fields.logo} required>
              <div
                onClick={() => logoRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                  data.logoUrl
                    ? 'border-teal-300 dark:border-teal-700'
                    : 'border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-600'
                }`}
                style={{ minHeight: data.logoUrl ? 0 : 136 }}
              >
                {data.logoUrl ? (
                  <div className="relative group">
                    <img src={data.logoUrl} alt="cover" className="w-full max-h-56 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm font-semibold">{t.labels.changeImage}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 h-32 text-slate-400 dark:text-slate-500">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-sm">{t.labels.uploadLogoPrompt}</span>
                    <span className="text-xs">{t.labels.uploadFormats}</span>
                  </div>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </Field>
          </Card>

          <Card title={t.sections.contact}>
            <Field label={t.fields.phone} required>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 flex-shrink-0">
                  <span className="text-base">{COUNTRIES[country]?.flag}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{phoneCode}</span>
                </div>
                <input
                  type="tel"
                  className={`${inputCls} flex-1`}
                  placeholder={t.placeholders.phone}
                  value={data.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </Field>
          </Card>

        </div>

        {/* ── Col 2: Address + Hours ── */}
        <div className="space-y-4">

          <Card title={t.sections.address}>
            <Field label={t.fields.country} required>
              <CountrySelect
                value={country}
                onChange={(code) =>
                  onChange({ ...data, address: { ...data.address, country: code, region: '', city: '' } })
                }
                countryNames={t.countryNames}
                searchPlaceholder={t.placeholders.search}
                noResultsText={t.labels.noResults}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label={t.fields.region} required>
                <SearchSelect
                  value={data.address.region}
                  onChange={(v) =>
                    onChange({ ...data, address: { ...data.address, region: v, city: '' } })
                  }
                  options={regionOptions}
                  placeholder={t.placeholders.select}
                  searchPlaceholder={t.placeholders.search}
                  noResultsText={t.labels.noResults}
                  disabled={regionOptions.length === 0}
                />
              </Field>
              <Field label={t.fields.city} required>
                <SearchSelect
                  value={data.address.city}
                  onChange={(v) => setAddr('city', v)}
                  options={cityOptions}
                  placeholder={data.address.region ? t.placeholders.select : t.placeholders.selectRegionFirst}
                  searchPlaceholder={t.placeholders.search}
                  noResultsText={t.labels.noResults}
                  disabled={!data.address.region}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label={t.fields.streetNumber} required>
                <input
                  type="text"
                  className={inputCls}
                  placeholder={t.placeholders.streetNumber}
                  value={data.address.streetNumber}
                  onChange={(e) => setAddr('streetNumber', e.target.value)}
                />
              </Field>
              <div className="col-span-2">
                <Field label={t.fields.streetName} required>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder={t.placeholders.streetName}
                    value={data.address.streetName}
                    onChange={(e) => setAddr('streetName', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <Field label={t.fields.additionalInfo}>
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder={t.placeholders.additionalInfo}
                value={data.address.additionalInfo}
                onChange={(e) => setAddr('additionalInfo', e.target.value)}
              />
            </Field>

            <div className="rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 h-40 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-sm font-medium">{t.labels.mapsTitle}</p>
              <p className="text-xs">{t.labels.mapsNote}</p>
            </div>
          </Card>

        </div>
      </div>

      {/* ── Hours (full width) ── */}
      <Card title={t.sections.hours}>
        <div className="space-y-1.5">
          {DAYS.map(({ key, label }) => {
            const h = data.workingHours[key];
            return (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  h.closed ? 'bg-slate-50 dark:bg-slate-700/30' : 'bg-slate-50 dark:bg-slate-700/50'
                }`}
              >
                <span className={`text-sm font-medium w-20 flex-shrink-0 ${h.closed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
                  {label}
                </span>

                {h.closed ? (
                  <span className="flex-1 text-sm text-slate-400 dark:text-slate-500 italic">{t.labels.closed}</span>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <svg className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      <input
                        type="time"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500 text-slate-700 dark:text-slate-200 text-sm rounded-xl ps-8 pe-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors"
                        value={h.open}
                        onChange={(e) => setHours(key, 'open', e.target.value)}
                      />
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 flex-shrink-0 text-base font-light">→</span>
                    <div className="relative flex-1">
                      <svg className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      <input
                        type="time"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 text-sm rounded-xl ps-8 pe-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors"
                        value={h.close}
                        onChange={(e) => setHours(key, 'close', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-shrink-0 cursor-pointer" onClick={() => setHours(key, 'closed', !h.closed)}>
                  <Pill on={!h.closed} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Save ── */}
      <button
        type="button"
        onClick={onSave}
        disabled={saved}
        className={`relative overflow-hidden w-full py-3 text-sm font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed ${
          saved ? 'bg-green-500 text-white' : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
        }`}
      >
        {saved && <SaveProgress />}
        {saved ? `✓ ${t.labels.saved}` : t.labels.save}
      </button>

    </div>
  );
}
