'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import type { Request } from '@/types/requests';
import { STATUS_STYLE, TYPE_COLORS } from '../helpers';
import dayjs from '@/lib/dayjs';
import { useConversations } from '@/contexts/ConversationsContext';

import ListFilter from './Filter';
import DetailModal from './DetailModal';
import Pagination from './Pagination';
import type { FilterType, FilterStatus, ListViewProps } from '@/types/requests';

const PAGE_SIZE = 5;


export default function ListView({ items }: ListViewProps) {
  const t  = useLocale();
  const tr = t.requests;
  const router = useRouter();
  const { findOrCreate } = useConversations();

  const handleMessage = (req: Request) => {
    const id = findOrCreate(req.customerName, req.phone);
    router.push(`/messages?id=${id}`);
  };

  const [selected,     setSelected]     = useState<Request | null>(null);
  const [filterType,   setFilterType]   = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [page,         setPage]         = useState(1);

  const filtered = items.filter((r) => {
    if (filterType   !== 'all' && r.type   !== filterType)   return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    const created = dayjs(r.createdAt);
    if (dateFrom && created.isBefore(dayjs(dateFrom)))                      return false;
    if (dateTo   && created.isAfter(dayjs(dateTo).endOf('day')))            return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filterType, filterStatus, dateFrom, dateTo]);

  const hasActiveFilter = filterType !== 'all' || filterStatus !== 'all' || dateFrom !== '' || dateTo !== '';

  const resetFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <>
      <ListFilter
        filterType={filterType}
        filterStatus={filterStatus}
        dateFrom={dateFrom}
        dateTo={dateTo}
        filteredCount={filtered.length}
        totalCount={items.length}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={resetFilters}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-12">
          {hasActiveFilter ? tr.labels.noFilterResults : tr.labels.noRequests}
        </p>
      ) : (
        <div className="rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-3 py-3 text-center w-10">#</th>
                  <th className="px-4 py-3 text-start">{tr.labels.type}</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">{tr.labels.date}</th>
                  <th className="px-4 py-3 text-start">{tr.labels.status}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {paged.map((req, idx) => {
                  const st        = STATUS_STYLE[req.status];
                  const tc        = TYPE_COLORS[req.type].text;
                  const created   = dayjs(req.createdAt);
                  const rowNumber = (page - 1) * PAGE_SIZE + idx + 1;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500 font-medium">
                          {rowNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold uppercase tracking-wide ${tc}`}>
                          {tr.types[req.type]}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                          #{req.txId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 tabular-nums hidden md:table-cell whitespace-nowrap">
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                          {created.fromNow()}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {created.format('DD MMM · HH:mm')}
                        </span>
                        {req.type === 'reservation' && req.date && req.time && (() => {
                          const arrival  = dayjs(`${req.date}T${req.time}`);
                          const isFuture = arrival.isAfter(dayjs());
                          return (
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded-full ${
                              isFuture
                                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                            }`}>
                              <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {arrival.fromNow()}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${st.bg} ${st.text}`}>
                          {tr.status[req.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title={tr.labels.sendMessage}
                            onClick={() => handleMessage(req)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelected(req)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            aria-label="details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>
      )}

      {selected && <DetailModal req={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
