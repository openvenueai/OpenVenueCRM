import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const org = await db.organization.findFirst({
    include: {
      _count: { select: { venues: true, contacts: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Configure your workspace.</p>
      </div>

      {org && (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{org.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-medium">{org.slug}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Venues</p>
                <Badge variant="secondary">{org._count.venues}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contacts</p>
                <Badge variant="secondary">{org._count.contacts}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none w-full",
                card: "shadow-none w-full",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
