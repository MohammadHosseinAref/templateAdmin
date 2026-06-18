'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import type { UploadedFont, FontPickerProps } from '@/types/layout/fontpicker';
import { PRESET_FONT_FAMILIES } from './data/font-data';
import {
  UPLOADED_FONT_KEY,
  MAX_FONT_BYTES,
  loadGoogleFont,
  injectUploadedFont,
} from './utils/font-utils';

export { UPLOADED_FONT_KEY, injectUploadedFont };
export type { FontPickerProps };

export default function FontPicker({ currentFont, onApply, onClose }: FontPickerProps) {
  const t = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);

  const PRESET_FONTS = [
    { name: t.fontPicker.defaultFontName, family: '' },
    { name: 'Estedad',          family: 'Estedad' },
    { name: 'Lalezar',          family: 'Lalezar' },
    { name: 'Rubik',            family: 'Rubik' },
    { name: 'Markazi Text',     family: 'Markazi Text' },
    { name: 'Amiri',            family: 'Amiri' },
    { name: 'Noto Sans Arabic', family: 'Noto Sans Arabic' },
  ];

  const PREVIEW = t.fontPicker.previewText;

  const [uploadedFont, setUploadedFont] = useState<UploadedFont | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState('');

  const isPreset = PRESET_FONT_FAMILIES.some((f) => f.family === currentFont);
  const [selected, setSelected]    = useState(isPreset ? currentFont : '__pending__');
  const [customFont, setCustomFont] = useState(isPreset ? '' : currentFont);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(UPLOADED_FONT_KEY);
      if (!raw) {
        if (selected === '__pending__') setSelected('__custom__');
        return;
      }
      const data: UploadedFont = JSON.parse(raw);
      setUploadedFont(data);
      injectUploadedFont(data.name, data.base64);
      if (currentFont === data.name) {
        setSelected('__uploaded__');
        setCustomFont('');
      } else if (selected === '__pending__') {
        setSelected('__custom__');
      }
    } catch {
      if (selected === '__pending__') setSelected('__custom__');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PRESET_FONT_FAMILIES.forEach((f) => loadGoogleFont(f.family));
  }, []);

  function selectPreset(family: string) {
    setSelected(family);
    setCustomFont('');
    loadGoogleFont(family);
  }

  function handleCustomChange(val: string) {
    setCustomFont(val);
    setSelected('__custom__');
  }

  function handleCustomBlur() {
    if (customFont.trim()) loadGoogleFont(customFont.trim());
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (file.size > MAX_FONT_BYTES) { setUploadError(t.fontPicker.errorTooLarge); return; }
    setUploadError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onerror = () => { setUploadError(t.fontPicker.errorReadFailed); setUploading(false); };
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const name   = file.name.replace(/\.[^.]+$/, '');
      const ok     = await injectUploadedFont(name, base64);
      if (!ok) { setUploadError(t.fontPicker.errorInvalidFont); setUploading(false); return; }
      const data: UploadedFont = { name, base64 };
      try { localStorage.setItem(UPLOADED_FONT_KEY, JSON.stringify(data)); } catch {}
      setUploadedFont(data);
      setSelected('__uploaded__');
      setCustomFont('');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function removeUpload() {
    localStorage.removeItem(UPLOADED_FONT_KEY);
    setUploadedFont(null);
    if (selected === '__uploaded__') setSelected('');
    if (uploadedFont && currentFont === uploadedFont.name) { onApply(''); onClose(); }
  }

  function handleApply() {
    let font: string;
    if      (selected === '__uploaded__' && uploadedFont) font = uploadedFont.name;
    else if (selected === '__custom__')                   font = customFont.trim();
    else                                                  font = selected;
    onApply(font);
    onClose();
  }

  function handleRemove() { onApply(''); onClose(); }

  function ps(family: string): React.CSSProperties {
    if (!family) return { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" };
    return { fontFamily: `'${family}', 'Vazirmatn', Tahoma, sans-serif` };
  }

  const liveFamily =
    selected === '__uploaded__' ? (uploadedFont?.name ?? '') :
    selected === '__custom__'   ? customFont.trim()          :
    selected;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">

        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-100">{t.fontPicker.title}</h2>
          <button onClick={onClose} aria-label={t.fontPicker.close}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 settings-scroll">

          <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 p-3.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              {t.fontPicker.uploadSection}
            </p>

            {uploadedFont ? (
              <div className="space-y-2">
                <button type="button" onClick={() => setSelected('__uploaded__')}
                  className={`w-full text-start p-3 rounded-xl border-2 transition-all ${
                    selected === '__uploaded__'
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {`${uploadedFont.name} — ${t.fontPicker.uploadedSuffix}`}
                    </span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeUpload(); }}
                      className="text-[11px] font-medium text-red-500 hover:underline px-1">
                      {t.fontPicker.removeFont}
                    </button>
                  </div>
                  <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed" style={ps(uploadedFont.name)}>
                    {PREVIEW}
                  </p>
                </button>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 py-1.5 text-center transition-colors">
                  {t.fontPicker.changeUpload}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full flex flex-col items-center gap-2 py-6 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-600 transition-all group disabled:opacity-60">
                <svg className="w-7 h-7 text-slate-300 dark:text-slate-500 group-hover:text-teal-500 transition-colors"
                  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {uploading ? t.fontPicker.uploading : t.fontPicker.selectFile}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{t.fontPicker.fileFormats}</span>
              </button>
            )}

            {uploadError && (
              <p className="mt-2 text-xs text-red-500 dark:text-red-400 text-center">{uploadError}</p>
            )}
            <input ref={fileRef} type="file" accept=".ttf,.woff,.woff2,.otf" className="hidden" onChange={handleFileChange} />
          </div>

          {PRESET_FONTS.map((font) => {
            const isActive = selected === font.family || (font.family === '' && (selected === '' || selected === '__pending__'));
            return (
              <button key={font.family || '__default__'} type="button" onClick={() => selectPreset(font.family)}
                className={`w-full text-start p-3.5 rounded-xl border-2 transition-all duration-150 ${
                  isActive
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{font.name}</p>
                <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed" style={ps(font.family)}>{PREVIEW}</p>
              </button>
            );
          })}

          <div className={`border-2 rounded-xl p-3.5 transition-all ${
            selected === '__custom__' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'
          }`}>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              {t.fontPicker.customFontSection}
            </p>
            <input type="text" value={customFont}
              onChange={(e) => handleCustomChange(e.target.value)}
              onFocus={() => { if (customFont) setSelected('__custom__'); }}
              onBlur={handleCustomBlur}
              placeholder={t.fontPicker.customFontPlaceholder}
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            {customFont && (
              <p className="mt-2.5 text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed" style={ps(customFont)}>{PREVIEW}</p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
              {t.fontPicker.livePreviewSection}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed" style={ps(liveFamily)}>
              {t.fontPicker.livePreviewText}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <button type="button" onClick={handleApply}
            className="flex-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
            {t.fontPicker.apply}
          </button>
          {currentFont && (
            <button type="button" onClick={handleRemove}
              className="px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              {t.fontPicker.removeFont}
            </button>
          )}
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            {t.fontPicker.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
