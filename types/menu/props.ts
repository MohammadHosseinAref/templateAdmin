import type { MenuCategory, MenuItem, MenuItemForm, StockRef } from './data';

export interface MenuFormProps {
  draft: MenuItemForm;
  editId: string | null;
  items: MenuItem[];
  categories: MenuCategory[];
  allTags: string[];
  stockItems: StockRef[];
  branches: string[];
  onDraftChange: (draft: MenuItemForm) => void;
  onAddCategory: (name: string) => void;
  onAddSub: (categoryId: string, sub: string) => void;
  onAddSubSub: (categoryId: string, subName: string, subSub: string) => void;
  onAddTag: (tag: string) => void;
  fieldErrors: Record<string, string>;
}

export interface MenuPreviewProps {
  draft: MenuItemForm;
  categories: MenuCategory[];
  stockItems: StockRef[];
}
