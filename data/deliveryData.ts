import type { DeliveryPerson } from '@/types/delivery';

export const SAMPLE_COURIERS: DeliveryPerson[] = [
  {
    id: '1', photo: '', firstName: 'علی', lastName: 'محمدی', phone: '0912 345 6789', email: '', nationalId: '',
    vehicleType: 'scooter', licensePlate: '12 ایران 345', zones: ['Strasbourg', 'Lyon'], active: true, notes: '',
    availability: {
      sat: { active: true,  from: '09:00', to: '21:00' },
      sun: { active: true,  from: '09:00', to: '21:00' },
      mon: { active: true,  from: '09:00', to: '21:00' },
      tue: { active: true,  from: '09:00', to: '21:00' },
      wed: { active: true,  from: '09:00', to: '21:00' },
      thu: { active: true,  from: '09:00', to: '21:00' },
      fri: { active: false, from: '09:00', to: '21:00' },
    },
    history: [
      { id: 'h1', date: '2026-06-28 19:45', customerName: 'سارا کریمی',    address: '12 Rue de la Paix, Strasbourg',      amount: 24.50, durationMinutes: 28, status: 'delivered' },
      { id: 'h2', date: '2026-06-27 13:10', customerName: 'مهدی نوری',     address: '5 Avenue Foch, Strasbourg',           amount: 18.00, durationMinutes: 19, status: 'delivered' },
      { id: 'h3', date: '2026-06-26 20:30', customerName: 'نیلوفر صادقی', address: '8 Rue du Vieux Marché, Lyon',         amount: 32.90, durationMinutes: 41, status: 'cancelled' },
      { id: 'h4', date: '2026-06-25 12:05', customerName: 'امیر رضایی',    address: '21 Quai des Bateliers, Strasbourg',  amount: 15.75, durationMinutes: 22, status: 'failed'    },
    ],
  },
  {
    id: '2', photo: '', firstName: 'رضا', lastName: 'احمدی', phone: '0935 123 4567', email: '', nationalId: '',
    vehicleType: 'bike', licensePlate: '', zones: ['Paris'], active: false, notes: '',
    availability: {
      sat: { active: false, from: '10:00', to: '18:00' },
      sun: { active: true,  from: '10:00', to: '18:00' },
      mon: { active: true,  from: '10:00', to: '18:00' },
      tue: { active: true,  from: '10:00', to: '18:00' },
      wed: { active: true,  from: '10:00', to: '18:00' },
      thu: { active: false, from: '10:00', to: '18:00' },
      fri: { active: false, from: '10:00', to: '18:00' },
    },
    history: [
      { id: 'h5', date: '2026-06-24 14:20', customerName: 'پریسا احمدی', address: '3 Rue de Rivoli, Paris', amount: 21.00, durationMinutes: 25, status: 'delivered' },
    ],
  },
];
