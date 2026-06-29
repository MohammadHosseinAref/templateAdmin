import type { MenuPackageForm } from './data';

export const PACKAGE_DEFAULTS: MenuPackageForm = {
  name: '',
  categoryId: '',
  subCategory: '',
  description: '',
  dishes: [],
  addons: [],
  price: 0,
  available: true,
  visible: 'visible',
  branches: [],
  maxQuantity: 0,
  maxQuantityPerPerson: 0,
  alwaysAvailable: true,
  dateFrom: '',
  dateTo: '',
  discountPercent: 0,
  categoryLabels: {},
};
