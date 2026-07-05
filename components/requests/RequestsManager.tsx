'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { useRequests } from '@/contexts/RequestsContext';
import PendingView from './pending/PendingView';
import ListView from './list/ListView';

type RequestsMode = 'pending' | 'list';

interface RequestsManagerProps {
  mode?: RequestsMode;
}

export default function RequestsManager({ mode = 'pending' }: RequestsManagerProps) {
  const t  = useLocale();
  const tr = t.requests;
  const { items, update } = useRequests();

  const pendingCount = items.filter((r) => r.status === 'pending' || r.status === 'approved').length;

  return (
    <div className="px-3 pt-2 pb-8 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
          {mode === 'pending' ? tr.sections.pending : tr.sections.all}
        </h1>
        {mode === 'pending' && pendingCount > 0 && (
          <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-bold leading-none">
            {pendingCount}
          </span>
        )}
      </div>

      {mode === 'pending' ? (
        <PendingView
          items={items}
          onApprove={(id) => update(id, 'approved')}
          onReject={(id)  => update(id, 'rejected')}
          onUndo={(id)    => update(id, 'pending')}
          onDone={(id)    => update(id, 'completed')}
        />
      ) : (
        <ListView items={[...items].reverse()} />
      )}
    </div>
  );
}
