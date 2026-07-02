import type { DeliveryData, DeliveryPersonForm, AvailabilityHours, DayOfWeek } from './data';
import { DAY_KEYS } from './data';

function defaultAvailability(): Record<DayOfWeek, AvailabilityHours> {
  return DAY_KEYS.reduce((acc, day) => {
    acc[day] = { active: day !== 'fri', from: '09:00', to: '21:00' };
    return acc;
  }, {} as Record<DayOfWeek, AvailabilityHours>);
}

export function freshDeliveryDraft(): DeliveryPersonForm {
  return {
    photo: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nationalId: '',
    vehicleType: 'bike',
    licensePlate: '',
    zones: [],
    availability: defaultAvailability(),
    active: true,
    notes: '',
  };
}

export const DELIVERY_FORM_DEFAULTS: DeliveryPersonForm = freshDeliveryDraft();

export const DELIVERY_DEFAULTS: DeliveryData = {
  items: [],
};
