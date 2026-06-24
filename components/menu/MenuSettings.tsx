'use client';

import { useState } from 'react';
import type { MenuData, MenuItem, MenuItemForm, StockRef } from '@/types/menu';
import { MENU_ITEM_DEFAULTS } from '@/types/menu';
import { useLocale } from '@/contexts/LocaleContext';
import MenuForm from './MenuForm';
import MenuPreview from './MenuPreview';

const STOCK_REFS: StockRef[] = [
  { id: '1',  name: "Huile d'olive",   unit: 'L',     inventory: 8.5,  pricePerUnit: 6.20  },
  { id: '2',  name: 'Farine T55',      unit: 'kg',    inventory: 25,   pricePerUnit: 0.90  },
  { id: '3',  name: 'Sucre en poudre', unit: 'kg',    inventory: 12,   pricePerUnit: 1.10  },
  { id: '4',  name: 'Sel fin',         unit: 'kg',    inventory: 5,    pricePerUnit: 0.60  },
  { id: '5',  name: 'Beurre doux',     unit: 'kg',    inventory: 4.5,  pricePerUnit: 8.50  },
  { id: '6',  name: 'Œufs frais',      unit: 'pièce', inventory: 60,   pricePerUnit: 0.35  },
  { id: '7',  name: 'Lait entier',     unit: 'L',     inventory: 10,   pricePerUnit: 1.20  },
  { id: '8',  name: 'Tomates cerises', unit: 'kg',    inventory: 3.2,  pricePerUnit: 4.80  },
  { id: '9',  name: 'Filet de poulet', unit: 'kg',    inventory: 7.5,  pricePerUnit: 12.00 },
  { id: '10', name: 'Fromage râpé',    unit: 'kg',    inventory: 2.8,  pricePerUnit: 9.50  },
];

// cat-0 = Entrée, cat-1 = Plat principal, cat-2 = Dessert, cat-3 = Boisson
const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: 's1', name: 'Salade César', categoryId: 'cat-0', subCategory: '', subSubCategory: '',
    price: 9.5, description: 'Salade romaine, parmesan, croûtons, sauce César maison.', photo: '',
    tags: ['Végétarien', 'Populaire'], recipe: [{ stockId: '1', quantity: 0.02 }, { stockId: '10', quantity: 0.04 }],
    available: true, prepTime: 10, visible: true,
  },
  {
    id: 's2', name: 'Soupe à l\'oignon', categoryId: 'cat-0', subCategory: '', subSubCategory: '',
    price: 7.5, description: 'Soupe à l\'oignon gratinée avec fromage fondu et pain grillé.', photo: '',
    tags: ['Populaire'], recipe: [{ stockId: '5', quantity: 0.03 }, { stockId: '10', quantity: 0.06 }],
    available: true, prepTime: 20, visible: true,
  },
  {
    id: 's3', name: 'Bruschetta tomates', categoryId: 'cat-0', subCategory: '', subSubCategory: '',
    price: 6.5, description: 'Pain grillé frotté à l\'ail, tomates fraîches, basilic et huile d\'olive.', photo: '',
    tags: ['Vegan', 'Végétarien'], recipe: [{ stockId: '1', quantity: 0.03 }, { stockId: '8', quantity: 0.15 }, { stockId: '4', quantity: 0.005 }],
    available: true, prepTime: 8, visible: true,
  },
  {
    id: 's4', name: 'Poulet rôti', categoryId: 'cat-1', subCategory: '', subSubCategory: '',
    price: 16.0, description: 'Demi-poulet rôti aux herbes de Provence, servi avec pommes de terre.', photo: '',
    tags: ['Populaire', 'Halal'], recipe: [{ stockId: '9', quantity: 0.35 }, { stockId: '1', quantity: 0.04 }, { stockId: '4', quantity: 0.005 }],
    available: true, prepTime: 35, visible: true,
  },
  {
    id: 's5', name: 'Steak frites', categoryId: 'cat-1', subCategory: '', subSubCategory: '',
    price: 19.5, description: 'Entrecôte grillée, frites maison croustillantes et sauce béarnaise.', photo: '',
    tags: ['Populaire'], recipe: [{ stockId: '5', quantity: 0.02 }, { stockId: '4', quantity: 0.003 }],
    available: true, prepTime: 20, visible: true,
  },
  {
    id: 's6', name: 'Pasta Carbonara', categoryId: 'cat-1', subCategory: '', subSubCategory: '',
    price: 14.0, description: 'Spaghetti à la crème, lardons, parmesan et jaune d\'œuf.', photo: '',
    tags: ['Populaire'], recipe: [{ stockId: '6', quantity: 2 }, { stockId: '10', quantity: 0.06 }, { stockId: '4', quantity: 0.003 }],
    available: true, prepTime: 18, visible: true,
  },
  {
    id: 's7', name: 'Risotto champignons', categoryId: 'cat-1', subCategory: '', subSubCategory: '',
    price: 13.5, description: 'Risotto crémeux aux champignons des bois, parmesan et herbes fraîches.', photo: '',
    tags: ['Végétarien'], recipe: [{ stockId: '5', quantity: 0.04 }, { stockId: '10', quantity: 0.05 }, { stockId: '7', quantity: 0.1 }],
    available: true, prepTime: 25, visible: true,
  },
  {
    id: 's8', name: 'Crème brûlée', categoryId: 'cat-2', subCategory: '', subSubCategory: '',
    price: 7.0, description: 'Crème vanille avec sa croûte de sucre caramélisée à la flamme.', photo: '',
    tags: ['Végétarien', 'Populaire'], recipe: [{ stockId: '6', quantity: 3 }, { stockId: '7', quantity: 0.2 }, { stockId: '3', quantity: 0.05 }],
    available: true, prepTime: 15, visible: true,
  },
  {
    id: 's9', name: 'Mousse au chocolat', categoryId: 'cat-2', subCategory: '', subSubCategory: '',
    price: 6.5, description: 'Mousse au chocolat noir maison, légère et onctueuse.', photo: '',
    tags: ['Végétarien'], recipe: [{ stockId: '6', quantity: 4 }, { stockId: '3', quantity: 0.04 }, { stockId: '5', quantity: 0.02 }],
    available: true, prepTime: 10, visible: true,
  },
  {
    id: 's10', name: 'Jus d\'orange frais', categoryId: 'cat-3', subCategory: '', subSubCategory: '',
    price: 4.5, description: 'Jus d\'orange pressé à la commande, sans sucre ajouté.', photo: '',
    tags: ['Vegan', 'Végétarien'], recipe: [],
    available: true, prepTime: 3, visible: true,
  },
];

