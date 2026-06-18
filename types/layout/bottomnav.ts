import type { ReactNode } from 'react';

export interface BottomNavItem {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
}
