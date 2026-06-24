import type { MenuCategory, MenuItem, MenuItemForm, StockRef } from './data';

export interface MenuFormProps {
  draft: MenuItemForm;
  editId: string | null;
  items: MenuItem[];
  categories: MenuCategory[];
  allTags: string[];
  stockItems: StockRef[];
  onDraftChange: (draft: MenuItemForm) => void;
  onAddCategory: (name: string) => void;
  onAddSub: (categoryId: string, sub: string) => void;
  onAddSubSub: (categoryId: string, subName: string, subSub: string) => void;
  onAddTag: (tag: string) => void;
  error: string | null;
}

export interface MenuPreviewProps {
  draft: MenuItemForm;
  categories: MenuCategory[];
  stockItems: StockRef[];
}
