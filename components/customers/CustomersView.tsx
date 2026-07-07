'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useRequests } from '@/contexts/RequestsContext';
import { useConversations } from '@/contexts/ConversationsContext';
import CustomersFilter from './CustomersFilter';
import CustomersTable from './CustomersTable';
import type { FilterType } from '@/types/customers';
import { buildCustomers } from './helpers';

const PAGE_SIZE = 10;

export default function CustomersView() {
  const t  = useLocale();
  const tr = t.customers;
  const { items }        = useRequests();
  const { findOrCreate } = useConversations();
  const router           = useRouter();

  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [page,       setPage]       = useState(1);

  const customers = useMemo(() => buildCustomers(items), [items]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.phone.includes(q);
    const matchType   = filterType === 'all' || c.types.includes(filterType);
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleMessage = (name: string, phone: string) => {
    const id = findOrCreate(name, phone);
    router.push(`/messages?id=${id}`);
  };

  return (
    <div className="space-y-4">

      <h1 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
        {tr.title}
      </h1>

      <CustomersFilter
        filterType={filterType}
        search={search}
        filteredCount={filtered.length}
        totalCount={customers.length}
        onFilterChange={(type) => { setFilterType(type); setPage(1); }}
        onSearchChange={(val)  => { setSearch(val);      setPage(1); }}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-16">
          {search ? tr.noResults : tr.noCustomers}
        </p>
      ) : (
        <CustomersTable
          paged={paged}
          filtered={filtered}
          page={page}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          onMessage={handleMessage}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </div>
  );
}
