/**
 * /GTMENGINE's tables. Each one's rows live in `public.gtm_engine_rows` under its `key`, with the columns below kept
 * by `key` in the row's `data`. Every row also has an entry date (when it was put in), a report date (the edition it
 * came from), a duplicate key, the import batch it came with (if any), a page (Generate) and an outreach status.
 *
 * The same definitions drive the page, the import checks (`checkRow`) and the export, on the client and the server.
 */

export type GtmColumn = {
  key: string;
  label: string;
  /** Column width in px on the sheet. */
  width: number;
  /** A dropdown of these instead of free text. Imported values are matched to them case-insensitively. */
  options?: readonly string[];
  /** Other header names an import maps to this column. */
  aliases?: readonly string[];
  /** A web address: a bare domain is saved as https://… */
  url?: boolean;
  email?: boolean;
};

export type GtmTable = {
  key: GtmTableKey;
  title: string;
  /** A line under the title. */
  note?: string;
  columns: GtmColumn[];
  /** Columns a line can't be imported without. */
  required: readonly string[];
  /** The country every line belongs to, for the tables split by country. */
  country?: GtmCountry;
  /** How duplicates are matched: by organization, or by person + organization. */
  match: { label: string; keys: readonly string[] };
};

export type GtmTableKey = "clinics_us" | "clinics_ca" | "clinics_other" | "multi_site" | "hospital_loi" | "programs" | "services";

export type GtmSection = { title: string; tables: GtmTable[] };

export const GTM_STATUSES = ["Sent", "Generated", "Claimed", "Purchased"] as const;
export type GtmStatus = (typeof GTM_STATUSES)[number];

/** Saved lines shown per page of a table, and blank lines in the input sheet for an agent to fill. */
export const GTM_PAGE_SIZE = 50;
/** The most lines one import takes. */
export const GTM_IMPORT_MAX = 5000;

export const GTM_COUNTRIES = ["Canada", "US"] as const;
export type GtmCountry = (typeof GTM_COUNTRIES)[number];

const YES_NO = ["Yes", "No"] as const;
const EMAIL_TYPES = ["General inbox", "Named person", "Location inbox"] as const;
export const VERIFICATION = ["Confirmed on own site", "Indicated elsewhere", "Searched, none verified", "Not researched"] as const;

export const SERVICE_TYPES = [
  "Home services",
  "Beauty & wellness",
  "Auto services",
  "Tutoring & lessons",
  "Pet services",
  "Professional services",
  "Home/property transactions",
  "Child & family",
  "Events",
  "Non-auto repair",
  "Personal services",
  "Fitness & recreation",
  "Local logistics",
  "Financial services",
] as const;

/* -------------------------------------------------------------- Shared columns */

const COUNTRY: GtmColumn = { key: "country", label: "Country", width: 120, options: GTM_COUNTRIES };
const PROVINCE: GtmColumn = { key: "province_state", label: "Province / state", width: 160, aliases: ["province", "state", "prov", "st", "province state"] };
const CITY: GtmColumn = { key: "city", label: "City", width: 160, aliases: ["town", "municipality"] };
const EMAIL: GtmColumn = { key: "email", label: "Email", width: 230, email: true, aliases: ["email published", "e-mail", "email address", "public email"] };
const EMAIL_ON_SITE: GtmColumn = { key: "email_on_own_site", label: "Email published on own site", width: 170, options: YES_NO, aliases: ["published on own site", "on own site"] };
const EMAIL_TYPE: GtmColumn = { key: "email_type", label: "Email type", width: 160, options: EMAIL_TYPES };
const PHONE: GtmColumn = { key: "phone", label: "Phone", width: 160, aliases: ["telephone", "phone number", "tel"] };
const WEBSITE: GtmColumn = { key: "website", label: "Website (full URL)", width: 250, url: true, aliases: ["website", "url", "site", "web", "website url"] };
const EVIDENCE: GtmColumn = { key: "evidence_notes", label: "Evidence notes", width: 280, aliases: ["evidence", "notes", "evidence note"] };

