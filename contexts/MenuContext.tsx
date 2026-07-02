'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuData, MenuItem, MenuItemForm, StockRef } from '@/types/menu';
import { MENU_ITEM_DEFAULTS } from '@/types/menu';
import { useLocale } from '@/contexts/LocaleContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { BRANCHES } from '@/data/branches';

export const MENU_STOCK_REFS: StockRef[] = [
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

const SAMPLE_ITEMS: MenuItem[] = [
  { id: 's1',  name: 'Salade César',        categoryId: 'cat-0', subCategory: '', subSubCategory: '', price: 9.5,  description: 'Salade romaine, parmesan, croûtons, sauce César maison.',               photo: '', tags: ['Végétarien', 'Populaire'], recipe: [{ stockId: '1', quantity: 0.02 }, { stockId: '10', quantity: 0.04 }], available: true, prepTime: 10, visible: true, branches: ['Strasbourg', 'Lyon'] },
  { id: 's2',  name: "Soupe à l'oignon",    categoryId: 'cat-0', subCategory: '', subSubCategory: '', price: 7.5,  description: "Soupe à l'oignon gratinée avec fromage fondu et pain grillé.",         photo: '', tags: ['Populaire'],              recipe: [{ stockId: '5', quantity: 0.03 }, { stockId: '10', quantity: 0.06 }], available: true, prepTime: 20, visible: true, branches: [] },
  { id: 's3',  name: 'Bruschetta tomates',  categoryId: 'cat-0', subCategory: '', subSubCategory: '', price: 6.5,  description: "Pain grillé frotté à l'ail, tomates fraîches, basilic et huile d'olive.", photo: '', tags: ['Vegan', 'Végétarien'],   recipe: [{ stockId: '1', quantity: 0.03 }, { stockId: '8', quantity: 0.15 }], available: true, prepTime: 8,  visible: true, branches: ['Strasbourg'] },
  { id: 's4',  name: 'Poulet rôti',         categoryId: 'cat-1', subCategory: '', subSubCategory: '', price: 16.0, description: 'Demi-poulet rôti aux herbes de Provence, servi avec pommes de terre.',  photo: '', tags: ['Populaire', 'Halal'],     recipe: [{ stockId: '9', quantity: 0.35 }, { stockId: '1', quantity: 0.04 }], available: true, prepTime: 35, visible: true, branches: ['Strasbourg', 'Lyon', 'Paris'] },
  { id: 's5',  name: 'Steak frites',        categoryId: 'cat-1', subCategory: '', subSubCategory: '', price: 19.5, description: 'Entrecôte grillée, frites maison croustillantes et sauce béarnaise.',  photo: '', tags: ['Populaire'],              recipe: [{ stockId: '5', quantity: 0.02 }], available: true, prepTime: 20, visible: true, branches: [] },
  { id: 's6',  name: 'Pasta Carbonara',     categoryId: 'cat-1', subCategory: '', subSubCategory: '', price: 14.0, description: "Spaghetti à la crème, lardons, parmesan et jaune d'œuf.",               photo: '', tags: ['Populaire'],              recipe: [{ stockId: '6', quantity: 2 }, { stockId: '10', quantity: 0.06 }], available: true, prepTime: 18, visible: true, branches: ['Paris', 'Lyon'] },
  { id: 's7',  name: 'Risotto champignons', categoryId: 'cat-1', subCategory: '', subSubCategory: '', price: 13.5, description: 'Risotto crémeux aux champignons des bois, parmesan et herbes fraîches.', photo: '', tags: ['Végétarien'],             recipe: [{ stockId: '5', quantity: 0.04 }, { stockId: '10', quantity: 0.05 }], available: true, prepTime: 25, visible: true, branches: ['Strasbourg'] },
  { id: 's8',  name: 'Crème brûlée',        categoryId: 'cat-2', subCategory: '', subSubCategory: '', price: 7.0,  description: 'Crème vanille avec sa croûte de sucre caramélisée à la flamme.',       photo: '', tags: ['Végétarien', 'Populaire'], recipe: [{ stockId: '6', quantity: 3 }, { stockId: '7', quantity: 0.2 }], available: true, prepTime: 15, visible: true, branches: ['Strasbourg', 'Lyon', 'Paris'] },
  { id: 's9',  name: 'Mousse au chocolat',  categoryId: 'cat-2', subCategory: '', subSubCategory: '', price: 6.5,  description: 'Mousse au chocolat noir maison, légère et onctueuse.',                  photo: '', tags: ['Végétarien'],             recipe: [{ stockId: '6', quantity: 4 }, { stockId: '5', quantity: 0.02 }], available: true, prepTime: 10, visible: true, branches: ['Lyon'] },
  { id: 's10', name: "Jus d'orange frais",  categoryId: 'cat-3', subCategory: '', subSubCategory: '', price: 4.5,  description: "Jus d'orange pressé à la commande, sans sucre ajouté.",                photo: '', tags: ['Vegan', 'Végétarien'],   recipe: [], available: true, prepTime: 3, visible: true, branches: [] },
];

interface MenuContextValue {
  data: MenuData;
  allTags: string[];
  stockItems: StockRef[];
  branches: string[];
  editingItem: MenuItem | null;
  saveItem: (draft: MenuItemForm) => { ok: boolean; error: string | null };
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  toggleAvailable: (id: string) => void;
  toggleVisible: (id: string) => void;
  addCategory: (name: string) => void;
  addSub: (categoryId: string, sub: string) => void;
  addSubSub: (categoryId: string, subName: string, subSub: string) => void;
  addTag: (tag: string) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useLocale().menu;
  const { categories, addCategory, addSub, addSubSub } = useCategories();

  const [items, setItems] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const data: MenuData = { categories, items, customTags };
  const allTags = [...t.defaultTags, ...customTags];

  function saveItem(draft: MenuItemForm): { ok: boolean; error: string | null } {
    if (!draft.name.trim()) return { ok: false, error: `${t.fields.name} is required` };
    const isDuplicate = items.some(
      (i) => i.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && i.id !== editingItem?.id,
    );
    if (isDuplicate) return { ok: false, error: t.labels.duplicateName };

    const saved: MenuItem = editingItem
      ? { ...draft, id: editingItem.id }
      : { ...draft, id: Date.now().toString() };

    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? saved : i)));
    } else {
      setItems((prev) => [...prev, saved]);
    }
    setEditingItem(null);
    return { ok: true, error: null };
  }

  function startEdit(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setEditingItem(item);
    router.push('/menu');
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  function toggleAvailable(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  }

  function toggleVisible(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)));
  }

  function addTag(tag: string) {
    if (allTags.some((e) => e.toLowerCase() === tag.toLowerCase())) return;
    setCustomTags((prev) => [...prev, tag]);
  }

  return (
    <MenuContext.Provider value={{
      data, allTags, stockItems: MENU_STOCK_REFS, branches: BRANCHES,
      editingItem, saveItem, startEdit, cancelEdit,
      toggleAvailable, toggleVisible,
      addCategory, addSub, addSubSub, addTag,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
