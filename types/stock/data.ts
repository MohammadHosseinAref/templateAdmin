export interface StockItemForm {
  name: string;
  unit: string;
  inventory: number;
  minInventory: number;
  pricePerUnit: number;
  dateAdded: string;   // YYYY-MM-DD
  expiryDate: string;  // YYYY-MM-DD, empty = no expiry
}

export interface StockItem extends StockItemForm {
  id: string;
}

export interface StockData {
  items: StockItem[];
}
