'use client';

import { useState, useRef } from 'react';
import type { MenuFormProps, MenuItemForm, StockRef } from '@/types/menu';
import { Card, Field } from '@/components/ui/card';
import { inputCls, textareaCls } from '@/components/ui/styles';
import SearchSelect from '@/components/ui/SearchSelect';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';
import { Toggle, InlineAdd } from '@/components/ui/FormWidgets';

/* ── Main component ────────────────────────────────────────────── */
export default function MenuForm({
  draft,
  editId,
  items,
  categories,
  allTags,
  stockItems,
  branches,
  onDraftChange,
  onAddCategory,
  onAddSub,
  onAddSubSub,
  onAddTag,
  fieldErrors,
}: MenuFormProps) {
  const t = useLocale().menu;
  const isEditMode = editId !== null;

  /* category UI state */
  const [addingCat, setAddingCat]       = useState(false);
  const [addingSub, setAddingSub]       = useState(false);
  const [addingSubSub, setAddingSubSub] = useState(false);

  /* tag UI state */
  const [addingTag, setAddingTag]   = useState(false);
  const [tagFilter, setTagFilter]   = useState('');
  const [dragIndex, setDragIndex]   = useState<number | null>(null);
  const [dropIndex, setDropIndex]   = useState<number | null>(null);

  /* recipe UI state */
  const [recipeStockId, setRecipeStockId] = useState('');
  const [recipeQty, setRecipeQty]         = useState<number>(1);
  const [recipePrice, setRecipePrice]     = useState<number>(0);

  /* pre-fill states */
  const [preSelectName, setPreSelectName]         = useState('');
  const [recipeImportName, setRecipeImportName]   = useState('');

  const photoRef = useRef<HTMLInputElement>(null);

  /* helpers */
  const set = makeSetField(draft, onDraftChange);

  const selectedCat = categories.find((c) => c.id === draft.categoryId) ?? null;
  const selectedSub = selectedCat?.subs.find((s) => s.name === draft.subCategory) ?? null;

  function handleCatChange(name: string) {
    const cat = categories.find((c) => c.name === name);
    onDraftChange({ ...draft, categoryId: cat?.id ?? '', subCategory: '', subSubCategory: '' });
    setAddingSub(false);
    setAddingSubSub(false);
  }

  function handleSubChange(name: string) {
    onDraftChange({ ...draft, subCategory: name, subSubCategory: '' });
    setAddingSubSub(false);
  }

  function clearCat() {
    onDraftChange({ ...draft, categoryId: '', subCategory: '', subSubCategory: '' });
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleTag(tag: string) {
    const next = draft.tags.includes(tag)
      ? draft.tags.filter((existing) => existing !== tag)
      : [...draft.tags, tag];
    set('tags', next);
  }

  /* drag-and-drop for tag priority */
  function onDragStart(index: number) {
    setDragIndex(index);
  }
  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDropIndex(index);
  }
  function onDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null); setDropIndex(null); return;
    }
    const next = [...draft.tags];
    const [removed] = next.splice(dragIndex, 1);
    next.splice(index, 0, removed);
    set('tags', next);
    setDragIndex(null); setDropIndex(null);
  }
  function onDragEnd() { setDragIndex(null); setDropIndex(null); }

  /* recipe */
  function addIngredient() {
    if (!recipeStockId || recipeQty <= 0) return;
    if (draft.recipe.find((r) => r.stockId === recipeStockId)) return;
    const oldIngTotal = draft.recipe.reduce((s, r) => s + (r.price ?? 0), 0);
    const base = draft.price - oldIngTotal;
    const ing = { stockId: recipeStockId, quantity: recipeQty, price: recipePrice || undefined };
    const newRecipe = [...draft.recipe, ing];
    const newIngTotal = newRecipe.reduce((s, r) => s + (r.price ?? 0), 0);
    onDraftChange({ ...draft, recipe: newRecipe, price: parseFloat((base + newIngTotal).toFixed(2)) });
    setRecipeStockId(''); setRecipeQty(1); setRecipePrice(0);
  }
  function removeIngredient(id: string) {
    const oldIngTotal = draft.recipe.reduce((s, r) => s + (r.price ?? 0), 0);
    const base = draft.price - oldIngTotal;
    const newRecipe = draft.recipe.filter((r) => r.stockId !== id);
    const newIngTotal = newRecipe.reduce((s, r) => s + (r.price ?? 0), 0);
    onDraftChange({ ...draft, recipe: newRecipe, price: parseFloat((base + newIngTotal).toFixed(2)) });
  }
  function updateIngredientPrice(stockId: string, price: number) {
    const oldIngTotal = draft.recipe.reduce((s, r) => s + (r.price ?? 0), 0);
    const base = draft.price - oldIngTotal;
    const newRecipe = draft.recipe.map((r) =>
      r.stockId === stockId ? { ...r, price: price || undefined } : r,
    );
    const newIngTotal = newRecipe.reduce((s, r) => s + (r.price ?? 0), 0);
    onDraftChange({ ...draft, recipe: newRecipe, price: parseFloat((base + newIngTotal).toFixed(2)) });
  }
  function getStock(id: string): StockRef | undefined {
    return stockItems.find((s) => s.id === id);
  }

  /* pre-fill from existing dish */
  function handlePreSelect(name: string) {
    setPreSelectName(name);
    const item = items.find((i) => i.name === name);
    if (!item) return;
    const { id: _id, ...rest } = item;
    onDraftChange({ ...rest });
  }

  const visibleTags = tagFilter
    ? allTags.filter((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    : allTags;
  const unselectedTags = visibleTags.filter((tag) => !draft.tags.includes(tag));

  return (
    <div className="space-y-4">

      {/* ── Pre-fill from existing dish ──────────────────────── */}
      {items.length > 0 && !isEditMode && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex-shrink-0 uppercase tracking-wide">
              {t.labels.preSelect}
            </span>
            <div className="flex-1">
              <SearchSelect
                value={preSelectName}
                onChange={handlePreSelect}
                options={items.map((i) => i.name)}
                placeholder={t.placeholders.selectDish}
                searchPlaceholder={t.placeholders.search}
                noResultsText={t.labels.noItems}
              />
            </div>
            {preSelectName && (
              <button
                type="button"
                onClick={() => { setPreSelectName(''); onDraftChange({ name: '', categoryId: '', subCategory: '', subSubCategory: '', price: 0, description: '', photo: '', tags: [], recipe: [], available: true, prepTime: 0, visible: true, branches: [] }); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
          {preSelectName && (() => {
            const picked = items.find((i) => i.name === preSelectName);
            if (!picked) return null;
            return (
              <div className="flex items-center gap-3 text-xs px-1">
                <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                  {picked.price > 0 ? `${picked.price.toFixed(2)} €` : '—'}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {picked.recipe.length} {t.sections.recipe.toLowerCase()}
                </span>
                {picked.tags.length > 0 && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {picked.tags.slice(0, 3).join(', ')}
                      {picked.tags.length > 3 && ` +${picked.tags.length - 3}`}
                    </span>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Informations de base ─────────────────────────────── */}
      <Card title={isEditMode ? `${t.labels.edit} — ${draft.name}` : t.sections.form}>

        <Field label={t.fields.name} required error={fieldErrors.name}>
          <input
            type="text"
            className={inputCls}
            placeholder={t.placeholders.name}
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>

        {/* 3-level category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.fields.category}
            </label>
            {draft.categoryId && (
              <button type="button" onClick={clearCat} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                × {t.labels.clearCategory}
              </button>
            )}
          </div>

          {/* Level 1 — main */}
          <div className="space-y-1.5">
            <SearchSelect
              value={selectedCat?.name ?? ''}
              onChange={handleCatChange}
              options={categories.map((c) => c.name)}
              placeholder={t.placeholders.noCategory}
              searchPlaceholder={t.placeholders.search}
              noResultsText={t.labels.noItems}
            />
            {addingCat ? (
              <InlineAdd
                placeholder={t.placeholders.addCategory}
                onAdd={(name) => { onAddCategory(name); setAddingCat(false); }}
                onCancel={() => setAddingCat(false)}
              />
            ) : (
              <button type="button" onClick={() => setAddingCat(true)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
                {t.labels.addCategory}
              </button>
            )}
          </div>

          {/* Level 2 — sub */}
          <div className="space-y-1.5">
            <SearchSelect
              value={draft.subCategory}
              onChange={handleSubChange}
              options={selectedCat?.subs.map((s) => s.name) ?? []}
              placeholder={t.placeholders.noCategory}
              searchPlaceholder={t.placeholders.search}
              noResultsText={t.labels.noItems}
              disabled={!draft.categoryId}
            />
            {draft.categoryId && (addingSub ? (
              <InlineAdd
                placeholder={t.placeholders.addSub}
                onAdd={(sub) => { onAddSub(draft.categoryId, sub); setAddingSub(false); }}
                onCancel={() => setAddingSub(false)}
              />
            ) : (
              <button type="button" onClick={() => setAddingSub(true)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
                {t.labels.addSub}
              </button>
            ))}
          </div>

          {/* Level 3 — sub-sub */}
          <div className="space-y-1.5">
            <SearchSelect
              value={draft.subSubCategory}
              onChange={(v) => set('subSubCategory', v)}
              options={selectedSub?.subs ?? []}
              placeholder={t.placeholders.noCategory}
              searchPlaceholder={t.placeholders.search}
              noResultsText={t.labels.noItems}
              disabled={!draft.subCategory}
            />
            {draft.subCategory && (addingSubSub ? (
              <InlineAdd
                placeholder={t.placeholders.addSubSub}
                onAdd={(sub) => { onAddSubSub(draft.categoryId, draft.subCategory, sub); setAddingSubSub(false); }}
                onCancel={() => setAddingSubSub(false)}
              />
            ) : (
              <button type="button" onClick={() => setAddingSubSub(true)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
                {t.labels.addSubSub}
              </button>
            ))}
          </div>
        </div>

        <Field label={t.fields.price}>
          <input type="number" min={0} step={0.01} className={inputCls}
            placeholder={t.placeholders.price}
            value={draft.price || ''}
            onChange={(e) => set('price', Number(e.target.value))} />
        </Field>

        <Field label={t.fields.description}>
          <textarea className={`${textareaCls} resize-none h-24`}
            placeholder={t.placeholders.description}
            value={draft.description}
            onChange={(e) => set('description', e.target.value)} />
        </Field>
      </Card>

      {/* ── Photo ──────────────────────────────────────────────── */}
      <Card title={t.fields.photo}>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <div onClick={() => photoRef.current?.click()} className="cursor-pointer group">
          {draft.photo ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <img src={draft.photo} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">{t.labels.changePhoto}</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
              <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm text-slate-400">{t.labels.uploadPhoto}</span>
            </div>
          )}
        </div>
      </Card>

      {/* ── Tags ───────────────────────────────────────────────── */}
      <Card title={t.fields.tags}>
        <input type="text" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}
          placeholder={t.placeholders.search}
          className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50" />

        {/* Selected tags — draggable for priority */}
        {draft.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.labels.dragToSort}</p>
            <div className="flex flex-wrap gap-2">
              {draft.tags.map((tag, index) => (
                <div
                  key={tag}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-teal-500 bg-teal-500 text-white cursor-grab active:cursor-grabbing select-none transition-all ${
                    dragIndex === index ? 'opacity-40 scale-95' : ''
                  } ${dropIndex === index && dragIndex !== index ? 'ring-2 ring-teal-200 scale-105' : ''}`}
                >
                  {/* grip dots */}
                  <svg className="w-3 h-3 opacity-60 flex-shrink-0" viewBox="0 0 12 20" fill="currentColor">
                    <circle cx="3" cy="4" r="1.5"/><circle cx="9" cy="4" r="1.5"/>
                    <circle cx="3" cy="10" r="1.5"/><circle cx="9" cy="10" r="1.5"/>
                    <circle cx="3" cy="16" r="1.5"/><circle cx="9" cy="16" r="1.5"/>
                  </svg>
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
                    className="opacity-70 hover:opacity-100 leading-none ml-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unselected tags */}
        {(unselectedTags.length > 0 || !addingTag) && (
          <div className="flex flex-wrap gap-2">
            {unselectedTags.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className="px-3 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {tag}
              </button>
            ))}
            {addingTag ? (
              <InlineAdd
                placeholder={t.placeholders.addTag}
                onAdd={(tag) => {
                  onAddTag(tag);
                  setAddingTag(false);
                  const next = draft.tags.includes(tag) ? draft.tags : [...draft.tags, tag];
                  onDraftChange({ ...draft, tags: next });
                }}
                onCancel={() => setAddingTag(false)}
              />
            ) : (
              <button type="button" onClick={() => setAddingTag(true)}
                className="px-3 py-1 rounded-full text-xs font-medium text-teal-600 dark:text-teal-400 border border-dashed border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
                + {t.placeholders.addTag}
              </button>
            )}
          </div>
        )}
      </Card>

      {/* ── Recette ────────────────────────────────────────────── */}
      <Card title={t.sections.recipe}>

        {/* Import recipe from another dish */}
        {items.filter((i) => i.recipe.length > 0).length > 0 && (() => {
          const sourceItem = recipeImportName
            ? items.find((i) => i.name === recipeImportName)
            : null;
          return (
            <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <SearchSelect
                value={recipeImportName}
                onChange={setRecipeImportName}
                options={items.filter((i) => i.recipe.length > 0).map((i) => i.name)}
                placeholder={t.placeholders.importRecipeFrom}
                searchPlaceholder={t.placeholders.search}
                noResultsText={t.labels.noItems}
              />

              {sourceItem && sourceItem.recipe.length > 0 && (
                <div className="rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                    {sourceItem.recipe.map((ing) => {
                      const stock = getStock(ing.stockId);
                      const inv = stock?.inventory;
                      const ppu = stock?.pricePerUnit;
                      return (
                        <li key={ing.stockId}
                          className="flex items-center justify-between px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/40">
                          <span className="text-slate-600 dark:text-slate-300 truncate flex-1 min-w-0 mr-2">
                            {stock?.name ?? ing.stockId}
                          </span>
                          <span className="tabular-nums text-slate-500 dark:text-slate-400 text-xs flex-shrink-0 mr-2">
                            {ing.quantity} {stock?.unit}
                          </span>
                          {(inv != null || ppu != null) && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                              {inv != null ? `${inv} ${stock?.unit}` : ''}
                              {inv != null && ppu != null ? ' · ' : ''}
                              {ppu != null ? `${ppu.toFixed(2)} €` : ''}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      const existing = new Set(draft.recipe.map((r) => r.stockId));
                      const toAdd = sourceItem.recipe.filter((r) => !existing.has(r.stockId));
                      const oldIngTotal = draft.recipe.reduce((s, r) => s + (r.price ?? 0), 0);
                      const base = draft.price - oldIngTotal;
                      const newRecipe = [...draft.recipe, ...toAdd];
                      const newIngTotal = newRecipe.reduce((s, r) => s + (r.price ?? 0), 0);
                      onDraftChange({ ...draft, recipe: newRecipe, price: parseFloat((base + newIngTotal).toFixed(2)) });
                      setRecipeImportName('');
                    }}
                    className="w-full py-2.5 text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: '#14b8a6' }}
                  >
                    {t.labels.importRecipe}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        <div className="space-y-2">
          {/* Stock select */}
          <SearchSelect
            value={stockItems.find((s) => s.id === recipeStockId)?.name ?? ''}
            onChange={(name) => {
              const s = stockItems.find((si) => si.name === name);
              setRecipeStockId(s?.id ?? '');
              setRecipePrice(0);
            }}
            options={stockItems.map((s) => s.name)}
            placeholder={t.placeholders.selectStock}
            searchPlaceholder={t.placeholders.search}
            noResultsText={t.labels.noStock}
          />

          {/* Stock info bar */}
          {recipeStockId && (() => {
            const s = getStock(recipeStockId);
            return (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{s?.inventory ?? '—'}</span>
                  <span>{s?.unit}</span>
                  <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {s?.pricePerUnit != null ? `${s.pricePerUnit.toFixed(2)} €` : '—'}
                  </span>
                  <span>/ {s?.unit}</span>
                </span>
              </div>
            );
          })()}

          {/* Qty + Price + Add */}
          <div className="flex gap-2 items-center">
            <input type="number" min={0.01} step={0.01}
              className={`${inputCls} flex-1`}
              placeholder={t.placeholders.quantity}
              value={recipeQty || ''}
              onChange={(e) => setRecipeQty(Number(e.target.value))} />
            <input type="number" min={0} step={0.01}
              className={`${inputCls} flex-1`}
              placeholder="€"
              value={recipePrice || ''}
              onChange={(e) => setRecipePrice(Number(e.target.value))} />
            <button type="button" onClick={addIngredient}
              disabled={!recipeStockId || recipeQty <= 0}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
              {t.labels.addIngredient}
            </button>
          </div>
        </div>

        {draft.recipe.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">{t.labels.noRecipe}</p>
        ) : (
          <>
            <div className="space-y-1.5">
              {draft.recipe.map((ing) => {
                const stock = getStock(ing.stockId);
                return (
                  <div key={ing.stockId} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2">
                    <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {stock?.name ?? ing.stockId}
                    </span>
                    <span className="text-xs tabular-nums text-slate-400 flex-shrink-0">
                      {ing.quantity} {stock?.unit}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="€"
                      value={ing.price ?? ''}
                      onChange={(e) => updateIngredientPrice(ing.stockId, Number(e.target.value))}
                      className="w-16 text-xs text-right bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50 flex-shrink-0"
                    />
                    <button type="button" onClick={() => removeIngredient(ing.stockId)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
            {draft.recipe.some((r) => r.price) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400 dark:text-slate-500">{t.fields.price}</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {draft.recipe.reduce((s, r) => s + (r.price ?? 0), 0).toFixed(2)} €
                </span>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ── Disponibilité ──────────────────────────────────────── */}
      <Card title={t.sections.status}>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.fields.available}</p>
            <p className="text-xs mt-0.5" style={{ color: draft.available ? '#16a34a' : '#f87171' }}>
              {draft.available ? t.labels.inService : t.labels.outOfService}
            </p>
          </div>
          <Toggle value={draft.available} onChange={(v) => set('available', v)} colorOn="#22c55e" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.fields.visible}</p>
            <p className="text-xs mt-0.5" style={{ color: draft.visible ? '#0284c7' : '#94a3b8' }}>
              {draft.visible ? t.labels.shownOnMenu : t.labels.hiddenFromMenu}
            </p>
          </div>
          <Toggle value={draft.visible} onChange={(v) => set('visible', v)} colorOn="#0ea5e9" />
        </div>

        <Field label={`${t.fields.prepTime} (${t.labels.prepTimeUnit})`}>
          <input type="number" min={0} className={inputCls}
            value={draft.prepTime || ''}
            onChange={(e) => set('prepTime', Number(e.target.value))} />
        </Field>

        {branches.length > 0 && (
          <Field label={t.fields.branches}>
            <div className="flex flex-wrap gap-2">
              {branches.map((branch) => {
                const selected = draft.branches.includes(branch);
                return (
                  <button key={branch} type="button"
                    onClick={() => set('branches', selected ? draft.branches.filter((b) => b !== branch) : [...draft.branches, branch])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                    style={{ backgroundColor: selected ? '#14b8a615' : 'transparent', color: selected ? '#0d9488' : '#94a3b8', border: `1.5px solid ${selected ? '#14b8a6' : '#cbd5e1'}` }}>
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

      </Card>

    </div>
  );
}
