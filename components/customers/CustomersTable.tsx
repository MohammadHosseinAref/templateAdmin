'use client';

import { useLocale } from '@/contexts/LocaleContext';
import dayjs from '@/lib/dayjs';
import CustomersPagination from './CustomersPagination';
import type { CustomersTableProps } from '@/types/customers';
import { initials, avatarColor } from './helpers';

export default function CustomersTable({
  paged,
  filtered,
  page,
  pageSize,
  totalPages,
  onMessage,
  onPrev,
  onNext,
}: CustomersTableProps) {
  const t  = useLocale();
  const tr = t.customers;

  const totalCount  = filtered.reduce((s, c) => s + c.count, 0);
  const totalSpend  = filtered.reduce((s, c) => s + c.spend, 0);

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="px-3 py-3 text-center w-10">#</th>
              <th className="px-4 py-3 text-start">{tr.labels.name}</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">{tr.labels.requests}</th>
              <th className="px-4 py-3 text-end hidden lg:table-cell">{tr.labels.totalSpend}</th>
              <th className="px-4 py-3 text-start hidden md:table-cell">{tr.labels.lastActivity}</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
            {paged.map((customer, idx) => {
              const rowNum = (page - 1) * pageSize + idx + 1;
              const color  = avatarColor(customer.phone);

              return (
                <tr key={customer.phone} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">

                  <td className="px-3 py-3 text-center">
                    <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500 font-medium">{rowNum}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
                        {initials(customer.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{customer.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">{customer.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums">{customer.count}</span>
                  </td>

                  <td className="px-4 py-3 text-end hidden lg:table-cell">
                    {customer.spend > 0 ? (
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                        {customer.spend.toFixed(2)} {tr.labels.currency}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{dayjs(customer.lastAt).fromNow()}</span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      title={tr.labels.message}
                      onClick={() => onMessage(customer.name, customer.phone)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ms-auto"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-500 dark:text-slate-400">
              <td className="px-3 py-3" />
              <td className="px-4 py-3 text-start">
                <span className="tabular-nums">{filtered.length} {tr.title.toLowerCase()}</span>
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell tabular-nums">{totalCount}</td>
              <td className="px-4 py-3 text-end hidden lg:table-cell tabular-nums">
                {totalSpend.toFixed(2)} {tr.labels.currency}
              </td>
              <td className="px-4 py-3 hidden md:table-cell" />
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>

      <CustomersPagination
        page={page}
        totalPages={totalPages}
        label={tr.title.toLowerCase()}
        count={filtered.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
