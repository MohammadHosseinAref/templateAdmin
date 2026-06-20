import type React from 'react';

export function getDropdownStyle(
  btn: HTMLButtonElement,
  direction: 'rtl' | 'ltr',
  offset = 8,
): React.CSSProperties {
  const rect = btn.getBoundingClientRect();
  const vw = window.innerWidth;
  const dropW = 320; // matches w-80

  // On mobile, span full width — width overrides w-80 class
  if (vw < 640) {
    const top = rect.bottom + offset;
    return {
      position: 'fixed',
      top,
      left: 8,
      width: vw - 16,
      maxHeight: window.innerHeight - top - 8,
    };
  }

  if (direction === 'rtl') {
    const left = Math.max(4, Math.min(rect.left, vw - dropW - 4));
    return { position: 'fixed', top: rect.bottom + offset, left };
  }
  const right = Math.max(4, Math.min(vw - rect.right, vw - dropW - 4));
  return { position: 'fixed', top: rect.bottom + offset, right };
}
