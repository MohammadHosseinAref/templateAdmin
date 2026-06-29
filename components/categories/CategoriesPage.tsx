'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useCategories } from '@/contexts/CategoriesContext';
import CategoryTab    from './CategoryTab';
import SubCategoryTab from './SubCategoryTab';
import SubSubTab      from './SubSubTab';

type TabId = 'category' | 'sub' | 'subSub';

function TabButton({
  active, label, count, onClick,
}: {
  active: boolean; label: string; count: number; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all"
      style={{
        color:        active ? '#0d9488' : '#94a3b8',
        borderBottom: active ? '2px solid #0d9488' : '2px solid transparent',
      }}
    >
      {label}
      <span
        className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold"
        style={{
          backgroundColor: active ? '#f0fdfa' : '#f1f5f9',
          color:           active ? '#0d9488' : '#94a3b8',
        }}
      >
        {count}
      </span>
    </button>
  );
}

export default function CategoriesPage() {
  const c = useLocale().categories;
  const { categories } = useCategories();
  const [activeTab, setActiveTab] = useState<TabId>('category');

  const catCount    = categories.length;
  const subCount    = categories.reduce((s, cat) => s + cat.subs.length, 0);
  const subSubCount = categories.reduce((s, cat) => s + cat.subs.reduce((ss, sub) => ss + sub.subs.length, 0), 0);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'category', label: c.tabs.category, count: catCount },
    { id: 'sub',      label: c.tabs.sub,      count: subCount },
    { id: 'subSub',   label: c.tabs.subSub,   count: subSubCount },
  ];

  return (
    <div className="px-4 pt-0 pb-8">

      {/* ── Tab bar ── */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex gap-1 mb-6">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            label={tab.label}
            count={tab.count}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* ── Content ── */}
      {activeTab === 'category' && <CategoryTab />}
      {activeTab === 'sub'      && <SubCategoryTab />}
      {activeTab === 'subSub'   && <SubSubTab />}

    </div>
  );
}