const CLINIC_COLUMNS: GtmColumn[] = [
  { key: "org_id", label: "Org ID", width: 110, aliases: ["id", "organization id", "org id", "clinic id"] },
  { key: "priority", label: "Priority", width: 110, options: ["P1", "P2", "P3"] },
  { key: "organization", label: "Organization", width: 230, aliases: ["clinic", "clinic name", "name", "org", "organization name"] },
  { key: "specialty", label: "Specialty", width: 180, aliases: ["speciality", "type"] },
  COUNTRY,
  PROVINCE,
  CITY,
  { key: "region_group", label: "Region group", width: 150, options: ["GTA", "Outside GTA", "Other"], aliases: ["group", "region"] },
  { key: "market_footprint", label: "Market / footprint", width: 200, aliases: ["market", "footprint"] },
  { key: "leader_buyer_route", label: "Leader / buyer route", width: 220, aliases: ["leader", "buyer route", "buyer"] },
  { key: "public_contact", label: "Public professional contact", width: 220, aliases: ["contact", "public contact"] },
  EMAIL,
  EMAIL_ON_SITE,
  EMAIL_TYPE,
  PHONE,
  WEBSITE,
  { key: "doe_fit", label: "Doe-fit hypothesis", width: 260, aliases: ["doe fit", "fit", "hypothesis"] },
  { key: "evidence_links", label: "Evidence / source links", width: 260, aliases: ["source links", "sources", "source"] },
  EVIDENCE,
];

const ORG_MATCH = { label: "organization", keys: ["organization"] } as const;

const clinicTable = (key: GtmTableKey, title: string, country?: GtmCountry, note?: string): GtmTable => ({
  key,
  title,
  note,
  columns: CLINIC_COLUMNS,
  required: ["organization"],
  country,
  match: ORG_MATCH,
});

export const HEALTH_SECTIONS: GtmSection[] = [
  {
    title: "Clinics",
    tables: [
      clinicTable("clinics_us", "United States", "US"),
      clinicTable("clinics_ca", "Canada", "Canada", "Region group marks the outside-GTA group."),
      clinicTable("clinics_other", "Other"),
      {
        key: "multi_site",
        title: "Multi-site",
        required: ["organization"],
        match: ORG_MATCH,
        columns: [
          { key: "org_id", label: "Org ID", width: 110, aliases: ["id", "organization id"] },
          { key: "organization", label: "Organization", width: 230, aliases: ["id organization", "name", "org"] },
          { key: "table", label: "Table", width: 160 },
          { key: "footprint_tier", label: "Footprint tier", width: 160, aliases: ["tier", "footprint"] },
          COUNTRY,
          PROVINCE,
          CITY,
          WEBSITE,
          { key: "evidence_links", label: "Evidence / source links", width: 260, aliases: ["source links", "sources", "source"] },
          EVIDENCE,
        ],
      },
    ],
  },
  {
    title: "Hospital LOI",
    tables: [
      {
        key: "hospital_loi",
        title: "Hospital LOI",
        required: ["organization", "name"],
        match: { label: "person + organization", keys: ["name", "organization"] },
        columns: [
          { key: "num", label: "#", width: 70, aliases: ["no", "number"] },
          { key: "organization", label: "Organization", width: 230, aliases: ["hospital", "org"] },
          { key: "name", label: "Name", width: 180, aliases: ["person", "contact", "full name"] },
          { key: "title", label: "Title", width: 200, aliases: ["job title", "position"] },
          { key: "role_type", label: "Role type", width: 160, aliases: ["role"] },
          { key: "role_evidence", label: "Evidence for current role", width: 240, aliases: ["current role evidence"] },
          { key: "public_email", label: "Public email", width: 230, email: true, aliases: ["email", "email published"] },
          EMAIL_ON_SITE,
          EMAIL_TYPE,
          { key: "verified_route", label: "What was verified / route", width: 280, aliases: ["what was verified", "route", "verified"] },
          { key: "hypothesis", label: "Route is a hypothesis", width: 160, options: YES_NO, aliases: ["hypothesis flagged", "hypothesis flag"] },
          COUNTRY,
          PROVINCE,
          CITY,
          { key: "source", label: "Source", width: 240, url: true, aliases: ["source url", "source link"] },
          EVIDENCE,
        ],
      },
      {
        key: "programs",
        title: "Programs",
        required: ["program"],
        match: { label: "program", keys: ["program"] },
        columns: [
          { key: "program", label: "Program", width: 230, aliases: ["program name", "name"] },
          { key: "organization", label: "Organization", width: 220, aliases: ["org", "hospital"] },
          { key: "region", label: "Region", width: 160 },
          COUNTRY,
          PROVINCE,
          { key: "page_says", label: "What the page says", width: 300, aliases: ["page says", "summary"] },
          { key: "how_to_reach", label: "How to reach", width: 240, aliases: ["contact", "reach"] },
          { key: "source", label: "Source", width: 240, url: true, aliases: ["source url", "source link"] },
          EVIDENCE,
        ],
      },
    ],
  },
];

