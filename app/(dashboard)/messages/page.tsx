import { Suspense } from 'react';
import MessagesView from '@/components/messages/MessagesView';

export default function MessagesPage() {
  return (
    <div className="px-3 pt-2 pb-6 h-full flex flex-col">
      <Suspense>
        <MessagesView />
      </Suspense>
    </div>
  );
}
