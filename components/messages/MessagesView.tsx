'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useConversations } from '@/contexts/ConversationsContext';
import { useMessages } from '@/contexts/MessagesContext';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

export default function MessagesView() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const { conversations, markRead } = useConversations();
  const { messages, sendMessage }   = useMessages();

  const selectedId   = searchParams.get('id');
  const conversation = conversations.find((c) => c.id === selectedId) ?? null;
  const chatMessages = messages.filter((m) => m.conversationId === selectedId);

  const handleSelect = (id: string) => {
    markRead(id);
    router.push(`/messages?id=${id}`);
  };

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">

      {/* conversation list */}
      <div className={`w-full md:w-72 lg:w-80 flex-shrink-0 border-e border-slate-100 dark:border-slate-700 ${selectedId ? 'hidden md:flex' : 'flex'} flex-col`}>
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">پیام‌ها</h2>
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {/* chat window */}
      <div className={`flex-1 flex-col min-w-0 ${selectedId ? 'flex' : 'hidden md:flex'}`}>
        <ChatWindow
          conversation={conversation}
          messages={chatMessages}
          onSend={(text) => selectedId && sendMessage(selectedId, text)}
          onBack={() => router.push('/messages')}
        />
      </div>
    </div>
  );
}
