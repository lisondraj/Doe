/**
 * /demo's shared state: one session per connected agent (browser, API or MCP), the clinic's settings, and the
 * slots agents hold or book. Used by the API routes, the MCP server, /demo and /demo/clinic.
 */

export type DemoChannel = "browser" | "api" | "mcp";
export type DemoThreadId = "concierge" | "negotiate" | "forms";
/** package: a service plus add-on services, priced together in a negotiation; id is service ids joined by "+". */
export type DemoPlan = { kind: "service" | "bundle" | "package"; id: string };

export type DemoOfferTerms = {
  price: number;
  label: string;
  planKey: string;
  status: "open" | "accepted" | "declined";
  /** List price of what's offered, to show the saving. */
  list?: number;
  /** Services in a package offer. */
  includes?: string[];
};

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

/** A file or written form passed between the agent and the clinic (a migraine diary, a referral, instructions). */
export type DemoUpload = {
  id: string;
  /** Who sent it. */
  by: "agent" | "clinic";
  title: string;
  fileName: string;
  mime: string;
  /** Bytes. */
  size: number;
  at: string;
  /** Written forms, as plain text. */
  text?: string;
  /** Files, as a data: URL. Left out of the clinic's list view; fetched on demand. */
  dataUrl?: string;
};

/** A private link to a read-only copy of the user's forms. */
export type DemoShare = {
  id: string;
  createdAt: string;
  expiresAt: string;
  views: number;
  lastViewedAt: string | null;
  revoked: boolean;
};

export type DemoIdentity = {
  status: "pending" | "verified";
  /** The link the agent sends; only the agent sees it. */
  url: string;
  requestedAt: string;
  /** When the user last opened the link. */
  openedAt?: string | null;
  verifiedAt: string | null;
  dob: string | null;
  /** face-id: unlocked with a platform authenticator (Face ID, Touch ID, Windows Hello); none: the device had none. */
  method: "face-id" | "none" | null;
  license: { fileName: string; mime: string; size: number } | null;
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
  /** Where the user is, as the agent gave it (e.g. Toronto, Ontario). */
  userLocation?: string | null;
  /** The user's phone, as the agent gave it. */
  userPhone?: string | null;
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
    /** Files and written forms passed back and forth. */
    uploads?: DemoUpload[];
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
  /**
   * The user's identity check: the agent sends `url` after connect; the user confirms their date of birth, attaches a
   * driver's licence and unlocks with Face ID (a WebAuthn platform check) on their phone.
   */
  identity?: DemoIdentity;
  /** Read-only copies of the forms shared with the user by link. The token itself lives only in shares/<token>.json. */
  shares?: DemoShare[];
  /** Actions and messages this hour, for the per-session quota. */
  usage?: { hour: string; actions: number; messages: number };
};

/**
 * An MCP agent from its first call (the initialize handshake), before it has a booking session: who it is and what it
 * has read. Its Mcp-Session-Id is the visit id. doe_connect links it to the session it starts.
 */
export type DemoVisit = {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  agentName: string;
  client: { name: string | null; version: string | null; title: string | null };
  userAgent: string | null;
  ipKey: string;
  sessionId: string | null;
  calls: { at: string; method: string; tool: string | null; summary: string }[];
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
  /** Which one-time settings changes (CONFIG_REV in demo-store) this config already has. */
  rev?: number;
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
