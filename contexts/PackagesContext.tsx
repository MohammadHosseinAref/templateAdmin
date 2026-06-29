'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuItem, StockRef, MenuCategory } from '@/types/menu';
import type { PackagesData, MenuPackageForm, MenuPackage } from '@/types/packages';
import { PACKAGE_DEFAULTS } from '@/types/packages';
import { useLocale } from '@/contexts/LocaleContext';
import { useCategories } from '@/contexts/CategoriesContext';

const BRANCHES = ['مرکزی', 'شمال', 'جنوب', 'غرب'];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1',  name: 'Salade César',       categoryId: 'cat-0', subCategory: 'Salade',          subSubCategory: '', price: 9.5,  description: '', photo: '', tags: ['Végétarien', 'Populaire'], recipe: [{ stockId: 's1', quantity: 0.02, price: 0.20 }], available: true, prepTime: 10, visible: true, branches: [] },
  { id: 'm2',  name: "Soupe à l'oignon",   categoryId: 'cat-0', subCategory: 'Soupe',           subSubCategory: '', price: 7.5,  description: '', photo: '', tags: ['Populaire'],              recipe: [{ stockId: 's5', quantity: 0.03, price: 0.30 }], available: true, prepTime: 20, visible: true, branches: [] },
  { id: 'm10', name: 'Bruschetta tomates',  categoryId: 'cat-0', subCategory: 'Salade',          subSubCategory: '', price: 6.5,  description: '', photo: '', tags: ['Vegan'],                  recipe: [], available: true, prepTime: 8,  visible: true, branches: [] },
  { id: 'm3',  name: 'Poulet rôti',         categoryId: 'cat-1', subCategory: 'Viandes',         subSubCategory: '', price: 16.0, description: '', photo: '', tags: ['Populaire', 'Halal'],     recipe: [{ stockId: 's8', quantity: 0.35, price: 4.20 }], available: true, prepTime: 35, visible: true, branches: [] },
  { id: 'm4',  name: 'Steak frites',        categoryId: 'cat-1', subCategory: 'Viandes',         subSubCategory: '', price: 19.5, description: '', photo: '', tags: ['Populaire'],              recipe: [], available: true, prepTime: 20, visible: true, branches: [] },
  { id: 'm5',  name: 'Pasta Carbonara',     categoryId: 'cat-1', subCategory: 'Pâtes & Risotto', subSubCategory: '', price: 14.0, description: '', photo: '', tags: ['Populaire'],              recipe: [{ stockId: 's6', quantity: 2,    price: 0.70 }], available: true, prepTime: 18, visible: true, branches: [] },
  { id: 'm9',  name: 'Risotto champignons', categoryId: 'cat-1', subCategory: 'Pâtes & Risotto', subSubCategory: '', price: 13.5, description: '', photo: '', tags: ['Végétarien'],             recipe: [{ stockId: 's5', quantity: 0.04, price: 0.34 }], available: true, prepTime: 25, visible: true, branches: [] },
  { id: 'm6',  name: 'Crème brûlée',        categoryId: 'cat-2', subCategory: 'Classique',       subSubCategory: '', price: 7.0,  description: '', photo: '', tags: ['Végétarien'],             recipe: [{ stockId: 's6', quantity: 3,    price: 1.05 }], available: true, prepTime: 15, visible: true, branches: [] },
  { id: 'm7',  name: 'Mousse au chocolat',  categoryId: 'cat-2', subCategory: 'Chocolat',        subSubCategory: '', price: 6.5,  description: '', photo: '', tags: ['Végétarien'],             recipe: [], available: true, prepTime: 10, visible: true, branches: [] },
  { id: 'm8',  name: "Jus d'orange",        categoryId: 'cat-3', subCategory: '',                subSubCategory: '', price: 4.5,  description: '', photo: '', tags: ['Vegan'],                  recipe: [], available: true, prepTime: 3,  visible: true, branches: [] },
];

