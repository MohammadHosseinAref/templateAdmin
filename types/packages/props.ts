import type { MenuItem, StockRef, MenuCategory } from '@/types/menu';
import type { MenuPackageForm, PackageCategory } from './data';

export interface PackageFormProps {
  draft: MenuPackageForm;
  editId: string | null;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  stockItems: StockRef[];
  branches: string[];
  onDraftChange: (next: MenuPackageForm) => void;
  onAddMenuCategory: (name: string) => void;
  onAddMenuSub: (categoryId: string, subName: string) => void;
  fieldErrors: Record<string, string>;
}

export interface PackageDishesTabProps {
  draft: MenuPackageForm;
  editId: string | null;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  onDraftChange: (next: MenuPackageForm) => void;
  onAddMenuCategory: (name: string) => void;
  onAddMenuSub: (categoryId: string, subName: string) => void;
  fieldErrors: Record<string, string>;
}

export interface PackageAddonsTabProps {
  draft: MenuPackageForm;
  stockItems: StockRef[];
  onDraftChange: (next: MenuPackageForm) => void;
}

export interface PackageSettingsTabProps {
  draft: MenuPackageForm;
  branches: string[];
  onDraftChange: (next: MenuPackageForm) => void;
}

export interface PackageDishPickerProps {
  dishes: import('./data').PackageDish[];
  menuCategories: import('@/types/menu').MenuCategory[];
  menuItems: import('@/types/menu').MenuItem[];
  onDishesChange: (dishes: import('./data').PackageDish[]) => void;
  onAddMenuCategory: (name: string) => void;
  onAddMenuSub: (categoryId: string, subName: string) => void;
}

export interface PackagePreviewProps {
  draft: MenuPackageForm;
  menuItems: MenuItem[];
  stockItems: StockRef[];
  categories: PackageCategory[];
  menuCategories: MenuCategory[];
  onNameChange: (name: string) => void;
  onCategoryLabelChange: (catId: string, label: string) => void;
}

export interface PackageDetailPanelProps {
  pkg: import('./data').MenuPackage;
  onEdit: () => void;
  onClose: () => void;
}
