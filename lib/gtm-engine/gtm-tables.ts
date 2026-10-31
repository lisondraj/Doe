/**
 * /GTMENGINE's tables. Each one's rows live in `public.gtm_engine_rows` under its `key`, with the columns below kept
 * by `key` in the row's `data`. Every row also has a page (Generate) and an outreach status.
 */

export type GtmColumn = {
  key: string;
  label: string;
  /** Column width in px on the sheet. */
  width: number;
  /** A dropdown of these instead of free text. */
  options?: readonly string[];
};

export type GtmTable = {
  key: GtmTableKey;
  title: string;
  /** A line under the title. */
  note?: string;
  columns: GtmColumn[];
};

export type GtmTableKey = "clinics_us" | "clinics_ca" | "clinics_other" | "multi_site" | "hospital_loi" | "programs" | "services";

export type GtmSection = { title: string; tables: GtmTable[] };

export const GTM_STATUSES = ["Sent", "Generated", "Claimed", "Purchased"] as const;
export type GtmStatus = (typeof GTM_STATUSES)[number];

/** Rows shown per page of a table, filled out with blank lines for an agent to fill. */
export const GTM_PAGE_SIZE = 50;

const CLINIC_COLUMNS: GtmColumn[] = [
  { key: "id_priority_org", label: "ID / priority / organization", width: 240 },
  { key: "market_footprint", label: "Market / footprint", width: 200 },
  { key: "leader_buyer_route", label: "Leader / buyer route", width: 220 },
  { key: "public_contact", label: "Public professional contact", width: 220 },
  { key: "doe_fit", label: "Doe-fit hypothesis", width: 260 },
  { key: "evidence_links", label: "Evidence / source links", width: 240 },
];

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

export const HEALTH_SECTIONS: GtmSection[] = [
  {
    title: "Clinics",
    tables: [
      { key: "clinics_us", title: "United States", columns: CLINIC_COLUMNS },
      { key: "clinics_ca", title: "Canada", columns: CLINIC_COLUMNS },
      { key: "clinics_other", title: "Other", columns: CLINIC_COLUMNS },
      {
        key: "multi_site",
        title: "Multi-site",
        columns: [
          { key: "id_org", label: "ID / organization", width: 240 },
          { key: "table", label: "Table", width: 160 },
          { key: "footprint_tier", label: "Footprint tier (evidence)", width: 260 },
          { key: "website", label: "Website", width: 220 },
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
        columns: [
          { key: "num", label: "#", width: 70 },
          { key: "organization", label: "Organization", width: 220 },
          { key: "name", label: "Name", width: 180 },
          { key: "title", label: "Title", width: 200 },
          { key: "role_type", label: "Role type", width: 160 },
          { key: "role_evidence", label: "Evidence for current role", width: 240 },
          { key: "public_email", label: "Public email", width: 220 },
          { key: "verified_route", label: "What was verified / route (hypothesis flagged)", width: 300 },
          { key: "source", label: "Source", width: 220 },
        ],
      },
      {
        key: "programs",
        title: "Programs",
        columns: [
          { key: "program", label: "Program", width: 220 },
          { key: "region", label: "Region", width: 160 },
          { key: "page_says", label: "What the page says", width: 300 },
          { key: "how_to_reach", label: "How to reach", width: 240 },
          { key: "source", label: "Source", width: 220 },
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
        columns: [
          { key: "id", label: "ID", width: 90 },
          { key: "business", label: "Business", width: 220 },
          { key: "type", label: "Type", width: 210, options: SERVICE_TYPES },
          { key: "city_st", label: "City, ST", width: 160 },
          { key: "phone", label: "Phone", width: 160 },
          { key: "email", label: "Email (published)", width: 220 },
          { key: "booking", label: "Booking observed", width: 200 },
          { key: "team", label: "Team observed", width: 200 },
          { key: "website", label: "Website", width: 220 },
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
  data: Record<string, string>;
  page: string | null;
  status: GtmStatus | null;
};
