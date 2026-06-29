'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useCategories } from '@/contexts/CategoriesContext';

function SubRow({
  subName, catName, onEdit, onDelete,
}: {
  subName: string; catName: string; onEdit: () => void; onDelete: () => void;
}) {
  const t = useLocale().categories;
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group">
      <span className="w-2 h-2 rounded-full flex-shrink-0 bg-violet-400" />
      <span className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{subName}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500 ms-2">← {catName}</span>
      </span>
      {confirm ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-rose-500">{t.labels.confirmDelete}</span>
          <button type="button" onClick={() => { onDelete(); setConfirm(false); }} className="text-xs font-semibold text-rose-500 px-2 py-0.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">{t.labels.delete}</button>
          <button type="button" onClick={() => setConfirm(false)} className="text-xs text-slate-400 px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">{t.labels.cancel}</button>
        </div>
      ) : (
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={onEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
          </button>
          <button type="button" onClick={() => setConfirm(true)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

type EditTarget = { categoryId: string; oldName: string } | null;

export default function SubCategoryTab() {
  const t = useLocale().categories;
  const { categories, addSub, updateSub, deleteSub } = useCategories();

  const [selectedCatId, setSelectedCatId] = useState('');
  const [name, setName]                   = useState('');
  const [editing, setEditing]             = useState<EditTarget>(null);
  const [search, setSearch]               = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !selectedCatId) return;
    if (editing) { updateSub(editing.categoryId, editing.oldName, trimmed); setEditing(null); }
    else addSub(selectedCatId, trimmed);
    setName('');
  }

  const isEditing = editing !== null;

  const allSubs = categories.flatMap((cat) =>
    cat.subs.map((sub) => ({ catId: cat.id, catName: cat.name, subName: sub.name })),
  );

  const filtered = search.trim()
    ? allSubs.filter((s) =>
        s.subName.toLowerCase().includes(search.toLowerCase()) ||
        s.catName.toLowerCase().includes(search.toLowerCase()),
      )
    : allSubs;

  return (
    <div className="space-y-4">

      {/* ── فرم ── */}
      <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        {isEditing && (
          <div className="flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-400 mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
            {t.labels.editMode}
          </div>
        )}
        <div className="flex gap-3">
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            disabled={isEditing}
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-60"
          >
            <option value="">{t.fields.selectCategory}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.placeholders.subName}
            className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          <button type="submit" disabled={!name.trim() || !selectedCatId} className="h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: '#0d9488' }}>
            {isEditing ? t.labels.save : t.labels.add}
          </button>
          {isEditing && (
            <button type="button" onClick={() => { setEditing(null); setName(''); }} className="h-10 px-4 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-colors">
              {t.labels.cancel}
            </button>
          )}
        </div>
      </form>

      {/* ── سرچ ── */}
      <div className="relative w-full">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t.fields.name}...`}
          className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 ps-10 pe-9 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* ── لیست ── */}
      <div className="space-y-2">
        {filtered.length === 0
          ? <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">{t.labels.noItems}</p>
          : filtered.map(({ catId, catName, subName }) => (
              <SubRow
                key={`${catId}::${subName}`}
                subName={subName}
                catName={catName}
                onEdit={() => { setEditing({ categoryId: catId, oldName: subName }); setSelectedCatId(catId); setName(subName); }}
                onDelete={() => deleteSub(catId, subName)}
              />
            ))
        }
      </div>
    </div>
  );
}