export const NON_HEALTH_SECTIONS: GtmSection[] = [
  {
    title: "Services",
    tables: [
      {
        key: "services",
        title: "Services",
        note: `Focus: ${SERVICE_TYPES.join(", ").toLowerCase()}.`,
        required: ["business", "country"],
        match: { label: "business", keys: ["business"] },
        columns: [
          { key: "id", label: "ID", width: 90, aliases: ["org id", "business id"] },
          { key: "business", label: "Business", width: 230, aliases: ["business name", "name", "company"] },
          { key: "type", label: "Type", width: 210, options: SERVICE_TYPES, aliases: ["category", "service type"] },
          COUNTRY,
          PROVINCE,
          CITY,
          PHONE,
          EMAIL,
          EMAIL_ON_SITE,
          EMAIL_TYPE,
          { key: "booking_observed", label: "Booking observed", width: 200, aliases: ["booking"] },
          { key: "booking_platform", label: "Booking platform", width: 170, aliases: ["platform", "booking system"] },
          { key: "booking_link", label: "Booking link", width: 240, url: true, aliases: ["booking url"] },
          { key: "booking_status", label: "Booking: observed or possible", width: 190, options: ["Observed", "Possible", "Not found"], aliases: ["booking confidence"] },
          { key: "multi_worker_booking", label: "Multiple workers, booked individually", width: 220, options: ["Yes", "No", "Unknown"], aliases: ["multiple workers", "individual booking"] },
          { key: "team", label: "Team observed", width: 200, aliases: ["team"] },
          { key: "contact_person", label: "Contact person", width: 180, aliases: ["person", "contact"] },
          { key: "contact_role", label: "Contact role", width: 160, aliases: ["role"] },
          { key: "contact_channel", label: "Contact channel", width: 160, aliases: ["channel"] },
          { key: "contact_source_url", label: "Contact source URL", width: 240, url: true, aliases: ["contact source", "source url", "source"] },
          { key: "verification", label: "Verification", width: 200, options: VERIFICATION, aliases: ["verification label", "verified"] },
          WEBSITE,
          EVIDENCE,
        ],
      },
    ],
  },
];

export const GTM_TABLES: Record<GtmTableKey, GtmTable> = Object.fromEntries(
  [...HEALTH_SECTIONS, ...NON_HEALTH_SECTIONS].flatMap((s) => s.tables).map((t) => [t.key, t]),
) as Record<GtmTableKey, GtmTable>;

export function isGtmTableKey(value: unknown): value is GtmTableKey {
  return typeof value === "string" && value in GTM_TABLES;
}

export type GtmRow = {
  id: string;
  created_at: string;
  /** YYYY-MM-DD: the date the line was entered under. Lines group by it, newest first. */
  entry_date: string;
  /** YYYY-MM-DD: the report (edition) the line came from, if known. */
  report_date: string | null;
  data: Record<string, string>;
  page: string | null;
  status: GtmStatus | null;
  import_batch: string | null;
};

