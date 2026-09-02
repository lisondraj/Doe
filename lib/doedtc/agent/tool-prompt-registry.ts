import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
import { DOE_DTC_TOOL_NAMES } from "@/lib/doedtc/agent/tool-dispatch";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

export type DoeToolDomainId =
  | "health_chart"
  | "trackers"
  | "guides"
  | "visit"
  | "reminders_habits"
  | "household"
  | "web"
  | "memory"
  | "texture";

export type DoeSpecialistId = "healthRecord" | "guides" | "scheduling" | "browser";

export type DoeAgentPromptSignals = {
  hasActiveBrowserJob: boolean;
  hasPending: boolean;
  hasTrackers: boolean;
  hasGuides: boolean;
  hasHousehold: boolean;
  hasListenSessions: boolean;
};

const DOMAIN_ORDER: DoeToolDomainId[] = [
  "health_chart",
  "trackers",
  "guides",
  "visit",
  "reminders_habits",
  "household",
  "web",
  "memory",
  "texture",
];

const DOMAIN_HEADERS: Record<DoeToolDomainId, string> = {
  health_chart:
    "Health chart — symptoms, meds, conditions, appointments, lab results, assessments, profile reads.",
  trackers: "Trackers — ongoing logs (water, shots, weight). Create once, then log entries.",
  guides: "Guides — visual how-to pages. Created unsaved; save only after they confirm.",
  visit: "Visit — record appointments (Listen) and read back completed transcripts.",
  reminders_habits:
    "Reminders & habits — one-shot texts vs daily check-ins. Pick the right tool (see routing below).",
  household: "Household — family chart, invites, access revoke.",
  web: "Web — browse, screenshot, portal sign-in, irreversible submits.",
  memory: "Memory & feedback — preferences, forget, bug reports.",
  texture: "iMessage texture — reactions, thread replies, profile links.",
};

const SPECIALIST_DOMAINS: Record<DoeSpecialistId, readonly DoeToolDomainId[]> = {
  healthRecord: ["health_chart", "trackers", "visit", "household", "memory", "texture"],
  guides: ["guides"],
  scheduling: ["reminders_habits"],
  browser: ["web"],
};

export const TOOL_DOMAINS: Record<(typeof DOE_DTC_TOOL_NAMES)[number], DoeToolDomainId> = {
  log_symptoms: "health_chart",
  update_symptom: "health_chart",
  remove_symptom: "health_chart",
  run_assessment: "health_chart",
  log_appointment: "health_chart",
  update_appointment: "health_chart",
  cancel_appointment: "health_chart",
  add_medication: "health_chart",
  update_medication: "health_chart",
  remove_medication: "health_chart",
  add_condition: "health_chart",
  update_condition: "health_chart",
  remove_condition: "health_chart",
  log_result: "health_chart",
  update_result: "health_chart",
  remove_result: "health_chart",
  add_locker_item: "health_chart",
  update_locker_item: "health_chart",
  remove_locker_item: "health_chart",
  update_profile: "health_chart",
  read_profile: "health_chart",
  read_attachment: "health_chart",
  parse_document: "health_chart",
  create_preparation: "visit",
  create_profile_artifact: "trackers",
  update_profile_artifact: "trackers",
  log_artifact_entry: "trackers",
  share_artifact: "trackers",
  unshare_artifact: "trackers",
  update_artifact_entry: "trackers",
  remove_artifact_entry: "trackers",
  create_guide: "guides",
  save_guide: "guides",
  update_guide: "guides",
  list_guides: "guides",
  send_guide_link: "guides",
  start_listen: "visit",
  read_listen_session: "visit",
  propose_scheduled_text: "reminders_habits",
  schedule_text: "reminders_habits",
  cancel_scheduled_text: "reminders_habits",
  list_scheduled_texts: "reminders_habits",
  propose_accountability: "reminders_habits",
  start_accountability: "reminders_habits",
  propose_habit_workflow: "reminders_habits",
  start_habit_workflow: "reminders_habits",
  propose_workflow: "reminders_habits",
  start_workflow: "reminders_habits",
  cancel_habit_workflow: "reminders_habits",
  invite_accountability_partner: "reminders_habits",
  log_accountability_checkin: "reminders_habits",
  withdraw_accountability: "reminders_habits",
  pause_accountability: "reminders_habits",
  resume_accountability: "reminders_habits",
  log_family_member: "household",
  update_family_member: "household",
  remove_family_member: "household",
  send_family_invite: "household",
  revoke_household_access: "household",
  start_browser_task: "web",
  browser_navigate: "web",
  browser_act: "web",
  browser_computer: "web",
  browser_snapshot: "web",
  request_vault: "web",
  request_live_login: "web",
  show_session: "web",
  request_commit: "web",
  remember_fact: "memory",
  forget_fact: "memory",
  submit_ticket: "memory",
  react_to_message: "texture",
  use_thread_reply: "texture",
  send_profile_link: "texture",
};

