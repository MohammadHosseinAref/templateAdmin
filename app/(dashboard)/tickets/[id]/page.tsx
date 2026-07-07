import TicketDetailPage from '@/components/tickets/TicketDetailPage';

export default async function TicketDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="px-3 pt-2 pb-3 h-full flex flex-col">
      <TicketDetailPage ticketId={id} />
    </div>
  );
}
