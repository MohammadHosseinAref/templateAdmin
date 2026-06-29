'use client';

import { useState } from 'react';
import type { PackageFormProps } from '@/types/packages';
import { useLocale } from '@/contexts/LocaleContext';
import PackageDishesTab   from './PackageDishesTab';
import PackageAddonsTab   from './PackageAddonsTab';
import PackageSettingsTab from './PackageSettingsTab';
import { DishesIcon, AddonsIcon, SettingsIcon } from '@/components/ui/icons';

export default function PackageForm({
  draft, editId, menuCategories, menuItems, stockItems, branches,
  onDraftChange, onAddMenuCategory, onAddMenuSub, fieldErrors,
}: PackageFormProps) {
  const t = useLocale().packages;
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  const tabs = [
    { label: t.sections.dishes,   icon: <DishesIcon /> },
    { label: t.sections.addons,   icon: <AddonsIcon /> },
    { label: t.sections.settings, icon: <SettingsIcon /> },
  ];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {tabs.map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i as 0 | 1 | 2)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ backgroundColor: isActive ? '#14b8a6' : 'transparent', color: isActive ? '#fff' : '#94a3b8' }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 0 && (
        <PackageDishesTab
          draft={draft} editId={editId}
          menuCategories={menuCategories} menuItems={menuItems}
          onDraftChange={onDraftChange}
          onAddMenuCategory={onAddMenuCategory} onAddMenuSub={onAddMenuSub}
          fieldErrors={fieldErrors}
        />
      )}
      {activeTab === 1 && (
        <PackageAddonsTab draft={draft} stockItems={stockItems} onDraftChange={onDraftChange} />
      )}
      {activeTab === 2 && (
        <PackageSettingsTab draft={draft} branches={branches} onDraftChange={onDraftChange} />
      )}
    </div>
  );
}