const PROMPT_OVERRIDES: Record<(typeof DOE_DTC_TOOL_NAMES)[number], string> = {
  log_symptoms:
    "log_symptoms — quiet chart write after you have been helpful. Never mention log/track in the reply unless they asked to save it. Care and probe first. Use update_symptom / remove_symptom to correct — never log a duplicate.",
  update_symptom:
    "update_symptom — patch a logged symptom when they correct severity, onset, or wording. symptom_id from Symptom log above.",
  remove_symptom:
    "remove_symptom — delete a symptom row when they ask to remove it. symptom_id from Symptom log above.",
  run_assessment:
    "run_assessment — structured clinical review when enough info or they ask what it might be. Not a definitive diagnosis — flag emergencies.",
  log_appointment:
    "log_appointment — save an appointment. Never invent dates. approximate = their vague wording in timing_note; exact only when they gave date+time. appointment ids in Appointments log.",
  update_appointment:
    "update_appointment — reschedule or edit an existing row. appointment_id from Appointments log — do not log_appointment a second copy.",
  cancel_appointment:
    "cancel_appointment — remove an appointment they no longer have. appointment_id from Appointments log.",
  add_medication:
    "add_medication — add a med they take or ask to put on the chart. Never remember_fact for meds. Need a real medication name. If they are vague, ask which one. Confirm in the reply. The conditions tab link is sent automatically after a successful add. If correcting an existing med, use update_medication — not a second add.",
  update_medication:
    "update_medication — rename/replace a med on profile (from → to). Do not add_medication a duplicate.",
  remove_medication: "remove_medication — remove a med they stopped. Name from profile or conditions tab read.",
  add_condition:
    "add_condition — add a diagnosis/condition they have or ask to put on the chart. Never remember_fact for conditions. Need a real condition name. If they are vague, ask which one. Confirm in the reply. The conditions tab link is sent automatically after a successful add. Correct with update_condition, not a second add.",
  update_condition:
    "update_condition — rename/replace a condition (from → to). Do not add_condition a duplicate.",
  remove_condition: "remove_condition — remove a condition that no longer applies.",
  log_result:
    "log_result — log a lab/imaging result they report. title is the TEST name (A1C, Liver function test), never their name. Never ask them for a title. If they say \"title is James\" they mean they are James. Need the test, a value, and a date unless a document is already parsed. If they are vague, ask one question. The results tab link is sent automatically after a successful add. Not for symptoms — use log_symptoms.",
  update_result:
    "update_result — edit title, date, source, or summary on a logged result. result_id from read_profile results tab.",
  remove_result:
    "remove_result — delete a logged result. result_id from read_profile results tab — never ask the user for an id you can read.",
  update_profile:
    "update_profile — change name, email, date of birth, gender, country, or why they use Doe. These show on the dashboard About card.",
  add_locker_item:
    "add_locker_item — save a portal login to the Locker tab. Confirm in chat. Do not repeat the password.",
  update_locker_item:
    "update_locker_item — change locker label, username, or password. item_id from read_profile locker tab.",
  remove_locker_item:
    "remove_locker_item — delete a locker credential. item_id from read_profile locker tab.",
  read_profile:
    "read_profile — pull any profile tab before answering what is saved (meds, conditions, results, trackers, Whoop, family). Answer in iMessage. Send a link only when they asked to see/show/where. Never invent status. Ids for writes live in these logs — do not ask the user for ids.",
  read_attachment:
    "read_attachment — fetch a stored inbound photo/PDF by file id from Recent attachments. Use when they refer to an earlier image.",
  parse_document:
    "parse_document — vision-parse labs, Rx, appointments into chart writes. Read the patient name first. Save only when that name is the user (loose match) or someone on the household. If it is someone else, ask who and whether to invite them. If there is no name, say you can't add this photo. Never say you could not read the file until this tool failed.",
  create_preparation:
    "create_preparation — one-off visit-prep summary with a 5-digit share code for their doctor. Not a guide — use create_guide for how-to visuals.",
  create_profile_artifact:
    "create_profile_artifact — create/reuse a tracker for ongoing logging (water, shots, weight). read_profile trackers tab first — update existing instead of duplicate title.",
  update_profile_artifact:
    "update_profile_artifact — rename tracker, change fields/layout, or archive:true to delete. artifact_id from read_profile trackers tab.",
  log_artifact_entry:
    "log_artifact_entry — append one entry. values keys must match the tracker's field keys from read_profile — do not invent keys. artifact_id from trackers tab.",
  update_artifact_entry:
    "update_artifact_entry — fix an entry's values or time. entry_id from read_profile trackers tab.",
  remove_artifact_entry:
    "remove_artifact_entry — delete one tracker entry. entry_id from read_profile trackers tab.",
  share_artifact:
    "share_artifact — public read-only link; only when they explicitly ask to share. For private deep link use send_profile_link with artifact — not share_artifact.",
  unshare_artifact:
    "unshare_artifact — revoke public tracker link. artifact_id from read_profile trackers tab.",
  create_guide:
    "create_guide — build visual how-to (blocks: hero, steps, checklist, etc.). Sends link immediately; saved_at stays null until save_guide. Ask to save after sending — do not auto-save.",
  save_guide:
    "save_guide — pin guide to profile Guides tab after they confirm yes. guide_id from create_guide output or list_guides.",
  update_guide:
    "update_guide — edit blocks/title or archive:true / unsave:true to remove. guide_id or title_hint from list_guides / Guides log.",
  list_guides:
    "list_guides — list recent guides (saved and unsaved) with ids before update_guide or send_guide_link.",
  send_guide_link:
    "send_guide_link — resend link for existing guide without changing content. Not create_guide.",
  start_listen:
    "start_listen — create Listen session before saying a recording link is coming. Optional appointment_id from Appointments log.",
  read_listen_session:
    "read_listen_session — read completed visit transcript/summary. session_id from snapshot or ask which visit. Not for starting a recording — use start_listen.",
  propose_scheduled_text:
    "propose_scheduled_text — draft one-shot text when who/when/body is ambiguous or texts someone else without clear ask. If they already asked with detail, schedule_text instead.",
  schedule_text:
    "schedule_text — commit one-shot reminder/timer. Confirm in this reply; the reminder fires later. body is the thing to remember, not the confirmation. Not for daily habits — use start_habit_workflow.",
  cancel_scheduled_text:
    "cancel_scheduled_text — cancel pending one-shot. scheduled_text_id from Scheduled texts log or list_scheduled_texts.",
  list_scheduled_texts:
    "list_scheduled_texts — live file: committed upcoming, recently sent, and uncommitted drafts. Use ONLY when they ask what is set / any reminders / what's in the file. Never for a problem they shared (forgetting, someone not talking). Drafts are not set. Call before cancel_scheduled_text for ids.",
  propose_habit_workflow:
    "propose_habit_workflow — draft daily habit (text → await reply → notify owner on miss) when who/when ambiguous. If they already asked, start_habit_workflow.",
  start_habit_workflow:
    "start_habit_workflow — commit daily habit with miss notify. Preferred for make-sure-daily / nag / bath / meds every day. Not for one-shot tonight — use schedule_text.",
  propose_workflow:
    "propose_workflow — draft composed graph (send/wait/branch/escalate) when confirm_once applies. If they already asked, start_workflow.",
  start_workflow:
    "start_workflow — commit composed workflow graph. Multi-step nag (reminder + wait_until + escalate). Not for simple daily habit — use start_habit_workflow.",
  cancel_habit_workflow:
    "cancel_habit_workflow — stop active habit workflow. workflow_id from Habit workflows log.",
  propose_accountability:
    "propose_accountability — draft legacy pact when ambiguous. Prefer start_habit_workflow for simple daily habits; use pact when partner/cadence/privacy matters.",
  start_accountability:
    "start_accountability — commit recurring pact. who_gets_check_in owner when texting parent about young kids without phones.",
  invite_accountability_partner:
    "invite_accountability_partner — text partner invite for existing pact after they give phone/name.",
  log_accountability_checkin:
    "log_accountability_checkin — log yes/no/skip on a pact. pact_id from Accountability pacts log.",
  withdraw_accountability:
    "withdraw_accountability — end pact (owner, explicit confirm). Not pause — use pause_accountability.",
  pause_accountability:
    "pause_accountability — pause check-ins without deleting history.",
  resume_accountability:
    "resume_accountability — resume a paused pact.",
  log_family_member:
    "log_family_member — add household member. If name exists on chart, update_family_member — never duplicate. relationship child for sons/daughters. Can include gender, meds, and conditions for their family card.",
  update_family_member:
    "update_family_member — correct name, phone, DOB, gender, relationship, meds, or conditions. member_id from Household log.",
  remove_family_member:
    "remove_family_member — remove from household chart. Admin only. member_id from Household log.",
  send_family_invite:
    "send_family_invite — text join link when member has phone and invite_available. Direct ask counts as yes.",
  revoke_household_access:
    "revoke_household_access — self only: stop sharing own profile with household. confirmed:true for adults after explicit yes.",
  start_browser_task:
    "start_browser_task — open a real browser on any site or search they named. Job runs in the background. Say you're on it; screenshot texts back when done. Attempt before refusing. Never ask for a more specific URL. Not send_profile_link as fallback.",
  browser_navigate:
    "browser_navigate — go to any URL on the active job. Requires start_browser_task first.",
  browser_act:
    "browser_act — click/type/scroll on the active job to finish the ask.",
  browser_computer:
    "browser_computer — x/y click, keys, scroll when selectors fail or interstitial. Prefer browser_act when selector exists.",
  browser_snapshot:
    "browser_snapshot — screenshot active page to iMessage. Use after navigate/research.",
  request_vault:
    "request_vault — secure web sign-in link for patient portal (host required). Never passwords in chat. Not live view — use request_live_login for watch-and-type.",
  request_live_login:
    "request_live_login — Live View so they sign in themselves. Not vault link — use request_vault for secure portal handoff.",
  show_session:
    "show_session — Doe session page to watch browser. Active job required. Never say you cannot stream.",
  request_commit:
    "request_commit — stage irreversible browser click; patient replies CONFIRM. After commit, job blocks further writes until confirm/cancel.",
  remember_fact:
    "remember_fact — durable preference/context (doctor name, travel). Not meds, conditions, symptoms, or family chart rows.",
  forget_fact:
    "forget_fact — remove stored preference when they ask to forget.",
  submit_ticket:
    "submit_ticket — feedback or bug report. Not for clinical questions.",
  react_to_message:
    "react_to_message — optional tapback that fits what they said (😂 🙏 💙 💪 👀 ❓). Most turns skip. Never 👍, ✅, or 👎.",
  use_thread_reply:
    "use_thread_reply — occasionally reply in-thread for direct answers (~1 in 3 eligible turns).",
  send_profile_link:
    "send_profile_link — private app/tracker link when they asked to see it (send/show/where is/need + tracker, profile, chart, labs, locker, or another tab), including 'send me a link to that' after you named a tab. Pass tab=locker for lockers, tab=results for labs, tab=conditions for meds, tab=family for family, tab=trackers + artifact for a tracker. Never claim you sent a link unless you called this. Never as a consolation prize. Never use \"here\" as a URL placeholder.",
};

