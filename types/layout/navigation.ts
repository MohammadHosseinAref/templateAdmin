export type SidebarIconKey =
  | 'dashboard'
  | 'calendar'
  | 'table'
  | 'fork'
  | 'package'
  | 'chart'
  | 'users'
  | 'settings'
  | 'logout'
  | 'chevronDown'
  | 'stock'
  | 'categories'
  | 'delivery'
  | 'requests';

export interface GrandItem {
  href: string;
  label: string;
}

export interface SubItem {
  href?: string;
  label: string;
  children?: GrandItem[];
}

export interface NavItemDef {
  href?: string;
  label: string;
  key: SidebarIconKey;
  children?: SubItem[];
}
