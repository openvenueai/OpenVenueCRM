import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    activeLeadsCount,
    upcomingEvents,
    revenueMTD,
    venueCount,
    recentLeads,
    upcomingTasks,
  ] = await Promise.all([
    db.lead.count({
      where: { status: { notIn: ["COMPLETED", "LOST", "CANCELLED"] } },
    }),
    db.lead.count({
      where: {
        status: "CONFIRMED",
        eventDate: { gte: now, lte: thirtyDaysFromNow },
      },
    }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCEEDED", paidAt: { gte: startOfMonth } },
    }),
    db.venue.count(),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { contact: true, venue: true },
    }),
    db.task.findMany({
      where: { status: { not: "DONE" } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { lead: { include: { contact: true } } },
    }),
  ]);

  const revenue = Number(revenueMTD._sum.amount ?? 0);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your venue command center.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeadsCount}</div>
            <p className="text-xs text-muted-foreground">In pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue MTD</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venueCount}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link
              href="/leads"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {lead.eventName || lead.eventType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.contact.firstName} {lead.contact.lastName}
                      {lead.venue ? ` · ${lead.venue.name}` : ""}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusColors[lead.status] ?? ""}
                  >
                    {lead.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No leads yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const isOverdue = task.dueDate && task.dueDate < now;
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.lead
                          ? `${task.lead.contact.firstName} ${task.lead.contact.lastName}`
                          : "General"}
                        {task.dueDate
                          ? ` · Due ${task.dueDate.toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        isOverdue
                          ? "bg-red-100 text-red-800"
                          : task.priority === "URGENT"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : ""
                      }
                    >
                      {isOverdue ? "OVERDUE" : task.priority}
                    </Badge>
                  </div>
                );
              })}
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending tasks
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
