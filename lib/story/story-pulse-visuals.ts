export const STORY_PULSE_VOICES = [
  {
    id: "desk",
    name: "Front Desk",
    voice: "Maya",
    language: "EN · ES",
    hours: "8a–6p",
    print: [42, 78, 55, 92, 64],
  },
  {
    id: "auth",
    name: "Prior Auth",
    voice: "Cole",
    language: "EN",
    hours: "Always",
    print: [70, 48, 88, 36, 74],
  },
  {
    id: "nights",
    name: "After Hours",
    voice: "Lina",
    language: "EN · FR",
    hours: "6p–8a",
    print: [28, 62, 44, 80, 52],
  },
] as const;

export const STORY_PULSE_DESK = {
  line: "Main clinic line",
  number: "(416) 555-0140",
  status: "Answering",
  duration: "2:14",
  agent: "Maya",
  role: "Front desk",
  note: "Wrote to chart",
  print: [72, 88, 54, 94, 62, 80, 48, 70],
} as const;

export const STORY_PULSE_LIVE = {
  live: "4",
  human: "1",
  agents: [
    { id: "desk", name: "Front desk", state: "Live", time: "0:42" },
    { id: "auth", name: "Prior auth", state: "Hold", time: "4:18" },
    { id: "sched", name: "Scheduling", state: "Live", time: "1:06" },
    { id: "bill", name: "Billing", state: "Live", time: "0:19" },
  ],
  intervention: {
    title: "Take over",
    person: "Maya Chen",
    reason: "Clinical concern",
  },
} as const;

export const STORY_PULSE_NIGHTS = {
  eyebrow: "Overnight",
  returned: "3",
  note: "Written to chart",
  items: [
    { id: "refill", at: "11:42pm", task: "Refill", done: "7:04am", fill: 88 },
    { id: "cancel", at: "1:18am", task: "Cancel", done: "7:06am", fill: 64 },
    { id: "new", at: "5:02am", task: "New visit", done: "7:11am", fill: 36 },
  ],
} as const;

export const STORY_PULSE_GOLD_TITLES = {
  voices: [
    "Delegate voice agents to handle",
    "different types of front desk calls.",
  ],
  desk: ["Detailed call history to", "revisit agent actions"],
  live: ["See every live agent and", "hand a call to a person."],
  nights: ["Overnight voicemail returned", "at open and written to chart."],
} as const;

export const STORY_PULSE_TILE_COPY = {
  voices:
    "Each Pulse voice agent has its own voice, language, tone, and hours — so the front desk, prior-auth line, and overnight coverage do not sound the same.",
  desk:
    "Pulse answers the clinic’s main line, books and moves visits, and keeps the person in front of the desk with the patient in the room.",
  live:
    "The floor view shows every live agent at once. When a call needs a person, Pulse holds context and asks a human to take over.",
  nights:
    "Overnight voicemail does not wait until Monday. Pulse returns each call at open and writes the outcome back to the chart.",
} as const;
