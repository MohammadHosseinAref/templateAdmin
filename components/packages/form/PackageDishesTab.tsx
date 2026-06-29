'use client';

import type { PackageDishesTabProps } from '@/types/packages';
import { Card, Field } from '@/components/ui/card';
import { inputCls, textareaCls } from '@/components/ui/styles';
import { useLocale } from '@/contexts/LocaleContext';
import { makeSetField } from '@/lib/formUtils';
import PackageDishPicker from './PackageDishPicker';

export default function PackageDishesTab({
  draft, editId, menuCategories, menuItems,
  onDraftChange, onAddMenuCategory, onAddMenuSub, fieldErrors,
}: PackageDishesTabProps) {
  const t = useLocale().packages;
  const set = makeSetField(draft, onDraftChange);

  return (
    <Card title={editId ? `${t.labels.edit} — ${draft.name || '…'}` : t.sections.dishes}>

      <Field label={t.fields.name} required error={fieldErrors.name}>
        <input
          type="text"
          className={inputCls}
          placeholder={t.placeholders.name}
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </Field>

      <Field label={t.fields.description}>
        <textarea
          className={`${textareaCls} resize-none h-20`}
          placeholder={t.placeholders.description}
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>

      <div className="border-t border-slate-100 dark:border-slate-700" />

      <PackageDishPicker
        dishes={draft.dishes}
        menuCategories={menuCategories}
        menuItems={menuItems}
        onDishesChange={(dishes) => set('dishes', dishes)}
        onAddMenuCategory={onAddMenuCategory}
        onAddMenuSub={onAddMenuSub}
      />

    </Card>
  );
}
