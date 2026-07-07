'use client';

import { useLocale } from '@/contexts/LocaleContext';
import type { CustomersFilterProps } from '@/types/customers';

export default function CustomersFilter({
  filterType,
  search,
  filteredCount,
  totalCount,
  onFilterChange,
  onSearchChange,
}: CustomersFilterProps) {
  const t  = useLocale();
  const tr = t.customers;

  const tabs = [
    { key: 'all'         as const, label: tr.labels.filterAll          },
    { key: 'food'        as const, label: t.requests.types.food        },
    { key: 'reservation' as const, label: t.requests.types.reservation },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="flex border-b border-slate-100 dark:border-slate-700">

        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              filterType === key
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="flex-1 flex items-center justify-end px-3 py-2">
          <div className="relative">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={tr.searchPlaceholder}
              className="ps-8 pe-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent w-52"
            />
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums ms-3 whitespace-nowrap">
            {filteredCount} / {totalCount}
          </span>
        </div>

      </div>
    </div>
  );
}
