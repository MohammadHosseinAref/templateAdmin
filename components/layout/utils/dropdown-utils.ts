import type React from 'react';

export function getDropdownStyle(
  btn: HTMLButtonElement,
  direction: 'rtl' | 'ltr',
  offset = 8,
): React.CSSProperties {
  const rect = btn.getBoundingClientRect();
  const vw = window.innerWidth;
  const dropW = 320; // matches w-80

  if (direction === 'rtl') {
    // In RTL the action buttons sit on the LEFT side of the screen.
    // Anchor the dropdown's left edge to the button's left edge, clamped to viewport.
    const left = Math.max(4, Math.min(rect.left, vw - dropW - 4));
    return { position: 'fixed', top: rect.bottom + offset, left };
  }
  // In LTR the action buttons sit on the RIGHT side.
  const right = Math.max(4, Math.min(vw - rect.right, vw - dropW - 4));
  return { position: 'fixed', top: rect.bottom + offset, right };
}
