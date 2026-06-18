export interface PillProps {
  on: boolean;
}

export interface TopbarColorSwatchProps {
  value: string;
  onChange: (v: string) => void;
  title: string;
}

export interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

export interface DropdownPanelProps {
  style: React.CSSProperties;
  children: React.ReactNode;
  onClose: () => void;
}

export interface SidebarColorSwatchProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  textColor: string;
}
