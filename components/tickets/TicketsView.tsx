'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import NewTicketForm from './NewTicketForm';

export default function TicketsView() {
  const t      = useLocale();
  const tr     = t.tickets;
  const router = useRouter();
  const params = useSearchParams();

  const selectedId = params.get('id');
  const isNew      = params.get('new') === '1';

  const hasRight = !!selectedId || isNew;

  function goTo(id: string) {
    router.push(`/tickets?id=${id}`);
  }

  function goNew() {
    router.push('/tickets?new=1');
  }

  function goBack() {
    router.push('/tickets');
  }

  function handleCreated(id: string) {
    router.push(`/tickets?id=${id}`);
  }

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">

      {/* left: ticket list */}
      <div className={`${hasRight ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-e border-slate-100 dark:border-slate-700 flex-shrink-0`}>
        <TicketList selectedId={selectedId} onSelect={goTo} onNew={goNew} />
      </div>

      {/* right: detail or form */}
      <div className={`${hasRight ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0`}>
        {isNew ? (
          <NewTicketForm onCreated={handleCreated} onCancel={goBack} />
        ) : selectedId ? (
          <TicketDetail ticketId={selectedId} onBack={goBack} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm">{tr.selectTicket}</p>
            <button
              type="button"
              onClick={goNew}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {tr.newTicket}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
