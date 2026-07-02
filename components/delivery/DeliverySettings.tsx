'use client';

import { useState } from 'react';
import type { DeliveryData, DeliveryPerson, DeliveryPersonForm } from '@/types/delivery';
import { freshDeliveryDraft } from '@/types/delivery';
import { useLocale } from '@/contexts/LocaleContext';
import DeliveryForm from './DeliveryForm';
import DeliveryList from './DeliveryList';
import ErrorModal from '@/components/ui/ErrorModal';
import { validateFields } from '@/lib/formUtils';
import { BRANCHES } from '@/data/branches';
import { SAMPLE_COURIERS } from '@/data/deliveryData';

export default function DeliverySettings() {
  const t = useLocale().delivery;
  const [data, setData]               = useState<DeliveryData>({ items: SAMPLE_COURIERS });
  const [editId, setEditId]           = useState<string | null>(null);
  const [draft, setDraft]             = useState<DeliveryPersonForm>(freshDeliveryDraft);
  const [saved, setSaved]             = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const VALIDATION_RULES: Array<{ key: keyof DeliveryPersonForm; message: string }> = [
    { key: 'firstName', message: t.labels.firstNameRequired },
    { key: 'lastName', message: t.labels.lastNameRequired },
    { key: 'phone', message: t.labels.phoneRequired },
  ];

  function resetForm() {
    setEditId(null);
    setDraft(freshDeliveryDraft());
    setFormError(null);
    setFieldErrors({});
  }

  function handleEdit(id: string) {
    const item = data.items.find((i) => i.id === id);
    if (!item) return;
    const { id: _id, history: _history, ...form } = item;
    setFormError(null);
    setFieldErrors({});
    setEditId(id);
    setDraft(form);
  }

  function handleCancelEdit() {
    resetForm();
  }

  function handleDraftChange(next: DeliveryPersonForm) {
    setDraft(next);
    if (formError) setFormError(null);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors(validateFields(next, VALIDATION_RULES));
  }

  function handleSave() {
    const errors = validateFields(draft, VALIDATION_RULES);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); setFormError(t.labels.requiredFields); return; }

    const duplicate = data.items.some(
      (i) => i.phone.trim() === draft.phone.trim() && i.id !== (editId ?? undefined),
    );
    if (duplicate) {
      setFormError(t.labels.duplicatePhone);
      return;
    }

    if (editId) {
      setData((prev) => ({
        items: prev.items.map((i) => (i.id === editId ? { ...draft, id: editId, history: i.history } : i)),
      }));
    } else {
      const newItem: DeliveryPerson = { ...draft, id: Date.now().toString(), history: [] };
      setData((prev) => ({ items: [...prev.items, newItem] }));
    }

    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDelete(id: string) {
    setData((prev) => ({ items: prev.items.filter((i) => i.id !== id) }));
    if (editId === id) resetForm();
  }

  function handleToggleActive(id: string) {
    setData((prev) => ({
      items: prev.items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)),
    }));
  }

  return (
    <>
      {formError && <ErrorModal message={formError} onClose={() => setFormError(null)} />}
      <div className="px-3 pt-2 pb-8 space-y-4">
        <DeliveryForm
          items={data.items}
          editId={editId}
          draft={draft}
          zones={BRANCHES}
          onCancelEdit={handleCancelEdit}
          onDraftChange={handleDraftChange}
          onSave={handleSave}
          saved={saved}
          fieldErrors={fieldErrors}
        />
        <DeliveryList
          items={data.items}
          editId={editId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </div>
    </>
  );
}
