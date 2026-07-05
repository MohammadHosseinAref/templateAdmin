export type RequestType   = 'food' | 'reservation' | 'delivery';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface RequestItem {
  name:  string;
  qty:   number;
  price: number;
}

export interface Request {
  id:           string;
  txId:         string;
  type:         RequestType;
  status:       RequestStatus;
  createdAt:    string;
  customerName: string;
  phone:        string;
  notes?:       string;
  // food + reservation
  tableNumber?: number;
  // food + delivery
  items?:       RequestItem[];
  // reservation
  date?:        string;
  time?:        string;
  guests?:      number;
  // delivery
  address?:     string;
  zone?:        string;
}

export interface RequestsData { items: Request[]; }