export type GtmImport = {
  id: string;
  created_at: string;
  table_key: GtmTableKey;
  source: "page" | "api";
  format: string | null;
  report_date: string | null;
  entry_date: string;
  accepted: number;
  skipped: number;
  errors: number;
  undone_at: string | null;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A real calendar date as YYYY-MM-DD. */
export function isGtmDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/* -------------------------------------------------------------- Geography */

const CA_PROVINCES: Record<string, string> = {
  AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick", NL: "Newfoundland and Labrador",
  NS: "Nova Scotia", NT: "Northwest Territories", NU: "Nunavut", ON: "Ontario", PE: "Prince Edward Island",
  QC: "Quebec", SK: "Saskatchewan", YT: "Yukon",
};

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  PR: "Puerto Rico", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const fold = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

const REGIONS = new Map<string, { country: GtmCountry; name: string }>();
for (const [code, name] of Object.entries(CA_PROVINCES)) {
  REGIONS.set(fold(name), { country: "Canada", name });
  REGIONS.set(`ca ${fold(code)}`, { country: "Canada", name });
}
for (const [code, name] of Object.entries(US_STATES)) {
  REGIONS.set(fold(name), { country: "US", name });
  REGIONS.set(`us ${fold(code)}`, { country: "US", name });
}
REGIONS.set("quebec", { country: "Canada", name: "Quebec" });
REGIONS.set("pei", { country: "Canada", name: "Prince Edward Island" });

/**
 * The province or state a value names, and its country. A two-letter code shared by both (CA is California, not
 * Canada) is read in the country the line already has, then the table's, then Canada for provinces' codes.
 */
export function resolveRegion(value: string, country?: GtmCountry): { country: GtmCountry; name: string } | null {
  const f = fold(value);
  if (!f) return null;
  const named = REGIONS.get(f);
  if (named) return named;
  if (f.length !== 2) return null;
  const ca = REGIONS.get(`ca ${f}`);
  const us = REGIONS.get(`us ${f}`);
  if (ca && us) return country === "US" ? us : ca;
  return ca ?? us ?? null;
}

export function resolveCountry(value: string): GtmCountry | null {
  const f = fold(value);
  if (["canada", "ca", "can"].includes(f)) return "Canada";
  if (["us", "usa", "u s", "u s a", "united states", "united states of america", "america"].includes(f)) return "US";
  return null;
}

/* -------------------------------------------------------------- Checks */

/** The text organizations match on: case, accents, punctuation and company suffixes don't count. */
export function normalizeName(value: string): string {
  return fold(value.replace(/&/g, " and "))
    .replace(/\b(inc|incorporated|ltd|limited|llc|llp|corp|corporation|co|company|the|pc|pllc)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The line's duplicate key: its organization (or person + organization), normalized. Empty when the parts are missing. */
export function dedupeKey(table: GtmTable, data: Record<string, string>): string | null {
  const parts = table.match.keys.map((k) => normalizeName(data[k] ?? ""));
  return parts.every(Boolean) ? parts.join(" | ") : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export type RowCheck = {
  /** The line as it would be saved: trimmed, options matched, websites made full URLs, country filled in. */
  data: Record<string, string>;
  /** Reasons the line can't be imported. */
  errors: string[];
  /** Things to look at that don't stop it. */
  warnings: string[];
  key: string | null;
};

const MAX_CELL = 4000;

/** Cleans one line for a table and says what's wrong with it. The page's preview and the server use the same check. */
export function checkRow(table: GtmTable, raw: Record<string, unknown>): RowCheck {
  const data: Record<string, string> = {};
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const column of table.columns) {
    const value = raw[column.key];
    if (value === undefined || value === null) continue;
    let text = String(value).trim().slice(0, MAX_CELL);
    if (!text) continue;
    if (column.options) {
      const match = column.options.find((o) => fold(o) === fold(text));
      if (match) text = match;
      else if (column.key !== "country") warnings.push(`${column.label}: "${text}" isn't one of ${column.options.join(", ")}.`);
    }
    if (column.url) {
      const url = normalizeUrl(text);
      if (url === null) warnings.push(`${column.label}: "${text}" isn't a web address.`);
      else text = url;
    }
    if (column.email && !EMAIL_RE.test(text)) warnings.push(`${column.label}: "${text}" isn't an email address.`);
    data[column.key] = text;
  }

  // Country: from the line, else the table's; a province or state from the other country is a mismatch.
  const hasCountry = table.columns.some((c) => c.key === "country");
  if (hasCountry) {
    let country: GtmCountry | null = null;
    if (data.country) {
      country = resolveCountry(data.country);
      if (!country) errors.push(`Country: "${data.country}" isn't Canada or US.`);
      else data.country = country;
    }
    if (table.country) {
      if (country && country !== table.country) errors.push(`Country is ${country}, but this is the ${table.title} table.`);
      if (!data.country) data.country = table.country;
      country = country ?? table.country;
    }
    if (data.province_state) {
      const region = resolveRegion(data.province_state, country ?? undefined);
      if (!region) warnings.push(`Province / state: "${data.province_state}" isn't a Canadian province or US state.`);
      else {
        if (table.country && region.country !== table.country) {
          errors.push(`${region.name} is in ${region.country === "US" ? "the US" : "Canada"}, but this is the ${table.title} table.`);
        } else if (country && region.country !== country) {
          errors.push(`${region.name} is in ${region.country === "US" ? "the US" : "Canada"}, but the country is ${country}.`);
        }
        if (!data.country && !errors.length) data.country = region.country;
      }
    }
  }

  for (const key of table.required) {
    if (!data[key]) errors.push(`Missing ${table.columns.find((c) => c.key === key)?.label ?? key}.`);
  }
  // Missing fields worth flagging without stopping the line.
  if (table.columns.some((c) => c.key === "city") && !data.city) warnings.push("Missing City.");
  if (table.columns.some((c) => c.key === "province_state") && !data.province_state) warnings.push("Missing Province / state.");
  if (table.columns.some((c) => c.key === "website") && !data.website) warnings.push("Missing Website.");

  return { data, errors, warnings, key: dedupeKey(table, data) };
}

/* -------------------------------------------------------------- Import mapping */

/** The column an import header maps to: by key, label or alias, ignoring case and punctuation. */
export function guessColumn(table: GtmTable, header: string): string | null {
  const h = fold(header);
  if (!h) return null;
  for (const c of table.columns) if (fold(c.key) === h || fold(c.label) === h) return c.key;
  for (const c of table.columns) if (c.aliases?.some((a) => fold(a) === h)) return c.key;
  return null;
}
