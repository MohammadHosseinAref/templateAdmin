import { useLocale } from '@/contexts/LocaleContext';
import type { FilterType, FilterStatus } from '@/types/requests';

export interface FilterOption<T> {
  key:   T;
  label: string;
}

export function useFilterOptions() {
  const tr = useLocale().requests;

  const TYPES: FilterOption<FilterType>[] = [
    { key: 'all',         label: tr.sections.all.split(' ')[0] },
    { key: 'food',        label: tr.types.food        },
    { key: 'reservation', label: tr.types.reservation },
    { key: 'delivery',    label: tr.types.delivery    },
  ];

  const STATUSES: FilterOption<FilterStatus>[] = [
    { key: 'all',       label: tr.labels.status    },
    { key: 'pending',   label: tr.status.pending   },
    { key: 'approved',  label: tr.status.approved  },
    { key: 'rejected',  label: tr.status.rejected  },
    { key: 'completed', label: tr.status.completed },
  ];

  return { TYPES, STATUSES };
}
