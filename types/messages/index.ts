export interface Conversation {
  id:           string;   // normalized phone (no spaces/dashes)
  customerName: string;
  phone:        string;
  lastMessage:  string;
  lastAt:       string;   // ISO
  unreadCount:  number;
}

export interface Message {
  id:             string;
  conversationId: string;
  sender:         'admin' | 'customer';
  text:           string;
  createdAt:      string; // ISO
}

export interface ConversationsContextValue {
  conversations: Conversation[];
  findOrCreate:  (customerName: string, phone: string) => string;
  markRead:      (id: string) => void;
  updateLast:    (id: string, text: string, at: string) => void;
}

export interface MessagesContextValue {
  messages:    Message[];
  sendMessage: (conversationId: string, text: string) => void;
}

export interface MessageInputProps {
  onSend:       (text: string) => void;
  disabled?:    boolean;
  placeholder?: string;
}

export interface MessageBubbleProps {
  message: Message;
  isAdmin: boolean;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedId:    string | null;
  onSelect:      (id: string) => void;
}

export interface ChatWindowProps {
  conversation: Conversation | null;
  messages:     Message[];
  onSend:       (text: string) => void;
  onBack?:      () => void;
}
