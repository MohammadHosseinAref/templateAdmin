import type { Metadata } from 'next';
import en from '@/locales/en.json';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: en.notFound.metaTitle,
  description: en.notFound.metaDescription,
};

export default function NotFound() {
  return <NotFoundContent />;
}
