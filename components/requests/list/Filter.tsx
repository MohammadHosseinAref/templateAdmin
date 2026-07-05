'use client';

import { useLocale } from '@/contexts/LocaleContext';
import type { FilterStatus, ListFilterProps } from '@/types/requests';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import DatePicker from '@/components/ui/DatePicker';

export default function ListFilter({
  filterType, filterStatus, dateFrom, dateTo,
  filteredCount, totalCount,
  onTypeChange, onStatusChange, onDateFromChange, onDateToChange, onReset,
}: ListFilterProps) {
  const tr = useLocale().requests;
  const { TYPES, STATUSES } = useFilterOptions();

  const hasActiveFilter =
    filterType !== 'all' || filterStatus !== 'all' || dateFrom !== '' || dateTo !== '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 flex flex-wrap gap-4 items-end">

      {/* type */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {tr.labels.type}
        </span>
        <div className="flex gap-1">
          {TYPES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onTypeChange(key)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filterType === key
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px self-stretch bg-slate-100 dark:bg-slate-700 hidden sm:block" />

      {/* date range */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {tr.labels.date}
        </span>
        <div className="flex items-center gap-2">
          <DatePicker value={dateFrom} onChange={onDateFromChange} placeholder="From" />
          <span className="text-slate-300 dark:text-slate-600">—</span>
          <DatePicker value={dateTo}   onChange={onDateToChange}   placeholder="To" />
        </div>
      </div>

      <div className="w-px self-stretch bg-slate-100 dark:bg-slate-700 hidden sm:block" />

      {/* status */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {tr.labels.status}
        </span>
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
          className="text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        >
          {STATUSES.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* count + reset */}
      <div className="ms-auto flex items-end gap-3 self-end pb-0.5">
        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
          {filteredCount} {tr.labels.of} {totalCount}
        </span>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {tr.labels.reset}
          </button>
        )}
      </div>
    </div>
  );
}
