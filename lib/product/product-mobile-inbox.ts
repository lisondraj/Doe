export type ProductMobileInboxKind = "Referral" | "Lab" | "Message" | "Admin";

export type ProductMobileInboxAttachment = {
  name: string;
  size: string;
};

export type ProductMobileInboxMessage = {
  id: string;
  from: string;
  time: string;
  email?: string;
  body: string;
  attachments?: readonly ProductMobileInboxAttachment[];
};

export type ProductMobileInboxThread = {
  id: string;
  from: string;
  kind: ProductMobileInboxKind;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: readonly ProductMobileInboxMessage[];
};

export type ProductMobileInboxFilter = "all" | "unread" | "pinned";

export const PRODUCT_MOBILE_INBOX_PINNED_ID = "t1";

/** Agents strip — mirrors desktop /product Inbox chrome. */
export const PRODUCT_MOBILE_INBOX_AGENTS = [
  { name: "Jamie Chen", team: "Northside", swatch: "from-[#8A7B6E] to-[#5C5048]" },
  { name: "R. Okonkwo", team: "Riverside", swatch: "from-[#7D7168] to-[#554C45]" },
  { name: "Ana Lopez", team: "Labs desk", swatch: "from-[#8F8278] to-[#5E564F]" },
  { name: "M. Patel", team: "Front office", swatch: "from-[#867A70] to-[#524A44]" },
] as const;

export const PRODUCT_MOBILE_INBOX_CATEGORIES = ["Labs", "Referrals", "Office", "Patients"] as const;