export const STOCK_REFS: StockRef[] = [
  { id: 's1', name: "Huile d'olive", unit: 'L',      inventory: 8.5, pricePerUnit: 6.20 },
  { id: 's2', name: 'Fromage râpé',  unit: 'kg',     inventory: 2.8, pricePerUnit: 9.50 },
  { id: 's3', name: 'Crème fraîche', unit: 'L',      inventory: 5.0, pricePerUnit: 3.50 },
  { id: 's4', name: 'Sel & épices',  unit: 'kg',     inventory: 3.0, pricePerUnit: 1.20 },
  { id: 's5', name: 'Beurre',        unit: 'kg',     inventory: 4.5, pricePerUnit: 8.50 },
  { id: 's6', name: 'Œufs frais',    unit: 'pièce',  inventory: 60,  pricePerUnit: 0.35 },
  { id: 's7', name: 'Tomates',       unit: 'kg',     inventory: 3.2, pricePerUnit: 4.80 },
  { id: 's8', name: 'Filet de poulet', unit: 'kg',   inventory: 7.5, pricePerUnit: 12.00 },
];

export { BRANCHES };

interface PackagesContextValue {
  data: PackagesData;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  stockItems: StockRef[];
  branches: string[];
  editingPackage: MenuPackage | null;
  savePackage: (draft: MenuPackageForm) => { ok: boolean; error: string | null };
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  addCategory: (name: string) => void;
  addSub: (categoryId: string, sub: string) => void;
  addMenuCategory: (name: string) => void;
  addMenuSub: (categoryId: string, subName: string) => void;
}

const PackagesContext = createContext<PackagesContextValue | null>(null);

