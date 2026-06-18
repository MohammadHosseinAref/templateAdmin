export const UPLOADED_FONT_KEY = 'smartdine-font-data';
export const MAX_FONT_BYTES = 3 * 1024 * 1024;

export function loadGoogleFont(family: string): void {
  if (!family) return;
  const id = `gfont-${family.replace(/\s/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;700&display=swap`;
  document.head.appendChild(link);
}

export async function injectUploadedFont(name: string, base64: string): Promise<boolean> {
  try {
    const raw = atob(base64.split(',')[1]);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const ff = new FontFace(name, bytes.buffer);
    await ff.load();
    document.fonts.add(ff);
    return true;
  } catch {
    return false;
  }
}
