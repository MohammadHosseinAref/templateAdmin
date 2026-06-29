import { MenuProvider } from '@/contexts/MenuContext';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <MenuProvider>{children}</MenuProvider>;
}
