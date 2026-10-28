/**
 * /services tiers table: Doe for the service economy (contractors, cleaning, yard and home care, auto and every other
 * trade that comes to the customer or takes their car in). The same four tiers and prices as /earlypreview, with each
 * extra user priced like an extra provider there, and the features a service business would want.
 */

import type { EarlyPreviewTierRow, EarlyPreviewTiersTable } from "@/lib/earlypreview/earlypreview-market-copy";

const ALL = [true, true, true, true] as const;
const FROM_BASIC = [false, true, true, true] as const;
const FROM_ADVANCED = [false, false, true, true] as const;
const ONE_ONLY = [false, false, false, true] as const;

const row = (label: string, detail: string, cells: EarlyPreviewTierRow["cells"]): EarlyPreviewTierRow => ({
  label,
  detail,
  cells,
});

export const SERVICES_TIERS = {
  title: ["What's in each tier.", "And what it costs."],
  hint: "Select any feature to see what it is.",
  tiers: [
    { id: "free", name: "Free", priceMo: 0, extras: ["Always free"] },
    { id: "basic", name: "Basic", priceMo: 49, extras: ["+$19/user"] },
    { id: "advanced", name: "Advanced", priceMo: 149, extras: ["+$39/user"] },
    { id: "one", name: "Doe One", priceMo: 299, extras: ["+$79/user +\u00a0usage"] },
  ],
  sections: [
    {
      id: "found",
      label: "Get found",
      rows: [
        row("Business Profile", "Claim your business's profile and switch it on for customers' personal agents.", ALL),
        row("Verified Badge", "A verified mark on your profile, so agents and customers know it's really your business.", ALL),
        row(
          "Edit by Typing",
          "Update your business by typing what changed. On Free a few fields, like live availability, stay locked.",
          ["Most", true, true, true],
        ),
        row(
          "Services & Rates",
          "Every job you do and what it costs, by the hour, the visit or the job, set up the way agents should quote it.",
          ALL,
        ),
        row(
          "Service Area",
          "The neighbourhoods, postal codes and distance you cover, so agents only send you jobs you can reach.",
          ALL,
        ),
        row(
          "Doe Engine",
          "How agents find you. Standard adds the well-known file, MCP and an API. Priority puts your business ahead of others in rotation when an agent is choosing a pro.",
          ["Basic", "Standard", "Priority", "Priority"],
        ),
        row(
          "Reviews & Past Work",
          "Your reviews and photos of finished jobs, shown to agents comparing pros for their customer.",
          FROM_BASIC,
        ),
        row(
          "Licensed & Insured",
          "Show your licence and insurance, checked by Doe, so agents can pick you for jobs that need them.",
          FROM_BASIC,
        ),
        row(
          "Any Language",
          "Agents read and answer for your business in the customer's own language, English and French first.",
          FROM_BASIC,
        ),
      ],
    },
    {
      id: "booked",
      label: "Get booked",
      rows: [
        row(
          "Instant Quotes",
          "Agents get a price for the job on the spot: a range on Basic, an exact quote from your rates and the job's details from Advanced.",
          [false, "Range", "Exact", "Exact"],
        ),
        row("Agent Booking", "Customers' agents book, reschedule and cancel jobs with you directly.", FROM_BASIC),
        row(
          "Job Photos & Details",
          "Customers' agents send photos, measurements, the make and model, and access notes before you arrive.",
          FROM_BASIC,
        ),
        row(
          "Reminders & Confirmations",
          "Reminders, arrival windows and on-my-way texts go out on their own, so customers are home when you get there.",
          FROM_BASIC,
        ),
        row(
          "Doe Interface",
          "A direct line from a customer's agent to your business, with no phone tag. Questions, changes and approvals arrive structured, and Doe answers or acts.",
          FROM_ADVANCED,
        ),
        row(
          "Estimates & Site Visits",
          "Book an on-site estimate, then turn it into a quote the customer's agent can accept in one step.",
          FROM_ADVANCED,
        ),
        row(
          "Recurring Jobs",
          "Weekly cleans, biweekly mows, seasonal checks and regular oil changes booked once and kept on schedule.",
          FROM_ADVANCED,
        ),
        row(
          "Same-Day & Emergency",
          "Urgent jobs, like a burst pipe or a car that won't start, routed to whoever can go now, at your rush rate.",
          FROM_ADVANCED,
        ),
        row("Waitlist & Autofill", "A waitlist that fills cancelled jobs on its own, so an open slot gets booked again.", FROM_ADVANCED),
      ],
    },
    {
      id: "paid",
      label: "Get paid",
      rows: [
        row(
          "Deposits",
          "Take a deposit when an agent books, so materials and the slot are covered before you roll a truck.",
          FROM_ADVANCED,
        ),
        row("Quotes to Invoices", "An accepted quote becomes the invoice, with any extras added as the job goes.", FROM_ADVANCED),
        row(
          "Change Orders",
          "Extra work approved by the customer's agent in writing before you do it, with the new price attached.",
          FROM_ADVANCED,
        ),
        row(
          "Pay on Completion",
          "The customer's agent pays the moment the job is marked done, tip included, with no chasing.",
          FROM_ADVANCED,
        ),
        row("Payouts", "Deposits, jobs and tips paid out together, on a schedule you can see.", FROM_ADVANCED),
        row("Financing", "Offer monthly payments on bigger jobs, like a new roof or a transmission, and get paid in full.", ONE_ONLY),
      ],
    },
    {
      id: "run",
      label: "Run the business",
      rows: [
        row("Smart Schedule", "Your crews' day, week and month at a glance, with each job's notes and photos a click away.", FROM_BASIC),
        row(
          "Dispatch & Routing",
          "Jobs assigned to the right crew or tech, and each day's stops put in the order that drives the least.",
          [false, false, "Basic", "Smart"],
        ),
        row(
          "Job Checklists & Photos",
          "Crews follow a checklist on site and take before-and-after photos the customer's agent receives with the invoice.",
          FROM_ADVANCED,
        ),
        row(
          "Parts & Materials",
          "Parts and materials tracked per job, reordered when they run low and added to the invoice at your markup.",
          ONE_ONLY,
        ),
        row(
          "Follow-Ups & Rebooking",
          "The next service, like a furnace check, a gutter clean or an oil change, offered at the right time, on its own.",
          FROM_ADVANCED,
        ),
        row("Review Requests", "A review asked for when the job's done, while it's still fresh.", FROM_BASIC),
        row(
          "Automations",
          "Workflows that run when something happens, like a job booked, a quote left unanswered or a payment late, each with its own switch.",
          FROM_ADVANCED,
        ),
        row(
          "Voice Agents",
          "Every call answered, day and night, even from a ladder or under a car, with booking and a live handoff. An add-on on Advanced.",
          [false, false, "Add-on", true],
        ),
        row("Analytics", "Where your jobs come from, what customers ask for, what you win and how fast you answer.", FROM_ADVANCED),
        row(
          "Unanswered Questions",
          "The questions agents asked that your business couldn't answer yet, each with one click to cover it.",
          FROM_ADVANCED,
        ),
        row(
          "AI Insights",
          "Which jobs pay best, which neighbourhoods ask most, and what to charge and offer next.",
          ONE_ONLY,
        ),
      ],
    },
    {
      id: "team",
      label: "Team & support",
      rows: [
        row(
          "Agent Access",
          "Decide what agents may do. Pick Open, Balanced or Cautious, then set each service to allowed, reviewed first, restricted or off. One switch pauses them all.",
          [false, "Presets", "Full", "Full"],
        ),
        row("Team & Roles", "Add your crew, techs and office staff, and decide what each person can see and do.", FROM_ADVANCED),
        row(
          "Crews & Branches",
          "Every crew and branch from one account, each with its own area, hours and services.",
          FROM_ADVANCED,
        ),
        row(
          "Staff Agents",
          "A personal agent for each member of your team that can work in your business's software for them.",
          ONE_ONLY,
        ),
        row("White-Glove Onboarding", "We set Doe up with you: your services, rates, area and tools, and training for your team.", ONE_ONLY),
        row("Support", "From self-serve docs on Free to a dedicated success manager on Doe One.", ["Docs", "Email", "Priority", "Dedicated"]),
      ],
    },
    {
      id: "spam",
      label: "Spam protection",
      rows: [
        row(
          "Spam Filter",
          "Spam, junk leads and sales pitches filtered out before they reach you. Free catches the obvious; every paid tier filters it all.",
          ["Basic", "Full", "Full", "Full"],
        ),
        row(
          "Verified Agents Only",
          "Only agents acting for a real, verified customer can ask for a quote or book. Anonymous bots are turned away.",
          FROM_BASIC,
        ),
        row("Block List", "Block any agent, number or email in one click, across every channel.", FROM_BASIC),
        row(
          "Fake Job Detection",
          "Jobs that look fake, like a quote request with no real address or a burst of holds, are caught and held for review before they take a slot.",
          FROM_ADVANCED,
        ),
        row(
          "Lead Quality Score",
          "Every request scored for how likely it is to become a real, paying job, so you answer the best ones first.",
          FROM_ADVANCED,
        ),
        row(
          "Bot & Scraper Blocking",
          "Bots and scrapers kept off your calendar and your rates, including competitors pricing against you.",
          FROM_ADVANCED,
        ),
        row("Rate Limits", "Caps on how often any one agent can ask or book, so no one can flood your business.", FROM_ADVANCED),
        row("Duplicate Merging", "The same job requested twice, or by two agents for one customer, merged into one.", FROM_ADVANCED),
        row(
          "Robocall Screening",
          "Spam and robocalls screened out before your voice agent or your crew pick up. With voice agents on Advanced.",
          [false, false, "Add-on", true],
        ),
        row("Spam Report", "What was blocked each week and why, with one click to let anything back in.", FROM_ADVANCED),
      ],
    },
    {
      id: "trust",
      label: "Trust & security",
      rows: [
        row("Encryption", "Everything encrypted in transit and at rest, on every tier.", ALL),
        row("Customer Privacy", "Customers' addresses, photos and payment details shared only for the job they're for.", ALL),
        row("Audit Log", "Every agent action recorded: who asked, what was shared and when.", FROM_ADVANCED),
        row("Single Sign-On", "Your whole team signs in with the accounts they already use.", ONE_ONLY),
      ],
    },
    {
      id: "price",
      label: "Price, a month",
      rows: [
        row("Base", "One user, one location. Doe One adds usage on top.", ["$0", "$49", "$149", "$299"]),
        row("Each Extra User", "Added each month for every user on your team past the first.", [false, "+$19", "+$39", "+$79"]),
        row(
          "Founding Price",
          "Basic is $29 for the first 100 businesses and $39 for the next 50, each for a full year. Advanced is $59 for the first 50 and $89 for the next 50, each for six months. Doe One is $199 plus usage.",
          [false, "$29", "$59", "$199"],
        ),
        row(
          "10+ Locations",
          "Custom pricing, discounted from your bulk total. Create an account and book a call to lock it in.",
          [false, "Custom", "Custom", "Custom"],
        ),
      ],
    },
  ],
} as const satisfies EarlyPreviewTiersTable;
