import type {
  DoeDtcAccountabilityPactView,
  DoeDtcArtifactEntryRow,
  DoeDtcArtifactRow,
  DoeDtcFamilyRelationship,
  DoeDtcGuideRow,
  DoeDtcHouseholdMemberRow,
  DoeDtcProfileSnapshot,
  DoeDtcTicketKind,
} from "@/lib/doedtc/doedtc-types";

const USER_ID = "preview-user";
const HOUSEHOLD_ID = "preview-household";
const ADMIN_MEMBER_ID = "preview-member-admin";
const SIMON_MEMBER_ID = "preview-member-simon";
const CLARISSA_MEMBER_ID = "preview-member-clarissa";
const MARK_MEMBER_ID = "preview-member-mark";
const WEIGHT_ARTIFACT_ID = "preview-artifact-weight";
const SHOTS_ARTIFACT_ID = "preview-artifact-shots";
const PUFF_ARTIFACT_ID = "preview-artifact-puff";
const APPOINTMENT_ID = "preview-appointment-pulm";
const LISTEN_ID = "preview-listen-pulm";
const GUIDE_ID = "preview-guide-ozempic";
const PACT_ID = "preview-pact-inhaler";
const WORKFLOW_ID = "preview-workflow-bath";

function iso(daysAgo: number, hour = 14): string {
  const date = new Date(Date.UTC(2026, 7, 30, hour, 0, 0));
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString();
}

function householdMember(params: {
  id: string;
  fullName: string;
  relationship: DoeDtcFamilyRelationship;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: DoeDtcHouseholdMemberRow["gender"];
  role: "admin" | "member";
  status: "pending" | "active";
  userId?: string | null;
  medications?: string[];
  conditions?: string[];
}): DoeDtcHouseholdMemberRow {
  return {
    id: params.id,
    household_id: HOUSEHOLD_ID,
    user_id: params.userId ?? null,
    full_name: params.fullName,
    relationship: params.relationship,
    phone: params.phone ?? null,
    date_of_birth: params.dateOfBirth ?? null,
    gender: params.gender ?? null,
    role: params.role,
    status: params.status,
    medications: params.medications ?? [],
    conditions: params.conditions ?? [],
    created_at: iso(40),
    updated_at: iso(2),
  };
}

