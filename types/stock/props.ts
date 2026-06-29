import type { StockItem, StockItemForm } from './data';

export interface StockFormProps {
  items: StockItem[];
  selectedId: string | null;
  editId: string | null;
  draft: StockItemForm;
  onSelectId: (id: string | null) => void;
  onCancelEdit: () => void;
  onDraftChange: (draft: StockItemForm) => void;
  onSave: () => void;
  saved: boolean;
  fieldErrors: Record<string, string>;
}

export interface StockListProps {
  items: StockItem[];
  selectedId: string | null;
  editId: string | null;
  onSelectId: (id: string | null) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
