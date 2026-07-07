import type { DeliveryPerson } from '@/types/delivery';

export const SAMPLE_COURIERS: DeliveryPerson[] = [
  {
    id: '1', photo: '', firstName: 'Lucas', lastName: 'Dubois', phone: '06 12 34 56 78', email: 'lucas.dubois@smartdine.fr', nationalId: '',
    vehicleType: 'scooter', licensePlate: 'AB-123-CD', zones: ['Strasbourg', 'Lyon'], active: true, notes: '',
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
      { id: 'h1', date: '2026-06-28 19:45', customerName: 'Marie Lefebvre',   address: '12 Rue de la Paix, Strasbourg',     amount: 24.50, durationMinutes: 28, status: 'delivered' },
      { id: 'h2', date: '2026-06-27 13:10', customerName: 'Sophie Bernard',   address: '5 Avenue Foch, Strasbourg',          amount: 18.00, durationMinutes: 19, status: 'delivered' },
      { id: 'h3', date: '2026-06-26 20:30', customerName: 'Camille Petit',    address: '8 Rue du Vieux Marché, Lyon',        amount: 32.90, durationMinutes: 41, status: 'cancelled' },
      { id: 'h4', date: '2026-06-25 12:05', customerName: 'Antoine Moreau',   address: '21 Quai des Bateliers, Strasbourg',  amount: 15.75, durationMinutes: 22, status: 'failed'    },
    ],
  },
  {
    id: '2', photo: '', firstName: 'Hugo', lastName: 'Perrin', phone: '07 23 45 67 89', email: 'hugo.perrin@smartdine.fr', nationalId: '',
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
      { id: 'h5', date: '2026-06-24 14:20', customerName: 'Julie Lambert',    address: '3 Rue de Rivoli, Paris',             amount: 21.00, durationMinutes: 25, status: 'delivered' },
      { id: 'h6', date: '2026-06-23 18:50', customerName: 'Aurélie Mercier',  address: '22 Blvd Haussmann, Paris',           amount: 29.50, durationMinutes: 33, status: 'delivered' },
    ],
  },
];