const weightArtifact: DoeDtcArtifactRow = {
  id: WEIGHT_ARTIFACT_ID,
  user_id: USER_ID,
  slug: "weight-tracker",
  title: "Weight Tracker",
  kind: "log",
  layout: "series",
  blocks: [
    { id: "hero-1", kind: "hero", title: "Weight Tracker" },
    { id: "stats-1", kind: "stats", title: "Summary", fieldKey: "weight", fieldLabel: "Weight (lb)" },
    { id: "chart-1", kind: "chart", title: "Trend", fieldKey: "weight", fieldLabel: "Weight (lb)" },
    { id: "goal-1", kind: "goal", title: "Goal" },
    { id: "form-1", kind: "form", title: "Log" },
    { id: "log-1", kind: "log", title: "History" },
  ],
  goal: 175,
  share_token: "preview-share-weight",
  shared_at: iso(6),
  config: {
    fields: [
      { key: "weight", label: "Weight (lb)", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ],
  },
  archived_at: null,
  created_at: iso(28),
  updated_at: iso(1),
};

const shotsArtifact: DoeDtcArtifactRow = {
  id: SHOTS_ARTIFACT_ID,
  user_id: USER_ID,
  slug: "ozempic-shots",
  title: "Ozempic shots",
  kind: "log",
  layout: "log",
  blocks: [
    { id: "hero-1", kind: "hero", title: "Ozempic shots" },
    { id: "illus-1", kind: "illustration", preset: "shot" },
    { id: "form-1", kind: "form", title: "Log" },
    { id: "log-1", kind: "log", title: "History" },
    {
      id: "callout-1",
      kind: "callout",
      tone: "tip",
      body: "Rotate sites each week so the same spot does not get sore.",
    },
  ],
  goal: null,
  share_token: null,
  shared_at: null,
  config: {
    fields: [
      { key: "dose", label: "Dose", type: "select", options: ["0.25 mg", "0.5 mg", "1 mg", "2 mg"] },
      { key: "site", label: "Site", type: "select", options: ["abdomen", "thigh", "arm"] },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ],
  },
  archived_at: null,
  created_at: iso(21),
  updated_at: iso(3),
};

const weightEntries: DoeDtcArtifactEntryRow[] = [21, 14, 10, 7, 3, 0].map((daysAgo, index) => ({
  id: `preview-weight-entry-${index + 1}`,
  artifact_id: WEIGHT_ARTIFACT_ID,
  user_id: USER_ID,
  occurred_at: iso(daysAgo, 8),
  values: { weight: 192 - index * 1.4, notes: index === 0 ? "Starting week" : "" },
  created_at: iso(daysAgo, 8),
  updated_at: iso(daysAgo, 8),
}));

const puffArtifact: DoeDtcArtifactRow = {
  id: PUFF_ARTIFACT_ID,
  user_id: USER_ID,
  slug: "puff-count",
  title: "HOW MANY TIMES I PUFF PER DAY",
  kind: "counter",
  layout: "counter",
  blocks: [],
  goal: 10,
  share_token: null,
  shared_at: null,
  config: {
    fields: [
      { key: "times", label: "Times", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ],
  },
  archived_at: null,
  created_at: iso(4),
  updated_at: iso(0),
};

const puffEntries: DoeDtcArtifactEntryRow[] = [6, 5, 4, 3, 1, 0].map((daysAgo, index) => ({
  id: `preview-puff-entry-${index + 1}`,
  artifact_id: PUFF_ARTIFACT_ID,
  user_id: USER_ID,
  occurred_at: iso(daysAgo, 19),
  values: { times: [8, 11, 6, 9, 4, 7][index] ?? 0 },
  created_at: iso(daysAgo, 19),
  updated_at: iso(daysAgo, 19),
}));

const shotEntries: DoeDtcArtifactEntryRow[] = [21, 14, 7, 0].map((daysAgo, index) => ({
  id: `preview-shot-entry-${index + 1}`,
  artifact_id: SHOTS_ARTIFACT_ID,
  user_id: USER_ID,
  occurred_at: iso(daysAgo, 20),
  values: {
    dose: index < 2 ? "0.5 mg" : "1 mg",
    site: (["abdomen", "thigh", "arm", "abdomen"] as const)[index],
    notes: index === 3 ? "Felt a little queasy after" : "",
  },
  created_at: iso(daysAgo, 20),
  updated_at: iso(daysAgo, 20),
}));

const ozempicGuide: DoeDtcGuideRow = {
  id: GUIDE_ID,
  user_id: USER_ID,
  title: "Take Ozempic",
  topic: "",
  layout: "howto",
  blocks: [
    {
      id: "hero",
      kind: "hero",
      title: "Take Ozempic",
      body: "Weekly shot, same day each week. Fridge until you need it.",
    },
    {
      id: "steps",
      kind: "steps",
      title: "The shot",
      steps: [
        { title: "Take the pen out", body: "Leave it on the counter for 15 minutes.", duration: "15 min" },
        { title: "Pick a site", body: "Abdomen, thigh, or upper arm. Stay two inches from the last spot." },
        { title: "Inject", body: "Hold the button down until the dose counter hits 0." },
      ],
    },
    {
      id: "sites",
      kind: "site_map",
      title: "Rotate these sites",
      sites: ["abdomen", "thigh", "arm"],
    },
    {
      id: "do-dont",
      kind: "do_dont",
      title: "Keep in mind",
      dos: ["Same weekday each week", "New needle every time"],
      donts: ["Do not freeze the pen", "Do not share pens"],
    },
    {
      id: "tip",
      kind: "callout",
      tone: "tip",
      body: "If you miss a dose and it has been less than 5 days, take it when you remember.",
    },
  ],
  saved_at: iso(12),
  archived_at: null,
  created_at: iso(12),
  updated_at: iso(12),
};

const inhalerGuide: DoeDtcGuideRow = {
  id: "preview-guide-inhaler",
  user_id: USER_ID,
  title: "Use your inhaler",
  topic: "",
  layout: "howto",
  blocks: [
    {
      id: "hero",
      kind: "hero",
      title: "Use your inhaler",
      body: "Morning and night. Shake, breathe out, then a slow pull in.",
    },
    {
      id: "steps",
      kind: "steps",
      title: "The puff",
      steps: [
        { title: "Shake the inhaler", body: "Four or five shakes with the cap off." },
        { title: "Breathe out", body: "Empty your lungs away from the mouthpiece." },
        { title: "Inhale and hold", body: "Press as you breathe in slowly. Hold for ten seconds." },
      ],
    },
    {
      id: "tip",
      kind: "callout",
      tone: "tip",
      body: "If two puffs are prescribed, wait a minute between them.",
    },
  ],
  saved_at: iso(6),
  archived_at: null,
  created_at: iso(6),
  updated_at: iso(6),
};

const pulmGuide: DoeDtcGuideRow = {
  id: "preview-guide-pulm",
  user_id: USER_ID,
  title: "Prep for pulmonology",
  topic: "Appointments",
  layout: "checklist",
  blocks: [
    {
      id: "hero",
      kind: "hero",
      title: "Prep for pulmonology",
      body: "Bring the last two peak-flow readings and your inhaler.",
    },
    {
      id: "list",
      kind: "checklist",
      title: "Pack",
      items: ["Peak-flow log", "Inhaler and spacer", "Medication list", "Questions for the visit"],
    },
    {
      id: "timeline",
      kind: "timeline",
      title: "Day of",
      entries: [
        { label: "Morning", detail: "Take your usual inhaler. Skip extra puffs unless you need them." },
        { label: "At the clinic", detail: "Mention nighttime wheeze after runs." },
      ],
    },
  ],
  saved_at: iso(3),
  archived_at: null,
  created_at: iso(3),
  updated_at: iso(3),
};

const inhalerPact: DoeDtcAccountabilityPactView = {
  pact: {
    id: PACT_ID,
    owner_user_id: USER_ID,
    subject_user_id: USER_ID,
    subject_member_id: ADMIN_MEMBER_ID,
    title: "Morning inhaler",
    goal: "Take the inhaler before leaving the house.",
    status: "active",
    mechanics: {
      cadence: "daily",
      timezone: "America/New_York",
      check_in_hour: 8,
      who_gets_check_in: "subject",
      confirmation: "self",
      miss_notify_partner: false,
      privacy: "normal",
    },
    message_pack: {
      partner_invite: "",
      check_in: "Did you take your inhaler this morning?",
      check_in_variants: [],
      miss: "Missed this morning. Want a later ping?",
      celebrate: "Nice streak.",
      withdraw: "Stopping inhaler check-ins.",
    },
    next_check_in_at: iso(-1, 8),
    last_check_in_prompt_at: iso(0, 8),
    withdrawn_at: null,
    withdrawn_reason: null,
    created_at: iso(18),
    updated_at: iso(0),
  },
  participants: [
    {
      id: "preview-pact-owner",
      pact_id: PACT_ID,
      user_id: USER_ID,
      household_member_id: ADMIN_MEMBER_ID,
      phone: "+16473885064",
      full_name: "James Lisondra",
      role: "owner",
      status: "active",
      created_at: iso(18),
      updated_at: iso(18),
    },
    {
      id: "preview-pact-subject",
      pact_id: PACT_ID,
      user_id: USER_ID,
      household_member_id: ADMIN_MEMBER_ID,
      phone: "+16473885064",
      full_name: "James Lisondra",
      role: "subject",
      status: "active",
      created_at: iso(18),
      updated_at: iso(18),
    },
  ],
  events: [
    {
      id: "preview-pact-event-1",
      pact_id: PACT_ID,
      actor_user_id: USER_ID,
      kind: "check_in",
      outcome: "yes",
      body: "Taken",
      occurred_at: iso(0, 8),
      created_at: iso(0, 8),
    },
  ],
  streak: 11,
  lastEvent: {
    id: "preview-pact-event-1",
    pact_id: PACT_ID,
    actor_user_id: USER_ID,
    kind: "check_in",
    outcome: "yes",
    body: "Taken",
    occurred_at: iso(0, 8),
    created_at: iso(0, 8),
  },
  subjectName: "James Lisondra",
  viewerRole: "owner",
  isOwner: true,
};

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

export function createDoeDtcPreviewSnapshot(): DoeDtcProfileSnapshot {
  const members = [
    householdMember({
      id: ADMIN_MEMBER_ID,
      fullName: "James Lisondra",
      relationship: "other",
      phone: "+16473885064",
      dateOfBirth: "1994-03-12",
      gender: "male",
      role: "admin",
      status: "active",
      userId: USER_ID,
    }),
    householdMember({
      id: SIMON_MEMBER_ID,
      fullName: "Simon",
      relationship: "child",
      phone: "7838584858",
      dateOfBirth: "1979-08-30",
      gender: "male",
      role: "member",
      status: "pending",
      medications: ["Ventolin"],
      conditions: ["Asthma"],
    }),
    householdMember({
      id: CLARISSA_MEMBER_ID,
      fullName: "Clarissa",
      relationship: "child",
      dateOfBirth: "2007-08-30",
      gender: "female",
      role: "member",
      status: "pending",
      medications: ["Sertraline"],
      conditions: [],
    }),
    householdMember({
      id: MARK_MEMBER_ID,
      fullName: "Mark",
      relationship: "child",
      dateOfBirth: "2021-08-30",
      gender: "male",
      role: "member",
      status: "pending",
    }),
  ];

  return {
    user: {
      id: USER_ID,
      full_name: "James Lisondra",
      email: "james@doe.care",
      phone: "+16473885064",
      why_doe: "Asthma follow ups",
      gender: "male",
      country: "CA",
      date_of_birth: "1994-03-12",
      medical_deferred: false,
      care_token: "preview",
    },
    medications: ["Ozempic", "Atorvastatin", "Ventolin"],
    conditions: ["Asthma", "Heart failure", "Hypertension"],
    familyMembers: members.map((member) => ({
      id: member.id,
      user_id: USER_ID,
      full_name: member.full_name,
      relationship: member.relationship,
      phone: member.phone,
      created_at: member.created_at,
    })),
    appointments: [
      {
        id: APPOINTMENT_ID,
        user_id: USER_ID,
        title: "Pulmonology follow-up",
        starts_at: "2026-09-12T14:30:00.000Z",
        timing_note: null,
        location: "Toronto Western, 4th floor",
        notes: "Bring the last two peak-flow readings.",
        created_at: iso(9),
      },
      {
        id: "preview-appointment-cardio",
        user_id: USER_ID,
        title: "Cardiology check-in",
        starts_at: "2026-10-03T16:00:00.000Z",
        timing_note: null,
        location: "Mount Sinai",
        notes: "Review lipids after Atorvastatin.",
        created_at: iso(4),
      },
      {
        id: "preview-appointment-spiro",
        user_id: USER_ID,
        title: "Spirometry",
        starts_at: "2026-08-18T13:00:00.000Z",
        timing_note: null,
        location: "Toronto Western",
        notes: "Baseline lung function.",
        created_at: iso(14),
      },
    ],
    listenSessions: [
      {
        id: LISTEN_ID,
        user_id: USER_ID,
        appointment_id: APPOINTMENT_ID,
        status: "completed",
        transcript:
          "Doctor: Any nighttime wheeze this month?\nJames: A few nights after running.\nDoctor: Let's keep the inhaler morning and night, and I'll see you in six weeks.",
        summary: "Nighttime wheeze after runs. Keep twice-daily inhaler. Recheck in six weeks.",
        duration_seconds: 742,
        completed_at: iso(16, 15),
        created_at: iso(16, 15),
      },
    ],
    results: [
      {
        id: "preview-result-cbc",
        user_id: USER_ID,
        title: "CBC",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "Hb 142 · WBC 6.1 · Plt 248",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-hba1c",
        user_id: USER_ID,
        title: "HbA1c",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "7.8 % · <6.5",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-glucose",
        user_id: USER_ID,
        title: "Glucose",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "5.2 mmol/L · 3.6–6.0",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-tsh",
        user_id: USER_ID,
        title: "TSH",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "6.8 mIU/L · 0.4–4.0",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-egfr",
        user_id: USER_ID,
        title: "eGFR",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "48 mL/min · ≥60",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-creatinine",
        user_id: USER_ID,
        title: "Creatinine",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "92 umol/L · 60–110",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-bun",
        user_id: USER_ID,
        title: "BUN",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "5.1 mmol/L · 2.5–8.0",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-alt",
        user_id: USER_ID,
        title: "ALT",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "78 U/L · <50",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-ast",
        user_id: USER_ID,
        title: "AST",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "24 U/L · <40",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-alp",
        user_id: USER_ID,
        title: "ALP",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "62 U/L · 40–129",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-bili",
        user_id: USER_ID,
        title: "Bilirubin",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "12 umol/L · <20",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-lipid",
        user_id: USER_ID,
        title: "Lipid panel",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "LDL 2.4 · HDL 1.3 · Trig 1.1",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-crp",
        user_id: USER_ID,
        title: "CRP",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "1.2 mg/L · <5",
        created_at: iso(22),
        kind: "lab",
      },
      {
        id: "preview-result-cxr",
        user_id: USER_ID,
        title: "Chest X-ray",
        resulted_at: "2026-08-22",
        source: "Toronto Western",
        summary: "Lungs clear. No focal consolidation. Heart size normal.",
        created_at: iso(9),
        kind: "imaging",
      },
      {
        id: "preview-result-spiro",
        user_id: USER_ID,
        title: "Spirometry",
        resulted_at: "2026-08-18",
        source: "Toronto Western",
        summary: "FEV1 78% predicted. Mild obstruction, improved from last visit.",
        created_at: iso(12),
        kind: "imaging",
      },
      {
        id: "preview-result-sputum",
        user_id: USER_ID,
        title: "Sputum culture",
        resulted_at: "2026-08-11",
        source: "LifeLabs",
        summary: "No growth after 48 hours.",
        created_at: iso(20),
        kind: "micro",
      },
      {
        id: "preview-result-urine",
        user_id: USER_ID,
        title: "Urine culture",
        resulted_at: "2026-07-02",
        source: "LifeLabs",
        summary: "Mixed flora. No dominant pathogen.",
        created_at: iso(60),
        kind: "micro",
      },
    ],
    lockerItems: [
      {
        id: "preview-locker-mychart",
        user_id: USER_ID,
        label: "MyChart",
        username: "james.lisondra",
        created_at: iso(20),
      },
    ],
    healthConnections: [
      {
        id: "preview-whoop",
        user_id: USER_ID,
        provider: "whoop",
        status: "connected",
        created_at: iso(30),
        updated_at: iso(2),
      },
      {
        id: "preview-apple-health",
        user_id: USER_ID,
        provider: "apple_health",
        status: "pending",
        created_at: iso(5),
        updated_at: iso(5),
      },
    ],
    shareCodes: [
      {
        id: "preview-share-code",
        user_id: USER_ID,
        code: "DOE-8K2F4",
        expires_at: iso(-14),
        revoked_at: null,
        created_at: iso(3),
      },
    ],
    symptoms: [
      {
        id: "preview-symptom-throat",
        user_id: USER_ID,
        reported_at: iso(0, 16),
        raw_text: "I have a sore throat",
        summary: "Sore throat",
        severity: "mild",
        onset: "this morning",
        tags: ["throat"],
        assessment_id: "preview-assessment-1",
        created_at: iso(0, 16),
      },
      {
        id: "preview-symptom-wheeze",
        user_id: USER_ID,
        reported_at: iso(5, 21),
        raw_text: "Wheezy after a run",
        summary: "Post-run wheeze",
        severity: "moderate",
        onset: "after exercise",
        tags: ["asthma"],
        assessment_id: null,
        created_at: iso(5, 21),
      },
      {
        id: "preview-symptom-swelling",
        user_id: USER_ID,
        reported_at: iso(8, 9),
        raw_text: "Ankles a bit puffy at night",
        summary: "Ankle swelling",
        severity: "mild",
        onset: "evenings",
        tags: ["heart failure"],
        assessment_id: null,
        created_at: iso(8, 9),
      },
    ],
    assessments: [
      {
        id: "preview-assessment-1",
        user_id: USER_ID,
        symptoms_text: "I have a sore throat",
        result: {
          presentingSymptoms: "Sore throat",
          summary: "Likely a mild viral sore throat. Watch for fever or trouble swallowing.",
          findings: [
            {
              name: "Viral pharyngitis",
              why: "Sudden sore throat without high fever.",
              evidence: ["Sore throat this morning"],
              likelihood: "high",
            },
          ],
          cantMiss: ["Trouble breathing", "Drooling", "High fever"],
          urgency: "Home care unless it worsens.",
          disclaimer: "This is not a diagnosis.",
        },
        created_at: iso(0, 16),
      },
    ],
    artifacts: [weightArtifact, puffArtifact, shotsArtifact],
    artifactEntries: [...weightEntries, ...puffEntries, ...shotEntries],
    tickets: [
      {
        id: "preview-ticket-nav",
        user_id: USER_ID,
        kind: "bug",
        title: "Settings sheet covers the wordmark",
        body: "On iPhone the settings overlay sits over Doe in the top left.",
        status: "open",
        created_at: iso(2),
        updated_at: iso(2),
      },
      {
        id: "preview-ticket-whoop",
        user_id: USER_ID,
        kind: "feedback",
        title: "Show recovery on the dashboard",
        body: "Would like Whoop recovery next to the trackers.",
        status: "in_progress",
        created_at: iso(8),
        updated_at: iso(1),
      },
      {
        id: "preview-ticket-listen",
        user_id: USER_ID,
        kind: "bug",
        title: "Listen link sent too often",
        body: "Doe sent a Listen link after a vague I need help text. Should wait for a real appointment.",
        status: "resolved",
        created_at: iso(18),
        updated_at: iso(4),
      },
      {
        id: "preview-ticket-dark",
        user_id: USER_ID,
        kind: "feedback",
        title: "Dark mode for late-night check-ins",
        body: "The cream screen is bright at 1am when logging a symptom.",
        status: "open",
        created_at: iso(12),
        updated_at: iso(12),
      },
    ],
    household: {
      household: {
        id: HOUSEHOLD_ID,
        admin_user_id: USER_ID,
        created_at: iso(40),
        updated_at: iso(2),
      },
      members,
      consents: [],
      memberAccess: members.map((member) => ({
        memberId: member.id,
        userId: member.user_id,
        canView: member.user_id === USER_ID,
        canEdit: member.user_id === USER_ID,
      })),
      isAdmin: true,
      viewerMemberId: ADMIN_MEMBER_ID,
      viewerConsent: null,
      viewerMember: members[0] ?? null,
    },
    accountabilityPacts: [inhalerPact],
    scheduledTexts: [
      {
        id: "preview-scheduled-ozempic",
        created_by_user_id: USER_ID,
        recipient_user_id: USER_ID,
        recipient_member_id: ADMIN_MEMBER_ID,
        recipient_phone: "+16473885064",
        send_at: iso(-2, 20),
        timezone: "America/New_York",
        intent: "Ozempic reminder",
        body: "Time for your Ozempic shot.",
        status: "pending",
        sent_at: null,
        error: null,
        created_at: iso(6),
        updated_at: iso(6),
      },
    ],
    workflows: [
      {
        id: WORKFLOW_ID,
        owner_user_id: USER_ID,
        subject_member_id: SIMON_MEMBER_ID,
        goal: "Make sure Simon takes a bath",
        config: {
          cadence: "daily",
          timezone: "America/New_York",
          check_in_hour: 19,
          check_in_body: "Did Simon take a bath?",
          subject_phone: "7838584858",
          subject_user_id: null,
          subject_name: "Simon",
          notify_phone: "+16473885064",
          notify_user_id: USER_ID,
          notify_name: "James Lisondra",
          await_timeout_minutes: 60,
        },
        status: "active",
        phase: "scheduled",
        next_run_at: iso(-1, 19),
        awaiting_from_phone: null,
        awaiting_until: null,
        correlation_id: null,
        created_at: iso(11),
        updated_at: iso(1),
      },
    ],
    guides: [pulmGuide, inhalerGuide, ozempicGuide],
  };
}

export function applyDoeDtcPreviewAction(
  snapshot: DoeDtcProfileSnapshot,
  action: string,
  payload: Record<string, unknown>,
): DoeDtcProfileSnapshot {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const title = typeof payload.title === "string" ? payload.title.trim() : "";

  switch (action) {
    case "add_medication":
      return name && !snapshot.medications.includes(name)
        ? { ...snapshot, medications: [...snapshot.medications, name] }
        : snapshot;
    case "remove_medication":
      return { ...snapshot, medications: snapshot.medications.filter((value) => value !== name) };
    case "add_condition":
      return name && !snapshot.conditions.includes(name)
        ? { ...snapshot, conditions: [...snapshot.conditions, name] }
        : snapshot;
    case "remove_condition":
      return { ...snapshot, conditions: snapshot.conditions.filter((value) => value !== name) };
    case "update_profile": {
      const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : "";
      const email = typeof payload.email === "string" ? payload.email.trim() : snapshot.user.email;
      const dateOfBirth =
        typeof payload.dateOfBirth === "string" ? payload.dateOfBirth.trim() : snapshot.user.date_of_birth;
      const gender =
        payload.gender === "female" ||
        payload.gender === "male" ||
        payload.gender === "nonbinary" ||
        payload.gender === "prefer_not"
          ? payload.gender
          : snapshot.user.gender;
      const country = typeof payload.country === "string" ? payload.country.trim().toUpperCase() : snapshot.user.country;
      const whyDoe = typeof payload.whyDoe === "string" ? payload.whyDoe.trim() : snapshot.user.why_doe;
      if (!fullName) return snapshot;
      return {
        ...snapshot,
        user: {
          ...snapshot.user,
          full_name: fullName,
          email: email || null,
          date_of_birth: dateOfBirth || null,
          gender,
          country: country || null,
          why_doe: whyDoe || null,
        },
        household: {
          ...snapshot.household,
          members: snapshot.household.members.map((member) =>
            member.role === "admin"
              ? {
                  ...member,
                  full_name: fullName,
                  date_of_birth: dateOfBirth || null,
                  gender,
                }
              : member,
          ),
        },
      };
    }
    case "add_appointment":
      return title
        ? {
            ...snapshot,
            appointments: [
              ...snapshot.appointments,
              {
                id: createId("preview-appointment"),
                user_id: USER_ID,
                title,
                starts_at: typeof payload.startsAt === "string" ? payload.startsAt : null,
                timing_note: null,
                location: typeof payload.location === "string" ? payload.location : null,
                notes: typeof payload.notes === "string" ? payload.notes : null,
                created_at: new Date().toISOString(),
              },
            ],
          }
        : snapshot;
    case "remove_appointment":
      return {
        ...snapshot,
        appointments: snapshot.appointments.filter((row) => row.id !== payload.appointmentId),
      };
    case "add_result":
      return title
        ? {
            ...snapshot,
            results: [
              ...snapshot.results,
              {
                id: createId("preview-result"),
                user_id: USER_ID,
                title,
                resulted_at: typeof payload.resultedAt === "string" ? payload.resultedAt : iso(0),
                source: typeof payload.source === "string" ? payload.source : null,
                summary: typeof payload.summary === "string" ? payload.summary : null,
                created_at: new Date().toISOString(),
                kind:
                  payload.kind === "lab" || payload.kind === "imaging" || payload.kind === "micro"
                    ? payload.kind
                    : undefined,
              },
            ],
          }
        : snapshot;
    case "remove_result":
      return { ...snapshot, results: snapshot.results.filter((row) => row.id !== payload.resultId) };
    case "add_family": {
      const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : "";
      const relationship = payload.relationship as DoeDtcFamilyRelationship;
      if (!fullName) return snapshot;
      const member = householdMember({
        id: createId("preview-member"),
        fullName,
        relationship: relationship || "other",
        phone: typeof payload.phone === "string" ? payload.phone : null,
        dateOfBirth: typeof payload.dateOfBirth === "string" ? payload.dateOfBirth : null,
        gender:
          payload.gender === "female" ||
          payload.gender === "male" ||
          payload.gender === "nonbinary" ||
          payload.gender === "prefer_not"
            ? payload.gender
            : null,
        medications: Array.isArray(payload.medications)
          ? payload.medications.map((item) => String(item ?? "").trim()).filter(Boolean)
          : [],
        conditions: Array.isArray(payload.conditions)
          ? payload.conditions.map((item) => String(item ?? "").trim()).filter(Boolean)
          : [],
        role: "member",
        status: "pending",
      });
      return {
        ...snapshot,
        household: {
          ...snapshot.household,
          members: [...snapshot.household.members, member],
          memberAccess: [
            ...snapshot.household.memberAccess,
            { memberId: member.id, userId: null, canView: false, canEdit: false },
          ],
        },
      };
    }
    case "remove_family":
      return {
        ...snapshot,
        household: {
          ...snapshot.household,
          members: snapshot.household.members.filter((row) => row.id !== payload.householdMemberId),
        },
      };
    case "add_locker":
      return typeof payload.label === "string"
        ? {
            ...snapshot,
            lockerItems: [
              ...snapshot.lockerItems,
              {
                id: createId("preview-locker"),
                user_id: USER_ID,
                label: payload.label,
                username: typeof payload.username === "string" ? payload.username : "",
                created_at: new Date().toISOString(),
              },
            ],
          }
        : snapshot;
    case "remove_locker":
      return { ...snapshot, lockerItems: snapshot.lockerItems.filter((row) => row.id !== payload.itemId) };
    case "generate_share":
      return {
        ...snapshot,
        shareCodes: [
          {
            id: createId("preview-share"),
            user_id: USER_ID,
            code: `DOE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
            expires_at: iso(-14),
            revoked_at: null,
            created_at: new Date().toISOString(),
          },
          ...snapshot.shareCodes,
        ],
      };
    case "revoke_share":
      return {
        ...snapshot,
        shareCodes: snapshot.shareCodes.filter((row) => row.id !== payload.shareCodeId),
      };
    case "connect_health": {
      const provider = payload.provider === "apple_health" ? "apple_health" : "whoop";
      return {
        ...snapshot,
        healthConnections: [
          ...snapshot.healthConnections.filter((row) => row.provider !== provider),
          {
            id: createId("preview-health"),
            user_id: USER_ID,
            provider,
            status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      };
    }
    case "cancel_scheduled_text":
      return {
        ...snapshot,
        scheduledTexts: snapshot.scheduledTexts.map((row) =>
          row.id === payload.scheduledTextId ? { ...row, status: "cancelled" } : row,
        ),
      };
    case "submit_ticket":
      return {
        ...snapshot,
        tickets: [
          {
            id: createId("preview-ticket"),
            user_id: USER_ID,
            kind: payload.kind === "bug" ? "bug" : ("feedback" as DoeDtcTicketKind),
            title: title || "New ticket",
            body: typeof payload.body === "string" ? payload.body : "",
            status: "open",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...snapshot.tickets,
        ],
      };
    case "unsave_guide":
    case "archive_guide":
      return { ...snapshot, guides: snapshot.guides.filter((row) => row.id !== payload.guideId) };
    case "archive_artifact":
      return { ...snapshot, artifacts: snapshot.artifacts.filter((row) => row.id !== payload.artifactId) };
    case "pause_accountability":
      return {
        ...snapshot,
        accountabilityPacts: snapshot.accountabilityPacts.map((view) =>
          view.pact.id === payload.pactId
            ? { ...view, pact: { ...view.pact, status: "paused" } }
            : view,
        ),
      };
    case "resume_accountability":
      return {
        ...snapshot,
        accountabilityPacts: snapshot.accountabilityPacts.map((view) =>
          view.pact.id === payload.pactId
            ? { ...view, pact: { ...view.pact, status: "active" } }
            : view,
        ),
      };
    case "withdraw_accountability":
      return {
        ...snapshot,
        accountabilityPacts: snapshot.accountabilityPacts.map((view) =>
          view.pact.id === payload.pactId
            ? { ...view, pact: { ...view.pact, status: "withdrawn" } }
            : view,
        ),
      };
    case "cancel_habit_workflow":
      return {
        ...snapshot,
        workflows: snapshot.workflows.map((row) =>
          row.id === payload.workflowId ? { ...row, status: "cancelled" } : row,
        ),
      };
    default:
      return snapshot;
  }
}
