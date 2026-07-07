import type { Conversation, Message } from '@/types/messages';

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '0612345678',
    customerName: 'Pierre Dupont',
    phone: '06 12 34 56 78',
    lastMessage: 'Merci beaucoup, bon appétit ! 🙏',
    lastAt: '2026-07-05T19:05:00',
    unreadCount: 0,
  },
  {
    id: '0634567890',
    customerName: 'Thomas Martin',
    phone: '06 34 56 78 90',
    lastMessage: 'Nous vous réservons la table côté fenêtre.',
    lastAt: '2026-07-05T17:30:00',
    unreadCount: 2,
  },
  {
    id: '0656789012',
    customerName: 'Camille Petit',
    phone: '06 56 78 90 12',
    lastMessage: 'D\'accord, merci !',
    lastAt: '2026-07-05T14:20:00',
    unreadCount: 0,
  },
  {
    id: '0611223344',
    customerName: 'Élodie Blanc',
    phone: '06 11 22 33 44',
    lastMessage: 'Avec plaisir, bien sûr !',
    lastAt: '2026-07-04T11:15:00',
    unreadCount: 1,
  },
];

export const SAMPLE_MESSAGES: Message[] = [
  // ── Pierre Dupont ────────────────────────────────────────────────────
  { id: 'm1', conversationId: '0612345678', sender: 'customer', text: 'Bonjour, quand est-ce que ma pizza sera prête ?',                        createdAt: '2026-07-05T19:00:00' },
  { id: 'm2', conversationId: '0612345678', sender: 'admin',    text: 'Bonjour Pierre ! On est en train de la préparer, encore 15 minutes environ.', createdAt: '2026-07-05T19:02:00' },
  { id: 'm3', conversationId: '0612345678', sender: 'customer', text: 'Parfait, merci ! 😊',                                                    createdAt: '2026-07-05T19:03:00' },
  { id: 'm4', conversationId: '0612345678', sender: 'admin',    text: 'Merci beaucoup, bon appétit ! 🙏',                                       createdAt: '2026-07-05T19:05:00' },

  // ── Thomas Martin ────────────────────────────────────────────────────
  { id: 'm5', conversationId: '0634567890', sender: 'customer', text: 'Bonjour, j\'ai une réservation ce soir à 20h pour 4 personnes.',          createdAt: '2026-07-05T17:10:00' },
  { id: 'm6', conversationId: '0634567890', sender: 'admin',    text: 'Bonjour Thomas ! Votre réservation est bien confirmée. La table 2 vous attend.', createdAt: '2026-07-05T17:15:00' },
  { id: 'm7', conversationId: '0634567890', sender: 'customer', text: 'Super merci ! Est-ce qu\'on peut avoir une table côté fenêtre ?',          createdAt: '2026-07-05T17:25:00' },
  { id: 'm8', conversationId: '0634567890', sender: 'admin',    text: 'Nous vous réservons la table côté fenêtre.',                              createdAt: '2026-07-05T17:30:00' },

  // ── Camille Petit ────────────────────────────────────────────────────
  { id: 'm9',  conversationId: '0656789012', sender: 'customer', text: 'Bonjour, où en est ma livraison ?',                                       createdAt: '2026-07-05T14:10:00' },
  { id: 'm10', conversationId: '0656789012', sender: 'admin',    text: 'Bonjour Camille ! Le livreur est en route, il arrive dans environ 20 minutes.', createdAt: '2026-07-05T14:15:00' },
  { id: 'm11', conversationId: '0656789012', sender: 'customer', text: 'D\'accord, merci !',                                                      createdAt: '2026-07-05T14:20:00' },

  // ── Élodie Blanc ─────────────────────────────────────────────────────
  { id: 'm12', conversationId: '0611223344', sender: 'admin',    text: 'Bonjour Élodie, votre réservation pour 6 personnes (anniversaire d\'entreprise) est confirmée.', createdAt: '2026-07-04T11:00:00' },
  { id: 'm13', conversationId: '0611223344', sender: 'customer', text: 'Parfait, merci beaucoup !',                                               createdAt: '2026-07-04T11:05:00' },
  { id: 'm14', conversationId: '0611223344', sender: 'admin',    text: 'N\'hésitez pas si vous avez des demandes particulières.',                 createdAt: '2026-07-04T11:10:00' },
  { id: 'm15', conversationId: '0611223344', sender: 'customer', text: 'Est-ce que vous pouvez prévoir un gâteau d\'anniversaire ?',              createdAt: '2026-07-04T11:12:00' },
  { id: 'm16', conversationId: '0611223344', sender: 'admin',    text: 'Avec plaisir, bien sûr !',                                               createdAt: '2026-07-04T11:15:00' },
];
