export type ProductMobileInboxKind = "Referral" | "Lab" | "Message" | "Admin";

export type ProductMobileInboxCategory = (typeof PRODUCT_MOBILE_INBOX_CATEGORIES)[number];

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
  /** Owning agent queue — matches PRODUCT_MOBILE_INBOX_AGENTS.name */
  agent: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: ProductMobileInboxMessage[];
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

const CATEGORY_KIND: Record<ProductMobileInboxCategory, ProductMobileInboxKind> = {
  Labs: "Lab",
  Referrals: "Referral",
  Office: "Admin",
  Patients: "Message",
};

const KIND_CATEGORY: Record<ProductMobileInboxKind, ProductMobileInboxCategory> = {
  Lab: "Labs",
  Referral: "Referrals",
  Admin: "Office",
  Message: "Patients",
};

/**
 * Seed clinic queue — full column per category (aligned with desktop sample mail).
 * Agent is chrome attribution only; lists filter by category, not agent.
 */
export const PRODUCT_MOBILE_INBOX_THREADS: readonly ProductMobileInboxThread[] = [
  /* —— Referrals —— */
  {
    id: "t1",
    from: "Riverside Cardiology",
    kind: "Referral",
    agent: "Jamie Chen",
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
        from: "R. Okonkwo, MD, Riverside",
        time: "Mar 29 · 9:00 AM",
        email: "r.okonkwo@riversidecardiology.org",
        body: "Thanks for the update. If the patient’s LDL is still above goal on your panel, we’ll re-check in clinic before adjusting meds.",
        attachments: [{ name: "ldl_targets.pdf", size: "88 KB" }],
      },
      {
        id: "t1-m5",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 29 · 11:30 AM",
        email: "jamie.chen@northside.health",
        body: "Lipids from 3/22 faxed to your number on file. Patient is aware of the Apr 9 appointment and prep instructions.",
        attachments: [{ name: "lipid_panel_0322.pdf", size: "176 KB" }],
      },
      {
        id: "t1-m6",
        from: "Riverside Cardiology",
        time: "Mar 30 · 8:12 AM",
        email: "referrals@riversidecardiology.org",
        body: "Received, we’re all set for Apr 9 at 2:30. Echo orders are in the chart; we’ll see him then.",
        attachments: [{ name: "echo_order_packet.pdf", size: "95 KB" }],
      },
      {
        id: "t1-m7",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 30 · 10:06 AM",
        email: "jamie.chen@northside.health",
        body: "Great, thank you. Patient asked whether fasting is needed day-of; we advised standard meds unless instructed otherwise.",
      },
      {
        id: "t1-m8",
        from: "Riverside Cardiology",
        time: "Mar 30 · 10:24 AM",
        email: "referrals@riversidecardiology.org",
        body: "No fasting required for the echo itself. We’ll confirm arrival details in our automated reminder tomorrow.",
        attachments: [{ name: "visit_prep_note.pdf", size: "33 KB" }],
      },
    ],
  },
  {
    id: "t5",
    from: "Dermatology, South",
    kind: "Referral",
    agent: "R. Okonkwo",
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
      {
        id: "t5-m3",
        from: "Dermatology, South",
        time: "Mar 26 · 9:15 AM",
        body: "Path results will route to your inbox when finalized.",
      },
    ],
  },
  {
    id: "t7r",
    from: "Radiology, Imaging",
    kind: "Referral",
    agent: "Jamie Chen",
    subject: "MRI lumbar spine, precert",
    preview: "Precert number attached. Patient to call scheduling.",
    time: "Mar 25",
    unread: false,
    messages: [
      { id: "t7r-m1", from: "Radiology", time: "Mar 24 · 2:00 PM", body: "Precert submitted." },
      { id: "t7r-m2", from: "Radiology", time: "Mar 25 · 9:00 AM", body: "Approved, auth #RZ-99281." },
      { id: "t7r-m3", from: "Scheduling", time: "Mar 25 · 11:15 AM", body: "Patient given direct line to book." },
    ],
  },
  {
    id: "t9",
    from: "Endocrinology, North",
    kind: "Referral",
    agent: "R. Okonkwo",
    subject: "Thyroid nodule, FNA coordination",
    preview: "We can slot them Apr 14. Please send ultrasound.",
    time: "Mar 24",
    unread: true,
    messages: [
      { id: "t9-m1", from: "Endocrinology", time: "Mar 23 · 4:30 PM", body: "Referral received." },
      { id: "t9-m2", from: "Endocrinology", time: "Mar 24 · 10:00 AM", body: "Apr 14 available, need ultrasound images." },
      { id: "t9-m3", from: "Staff", time: "Mar 24 · 11:00 AM", body: "Uploading imaging to shared folder." },
    ],
  },
  {
    id: "t11",
    from: "Ophthalmology",
    kind: "Referral",
    agent: "Jamie Chen",
    subject: "Diabetic eye exam, annual",
    preview: "Next opening May 6. Dilated exam required.",
    time: "Mar 23",
    unread: false,
    messages: [
      { id: "t11-m1", from: "Ophthalmology", time: "Mar 22 · 3:00 PM", body: "Referral in queue." },
      { id: "t11-m2", from: "Ophthalmology", time: "Mar 23 · 9:00 AM", body: "May 6 first slot, dilated exam." },
      { id: "t11-m3", from: "Staff", time: "Mar 23 · 10:00 AM", body: "Patient prefers afternoon, noted." },
    ],
  },
  {
    id: "t15",
    from: "GI, Procedures",
    kind: "Referral",
    agent: "Ana Lopez",
    subject: "Colonoscopy prep kit",
    preview: "Kit mailed. Reminder call scheduled.",
    time: "Mar 21",
    unread: false,
    messages: [
      { id: "t15-m1", from: "GI", time: "Mar 20 · 4:00 PM", body: "Procedure scheduled." },
      { id: "t15-m2", from: "GI", time: "Mar 21 · 8:00 AM", body: "Prep kit mailed." },
      { id: "t15-m3", from: "Scheduling", time: "Mar 21 · 9:00 AM", body: "Reminder call set for two days prior." },
    ],
  },
  {
    id: "t17",
    from: "Allergy & Immunology",
    kind: "Referral",
    agent: "M. Patel",
    subject: "Patch testing, scheduling",
    preview: "Three-day series available starting Apr 2.",
    time: "Mar 20",
    unread: false,
    messages: [
      { id: "t17-m1", from: "Allergy", time: "Mar 19 · 3:00 PM", body: "Referral received." },
      { id: "t17-m2", from: "Allergy", time: "Mar 20 · 10:00 AM", body: "Apr 2 start for patch series." },
      { id: "t17-m3", from: "Staff", time: "Mar 20 · 11:00 AM", body: "Patient confirmed." },
    ],
  },
  {
    id: "t18",
    from: "Sleep medicine",
    kind: "Referral",
    agent: "Jamie Chen",
    subject: "CPAP adherence download",
    preview: "Last 30 days uploaded. Review when ready.",
    time: "Mar 20",
    unread: false,
    messages: [
      { id: "t18-m1", from: "Sleep", time: "Mar 19 · 6:00 PM", body: "Device data requested." },
      { id: "t18-m2", from: "Sleep", time: "Mar 20 · 7:00 AM", body: "30-day adherence file attached." },
      { id: "t18-m3", from: "Sleep", time: "Mar 20 · 7:30 AM", body: "Flag if nightly use under 4 hours." },
    ],
  },

  /* —— Labs —— */
  {
    id: "t2",
    from: "Pathology, Central Lab",
    kind: "Lab",
    agent: "Ana Lopez",
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
      {
        id: "t2-m4",
        from: "Pathology, Central Lab",
        time: "Mar 28 · 2:40 PM",
        body: "Corrected reference range note appended to result per QC review, no value change.",
      },
      {
        id: "t2-m5",
        from: "Clinical staff",
        time: "Mar 28 · 3:10 PM",
        body: "Documented ADA-aligned follow-up plan in chart. Closing loop.",
      },
    ],
  },
  {
    id: "t7",
    from: "Quest Diagnostics",
    kind: "Lab",
    agent: "Ana Lopez",
    subject: "Lipid panel complete",
    preview: "LDL 118 mg/dL. Full panel attached.",
    time: "Mar 25",
    unread: false,
    messages: [
      {
        id: "t7-m1",
        from: "Quest Diagnostics",
        time: "Mar 25 · 11:14 AM",
        body: "Lipid panel resulted for J. Ortiz. LDL 118, HDL 49, Trig 142. Report attached.",
        attachments: [{ name: "lipid_panel_ortiz.pdf", size: "71 KB" }],
      },
    ],
  },
  {
    id: "t13",
    from: "Cardiology, Echo lab",
    kind: "Lab",
    agent: "Jamie Chen",
    subject: "Stress test resulted",
    preview: "Negative for ischemia. Dr. Patel CC’d.",
    time: "Mar 22",
    unread: false,
    messages: [
      { id: "t13-m1", from: "Echo lab", time: "Mar 22 · 11:00 AM", body: "Study complete." },
      { id: "t13-m2", from: "Cardiology", time: "Mar 22 · 2:00 PM", body: "Negative for ischemia." },
      { id: "t13-m3", from: "Cardiology", time: "Mar 22 · 2:15 PM", body: "Recommend continue current meds." },
    ],
  },
  {
    id: "t19",
    from: "LabCorp",
    kind: "Lab",
    agent: "Ana Lopez",
    subject: "CMP + TSH resulted",
    preview: "TSH 2.4. Creatinine stable at 0.9.",
    time: "Mar 21",
    unread: true,
    messages: [
      {
        id: "t19-m1",
        from: "LabCorp",
        time: "Mar 21 · 8:40 AM",
        body: "Comprehensive metabolic panel and TSH resulted. Values within protocol ranges; see attached.",
        attachments: [{ name: "cmp_tsh.pdf", size: "58 KB" }],
      },
    ],
  },
  {
    id: "t20",
    from: "Microbiology",
    kind: "Lab",
    agent: "R. Okonkwo",
    subject: "Urine culture final",
    preview: "No growth at 48 hours. Sensitive panel N/A.",
    time: "Mar 20",
    unread: false,
    messages: [
      { id: "t20-m1", from: "Microbiology", time: "Mar 19 · 4:00 PM", body: "Preliminary: no growth at 24h." },
      { id: "t20-m2", from: "Microbiology", time: "Mar 20 · 9:15 AM", body: "Final: no growth at 48 hours." },
    ],
  },
  {
    id: "t21",
    from: "Hematology",
    kind: "Lab",
    agent: "M. Patel",
    subject: "CBC with differential",
    preview: "WBC 6.2. Mild anemia flagged for review.",
    time: "Mar 19",
    unread: true,
    messages: [
      {
        id: "t21-m1",
        from: "Hematology",
        time: "Mar 19 · 11:05 AM",
        body: "CBC resulted. Hemoglobin 11.4 flagged per anemia protocol.",
        attachments: [{ name: "cbc_diff.pdf", size: "41 KB" }],
      },
    ],
  },
  {
    id: "t22",
    from: "Point of care",
    kind: "Lab",
    agent: "Ana Lopez",
    subject: "INR result — clinic draw",
    preview: "INR 2.3. Within therapeutic range.",
    time: "Mar 18",
    unread: false,
    messages: [
      {
        id: "t22-m1",
        from: "Point of care",
        time: "Mar 18 · 2:20 PM",
        body: "Clinic INR 2.3. Continue current warfarin dosing unless otherwise directed.",
      },
    ],
  },

  /* —— Office / Admin —— */
  {
    id: "t4",
    from: "PriorAuth, Central",
    kind: "Admin",
    agent: "M. Patel",
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
    id: "t8",
    from: "Billing, Central",
    kind: "Admin",
    agent: "M. Patel",
    subject: "Claim hold — coding review",
    preview: "99214 needs supporting documentation for Mar 12 visit.",
    time: "Mar 24",
    unread: true,
    messages: [
      {
        id: "t8-m1",
        from: "Billing, Central",
        time: "Mar 24 · 3:40 PM",
        body: "Claim for Mar 12 visit is on hold pending coding review. Please confirm MDM complexity notes are complete.",
      },
    ],
  },
  {
    id: "t10",
    from: "Care coordination",
    kind: "Admin",
    agent: "Jamie Chen",
    subject: "Discharge summary, L. Ortiz",
    preview: "Final summary ready for PCP. CC you on send.",
    time: "Mar 24",
    unread: false,
    messages: [
      { id: "t10-m1", from: "Hospitalist", time: "Mar 23 · 6:00 PM", body: "Draft discharge summary." },
      { id: "t10-m2", from: "Care coordination", time: "Mar 24 · 8:00 AM", body: "Finalized, routing to PCP." },
      { id: "t10-m3", from: "Care coordination", time: "Mar 24 · 8:30 AM", body: "PCP fax confirmed." },
    ],
  },
  {
    id: "t16",
    from: "Quality & safety",
    kind: "Admin",
    agent: "R. Okonkwo",
    subject: "Chart audit, random sample",
    preview: "Please close 2 open tasks by Apr 4.",
    time: "Mar 21",
    unread: true,
    messages: [
      { id: "t16-m1", from: "Quality", time: "Mar 20 · 9:00 AM", body: "Random audit assigned." },
      { id: "t16-m2", from: "Quality", time: "Mar 21 · 8:00 AM", body: "Two documentation gaps noted." },
      { id: "t16-m3", from: "Quality", time: "Mar 21 · 8:30 AM", body: "Please remediate by Apr 4." },
    ],
  },
  {
    id: "t23",
    from: "Front desk ops",
    kind: "Admin",
    agent: "M. Patel",
    subject: "Schedule block — Apr 3 AM",
    preview: "Half-day closed for EHR training. Patients rescheduled.",
    time: "Mar 19",
    unread: false,
    messages: [
      {
        id: "t23-m1",
        from: "Front desk ops",
        time: "Mar 19 · 10:12 AM",
        body: "Apr 3 morning clinic blocked for mandatory EHR upgrade training. 11 patients moved; list attached.",
        attachments: [{ name: "reschedule_list.pdf", size: "52 KB" }],
      },
    ],
  },
  {
    id: "t24",
    from: "Credentialing",
    kind: "Admin",
    agent: "Ana Lopez",
    subject: "License renewal reminder",
    preview: "State license expires Jul 31. Upload CE hours.",
    time: "Mar 18",
    unread: true,
    messages: [
      {
        id: "t24-m1",
        from: "Credentialing",
        time: "Mar 18 · 9:00 AM",
        body: "Reminder: medical license renewal packet due. Please upload CE certificates to the credentialing portal.",
      },
    ],
  },
  {
    id: "t25",
    from: "IT helpdesk",
    kind: "Admin",
    agent: "Jamie Chen",
    subject: "VPN MFA reset complete",
    preview: "New authenticator enrolled. Old tokens revoked.",
    time: "Mar 17",
    unread: false,
    messages: [
      {
        id: "t25-m1",
        from: "IT helpdesk",
        time: "Mar 17 · 3:45 PM",
        body: "Your clinic VPN MFA was reset per request. Sign in with the new authenticator app before next remote session.",
      },
    ],
  },

  /* —— Patients / Messages —— */
  {
    id: "t3",
    from: "M. Nguyen",
    kind: "Message",
    agent: "Jamie Chen",
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
    id: "t6",
    from: "Nursing",
    kind: "Message",
    agent: "Jamie Chen",
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
  {
    id: "t8m",
    from: "Pharmacy, Retail",
    kind: "Message",
    agent: "M. Patel",
    subject: "Substitute available for atorvastatin",
    preview: "Insurance prefers generic 20 mg. OK to switch?",
    time: "Mar 25",
    unread: false,
    messages: [
      { id: "t8m-m1", from: "Pharmacy", time: "Mar 25 · 8:20 AM", body: "Insurance prefers listed generic." },
      { id: "t8m-m2", from: "Clinical staff", time: "Mar 25 · 9:05 AM", body: "Approved to substitute per formulary." },
      { id: "t8m-m3", from: "Pharmacy", time: "Mar 25 · 9:30 AM", body: "Rx updated. Patient notified." },
    ],
  },
  {
    id: "t10p",
    from: "A. Brooks",
    kind: "Message",
    agent: "Ana Lopez",
    subject: "Lab fasting instructions?",
    preview: "Do I need to fast before Thursday’s draw?",
    time: "Mar 23",
    unread: true,
    messages: [
      {
        id: "t10p-m1",
        from: "A. Brooks",
        time: "Mar 23 · 7:22 PM",
        body: "I have a lipid and CMP draw Thursday morning. Do I need to fast, and for how long?",
      },
    ],
  },
  {
    id: "t12",
    from: "Infection control",
    kind: "Message",
    agent: "R. Okonkwo",
    subject: "Exposure notification, low risk",
    preview: "Routine exposure logged. No action needed unless symptoms.",
    time: "Mar 23",
    unread: true,
    messages: [
      { id: "t12-m1", from: "Employee health", time: "Mar 23 · 7:00 AM", body: "Exposure logged." },
      { id: "t12-m2", from: "Infection control", time: "Mar 23 · 7:45 AM", body: "Risk stratification: low." },
      { id: "t12-m3", from: "Infection control", time: "Mar 23 · 8:00 AM", body: "No prophylaxis indicated." },
    ],
  },
  {
    id: "t14",
    from: "Social work",
    kind: "Message",
    agent: "Jamie Chen",
    subject: "Transport assistance, follow-up",
    preview: "Ride vouchers approved for 4 visits.",
    time: "Mar 22",
    unread: false,
    messages: [
      { id: "t14-m1", from: "Social work", time: "Mar 21 · 5:00 PM", body: "Assessing transport need." },
      { id: "t14-m2", from: "Social work", time: "Mar 22 · 9:00 AM", body: "Vouchers approved for 4 visits." },
      { id: "t14-m3", from: "Social work", time: "Mar 22 · 9:30 AM", body: "Patient informed." },
    ],
  },
  {
    id: "t26",
    from: "J. Ortiz",
    kind: "Message",
    agent: "Jamie Chen",
    subject: "Confirming Apr 9 echo",
    preview: "Got the reminder. Parking garage OK?",
    time: "Mar 21",
    unread: false,
    messages: [
      {
        id: "t26-m1",
        from: "J. Ortiz",
        time: "Mar 21 · 6:40 PM",
        body: "Confirming the Apr 9 echo at Riverside. Is the patient garage still free with a visit sticker?",
      },
    ],
  },
];

