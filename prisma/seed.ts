import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.onboardingEvent.deleteMany();
  await prisma.onboardingSession.deleteMany();
  await prisma.beo.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.paymentScheduleItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.proposalLineItem.deleteMany();
  await prisma.proposalSection.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.message.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.space.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.organization.deleteMany();

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: "Grand Events Group",
      slug: "grand-events-group",
      ownerId: "seed-owner-id",
      settings: {
        currency: "USD",
        taxRate: 8.875,
        defaultDepositPercent: 50,
      },
    },
  });

  // Create venue
  const venue = await prisma.venue.create({
    data: {
      orgId: org.id,
      name: "The Grand Estate",
      address: "450 Park Avenue, New York, NY 10022",
      timezone: "America/New_York",
      phone: "(212) 555-0100",
      email: "events@grandestate.com",
      website: "https://grandestate.com",
      settings: {
        taxRate: 8.875,
        defaultDepositPercent: 50,
        paymentTerms: "Net 30",
      },
    },
  });

  // Create 5 spaces
  const spaces = await Promise.all([
    prisma.space.create({
      data: {
        venueId: venue.id,
        name: "Grand Ballroom",
        description:
          "Our flagship event space with soaring ceilings, crystal chandeliers, and a dedicated dance floor.",
        capacityMin: 100,
        capacityMax: 350,
        rentalFee: 8500,
        setupMinutes: 120,
        teardownMinutes: 90,
        color: "#3B82F6",
        amenities: [
          "Dance floor",
          "Stage",
          "Built-in AV",
          "Bridal suite",
          "Valet parking",
        ],
        sortOrder: 0,
      },
    }),
    prisma.space.create({
      data: {
        venueId: venue.id,
        name: "Garden Terrace",
        description:
          "A lush outdoor space with manicured gardens, string lights, and a pergola for ceremonies.",
        capacityMin: 40,
        capacityMax: 180,
        rentalFee: 5000,
        setupMinutes: 90,
        teardownMinutes: 60,
        color: "#10B981",
        amenities: [
          "Outdoor ceremony site",
          "String lights",
          "Pergola",
          "Garden views",
          "Heaters available",
        ],
        sortOrder: 1,
      },
    }),
    prisma.space.create({
      data: {
        venueId: venue.id,
        name: "Rooftop Lounge",
        description:
          "Sleek rooftop space with panoramic city views, a cocktail bar, and lounge seating.",
        capacityMin: 30,
        capacityMax: 120,
        rentalFee: 4500,
        setupMinutes: 60,
        teardownMinutes: 60,
        color: "#F59E0B",
        amenities: [
          "City views",
          "Built-in bar",
          "Lounge furniture",
          "Fire pit",
          "Retractable roof",
        ],
        sortOrder: 2,
      },
    }),
    prisma.space.create({
      data: {
        venueId: venue.id,
        name: "Wine Cellar",
        description:
          "An intimate underground space with exposed brick, wine storage walls, and ambient lighting.",
        capacityMin: 15,
        capacityMax: 60,
        rentalFee: 2500,
        setupMinutes: 45,
        teardownMinutes: 30,
        color: "#8B5CF6",
        amenities: [
          "Wine displays",
          "Ambient lighting",
          "Private entrance",
          "Custom menus",
        ],
        sortOrder: 3,
      },
    }),
    prisma.space.create({
      data: {
        venueId: venue.id,
        name: "Executive Boardroom",
        description:
          "A polished meeting space with conference table, presentation screen, and video conferencing.",
        capacityMin: 8,
        capacityMax: 30,
        rentalFee: 1200,
        setupMinutes: 30,
        teardownMinutes: 15,
        color: "#EC4899",
        amenities: [
          "Conference table",
          "Presentation screen",
          "Video conferencing",
          "Whiteboard",
          "Catering available",
        ],
        sortOrder: 4,
      },
    }),
  ]);

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@email.com",
        phone: "(212) 555-0201",
        company: "Chen & Park Events",
        tags: ["bride", "high-value"],
        source: "website",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Marcus",
        lastName: "Williams",
        email: "marcus.w@techcorp.com",
        phone: "(212) 555-0202",
        company: "TechCorp Inc.",
        tags: ["corporate", "repeat_client"],
        source: "referral",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.r@email.com",
        phone: "(212) 555-0203",
        tags: ["birthday"],
        source: "the_knot",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "James",
        lastName: "Morrison",
        email: "j.morrison@lawfirm.com",
        phone: "(212) 555-0204",
        company: "Morrison & Associates",
        tags: ["corporate", "vip"],
        source: "referral",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Lisa",
        lastName: "Patel",
        email: "lisa.patel@email.com",
        phone: "(212) 555-0205",
        tags: ["bride"],
        source: "weddingwire",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@startupco.com",
        phone: "(212) 555-0206",
        company: "StartupCo",
        tags: ["corporate"],
        source: "website",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Rachel",
        lastName: "Foster",
        email: "rachel.foster@email.com",
        phone: "(212) 555-0207",
        tags: ["bride", "high-value"],
        source: "referral",
      },
    }),
    prisma.contact.create({
      data: {
        orgId: org.id,
        firstName: "Michael",
        lastName: "Torres",
        email: "m.torres@nonprofit.org",
        phone: "(212) 555-0208",
        company: "City Arts Foundation",
        tags: ["nonprofit", "gala"],
        source: "phone",
      },
    }),
  ]);

  // Create leads across different pipeline stages
  const leads = await Promise.all([
    // INQUIRY - New wedding inquiry
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[0].id,
        spaceId: spaces[0].id,
        status: "INQUIRY",
        source: "website",
        eventType: "wedding",
        eventName: "Chen-Park Wedding",
        eventDate: new Date("2026-10-17"),
        eventStart: new Date("2026-10-17T16:00:00"),
        eventEnd: new Date("2026-10-17T23:00:00"),
        guestCount: 200,
        budget: 45000,
        totalValue: 42500,
      },
    }),
    // TOUR_SCHEDULED - Corporate event
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[1].id,
        spaceId: spaces[2].id,
        status: "TOUR_SCHEDULED",
        source: "referral",
        eventType: "corporate",
        eventName: "TechCorp Annual Gala",
        eventDate: new Date("2026-06-20"),
        eventStart: new Date("2026-06-20T18:00:00"),
        eventEnd: new Date("2026-06-20T22:00:00"),
        guestCount: 100,
        budget: 25000,
        totalValue: 22000,
      },
    }),
    // PROPOSAL_SENT - Birthday party
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[2].id,
        spaceId: spaces[3].id,
        status: "PROPOSAL_SENT",
        source: "the_knot",
        eventType: "birthday",
        eventName: "Emily's 30th Birthday",
        eventDate: new Date("2026-05-15"),
        eventStart: new Date("2026-05-15T19:00:00"),
        eventEnd: new Date("2026-05-15T23:00:00"),
        guestCount: 45,
        budget: 8000,
        totalValue: 7200,
      },
    }),
    // NEGOTIATION - Corporate retreat
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[3].id,
        spaceId: spaces[4].id,
        status: "NEGOTIATION",
        source: "referral",
        eventType: "corporate",
        eventName: "Morrison Associates Q3 Retreat",
        eventDate: new Date("2026-07-10"),
        eventStart: new Date("2026-07-10T09:00:00"),
        eventEnd: new Date("2026-07-10T17:00:00"),
        guestCount: 25,
        budget: 5000,
        totalValue: 4800,
      },
    }),
    // CONTRACT_SENT - Wedding
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[4].id,
        spaceId: spaces[1].id,
        status: "CONTRACT_SENT",
        source: "weddingwire",
        eventType: "wedding",
        eventName: "Patel-Singh Wedding",
        eventDate: new Date("2026-09-05"),
        eventStart: new Date("2026-09-05T15:00:00"),
        eventEnd: new Date("2026-09-05T22:00:00"),
        guestCount: 150,
        budget: 35000,
        totalValue: 32000,
      },
    }),
    // CONFIRMED - Product launch
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[5].id,
        spaceId: spaces[2].id,
        status: "CONFIRMED",
        source: "website",
        eventType: "corporate",
        eventName: "StartupCo Product Launch",
        eventDate: new Date("2026-04-25"),
        eventStart: new Date("2026-04-25T17:00:00"),
        eventEnd: new Date("2026-04-25T21:00:00"),
        guestCount: 80,
        budget: 15000,
        totalValue: 14500,
        confirmedAt: new Date("2026-03-01"),
      },
    }),
    // CONFIRMED - Wedding (soon)
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[6].id,
        spaceId: spaces[0].id,
        status: "CONFIRMED",
        source: "referral",
        eventType: "wedding",
        eventName: "Foster-Blake Wedding",
        eventDate: new Date("2026-04-12"),
        eventStart: new Date("2026-04-12T16:00:00"),
        eventEnd: new Date("2026-04-12T23:00:00"),
        guestCount: 250,
        budget: 55000,
        totalValue: 52000,
        confirmedAt: new Date("2026-01-15"),
      },
    }),
    // INQUIRY - Nonprofit gala
    prisma.lead.create({
      data: {
        venueId: venue.id,
        contactId: contacts[7].id,
        spaceId: spaces[0].id,
        status: "INQUIRY",
        source: "phone",
        eventType: "corporate",
        eventName: "City Arts Annual Gala",
        eventDate: new Date("2026-11-08"),
        eventStart: new Date("2026-11-08T18:00:00"),
        eventEnd: new Date("2026-11-08T23:00:00"),
        guestCount: 300,
        budget: 60000,
        totalValue: 0,
      },
    }),
  ]);

  // Add some messages to the first lead
  await prisma.message.createMany({
    data: [
      {
        leadId: leads[0].id,
        senderType: "CLIENT",
        channel: "EMAIL",
        direction: "INBOUND",
        subject: "Wedding Inquiry - October 2026",
        body: "Hi, my fiancé and I are looking for a venue for our October 2026 wedding. We're expecting around 200 guests and love the look of your Grand Ballroom. Could you send us some information about availability and pricing?",
      },
      {
        leadId: leads[0].id,
        senderType: "STAFF",
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: "Re: Wedding Inquiry - October 2026",
        body: "Thank you so much for reaching out, Sarah! We'd love to host your wedding at The Grand Estate. The Grand Ballroom is available on October 17, 2026. I'd love to schedule a tour so you can see the space in person. Would any time this week work for you?",
      },
      {
        leadId: leads[0].id,
        senderType: "STAFF",
        channel: "INTERNAL_NOTE",
        direction: "OUTBOUND",
        body: "High-value lead. Budget of $45K is well within our range. She mentioned seeing us on Instagram. Follow up if no response by Wednesday.",
        isInternal: true,
      },
    ],
  });

  // Add activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        leadId: leads[0].id,
        actorType: "SYSTEM",
        action: "lead_created",
        description: "New inquiry received via website",
      },
      {
        leadId: leads[0].id,
        actorType: "CLIENT",
        action: "email_received",
        description: "Sarah Chen sent initial inquiry email",
      },
      {
        leadId: leads[0].id,
        actorType: "STAFF",
        action: "email_sent",
        description: "Replied to inquiry with availability info",
      },
      {
        leadId: leads[5].id,
        actorType: "SYSTEM",
        action: "status_changed",
        description: "Status changed to Confirmed",
        metadata: { from: "CONTRACT_SENT", to: "CONFIRMED" },
      },
      {
        leadId: leads[6].id,
        actorType: "SYSTEM",
        action: "status_changed",
        description: "Status changed to Confirmed",
        metadata: { from: "CONTRACT_SENT", to: "CONFIRMED" },
      },
    ],
  });

  // Add some tasks
  await prisma.task.createMany({
    data: [
      {
        leadId: leads[0].id,
        venueId: venue.id,
        title: "Follow up with Sarah Chen on tour availability",
        dueDate: new Date("2026-03-18"),
        priority: "HIGH",
        status: "TODO",
      },
      {
        leadId: leads[5].id,
        venueId: venue.id,
        title: "Finalize AV requirements for StartupCo launch",
        dueDate: new Date("2026-04-10"),
        priority: "MEDIUM",
        status: "TODO",
      },
      {
        leadId: leads[6].id,
        venueId: venue.id,
        title: "Send final BEO to Foster-Blake wedding party",
        dueDate: new Date("2026-04-05"),
        priority: "URGENT",
        status: "IN_PROGRESS",
      },
      {
        venueId: venue.id,
        title: "Update venue photos on website",
        dueDate: new Date("2026-03-30"),
        priority: "LOW",
        status: "TODO",
      },
    ],
  });

  console.log("Seed complete!");
  console.log(`  Organization: ${org.name}`);
  console.log(`  Venue: ${venue.name}`);
  console.log(`  Spaces: ${spaces.length}`);
  console.log(`  Contacts: ${contacts.length}`);
  console.log(`  Leads: ${leads.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
