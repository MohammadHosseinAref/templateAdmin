import type { Request, RequestType, RequestStatus } from './data';

export type FilterType   = RequestType   | 'all';
export type FilterStatus = RequestStatus | 'all';

export interface ListViewProps {
  items: Request[];
}

export interface PaginationProps {
  page:       number;
  totalPages: number;
  onPrev:     () => void;
  onNext:     () => void;
}

export interface DetailModalProps {
  req:     Request;
  onClose: () => void;
}

export interface ListFilterProps {
  filterType:      FilterType;
  filterStatus:    FilterStatus;
  dateFrom:        string;
  dateTo:          string;
  filteredCount:   number;
  totalCount:      number;
  onTypeChange:    (v: FilterType)   => void;
  onStatusChange:  (v: FilterStatus) => void;
  onDateFromChange:(v: string)       => void;
  onDateToChange:  (v: string)       => void;
  onReset:         () => void;
}
