export interface SidebarProps {
  direction: 'rtl' | 'ltr';
  width: number;
  isCollapsed: boolean;
  bgColor: string;
  textColor: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onWidthChange: (w: number) => void;
  onBgColorChange: (c: string) => void;
  onTextColorChange: (c: string) => void;
}

export interface SidebarBodyProps {
  isCollapsed: boolean;
  direction: 'rtl' | 'ltr';
  bgColor: string;
  textColor: string;
  pathname: string;
  onLinkClick: () => void;
  onBgColorChange: (c: string) => void;
  onTextColorChange: (c: string) => void;
}