function tier2Enabled(signals: DoeAgentPromptSignals | undefined, key: keyof DoeAgentPromptSignals): boolean {
  if (!signals) return true;
  return signals[key];
}

function buildTier2Blocks(signals?: DoeAgentPromptSignals): string[] {
  const blocks: string[] = [];

  if (tier2Enabled(signals, "hasPending")) {
    blocks.push(`Pending confirm (active):
- User yes/ok/confirm → call the commit tool with stored args — do not propose_* again.
- User no/cancel → clear pending; do not re-ask the same confirmation.
- save_guide pending: create_guide already sent link; yes runs save_guide.
- Chart write pending (need more details): use what they just said to fill the stored args, then call the write tool. Ask only for what is still missing. Never invent a name, date, or value.`);
  }

  if (tier2Enabled(signals, "hasTrackers")) {
    blocks.push(`Tracker routing (trackers on profile):
- Log entry → log_artifact_entry with artifact_id from read_profile trackers tab.
- Fix entry → update_artifact_entry / remove_artifact_entry with entry_id from same tab.
- New tracker only when no matching title exists → create_profile_artifact.`);
  }

  blocks.push(`How-to / tracker confusion (always):
- "How do I take X" / don't know how → list_guides first; reuse + send_guide_link if a match exists, otherwise create_guide and send the link. Ask once if they want it saved.
- "Where is my tracker" / profile / chart / labs / locker / need / show me / send me a link to that → send_profile_link (matching tab when obvious). Act first, then one finished reply. Do not say "here" — the link is a separate iMessage. Never say you sent it unless you called this.
- Add/log a med, condition, lab, or tracker entry → if they named it, write tool and confirm. If they are vague, ask one question. After a successful write the matching tab link is sent automatically. If a write tool returns user_message, use that exact wording.
- "What were my labs" / what's on my chart / my meds → read_profile that tab and answer. Link only if they also asked to see/show/where.
- "Help me track X" / track my X with no matching tracker → create_profile_artifact, then send the link.
- Primary action first, then at most one complete offer (save the guide, same for a sibling).`);

  if (tier2Enabled(signals, "hasGuides")) {
    blocks.push(`Guide routing (guides exist):
- create_guide → link sent, saved_at null, pending save offer registered.
- Resend → send_guide_link. Edit → update_guide. Remove → update_guide archive:true or unsave:true.
- list_guides for ids before update/send.`);
  }

  if (tier2Enabled(signals, "hasHousehold")) {
    blocks.push(`Household routing (family on chart):
- Situation blockers are live — name each high-confidence blocker in one sentence (not on chart, no phone) before acting.
- Names on chart → pass member_name on writes for that person (meds, symptoms, appointments, habits, trackers).
- Joined members → act on their chart / text them. Do not re-invite.
- Pending + phone → schedule_text / start_habit_workflow to them; profile writes log on the parent chart with a member note, then one invite offer (confirm_once unless they already asked).
- Pending, no phone → habits text the parent; profile writes log on the parent chart or ask for a number. Do not invent SMS.
- Unknown name → add with log_family_member (ask relationship/phone only if missing). Never claim booked/logged until commit tools succeed.
- Existence questions ("what's set", "any reminders", "what's on my chart") → read_profile or list_scheduled_texts — never answer from chat history. A problem they shared is not an existence question.
- Never auto-text siblings or unmentioned members. At most one sibling offer after a child habit.`);
  }

  if (tier2Enabled(signals, "hasListenSessions")) {
    blocks.push(`Listen routing (sessions exist):
- Start recording → start_listen.
- "What did the doctor say" / dosage / visit recap → read_listen_session on completed session.
- Transcript not in overview — read tool or read_profile appointments if linked.`);
  }

  if (tier2Enabled(signals, "hasActiveBrowserJob")) {
    blocks.push(`Browser sequencing (job open):
- Flow: start_browser_task → navigate/act/snapshot → request_commit for irreversible submit → user CONFIRM.
- Only one browser job at a time. Other tools (log symptoms, family, listen) may run same turn.
- Echo browser user_message verbatim. Portal login → request_vault or request_live_login.`);
  } else {
    blocks.push(`Browser start (no active job):
- Any search, Google, URL, or screenshot → start_browser_task immediately with their ask as intent. Screenshot is sent as a follow-up iMessage.
- Do not refuse a site or query. Do not ask for a more specific URL.
- Patient portal sign-in → start_browser_task mode login or request_vault with host.
- Do not call browser_navigate/act until start_browser_task succeeds.`);
  }

  blocks.push(`Reminder disambiguation (always):
- One-shot / timer / tonight once → schedule_text (inline if under ~45s).
- Daily + reply + miss notify → start_habit_workflow (preferred).
- Partner / cadence / legacy pact → start_accountability.
- Missing who/when → propose_* once, then commit on yes.`);

  blocks.push(`Parallel turns (always):
- This inbound is one turn. Reply to it now. Other Active work continues.
- If they ask what you're doing, describe Active work in plain language.
- Do not say you'll send later or that you're working on it unless start_browser_task or schedule_text already ran. If the browser job is still running, say you're on it and you'll text when it's done.`);

  return blocks;
}

