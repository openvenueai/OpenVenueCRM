import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  DollarSign,
} from "lucide-react";

export default async function VenuesPage() {
  const venues = await db.venue.findMany({
    include: {
      spaces: { orderBy: { sortOrder: "asc" } },
      _count: { select: { leads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Venues</h1>
        <p className="text-muted-foreground">
          Manage your venues and spaces.
        </p>
      </div>

      {venues.map((venue) => (
        <Card key={venue.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {venue.name}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {venue.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {venue.address}
                    </span>
                  )}
                  {venue.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {venue.phone}
                    </span>
                  )}
                  {venue.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {venue.email}
                    </span>
                  )}
                  {venue.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {venue.website}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary">{venue._count.leads} leads</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="text-sm font-medium mb-3">
              Spaces ({venue.spaces.length})
            </h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {venue.spaces.map((space) => (
                <div
                  key={space.id}
                  className="rounded-lg border p-4 space-y-2"
                  style={{ borderLeftColor: space.color, borderLeftWidth: 3 }}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{space.name}</h5>
                    {!space.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {space.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {space.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {space.capacityMin ? `${space.capacityMin}–` : "Up to "}
                      {space.capacityMax}
                    </span>
                    {space.rentalFee && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {Number(space.rentalFee).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {space.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {space.amenities.slice(0, 3).map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                      {space.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{space.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {venues.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No venues yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
