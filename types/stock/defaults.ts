import type { StockData, StockItemForm } from './data';

export const STOCK_FORM_DEFAULTS: StockItemForm = {
  name: '',
  unit: '',
  inventory: 0,
  minInventory: 0,
  pricePerUnit: 0,
  dateAdded: '',
  expiryDate: '',
};

export const STOCK_DEFAULTS: StockData = {
  items: [],
};
