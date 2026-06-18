import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import fr from '@/locales/fr.json';

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: fr.app.metaTitle,
  description: fr.app.metaDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
