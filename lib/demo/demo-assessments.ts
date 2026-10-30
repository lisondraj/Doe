/**
 * Validated headache assessments the clinic asks for before Botox, which the user's agent walks them through
 * question by question: ID-Migraine (screen), MIDAS (disability), HIT-6 (impact) and the ICHD-3 criteria for
 * chronic migraine, the threshold for Botox. Scoring follows each instrument's published bands.
 */

export type AssessmentQuestion =
  | { id: string; kind: "days"; prompt: string; short: string; max: number; scored?: boolean }
  | { id: string; kind: "scale"; prompt: string; short: string }
  | { id: string; kind: "choice"; prompt: string; short: string; options: { label: string; value: number }[] };

export type AssessmentResult = { score: string; band: string; tone: string };

export type Assessment = {
  id: string;
  name: string;
  full: string;
  window: string;
  questions: AssessmentQuestion[];
  /** The user's answers, used by "Fill with user's answers" in the demo. */
  demo: Record<string, number>;
  result: (a: Record<string, number>) => AssessmentResult;
};

const YES_NO = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

const HIT6_SCALE = [
  { label: "Never", value: 6 },
  { label: "Rarely", value: 8 },
  { label: "Sometimes", value: 10 },
  { label: "Very often", value: 11 },
  { label: "Always", value: 13 },
];

const SEVERE = "#FCCFB8";
const MODERATE = "#F3E7C9";
const MILD = "#E3E9D9";