export function buildDoeAgentPromptSignals(params: {
  snapshot?: DoeDtcProfileSnapshot;
  activeBrowserJobId?: string | null;
  pendingRow?: unknown | null;
}): DoeAgentPromptSignals {
  const members = params.snapshot?.household?.members ?? [];
  return {
    hasActiveBrowserJob: Boolean(params.activeBrowserJobId),
    hasPending: Boolean(params.pendingRow),
    hasTrackers: (params.snapshot?.artifacts?.length ?? 0) > 0,
    hasGuides: (params.snapshot?.guides?.length ?? 0) > 0,
    hasHousehold: members.length > 1,
    hasListenSessions: (params.snapshot?.listenSessions?.length ?? 0) > 0,
  };
}

export function toolsForDomain(domain: DoeToolDomainId): (typeof DOE_DTC_TOOL_NAMES)[number][] {
  return DOE_DTC_TOOL_NAMES.filter((name) => TOOL_DOMAINS[name] === domain);
}

export function toolsForSpecialist(specialist: DoeSpecialistId): Set<string> {
  const domains = SPECIALIST_DOMAINS[specialist];
  return new Set(
    DOE_DTC_TOOL_NAMES.filter((name) => domains.includes(TOOL_DOMAINS[name])),
  );
}

export function buildDoeSpecialistToolCapabilityPrompt(
  specialist: DoeSpecialistId,
  signals?: DoeAgentPromptSignals,
): string {
  const domains = SPECIALIST_DOMAINS[specialist];
  const tier1Sections = domains.map((domain) => {
    const tools = toolsForDomain(domain);
    const lines = tools.map((name) => {
      const override = PROMPT_OVERRIDES[name];
      if (override) return `  - ${override}`;
      const tool = DOEDTC_AGENT_TOOLS.find((entry) => entry.function.name === name);
      const description = tool?.function.description?.trim();
      return description ? `  - ${name}: ${description}` : `  - ${name}`;
    });
    return [`${DOMAIN_HEADERS[domain]}`, ...lines].join("\n");
  });

  const tier2 = buildTier2Blocks(signals).filter((block) => {
    if (block.includes("Parallel turns")) return true;
    if (specialist === "browser") return block.includes("Browser");
    if (specialist === "scheduling") return block.includes("Reminder") || block.includes("Household");
    if (specialist === "healthRecord") {
      return (
        block.includes("Tracker") ||
        block.includes("How-to") ||
        block.includes("Listen") ||
        block.includes("Household") ||
        block.includes("Pending")
      );
    }
    if (specialist === "guides") return block.includes("Guide") || block.includes("How-to");
    return false;
  });

  return [
    `Specialist tools (${specialist}):`,
    ...tier1Sections,
    ...(tier2.length ? ["", "Routing detail:", ...tier2] : []),
  ].join("\n");
}

