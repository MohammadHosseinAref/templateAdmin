export type TicketType     = 'support' | 'complaint' | 'internal';
export type TicketStatus   = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface TicketReply {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  submittedBy: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
  unreadCount: number;
}

export interface NewTicketData {
  type: TicketType;
  subject: string;
  description: string;
  priority: TicketPriority;
  submittedBy: string;
  phone?: string;
}

export interface TicketDetailPageProps {
  ticketId: string;
}

export interface TicketDetailProps {
  ticketId: string;
  onBack?:  () => void;
}

export interface NewTicketFormProps {
  onCreated: (id: string) => void;
  onCancel:  () => void;
}

export interface TicketsContextValue {
  tickets: Ticket[];
  addTicket: (data: NewTicketData) => string;
  addReply: (ticketId: string, text: string, sender: 'admin' | 'user') => void;
  setStatus: (ticketId: string, status: TicketStatus) => void;
  markRead: (ticketId: string) => void;
}
