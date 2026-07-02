import type { AvailabilityHours, DayOfWeek, DeliveryHistoryEntry, DeliveryPerson, DeliveryPersonForm } from './data';

export interface DeliveryFormProps {
  items: DeliveryPerson[];
  editId: string | null;
  draft: DeliveryPersonForm;
  zones: string[];
  onCancelEdit: () => void;
  onDraftChange: (draft: DeliveryPersonForm) => void;
  onSave: () => void;
  saved: boolean;
  fieldErrors: Record<string, string>;
}

export interface DeliveryListProps {
  items: DeliveryPerson[];
  editId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export interface DeliveryAvailabilityProps {
  value: Record<DayOfWeek, AvailabilityHours>;
  onChange: (value: Record<DayOfWeek, AvailabilityHours>) => void;
}

export interface DeliveryHistoryModalProps {
  courierName: string;
  history: DeliveryHistoryEntry[];
  onClose: () => void;
}
