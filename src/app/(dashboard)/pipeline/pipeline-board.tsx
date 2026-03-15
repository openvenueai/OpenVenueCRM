"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, DollarSign } from "lucide-react";

type LeadCard = {
  id: string;
  eventName: string;
  contactName: string;
  venueName: string;
  spaceName: string | null;
  eventDate: string | null;
  guestCount: number | null;
  totalValue: number;
  status: string;
};

type Column = {
  id: string;
  title: string;
  leads: LeadCard[];
};

const stageColors: Record<string, string> = {
  INQUIRY: "border-t-blue-500",
  TOUR_SCHEDULED: "border-t-purple-500",
  PROPOSAL_SENT: "border-t-yellow-500",
  NEGOTIATION: "border-t-orange-500",
  CONTRACT_SENT: "border-t-indigo-500",
  CONFIRMED: "border-t-green-500",
};

export function PipelineBoard({ columns }: { columns: Column[] }) {
  const totalValue = columns.reduce(
    (sum, col) => sum + col.leads.reduce((s, l) => s + l.totalValue, 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">
            {columns.reduce((sum, col) => sum + col.leads.length, 0)}
          </strong>{" "}
          leads in pipeline
        </span>
        <span>
          <strong className="text-foreground">
            ${totalValue.toLocaleString()}
          </strong>{" "}
          total value
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const colValue = column.leads.reduce((s, l) => s + l.totalValue, 0);
          return (
            <div
              key={column.id}
              className="flex w-72 min-w-[18rem] flex-col rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {column.leads.length}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  ${colValue.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-2">
                {column.leads.map((lead) => (
                  <Card
                    key={lead.id}
                    className={`border-t-2 ${stageColors[lead.status] ?? ""} cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <p className="text-sm font-medium leading-tight">
                        {lead.eventName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lead.contactName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {lead.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(lead.eventDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                        {lead.guestCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {lead.guestCount}
                          </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto font-medium text-foreground">
                          <DollarSign className="h-3 w-3" />
                          {lead.totalValue.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {column.leads.length === 0 && (
                  <div className="flex items-center justify-center rounded-md border border-dashed p-6 text-xs text-muted-foreground">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