export function buildDoeDtcToolCapabilityPrompt(signals?: DoeAgentPromptSignals): string {
  const tier1Sections = DOMAIN_ORDER.map((domain) => {
    const tools = toolsForDomain(domain);
    const lines = tools.map((name) => {
      const override = PROMPT_OVERRIDES[name];
      if (override) return `  - ${override}`;
      const tool = DOEDTC_AGENT_TOOLS.find((entry) => entry.function.name === name);
      const description = tool?.function.description?.trim();
      return description ? `  - ${name}: ${description}` : `  - ${name}`;
    });
    return [`${DOMAIN_HEADERS[domain]}`, ...lines].join("\n");
  });

  const tier2 = buildTier2Blocks(signals);

  return [
    "Tools (internal — never list these to the user; attempt before refusing):",
    ...tier1Sections,
    "",
    "Routing detail:",
    ...tier2.map((block) => block),
    "",
    "- You have real tools. Attempt the task before saying you cannot do it.",
    "- Never say you are working on it or will send later unless a tool already started. If the browser job is still running, say you're on it and you'll text when it's done.",
    "- Never send a profile or tracker link unless they asked for that link this turn.",
    "- When correcting profile data, update or remove the existing row — never add a second copy.",
    "- Resolve ids from logs above (read_profile, Symptom log, Appointments, Household) — do not ask the user for ids.",
  ].join("\n");
}

