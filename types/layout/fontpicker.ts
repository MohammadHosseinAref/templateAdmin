export interface UploadedFont {
  name: string;
  base64: string;
}

export interface FontPickerProps {
  currentFont: string;
  onApply: (font: string) => void;
  onClose: () => void;
}
