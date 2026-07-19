"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";

import { ProductLandingPanel } from "@/components/product/ProductLandingPanel";

export const weekSchedule = [
  {
    day: "Mon",
    date: "Mar 30",
    events: [
      { time: "8:00-8:30", label: "Elena Garcia - Annual Physical", tone: "blue" },
      { time: "8:30-9:00", label: "Marcus Lee - Hypertension Follow-up", tone: "blue" },
      { time: "9:00-9:30", label: "Priya Shah - Diabetes Check", tone: "blue" },
      { time: "9:30-10:00", label: "Noah Kim - URI Symptoms", tone: "blue" },
      { time: "10:00-10:30", label: "Fatima Khan - Migraine Management", tone: "blue" },
      { time: "10:30-11:00", label: "Lucas Brown - Medication Refill", tone: "blue" },
      { time: "11:00-11:30", label: "Mia Johnson - New Patient Intake", tone: "blue" },
      { time: "11:30-12:00", label: "Sofia Ramirez - Lab Review", tone: "blue" },
      { time: "12:00-1:00", label: "Team Huddle", tone: "neutral" },
      { time: "1:00-1:30", label: "Ethan Walker - Asthma Follow-up", tone: "blue" },
      { time: "1:30-2:00", label: "Ava Patel - Thyroid Follow-up", tone: "blue" },
      { time: "2:00-2:30", label: "Diego Alvarez - Knee Pain", tone: "blue" },
      { time: "2:30-3:00", label: "Isabella Chen - Rash Evaluation", tone: "blue" },
      { time: "3:00-3:30", label: "Henry Wilson - BP Recheck", tone: "blue" },
      { time: "3:30-4:00", label: "Charlotte Davis - Post-op Check", tone: "blue" },
      { time: "4:00-4:30", label: "Aiden Moore - Sleep Concerns", tone: "blue" },
      { time: "4:30-5:00", label: "Emma Rodriguez - Anxiety Follow-up", tone: "blue" },
      { time: "6:30-8:00", label: "Family Dinner + Kids Homework", tone: "green" },
    ],
  },
  {
    day: "Tue",
    date: "Mar 31",
    events: [
      { time: "8:00-9:00", label: "Residency Program Director Block", tone: "purple" },
      { time: "9:00-11:30", label: "Doctors Research Meeting", tone: "amber" },
      { time: "1:00-3:00", label: "Admin + Chart Review", tone: "neutral" },
      { time: "3:00-5:00", label: "Resident Mentorship", tone: "purple" },
      { time: "7:00-8:30", label: "Kids Soccer Pickup + Family Time", tone: "green" },
    ],
  },
  {
    day: "Wed",
    date: "Apr 1",
    events: [
      { time: "8:00-8:30", label: "Grace Turner - Prenatal Check", tone: "blue" },
      { time: "8:30-9:00", label: "Liam Nguyen - Ear Pain", tone: "blue" },
      { time: "9:00-9:30", label: "Harper Scott - Thyroid Labs", tone: "blue" },
      { time: "9:30-10:00", label: "Jack Hall - Sports Clearance", tone: "blue" },
      { time: "10:00-10:30", label: "Nora Young - COPD Follow-up", tone: "blue" },
      { time: "10:30-11:00", label: "Owen Allen - GI Symptoms", tone: "blue" },
      { time: "11:00-11:30", label: "Amelia King - Well Visit", tone: "blue" },
      { time: "11:30-12:00", label: "Benjamin Wright - Chest Pain Workup", tone: "blue" },
      { time: "1:00-1:30", label: "Zoe Hernandez - Depression Follow-up", tone: "blue" },
      { time: "1:30-2:00", label: "Mason Clark - Back Pain", tone: "blue" },
      { time: "2:00-2:30", label: "Layla Adams - Medication Titration", tone: "blue" },
      { time: "2:30-3:00", label: "James Rivera - New Onset Fatigue", tone: "blue" },
      { time: "3:00-3:30", label: "Chloe Flores - Dermatology Referral", tone: "blue" },
      { time: "3:30-4:00", label: "Logan Hill - DM Nutrition Follow-up", tone: "blue" },
      { time: "4:00-4:30", label: "Aria Baker - Anxiety Intake", tone: "blue" },
      { time: "4:30-5:00", label: "Sebastian Green - BP Medication Review", tone: "blue" },
      { time: "6:30-8:30", label: "Family Night", tone: "green" },
    ],
  },
  {
    day: "Thu",
    date: "Apr 2",
    events: [
      { time: "8:00-11:00", label: "Research: Outcomes Review", tone: "amber" },
      { time: "11:00-12:00", label: "Dept. Leadership Sync", tone: "neutral" },
      { time: "1:00-1:30", label: "Leah Carter - Weight Management", tone: "blue" },
      { time: "1:30-2:00", label: "Daniel Perez - URI Follow-up", tone: "blue" },
      { time: "2:00-2:30", label: "Hannah Simmons - Migraine Follow-up", tone: "blue" },
      { time: "2:30-3:00", label: "David Brooks - Lab Result Discussion", tone: "blue" },
      { time: "3:00-3:30", label: "Victoria Russell - Thyroid Adjustment", tone: "blue" },
      { time: "3:30-4:00", label: "Gabriel Bell - Annual Physical", tone: "blue" },
      { time: "4:00-4:30", label: "Lily Cooper - Sleep Apnea Review", tone: "blue" },
      { time: "4:30-5:00", label: "Julian Ward - GERD Follow-up", tone: "blue" },
      { time: "7:30-8:30", label: "Family Walk + Wind Down", tone: "green" },
    ],
  },
  {
    day: "Fri",
    date: "Apr 3",
    events: [
      { time: "8:00-8:30", label: "Audrey Price - Prenatal Follow-up", tone: "blue" },
      { time: "8:30-9:00", label: "Wyatt Kelly - Blood Pressure Check", tone: "blue" },
      { time: "9:00-9:30", label: "Stella Reed - New Onset Headache", tone: "blue" },
      { time: "9:30-10:00", label: "Nathan Cox - Sports Injury Follow-up", tone: "blue" },
      { time: "10:00-10:30", label: "Penelope Diaz - Diabetes Follow-up", tone: "blue" },
      { time: "10:30-11:00", label: "Isaac Howard - Medication Side Effects", tone: "blue" },
      { time: "11:00-11:30", label: "Brooklyn Bennett - Well Child Visit", tone: "blue" },
      { time: "11:30-12:00", label: "Samuel Collins - COPD Reassessment", tone: "blue" },
      { time: "12:00-1:00", label: "Case Conference", tone: "amber" },
      { time: "1:00-1:30", label: "Claire Foster - Lab Follow-up", tone: "blue" },
      { time: "1:30-2:00", label: "Andrew Gray - Shoulder Pain", tone: "blue" },
      { time: "2:00-2:30", label: "Paisley Myers - Mood Check-in", tone: "blue" },
      { time: "2:30-3:00", label: "Christopher Long - New Cough", tone: "blue" },
      { time: "3:00-3:30", label: "Violet Ross - Postpartum Visit", tone: "blue" },
      { time: "3:30-4:00", label: "John Powell - Cholesterol Review", tone: "blue" },
      { time: "4:00-4:30", label: "Eleanor Jenkins - Eczema Flare", tone: "blue" },
      { time: "4:30-5:00", label: "Mateo Perry - Follow-up Physical", tone: "blue" },
      { time: "6:00-8:00", label: "Family Movie Night", tone: "green" },
    ],
  },
  {
    day: "Sat",
    date: "Apr 4",
    events: [
      { time: "9:00-11:00", label: "Weekend Rounds", tone: "neutral" },
      { time: "11:30-1:00", label: "Kids Activities", tone: "green" },
      { time: "4:00-5:00", label: "Research Reading Block", tone: "amber" },
    ],
  },
  {
    day: "Sun",
    date: "Apr 5",
    events: [
      { time: "10:00-11:00", label: "Schedule Planning", tone: "neutral" },
      { time: "1:00-3:00", label: "Family Day", tone: "green" },
      { time: "7:30-8:00", label: "Prep Notes for Monday", tone: "purple" },
    ],
  },
] as const;

const inboxThreads = [
  {
    id: "t1",
    from: "Riverside Cardiology",
    kind: "Referral" as const,
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
        body: `Referral for J. Ortiz (DOB 1964), please confirm echo availability and whether you need a lipid panel on file before we send him over. Chart ref 448291.`,
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
        body: `Thanks for the referral. We have capacity Tuesday Apr 9 at 2:30 PM.

If the lipid panel from last week isn’t in the chart, please have them fax to our usual line before the visit.

R. Okonkwo, MD`,
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
        body: `Acknowledged, we’ll pull lipids from 3/22 and confirm the patient has Apr 9 on their calendar. Will fax if anything is missing.`,
      },
      {
        id: "t1-m4",
        from: "R. Okonkwo, MD, Riverside",
        time: "Mar 29 · 9:00 AM",
        email: "r.okonkwo@riversidecardiology.org",
        body: `Thanks for the update. If the patient’s LDL is still above goal on your panel, we’ll re-check in clinic before adjusting meds.`,
        attachments: [{ name: "ldl_targets.pdf", size: "88 KB" }],
      },
      {
        id: "t1-m5",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 29 · 11:30 AM",
        email: "jamie.chen@northside.health",
        body: `Lipids from 3/22 faxed to your number on file. Patient is aware of the Apr 9 appointment and prep instructions.`,
        attachments: [{ name: "lipid_panel_0322.pdf", size: "176 KB" }],
      },
      {
        id: "t1-m6",
        from: "Riverside Cardiology",
        time: "Mar 30 · 8:12 AM",
        email: "referrals@riversidecardiology.org",
        body: `Received, we’re all set for Apr 9 at 2:30. Echo orders are in the chart; we’ll see him then.`,
        attachments: [{ name: "echo_order_packet.pdf", size: "95 KB" }],
      },
      {
        id: "t1-m7",
        from: "Jamie Chen, MD, Northside",
        time: "Mar 30 · 10:06 AM",
        email: "jamie.chen@northside.health",
        body: `Great, thank you. Patient asked whether fasting is needed day-of; we advised standard meds unless instructed otherwise.`,
      },
      {
        id: "t1-m8",
        from: "Riverside Cardiology",
        time: "Mar 30 · 10:24 AM",
        email: "referrals@riversidecardiology.org",
        body: `No fasting required for the echo itself. We’ll confirm arrival details in our automated reminder tomorrow.`,
        attachments: [{ name: "visit_prep_note.pdf", size: "33 KB" }],
      },
    ],
  },
  {
    id: "t2",
    from: "Pathology, Central Lab",
    kind: "Lab" as const,
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
        body: `Hemoglobin A1c: 6.9% (Mar 28, 2026). Result auto-released to chart per protocol.`,
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
    id: "t3",
    from: "M. Nguyen",
    kind: "Message" as const,
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
    kind: "Admin" as const,
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
    kind: "Referral" as const,
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
    id: "t6",
    from: "Nursing",
    kind: "Message" as const,
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
    id: "t7",
    from: "Radiology, Imaging",
    kind: "Referral" as const,
    subject: "MRI lumbar spine, precert",
    preview: "Precert number attached. Patient to call scheduling.",
    time: "Mar 25",
    unread: false,
    messages: [
      { id: "t7-m1", from: "Radiology", time: "Mar 24 · 2:00 PM", body: "Precert submitted." },
      { id: "t7-m2", from: "Radiology", time: "Mar 25 · 9:00 AM", body: "Approved, auth #RZ-99281." },
      { id: "t7-m3", from: "Scheduling", time: "Mar 25 · 11:15 AM", body: "Patient given direct line to book." },
    ],
  },
  {
    id: "t8",
    from: "Pharmacy, Retail",
    kind: "Message" as const,
    subject: "Substitute available for atorvastatin",
    preview: "Insurance prefers generic 20 mg. OK to switch?",
    time: "Mar 25",
    unread: false,
    messages: [
      { id: "t8-m1", from: "Pharmacy", time: "Mar 25 · 8:20 AM", body: "Insurance prefers listed generic." },
      { id: "t8-m2", from: "Clinical staff", time: "Mar 25 · 9:05 AM", body: "Approved to substitute per formulary." },
      { id: "t8-m3", from: "Pharmacy", time: "Mar 25 · 9:30 AM", body: "Rx updated. Patient notified." },
    ],
  },
  {
    id: "t9",
    from: "Endocrinology, North",
    kind: "Referral" as const,
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
    id: "t10",
    from: "Care coordination",
    kind: "Admin" as const,
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
    id: "t11",
    from: "Ophthalmology",
    kind: "Referral" as const,
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
    id: "t12",
    from: "Infection control",
    kind: "Message" as const,
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
    id: "t13",
    from: "Cardiology, Echo lab",
    kind: "Lab" as const,
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
    id: "t14",
    from: "Social work",
    kind: "Message" as const,
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
    id: "t15",
    from: "GI, Procedures",
    kind: "Referral" as const,
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
    id: "t16",
    from: "Quality & safety",
    kind: "Admin" as const,
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
    id: "t17",
    from: "Allergy & Immunology",
    kind: "Referral" as const,
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
    kind: "Referral" as const,
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
] as const;

