'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuPackageForm } from '@/types/packages';
import { PACKAGE_DEFAULTS } from '@/types/packages';
import { useLocale } from '@/contexts/LocaleContext';
import { usePackages } from '@/contexts/PackagesContext';
import PackageForm from './form/PackageForm';
import PackagePreview from './PackagePreview';
import ErrorModal from '@/components/ui/ErrorModal';
import { validateFields } from '@/lib/formUtils';
import { SaveProgress } from '@/components/ui/FormWidgets';

export default function PackageSettings() {
  const router = useRouter();
  const t = useLocale().packages;
  const {
    data, menuCategories, menuItems, stockItems, branches,
    editingPackage, savePackage, cancelEdit,
    addMenuCategory, addMenuSub,
  } = usePackages();

  const [draft, setDraft]             = useState<MenuPackageForm>({ ...PACKAGE_DEFAULTS });
  const [saved, setSaved]             = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const VALIDATION_RULES: Array<{ key: keyof MenuPackageForm; message: string }> = [
    { key: 'name', message: t.labels.nameRequired },
  ];

  useEffect(() => {
    if (editingPackage) {
      const { id: _id, ...rest } = editingPackage;
      setDraft({ ...rest });
    } else {
      setDraft({ ...PACKAGE_DEFAULTS });
    }
    setFormError(null);
    setFieldErrors({});
  }, [editingPackage]);

  function handleDraftChange(next: MenuPackageForm) {
    setDraft(next);
    if (formError) setFormError(null);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors(validateFields(next, VALIDATION_RULES));
  }

  function handleSave() {
    const errors = validateFields(draft, VALIDATION_RULES);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); setFormError(t.labels.requiredFields); return; }
    const isEditing = editingPackage !== null;
    const result = savePackage(draft);
    if (!result.ok) { setFormError(result.error); return; }
    if (isEditing) {
      router.push('/packages/list');
    } else {
      setDraft({ ...PACKAGE_DEFAULTS });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function handleCancel() {
    cancelEdit();
    setDraft({ ...PACKAGE_DEFAULTS });
    setFormError(null);
    setFieldErrors({});
    router.push('/packages/list');
  }

  const editId = editingPackage?.id ?? null;

  return (
    <>
      {formError && <ErrorModal message={formError} onClose={() => setFormError(null)} />}
      <div className="pb-8 grid lg:grid-cols-[1fr_340px] gap-4 items-start px-3 pt-3">
      <PackageForm
        draft={draft}
        editId={editId}
        menuCategories={menuCategories}
        menuItems={menuItems}
        stockItems={stockItems}
        branches={branches}
        onDraftChange={handleDraftChange}
        onAddMenuCategory={addMenuCategory}
        onAddMenuSub={addMenuSub}
        fieldErrors={fieldErrors}
      />
      <div className="lg:sticky lg:top-4 space-y-3">
        <PackagePreview
          draft={draft}
          menuItems={menuItems}
          stockItems={stockItems}
          categories={data.categories}
          menuCategories={menuCategories}
          onNameChange={(name) => setDraft((prev) => ({ ...prev, name }))}
          onCategoryLabelChange={(catId, label) =>
            setDraft((prev) => ({
              ...prev,
              categoryLabels: { ...prev.categoryLabels, [catId]: label },
            }))
          }
        />
        <div className="flex gap-2">
          {editId !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 text-sm font-semibold rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {t.labels.cancelEdit}
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className="relative overflow-hidden flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed"
            style={{
              backgroundColor: saved ? '#22c55e' : editId !== null ? '#f59e0b' : '#14b8a6',
              color: '#fff',
            }}
          >
            {saved && <SaveProgress />}
            {saved ? `✓ ${t.labels.saved}` : editId !== null ? t.labels.save : t.labels.add}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
