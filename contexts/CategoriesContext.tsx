'use client';

import { createContext, useContext, useState } from 'react';
import type { MenuCategory } from '@/types/menu';

// ── Initial seed data ──────────────────────────────────────────────────────

const INIT_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-0',
    name: 'Entrée',
    subs: [
      { name: 'Salade',  subs: ['Salade César', 'Salade Niçoise'] },
      { name: 'Soupe',   subs: [] },
    ],
  },
  {
    id: 'cat-1',
    name: 'Plat principal',
    subs: [
      { name: 'Viandes',         subs: ['Bœuf', 'Poulet', 'Agneau'] },
      { name: 'Pâtes & Risotto', subs: ['Pâtes fraîches', 'Risotto'] },
    ],
  },
  {
    id: 'cat-2',
    name: 'Dessert',
    subs: [
      { name: 'Classique', subs: [] },
      { name: 'Chocolat',  subs: [] },
    ],
  },
  {
    id: 'cat-3',
    name: 'Boisson',
    subs: [
      { name: 'Chaude',   subs: [] },
      { name: 'Froide',   subs: [] },
    ],
  },
];

// ── Context interface ──────────────────────────────────────────────────────

interface CategoriesContextValue {
  categories: MenuCategory[];

  // Level 1
  addCategory:    (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  // Level 2
  addSub:    (categoryId: string, subName: string) => void;
  updateSub: (categoryId: string, oldName: string, newName: string) => void;
  deleteSub: (categoryId: string, subName: string) => void;

  // Level 3
  addSubSub:    (categoryId: string, subName: string, value: string) => void;
  updateSubSub: (categoryId: string, subName: string, oldValue: string, newValue: string) => void;
  deleteSubSub: (categoryId: string, subName: string, value: string) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<MenuCategory[]>(INIT_CATEGORIES);

  // ── Level 1 ──

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed || categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return;
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name: trimmed, subs: [] },
    ]);
  }

  function updateCategory(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
    );
  }

  function deleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  // ── Level 2 ──

  function addSub(categoryId: string, subName: string) {
    const trimmed = subName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId && !c.subs.some((s) => s.name === trimmed)
          ? { ...c, subs: [...c.subs, { name: trimmed, subs: [] }] }
          : c,
      ),
    );
  }

  function updateSub(categoryId: string, oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subs: c.subs.map((s) => (s.name === oldName ? { ...s, name: trimmed } : s)) }
          : c,
      ),
    );
  }

  function deleteSub(categoryId: string, subName: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subs: c.subs.filter((s) => s.name !== subName) }
          : c,
      ),
    );
  }

  // ── Level 3 ──

  function addSubSub(categoryId: string, subName: string, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.name === subName && !s.subs.includes(trimmed)
                  ? { ...s, subs: [...s.subs, trimmed] }
                  : s,
              ),
            }
          : c,
      ),
    );
  }

  function updateSubSub(categoryId: string, subName: string, oldValue: string, newValue: string) {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.name === subName
                  ? { ...s, subs: s.subs.map((ss) => (ss === oldValue ? trimmed : ss)) }
                  : s,
              ),
            }
          : c,
      ),
    );
  }

  function deleteSubSub(categoryId: string, subName: string, value: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.name === subName
                  ? { ...s, subs: s.subs.filter((ss) => ss !== value) }
                  : s,
              ),
            }
          : c,
      ),
    );
  }

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory, updateCategory, deleteCategory,
        addSub, updateSub, deleteSub,
        addSubSub, updateSubSub, deleteSubSub,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}