function inboxSenderInitials(from: string): string {
  const parts = from.split(/[\s,]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function inboxCalendarGradientClass(seed: string): string {
  const gradients = [
    "bg-gradient-to-br from-[#E3B468] to-[#A8794B]",
    "bg-gradient-to-br from-[#E5AF63] to-[#BC6948]",
    "bg-gradient-to-br from-[#D38964] to-[#906A54]",
    "bg-gradient-to-br from-[#9A936F] to-[#6D654C]",
  ] as const;
  const hash = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

function inboxBrownAvatarGradientClass(seed: string): string {
  const gradients = [
    "bg-gradient-to-br from-[#A87654] to-[#7A5640]",
    "bg-gradient-to-br from-[#9E7860] to-[#6E5242]",
    "bg-gradient-to-br from-[#917865] to-[#5E4A3E]",
    "bg-gradient-to-br from-[#867565] to-[#52483F]",
  ] as const;
  const hash = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

function inboxAvatarGradientClass(seed: string, brownPalette = false): string {
  return brownPalette ? inboxBrownAvatarGradientClass(seed) : inboxCalendarGradientClass(seed);
}

function inboxMessageAvatarClass(from: string, brownPalette = false): string {
  return `${inboxAvatarGradientClass(from, brownPalette)} ${brownPalette ? "text-[#f5efe8]" : "text-white"}`;
}

function inboxSenderNameLine(from: string): string {
  const commaParts = from.split(",").map((part) => part.trim());
  if (commaParts.length >= 2 && /^(MD|DO|NP|PA)$/i.test(commaParts[1])) {
    return `${commaParts[0]}, ${commaParts[1]}`;
  }
  return commaParts[0] || from;
}

function inboxSenderAffiliation(from: string): string | null {
  const commaParts = from.split(",").map((part) => part.trim());
  if (commaParts.length >= 2 && /^(MD|DO|NP|PA)$/i.test(commaParts[1])) {
    const affiliation = commaParts.slice(2).join(", ").trim();
    return affiliation || null;
  }
  if (commaParts.length >= 2) {
    return commaParts.slice(1).join(", ").trim() || null;
  }
  return null;
}

function inboxDerivedEmail(from: string): string {
  const lower = from.toLowerCase();
  if (lower.includes("northside")) return "jamie.chen@northside.health";
  if (lower.includes("riverside")) return "referrals@riversidecardiology.org";
  if (lower.includes("lab")) return "results@pathology.central.health";
  if (lower.includes("pharmacy")) return "rx@pharmacy.retail.health";
  const slug = from
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${slug || "sender"}@messages.health`;
}

function inboxMessageEmail(msg: { from: string; email?: string }): string {
  return msg.email ?? inboxDerivedEmail(msg.from);
}

function inboxMessageAttachmentsList(
  msg: unknown,
): readonly { name: string; size: string }[] {
  if (
    typeof msg === "object" &&
    msg !== null &&
    "attachments" in msg &&
    Array.isArray((msg as { attachments: unknown }).attachments)
  ) {
    return (msg as { attachments: readonly { name: string; size: string }[] }).attachments;
  }
  return [];
}

const PINNED_INBOX_THREAD_ID = "t1";

function InboxPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" x2="12" y1="17" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.12-.56A2 2 0 0 1 15 10.76V7a2 2 0 0 0-2-2H11a2 2 0 0 0-2 2v3.76a2 2 0 0 1-1.11 1.79l-1.12.56A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

type InboxThreadData = (typeof inboxThreads)[number];

function InboxThreadListRow({
  t,
  isActive,
  onSelect,
  showPin,
  brownTheme = false,
}: {
  t: InboxThreadData;
  isActive: boolean;
  onSelect: () => void;
  showPin?: boolean;
  brownTheme?: boolean | "dark";
}) {
  const showUnreadAccent = !isActive && t.unread;
  const darkBrown = brownTheme === "dark";
  const lightBrown = brownTheme === true;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`product-brown-inbox-row relative flex w-full gap-3 border-b px-3.5 py-3 text-left transition-colors ${
        darkBrown
          ? "border-[rgba(245,230,208,0.08)]"
          : brownTheme
            ? lightBrown
              ? "border-[var(--pi-line)]"
              : "border-[rgba(61,46,31,0.14)]"
            : "border-[#F2F2F2]"
      } ${
        isActive
          ? darkBrown
            ? "product-brown-inbox-row--active border-l-2 border-l-transparent bg-[#3d2e1f]"
            : lightBrown
              ? "product-brown-inbox-row--active border-l-2 border-l-transparent bg-[var(--pi-selected)]"
              : brownTheme
                ? "product-brown-inbox-row--active border-l-2 border-l-[#D4A574] bg-[#f8edd8]"
                : "border-l-2 border-l-[#D4A574] bg-[#FFF9F1]"
          : showUnreadAccent
            ? darkBrown
              ? "product-brown-inbox-row--default border-l-2 border-l-transparent bg-[#322618] hover:bg-[#3a2a1c]"
              : lightBrown
                ? "product-brown-inbox-row--default border-l-2 border-l-transparent bg-[var(--pi-cream)] hover:bg-[var(--pi-raised)]"
                : brownTheme
                  ? "product-brown-inbox-row--default border-l-2 border-l-[#D4A574]/45 bg-[#f5e6d0] hover:bg-[rgba(26,18,8,0.05)]"
                  : "border-l-2 border-l-[#D4A574]/45 bg-white hover:bg-neutral-50/80"
            : darkBrown
              ? "product-brown-inbox-row--default border-l-2 border-l-transparent bg-[#2a1f12] hover:bg-[#322618]"
              : lightBrown
                ? "product-brown-inbox-row--default border-l-2 border-l-transparent bg-[var(--pi-cream)] hover:bg-[var(--pi-raised)]"
                : brownTheme
                  ? "product-brown-inbox-row--default border-l-2 border-l-transparent bg-[#f5e6d0] hover:bg-[rgba(26,18,8,0.05)]"
                  : "border-l-2 border-l-transparent bg-white hover:bg-neutral-50/80"
      } ${darkBrown ? "product-brown-inbox-row--dark" : ""}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${inboxAvatarGradientClass(
          t.from,
          lightBrown,
        )} ${lightBrown ? "text-[#f5efe8]" : "text-white"}`}
      >
        {inboxSenderInitials(t.from)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`line-clamp-2 text-[13px] leading-snug tracking-tight ${
              t.unread ? "font-semibold text-neutral-900" : "font-medium text-neutral-800"
            }`}
          >
            {t.subject}
          </p>
          <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[10px] font-medium tabular-nums tracking-tight text-neutral-400">
            {showPin ? (
              <span className="inline-flex shrink-0" title="Pinned">
                <InboxPinIcon className={`h-3 w-3 ${lightBrown ? "text-[var(--pi-ink-soft)]" : brownTheme && !darkBrown ? "text-[#8b6914]" : "text-[#B8956A]"}`} />
              </span>
            ) : null}
            {t.time}
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] font-medium text-neutral-600">{t.from}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">{t.preview}</p>
      </div>
    </button>
  );
}

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Hero marketing mock: UI sans (sidebar “Doe” keeps `lora` on its own span). */
const suisseIntlUi = localFont({
  src: [
    { path: "../fonts/suisse/SuisseIntlTrial-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/suisse/SuisseIntlTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/suisse/SuisseIntlTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/suisse/SuisseIntlTrial-Semibold.otf", weight: "600", style: "normal" },
  ],
  display: "swap",
  weight: "300",
});

const monthWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const monthGrid = [
  { key: "2026-03-29", day: 29, month: "Mar", inApril: false, events: [{ time: "9:00-11:00", label: "Weekend Rounds", tone: "neutral" }] },
  { key: "2026-03-30", day: 30, month: "Mar", inApril: false, events: weekSchedule[0].events },
  { key: "2026-03-31", day: 31, month: "Mar", inApril: false, events: weekSchedule[1].events },
  { key: "2026-04-01", day: 1, month: "Apr", inApril: true, events: weekSchedule[2].events },
  { key: "2026-04-02", day: 2, month: "Apr", inApril: true, events: weekSchedule[3].events },
  { key: "2026-04-03", day: 3, month: "Apr", inApril: true, events: weekSchedule[4].events },
  { key: "2026-04-04", day: 4, month: "Apr", inApril: true, events: weekSchedule[5].events },
  { key: "2026-04-05", day: 5, month: "Apr", inApril: true, events: weekSchedule[6].events },
  { key: "2026-04-06", day: 6, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-3:00", label: "Research Debrief", tone: "amber" }, { time: "6:30-8:00", label: "Family Dinner", tone: "green" }] },
  { key: "2026-04-07", day: 7, month: "Apr", inApril: true, events: [{ time: "8:30-10:00", label: "Resident Teaching Rounds", tone: "purple" }, { time: "10:30-12:00", label: "Patient Follow-up Calls", tone: "blue" }, { time: "2:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-08", day: 8, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-2:30", label: "Administrative Reviews", tone: "neutral" }, { time: "7:00-8:30", label: "Kids School Event", tone: "green" }] },
  { key: "2026-04-09", day: 9, month: "Apr", inApril: true, events: [{ time: "8:00-9:30", label: "Research Data Sync", tone: "amber" }, { time: "1:00-5:00", label: "Half-Day Clinic", tone: "blue" }] },
  { key: "2026-04-10", day: 10, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "12:30-1:30", label: "Case Conference", tone: "amber" }, { time: "6:00-8:00", label: "Family Movie Night", tone: "green" }] },
  { key: "2026-04-11", day: 11, month: "Apr", inApril: true, events: [{ time: "9:30-11:00", label: "Weekend Rounds", tone: "neutral" }, { time: "11:30-1:00", label: "Kids Activities", tone: "green" }] },
  { key: "2026-04-12", day: 12, month: "Apr", inApril: true, events: [{ time: "10:00-11:00", label: "Schedule Planning", tone: "neutral" }, { time: "1:00-3:00", label: "Family Day", tone: "green" }] },
  { key: "2026-04-13", day: 13, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }, { time: "6:30-8:00", label: "Homework + Dinner", tone: "green" }] },
  { key: "2026-04-14", day: 14, month: "Apr", inApril: true, events: [{ time: "8:00-10:00", label: "Program Director Block", tone: "purple" }, { time: "10:00-12:00", label: "Research Meeting", tone: "amber" }, { time: "3:00-5:00", label: "Resident Mentorship", tone: "purple" }] },
  { key: "2026-04-15", day: 15, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-16", day: 16, month: "Apr", inApril: true, events: [{ time: "8:30-11:00", label: "Research: Outcomes Review", tone: "amber" }, { time: "1:00-5:00", label: "Half-Day Clinic", tone: "blue" }, { time: "7:30-8:30", label: "Family Walk", tone: "green" }] },
  { key: "2026-04-17", day: 17, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-18", day: 18, month: "Apr", inApril: true, events: [{ time: "9:00-11:00", label: "Weekend Rounds", tone: "neutral" }] },
  { key: "2026-04-19", day: 19, month: "Apr", inApril: true, events: [{ time: "11:00-1:00", label: "Family Brunch", tone: "green" }] },
  { key: "2026-04-20", day: 20, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-21", day: 21, month: "Apr", inApril: true, events: [{ time: "8:00-10:00", label: "Residency Interviews", tone: "purple" }, { time: "11:00-1:00", label: "Research Meeting", tone: "amber" }, { time: "3:00-5:00", label: "Administrative Review", tone: "neutral" }] },
  { key: "2026-04-22", day: 22, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-23", day: 23, month: "Apr", inApril: true, events: [{ time: "8:00-10:30", label: "Research + Admin", tone: "amber" }, { time: "1:00-5:00", label: "Half-Day Clinic", tone: "blue" }] },
  { key: "2026-04-24", day: 24, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }, { time: "6:30-8:00", label: "Family Night", tone: "green" }] },
  { key: "2026-04-25", day: 25, month: "Apr", inApril: true, events: [{ time: "10:00-12:00", label: "Weekend Catch-up", tone: "neutral" }] },
  { key: "2026-04-26", day: 26, month: "Apr", inApril: true, events: [{ time: "1:00-3:00", label: "Family Day", tone: "green" }] },
  { key: "2026-04-27", day: 27, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-28", day: 28, month: "Apr", inApril: true, events: [{ time: "8:00-10:00", label: "Program Director Block", tone: "purple" }, { time: "10:30-12:00", label: "Research Meeting", tone: "amber" }] },
  { key: "2026-04-29", day: 29, month: "Apr", inApril: true, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "1:00-5:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-04-30", day: 30, month: "Apr", inApril: true, events: [{ time: "8:00-10:30", label: "Research + Outcomes", tone: "amber" }, { time: "1:00-5:00", label: "Half-Day Clinic", tone: "blue" }] },
  { key: "2026-05-01", day: 1, month: "May", inApril: false, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }, { time: "12:30-1:30", label: "Case Conference", tone: "amber" }] },
  { key: "2026-05-02", day: 2, month: "May", inApril: false, events: [{ time: "9:30-11:00", label: "Weekend Rounds", tone: "neutral" }] },
  { key: "2026-05-03", day: 3, month: "May", inApril: false, events: [{ time: "1:00-3:00", label: "Family Day", tone: "green" }] },
  { key: "2026-05-04", day: 4, month: "May", inApril: false, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-05-05", day: 5, month: "May", inApril: false, events: [{ time: "8:00-10:00", label: "Residency Block", tone: "purple" }] },
  { key: "2026-05-06", day: 6, month: "May", inApril: false, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-05-07", day: 7, month: "May", inApril: false, events: [{ time: "1:00-5:00", label: "Half-Day Clinic", tone: "blue" }] },
  { key: "2026-05-08", day: 8, month: "May", inApril: false, events: [{ time: "8:00-12:00", label: "Clinic Session Block", tone: "blue" }] },
  { key: "2026-05-09", day: 9, month: "May", inApril: false, events: [{ time: "11:00-1:00", label: "Family Time", tone: "green" }] },
] as const;

const YEAR_VIEW_YEAR = 2026;
const YEAR_MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const eventsByDateKey = new Map<string, (typeof monthGrid)[number]["events"]>(
  monthGrid.map((d) => [d.key, d.events]),
);

function buildYearMonthCells(
  year: number,
  monthIndex: number,
): (null | { day: number; dateKey: string })[] {
  const firstDow = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const out: (null | { day: number; dateKey: string })[] = [];
  for (let i = 0; i < firstDow; i++) out.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(monthIndex + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    out.push({ day: d, dateKey: `${year}-${mm}-${dd}` });
  }
  while (out.length % 7 !== 0) out.push(null);
  while (out.length < 42) out.push(null);
  return out;
}

function shortenEventLabel(label: string, max = 28): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function getEventSummary(label: string): { primary: string; secondary: string } {
  if (label.includes(" - ")) {
    const [primary, ...rest] = label.split(" - ");
    return { primary: primary.trim(), secondary: rest.join(" - ").trim() };
  }
  if (label.includes(":")) {
    const [primary, ...rest] = label.split(":");
    return { primary: primary.trim(), secondary: rest.join(":").trim() };
  }
  return { primary: label.trim(), secondary: "" };
}

const SLOT_MINUTES = 30;
const SLOT_COUNT = (24 * 60) / SLOT_MINUTES;
/** 30-minute row height; two rows = one hour (taller grid for readability). */
const SLOT_HEIGHT = 44;
const WEEK_TOP_BUFFER = 8;
const WEEK_VISIBLE_START_MINUTES = 8 * 60;
const WEEK_VISIBLE_SLOT_COUNT = ((24 * 60) - WEEK_VISIBLE_START_MINUTES) / SLOT_MINUTES;
const TODAY_DATE_LABEL = "Mar 30";
const TODAY_DATE_KEY = "2026-03-30";

function parseTimeToMinutes(time: string): number {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  if (hour === 12) return 12 * 60 + minute;
  return (hour <= 7 ? hour + 12 : hour) * 60 + minute;
}

function parseEventRangeToMinutes(timeRange: string): { start: number; end: number } {
  const [startText, endText] = timeRange.split("-");
  if (!startText || !endText) return { start: 0, end: SLOT_MINUTES };
  const start = parseTimeToMinutes(startText.trim());
  let end = parseTimeToMinutes(endText.trim());
  if (end <= start) end += 12 * 60;
  return { start, end };
}

function formatMinutesLabel(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(twelveHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** Start of an event range like "8:00-9:30" for compact month tiles. */
function formatEventRangeStartLabel(timeRange: string): string {
  const [startText] = timeRange.split("-");
  if (!startText) return "";
  return formatMinutesLabel(parseTimeToMinutes(startText.trim()));
}

function getEventCategory(tone: string, label: string): string {
  const lower = label.toLowerCase();

  if (tone === "blue") {
    if (lower.includes("annual physical") || lower.includes("well visit")) {
      return "Preventive Visit";
    }
    if (lower.includes("follow-up") || lower.includes("follow up")) {
      return "Follow-up Care";
    }
    if (lower.includes("intake") || lower.includes("new patient")) {
      return "New Patient";
    }
    if (
      lower.includes("pain") ||
      lower.includes("cough") ||
      lower.includes("uri") ||
      lower.includes("rash")
    ) {
      return "Acute Concern";
    }
    if (
      lower.includes("medication") ||
      lower.includes("refill") ||
      lower.includes("titration")
    ) {
      return "Medication Management";
    }
    if (
      lower.includes("lab") ||
      lower.includes("review") ||
      lower.includes("discussion")
    ) {
      return "Results Review";
    }
    return "Clinic Visit";
  }

  if (tone === "amber") return "Research/Conference";
  if (tone === "purple") return "Residency/Director";
  if (tone === "green") return "Family/Kids";
  return "Operations/Admin";
}

function getAppointmentReason(tone: string, label: string): string {
  const summary = getEventSummary(label);
  return summary.secondary || getEventCategory(tone, label);
}

function eventCardGradientClass(tone: string, brownOnly = false): string {
  if (brownOnly) {
    switch (tone) {
      case "amber":
        return "bg-gradient-to-br from-[#C4A574] to-[#8B6914]";
      case "purple":
        return "bg-gradient-to-br from-[#A67B5B] to-[#6B4423]";
      case "green":
        return "bg-gradient-to-br from-[#9A8565] to-[#5C4A32]";
      default:
        return "bg-gradient-to-br from-[#D4A574] to-[#8B6914]";
    }
  }

  switch (tone) {
    case "blue":
      return "bg-gradient-to-br from-[#E3B468] to-[#A8794B]";
    case "amber":
      return "bg-gradient-to-br from-[#E5AF63] to-[#BC6948]";
    case "purple":
      return "bg-gradient-to-br from-[#D38964] to-[#906A54]";
    case "green":
      return "bg-gradient-to-br from-[#9A936F] to-[#6D654C]";
    default:
      return "bg-gradient-to-br from-[#E3B468] to-[#A8794B]";
  }
}

/**
 * Four-corner mesh using the same stops as the /doe “Build with us” surfaces:
 * linear-gradient(135deg, #E7A944 → #D49D4F → #D2774C → #1E343A).
 */
type PatientDayRow = {
  id: string;
  name: string;
  timeRange: string;
  timeLabel: string;
  reason: string;
  patientNumber: number;
};

function parseClinicEventLabel(label: string): { name: string; reason: string } {
  const idx = label.indexOf(" - ");
  if (idx === -1) return { name: label.trim(), reason: "Visit" };
  return { name: label.slice(0, idx).trim(), reason: label.slice(idx + 3).trim() };
}

function formatAppointmentTimeStart(timeRange: string): string {
  const start = timeRange.split("-")[0]?.trim() ?? "";
  const [hs, ms] = start.split(":");
  const h = Number(hs);
  const m = Number(ms ?? 0);
  if (Number.isNaN(h)) return start;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function ordinalAppointmentLabel(index1Based: number): string {
  const n = index1Based;
  const n10 = n % 10;
  const n100 = n % 100;
  let suffix = "th";
  if (n100 < 11 || n100 > 13) {
    if (n10 === 1) suffix = "st";
    else if (n10 === 2) suffix = "nd";
    else if (n10 === 3) suffix = "rd";
  }
  return `${n}${suffix} Appointment`;
}

function buildPatientDayListFromSchedule(): PatientDayRow[] {
  const day = weekSchedule[0];
  const rows: PatientDayRow[] = [];
  let idx = 0;
  for (const ev of day.events) {
    if (ev.tone !== "blue") continue;
    idx += 1;
    const { name, reason } = parseClinicEventLabel(ev.label);
    rows.push({
      id: `day-${day.day}-${idx}`,
      name,
      timeRange: ev.time,
      timeLabel: formatAppointmentTimeStart(ev.time),
      reason,
      patientNumber: 900400 + idx,
    });
  }
  rows.unshift({
    id: "james-lisondra",
    name: "James Lisondra",
    timeRange: "5:00-5:30",
    timeLabel: "5:00 PM",
    reason: "Hypertension follow-up",
    patientNumber: 908421,
  });
  return rows;
}

const patientExpandedIdentityBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 135% 125% at 0% 0%, rgb(231 169 68 / 0.92) 0%, rgb(231 169 68 / 0.22) 44%, transparent 72%)",
    "radial-gradient(ellipse 135% 125% at 100% 0%, rgb(212 157 79 / 0.9) 0%, rgb(212 157 79 / 0.2) 44%, transparent 72%)",
    "radial-gradient(ellipse 135% 125% at 100% 100%, rgb(30 52 58 / 0.88) 0%, rgb(30 52 58 / 0.28) 44%, transparent 72%)",
    "radial-gradient(ellipse 135% 125% at 0% 100%, rgb(210 119 76 / 0.9) 0%, rgb(210 119 76 / 0.2) 44%, transparent 72%)",
    "radial-gradient(ellipse 85% 90% at 52% 48%, transparent 0%, rgb(30 52 58 / 0.42) 100%)",
    "linear-gradient(168deg, rgb(26 44 49) 0%, rgb(30 52 58) 42%, rgb(22 38 42) 100%)",
  ].join(", "),
};

type ScheduleDay = (typeof weekSchedule)[number];

function summarizeScheduleDay(day: ScheduleDay) {
  let firstStart = 24 * 60;
  let lastEnd = 0;
  const counts = { clinic: 0, research: 0, residency: 0, family: 0, admin: 0 };
  for (const event of day.events) {
    const { start, end } = parseEventRangeToMinutes(event.time);
    firstStart = Math.min(firstStart, start);
    lastEnd = Math.max(lastEnd, end);
    if (event.tone === "blue") counts.clinic += 1;
    else if (event.tone === "amber") counts.research += 1;
    else if (event.tone === "purple") counts.residency += 1;
    else if (event.tone === "green") counts.family += 1;
    else counts.admin += 1;
  }
  const timeSpan =
    day.events.length > 0 && firstStart < 24 * 60
      ? `${formatMinutesLabel(firstStart)}–${formatMinutesLabel(lastEnd)}`
      : null;
  return { counts, firstStart, lastEnd, timeSpan, total: day.events.length };
}

function Icon({
  children,
  className = "h-[18px] w-[18px] shrink-0 text-neutral-500",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export type DoeSchedulesAppMockVariant = "framed" | "fullscreen" | "hero" | "product-brown";

const PERIOD_SELECTOR_COPY: Record<
  "Today" | "This week" | "Month" | "Year",
  { label: string; prevAria: string; nextAria: string }
> = {
  Today: {
    label: "Mon, Mar 30, 2026",
    prevAria: "Previous day",
    nextAria: "Next day",
  },
  "This week": {
    label: "Mar 30 – Apr 5, 2026",
    prevAria: "Previous week",
    nextAria: "Next week",
  },
  Month: {
    label: "April 2026",
    prevAria: "Previous month",
    nextAria: "Next month",
  },
  Year: {
    label: "2026",
    prevAria: "Previous year",
    nextAria: "Next year",
  },
};

export function DoeSchedulesAppMock({
  variant = "framed",
}: {
  variant?: DoeSchedulesAppMockVariant;
}) {
  const viewOptions = ["Today", "This week", "Month", "Year"] as const;
  const [timeView, setTimeView] = useState<(typeof viewOptions)[number]>("This week");
  const categoryOptions = [
    {
      label: "All categories",
      swatch: variant === "product-brown" ? "bg-[#a89070]" : "bg-neutral-300",
    },
    { label: "Clinic", swatch: "bg-gradient-to-br from-[#E3B468] to-[#A8794B]" },
    { label: "Research", swatch: "bg-gradient-to-br from-[#E5AF63] to-[#BC6948]" },
    { label: "Director/Residency", swatch: "bg-gradient-to-br from-[#D38964] to-[#906A54]" },
    { label: "Family/Kids", swatch: "bg-gradient-to-br from-[#9A936F] to-[#6D654C]" },
  ] as const;
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categoryOptions)[number]["label"]>("All categories");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const clinicOptions = [
    { name: "Northside Family Clinic", address: "1200 Oak Ave, Austin, TX 78701" },
    { name: "Riverside Primary Care", address: "412 River St, Austin, TX 78702" },
    { name: "Westlake Medical Group", address: "89 Lakeview Dr, Austin, TX 78746" },
  ] as const;
  const [selectedClinic, setSelectedClinic] = useState<(typeof clinicOptions)[number]>(
    clinicOptions[0],
  );
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const userOptions = [
    { name: "Dr. Sarah Chen", role: "Physician" },
    { name: "James Lisondra", role: "Practice admin" },
    { name: "Morgan Ellis", role: "Front desk" },
  ] as const;
  const [selectedUser, setSelectedUser] = useState<(typeof userOptions)[number]>(userOptions[0]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceView, setWorkspaceView] = useState<
    "inbox" | "schedule" | "patients" | "landing"
  >(variant === "product-brown" ? "landing" : "schedule");
  const [selectedInboxId, setSelectedInboxId] = useState<string>(inboxThreads[0].id);
  const [inboxFilter, setInboxFilter] = useState<"all" | "unread" | "pinned">("all");
  const [patientListScope, setPatientListScope] = useState<"all" | "today">("today");
  const [selectedPatientId, setSelectedPatientId] = useState("james-lisondra");
  const [patientPickerOpen, setPatientPickerOpen] = useState(false);
  const patientPickerRef = useRef<HTMLDivElement>(null);
  const [patientIdentityMinimized, setPatientIdentityMinimized] = useState(false);

  const patientDayRows = useMemo(() => {
    const base = buildPatientDayListFromSchedule();
    if (patientListScope === "all") {
      return [
        ...base,
        {
          id: "all-roster-1",
          name: "Riley Thompson",
          timeRange: "—",
          timeLabel: "Unscheduled",
          reason: "Patient portal message",
          patientNumber: 901122,
        },
        {
          id: "all-roster-2",
          name: "Jordan Blake",
          timeRange: "—",
          timeLabel: "Unscheduled",
          reason: "Referral intake",
          patientNumber: 901889,
        },
      ];
    }
    return base;
  }, [patientListScope]);

  const selectedPatientRow = useMemo(() => {
    return patientDayRows.find((p) => p.id === selectedPatientId) ?? patientDayRows[0];
  }, [patientDayRows, selectedPatientId]);

  const selectedAppointmentOrdinal = useMemo(() => {
    const i = patientDayRows.findIndex((p) => p.id === selectedPatientId);
    return i >= 0 ? i + 1 : 1;
  }, [patientDayRows, selectedPatientId]);

  useEffect(() => {
    if (!patientPickerOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (patientPickerRef.current?.contains(e.target as Node)) return;
      setPatientPickerOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [patientPickerOpen]);

  useEffect(() => {
    if (patientDayRows.length === 0) return;
    if (!patientDayRows.some((p) => p.id === selectedPatientId)) {
      queueMicrotask(() => setSelectedPatientId(patientDayRows[0].id));
    }
  }, [patientDayRows, selectedPatientId]);
  const activeViewIndex = viewOptions.indexOf(timeView);

  const filteredInbox = useMemo(() => {
    return inboxThreads.filter((t) => {
      if (inboxFilter === "unread") return t.unread;
      if (inboxFilter === "pinned") return t.id === PINNED_INBOX_THREAD_ID;
      return true;
    });
  }, [inboxFilter]);

  const pinnedInboxThread = useMemo(
    () => filteredInbox.find((t) => t.id === PINNED_INBOX_THREAD_ID),
    [filteredInbox],
  );
  const inboxThreadsScrollList = useMemo(
    () => filteredInbox.filter((t) => t.id !== PINNED_INBOX_THREAD_ID),
    [filteredInbox],
  );

  const selectedInbox = useMemo(() => {
    const hit = filteredInbox.find((t) => t.id === selectedInboxId);
    return hit ?? filteredInbox[0];
  }, [filteredInbox, selectedInboxId]);

  const full = variant === "fullscreen" || variant === "product-brown";
  const productBrown = variant === "product-brown";
  const hero = variant === "hero";
  const productBrownWorkspace =
    productBrown && workspaceView !== "landing";
  const productBrownInbox = productBrown && workspaceView === "inbox";
  const productBrownDarkWorkspace =
    productBrownWorkspace && workspaceView !== "inbox";
  const inboxUi = productBrownInbox
    ? {
        canvas: "bg-[var(--pi-cream)]",
        toolbar: "bg-[var(--pi-sand)]",
        recess: "bg-[var(--pi-well)]",
        selected: "bg-[var(--pi-selected)]",
        raised: "bg-[var(--pi-raised)]",
        reading: "bg-[var(--pi-reading)]",
        elevated: "bg-[var(--pi-reading)]",
        cream: "bg-[var(--pi-cream)]",
        sand: "bg-[var(--pi-sand)]",
        sandDeep: "bg-[var(--pi-sand-deep)]",
        well: "bg-[var(--pi-well)]",
        highlight: "bg-[var(--pi-raised)]",
        ink: "text-[var(--pi-ink)]",
        inkSoft: "text-[var(--pi-ink-soft)]",
        line: "border-[var(--pi-line)]",
        lineStrong: "border-[var(--pi-line-strong)]",
        iconMuted: "text-[var(--pi-muted-soft)]",
        filterActive:
          "bg-[var(--pi-raised)] text-[var(--pi-ink)] shadow-[0_1px_2px_rgba(30,22,18,0.04)] ring-1 ring-[rgba(38,32,28,0.08)]",
        filterInactive: "text-[rgba(38,32,28,0.52)] hover:text-[var(--pi-ink)]",
        track: "bg-[var(--pi-well)]",
        tabIndicator: "bg-[var(--pi-ink-soft)]",
        tabIndicatorMuted: "bg-[rgba(38,32,28,0.1)]",
        composeBtn:
          "border-[var(--pi-line)] bg-[var(--pi-raised)] text-[var(--pi-ink)] shadow-[0_1px_2px_rgba(30,22,18,0.04)] hover:bg-[var(--pi-selected)]",
        avatarRing: "border-[rgba(58,50,44,0.28)] bg-[rgba(58,50,44,0.1)]",
        chip: "border-[var(--pi-line)] bg-[var(--pi-raised)] text-[var(--pi-ink)] shadow-[0_1px_2px_rgba(30,22,18,0.03)]",
        chipHover: "hover:border-[rgba(38,32,28,0.12)] hover:bg-[var(--pi-selected)]",
        actionBar:
          "inline-flex items-center gap-0.5 rounded-full border border-[var(--pi-line)] bg-[var(--pi-well)] p-0.5 shadow-[0_1px_2px_rgba(30,22,18,0.03)]",
        actionBtn:
          "text-[rgba(38,32,28,0.68)] transition-colors hover:bg-[var(--pi-raised)] hover:text-[var(--pi-ink)]",
        iconBtn:
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pi-line)] bg-[var(--pi-raised)] text-[var(--pi-muted-soft)] shadow-[0_1px_2px_rgba(30,22,18,0.03)] transition-colors hover:bg-[var(--pi-selected)] hover:text-[var(--pi-ink-soft)]",
        iconBtnNeutral:
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pi-line)] bg-[var(--pi-raised)] text-[var(--pi-muted-soft)] shadow-[0_1px_2px_rgba(30,22,18,0.03)] transition-colors hover:bg-[var(--pi-selected)] hover:text-[var(--pi-ink)]",
        emptyIcon:
          "rounded-full border border-[var(--pi-line)] bg-[var(--pi-raised)] p-3 shadow-[0_1px_2px_rgba(30,22,18,0.03)]",
        emptyIconGlyph: "h-6 w-6 text-[rgba(30,22,18,0.28)]",
        pinIcon: "h-3 w-3 shrink-0 text-[var(--pi-ink-soft)] opacity-90",
        mutedText: "text-[var(--pi-muted)]",
        agentActive:
          "bg-[var(--pi-raised)] text-[var(--pi-ink)] shadow-[0_1px_2px_rgba(30,22,18,0.04)] ring-1 ring-[rgba(38,32,28,0.08)]",
        agentInactive: "bg-transparent text-[var(--pi-muted)]",
        emailQuote:
          "rounded-md border border-[var(--pi-line)] bg-[var(--pi-well)]",
        emailQuoteText: "text-[rgba(38,32,28,0.62)]",
        divider: "bg-[var(--pi-line)]",
        messageBorder: "border-[rgba(38,32,28,0.08)]",
      }
    : null;
  const fullWidthWorkspace =
    hero || workspaceView === "inbox" || (productBrown && workspaceView === "landing");
  const patientBentoCard = productBrownDarkWorkspace
    ? "rounded-xl border border-[rgba(245,230,208,0.1)] bg-[#322618] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
    : productBrown
      ? "rounded-xl border border-[rgba(61,46,31,0.14)] bg-[#f5e6d0] p-3 shadow-[0_1px_2px_rgba(26,18,8,0.04)]"
      : "rounded-xl border border-[#E8E8E8] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
  const earlyEventCount = weekSchedule.reduce((count, day) => {
    return (
      count +
      day.events.filter((event) => parseEventRangeToMinutes(event.time).start < WEEK_VISIBLE_START_MINUTES)
        .length
    );
  }, 0);

  const todayScheduleDay: ScheduleDay = weekSchedule[0];
  const todaySummary = summarizeScheduleDay(todayScheduleDay);
  const earlyTodayCount = todayScheduleDay.events.filter(
    (event) => parseEventRangeToMinutes(event.time).start < WEEK_VISIBLE_START_MINUTES,
  ).length;
  const todayTimelineEvents = [...todayScheduleDay.events].sort((a, b) => {
    return parseEventRangeToMinutes(a.time).start - parseEventRangeToMinutes(b.time).start;
  });
  const summaryChips: { label: string; count: number }[] = [
    { label: "Clinic", count: todaySummary.counts.clinic },
    { label: "Research", count: todaySummary.counts.research },
    { label: "Residency", count: todaySummary.counts.residency },
    { label: "Family", count: todaySummary.counts.family },
    { label: "Admin", count: todaySummary.counts.admin },
  ].filter((row) => row.count > 0);

  const periodSelector = PERIOD_SELECTOR_COPY[timeView];

  const appSidebar = (
    <aside
      className={`flex h-full shrink-0 flex-col ${
        productBrown
          ? "product-brown-sidebar bg-[#1a1208]"
          : "w-[220px] border-r border-[#EFEFEF] bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`h-8 w-8 shrink-0 rounded-lg shadow-sm ${
              productBrown
                ? "bg-gradient-to-br from-[#D4A574] via-[#A67B5B] to-[#3d2e1f]"
                : "bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A]"
            }`}
          />
          <div className="min-w-0">
            <div
              className={`truncate text-[1.15rem] font-normal leading-none tracking-tight ${
                productBrown ? "text-[#f5e6d0]" : "text-neutral-900"
              } ${lora.className}`}
            >
              Doe
            </div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Collapse sidebar"
        >
          <Icon className="h-4 w-4">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </Icon>
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[#ECECEC] bg-[#FAFAFA] px-2.5">
          <Icon className="h-4 w-4 text-neutral-400">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </Icon>
          <span className="flex-1 text-[13px] text-neutral-400">Search</span>
          <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
            ⌘
          </span>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          {clinicMenuOpen ? (
            <div
              role="menu"
              className={`absolute top-full left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-xl border p-1 opacity-100 ${
                productBrown
                  ? "border-[rgba(245,230,208,0.14)] bg-[#241910] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                  : "border-[#E5E5E5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              }`}
            >
              {clinicOptions.map((clinic) => (
                <button
                  key={clinic.name}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setClinicMenuOpen(false);
                  }}
                  className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left ${
                    selectedClinic.name === clinic.name
                      ? productBrown
                        ? "bg-[rgba(245,230,208,0.1)]"
                        : "bg-neutral-100"
                      : productBrown
                        ? "hover:bg-[rgba(245,230,208,0.08)]"
                        : "hover:bg-neutral-50"
                  }`}
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      productBrown
                        ? "bg-gradient-to-br from-[#D4A574] to-[#A67B5B]"
                        : "bg-gradient-to-br from-[#E7A944] to-[#BF593D]"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[12px] font-medium ${
                        productBrown ? "text-[#f5e6d0]" : "text-neutral-700"
                      }`}
                    >
                      {clinic.name}
                    </span>
                    <span
                      className={`block truncate text-[10px] ${
                        productBrown ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-500"
                      }`}
                    >
                      {clinic.address}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setClinicMenuOpen((open) => !open);
              setUserMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-[12px] font-medium hover:bg-neutral-50 ${
              productBrown
                ? "border-[rgba(245,230,208,0.12)] bg-[rgba(245,230,208,0.06)] text-[#f5e6d0] hover:bg-[rgba(245,230,208,0.1)]"
                : "border-[#E6E6E6] bg-white text-neutral-700"
            }`}
            aria-haspopup="menu"
            aria-expanded={clinicMenuOpen}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                productBrown
                  ? "bg-gradient-to-br from-[#D4A574] to-[#A67B5B]"
                  : "bg-gradient-to-br from-[#E7A944] to-[#BF593D]"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{selectedClinic.name}</span>
              <span
                className={`block truncate text-[10px] font-normal ${
                  productBrown ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-500"
                }`}
              >
                {selectedClinic.address}
              </span>
            </span>
            <Icon className="h-3.5 w-3.5 text-neutral-400">
              <path d="m6 9 6 6 6-6" />
            </Icon>
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pb-2">
        {[
          { label: "Today", icon: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
          { label: "Updates", badge: "44", icon: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /> },
          {
            label: "Inbox",
            badge: "20",
            icon: (
              <>
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </>
            ),
          },
          {
            label: "My tasks",
            icon: (
              <>
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4" />
                <path d="M15 7V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" />
                <rect width="8" height="14" x="13" y="7" rx="2" />
              </>
            ),
            action: "+",
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-neutral-700 hover:bg-neutral-50"
          >
            <Icon className="h-[18px] w-[18px]">{item.icon}</Icon>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {"badge" in item && item.badge ? (
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
                {item.badge}
              </span>
            ) : null}
            {"action" in item && item.action ? (
              <span className="rounded-md border border-neutral-200 px-1.5 text-xs text-neutral-500">
                {item.action}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="px-2 pb-1 pt-1">
        <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          <span>Workspace</span>
          <span className="flex gap-1">
            <span className="cursor-pointer">⋯</span>
            <span className="cursor-pointer">+</span>
          </span>
        </div>
        <div className="mt-1 flex flex-col gap-0.5">
          {(productBrown
            ? (["Landing", "Inbox", "Schedule", "Patients"] as const)
            : (["Inbox", "Schedule", "Patients"] as const)
          ).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === "Landing") setWorkspaceView("landing");
                else if (label === "Inbox") setWorkspaceView("inbox");
                else if (label === "Schedule") setWorkspaceView("schedule");
                else setWorkspaceView("patients");
              }}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] ${
                (label === "Landing" && workspaceView === "landing") ||
                (label === "Inbox" && workspaceView === "inbox") ||
                (label === "Schedule" && workspaceView === "schedule") ||
                (label === "Patients" && workspaceView === "patients")
                  ? productBrown
                    ? "bg-[rgba(245,230,208,0.12)] font-medium text-[#f5e6d0]"
                    : "bg-neutral-100 font-medium text-neutral-900"
                  : productBrown
                    ? "text-[rgba(245,230,208,0.78)] hover:bg-[rgba(245,230,208,0.08)]"
                    : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <Icon className="h-[18px] w-[18px]">
                {label === "Landing" ? (
                  <>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </>
                ) : label === "Inbox" ? (
                  <>
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </>
                ) : label === "Schedule" ? (
                  <>
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </>
                ) : (
                  <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}
              </Icon>
              <span className="flex-1 truncate text-left">{label}</span>
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50"
          >
            <Icon className="h-[18px] w-[18px]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </Icon>
            <span className="min-w-0 flex-1 truncate text-left">Documents</span>
            <span className="rounded-md border border-neutral-200 bg-white px-1.5 text-xs text-neutral-500">
              +
            </span>
          </button>
          {["Billing"].map((label) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50"
            >
              <Icon className="h-[18px] w-[18px]">
                {label === "Billing" ? (
                  <>
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </>
                ) : (
                  <>
                    <path d="m3 11 18-5v12L3 14v-3z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </>
                )}
              </Icon>
              <span className="flex-1 truncate text-left">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pb-2 pt-2">
        <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          <span>Intelligence</span>
        </div>
        <div className="mt-1 flex flex-col gap-0.5">
          {["Agents", "Design", "Marketing", "Franchise"].map((label) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50"
            >
              <Icon className="h-[18px] w-[18px]">
                {label === "Agents" ? (
                  <>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20a6 6 0 0 1 12 0" />
                    <path d="M18 8h3" />
                    <path d="M19.5 6.5v3" />
                  </>
                ) : label === "Design" ? (
                  <>
                    <path d="m3 17 6-6 4 4 6-6" />
                    <circle cx="9" cy="11" r="1.2" />
                    <circle cx="13" cy="15" r="1.2" />
                  </>
                ) : label === "Marketing" ? (
                  <>
                    <path d="m3 11 18-5v12L3 14v-3z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </>
                ) : (
                  <>
                    <path d="M4 10h16v10H4z" />
                    <path d="M4 14h16" />
                    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
                  </>
                )}
              </Icon>
              <span className="flex-1 truncate text-left">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-[#EFEFEF] px-2 py-2">
        <div className="px-1">
          <div className="relative">
            {userMenuOpen ? (
              <div
                role="menu"
                className={`absolute bottom-full left-0 right-0 z-30 mb-1.5 overflow-hidden rounded-xl border p-1 opacity-100 ${
                  productBrown
                    ? "border-[rgba(245,230,208,0.14)] bg-[#241910] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                    : "border-[#E5E5E5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                }`}
              >
                {userOptions.map((user) => (
                  <button
                    key={user.name}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedUser(user);
                      setUserMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
                      selectedUser.name === user.name
                        ? productBrown
                          ? "bg-[rgba(245,230,208,0.1)]"
                          : "bg-neutral-100"
                        : productBrown
                          ? "hover:bg-[rgba(245,230,208,0.08)]"
                          : "hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        productBrown
                          ? "bg-[rgba(245,230,208,0.12)] text-[#f5e6d0]"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[12px] font-medium ${
                          productBrown ? "text-[#f5e6d0]" : "text-neutral-700"
                        }`}
                      >
                        {user.name}
                      </span>
                      <span
                        className={`block truncate text-[10px] ${
                          productBrown ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen((open) => !open);
                setClinicMenuOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-[12px] font-medium hover:bg-neutral-50 ${
                productBrown
                  ? "border-[rgba(245,230,208,0.12)] bg-[rgba(245,230,208,0.06)] text-[#f5e6d0] hover:bg-[rgba(245,230,208,0.1)]"
                  : "border-[#E6E6E6] bg-white text-neutral-700"
              }`}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  productBrown
                    ? "bg-[rgba(245,230,208,0.12)] text-[#f5e6d0]"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {selectedUser.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{selectedUser.name}</span>
                <span
                  className={`block truncate text-[10px] font-normal ${
                    productBrown ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-500"
                  }`}
                >
                  {selectedUser.role}
                </span>
              </span>
              <Icon className="h-3.5 w-3.5 text-neutral-400">
                <path d="m18 15-6-6-6 6" />
              </Icon>
            </button>
          </div>
          <button
            type="button"
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
          >
            <Icon className="h-4 w-4 text-neutral-400">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </Icon>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div
      className={
        (full || hero
          ? "flex h-full min-h-0 w-full flex-col"
          : "flex h-full min-h-0 w-full flex-col p-4 sm:p-5") +
        (hero ? ` pointer-events-none select-none touch-none ${suisseIntlUi.className}` : "") +
        (productBrown ? " product-brown-mock" : "") +
        (productBrownDarkWorkspace ? " product-brown-workspace-mode" : "") +
        (productBrownInbox ? " product-brown-inbox-mode" : "")
      }
      aria-hidden={hero ? true : undefined}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${
          full
            ? productBrown
              ? "product-brown-shell rounded-none border-0 bg-[#1a1208]"
              : "rounded-none border-0 bg-[#F4F4F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
            : hero
              ? "rounded-none border-0 bg-white"
              : "rounded-2xl border border-[#E8E8E8] bg-[#F4F4F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
        }`}
      >
        <div
          className={`min-h-0 flex-1 overflow-hidden ${
            productBrown
              ? "product-brown-frame product-brown-layered-layout bg-[#1a1208]"
              : productBrownInbox
                ? "product-brown-frame product-brown-inbox bg-[var(--pi-cream)]"
                : productBrownDarkWorkspace
                  ? "product-brown-frame product-brown-workspace bg-[#1a1208]"
                  : "bg-white"
          } ${full || hero ? "rounded-none" : "rounded-[14px]"}`}
        >
          <div
            className={
              productBrown
                ? "product-brown-workspace-row h-full max-w-none"
                : `flex h-full max-w-none ${hero ? "min-h-[580px]" : "min-h-[520px]"} ${
                    fullWidthWorkspace ? "w-full" : "w-[200%]"
                  }`
            }
          >
            {productBrown && appSidebar}
            <div className={productBrown ? "product-brown-inner-row" : "contents"}>
            <div
              className={
                productBrown
                  ? "product-brown-inner-row__content h-full min-w-0 overflow-hidden"
                  : "contents"
              }
            >
            <div
              className={`flex h-full ${productBrown ? "min-w-0 max-w-full w-full" : "max-w-none"} ${
                hero ? "min-h-[580px]" : "min-h-[520px]"
              } ${productBrown ? "w-full" : fullWidthWorkspace ? "w-full" : "w-[200%]"}`}
            >
            <div
              className={`product-brown-primary-col flex h-full shrink-0 ${
                productBrownDarkWorkspace ? "bg-[#1a1208]" : ""
              } ${
                productBrown
                  ? ""
                  : productBrownInbox
                    ? "border-r border-[rgba(61,46,31,0.1)]"
                    : productBrownDarkWorkspace
                      ? ""
                      : "border-r border-[#EBEBEB]"
              } ${fullWidthWorkspace ? "w-full min-w-0" : "w-1/2"}`}
            >
              {!productBrown && appSidebar}

              <div
                className={`product-brown-main flex min-h-0 min-w-0 flex-1 flex-col ${
                  productBrownInbox
                    ? inboxUi!.cream
                    : productBrownDarkWorkspace
                      ? "bg-[#2a1f12] shadow-[inset_1px_0_0_rgba(245,230,208,0.07)]"
                      : productBrown
                        ? "bg-[#faf0d8]"
                        : "bg-white"
                }`}
              >
                {workspaceView === "landing" && productBrown ? (
                  <ProductLandingPanel />
                ) : workspaceView === "schedule" ? (
                  <>
                <header
                  className={`flex items-center gap-2 border-b px-4 py-3 ${
                    productBrownDarkWorkspace
                      ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                      : productBrown
                        ? "border-[rgba(61,46,31,0.14)] bg-[#f5e6d0]"
                        : "border-[#EFEFEF]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      productBrownDarkWorkspace
                        ? "text-[rgba(245,230,208,0.48)]"
                        : productBrown
                          ? "text-[rgba(61,46,31,0.48)]"
                          : "text-neutral-500"
                    }`}
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </Icon>
                  <h1
                    className={`text-[15px] font-semibold tracking-tight ${
                      productBrownDarkWorkspace || productBrown ? "text-[#f5e6d0]" : "text-neutral-900"
                    }`}
                  >
                    Schedules
                  </h1>
                </header>
                <div
                  className={`border-b border-dashed px-4 py-2 ${
                    productBrownDarkWorkspace
                      ? "border-[rgba(245,230,208,0.1)] bg-[#2a1f12]"
                      : productBrown
                        ? "border-[rgba(61,46,31,0.14)] bg-[#faf0d8]"
                        : "border-[#E8E8E8]"
                  }`}
                >
                  <div
                    className={`flex w-full min-w-0 flex-wrap items-center gap-3 ${
                      hero ? "justify-start" : "justify-between"
                    }`}
                  >
                    <div
                      className={`flex min-w-0 flex-wrap items-center gap-3 ${hero ? "order-2" : ""}`}
                    >
                      <div
                        className={`inline-flex h-[38px] min-w-0 max-w-[min(100%,280px)] items-center gap-1 rounded-[14px] border px-1 sm:max-w-[320px] ${
                          productBrownDarkWorkspace
                            ? "border-[rgba(245,230,208,0.12)] bg-[#322618]"
                            : productBrown
                              ? "border-[rgba(61,46,31,0.14)] bg-[#f5e6d0]"
                              : "border-[#E2E2E2] bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          aria-label={periodSelector.prevAria}
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                            productBrownDarkWorkspace
                              ? "text-[rgba(245,230,208,0.48)] hover:bg-[#3d2e1f] hover:text-[#f5e6d0]"
                              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-current">
                            <path d="m15 18-6-6 6-6" />
                          </Icon>
                        </button>
                        <span
                          className={`min-w-0 flex-1 truncate px-1 text-center text-[12px] font-semibold ${
                            productBrownDarkWorkspace ? "text-[#f5e6d0]" : "text-neutral-800"
                          }`}
                        >
                          {periodSelector.label}
                        </span>
                        <button
                          type="button"
                          aria-label={periodSelector.nextAria}
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                            productBrownDarkWorkspace
                              ? "text-[rgba(245,230,208,0.48)] hover:bg-[#3d2e1f] hover:text-[#f5e6d0]"
                              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-current">
                            <path d="m9 18 6-6-6-6" />
                          </Icon>
                        </button>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setCategoryMenuOpen((open) => !open)}
                          className={`inline-flex h-[38px] min-w-[190px] items-center gap-2 rounded-[14px] border px-3 text-[12px] font-medium ${
                            productBrownDarkWorkspace
                              ? "border-[rgba(245,230,208,0.12)] bg-[#322618] text-[#f5e6d0] hover:bg-[#3d2e1f]"
                              : productBrown
                                ? "border-[rgba(61,46,31,0.14)] bg-[#f5e6d0] text-[#2a1f12] hover:bg-[rgba(26,18,8,0.04)]"
                                : "border-[#E2E2E2] bg-white text-neutral-700 hover:bg-neutral-50"
                          }`}
                          aria-haspopup="menu"
                          aria-expanded={categoryMenuOpen}
                        >
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                              categoryOptions.find((option) => option.label === selectedCategory)
                                ?.swatch ?? "bg-neutral-300"
                            }`}
                          />
                          <span className="flex-1 truncate text-left">{selectedCategory}</span>
                          <Icon className="h-3.5 w-3.5 text-neutral-400">
                            <path d="m6 9 6 6 6-6" />
                          </Icon>
                        </button>
                        {categoryMenuOpen ? (
                          <div
                            role="menu"
                            className="absolute right-0 z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                          >
                            {categoryOptions.map((option) => (
                              <button
                                key={option.label}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setSelectedCategory(option.label);
                                  setCategoryMenuOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] ${
                                  selectedCategory === option.label
                                    ? "bg-neutral-100 text-neutral-900"
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.swatch}`} />
                                <span className="truncate">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={`relative grid w-[min(100%,360px)] shrink-0 grid-cols-4 rounded-[22px] border p-1 sm:w-[360px] ${
                        productBrownDarkWorkspace
                          ? "border-[rgba(245,230,208,0.12)] bg-[#241910]"
                          : productBrown
                            ? "border-[rgba(61,46,31,0.14)] bg-[#ede0c8]"
                            : "border-[#E2E2E2] bg-[#F7F7F7]"
                      } ${hero ? "order-1" : "ml-auto"}`}
                    >
                      <span
                        className={`pointer-events-none absolute top-1 h-[30px] rounded-[16px] border shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[left] duration-200 ${
                          productBrownDarkWorkspace
                            ? "border-[rgba(245,230,208,0.14)] bg-[#3d2e1f]"
                            : productBrown
                              ? "border-[rgba(61,46,31,0.14)] bg-[#f5e6d0]"
                              : "border-[#E6E6E6] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                        }`}
                        style={{
                          left: `calc(${activeViewIndex * 25}% + 4px)`,
                          width: "calc(25% - 4px)",
                        }}
                      />
                      {viewOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setTimeView(option)}
                          className={`relative z-10 rounded-[16px] px-2 py-1.5 text-[12px] font-medium transition-colors ${
                            timeView === option
                              ? productBrownDarkWorkspace
                                ? "text-[#f5e6d0]"
                                : "text-neutral-900"
                              : productBrownDarkWorkspace
                                ? "text-[rgba(245,230,208,0.48)] hover:text-[#f5e6d0]"
                                : "text-neutral-500 hover:text-neutral-700"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex min-h-0 flex-1 flex-col px-4 py-3 ${hero ? "overflow-hidden" : "overflow-auto"}`}
                >
                  {timeView === "Month" ? (
                    <div className="flex min-h-0 min-w-[980px] flex-1 flex-col overflow-hidden rounded-xl border border-[#EAEAEA] bg-white">
                      <div className="grid shrink-0 grid-cols-7 border-b border-[#EAEAEA] bg-[#FAFAFA]">
                        {monthWeekdays.map((weekday) => (
                          <div
                            key={weekday}
                            className="border-r border-[#EAEAEA] py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-400 last:border-r-0"
                          >
                            {weekday}
                          </div>
                        ))}
                      </div>
                      <div className="min-h-0 flex-1 overflow-auto p-2">
                        <div className="grid grid-cols-7 gap-1.5">
                          {(full ? monthGrid.slice(0, 35) : monthGrid).map((day) => {
                            const monthLimit = 4;
                            const visibleEvents = day.events.slice(0, monthLimit);
                            const overflowCount = Math.max(0, day.events.length - monthLimit);
                            const isToday = day.key === TODAY_DATE_KEY;

                            return (
                              <div
                                key={day.key}
                                className={`flex min-h-[118px] flex-col rounded-lg border p-1.5 ${
                                  isToday
                                    ? "border-[#E8D4B5] bg-[#FFF9F1] shadow-[inset_3px_0_0_0_#D4A574]"
                                    : day.inApril
                                      ? "border-[#EDEDED] bg-white"
                                      : "border-[#F0F0F0] bg-[#F9F9FA]"
                                }`}
                              >
                                <div className="mb-1 flex items-center justify-between gap-1">
                                  <span
                                    className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-md text-[12px] font-semibold tabular-nums ${
                                      isToday
                                        ? "bg-[#E8D4B5]/35 text-[#9B6A3F]"
                                        : day.inApril
                                          ? "text-neutral-800"
                                          : "text-neutral-400"
                                    }`}
                                  >
                                    {day.day}
                                  </span>
                                  {isToday && !hero ? (
                                    <span className="shrink-0 rounded-full bg-white/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-[#9B6A3F] ring-1 ring-[#E8D4B5]/80">
                                      Today
                                    </span>
                                  ) : !day.inApril ? (
                                    <span className="truncate text-[9px] font-medium text-neutral-400">
                                      {day.month}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="min-h-0 flex-1 space-y-1 overflow-hidden">
                                  {visibleEvents.map((event) => {
                                    const summary = getEventSummary(event.label);
                                    return (
                                      <div
                                        key={`${day.key}-${event.time}-${event.label}`}
                                        className={`overflow-hidden rounded-md px-1.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${eventCardGradientClass(event.tone, productBrown)}`}
                                      >
                                        <div className="flex items-start justify-between gap-1.5">
                                          <p className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-snug tracking-tight text-white">
                                            {shortenEventLabel(summary.primary, 22)}
                                          </p>
                                          <span className="shrink-0 text-right text-[10px] font-medium tabular-nums leading-snug text-white/90">
                                            {formatEventRangeStartLabel(event.time)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {overflowCount > 0 ? (
                                  <div className="mt-auto pt-1">
                                    <span className="inline-flex w-full justify-center rounded-full bg-neutral-100/90 py-0.5 text-[9px] font-semibold text-neutral-500">
                                      +{overflowCount} more
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : timeView === "This week" ? (
                    <div className="flex min-h-0 min-w-[980px] flex-1 flex-col overflow-hidden rounded-xl border border-[#EAEAEA] bg-white">
                      <div className="grid shrink-0 grid-cols-[72px_repeat(7,minmax(120px,1fr))] border-b border-[#EAEAEA] bg-[#FAFAFA]">
                        <div className="border-r border-[#EAEAEA] px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                          Time
                        </div>
                        {weekSchedule.map((day) => (
                          <div
                            key={`head-${day.day}`}
                            className={`border-r px-2 py-2 last:border-r-0 ${
                              day.date === TODAY_DATE_LABEL
                                ? "border-[#E8D4B5] bg-[#FFF9F1]"
                                : "border-[#EAEAEA]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <p
                                className={`text-[12px] font-semibold ${
                                  day.date === TODAY_DATE_LABEL ? "text-[#9B6A3F]" : "text-neutral-900"
                                }`}
                              >
                                {day.day}
                              </p>
                              {day.date === TODAY_DATE_LABEL && !hero ? (
                                <span className="shrink-0 rounded-full border border-[#E8D4B5] bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9B6A3F]">
                                  Today
                                </span>
                              ) : null}
                            </div>
                            <p
                              className={`text-[10px] ${
                                day.date === TODAY_DATE_LABEL ? "text-[#9B6A3F]" : "text-neutral-500"
                              }`}
                            >
                              {day.date}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="min-h-0 flex-1 overflow-auto">
                        {!hero ? (
                        <div className="grid shrink-0 grid-cols-[72px_repeat(7,minmax(120px,1fr))] border-b border-[#F1F1F1] bg-[#FCFCFC]">
                          <div className="border-r border-[#EAEAEA]" aria-hidden />
                          <div className="col-span-7 flex items-center justify-center px-3 py-2">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-neutral-400">
                              <span aria-hidden>↑</span>
                              <span>{earlyEventCount} events before 8:00 AM</span>
                            </div>
                          </div>
                        </div>
                        ) : null}
                        <div
                          className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))]"
                          style={{ height: WEEK_VISIBLE_SLOT_COUNT * SLOT_HEIGHT + WEEK_TOP_BUFFER }}
                        >
                          <div className="border-r border-[#EAEAEA] bg-[#FCFCFC]">
                            <div
                              className="bg-[#FCFCFC]"
                              style={{ height: WEEK_TOP_BUFFER }}
                              aria-hidden
                            />
                            {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
                              const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
                              const isHour = minutes % 60 === 0;
                              return (
                                <div
                                  key={`time-${minutes}`}
                                  className={`relative ${isHour ? "border-t border-[#E6E6E6]" : "border-t border-dashed border-[#EFEFEF]"} ${slotIndex === 0 ? "border-t-0" : ""}`}
                                  style={{ height: SLOT_HEIGHT }}
                                >
                                  {isHour ? (
                                    <span className="absolute left-0 right-0 top-1 px-2 text-right text-[9px] font-medium leading-none text-neutral-500">
                                      {formatMinutesLabel(minutes)}
                                    </span>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>

                          {weekSchedule.map((day) => {
                            const isTodayCol = day.date === TODAY_DATE_LABEL;
                            return (
                            <div
                              key={`col-${day.day}`}
                              className={`relative border-r last:border-r-0 ${
                                isTodayCol
                                  ? "border-[#E8D4B5] bg-[#FFF9F1]"
                                  : "border-[#EAEAEA] bg-white"
                              } ${hero ? "overflow-hidden" : ""}`}
                            >
                              <div
                                className="pointer-events-none absolute inset-x-0 bottom-0"
                                style={{ top: WEEK_TOP_BUFFER }}
                              >
                                {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
                                  const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
                                  const isHour = minutes % 60 === 0;
                                  return (
                                    <div
                                      key={`line-${day.day}-${slotIndex}`}
                                      className={`${isHour ? "border-t border-[#ECECEC]" : "border-t border-dashed border-[#F2F2F2]"} ${slotIndex === 0 ? "border-t-0" : ""}`}
                                      style={{ height: SLOT_HEIGHT }}
                                    />
                                  );
                                })}
                              </div>

                              {day.events.map((event) => {
                                const { start, end } = parseEventRangeToMinutes(event.time);
                                const clippedStart = Math.max(start, WEEK_VISIBLE_START_MINUTES);
                                const clippedEnd = Math.min(end, 24 * 60);
                                if (clippedEnd <= clippedStart) return null;
                                const top =
                                  ((clippedStart - WEEK_VISIBLE_START_MINUTES) / SLOT_MINUTES) *
                                    SLOT_HEIGHT +
                                  WEEK_TOP_BUFFER;
                                const height = Math.max(
                                  SLOT_HEIGHT - 2,
                                  ((clippedEnd - clippedStart) / SLOT_MINUTES) * SLOT_HEIGHT - 2,
                                );
                                const summary = getEventSummary(event.label);
                                const reason = getAppointmentReason(event.tone, event.label);

                                return (
                                  <div
                                    key={`${day.day}-${event.time}-${event.label}`}
                                    className={`absolute left-1.5 right-1.5 ${hero ? "overflow-visible" : "overflow-hidden"} rounded-[10px] px-2 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${eventCardGradientClass(event.tone, productBrown)}`}
                                    style={{ top, height }}
                                  >
                                    <div className="flex min-h-0 flex-col gap-0.5">
                                      <p className="truncate text-[11px] font-semibold leading-snug tracking-tight text-white">
                                        {summary.primary}
                                      </p>
                                      <p
                                        className={`text-[10px] font-medium leading-snug text-[#F7EFE4] ${
                                          height < SLOT_HEIGHT * 1.75 ? "truncate" : "line-clamp-2"
                                        }`}
                                      >
                                        {shortenEventLabel(reason, height < SLOT_HEIGHT * 2 ? 42 : 120)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : timeView === "Today" ? (
                    <div className="flex min-h-0 min-w-[560px] flex-1 flex-col overflow-hidden rounded-xl border border-[#EAEAEA] bg-white">
                      <div className="grid shrink-0 grid-cols-[72px_minmax(0,1fr)] border-b border-[#EAEAEA] bg-[#FAFAFA]">
                        <div className="border-r border-[#EAEAEA] px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                          Time
                        </div>
                        <div className="border-[#E8D4B5] bg-[#FFF9F1] px-3 py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[13px] font-semibold text-[#9B6A3F]">{todayScheduleDay.day}</p>
                            {!hero ? (
                              <span className="rounded-full border border-[#E8D4B5] bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9B6A3F]">
                                Today
                              </span>
                            ) : null}
                            <span className="text-[12px] text-[#9B6A3F]/90">{todayScheduleDay.date}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-neutral-500">
                            {todaySummary.total} on the calendar
                            {todaySummary.timeSpan ? ` · ${todaySummary.timeSpan}` : null}
                          </p>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 overflow-auto">
                        {!hero ? (
                        <div className="border-b border-[#F1F1F1] bg-[#FCFCFC] px-3 py-2">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-neutral-400">
                            <span aria-hidden>↑</span>
                            <span>{earlyTodayCount} events before 8:00 AM</span>
                          </div>
                        </div>
                        ) : null}
                        <div
                          className="grid grid-cols-[72px_minmax(0,1fr)]"
                          style={{ height: WEEK_VISIBLE_SLOT_COUNT * SLOT_HEIGHT + WEEK_TOP_BUFFER }}
                        >
                          <div className="border-r border-[#EAEAEA] bg-[#FCFCFC]">
                            <div className="bg-[#FCFCFC]" style={{ height: WEEK_TOP_BUFFER }} aria-hidden />
                            {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
                              const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
                              const isHour = minutes % 60 === 0;
                              return (
                                <div
                                  key={`today-time-${minutes}`}
                                  className={`relative ${isHour ? "border-t border-[#E6E6E6]" : "border-t border-dashed border-[#EFEFEF]"} ${slotIndex === 0 ? "border-t-0" : ""}`}
                                  style={{ height: SLOT_HEIGHT }}
                                >
                                  {isHour ? (
                                    <span className="absolute left-0 right-0 top-1 px-2 text-right text-[9px] font-medium leading-none text-neutral-500">
                                      {formatMinutesLabel(minutes)}
                                    </span>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>

                          <div className="relative bg-white">
                            <div
                              className="pointer-events-none absolute inset-x-0 bottom-0"
                              style={{ top: WEEK_TOP_BUFFER }}
                            >
                              {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
                                const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
                                const isHour = minutes % 60 === 0;
                                return (
                                  <div
                                    key={`today-line-${slotIndex}`}
                                    className={`${isHour ? "border-t border-[#ECECEC]" : "border-t border-dashed border-[#F2F2F2]"} ${slotIndex === 0 ? "border-t-0" : ""}`}
                                    style={{ height: SLOT_HEIGHT }}
                                  />
                                );
                              })}
                            </div>

                            {todayScheduleDay.events.map((event) => {
                              const { start, end } = parseEventRangeToMinutes(event.time);
                              const clippedStart = Math.max(start, WEEK_VISIBLE_START_MINUTES);
                              const clippedEnd = Math.min(end, 24 * 60);
                              if (clippedEnd <= clippedStart) return null;
                              const top =
                                ((clippedStart - WEEK_VISIBLE_START_MINUTES) / SLOT_MINUTES) * SLOT_HEIGHT +
                                WEEK_TOP_BUFFER;
                              const height = Math.max(
                                SLOT_HEIGHT - 2,
                                ((clippedEnd - clippedStart) / SLOT_MINUTES) * SLOT_HEIGHT - 2,
                              );
                              const summary = getEventSummary(event.label);
                              const reason = getAppointmentReason(event.tone, event.label);

                              return (
                                <div
                                  key={`today-${event.time}-${event.label}`}
                                  className={`absolute left-2 right-2 overflow-hidden rounded-[10px] px-2 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${eventCardGradientClass(event.tone, productBrown)}`}
                                  style={{ top, height }}
                                >
                                  <div className="flex min-h-0 flex-col gap-0.5">
                                    <p className="truncate text-[11px] font-semibold leading-snug tracking-tight text-white">
                                      {summary.primary}
                                    </p>
                                    <p
                                      className={`text-[10px] font-medium leading-snug text-[#F7EFE4] ${
                                        height < SLOT_HEIGHT * 1.75 ? "truncate" : "line-clamp-2"
                                      }`}
                                    >
                                      {shortenEventLabel(reason, height < SLOT_HEIGHT * 2 ? 42 : 120)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : timeView === "Year" ? (
                    <div className="flex min-h-0 min-w-[980px] flex-1 flex-col overflow-hidden rounded-xl border border-[#EAEAEA] bg-white">
                      <div className="shrink-0 border-b border-[#EAEAEA] bg-[#FAFAFA] px-4 py-2.5">
                        <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                          {YEAR_VIEW_YEAR}
                        </p>
                      </div>
                      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {YEAR_MONTH_LABELS.map((monthName, monthIndex) => {
                            const cells = buildYearMonthCells(YEAR_VIEW_YEAR, monthIndex);
                            return (
                              <div
                                key={monthName}
                                className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white"
                              >
                                <div className="border-b border-[#DCDCDC] bg-[#EBEBEB] px-2 py-2 text-center">
                                  <p className="text-[11px] font-semibold text-neutral-600">{monthName}</p>
                                </div>
                                <div className="bg-white px-2 pb-2 pt-1.5">
                                <div className="grid grid-cols-7 gap-y-0.5 text-[8px] font-medium uppercase text-neutral-400">
                                  {monthWeekdays.map((wd) => (
                                    <div key={wd} className="text-center">
                                      {wd.slice(0, 1)}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-1 grid grid-cols-7 gap-y-0.5">
                                  {cells.map((cell, idx) => {
                                    if (!cell) {
                                      return <div key={`e-${idx}`} className="min-h-[32px]" />;
                                    }
                                    const evs = eventsByDateKey.get(cell.dateKey);
                                    const hasEvents = evs != null && evs.length > 0;
                                    const isToday = cell.dateKey === TODAY_DATE_KEY;
                                    return (
                                      <div
                                        key={cell.dateKey}
                                        className="flex min-h-[32px] flex-col items-center justify-start pt-0.5"
                                      >
                                        <span
                                          className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold tabular-nums ${
                                            isToday
                                              ? "bg-[#E8D4B5]/35 text-[#9B6A3F]"
                                              : "text-neutral-700"
                                          }`}
                                        >
                                          {cell.day}
                                        </span>
                                        <div className="flex h-2 flex-col items-center justify-end">
                                          {hasEvents ? (
                                            <span className="h-1 w-1 rounded-full bg-[#C9A06E]" aria-hidden />
                                          ) : null}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                  </>
                ) : workspaceView === "inbox" ? (
                  <>
                    <header
                      className={`flex items-center gap-2 border-b px-4 py-3 ${
                        productBrownInbox
                          ? `${inboxUi!.line} ${inboxUi!.canvas}`
                          : productBrown
                            ? "border-[rgba(61,46,31,0.14)] bg-[#f5e6d0]"
                            : "border-[#EFEFEF]"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] ${
                          productBrownInbox
                            ? inboxUi!.iconMuted
                            : productBrown
                              ? "text-[rgba(61,46,31,0.48)]"
                              : "text-neutral-500"
                        }`}
                      >
                        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                      </Icon>
                      <h1
                        className={`text-[15px] font-semibold tracking-tight ${
                          productBrownInbox ? inboxUi!.ink : productBrown ? "text-[#1a1208]" : "text-neutral-900"
                        }`}
                      >
                        Inbox
                      </h1>
                    </header>
                    <div
                      className={`shrink-0 w-full border-b border-dashed px-4 py-2 ${
                        productBrownInbox
                          ? `${inboxUi!.line} ${inboxUi!.toolbar}`
                          : productBrown
                            ? "border-[rgba(61,46,31,0.14)] bg-[#faf0d8]"
                            : "border-[#E8E8E8] bg-white"
                      }`}
                    >
                      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        <div
                          className={`rounded-[14px] border p-0.5 ${
                            productBrownInbox
                              ? `${inboxUi!.line} ${inboxUi!.track}`
                              : "border-[#ECECEC] bg-[#F7F7F7]"
                          }`}
                        >
                          <div className="overflow-x-auto">
                            <div className="flex min-w-max gap-0.5 pr-0.5">
                              {(productBrownInbox
                                ? [
                                    { name: "Jamie Chen", team: "Northside", swatch: "from-[#8A7B6E] to-[#5C5048]" },
                                    { name: "R. Okonkwo", team: "Riverside", swatch: "from-[#7D7168] to-[#554C45]" },
                                    { name: "Ana Lopez", team: "Labs desk", swatch: "from-[#8F8278] to-[#5E564F]" },
                                    { name: "M. Patel", team: "Front office", swatch: "from-[#867A70] to-[#524A44]" },
                                  ]
                                : [
                                    { name: "Jamie Chen", team: "Northside", swatch: "from-[#E3B468] to-[#A8794B]" },
                                    { name: "R. Okonkwo", team: "Riverside", swatch: "from-[#E5AF63] to-[#BC6948]" },
                                    { name: "Ana Lopez", team: "Labs desk", swatch: "from-[#D38964] to-[#906A54]" },
                                    { name: "M. Patel", team: "Front office", swatch: "from-[#9A936F] to-[#6D654C]" },
                                  ]
                              ).map((agent, idx) => (
                                <div
                                  key={agent.name}
                                  className={`flex h-[54px] min-w-[168px] items-center gap-2.5 rounded-[12px] px-3 ${
                                    idx === 0
                                      ? productBrownInbox
                                        ? inboxUi!.agentActive
                                        : productBrownDarkWorkspace
                                          ? "bg-[#3d2e1f] text-[#f5e6d0] shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                                          : "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                                      : productBrownInbox
                                        ? inboxUi!.agentInactive
                                        : productBrownDarkWorkspace
                                          ? "bg-[#322618] text-[rgba(245,230,208,0.78)]"
                                          : "bg-[#FBFBFB] text-neutral-700"
                                  }`}
                                >
                                  <span
                                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${agent.swatch}`}
                                    aria-hidden
                                  >
                                    <span
                                      className={`h-3 w-3 rounded-full border ${
                                        productBrownInbox
                                          ? inboxUi!.avatarRing
                                          : "border-white/70 bg-white/35"
                                      }`}
                                    />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-[11px] font-semibold">{agent.name}</span>
                                    <span
                                      className={`block truncate text-[10px] ${
                                        productBrownInbox ? inboxUi!.mutedText : "text-neutral-500"
                                      }`}
                                    >
                                      {agent.team}
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`rounded-[14px] border p-0.5 ${
                            productBrownInbox
                              ? `${inboxUi!.line} ${inboxUi!.track}`
                              : "border-[#ECECEC] bg-[#F7F7F7]"
                          }`}
                        >
                          <div className="grid grid-cols-4 gap-0.5">
                            {(["Labs", "Referrals", "Office", "Patients"] as const).map((label, idx) => (
                              <div
                                key={label}
                                className={`flex h-[54px] flex-col items-center justify-center rounded-[12px] px-2 text-[10px] font-medium sm:text-[11px] ${
                                  idx === 1
                                    ? productBrownInbox
                                      ? inboxUi!.agentActive
                                      : productBrownDarkWorkspace
                                        ? "bg-[#3d2e1f] text-[#f5e6d0] shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                                        : "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                                    : productBrownInbox
                                      ? inboxUi!.agentInactive
                                      : productBrownDarkWorkspace
                                        ? "text-[rgba(245,230,208,0.48)]"
                                        : "text-neutral-500"
                                }`}
                              >
                                <span
                                  className={`mb-1 h-1.5 w-10 rounded-full ${
                                    idx === 1
                                      ? productBrownInbox
                                        ? inboxUi!.tabIndicator
                                        : "bg-gradient-to-r from-[#8A7B6E] to-[#5C5048]"
                                      : productBrownInbox
                                        ? inboxUi!.tabIndicatorMuted
                                        : "bg-[#E6E6E6]"
                                  }`}
                                  aria-hidden
                                />
                                {label}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                      <div
                        className={`flex min-h-0 min-w-0 flex-col border-r ${
                          productBrownInbox
                            ? `${inboxUi!.line} ${inboxUi!.sand}`
                            : productBrownDarkWorkspace
                              ? "border-[rgba(245,230,208,0.08)] bg-[#2a1f12]"
                              : "border-[#F2F2F2] bg-white"
                        }`}
                      >
                        <div
                          className={`sticky top-0 z-10 flex h-[58px] shrink-0 items-center justify-between gap-2 border-b px-3 sm:px-4 ${
                            productBrownInbox
                              ? `${inboxUi!.line} ${inboxUi!.canvas}`
                              : productBrownDarkWorkspace
                                ? "border-[rgba(245,230,208,0.08)] bg-[#322618]"
                                : "border-[#F2F2F2] bg-white"
                          }`}
                        >
                          <div
                            className={`inline-flex h-[38px] min-w-0 flex-1 rounded-[14px] border p-0.5 ${
                              productBrownInbox
                                ? `${inboxUi!.line} ${inboxUi!.track}`
                                : productBrownDarkWorkspace
                                  ? "border-[rgba(245,230,208,0.12)] bg-[#241910]"
                                  : "border-[#ECECEC] bg-[#F7F7F7]"
                            }`}
                          >
                            {(["all", "unread", "pinned"] as const).map((key) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setInboxFilter(key)}
                                className={`flex h-full min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] px-1.5 text-center text-[10px] font-medium transition-all sm:px-3 sm:text-[11px] ${
                                  inboxFilter === key
                                    ? productBrownInbox
                                      ? inboxUi!.filterActive
                                      : productBrownDarkWorkspace
                                        ? "bg-[#3d2e1f] text-[#f5e6d0] shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                                        : "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                                    : productBrownInbox
                                      ? inboxUi!.filterInactive
                                      : productBrownDarkWorkspace
                                        ? "text-[rgba(245,230,208,0.48)] hover:text-[#f5e6d0]"
                                        : "text-neutral-500 hover:text-neutral-700"
                                }`}
                              >
                                {key === "pinned" ? (
                                  <InboxPinIcon
                                    className={
                                      productBrownInbox
                                        ? inboxUi!.pinIcon
                                        : "h-3 w-3 shrink-0 opacity-80"
                                    }
                                  />
                                ) : null}
                                {key === "all" ? "All" : key === "unread" ? "Unread" : "Pinned"}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            className={`inline-flex h-[38px] shrink-0 items-center justify-center rounded-[14px] border px-3.5 text-[12px] font-medium transition-colors ${
                              productBrownInbox
                                ? inboxUi!.composeBtn
                                : productBrownDarkWorkspace
                                  ? "border-[rgba(245,230,208,0.12)] bg-[#322618] text-[#f5e6d0] shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-[#3d2e1f]"
                                  : "border-[#E2E2E2] bg-white text-neutral-800 shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-neutral-50"
                            }`}
                          >
                            Compose
                          </button>
                        </div>
                        <div
                          className={`min-h-0 flex-1 overflow-y-auto ${
                            productBrownInbox
                              ? inboxUi!.canvas
                              : productBrownDarkWorkspace
                                ? "bg-[#2a1f12]"
                                : "bg-white"
                          }`}
                        >
                          {filteredInbox.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                              <p
                                className={`text-[13px] font-semibold tracking-tight ${
                                  productBrownInbox ? inboxUi!.ink : "text-neutral-900"
                                }`}
                              >
                                All caught up
                              </p>
                              <p
                                className={`mt-1 max-w-[200px] text-[12px] leading-relaxed ${
                                  productBrownInbox ? inboxUi!.mutedText : "text-neutral-500"
                                }`}
                              >
                                Nothing matches this filter.
                              </p>
                            </div>
                          ) : (
                            <>
                              {pinnedInboxThread ? (
                                <div
                                  className={`sticky top-0 z-[5] ${
                                    productBrownInbox
                                      ? inboxUi!.canvas
                                      : productBrownDarkWorkspace
                                        ? "bg-[#322618]"
                                        : productBrown
                                          ? "bg-[#f5e6d0]"
                                          : "bg-white"
                                  }`}
                                >
                                  <InboxThreadListRow
                                    t={pinnedInboxThread}
                                    isActive={selectedInbox?.id === pinnedInboxThread.id}
                                    onSelect={() => setSelectedInboxId(pinnedInboxThread.id)}
                                    showPin
                                    brownTheme={productBrownInbox ? true : productBrownDarkWorkspace ? "dark" : productBrown}
                                  />
                                </div>
                              ) : null}
                              {inboxThreadsScrollList.map((t) => (
                                <InboxThreadListRow
                                  key={t.id}
                                  t={t}
                                  isActive={selectedInbox?.id === t.id}
                                  onSelect={() => setSelectedInboxId(t.id)}
                                  brownTheme={productBrownInbox ? true : productBrownDarkWorkspace ? "dark" : productBrown}
                                />
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      <div
                        className={`relative flex min-h-0 min-w-0 flex-col ${
                          productBrownInbox
                            ? inboxUi!.reading
                            : productBrownDarkWorkspace
                              ? "bg-[#241910]"
                              : "bg-white"
                        }`}
                      >
                        {selectedInbox ? (
                          <div
                            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
                              productBrownInbox
                                ? inboxUi!.reading
                                : productBrownDarkWorkspace
                                  ? "bg-[#241910]"
                                  : "bg-white"
                            }`}
                          >
                            <div
                              className={`flex h-[86px] shrink-0 flex-col justify-center border-b px-3 sm:px-4 ${
                                productBrownInbox
                                  ? `${inboxUi!.line} ${inboxUi!.toolbar}`
                                  : productBrownDarkWorkspace
                                    ? "border-[rgba(245,230,208,0.08)] bg-[#322618]"
                                    : "border-[#F2F2F2] bg-[#FAFAFA]/50"
                              }`}
                            >
                              <h2
                                className={`line-clamp-1 min-w-0 text-[16px] font-semibold leading-tight tracking-tight ${
                                  productBrownInbox ? inboxUi!.ink : "text-neutral-950"
                                }`}
                              >
                                {selectedInbox.subject}
                              </h2>
                              <p
                                className={`mt-1 truncate text-[12px] font-medium tabular-nums ${
                                  productBrownInbox ? inboxUi!.mutedText : "text-neutral-400"
                                }`}
                              >
                                {selectedInbox.messages.length} messages ·{" "}
                                {selectedInbox.messages.reduce(
                                  (sum, msg) => sum + inboxMessageAttachmentsList(msg).length,
                                  0,
                                )}{" "}
                                attachments · Thread activity {selectedInbox.time}
                              </p>
                            </div>
                            <div className="min-h-0 flex-1 overflow-y-auto">
                              <div>
                                {selectedInbox.messages.map((msg) => {
                                  const attachments = inboxMessageAttachmentsList(msg);
                                  const affiliation = inboxSenderAffiliation(msg.from);
                                  return (
                                    <div
                                      key={msg.id}
                                      className={`border-b last:border-b-0 ${
                                        productBrownInbox
                                          ? `${inboxUi!.messageBorder} ${inboxUi!.cream}`
                                          : productBrownDarkWorkspace
                                            ? "border-[rgba(245,230,208,0.08)] bg-[#241910]"
                                            : "border-[#F0F0F0] bg-white"
                                      }`}
                                    >
                                      <div className="px-3 py-4 sm:px-4">
                                        <div className="flex gap-3">
                                          <div
                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${inboxMessageAvatarClass(msg.from, productBrownInbox)}`}
                                          >
                                            {inboxSenderInitials(msg.from)}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="min-w-0">
                                                <p
                                                  className={`text-[14px] font-semibold leading-snug ${
                                                    productBrownInbox ? inboxUi!.ink : "text-neutral-900"
                                                  }`}
                                                >
                                                  {inboxSenderNameLine(msg.from)}
                                                </p>
                                                {affiliation ? (
                                                  <p
                                                    className={`mt-0.5 text-[12px] leading-snug ${
                                                      productBrownInbox ? inboxUi!.mutedText : "text-neutral-500"
                                                    }`}
                                                  >
                                                    {affiliation}
                                                  </p>
                                                ) : null}
                                                <div
                                                  className={`mt-2.5 max-w-md rounded-md border px-2.5 py-1.5 ${
                                                    productBrownInbox
                                                      ? inboxUi!.emailQuote
                                                      : productBrownDarkWorkspace
                                                        ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                                                        : "border-[#EDEAE6] bg-[#FAFAF8]"
                                                  }`}
                                                >
                                                  <p
                                                    className={`break-all text-[11px] leading-relaxed ${
                                                      productBrownInbox
                                                        ? inboxUi!.emailQuoteText
                                                        : "text-neutral-600"
                                                    } ${inter.className}`}
                                                  >
                                                    {inboxMessageEmail(msg)}
                                                  </p>
                                                </div>
                                              </div>
                                              <p
                                                className={`shrink-0 pt-0.5 text-right text-[11px] font-medium tabular-nums ${
                                                  productBrownInbox ? inboxUi!.mutedText : "text-neutral-400"
                                                }`}
                                              >
                                                {msg.time}
                                              </p>
                                            </div>
                                            <div
                                              className={`mt-3 h-px w-full ${
                                                productBrownInbox
                                                  ? inboxUi!.divider
                                                  : productBrownDarkWorkspace
                                                    ? "bg-[rgba(245,230,208,0.1)]"
                                                    : "bg-[#ECE8E2]"
                                              }`}
                                              aria-hidden
                                            />
                                            <div
                                              className={`mt-3 max-w-none whitespace-pre-wrap text-[14px] leading-[1.75] ${
                                                productBrownInbox ? inboxUi!.inkSoft : "text-neutral-800"
                                              }`}
                                            >
                                              {msg.body}
                                            </div>
                                            {attachments.length > 0 ? (
                                              <ul className="mt-4 flex flex-wrap gap-2">
                                                {attachments.map((file) => (
                                                  <li key={file.name}>
                                                    <button
                                                      type="button"
                                                      className={`inline-flex max-w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors ${
                                                        productBrownInbox
                                                          ? `${inboxUi!.chip} ${inboxUi!.chipHover}`
                                                          : "border-[#E8E4E0] bg-white text-neutral-800 hover:border-[#D4CFC8] hover:bg-[#FAFAF8]"
                                                      }`}
                                                    >
                                                      <span
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${inboxAvatarGradientClass(file.name, productBrownInbox)}`}
                                                        aria-hidden
                                                      >
                                                        <Icon className={`h-4 w-4 ${productBrownInbox ? "text-[#f5efe8]" : "text-white"}`}>
                                                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.38-8.38a4 4 0 0 1 5.66 5.66l-8.38 8.38a2 2 0 0 1-2.83-2.83l7.07-7.07" />
                                                        </Icon>
                                                      </span>
                                                      <span className="min-w-0 flex items-center gap-2">
                                                        <span className="truncate font-medium">{file.name}</span>
                                                        <span
                                                          className={`shrink-0 text-[11px] font-medium ${
                                                            productBrownInbox
                                                              ? inboxUi!.mutedText
                                                              : "text-neutral-400"
                                                          }`}
                                                        >
                                                          {file.size}
                                                        </span>
                                                      </span>
                                                    </button>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : null}
                                            <div className="mt-5 flex flex-wrap items-center justify-end gap-1.5">
                                              <div
                                                className={
                                                  productBrownInbox
                                                    ? inboxUi!.actionBar
                                                    : "inline-flex items-center gap-0.5 rounded-full border border-[#E8E4E0] bg-[#FAFAFA] p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                                                }
                                              >
                                                <button
                                                  type="button"
                                                  title="Reply to this message"
                                                  className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-semibold ${
                                                    productBrownInbox
                                                      ? inboxUi!.actionBtn
                                                      : "text-neutral-700 transition-colors hover:bg-white hover:text-neutral-900"
                                                  }`}
                                                >
                                                  <Icon className="h-3.5 w-3.5">
                                                    <path d="M9 14 4 9l5-5" />
                                                    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                                                  </Icon>
                                                  Reply
                                                </button>
                                                <button
                                                  type="button"
                                                  title="Forward this message"
                                                  className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-semibold ${
                                                    productBrownInbox
                                                      ? inboxUi!.actionBtn
                                                      : "text-neutral-700 transition-colors hover:bg-white hover:text-neutral-900"
                                                  }`}
                                                >
                                                  <Icon className="h-3.5 w-3.5">
                                                    <path d="M4 12v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" />
                                                    <polyline points="16 6 12 2 8 6" />
                                                    <line x1="12" x2="12" y1="2" y2="15" />
                                                  </Icon>
                                                  Forward
                                                </button>
                                              </div>
                                              <button
                                                type="button"
                                                title="Flag for follow-up"
                                                className={
                                                  productBrownInbox
                                                    ? inboxUi!.iconBtn
                                                    : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4E0] bg-[#FAFAFA] text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-white hover:text-[#9B6A3F]"
                                                }
                                              >
                                                <Icon className="h-3.5 w-3.5">
                                                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                                  <line x1="4" x2="4" y1="22" y2="15" />
                                                </Icon>
                                              </button>
                                              <button
                                                type="button"
                                                title="Print this message"
                                                className={
                                                  productBrownInbox
                                                    ? inboxUi!.iconBtnNeutral
                                                    : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4E0] bg-[#FAFAFA] text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-white hover:text-neutral-700"
                                                }
                                              >
                                                <Icon className="h-3.5 w-3.5">
                                                  <polyline points="6 9 6 2 18 2 18 9" />
                                                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                  <rect width="12" height="8" x="6" y="14" />
                                                </Icon>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
                            <span
                              className={
                                productBrownInbox
                                  ? inboxUi!.emptyIcon
                                  : "rounded-full border border-[#ECECEC] bg-white p-3 shadow-sm"
                              }
                            >
                              <Icon
                                className={
                                  productBrownInbox ? inboxUi!.emptyIconGlyph : "h-6 w-6 text-neutral-300"
                                }
                              >
                                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                              </Icon>
                            </span>
                            <p
                              className={`mt-4 text-[15px] font-semibold tracking-tight ${
                                productBrownInbox ? inboxUi!.ink : "text-neutral-900"
                              }`}
                            >
                              Select a message
                            </p>
                            <p
                              className={`mt-1 max-w-[220px] text-[12px] leading-relaxed ${
                                productBrownInbox ? inboxUi!.mutedText : "text-neutral-500"
                              }`}
                            >
                              Choose a thread on the left to read the full note.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <header
                      className={`flex shrink-0 items-center gap-2 border-b px-4 py-3 ${
                        productBrownDarkWorkspace
                          ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                          : "border-[#EFEFEF]"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          productBrownDarkWorkspace ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-500"
                        }`}
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </Icon>
                      <h1
                        className={`text-[15px] font-semibold tracking-tight ${
                          productBrownDarkWorkspace ? "text-[#f5e6d0]" : "text-neutral-900"
                        }`}
                      >
                        Patients
                      </h1>
                    </header>
                    <div
                      className={`flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed px-4 py-2 text-[12px] ${inter.className} ${
                        productBrownDarkWorkspace
                          ? "border-[rgba(245,230,208,0.1)] bg-[#2a1f12]"
                          : "border-[#E8E8E8] bg-white"
                      }`}
                    >
                      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        {(
                          [
                            { id: "all" as const, label: "All Patients" },
                            { id: "today" as const, label: "Today's Patients" },
                          ] as const
                        ).map((seg, idx) => (
                          <span key={seg.id} className="inline-flex items-center gap-2">
                            {idx > 0 ? (
                              <span className="select-none text-[13px] font-light text-neutral-300" aria-hidden>
                                /
                              </span>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => setPatientListScope(seg.id)}
                              className={`rounded-sm px-0.5 py-0.5 text-left transition-colors ${
                                patientListScope === seg.id
                                  ? seg.id === "today"
                                    ? "font-normal text-neutral-900"
                                    : "font-semibold text-neutral-900"
                                  : "font-normal text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              {seg.label}
                            </button>
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-2">
                          <span className="select-none text-[13px] font-light text-neutral-300" aria-hidden>
                            /
                          </span>
                          <div ref={patientPickerRef} className="relative">
                            <button
                              type="button"
                              aria-expanded={patientPickerOpen}
                              aria-haspopup="listbox"
                              onClick={() => setPatientPickerOpen((o) => !o)}
                              className="inline-flex max-w-[min(100vw-12rem,14rem)] items-center gap-1 rounded px-0.5 py-0.5 text-left text-[12px] font-semibold text-neutral-900 hover:text-neutral-700"
                            >
                              <span className="truncate">{selectedPatientRow.name}</span>
                              <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden>
                                <path d="m6 9 6 6 6-6" />
                              </Icon>
                            </button>
                            {patientPickerOpen ? (
                              <div
                                className={`absolute left-0 top-full z-50 mt-1 w-[min(calc(100vw-2rem),18rem)] overflow-hidden rounded-md border py-1 shadow-md ${
                                  productBrownDarkWorkspace
                                    ? "border-[rgba(245,230,208,0.12)] bg-[#322618]"
                                    : "border-neutral-200 bg-white"
                                }`}
                                role="listbox"
                              >
                                <ul className="max-h-[min(50vh,240px)] overflow-y-auto">
                                  {patientDayRows.map((row) => {
                                    const selected = row.id === selectedPatientId;
                                    return (
                                      <li key={row.id} role="none">
                                        <button
                                          type="button"
                                          role="option"
                                          aria-selected={selected}
                                          onClick={() => {
                                            setSelectedPatientId(row.id);
                                            setPatientPickerOpen(false);
                                          }}
                                          className={`w-full px-3 py-2 text-left text-[12px] transition-colors ${
                                            selected
                                              ? productBrownDarkWorkspace
                                                ? "bg-[#3d2e1f] text-[#f5e6d0]"
                                                : "bg-neutral-100 text-neutral-900"
                                              : productBrownDarkWorkspace
                                                ? "text-[rgba(245,230,208,0.78)] hover:bg-[#3a2a1c]"
                                                : "text-neutral-800 hover:bg-neutral-50"
                                          }`}
                                        >
                                          <div className="truncate font-medium">{row.name}</div>
                                          <div className="mt-0.5 truncate text-[11px] text-neutral-500">
                                            {row.timeLabel} · {row.reason}
                                          </div>
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-row overflow-hidden bg-white">
                      {!patientIdentityMinimized ? (
                        <div className="flex w-1/2 min-w-0 shrink-0 flex-col p-3 transition-[width] duration-300 ease-out sm:p-4">
                          <div
                            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#1E343A] p-7 transition-all duration-300 ease-out sm:p-10 ${inter.className}`}
                          >
                            <div
                              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
                              style={patientExpandedIdentityBackgroundStyle}
                              aria-hidden
                            />
                            <div
                              className="pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:28px_28px] opacity-[0.35]"
                              aria-hidden
                            />
                            <svg
                              className="pointer-events-none absolute inset-0 z-[1] h-full w-full rounded-2xl mix-blend-soft-light"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden
                            >
                              <defs>
                                <filter
                                  id="patientExpandedIdentityGrain"
                                  x="-10%"
                                  y="-10%"
                                  width="120%"
                                  height="120%"
                                >
                                  <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.72"
                                    numOctaves="3"
                                    stitchTiles="stitch"
                                    result="grain"
                                  />
                                  <feColorMatrix
                                    in="grain"
                                    type="saturate"
                                    values="0"
                                    result="mono"
                                  />
                                </filter>
                              </defs>
                              <rect
                                width="100%"
                                height="100%"
                                filter="url(#patientExpandedIdentityGrain)"
                                fill="white"
                                opacity="0.22"
                              />
                            </svg>
                            <button
                              type="button"
                              aria-label="Minimize patient header"
                              title="Minimize"
                              onClick={() => setPatientIdentityMinimized(true)}
                              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white shadow-sm backdrop-blur-[2px] transition-colors hover:bg-white/25"
                            >
                              <Icon className="h-3.5 w-3.5 text-white">
                                <path d="M5 12h14" />
                              </Icon>
                            </button>
                            <div className="relative z-[2] flex min-h-0 flex-1 flex-col">
                              {selectedPatientRow ? (
                                <div className="max-w-[min(100%,20rem)] shrink-0 pr-10 text-left">
                                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
                                    {ordinalAppointmentLabel(selectedAppointmentOrdinal)}
                                  </p>
                                  <p className="mt-2.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white/70 tabular-nums">
                                    {selectedPatientRow.timeLabel}
                                  </p>
                                  <p className="mt-2.5 line-clamp-2 max-w-full text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-white/55">
                                    {selectedPatientRow.reason}
                                  </p>
                                </div>
                              ) : null}
                              <div className="mt-auto flex w-full flex-col items-end justify-end text-right">
                                <p className="text-[11px] font-normal uppercase tracking-[0.12em] text-white/50">
                                  Patients
                                </p>
                                <p className="mt-3 text-[13px] font-normal tabular-nums tracking-wide text-white/75">
                                  MRN {selectedPatientRow.patientNumber}
                                </p>
                                <p className="mt-2.5 text-[clamp(1.5rem,4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
                                  {selectedPatientRow.name}
                                </p>
                                <p className="mt-3 max-w-[min(100%,20rem)] text-[14px] font-normal leading-[1.45] text-white/80">
                                  Male · 37 · DOB 14 Mar 1988
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <div
                        className={`min-h-0 flex-1 overflow-y-auto px-4 py-5 transition-all duration-300 ease-out sm:px-5 ${
                          patientIdentityMinimized ? "min-w-0 w-full" : "w-1/2 min-w-0"
                        } ${inter.className}`}
                      >
                        <div
                          className={
                            patientIdentityMinimized
                              ? "mx-auto grid w-full max-w-none grid-cols-1 gap-3 pb-24 transition-all duration-300 ease-out sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
                              : "mx-auto max-w-[560px] space-y-10 pb-24 transition-all duration-300 ease-out"
                          }
                        >
                          {patientIdentityMinimized ? (
                            <div
                              className={`relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E8E8E8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:col-span-2 lg:col-span-2 ${inter.className}`}
                            >
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] transition-opacity duration-300"
                                aria-hidden
                              />
                              <button
                                type="button"
                                aria-label="Expand patient header"
                                title="Expand"
                                onClick={() => setPatientIdentityMinimized(false)}
                                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white shadow-sm backdrop-blur-[2px] transition-colors hover:bg-white/25"
                              >
                                <Icon className="h-3.5 w-3.5 text-white">
                                  <path d="M15 3h6v6M9 21H3v-6" />
                                  <path d="M21 3l-7 7M3 21l7-7" />
                                </Icon>
                              </button>
                              <div className="relative z-[1] flex flex-col justify-end p-4">
                                <div className="flex w-full flex-col items-end gap-1 text-right">
                                  <p className="text-[9px] font-normal uppercase tracking-[0.14em] text-white/50">
                                    Patient record
                                  </p>
                                  <p className="text-[11px] font-normal tabular-nums text-white/75">
                                    MRN 908421
                                  </p>
                                  <p className="text-[18px] font-medium leading-tight tracking-[-0.02em] text-white">
                                    James Lisondra
                                  </p>
                                  <p className="text-[11px] font-normal leading-snug text-white/80">
                                    37 · Male · 14 Mar 1988
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-2`
                                : undefined
                            }
                          >
                            {patientIdentityMinimized ? (
                              <>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                      HBA1C
                                    </p>
                                    <p className="mt-0.5 text-[10px] font-normal tabular-nums text-neutral-400">
                                      6 mo
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[26px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
                                      6.9
                                    </p>
                                    <p className="mt-0.5 text-[10px] font-normal text-neutral-500">
                                      &lt; 7 goal
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <svg
                                    viewBox="0 0 280 88"
                                    className="h-[52px] w-full"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden
                                  >
                                    <defs>
                                      <linearGradient id="patientA1cLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#E7A944" />
                                        <stop offset="100%" stopColor="#1E343A" />
                                      </linearGradient>
                                    </defs>
                                    <line x1="40" y1="12" x2="268" y2="12" stroke="#F3F3F3" strokeWidth="1" />
                                    <line x1="40" y1="44" x2="268" y2="44" stroke="#F3F3F3" strokeWidth="1" />
                                    <line x1="40" y1="76" x2="268" y2="76" stroke="#F3F3F3" strokeWidth="1" />
                                    <line
                                      x1="40"
                                      y1="28"
                                      x2="268"
                                      y2="28"
                                      stroke="#E8E8E8"
                                      strokeWidth="1"
                                      strokeDasharray="4 4"
                                    />
                                    <polyline
                                      fill="none"
                                      stroke="url(#patientA1cLine)"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      points="44,24 86,34 128,42 170,46 212,44 254,44"
                                    />
                                    <circle cx="44" cy="24" r="3" fill="white" stroke="#C4A574" strokeWidth="1.5" />
                                    <circle cx="254" cy="44" r="3" fill="white" stroke="#1E343A" strokeWidth="1.5" />
                                    <text x="36" y="16" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      8
                                    </text>
                                    <text x="36" y="48" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      7
                                    </text>
                                    <text x="36" y="80" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      6
                                    </text>
                                  </svg>
                                  <div className="mt-0.5 flex justify-between pl-8 font-normal tabular-nums text-neutral-400 text-[9px]">
                                    <span>Oct</span>
                                    <span>Dec</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-baseline justify-between gap-3">
                                  <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                    HBA1C
                                  </p>
                                  <p className="text-[11px] font-normal tabular-nums text-neutral-400">
                                    Last 6 visits
                                  </p>
                                </div>
                                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                  <div className="min-w-0 flex-1">
                                    <svg
                                      viewBox="0 0 280 88"
                                      className="h-[100px] w-full"
                                      preserveAspectRatio="xMidYMid meet"
                                      aria-hidden
                                    >
                                      <defs>
                                        <linearGradient id="patientA1cLine" x1="0" y1="0" x2="1" y2="0">
                                          <stop offset="0%" stopColor="#E7A944" />
                                          <stop offset="100%" stopColor="#1E343A" />
                                        </linearGradient>
                                      </defs>
                                      <line x1="40" y1="12" x2="268" y2="12" stroke="#F3F3F3" strokeWidth="1" />
                                      <line x1="40" y1="44" x2="268" y2="44" stroke="#F3F3F3" strokeWidth="1" />
                                      <line x1="40" y1="76" x2="268" y2="76" stroke="#F3F3F3" strokeWidth="1" />
                                      <line
                                        x1="40"
                                        y1="28"
                                        x2="268"
                                        y2="28"
                                        stroke="#E8E8E8"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                      />
                                      <polyline
                                        fill="none"
                                        stroke="url(#patientA1cLine)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="44,24 86,34 128,42 170,46 212,44 254,44"
                                      />
                                      <circle cx="44" cy="24" r="3" fill="white" stroke="#C4A574" strokeWidth="1.5" />
                                      <circle cx="254" cy="44" r="3" fill="white" stroke="#1E343A" strokeWidth="1.5" />
                                      <text x="36" y="16" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        8
                                      </text>
                                      <text x="36" y="48" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        7
                                      </text>
                                      <text x="36" y="80" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        6
                                      </text>
                                    </svg>
                                    <div className="mt-1 flex justify-between pl-8 font-normal tabular-nums text-[10px] text-neutral-400">
                                      <span>Oct</span>
                                      <span>Dec</span>
                                      <span>Feb</span>
                                      <span>Mar</span>
                                    </div>
                                  </div>
                                  <div className="shrink-0 text-right sm:pl-4">
                                    <p className="text-[32px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
                                      6.9
                                    </p>
                                    <p className="mt-1 text-[12px] font-normal text-neutral-500">
                                      % · goal under 7
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-1`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Lipids · mg/dL
                            </p>
                            <div
                              className={
                                patientIdentityMinimized ? "mt-2 space-y-2" : "mt-5 space-y-4"
                              }
                            >
                              {(
                                [
                                  { label: "LDL-C", val: 112, max: 160, goal: 100, hint: null as string | null },
                                  { label: "HDL-C", val: 48, max: 80, goal: null, hint: "Target above 40" },
                                  { label: "TG", val: 140, max: 200, goal: 150, hint: null },
                                ] as const
                              ).map((row) =>
                                patientIdentityMinimized ? (
                                  <div key={row.label}>
                                    <div className="flex items-baseline justify-between gap-1 text-[11px]">
                                      <span className="font-normal text-neutral-600">{row.label}</span>
                                      <span className="min-w-0 text-right">
                                        <span className="tabular-nums text-neutral-900">{row.val}</span>
                                        {row.goal != null ? (
                                          <span className="ml-1 text-[9px] font-normal tabular-nums text-neutral-400">
                                            · goal &lt;{row.goal}
                                          </span>
                                        ) : null}
                                        {row.hint != null ? (
                                          <span className="ml-1 text-[9px] font-normal text-neutral-400">
                                            · {row.hint}
                                          </span>
                                        ) : null}
                                      </span>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#E7A944]/90 to-[#BF593D]/90"
                                        style={{ width: `${Math.min(100, (row.val / row.max) * 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div key={row.label}>
                                    <div className="flex items-baseline justify-between text-[12px]">
                                      <span className="font-normal text-neutral-600">{row.label}</span>
                                      <span className="tabular-nums text-neutral-900">{row.val}</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#E7A944]/90 to-[#BF593D]/90"
                                        style={{ width: `${Math.min(100, (row.val / row.max) * 100)}%` }}
                                      />
                                    </div>
                                    {row.goal != null ? (
                                      <p className="mt-1 text-[10px] font-normal tabular-nums text-neutral-400">
                                        Goal under {row.goal}
                                      </p>
                                    ) : null}
                                    {row.hint != null ? (
                                      <p className="mt-1 text-[10px] font-normal text-neutral-400">{row.hint}</p>
                                    ) : null}
                                  </div>
                                ),
                              )}
                            </div>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-1`
                                : undefined
                            }
                          >
                            {patientIdentityMinimized ? (
                              <>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                      eGFR
                                    </p>
                                    <p className="mt-0.5 text-[10px] font-normal tabular-nums text-neutral-400">
                                      CKD-EPI
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[24px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
                                      88
                                    </p>
                                    <p className="mt-0.5 text-[10px] font-normal text-neutral-500">G1</p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <svg
                                    viewBox="0 0 260 76"
                                    className="h-[48px] w-full"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden
                                  >
                                    <defs>
                                      <linearGradient id="patientEgfrStroke" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#94A3B8" />
                                        <stop offset="100%" stopColor="#1E343A" />
                                      </linearGradient>
                                    </defs>
                                    <line x1="36" y1="14" x2="248" y2="14" stroke="#F3F3F3" strokeWidth="1" />
                                    <line x1="36" y1="40" x2="248" y2="40" stroke="#F3F3F3" strokeWidth="1" />
                                    <line x1="36" y1="66" x2="248" y2="66" stroke="#F3F3F3" strokeWidth="1" />
                                    <polyline
                                      fill="none"
                                      stroke="url(#patientEgfrStroke)"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      points="40,52 88,48 136,44 184,42 232,42"
                                    />
                                    <circle cx="232" cy="42" r="3" fill="white" stroke="#1E343A" strokeWidth="1.5" />
                                    <text x="32" y="18" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      100
                                    </text>
                                    <text x="32" y="44" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      90
                                    </text>
                                    <text x="32" y="70" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                      80
                                    </text>
                                  </svg>
                                  <div className="mt-0.5 flex justify-between pl-9 font-normal tabular-nums text-neutral-400 text-[9px]">
                                    <span>Oct</span>
                                    <span>Dec</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-baseline justify-between gap-3">
                                  <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                    eGFR
                                  </p>
                                  <p className="text-[11px] font-normal tabular-nums text-neutral-400">
                                    CKD-EPI · annual
                                  </p>
                                </div>
                                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                  <div className="min-w-0 flex-1">
                                    <svg
                                      viewBox="0 0 260 76"
                                      className="h-[84px] w-full"
                                      preserveAspectRatio="xMidYMid meet"
                                      aria-hidden
                                    >
                                      <defs>
                                        <linearGradient id="patientEgfrStroke" x1="0" y1="0" x2="1" y2="0">
                                          <stop offset="0%" stopColor="#94A3B8" />
                                          <stop offset="100%" stopColor="#1E343A" />
                                        </linearGradient>
                                      </defs>
                                      <line x1="36" y1="14" x2="248" y2="14" stroke="#F3F3F3" strokeWidth="1" />
                                      <line x1="36" y1="40" x2="248" y2="40" stroke="#F3F3F3" strokeWidth="1" />
                                      <line x1="36" y1="66" x2="248" y2="66" stroke="#F3F3F3" strokeWidth="1" />
                                      <polyline
                                        fill="none"
                                        stroke="url(#patientEgfrStroke)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="40,52 88,48 136,44 184,42 232,42"
                                      />
                                      <circle cx="232" cy="42" r="3" fill="white" stroke="#1E343A" strokeWidth="1.5" />
                                      <text x="32" y="18" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        100
                                      </text>
                                      <text x="32" y="44" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        90
                                      </text>
                                      <text x="32" y="70" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                        80
                                      </text>
                                    </svg>
                                    <div className="mt-1 flex justify-between pl-9 font-normal tabular-nums text-[10px] text-neutral-400">
                                      <span>Oct</span>
                                      <span>Dec</span>
                                      <span>Feb</span>
                                      <span>Mar</span>
                                    </div>
                                  </div>
                                  <div className="shrink-0 text-right sm:pl-4">
                                    <p className="text-[28px] font-medium leading-none tabular-nums tracking-tight text-neutral-900">
                                      88
                                    </p>
                                    <p className="mt-1 text-[12px] font-normal text-neutral-500">mL/min · G1</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-2`
                                : undefined
                            }
                          >
                            <div className="flex items-baseline justify-between">
                              <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                Vitals
                              </p>
                              <p
                                className={`font-normal tabular-nums text-neutral-400 ${
                                  patientIdentityMinimized ? "text-[10px]" : "text-[11px]"
                                }`}
                              >
                                {patientIdentityMinimized ? "26 Mar" : "Office · 26 Mar"}
                              </p>
                            </div>
                            {patientIdentityMinimized ? (
                              <div className="mt-2 space-y-2">
                                {(
                                  [
                                    {
                                      label: "BP",
                                      unit: "mmHg",
                                      val: "128/82",
                                      spark: "M4 28 L20 22 L36 24 L52 18",
                                    },
                                    {
                                      label: "HR",
                                      unit: "bpm",
                                      val: "72",
                                      spark: "M4 20 L20 26 L36 22 L52 24",
                                    },
                                    {
                                      label: "Wt",
                                      unit: "kg",
                                      val: "82.6",
                                      spark: "M4 22 L20 20 L36 24 L52 26",
                                    },
                                  ] as const
                                ).map((v) => (
                                  <div
                                    key={v.label}
                                    className="flex min-w-0 items-center gap-2 border-b border-neutral-100 pb-2 last:border-b-0 last:pb-0"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[15px] font-medium leading-none tabular-nums text-neutral-900">
                                        {v.val}
                                      </p>
                                      <p className="mt-0.5 text-[9px] font-normal text-neutral-500">
                                        {v.label} · {v.unit}
                                      </p>
                                    </div>
                                    <svg
                                      viewBox="0 0 56 36"
                                      className="h-6 w-[72px] shrink-0 text-neutral-300"
                                      preserveAspectRatio="none"
                                      aria-hidden
                                    >
                                      <path d="M0 35 H56" stroke="currentColor" strokeWidth="1" />
                                      <path
                                        d={v.spark}
                                        fill="none"
                                        stroke="#9CA3AF"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-5 grid grid-cols-3 gap-3">
                                {(
                                  [
                                    {
                                      label: "BP",
                                      unit: "mmHg",
                                      val: "128/82",
                                      spark: "M4 28 L20 22 L36 24 L52 18",
                                    },
                                    {
                                      label: "HR",
                                      unit: "bpm",
                                      val: "72",
                                      spark: "M4 20 L20 26 L36 22 L52 24",
                                    },
                                    {
                                      label: "Wt",
                                      unit: "kg",
                                      val: "82.6",
                                      spark: "M4 22 L20 20 L36 24 L52 26",
                                    },
                                  ] as const
                                ).map((v) => (
                                  <div key={v.label} className="min-w-0">
                                    <svg
                                      viewBox="0 0 56 36"
                                      className="h-9 w-full text-neutral-300"
                                      preserveAspectRatio="none"
                                      aria-hidden
                                    >
                                      <path d="M0 35 H56" stroke="currentColor" strokeWidth="1" />
                                      <path
                                        d={v.spark}
                                        fill="none"
                                        stroke="#9CA3AF"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <p className="mt-1.5 text-[20px] font-medium leading-none tabular-nums text-neutral-900">
                                      {v.val}
                                    </p>
                                    <p className="mt-0.5 text-[11px] font-normal text-neutral-500">
                                      {v.label} · {v.unit}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-4`
                                : undefined
                            }
                          >
                            {patientIdentityMinimized ? (
                              <>
                                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                      Blood pressure
                                    </p>
                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] font-normal text-neutral-600">
                                      <span className="inline-flex items-center gap-1.5">
                                        <span className="h-1.5 w-3 rounded-sm bg-[#C4A574]" aria-hidden />
                                        Systolic
                                      </span>
                                      <span className="inline-flex items-center gap-1.5">
                                        <span className="h-1.5 w-3 rounded-sm bg-slate-500" aria-hidden />
                                        Diastolic
                                      </span>
                                    </div>
                                  </div>
                                  <p className="shrink-0 text-[10px] font-normal tabular-nums text-neutral-400">
                                    4 visits
                                  </p>
                                </div>
                                <svg
                                  viewBox="0 0 280 88"
                                  className="mt-2 h-[92px] w-full"
                                  preserveAspectRatio="xMidYMid meet"
                                  aria-hidden
                                >
                                  <line x1="40" y1="16" x2="264" y2="16" stroke="#F3F3F3" strokeWidth="1" />
                                  <line x1="40" y1="48" x2="264" y2="48" stroke="#F3F3F3" strokeWidth="1" />
                                  <line x1="40" y1="80" x2="264" y2="80" stroke="#F3F3F3" strokeWidth="1" />
                                  <polyline
                                    fill="none"
                                    stroke="#C4A574"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="48,28 104,32 160,30 216,34"
                                  />
                                  <polyline
                                    fill="none"
                                    stroke="#64748B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="48,58 104,54 160,56 216,52"
                                  />
                                  <text x="34" y="20" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    140
                                  </text>
                                  <text x="34" y="52" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    120
                                  </text>
                                  <text x="34" y="84" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    80
                                  </text>
                                </svg>
                                <div className="mt-1 flex justify-between pl-8 font-normal tabular-nums text-[9px] text-neutral-400">
                                  <span>Nov</span>
                                  <span>Jan</span>
                                  <span>Feb</span>
                                  <span>Mar</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                    Blood pressure
                                  </p>
                                  <p className="text-[11px] font-normal tabular-nums text-neutral-400">
                                    Seated · last 4 visits
                                  </p>
                                </div>
                                <svg
                                  viewBox="0 0 280 88"
                                  className="mt-5 h-[96px] w-full"
                                  preserveAspectRatio="xMidYMid meet"
                                  aria-hidden
                                >
                                  <line x1="40" y1="16" x2="264" y2="16" stroke="#F3F3F3" strokeWidth="1" />
                                  <line x1="40" y1="48" x2="264" y2="48" stroke="#F3F3F3" strokeWidth="1" />
                                  <line x1="40" y1="80" x2="264" y2="80" stroke="#F3F3F3" strokeWidth="1" />
                                  <polyline
                                    fill="none"
                                    stroke="#C4A574"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="48,28 104,32 160,30 216,34"
                                  />
                                  <polyline
                                    fill="none"
                                    stroke="#64748B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points="48,58 104,54 160,56 216,52"
                                  />
                                  <text x="34" y="20" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    140
                                  </text>
                                  <text x="34" y="52" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    120
                                  </text>
                                  <text x="34" y="84" fill="#D4D4D4" fontSize="8" textAnchor="end">
                                    80
                                  </text>
                                </svg>
                                <div className="mt-2 flex justify-between pl-8 font-normal tabular-nums text-[10px] text-neutral-400">
                                  <span>Nov</span>
                                  <span>Jan</span>
                                  <span>Feb</span>
                                  <span>Mar</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-6 text-[11px] font-normal">
                                  <span className="inline-flex items-center gap-2 text-neutral-600">
                                    <span className="h-2 w-4 rounded-sm bg-[#C4A574]" aria-hidden />
                                    Systolic
                                  </span>
                                  <span className="inline-flex items-center gap-2 text-neutral-600">
                                    <span className="h-2 w-4 rounded-sm bg-slate-500" aria-hidden />
                                    Diastolic
                                  </span>
                                </div>
                              </>
                            )}
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-2`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Schedule
                            </p>
                            <div className={patientIdentityMinimized ? "mt-3" : "mt-6"}>
                              <svg
                                viewBox="0 0 320 56"
                                className={
                                  patientIdentityMinimized ? "h-10 w-full" : "h-14 w-full"
                                }
                                preserveAspectRatio="xMidYMid meet"
                                aria-hidden
                              >
                                <line x1="24" y1="28" x2="296" y2="28" stroke="#E5E5E5" strokeWidth="2" />
                                <circle cx="80" cy="28" r="7" fill="white" stroke="#C4A574" strokeWidth="2" />
                                <circle cx="240" cy="28" r="7" fill="white" stroke="#1E343A" strokeWidth="2" />
                              </svg>
                              <div
                                className={`grid grid-cols-2 text-[12px] ${
                                  patientIdentityMinimized ? "-mt-0.5 gap-3" : "-mt-1 gap-6"
                                }`}
                              >
                                <div>
                                  <p
                                    className={`font-normal tabular-nums text-neutral-400 ${
                                      patientIdentityMinimized ? "text-[11px]" : ""
                                    }`}
                                  >
                                    Tue 9 Apr · 14:30
                                  </p>
                                  <p
                                    className={`mt-1 font-normal text-neutral-700 ${
                                      patientIdentityMinimized ? "text-[11px] leading-snug" : ""
                                    }`}
                                  >
                                    TTE echo · Riverside
                                  </p>
                                </div>
                                <div>
                                  <p
                                    className={`font-normal tabular-nums text-neutral-400 ${
                                      patientIdentityMinimized ? "text-[11px]" : ""
                                    }`}
                                  >
                                    Thu 16 Apr · 10:40
                                  </p>
                                  <p
                                    className={`mt-1 font-normal text-neutral-700 ${
                                      patientIdentityMinimized ? "text-[11px] leading-snug" : ""
                                    }`}
                                  >
                                    PCP follow-up
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-2`
                                : undefined
                            }
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                                Orders
                              </p>
                              <p className="text-[11px] font-normal tabular-nums text-neutral-400">Open</p>
                            </div>
                            <ul
                              className={
                                patientIdentityMinimized
                                  ? "mt-3 space-y-2 text-[12px]"
                                  : "mt-4 space-y-3 text-[13px]"
                              }
                            >
                              {(
                                [
                                  {
                                    title: "CBC with differential",
                                    sub: "Draw before echo · placed 28 Mar",
                                  },
                                  {
                                    title: "CMP",
                                    sub: "Fasting · same visit",
                                  },
                                  {
                                    title: "Lipid panel",
                                    sub: "Due annually · next in Jul",
                                  },
                                ] as const
                              ).map((row) => (
                                <li
                                  key={row.title}
                                  className="border-l-2 border-neutral-200 pl-3 font-normal leading-snug"
                                >
                                  <p className="text-neutral-800">{row.title}</p>
                                  <p
                                    className={`mt-0.5 text-neutral-500 ${
                                      patientIdentityMinimized ? "text-[10px]" : "text-[11px]"
                                    }`}
                                  >
                                    {patientIdentityMinimized
                                      ? row.sub
                                          .replace("Draw before echo · ", "")
                                          .replace("Due annually · ", "")
                                      : row.sub}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-4`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Chart
                            </p>
                            <ul
                              className={`${
                                patientIdentityMinimized
                                  ? "mt-3 max-h-44 space-y-2 overflow-y-auto pr-1"
                                  : "mt-4 space-y-4"
                              }`}
                            >
                              {(
                                [
                                  { d: "30 Mar", t: "Echo visit confirmed; location shared." },
                                  { d: "29 Mar", t: "Stress ECG reviewed — normal; echo still indicated." },
                                  { d: "28 Mar", t: "A1c reviewed; counseling window next quarter." },
                                  { d: "27 Mar", t: "Foot exam documented — monofilament intact." },
                                  { d: "26 Mar", t: "Portal message — metformin; triage for callback." },
                                ] as const
                              ).map((row) => (
                                <li
                                  key={row.d + row.t}
                                  className={`flex leading-relaxed ${
                                    patientIdentityMinimized
                                      ? "gap-2 text-[11px]"
                                      : "gap-4 text-[13px]"
                                  }`}
                                >
                                  <span className="w-[46px] shrink-0 pt-0.5 font-normal tabular-nums text-neutral-400 sm:w-[52px]">
                                    {row.d}
                                  </span>
                                  <span className="min-w-0 font-normal text-neutral-700">
                                    {patientIdentityMinimized ? (
                                      <span className="line-clamp-2">{row.t}</span>
                                    ) : (
                                      row.t
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-4`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Medications
                            </p>
                            <ul
                              className={
                                patientIdentityMinimized
                                  ? "mt-3 space-y-2 text-[12px]"
                                  : "mt-4 space-y-4 text-[13px]"
                              }
                            >
                              {(
                                [
                                  {
                                    name: "Metformin",
                                    dose: "1000 mg BID",
                                    sub: "Question logged — callback pending",
                                  },
                                  { name: "Lisinopril", dose: "10 mg daily", sub: "Renewal Mar 2026" },
                                  { name: "Rosuvastatin", dose: "20 mg QHS", sub: "Statin therapy" },
                                  { name: "Aspirin", dose: "81 mg daily", sub: "Secondary prevention" },
                                ] as const
                              ).map((m) => (
                                <li
                                  key={m.name}
                                  className={
                                    patientIdentityMinimized
                                      ? "border-b border-neutral-100 pb-2 last:border-b-0 last:pb-0"
                                      : "border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0"
                                  }
                                >
                                  <div className="flex items-baseline justify-between gap-4">
                                    <span className="min-w-0 font-normal text-neutral-800">{m.name}</span>
                                    <span className="shrink-0 text-right font-normal tabular-nums text-neutral-500">
                                      {m.dose}
                                    </span>
                                  </div>
                                  <p
                                    className={`mt-0.5 font-normal text-neutral-500 ${
                                      patientIdentityMinimized ? "text-[10px] line-clamp-1" : "mt-1 text-[11px]"
                                    }`}
                                  >
                                    {m.sub}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-1`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Problems
                            </p>
                            <p
                              className={`font-normal leading-[1.7] text-neutral-700 ${
                                patientIdentityMinimized
                                  ? "mt-2 text-[12px] leading-snug"
                                  : "mt-3 text-[13px]"
                              }`}
                            >
                              Type 2 diabetes · Hypertension · Mixed dyslipidemia
                            </p>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-1 lg:col-span-1`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Family history
                            </p>
                            <p
                              className={`font-normal leading-[1.7] text-neutral-700 ${
                                patientIdentityMinimized
                                  ? "mt-2 text-[12px] leading-snug"
                                  : "mt-3 text-[13px]"
                              }`}
                            >
                              Father · type 2 diabetes. Mother · hypertension.
                            </p>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-4`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Immunizations
                            </p>
                            <ul
                              className={
                                patientIdentityMinimized
                                  ? "mt-3 space-y-1.5 text-[12px]"
                                  : "mt-4 space-y-2.5 text-[13px]"
                              }
                            >
                              {(
                                [
                                  { name: "Influenza", when: "Oct 2025" },
                                  { name: "COVID-19", when: "Sep 2024" },
                                  { name: "Tdap", when: "Jun 2018" },
                                ] as const
                              ).map((v) => (
                                <li key={v.name} className="flex items-baseline justify-between gap-4 font-normal">
                                  <span className="text-neutral-800">{v.name}</span>
                                  <span className="shrink-0 tabular-nums text-neutral-500">{v.when}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {!patientIdentityMinimized ? (
                            <div className="h-px bg-neutral-200/90" />
                          ) : null}

                          <section
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} sm:col-span-2 lg:col-span-4`
                                : undefined
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Preventive
                            </p>
                            <div
                              className={
                                patientIdentityMinimized
                                  ? "mt-3 flex flex-wrap justify-center gap-6"
                                  : "mt-4 flex flex-wrap gap-8"
                              }
                            >
                              <div>
                                <svg
                                  viewBox="0 0 48 48"
                                  className={
                                    patientIdentityMinimized ? "mx-auto h-10 w-10" : "mx-auto h-12 w-12"
                                  }
                                  aria-hidden
                                >
                                  <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="#E5E5E5"
                                    strokeWidth="3"
                                  />
                                  <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="url(#patientPrevRing)"
                                    strokeWidth="3"
                                    strokeDasharray="88 126"
                                    strokeLinecap="round"
                                    transform="rotate(-90 24 24)"
                                  />
                                  <defs>
                                    <linearGradient id="patientPrevRing" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#E7A944" />
                                      <stop offset="100%" stopColor="#1E343A" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <p
                                  className={`text-center font-normal text-neutral-500 ${
                                    patientIdentityMinimized
                                      ? "mt-1 text-[10px]"
                                      : "mt-2 text-[11px]"
                                  }`}
                                >
                                  Wellness
                                </p>
                                <p
                                  className={`text-center font-normal tabular-nums text-neutral-800 ${
                                    patientIdentityMinimized ? "text-[11px]" : "text-[12px]"
                                  }`}
                                >
                                  Due 2027
                                </p>
                              </div>
                              <div>
                                <svg
                                  viewBox="0 0 48 48"
                                  className={
                                    patientIdentityMinimized ? "mx-auto h-10 w-10" : "mx-auto h-12 w-12"
                                  }
                                  aria-hidden
                                >
                                  <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E5E5" strokeWidth="3" />
                                  <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="#94A3B8"
                                    strokeWidth="3"
                                    strokeDasharray="125 126"
                                    strokeLinecap="round"
                                    transform="rotate(-90 24 24)"
                                  />
                                </svg>
                                <p
                                  className={`text-center font-normal text-neutral-500 ${
                                    patientIdentityMinimized
                                      ? "mt-1 text-[10px]"
                                      : "mt-2 text-[11px]"
                                  }`}
                                >
                                  Colonoscopy
                                </p>
                                <p
                                  className={`text-center font-normal tabular-nums text-neutral-800 ${
                                    patientIdentityMinimized ? "text-[11px]" : "text-[12px]"
                                  }`}
                                >
                                  Next 2032
                                </p>
                              </div>
                            </div>
                          </section>

                          <div
                            className={
                              patientIdentityMinimized
                                ? `${patientBentoCard} border-l-2 pl-4 sm:col-span-2 lg:col-span-4 ${
                                    productBrownDarkWorkspace
                                      ? "border-[rgba(245,230,208,0.18)]"
                                      : "border-neutral-300"
                                  }`
                                : `border-l-2 pl-4 ${
                                    productBrownDarkWorkspace
                                      ? "border-[rgba(245,230,208,0.18)]"
                                      : "border-neutral-300"
                                  }`
                            }
                          >
                            <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-neutral-400">
                              Allergy
                            </p>
                            <p className="mt-2 text-[13px] font-normal text-neutral-800">Penicillin — rash</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {workspaceView !== "inbox" && workspaceView !== "landing" && !hero ? (
              <div
                className={`product-brown-main-panel flex h-full w-1/2 shrink-0 flex-col border-l ${
                  productBrownDarkWorkspace
                    ? "border-[rgba(245,230,208,0.08)] bg-[#241910] shadow-[inset_1px_0_0_rgba(245,230,208,0.05)]"
                    : productBrown
                      ? "border-[rgba(61,46,31,0.14)]"
                      : "border-[#EFEFEF]"
                } ${
                  workspaceView === "patients"
                    ? productBrownDarkWorkspace
                      ? "bg-[#241910]"
                      : productBrown
                        ? "bg-[#faf0d8]"
                        : "bg-white"
                    : productBrownDarkWorkspace
                      ? "bg-[#241910]"
                      : productBrown
                        ? "bg-[#ede0c8]"
                        : "bg-[#FAFAFA]"
                }`}
              >
                {workspaceView === "schedule" ? (
                  <>
                    <header
                      className={`flex items-center justify-between border-b px-4 py-3 ${
                        productBrownDarkWorkspace
                          ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                          : "border-[#E8E8ED] bg-white"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-wider ${
                            productBrownDarkWorkspace ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-400"
                          }`}
                        >
                          Schedule
                        </p>
                        <h2
                          className={`text-[15px] font-semibold ${
                            productBrownDarkWorkspace ? "text-[#f5e6d0]" : "text-neutral-800"
                          }`}
                        >
                          Day summary
                        </h2>
                      </div>
                    </header>
                  <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
                    <div className="rounded-xl border border-[#EAEAEA] bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-medium text-neutral-500">
                        {todayScheduleDay.day}, {todayScheduleDay.date}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-800">
                        {todaySummary.total} appointment{todaySummary.total > 1 ? "s" : ""}
                        {todaySummary.timeSpan ? ` · ${todaySummary.timeSpan}` : ""}
                      </p>
                      {summaryChips.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {summaryChips.map((row) => (
                            <span
                              key={row.label}
                              className="rounded-md border border-[#ECECEC] bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                            >
                              {row.label} {row.count}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-xl border border-[#EAEAEA] bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-semibold text-neutral-700">Calendar order</p>
                      <ul className="mt-2 space-y-2">
                        {todayTimelineEvents.slice(0, 8).map((event) => {
                          const summary = getEventSummary(event.label);
                          return (
                            <li
                              key={`sum-${event.time}-${event.label}`}
                              className="flex gap-2 text-[11px] leading-snug text-neutral-600"
                            >
                              <span className="w-[88px] shrink-0 font-medium tabular-nums text-neutral-500">
                                {event.time.replaceAll("-", "–")}
                              </span>
                              <span className="min-w-0 text-neutral-700">
                                <span className="font-medium text-neutral-800">{summary.primary}</span>
                                {summary.secondary ? (
                                  <span className="text-neutral-500"> · {summary.secondary}</span>
                                ) : null}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </>
              ) : workspaceView === "patients" ? (
                <>
                  <header
                    className={`border-b px-4 py-3 ${
                      productBrownDarkWorkspace
                        ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                        : "border-[#E8E8ED] bg-white"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        productBrownDarkWorkspace ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-400"
                      }`}
                    >
                      Reference
                    </p>
                    <h2
                      className={`mt-0.5 text-[15px] font-semibold ${
                        productBrownDarkWorkspace ? "text-[#f5e6d0]" : "text-neutral-800"
                      }`}
                    >
                      James Lisondra
                    </h2>
                  </header>
                  <div
                    className={`min-h-0 flex-1 space-y-3 overflow-auto p-4 ${
                      productBrownDarkWorkspace ? "bg-[#241910]" : "bg-white"
                    }`}
                  >
                    <div className="rounded-xl border border-[#EAEAEA] bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-semibold text-neutral-500">Coverage</p>
                      <p className="mt-2 text-[13px] font-medium leading-snug text-neutral-800">
                        Northside Family Medicine
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">PPO · in network</p>
                    </div>
                    <div className="rounded-xl border border-[#EAEAEA] bg-white p-3 shadow-sm">
                      <p className="text-[11px] font-semibold text-neutral-500">Contact</p>
                      <p className="mt-2 break-all text-[12px] font-medium text-neutral-800">
                        james.lisondra@email.com
                      </p>
                      <p className="mt-1.5 text-[12px] tabular-nums text-neutral-600">(415) 555‑0142</p>
                    </div>
                    <div
                      className={`rounded-xl border p-3 shadow-sm ${
                        productBrownDarkWorkspace
                          ? "border-[rgba(139,105,20,0.35)] bg-[rgba(212,165,116,0.12)]"
                          : productBrown
                            ? "border-[rgba(139,105,20,0.35)] bg-[rgba(212,165,116,0.18)]"
                            : "border-amber-200/80 bg-amber-50/40"
                      }`}
                    >
                      <p
                        className={`text-[11px] font-semibold ${
                          productBrown ? "text-[#f5e6d0]" : "text-amber-900/90"
                        }`}
                      >
                        Open item
                      </p>
                      <p
                        className={`mt-2 text-[12px] leading-relaxed ${
                          productBrown ? "text-[rgba(245,230,208,0.78)]" : "text-neutral-800"
                        }`}
                      >
                        A1c goal documentation due this quarter if not on file.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <header
                    className={`border-b px-4 py-3 ${
                      productBrownDarkWorkspace
                        ? "border-[rgba(245,230,208,0.1)] bg-[#322618]"
                        : "border-[#E8E8ED] bg-white"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        productBrownDarkWorkspace ? "text-[rgba(245,230,208,0.48)]" : "text-neutral-400"
                      }`}
                    >
                      Chart
                    </p>
                    <h2
                      className={`text-[15px] font-semibold ${
                        productBrownDarkWorkspace ? "text-[#f5e6d0]" : "text-neutral-800"
                      }`}
                    >
                      Details
                    </h2>
                  </header>
                  <div
                    className={`flex min-h-0 flex-1 items-center justify-center p-6 ${
                      productBrownDarkWorkspace ? "bg-[#241910]" : ""
                    }`}
                  >
                    <p className="text-center text-[13px] text-neutral-500">Select a patient to preview.</p>
                  </div>
                </>
              )}
              </div>
            ) : null}
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
