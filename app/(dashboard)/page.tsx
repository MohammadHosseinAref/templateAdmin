'use client';

import { useLocale } from '@/contexts/LocaleContext';
import TodayDeliveryWidget from '@/components/dashboard/TodayDeliveryWidget';

export default function DashboardPage() {
  const t = useLocale();
  return (
    <div className="px-3 pt-2 pb-8">
      <div className="max-w-sm">
        <TodayDeliveryWidget />
      </div>
    </div>
  );
}
