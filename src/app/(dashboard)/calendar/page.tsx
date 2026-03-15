import { db } from "@/lib/db";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) - 1 : now.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const leads = await db.lead.findMany({
    where: {
      eventDate: { gte: startOfMonth, lte: endOfMonth },
      status: { notIn: ["LOST", "CANCELLED"] },
    },
    include: {
      contact: true,
      space: true,
    },
    orderBy: { eventDate: "asc" },
  });

  const events = leads.map((l) => ({
    id: l.id,
    title: l.eventName || l.eventType,
    contactName: `${l.contact.firstName} ${l.contact.lastName}`,
    spaceName: l.space?.name ?? null,
    spaceColor: l.space?.color ?? "#3B82F6",
    date: l.eventDate!.toISOString(),
    status: l.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-muted-foreground">
          View events across all your spaces.
        </p>
      </div>
      <CalendarView events={events} year={year} month={month} />
    </div>
  );
}
