'use client';

import { useState } from 'react';
import type { StockData, StockItem, StockItemForm } from '@/types/stock';
import { STOCK_FORM_DEFAULTS } from '@/types/stock';
import { useLocale } from '@/contexts/LocaleContext';
import StockForm from './StockForm';
import StockList from './StockList';
import ErrorModal from '@/components/ui/ErrorModal';
import { validateFields } from '@/lib/formUtils';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function freshDraft(): StockItemForm {
  return { ...STOCK_FORM_DEFAULTS, dateAdded: todayStr() };
}

const SAMPLE_ITEMS: StockItem[] = [
  { id: '1',  name: "Huile d'olive",   unit: 'L',     inventory: 15,  minInventory: 5,  pricePerUnit: 8.50,  dateAdded: '2026-06-20', expiryDate: '2027-06-20' },
  { id: '2',  name: 'Farine T55',      unit: 'kg',    inventory: 25,  minInventory: 10, pricePerUnit: 1.20,  dateAdded: '2026-06-15', expiryDate: '2026-12-15' },
  { id: '3',  name: 'Sucre en poudre', unit: 'kg',    inventory: 20,  minInventory: 8,  pricePerUnit: 0.90,  dateAdded: '2026-06-10', expiryDate: '2027-06-10' },
  { id: '4',  name: 'Sel fin',         unit: 'kg',    inventory: 10,  minInventory: 3,  pricePerUnit: 0.40,  dateAdded: '2026-05-01', expiryDate: ''           },
  { id: '5',  name: 'Beurre doux',     unit: 'kg',    inventory: 8,   minInventory: 3,  pricePerUnit: 7.50,  dateAdded: '2026-06-20', expiryDate: '2026-07-10' },
  { id: '6',  name: 'Œufs frais',      unit: 'pièce', inventory: 120, minInventory: 36, pricePerUnit: 0.35,  dateAdded: '2026-06-22', expiryDate: '2026-06-30' },
  { id: '7',  name: 'Lait entier',     unit: 'L',     inventory: 6,   minInventory: 8,  pricePerUnit: 1.10,  dateAdded: '2026-06-23', expiryDate: '2026-06-27' },
  { id: '8',  name: 'Tomates cerises', unit: 'kg',    inventory: 12,  minInventory: 5,  pricePerUnit: 2.80,  dateAdded: '2026-06-22', expiryDate: '2026-06-23' },
  { id: '9',  name: 'Filet de poulet', unit: 'kg',    inventory: 18,  minInventory: 6,  pricePerUnit: 9.00,  dateAdded: '2026-06-23', expiryDate: '2026-06-28' },
  { id: '10', name: 'Fromage râpé',    unit: 'kg',    inventory: 1,   minInventory: 2,  pricePerUnit: 14.00, dateAdded: '2026-06-15', expiryDate: '2026-07-15' },
];

export default function StockSettings() {
  const t = useLocale().stock;
  const [data, setData]         = useState<StockData>({ items: SAMPLE_ITEMS });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editId, setEditId]         = useState<string | null>(null);
  const [draft, setDraft]           = useState<StockItemForm>(freshDraft);
  const [saved, setSaved]           = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const VALIDATION_RULES: Array<{ key: keyof StockItemForm; message: string }> = [
    { key: 'name', message: t.labels.nameRequired },
    { key: 'unit', message: t.labels.unitRequired },
  ];

  function resetForm() {
    setSelectedId(null);
    setEditId(null);
    setDraft(freshDraft());
    setFormError(null);
    setFieldErrors({});
  }

  function fillDraft(id: string) {
    const item = data.items.find((i) => i.id === id);
    if (!item) return;
    const { id: _id, ...form } = item;
    setDraft(form);
  }

  function handleSelectId(id: string | null) {
    setEditId(null);
    setFormError(null);
    setFieldErrors({});
    setSelectedId(id);
    if (id === null) setDraft(freshDraft());
    else fillDraft(id);
  }

  function handleEdit(id: string) {
    setSelectedId(null);
    setFormError(null);
    setFieldErrors({});
    setEditId(id);
    fillDraft(id);
  }

  function handleCancelEdit() {
    resetForm();
  }

  function handleDraftChange(next: StockItemForm) {
    setDraft(next);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors(validateFields(next, VALIDATION_RULES));
  }

  function handleSave() {
    const errors = validateFields(draft, VALIDATION_RULES);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); setFormError(t.labels.requiredFields); return; }

    const duplicate = data.items.some(
      (i) =>
        i.name.trim().toLowerCase() === draft.name.trim().toLowerCase() &&
        i.id !== (editId ?? undefined),
    );
    if (duplicate) {
      setFormError(t.labels.duplicateName);
      return;
    }

    if (editId) {
      setData((prev) => ({
        items: prev.items.map((i) => (i.id === editId ? { ...draft, id: editId } : i)),
      }));
    } else {
      const newItem: StockItem = { ...draft, id: Date.now().toString() };
      setData((prev) => ({ items: [...prev.items, newItem] }));
    }

    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDelete(id: string) {
    setData((prev) => ({ items: prev.items.filter((i) => i.id !== id) }));
    if (selectedId === id || editId === id) resetForm();
  }

  return (
    <>
      {formError && <ErrorModal message={formError} onClose={() => setFormError(null)} />}
      <div className="px-3 pt-2 pb-8 space-y-4">
      <StockForm
        items={data.items}
        selectedId={selectedId}
        editId={editId}
        draft={draft}
        onSelectId={handleSelectId}
        onCancelEdit={handleCancelEdit}
        onDraftChange={handleDraftChange}
        onSave={handleSave}
        saved={saved}
        fieldErrors={fieldErrors}
      />
      <StockList
        items={data.items}
        selectedId={selectedId}
        editId={editId}
        onSelectId={handleSelectId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </div>
    </>
  );
}
