/**
 * Everything /indexconvert needs to show one clinic: what Doe parsed from its site, where its screenshots live, and the
 * few lines of example copy (a patient's search, an agent's reply) written for that clinic. One pack per route:
 * /indexconvert is Ford Plastic Surgery, /indexconvert-2 and /indexconvert-3 are other clinics.
 */

export type ParsedPage = { path: string; label: string; shot: string; found: string };

export type ClinicPack = {
  /** The name used in short lines: "Building Ford's Agent Files". */
  short: string;
  /** The public folder with the clinic's screenshots: `${assets}/${shot}-d.jpg` and `-m.jpg`. */
  assets: string;
  SOURCE_PAGES: ParsedPage[];
  CLINIC: {
    name: string;
    domain: string;
    url: string;
    headline: string;
    kind: string;
    area: string;
    /** The year it opened, when the site says. */
    since?: number;
    phone: string;
    /** E.164, for the agent JSON. */
    phoneIntl: string;
    tollFree?: string;
    tollFreeIntl?: string;
    consult: string;
    consultNote: string;
    currency: "CAD" | "USD";
    /** How tax applies to listed prices, for the agent JSON: "HST extra", "Not stated". */
    tax: string;
    /** The page agents are pointed to for booking today, and what happens after. */
    bookingUrl: string;
    bookingResponse: "callback" | "online_booking";
  };
  LOCATIONS: readonly {
    name: string;
    detail: string;
    address: string;
    city: string;
    /** Rows shown under Hours on the clinic's page. */
    hoursRows: readonly (readonly [string, string])[];
    /** Opening hours per day for the agent JSON, 24h, null when closed or not listed. */
    hours24: Readonly<Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string | null>>;
  }[];
  PROVIDERS: readonly { name: string; role: string; fact: string }[];
  SERVICES: { group: string; items: string[] }[];
  PRICES: { group: string; items: { name: string; price: string }[] }[];
  OFFERS: readonly { title: string; detail: string; tag: string }[];
  BOOKING: { today: readonly string[]; fields: readonly string[]; withDoe: readonly string[] };
  /** Contact rows under the locations. */
  contactRows: readonly (readonly [string, string])[];
  /** What the loader lifts off each page while it shows, keyed by screenshot. */
  pageReads: Record<string, [string, string][]>;
  /** The loader's second step: what agents find on the clinic's site today. */
  agentCheck: { detail: string; subs: string[] };
  example: {
    /** A patient's request to their personal agent, and the agent's answer naming the clinic. */
    chatAsk: string;
    chatReply: string;
    /** Two prices for the small "Agents Read Data" card. */
    priceJson: [string, number][];
    /** A made-up agent's one reply in the partners box, found through Doe and naming the clinic. */
    partnerReply: string;
    /** The JSON body of the example consult request in the API code. */
    apiBody: string;
  };
};

export const serviceCount = (p: ClinicPack) => p.SERVICES.reduce((n, g) => n + g.items.length, 0);
export const priceCount = (p: ClinicPack) => p.PRICES.reduce((n, g) => n + g.items.length, 0);
/** Every structured value on the page: listed fields, each service, price, provider, location, hours row and offer. */
export const fieldCount = (p: ClinicPack) =>
  12 + serviceCount(p) + priceCount(p) * 2 + p.PROVIDERS.length * 3 + p.LOCATIONS.length * 4 + 7 + p.OFFERS.length * 2 + p.BOOKING.fields.length;
