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
  role: "admin" | "member";
  status: "pending" | "active";
  userId?: string | null;
}): DoeDtcHouseholdMemberRow {
  return {
    id: params.id,
    household_id: HOUSEHOLD_ID,
    user_id: params.userId ?? null,
    full_name: params.fullName,
    relationship: params.relationship,
    phone: params.phone ?? null,
    date_of_birth: params.dateOfBirth ?? null,
    role: params.role,
    status: params.status,
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
  title: "How to take Ozempic",
  topic: "Ozempic injection",
  layout: "howto",
  blocks: [
    {
      id: "hero",
      kind: "hero",
      title: "How to take Ozempic",
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
      role: "member",
      status: "pending",
    }),
    householdMember({
      id: CLARISSA_MEMBER_ID,
      fullName: "Clarissa",
      relationship: "child",
      dateOfBirth: "2007-08-30",
      role: "member",
      status: "pending",
    }),
    householdMember({
      id: MARK_MEMBER_ID,
      fullName: "Mark",
      relationship: "child",
      dateOfBirth: "2021-08-30",
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
      medical_deferred: false,
      care_token: "preview",
    },
    medications: ["Ozempic", "Atorvastatin"],
    conditions: ["Asthma", "Heart failure"],
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
        id: "preview-result-spiro",
        user_id: USER_ID,
        title: "Spirometry",
        resulted_at: "2026-08-18",
        source: "Toronto Western",
        summary: "FEV1 78% predicted. Mild obstruction, improved from last visit.",
        created_at: iso(12),
      },
      {
        id: "preview-result-lipid",
        user_id: USER_ID,
        title: "Lipid panel",
        resulted_at: "2026-08-08",
        source: "LifeLabs",
        summary: "LDL 2.4. Continue Atorvastatin.",
        created_at: iso(22),
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
    artifacts: [weightArtifact, shotsArtifact],
    artifactEntries: [...weightEntries, ...shotEntries],
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
    guides: [ozempicGuide],
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
