import type { MenuItemForm } from './data';

export const MENU_ITEM_DEFAULTS: MenuItemForm = {
  name: '',
  categoryId: '',
  subCategory: '',
  subSubCategory: '',
  price: 0,
  description: '',
  photo: '',
  tags: [],
  recipe: [],
  available: true,
  prepTime: 0,
  visible: true,
  branches: [],
};
