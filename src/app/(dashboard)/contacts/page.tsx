import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q;

  const where: Record<string, unknown> = {};
  if (searchQuery) {
    where.OR = [
      { firstName: { contains: searchQuery, mode: "insensitive" } },
      { lastName: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
      { company: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const contacts = await db.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { leads: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <p className="text-muted-foreground">
          Your client and contact directory.
        </p>
      </div>

      <form className="max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery ?? ""}
          placeholder="Search contacts..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-center">Leads</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone ?? "—"}</TableCell>
                  <TableCell>{contact.company ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {contact._count.leads}
                  </TableCell>
                  <TableCell className="capitalize">
                    {contact.source?.replace(/_/g, " ") ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No contacts found
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
