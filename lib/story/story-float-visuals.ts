export const STORY_FLOAT_HOLD = {
  status: "On hold",
  timer: "14:22",
  payer: "Aetna",
  task: "Prior auth",
  ref: "A-4419",
  note: "Writes to chart",
  beats: [
    { id: "ivr", label: "IVR", state: "Done", at: "6:12" },
    { id: "spec", label: "Specialist", state: "Live", at: "8:10" },
    { id: "out", label: "Outcome", state: "Wait", at: "—" },
  ],
} as const;

export const STORY_FLOAT_RATES = {
  rows: [
    { id: "aetna", name: "Aetna", paid: "82%", delta: "−$18k", of: "of contract", dispute: true },
    { id: "uhc", name: "UHC", paid: "91%", delta: "−$12k", of: "of contract", dispute: false },
    { id: "bcbs", name: "BCBS", paid: "96%", delta: "−$6k", of: "of contract", dispute: false },
  ],
} as const;

export const STORY_FLOAT_CODES = {
  clinic: "Harbor Ortho",
  patient: "Dana K.",
  rows: [
    { id: "eam", code: "99214", label: "Est. office", hint: "96%", confirm: false },
    { id: "inj", code: "20610", label: "Joint inj.", hint: "Confirm", confirm: true },
    { id: "med", code: "J3301", label: "Kenalog", hint: "88%", confirm: false },
  ],
} as const;

export const STORY_FLOAT_DENIALS = {
  eyebrow: "Open denials",
  count: "3",
  items: [
    { id: "uhc", payer: "UHC", reason: "Auth lapse", due: "Live" },
    { id: "aetna", payer: "Aetna", reason: "Missing notes", due: "Fri" },
    { id: "bcbs", payer: "BCBS", reason: "Bundling", due: "Mon" },
  ],
} as const;

export const STORY_FLOAT_GOLD_TITLES = {
  hold: ["Agents stay on payer hold", "and write the outcome to chart."],
  rates: ["See when payers pay less", "than your contract says."],
  codes: ["Suggest codes from the visit", "with a cue when to confirm."],
  denials: ["Denials sorted and appealed", "before the deadline hits."],
} as const;

export const STORY_FLOAT_TILE_COPY = {
  hold:
    "Voice agents stay on the line with payers. When the call ends, the reference number and outcome write back to the chart.",
  rates:
    "Float compares remittance against contracted rates and surfaces systematic underpayments with evidence, not intuition.",
  codes:
    "Charge suggestions come from the visit itself — documentation, orders, and procedure context — with a confidence cue when a human should confirm.",
  denials:
    "Rejections are categorized by root cause, paired with appeal templates, and queued so nothing expires quietly in a payer portal.",
} as const;
