export type DayOfWeek = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export const DAY_KEYS: DayOfWeek[] = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

export type VehicleType = 'bike' | 'scooter' | 'car' | 'foot';

export const VEHICLE_TYPES: VehicleType[] = ['bike', 'scooter', 'car', 'foot'];

export interface AvailabilityHours {
  active: boolean;
  from: string; // HH:mm
  to: string;   // HH:mm
}

export interface DeliveryPersonForm {
  photo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  vehicleType: VehicleType;
  licensePlate: string;
  zones: string[];
  availability: Record<DayOfWeek, AvailabilityHours>;
  active: boolean;
  notes: string;
}

export type DeliveryStatus = 'delivered' | 'cancelled' | 'failed';

export interface DeliveryHistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  customerName: string;
  address: string;
  amount: number;
  durationMinutes: number; // time taken to deliver, in minutes
  status: DeliveryStatus;
}

export interface DeliveryPerson extends DeliveryPersonForm {
  id: string;
  history: DeliveryHistoryEntry[];
}

export interface DeliveryData {
  items: DeliveryPerson[];
}