export function assertToolPromptCoverage(prompt: string): void {
  for (const name of DOE_DTC_TOOL_NAMES) {
    if (!prompt.includes(name)) {
      throw new Error(`Generated prompt missing tool: ${name}`);
    }
  }
}

export function assertRegistryComplete(): void {
  for (const name of DOE_DTC_TOOL_NAMES) {
    if (!TOOL_DOMAINS[name]) {
      throw new Error(`Missing TOOL_DOMAINS entry: ${name}`);
    }
    if (!PROMPT_OVERRIDES[name]) {
      throw new Error(`Missing PROMPT_OVERRIDES entry: ${name}`);
    }
  }
}

/** All signal combinations for coverage tests (2^6 = 64). */
export function allPromptSignalCombinations(): DoeAgentPromptSignals[] {
  const keys: (keyof DoeAgentPromptSignals)[] = [
    "hasActiveBrowserJob",
    "hasPending",
    "hasTrackers",
    "hasGuides",
    "hasHousehold",
    "hasListenSessions",
  ];
  const combos: DoeAgentPromptSignals[] = [];
  for (let mask = 0; mask < 64; mask += 1) {
    const signals = {} as DoeAgentPromptSignals;
    for (let i = 0; i < keys.length; i += 1) {
      signals[keys[i]!] = Boolean(mask & (1 << i));
    }
    combos.push(signals);
  }
  return combos;
}
