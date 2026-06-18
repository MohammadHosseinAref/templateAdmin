export type SidebarIconKey =
  | 'dashboard'
  | 'calendar'
  | 'table'
  | 'fork'
  | 'chart'
  | 'users'
  | 'settings'
  | 'logout'
  | 'chevronDown';

export interface GrandItem {
  href: string;
  label: string;
}

export interface SubItem {
  href: string;
  label: string;
  children?: GrandItem[];
}

export interface NavItemDef {
  href: string;
  label: string;
  key: SidebarIconKey;
  children?: SubItem[];
}
