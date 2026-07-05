import type { Request } from '@/types/requests';

export const SAMPLE_REQUESTS: Request[] = [
  // ── pending food orders ────────────────────────────────────────────────
  {
    id: 'req1', txId: '84231', type: 'food', status: 'pending',
    createdAt: '2026-07-02T18:42:00', customerName: 'علی محمدی', phone: '0912 345 6789',
    tableNumber: 4,
    items: [
      { name: 'پیتزا مارگاریتا', qty: 2, price: 14.50 },
      { name: 'نوشابه',           qty: 2, price:  3.00 },
    ],
  },
  {
    id: 'req2', txId: '71056', type: 'food', status: 'pending',
    createdAt: '2026-07-02T18:35:00', customerName: 'سارا کریمی', phone: '0935 123 4567',
    tableNumber: 7,
    items: [
      { name: 'برگر دبل',   qty: 1, price: 15.00 },
      { name: 'سیب‌زمینی', qty: 1, price:  5.50 },
    ],
    notes: 'بدون فلفل لطفاً',
  },
  // ── pending reservation ────────────────────────────────────────────────
  {
    id: 'req3', txId: '39874', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T18:20:00', customerName: 'رضا احمدی', phone: '0901 234 5678',
    tableNumber: 2, date: '2026-07-05', time: '20:00', guests: 4,
  },
  {
    id: 'req4', txId: '62509', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T17:55:00', customerName: 'مهدی نوری', phone: '0910 987 6543',
    tableNumber: 6, date: '2026-07-04', time: '13:30', guests: 2,
    notes: 'تولد همسرم',
  },
  // ── pending delivery ───────────────────────────────────────────────────
  {
    id: 'req5', txId: '15783', type: 'delivery', status: 'pending',
    createdAt: '2026-07-02T18:48:00', customerName: 'نیلوفر صادقی', phone: '0912 111 2222',
    address: '12 Rue de la Paix, Strasbourg', zone: 'Strasbourg',
    items: [
      { name: 'پاستا کربونارا', qty: 1, price: 13.00 },
      { name: 'سالاد سزار',     qty: 1, price:  9.00 },
    ],
  },
  // ── approved / rejected / completed ───────────────────────────────────
  {
    id: 'req6', txId: '90412', type: 'food', status: 'approved',
    createdAt: '2026-07-02T17:10:00', customerName: 'امیر رضایی', phone: '0935 444 5555',
    tableNumber: 3,
    items: [{ name: 'استیک', qty: 2, price: 28.00 }],
  },
  {
    id: 'req7', txId: '48367', type: 'reservation', status: 'rejected',
    createdAt: '2026-07-02T16:45:00', customerName: 'پریسا احمدی', phone: '0901 777 8888',
    tableNumber: 1, date: '2026-07-03', time: '19:30', guests: 3,
  },
  {
    id: 'req8', txId: '23195', type: 'delivery', status: 'approved',
    createdAt: '2026-07-02T16:00:00', customerName: 'فاطمه موسوی', phone: '0912 333 4444',
    address: '5 Avenue Foch, Lyon', zone: 'Lyon',
    items: [{ name: 'پیتزا مخلوط', qty: 1, price: 16.00 }],
  },
  {
    id: 'req9', txId: '57640', type: 'food', status: 'completed',
    createdAt: '2026-07-02T15:30:00', customerName: 'کامران طاهری', phone: '0911 222 3333',
    tableNumber: 9,
    items: [
      { name: 'سوپ جو',    qty: 2, price:  7.50 },
      { name: 'نان تازه',  qty: 2, price:  2.00 },
      { name: 'چای سبز',   qty: 2, price:  3.50 },
    ],
  },
  {
    id: 'req10', txId: '82034', type: 'delivery', status: 'completed',
    createdAt: '2026-07-02T14:15:00', customerName: 'زهرا حسینی', phone: '0916 888 9999',
    address: '8 Rue Victor Hugo, Marseille', zone: 'Marseille',
    items: [
      { name: 'لازانیا',      qty: 1, price: 14.00 },
      { name: 'دسر تیرامیسو', qty: 2, price:  6.50 },
    ],
  },
  {
    id: 'req11', txId: '31728', type: 'reservation', status: 'approved',
    createdAt: '2026-07-02T13:00:00', customerName: 'بهنام شریفی', phone: '0913 555 6666',
    tableNumber: 5, date: '2026-07-06', time: '21:00', guests: 6,
    notes: 'میز کنار پنجره',
  },
  {
    id: 'req12', txId: '66891', type: 'food', status: 'rejected',
    createdAt: '2026-07-02T12:20:00', customerName: 'ندا قاسمی', phone: '0939 777 1111',
    tableNumber: 8,
    items: [{ name: 'ریزوتو قارچ', qty: 3, price: 18.00 }],
    notes: 'آلرژی به لبنیات',
  },
  {
    id: 'req13', txId: '44520', type: 'delivery', status: 'pending',
    createdAt: '2026-07-02T11:45:00', customerName: 'آرمان رستمی', phone: '0912 000 9090',
    address: '22 Blvd Haussmann, Paris', zone: 'Paris',
    items: [
      { name: 'خوراک مرغ',  qty: 2, price: 12.50 },
      { name: 'برنج زعفران', qty: 2, price:  5.00 },
    ],
  },
  {
    id: 'req14', txId: '93017', type: 'food', status: 'completed',
    createdAt: '2026-07-02T10:30:00', customerName: 'سپیده کمالی', phone: '0917 444 2222',
    tableNumber: 11,
    items: [
      { name: 'کباب کوبیده', qty: 2, price: 22.00 },
      { name: 'ماست موسیر',  qty: 1, price:  4.50 },
    ],
  },
  {
    id: 'req15', txId: '78452', type: 'reservation', status: 'pending',
    createdAt: '2026-07-02T09:15:00', customerName: 'داریوش فرهادی', phone: '0903 111 7777',
    tableNumber: 3, date: '2026-07-08', time: '19:00', guests: 8,
    notes: 'جشن سالگرد شرکت',
  },
];
