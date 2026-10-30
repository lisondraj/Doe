/**
 * /demo's shared state: one session per connected agent (browser, API or MCP), the clinic's settings, and the
 * slots agents hold or book. Used by the API routes, the MCP server, /demo and /demo/clinic.
 */

export type DemoChannel = "browser" | "api" | "mcp";
export type DemoThreadId = "concierge" | "negotiate" | "forms";
export type DemoPlan = { kind: "service" | "bundle"; id: string };

export type DemoOfferTerms = { price: number; label: string; planKey: string; status: "open" | "accepted" | "declined" };

export type DemoMessage = {
  id: string;
  from: "clinic" | "agent" | "system";
  /** Who on the clinic side wrote it: its scripted agent or clinic staff. */
  by?: "clinic-agent" | "staff";
  text: string;
  offer?: DemoOfferTerms;
  /** ISO time. */
  at: string;
};

export type DemoConsent = { terms: boolean; phi: boolean; connected: boolean; network: boolean };

export type DemoEvent = {
  id: string;
  at: string;
  actor: "agent" | "clinic" | "system";
  channel: DemoChannel | "clinic";
  type: string;
  summary: string;
};

export type DemoBookingStatus = "none" | "requested" | "confirmed" | "declined";

export type DemoSession = {
  id: string;
  /** Secret half of the agent's bearer token. Never sent to the clinic view. */
  secret: string;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
  channel: DemoChannel;
  agentName: string;
  userName: string;
  request: string;
  consent: DemoConsent;
  plan: DemoPlan;
  hold: { slotId: string; expiresAt: string } | null;
  /** Prices agreed through negotiation, by plan key. */
  agreed: Record<string, number>;
  comms: Record<string, boolean>;
  forms: {
    intake: Record<string, string>;
    signedBy: string | null;
    signedAt: string | null;
    assessments: Record<string, Record<string, number>>;
    status: "draft" | "sent";
    sentAt: string | null;
  };
  booking: {
    status: DemoBookingStatus;
    slotId: string | null;
    total: number | null;
    label: string | null;
    phiConfirmed: boolean;
    requestedAt: string | null;
    decidedAt: string | null;
    note: string | null;
  };
  threads: Record<DemoThreadId, DemoMessage[]>;
  events: DemoEvent[];
};

/** A session as the clinic or a client sees it: no secret. */
export type DemoSessionView = Omit<DemoSession, "secret">;

export type DemoConfig = {
  /** Services and bundles agents may book, by id. */
  bookable: Record<string, boolean>;
  /** Lowest share of list price the clinic's agent will agree to. */
  floorPct: number;
  /** Confirm agent booking requests without staff review. */
  autoConfirm: boolean;
};

export type DemoSlotState = { status: "open" | "held" | "requested" | "booked"; sessionId?: string; until?: string };
export type DemoSlots = Record<string, { sessionId: string; kind: "held" | "requested" | "booked"; until?: string }>;

export type DemoAnalytics = {
  sessions: number;
  live: number;
  byChannel: Record<DemoChannel, number>;
  held: number;
  formsReturned: number;
  requested: number;
  confirmed: number;
  revenue: number;
  openNegotiations: number;
  medianReplyMs: number | null;
  agentActions: number;
};
