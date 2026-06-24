export interface MenuCategorySub {
  name: string;
  subs: string[];           // third level
}

export interface MenuCategory {
  id: string;
  name: string;
  subs: MenuCategorySub[];  // second level
}

export interface RecipeIngredient {
  stockId: string;
  quantity: number;
  price?: number;
}

export interface MenuItemForm {
  name: string;
  categoryId: string;
  subCategory: string;
  subSubCategory: string;   // third level
  price: number;
  description: string;
  photo: string;
  tags: string[];
  recipe: RecipeIngredient[];
  available: boolean;
  prepTime: number;
  visible: boolean;
}

export interface MenuItem extends MenuItemForm {
  id: string;
}

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
  customTags: string[];
}

export interface StockRef {
  id: string;
  name: string;
  unit: string;
  inventory?: number;
  pricePerUnit?: number;
}
