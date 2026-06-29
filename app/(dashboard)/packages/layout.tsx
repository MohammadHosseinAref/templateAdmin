import { PackagesProvider } from '@/contexts/PackagesContext';

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <PackagesProvider>{children}</PackagesProvider>;
}