export function productMobileInboxCloneThreads(): ProductMobileInboxThread[] {
  return PRODUCT_MOBILE_INBOX_THREADS.map((thread) => ({
    ...thread,
    messages: thread.messages.map((message) => ({
      ...message,
      attachments: message.attachments ? [...message.attachments] : undefined,
    })),
  }));
}

export function productMobileInboxCategoryForKind(
  kind: ProductMobileInboxKind,
): ProductMobileInboxCategory {
  return KIND_CATEGORY[kind];
}

export function productMobileInboxKindForCategory(
  category: ProductMobileInboxCategory,
): ProductMobileInboxKind {
  return CATEGORY_KIND[category];
}

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
  threads: readonly ProductMobileInboxThread[],
  {
    filter = "all",
    category,
    agent,
  }: {
    filter?: ProductMobileInboxFilter;
    category?: ProductMobileInboxCategory | null;
    /** Optional — lists show the full category; agent is chrome/compose only. */
    agent?: string | null;
  } = {},
): ProductMobileInboxThread[] {
  const kind = category ? CATEGORY_KIND[category] : null;
  return threads.filter((thread) => {
    if (filter === "unread" && !thread.unread) return false;
    if (filter === "pinned" && thread.id !== PRODUCT_MOBILE_INBOX_PINNED_ID) return false;
    if (kind && thread.kind !== kind) return false;
    // Agent is intentionally not used for list filtering so each category stays full.
    void agent;
    return true;
  });
}

export function productMobileInboxNowLabel(): string {
  return "Just now";
}
