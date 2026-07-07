export type FilterType = 'all' | 'food' | 'reservation';

export interface CustomersFilterProps {
  filterType:     FilterType;
  search:         string;
  filteredCount:  number;
  totalCount:     number;
  onFilterChange: (type: FilterType) => void;
  onSearchChange: (value: string) => void;
}

export interface CustomerRow {
  phone:  string;
  name:   string;
  types:  string[];
  count:  number;
  spend:  number;
  lastAt: string;
}

export interface CustomersPaginationProps {
  page:       number;
  totalPages: number;
  label:      string;
  count:      number;
  onPrev:     () => void;
  onNext:     () => void;
}

export interface CustomersTableProps {
  paged:      CustomerRow[];
  filtered:   CustomerRow[];
  page:       number;
  pageSize:   number;
  totalPages: number;
  onMessage:  (name: string, phone: string) => void;
  onPrev:     () => void;
  onNext:     () => void;
}