export function PackagesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useLocale().packages;
  const { categories: menuCategories, addCategory: addMenuCategory, addSub: addMenuSub } = useCategories();

  const [data, setData] = useState<PackagesData>(() => {
    const categories = t.defaultCategories.map((name: string, i: number) => ({
      id: `pkg-cat-${i}`,
      name,
      subs: [],
    }));
    const packages: MenuPackage[] = [
      {
        id: 'demo-1',
        name: 'پکیج خانوادگی ویژه',
        categoryId: 'pkg-cat-1',
        subCategory: '',
        description: 'پکیج کامل برای خانواده‌های ۴ نفره با انواع پیش‌غذا و غذای اصلی',
        dishes: [
          { dishId: 'm1', quantity: 2 },
          { dishId: 'm2', quantity: 1 },
          { dishId: 'm3', quantity: 2 },
          { dishId: 'm4', quantity: 2 },
          { dishId: 'm6', quantity: 2 },
        ],
        addons: [
          { id: 'a1', name: 'نوشیدنی اضافه', price: 3.5, stockId: undefined },
          { id: 'a2', name: 'نان تازه', price: 1.5, stockId: undefined },
        ],
        price: 89.0,
        available: true,
        visible: 'visible',
        branches: ['مرکزی', 'شمال'],
        maxQuantity: 10,
        maxQuantityPerPerson: 0,
        alwaysAvailable: true,
        dateFrom: '',
        dateTo: '',
        discountPercent: 10,
        categoryLabels: {},
      },
      {
        id: 'demo-2',
        name: 'ناهار کاری سریع',
        categoryId: 'pkg-cat-2',
        subCategory: '',
        description: 'ناهار سریع و مقرون‌به‌صرفه برای محیط کار',
        dishes: [
          { dishId: 'm5', quantity: 1 },
          { dishId: 'm8', quantity: 1 },
        ],
        addons: [],
        price: 19.5,
        available: true,
        visible: 'visible',
        branches: ['مرکزی', 'جنوب', 'غرب'],
        maxQuantity: 0,
        maxQuantityPerPerson: 1,
        alwaysAvailable: false,
        dateFrom: '2026-06-01T11:00',
        dateTo: '2026-06-30T14:30',
        discountPercent: 0,
        categoryLabels: {},
      },
      {
        id: 'demo-3',
        name: 'منوی جشن و مهمانی',
        categoryId: 'pkg-cat-0',
        subCategory: '',
        description: 'منوی کامل برای مجالس و جشن‌ها با تنوع بالا',
        dishes: [
          { dishId: 'm10', quantity: 2 },
          { dishId: 'm2', quantity: 2 },
          { dishId: 'm3', quantity: 3 },
          { dishId: 'm9', quantity: 2 },
          { dishId: 'm7', quantity: 3 },
        ],
        addons: [
          { id: 'a3', name: 'دسر ویژه', price: 6.0, stockId: undefined },
        ],
        price: 129.0,
        available: true,
        visible: 'visible',
        branches: ['مرکزی'],
        maxQuantity: 5,
        maxQuantityPerPerson: 0,
        alwaysAvailable: true,
        dateFrom: '',
        dateTo: '',
        discountPercent: 15,
        categoryLabels: {},
      },
      {
        id: 'demo-4',
        name: 'پکیج دو نفره رمانتیک',
        categoryId: 'pkg-cat-3',
        subCategory: '',
        description: 'شام دو نفره با انتخاب‌های ویژه',
        dishes: [
          { dishId: 'm1', quantity: 1 },
          { dishId: 'm4', quantity: 1 },
          { dishId: 'm6', quantity: 1 },
          { dishId: 'm7', quantity: 1 },
        ],
        addons: [
          { id: 'a4', name: 'شمع و دکوراسیون میز', price: 5.0, stockId: undefined },
        ],
        price: 59.0,
        available: true,
        visible: 'inactive',
        branches: ['مرکزی', 'شمال'],
        maxQuantity: 8,
        maxQuantityPerPerson: 1,
        alwaysAvailable: true,
        dateFrom: '',
        dateTo: '',
        discountPercent: 5,
        categoryLabels: {},
      },
    ];
    return { categories, packages };
  });

  const [editingPackage, setEditingPackage] = useState<MenuPackage | null>(null);

  function savePackage(draft: MenuPackageForm): { ok: boolean; error: string | null } {
    if (!draft.name.trim()) return { ok: false, error: `${t.fields.name} is required` };
    const isDuplicate = data.packages.some(
      (p) => p.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && p.id !== editingPackage?.id,
    );
    if (isDuplicate) return { ok: false, error: t.labels.duplicateName };

    const saved: MenuPackage = editingPackage
      ? { ...draft, id: editingPackage.id }
      : { ...draft, id: Date.now().toString() };

    if (editingPackage) {
      setData((prev) => ({ ...prev, packages: prev.packages.map((p) => (p.id === editingPackage.id ? saved : p)) }));
    } else {
      setData((prev) => ({ ...prev, packages: [...prev.packages, saved] }));
    }
    setEditingPackage(null);
    return { ok: true, error: null };
  }

  function startEdit(id: string) {
    const pkg = data.packages.find((p) => p.id === id);
    if (!pkg) return;
    setEditingPackage(pkg);
    router.push('/packages');
  }

  function cancelEdit() {
    setEditingPackage(null);
  }

  function addCategory(name: string) {
    if (data.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: `pkg-cat-${Date.now()}`, name, subs: [] }],
    }));
  }

  function addSub(categoryId: string, sub: string) {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId && !c.subs.includes(sub) ? { ...c, subs: [...c.subs, sub] } : c,
      ),
    }));
  }

  return (
    <PackagesContext.Provider
      value={{
        data, menuCategories, menuItems: MENU_ITEMS, stockItems: STOCK_REFS, branches: BRANCHES,
        editingPackage, savePackage, startEdit, cancelEdit,
        addCategory, addSub, addMenuCategory, addMenuSub,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const ctx = useContext(PackagesContext);
  if (!ctx) throw new Error('usePackages must be used within PackagesProvider');
  return ctx;
}
