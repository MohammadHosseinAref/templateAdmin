export type { CountryCode } from '@/data/geo/countries';

export type DayOfWeek = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export const DAY_KEYS: DayOfWeek[] = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

export interface WorkingHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface RestaurantAddress {
  country: import('@/data/geo/countries').CountryCode;
  region: string;
  city: string;
  streetNumber: string;
  streetName: string;
  additionalInfo: string;
}

export type AmenityKey =
  | 'wifi'
  | 'playstation'
  | 'billiard'
  | 'kidsPlay'
  | 'outdoor'
  | 'wheelchair';

export const AMENITY_KEYS: AmenityKey[] = [
  'wifi', 'playstation', 'billiard', 'kidsPlay', 'outdoor', 'wheelchair',
];

export interface BaseInfoData {
  name: string;
  logoUrl: string;
  address: RestaurantAddress;
  phone: string;
  workingHours: Record<DayOfWeek, WorkingHours>;
  amenities: AmenityKey[];
  totalCapacity: number;
  indoorCapacity: number;
  outdoorCapacity: number;
}
