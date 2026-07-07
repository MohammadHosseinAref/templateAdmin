import type { Request } from '@/types/requests';

export const SAMPLE_REQUESTS: Request[] = [
  // ── pending food orders ────────────────────────────────────────────────
  {
    id: 'req1', txId: '84231', type: 'food', status: 'pending',
    createdAt: '2026-07-02T18:42:00', customerName: 'Pierre Dupont', phone: '06 12 34 56 78',
    tableNumber: 4,
    items: [
      { name: 'Pizza Margherita', qty: 2, price: 14.50 },
      { name: 'Limonade',         qty: 2, price:  3.00 },
    ],
  },
  {
    id: 'req2', txId: '71056', type: 'food', status: 'pending',
    createdAt: '2026-07-02T18:35:00', customerName: 'Marie Lefebvre', phone: '07 23 45 67 89',
    tableNumber: 7,
    items: [
      { name: 'Steak frites',  qty: 1, price: 19.50 },
      { name: 'Salade verte',  qty: 1, price:  5.50 },
    ],
    notes: 'Steak saignant, sans poivre s\'il vous plaît',
  },
  // ── pending reservations ───────────────────────────────────────────────
  {
    id: 'req3', txId: '39874', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T18:20:00', customerName: 'Thomas Martin', phone: '06 34 56 78 90',
    tableNumber: 2, date: '2026-07-05', time: '20:00', guests: 4,
  },
  {
    id: 'req4', txId: '62509', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T17:55:00', customerName: 'Sophie Bernard', phone: '07 45 67 89 01',
    tableNumber: 6, date: '2026-07-04', time: '13:30', guests: 2,
    notes: 'Anniversaire de mon mari',
  },
  // ── pending delivery ───────────────────────────────────────────────────
  {
    id: 'req5', txId: '15783', type: 'delivery', status: 'pending',
    createdAt: '2026-07-02T18:48:00', customerName: 'Camille Petit', phone: '06 56 78 90 12',
    address: '12 Rue de la Paix, Strasbourg', zone: 'Strasbourg',
    items: [
      { name: 'Pasta Carbonara', qty: 1, price: 14.00 },
      { name: 'Salade César',    qty: 1, price:  9.50 },
    ],
  },
  // ── approved ──────────────────────────────────────────────────────────
  {
    id: 'req6', txId: '90412', type: 'food', status: 'approved',
    createdAt: '2026-07-02T17:10:00', customerName: 'Antoine Moreau', phone: '07 67 89 01 23',
    tableNumber: 3,
    items: [{ name: 'Entrecôte grillée', qty: 2, price: 28.00 }],
  },
  {
    id: 'req7', txId: '48367', type: 'reservation', status: 'rejected',
    createdAt: '2026-07-02T16:45:00', customerName: 'Julie Lambert', phone: '06 78 90 12 34',
    tableNumber: 1, date: '2026-07-03', time: '19:30', guests: 3,
  },
  {
    id: 'req8', txId: '23195', type: 'delivery', status: 'approved',
    createdAt: '2026-07-02T16:00:00', customerName: 'Nicolas Rousseau', phone: '07 89 01 23 45',
    address: '5 Avenue Foch, Lyon', zone: 'Lyon',
    items: [{ name: 'Pizza aux 4 fromages', qty: 1, price: 16.00 }],
  },
  {
    id: 'req9', txId: '57640', type: 'food', status: 'completed',
    createdAt: '2026-07-02T15:30:00', customerName: 'Isabelle Girard', phone: '06 90 12 34 56',
    tableNumber: 9,
    items: [
      { name: "Soupe à l'oignon", qty: 2, price:  7.50 },
      { name: 'Pain de campagne', qty: 2, price:  2.00 },
      { name: 'Café allongé',     qty: 2, price:  3.50 },
    ],
  },
  {
    id: 'req10', txId: '82034', type: 'delivery', status: 'completed',
    createdAt: '2026-07-02T14:15:00', customerName: 'François Leroy', phone: '07 01 23 45 67',
    address: '8 Rue Victor Hugo, Marseille', zone: 'Marseille',
    items: [
      { name: 'Lasagnes bolognaise', qty: 1, price: 14.00 },
      { name: 'Tiramisu',            qty: 2, price:  6.50 },
    ],
  },
  {
    id: 'req11', txId: '31728', type: 'reservation', status: 'approved',
    createdAt: '2026-07-02T13:00:00', customerName: 'Élodie Blanc', phone: '06 11 22 33 44',
    tableNumber: 5, date: '2026-07-06', time: '21:00', guests: 6,
    notes: 'Table côté fenêtre si possible',
  },
  {
    id: 'req12', txId: '66891', type: 'food', status: 'rejected',
    createdAt: '2026-07-02T12:20:00', customerName: 'Maxime Giraud', phone: '07 22 33 44 55',
    tableNumber: 8,
    items: [{ name: 'Risotto champignons', qty: 3, price: 13.50 }],
    notes: 'Allergie aux produits laitiers',
  },
  {
    id: 'req13', txId: '44520', type: 'delivery', status: 'pending',
    createdAt: '2026-07-02T11:45:00', customerName: 'Aurélie Mercier', phone: '06 33 44 55 66',
    address: '22 Blvd Haussmann, Paris', zone: 'Paris',
    items: [
      { name: 'Poulet rôti',     qty: 2, price: 16.00 },
      { name: 'Gratin dauphinois', qty: 2, price:  5.50 },
    ],
  },
  {
    id: 'req14', txId: '93017', type: 'food', status: 'completed',
    createdAt: '2026-07-02T10:30:00', customerName: 'Sébastien Roux', phone: '07 44 55 66 77',
    tableNumber: 11,
    items: [
      { name: 'Bœuf bourguignon', qty: 2, price: 22.00 },
      { name: 'Fromage affiné',   qty: 1, price:  8.50 },
    ],
  },
  {
    id: 'req15', txId: '78452', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T09:15:00', customerName: 'Nathalie Fontaine', phone: '06 55 66 77 88',
    tableNumber: 3, date: '2026-07-08', time: '19:00', guests: 8,
    notes: 'Anniversaire de l\'entreprise — décoration souhaitée',
  },
];
