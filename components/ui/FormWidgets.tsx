'use client';

import { useState, useEffect } from 'react';

export function SaveProgress({ duration = 2500 }: { duration?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { requestAnimationFrame(() => setW(100)); }, []);
  return (
    <span
      className="absolute bottom-0 left-0 h-1 rounded-full bg-white/40"
      style={{ width: `${w}%`, transition: `width ${duration}ms linear` }}
    />
  );
}

export function Toggle({
  value,
  onChange,
  colorOn = '#14b8a6',
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  colorOn?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 rounded-full cursor-pointer focus:outline-none"
      style={{
        width: 48,
        height: 28,
        backgroundColor: value ? colorOn : '#94a3b8',
        transition: 'background-color 0.25s ease',
        border: 'none',
        padding: 0,
      }}
    >
      <span
        className="block rounded-full bg-white"
        style={{
          width: 22,
          height: 22,
          position: 'absolute',
          top: 3,
          left: 3,
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          transform: value ? 'translateX(20px)' : 'translateX(0px)',
          transition: 'transform 0.25s ease',
        }}
      />
    </button>
  );
}

export function EditableLabel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => { onChange(local); setEditing(false); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter')  { onChange(local); setEditing(false); }
          if (e.key === 'Escape') { setLocal(value); setEditing(false); }
        }}
        className="text-xs font-bold uppercase tracking-widest bg-teal-50 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400 text-teal-700 dark:text-teal-300 min-w-0 w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => { setLocal(value); setEditing(true); }}
      className="flex items-center gap-1 group/label"
    >
      <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
        {value}
      </span>
      <svg
        className="w-3 h-3 text-teal-400 opacity-0 group-hover/label:opacity-100 transition-opacity flex-shrink-0"
        fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      </svg>
    </button>
  );
}

export function InlineAdd({ placeholder, onAdd, onCancel }: {
  placeholder: string;
  onAdd: (v: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState('');
  function submit() {
    const trimmed = val.trim();
    if (trimmed) { onAdd(trimmed); setVal(''); }
  }
  return (
    <div className="flex gap-1.5 items-center">
      <input
        autoFocus
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel(); }}
        placeholder={placeholder}
        className="flex-1 bg-slate-50 dark:bg-slate-700 border border-teal-300 dark:border-teal-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      />
      <button type="button" onClick={submit} className="text-teal-600 dark:text-teal-400 hover:text-teal-700 p-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>
      <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
