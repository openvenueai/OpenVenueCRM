import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<string, string> = {
  INQUIRY: "bg-blue-100 text-blue-800",
  TOUR_SCHEDULED: "bg-purple-100 text-purple-800",
  PROPOSAL_SENT: "bg-yellow-100 text-yellow-800",
  NEGOTIATION: "bg-orange-100 text-orange-800",
  CONTRACT_SENT: "bg-indigo-100 text-indigo-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  LOST: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;
  const searchQuery = params.q;

  const where: Record<string, unknown> = {};
  if (statusFilter) {
    where.status = statusFilter;
  }
  if (searchQuery) {
    where.OR = [
      { eventName: { contains: searchQuery, mode: "insensitive" } },
      { contact: { firstName: { contains: searchQuery, mode: "insensitive" } } },
      { contact: { lastName: { contains: searchQuery, mode: "insensitive" } } },
      { contact: { email: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      contact: true,
      venue: true,
      space: true,
    },
  });

  const statuses = [
    "INQUIRY",
    "TOUR_SCHEDULED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "CONTRACT_SENT",
    "CONFIRMED",
    "COMPLETED",
    "LOST",
    "CANCELLED",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-muted-foreground">
          Manage your leads and inquiries.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="/leads"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !statusFilter
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All ({leads.length})
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/leads?status=${s}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {s.replace(/_/g, " ")}
          </a>
        ))}
      </div>

      {/* Search */}
      <form className="max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery ?? ""}
          placeholder="Search leads..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Venue / Space</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.eventName || lead.eventType}
                  </TableCell>
                  <TableCell>
                    <div>
                      {lead.contact.firstName} {lead.contact.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lead.contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{lead.venue.name}</div>
                    {lead.space && (
                      <div className="text-xs text-muted-foreground">
                        {lead.space.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.eventDate
                      ? new Date(lead.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"}
                  </TableCell>
                  <TableCell>{lead.guestCount ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    ${Number(lead.totalValue).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[lead.status] ?? ""}
                    >
                      {lead.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