/** Richer clinic queue threads (aligned with desktop Inbox). */
export const PRODUCT_MOBILE_INBOX_THREADS: readonly ProductMobileInboxThread[] = [
  {
    id: "t1",
    from: "Riverside Cardiology",
    kind: "Referral",
    subject: "Re: J. Ortiz, echo follow-up",
    preview: "We can see him Apr 9 at 2:30. Please attach last lipid panel.",
    time: "8:12 AM",
    unread: true,
    messages: [
      {
        id: "t1-m1",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 28 · 7:41 AM",
        email: "jamie.chen@northside.health",
        body: "Referral for J. Ortiz (DOB 1964), please confirm echo availability and whether you need a lipid panel on file before we send him over. Chart ref 448291.",
        attachments: [
          { name: "referral_ortiz.pdf", size: "128 KB" },
          { name: "insurance_snapshot.jpg", size: "214 KB" },
        ],
      },
      {
        id: "t1-m2",
        from: "Riverside Cardiology",
        time: "Mar 28 · 2:15 PM",
        email: "referrals@riversidecardiology.org",
        body: "Thanks for the referral. We have capacity Tuesday Apr 9 at 2:30 PM.\n\nIf the lipid panel from last week isn’t in the chart, please have them fax to our usual line before the visit.\n\nR. Okonkwo, MD",
        attachments: [
          { name: "scheduling_instructions.pdf", size: "42 KB" },
          { name: "intake_checklist.pdf", size: "56 KB" },
        ],
      },
      {
        id: "t1-m3",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 28 · 4:02 PM",
        email: "jamie.chen@northside.health",
        body: "Acknowledged, we’ll pull lipids from 3/22 and confirm the patient has Apr 9 on their calendar. Will fax if anything is missing.",
      },
      {
        id: "t1-m4",
        from: "Riverside Cardiology",
        time: "Mar 30 · 8:12 AM",
        email: "referrals@riversidecardiology.org",
        body: "Received, we’re all set for Apr 9 at 2:30. Echo orders are in the chart; we’ll see him then.",
        attachments: [{ name: "echo_order_packet.pdf", size: "95 KB" }],
      },
    ],
  },
  {
    id: "t2",
    from: "Pathology, Central Lab",
    kind: "Lab",
    subject: "Hemoglobin A1c resulted",
    preview: "Hgb A1c 6.9% (Mar 28). Flagged per your protocol.",
    time: "Yesterday",
    unread: true,
    messages: [
      {
        id: "t2-m1",
        from: "Lab interface",
        time: "Mar 27 · 4:02 PM",
        body: "Specimen received. Processing expected by end of day.",
      },
      {
        id: "t2-m2",
        from: "Pathology, Central Lab",
        time: "Mar 28 · 9:18 AM",
        body: "Hemoglobin A1c: 6.9% (Mar 28, 2026). Result auto-released to chart per protocol.",
        attachments: [{ name: "A1c_result.pdf", size: "64 KB" }],
      },
      {
        id: "t2-m3",
        from: "Clinical staff",
        time: "Mar 28 · 10:05 AM",
        body: "Flag reviewed, consider counseling if ADA targets not documented this quarter.",
      },
    ],
  },
  {
    id: "t3",
    from: "M. Nguyen",
    kind: "Message",
    subject: "Question about metformin dose",
    preview: "I started the new strength yesterday and feel a bit nauseous.",
    time: "Yesterday",
    unread: false,
    messages: [
      {
        id: "t3-m1",
        from: "M. Nguyen",
        time: "Mar 29 · 6:12 PM",
        body: "I picked up the 1000 mg tablets instead of 500 mg. Is that OK?",
      },
      {
        id: "t3-m2",
        from: "Nurse triage",
        time: "Mar 29 · 6:45 PM",
        body: "Thanks for the note, a clinician will review and reply during business hours.",
      },
      {
        id: "t3-m3",
        from: "M. Nguyen",
        time: "Mar 30 · 8:30 AM",
        body: "I started the new strength yesterday and feel a bit nauseous with breakfast. Should I split the dose or take it with dinner?",
      },
    ],
  },
  {
    id: "t4",
    from: "PriorAuth, Central",
    kind: "Admin",
    subject: "Humira, documentation requested",
    preview: "Carrier needs progress notes from last visit.",
    time: "Mar 27",
    unread: false,
    messages: [
      {
        id: "t4-m1",
        from: "PriorAuth, Central",
        time: "Mar 26 · 11:20 AM",
        body: "Prior authorization submitted, carrier review in progress.",
      },
      {
        id: "t4-m2",
        from: "PriorAuth, Central",
        time: "Mar 27 · 8:03 AM",
        body: "Documentation requested: progress notes from visit on Mar 12.",
      },
      {
        id: "t4-m3",
        from: "Clinical staff",
        time: "Mar 27 · 2:40 PM",
        body: "Notes uploaded to case PA-88421. Awaiting carrier response.",
      },
    ],
  },
  {
    id: "t5",
    from: "Dermatology, South",
    kind: "Referral",
    subject: "Biopsy scheduled",
    preview: "Lesion shave scheduled Apr 4. Path to follow.",
    time: "Mar 26",
    unread: false,
    messages: [
      {
        id: "t5-m1",
        from: "Dermatology, South",
        time: "Mar 25 · 3:10 PM",
        body: "Referral accepted. Scheduling will reach out with biopsy options.",
      },
      {
        id: "t5-m2",
        from: "Dermatology, South",
        time: "Mar 26 · 9:00 AM",
        body: "Shave biopsy scheduled Apr 4, 10:20 AM. Prep instructions sent to patient.",
      },
    ],
  },
  {
    id: "t6",
    from: "Nursing",
    kind: "Message",
    subject: "BP 168/94 at check-in",
    preview: "K. Patel in room 2. No chest pain. Requests callback.",
    time: "Mar 26",
    unread: true,
    messages: [
      {
        id: "t6-m1",
        from: "Front desk",
        time: "Mar 26 · 10:35 AM",
        body: "K. Patel checked in for 10:40 follow-up.",
      },
      {
        id: "t6-m2",
        from: "Nursing",
        time: "Mar 26 · 10:38 AM",
        body: "BP 168/94 on repeat 162/90. Denies chest pain, headache, vision changes. Requests callback before rooming.",
      },
      {
        id: "t6-m3",
        from: "Provider line",
        time: "Mar 26 · 10:42 AM",
        body: "Callback placed, will see after med reconciliation.",
      },
    ],
  },
] as const;

export function productMobileInboxSenderInitials(from: string): string {
  const parts = from.split(/[\s,]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export function productMobileInboxAvatarTone(seed: string): number {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
}

export function productMobileInboxAttachmentCount(
  thread: ProductMobileInboxThread,
): number {
  return thread.messages.reduce((sum, msg) => sum + (msg.attachments?.length ?? 0), 0);
}

export function productMobileInboxFilterThreads(
  filter: ProductMobileInboxFilter,
): ProductMobileInboxThread[] {
  return PRODUCT_MOBILE_INBOX_THREADS.filter((thread) => {
    if (filter === "unread") return thread.unread;
    if (filter === "pinned") return thread.id === PRODUCT_MOBILE_INBOX_PINNED_ID;
    return true;
  });
}
