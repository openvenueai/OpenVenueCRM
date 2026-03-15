import { db } from "@/lib/db";
import { PipelineBoard } from "./pipeline-board";

const PIPELINE_STAGES = [
  "INQUIRY",
  "TOUR_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONTRACT_SENT",
  "CONFIRMED",
] as const;

export default async function PipelinePage() {
  const leads = await db.lead.findMany({
    where: { status: { in: [...PIPELINE_STAGES] } },
    orderBy: { lastActivityAt: "desc" },
    include: {
      contact: true,
      venue: true,
      space: true,
    },
  });

  const columns = PIPELINE_STAGES.map((stage) => ({
    id: stage,
    title: stage.replace(/_/g, " "),
    leads: leads.filter((l) => l.status === stage).map((l) => ({
      id: l.id,
      eventName: l.eventName || l.eventType,
      contactName: `${l.contact.firstName} ${l.contact.lastName}`,
      venueName: l.venue.name,
      spaceName: l.space?.name ?? null,
      eventDate: l.eventDate?.toISOString() ?? null,
      guestCount: l.guestCount,
      totalValue: Number(l.totalValue),
      status: l.status,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-muted-foreground">
          Visual overview of your sales pipeline.
        </p>
      </div>
      <PipelineBoard columns={columns} />
    </div>
  );
}
