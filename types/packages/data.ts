export interface PackageCategory {
  id: string;
  name: string;
  subs: string[];
}

export interface PackageDish {
  dishId: string;
  quantity: number;
}

export interface PackageAddon {
  id: string;
  name: string;
  price: number;
  stockId?: string;
}

export interface MenuPackageForm {
  name: string;
  categoryId: string;
  subCategory: string;
  description: string;
  dishes: PackageDish[];
  addons: PackageAddon[];
  price: number;
  available: boolean;
  visible: 'visible' | 'hidden' | 'inactive';
  branches: string[];
  maxQuantity: number;
  maxQuantityPerPerson: number;
  alwaysAvailable: boolean;
  dateFrom: string;
  dateTo: string;
  discountPercent: number;
  categoryLabels: Record<string, string>;
}

export interface MenuPackage extends MenuPackageForm {
  id: string;
}

export interface PackagesData {
  categories: PackageCategory[];
  packages: MenuPackage[];
}