export default function MenuSettings() {
  const t = useLocale().menu;

  const [data, setData] = useState<MenuData>(() => ({
    categories: t.defaultCategories.map((name, i) => ({
      id: `cat-${i}`,
      name,
      subs: [],
    })),
    items: SAMPLE_ITEMS,
    customTags: [],
  }));

  const allTags = [...t.defaultTags, ...data.customTags];

  const [draft, setDraft]           = useState<MenuItemForm>({ ...MENU_ITEM_DEFAULTS });
  const [editId, setEditId]         = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  function resetForm() {
    setEditId(null);
    setDraft({ ...MENU_ITEM_DEFAULTS });
    setFormError(null);
  }

  function handleDraftChange(next: MenuItemForm) {
    setDraft(next);
    if (formError) setFormError(null);
  }

  function handleSave() {
    console.log('[Menu] Save clicked — draft:', draft);
    if (!draft.name.trim()) {
      setFormError(t.fields.name + ' is required');
      return;
    }
    const duplicate = data.items.some(
      (i) => i.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && i.id !== (editId ?? undefined),
    );
    if (duplicate) { setFormError(t.labels.duplicateName); return; }

    const savedItem = editId ? { ...draft, id: editId } : { ...draft, id: Date.now().toString() };
    console.log(editId ? '✏️ [Menu] Updated item:' : '✅ [Menu] New item:', savedItem);

    if (editId) {
      setData((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === editId ? savedItem : i)) }));
    } else {
      setData((prev) => ({ ...prev, items: [...prev.items, savedItem] }));
    }
    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleAddCategory(name: string) {
    if (data.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: `cat-${Date.now()}`, name, subs: [] }],
    }));
  }

  function handleAddSub(categoryId: string, sub: string) {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId && !c.subs.some((s) => s.name === sub)
          ? { ...c, subs: [...c.subs, { name: sub, subs: [] }] }
          : c,
      ),
    }));
  }

  function handleAddSubSub(categoryId: string, subName: string, subSub: string) {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.name === subName && !s.subs.includes(subSub)
                  ? { ...s, subs: [...s.subs, subSub] }
                  : s,
              ),
            }
          : c,
      ),
    }));
  }

  function handleAddTag(tag: string) {
    if (allTags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
    setData((prev) => ({ ...prev, customTags: [...prev.customTags, tag] }));
  }

  return (
    <div className="px-3 pt-2 pb-8">
      <div className="grid lg:grid-cols-[1fr_340px] gap-4 items-start">
        <MenuForm
          draft={draft}
          editId={editId}
          categories={data.categories}
          allTags={allTags}
          items={data.items}
          stockItems={STOCK_REFS}
          onDraftChange={handleDraftChange}
          onAddCategory={handleAddCategory}
          onAddSub={handleAddSub}
          onAddSubSub={handleAddSubSub}
          onAddTag={handleAddTag}
          error={formError}
        />
        <div className="lg:sticky lg:top-4 space-y-3">
          <MenuPreview
            draft={draft}
            categories={data.categories}
            stockItems={STOCK_REFS}
          />
          <div className="flex gap-2">
            {editId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 text-sm font-semibold rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {t.labels.cancelEdit}
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 text-sm font-semibold rounded-2xl transition-colors"
              style={{
                backgroundColor: saved ? '#22c55e' : editId !== null ? '#f59e0b' : '#14b8a6',
                color: '#fff',
              }}
            >
              {saved ? `✓ ${t.labels.saved}` : editId !== null ? t.labels.save : t.labels.add}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