export const ASSESSMENTS: Assessment[] = [
  {
    id: "idm",
    name: "ID-Migraine",
    full: "ID-Migraine screener",
    window: "Last 3 months",
    questions: [
      { id: "nausea", kind: "choice", short: "Nausea", prompt: "With your headaches, have you felt nauseated or sick to your stomach?", options: YES_NO },
      { id: "light", kind: "choice", short: "Light sensitivity", prompt: "Has light bothered you a lot more than when you don't have headaches?", options: YES_NO },
      { id: "limit", kind: "choice", short: "Limited a day", prompt: "Have your headaches limited your ability to work, study or do what you needed to do for at least one day?", options: YES_NO },
    ],
    demo: { nausea: 1, light: 1, limit: 1 },
    result: (a) => {
      const yes = (a.nausea ?? 0) + (a.light ?? 0) + (a.limit ?? 0);
      return yes >= 2 ? { score: `${yes} of 3`, band: "Positive for migraine", tone: SEVERE } : { score: `${yes} of 3`, band: "Negative", tone: MILD };
    },
  },
  {
    id: "midas",
    name: "MIDAS",
    full: "Migraine Disability Assessment",
    window: "Last 3 months",
    questions: [
      { id: "q1", kind: "days", max: 90, scored: true, short: "Missed work or school", prompt: "On how many days did you miss work or school because of your headaches?" },
      { id: "q2", kind: "days", max: 90, scored: true, short: "Work at half or less", prompt: "On how many days was your productivity at work or school cut by half or more because of your headaches? Don't count days you missed." },
      { id: "q3", kind: "days", max: 90, scored: true, short: "No household work", prompt: "On how many days did you not do household work because of your headaches?" },
      { id: "q4", kind: "days", max: 90, scored: true, short: "Housework at half or less", prompt: "On how many days was your productivity in household work cut by half or more? Don't count days with no household work." },
      { id: "q5", kind: "days", max: 90, scored: true, short: "Missed family or social", prompt: "On how many days did you miss family, social or leisure activities because of your headaches?" },
      { id: "a", kind: "days", max: 90, short: "Headache days", prompt: "On how many days did you have a headache? Count each day, even if it lasted more than one day." },
      { id: "b", kind: "scale", short: "Average pain", prompt: "On a scale of 0 to 10, how painful were these headaches on average? 0 is no pain, 10 is the worst pain imaginable." },
    ],
    demo: { q1: 4, q2: 6, q3: 5, q4: 7, q5: 4, a: 54, b: 7 },
    result: (a) => {
      const total = ["q1", "q2", "q3", "q4", "q5"].reduce((n, k) => n + (a[k] ?? 0), 0);
      if (total >= 21) return { score: String(total), band: "Grade IV · Severe disability", tone: SEVERE };
      if (total >= 11) return { score: String(total), band: "Grade III · Moderate disability", tone: MODERATE };
      if (total >= 6) return { score: String(total), band: "Grade II · Mild disability", tone: MILD };
      return { score: String(total), band: "Grade I · Little or none", tone: MILD };
    },
  },
  {
    id: "hit6",
    name: "HIT-6",
    full: "Headache Impact Test",
    window: "Last 4 weeks",
    questions: [
      { id: "h1", kind: "choice", short: "Severe pain", prompt: "When you have headaches, how often is the pain severe?", options: HIT6_SCALE },
      { id: "h2", kind: "choice", short: "Limits daily activities", prompt: "How often do headaches limit your ability to do usual daily activities, like housework, work, school or socializing?", options: HIT6_SCALE },
      { id: "h3", kind: "choice", short: "Wish to lie down", prompt: "When you have a headache, how often do you wish you could lie down?", options: HIT6_SCALE },
      { id: "h4", kind: "choice", short: "Too tired", prompt: "In the past 4 weeks, how often have you felt too tired to do work or daily activities because of your headaches?", options: HIT6_SCALE },
      { id: "h5", kind: "choice", short: "Fed up or irritated", prompt: "In the past 4 weeks, how often have you felt fed up or irritated because of your headaches?", options: HIT6_SCALE },
      { id: "h6", kind: "choice", short: "Concentration", prompt: "In the past 4 weeks, how often did headaches limit your ability to concentrate on work or daily activities?", options: HIT6_SCALE },
    ],
    demo: { h1: 11, h2: 11, h3: 13, h4: 10, h5: 11, h6: 11 },
    result: (a) => {
      const total = ["h1", "h2", "h3", "h4", "h5", "h6"].reduce((n, k) => n + (a[k] ?? 0), 0);
      if (total >= 60) return { score: String(total), band: "Severe impact", tone: SEVERE };
      if (total >= 56) return { score: String(total), band: "Substantial impact", tone: MODERATE };
      if (total >= 50) return { score: String(total), band: "Some impact", tone: MODERATE };
      return { score: String(total), band: "Little or no impact", tone: MILD };
    },
  },
  {
    id: "ichd",
    name: "ICHD-3",
    full: "Chronic migraine criteria",
    window: "Per month",
    questions: [
      { id: "days", kind: "days", max: 31, short: "Headache days a month", prompt: "On average, how many days a month do you have a headache of any kind?" },
      { id: "migraine", kind: "days", max: 31, short: "Migraine days a month", prompt: "On how many of those days does the headache throb, sit on one side, get worse with activity, or come with nausea or light sensitivity?" },
      { id: "months", kind: "days", max: 120, short: "Months like this", prompt: "For how many months has it been like this?" },
      { id: "other", kind: "choice", short: "Other diagnosis", prompt: "Has a doctor said your headaches are caused by something else, like medication overuse or another condition?", options: YES_NO },
    ],
    demo: { days: 18, migraine: 11, months: 72, other: 0 },
    result: (a) => {
      const meets = (a.days ?? 0) >= 15 && (a.migraine ?? 0) >= 8 && (a.months ?? 0) > 3 && a.other === 0;
      return meets
        ? { score: "Meets", band: "Chronic migraine · Botox eligible", tone: SEVERE }
        : { score: "Not met", band: "Below chronic migraine threshold", tone: MILD };
    },
  },
];

export const isComplete = (a: Assessment, answers: Record<string, number> | undefined) =>
  a.questions.every((q) => answers?.[q.id] !== undefined);
