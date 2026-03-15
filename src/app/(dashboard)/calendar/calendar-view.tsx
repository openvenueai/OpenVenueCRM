"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CalendarEvent = {
  id: string;
  title: string;
  contactName: string;
  spaceName: string | null;
  spaceColor: string;
  date: string;
  status: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarView({
  events,
  year,
  month,
}: {
  events: CalendarEvent[];
  year: number;
  month: number;
}) {
  const router = useRouter();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = month === 0 ? 12 : month;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 1 : month + 2;
  const nextYear = month === 11 ? year + 1 : year;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/calendar?month=${prevMonth}&year=${prevYear}`)
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `/calendar?month=${today.getMonth() + 1}&year=${today.getFullYear()}`
              )
            }
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/calendar?month=${nextMonth}&year=${nextYear}`)
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="grid grid-cols-7">
          {DAYS.map((day) => (
            <div
              key={day}
              className="border-b px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            return (
              <div
                key={i}
                className={`min-h-[100px] border-b border-r p-1 ${
                  day ? "" : "bg-muted/30"
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded px-1.5 py-0.5 text-xs text-white truncate cursor-pointer"
                          style={{ backgroundColor: event.spaceColor }}
                          title={`${event.title} — ${event.contactName}${event.spaceName ? ` (${event.spaceName})` : ""}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {Array.from(new Set(events.map((e) => e.spaceName).filter(Boolean))).map(
            (name) => {
              const color = events.find((e) => e.spaceName === name)?.spaceColor;
              return (
                <span key={name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {name}
                </span>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
