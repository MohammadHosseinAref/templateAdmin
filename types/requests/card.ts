import type { LocaleData } from '@/lib/locale';
import type { Request } from './data';

export interface RequestCardProps {
  request:   Request;
  t:         LocaleData;
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
  onUndo:    (id: string) => void;
  onDone:    (id: string) => void;
}
