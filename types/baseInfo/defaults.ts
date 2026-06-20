import type { BaseInfoData } from './data';

export const BASEiNFO_DEFAULTS: BaseInfoData = {
  name: '',
  logoUrl: '',
  address: {
    country: 'FR',
    region: '',
    city: '',
    streetNumber: '',
    streetName: '',
    additionalInfo: '',
  },
  phone: '',
  workingHours: {
    sat: { open: '09:00', close: '22:00', closed: false },
    sun: { open: '09:00', close: '22:00', closed: false },
    mon: { open: '09:00', close: '22:00', closed: false },
    tue: { open: '09:00', close: '22:00', closed: false },
    wed: { open: '09:00', close: '22:00', closed: false },
    thu: { open: '09:00', close: '23:00', closed: false },
    fri: { open: '12:00', close: '23:00', closed: false },
  },
  amenities: [],
  totalCapacity: 0,
  indoorCapacity: 0,
  outdoorCapacity: 0,
};
