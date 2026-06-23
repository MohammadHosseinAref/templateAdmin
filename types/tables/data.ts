export interface TableItem {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  x: number;
  y: number;
  status: 'free' | 'busy';
  linkedSceneId?: string;
}

export interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  tables: TableItem[];
  order: number;
}

export interface TablesData {
  panoramaEnabled: boolean;
  scenes: Scene[];
}
