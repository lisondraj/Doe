"use client";

/**
 * /demo/clinic, live: who just connected, what they're doing, and the moments the clinic has to act on.
 *
 * - Notifications pop the moment an agent connects (with its icon, the channel, and the user's name, city and phone),
 *   when it uploads or passes back forms, and when it requests an appointment, with Approve right on the card.
 * - The live view replays the agent's session as it happens: a log of each step on the left, and on the right the
 *   /demo screen the agent is working through, with its request typed into "What they want you to do", the calendar
 *   opening and the slot being held, the forms filling in, and the booking request waiting on the clinic.
 *
 * Everything is driven by the session's events, so it works the same for MCP, REST and browser agents.
 */
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { DISPLAY } from "@/components/demo/DemoFrame";
import { BUNDLES, CLINIC, SERVICES, money } from "@/lib/demo/demo-clinic";
import type { ClinicAction } from "@/lib/demo/demo-engine";
import type { ClinicStatePayload } from "@/lib/demo/demo-service";
import { lora } from "@/lib/home/fonts";

export type Session = ClinicStatePayload["sessions"][number];
type Ev = Session["events"][number];
type Act = (id: string, a: ClinicAction, done?: string) => Promise<void>;

export const CHANNEL_LONG = { browser: "Browser", api: "REST API", mcp: "Model Context Protocol" } as const;

/** Icons for the personal agents Doe knows, by name. */
const AGENT_ICONS: [RegExp, string][] = [
  [/instinct/i, "/indexconvert/agents/instinct.png"],
  [/muse/i, "/indexconvert/agents/muse.png"],
  [/poke/i, "/indexconvert/agents/poke.png"],
  [/claude|duet/i, "/indexconvert/agents/claude-duet.png"],
  [/gpt|chatgpt|dots|openai/i, "/indexconvert/agents/gpt-dots.png"],
];
export const agentIcon = (name: string) => AGENT_ICONS.find(([re]) => re.test(name))?.[1] ?? null;

export function AgentAvatar({ name, size = 36, ring }: { name: string; size?: number; ring?: string }) {
  const icon = agentIcon(name);
  const style = { width: size, height: size, boxShadow: ring ? `0 0 0 2px ${ring}` : undefined };
  if (icon)
    // eslint-disable-next-line @next/next/no-img-element -- tiny static icon
    return <img src={icon} alt="" width={size} height={size} className="shrink-0 rounded-[28%] object-cover bg-white" style={style} />;
  return (
    <span className="shrink-0 flex items-center justify-center rounded-[28%] bg-[#F7DCCB] text-[#5B2A17] font-[700]" style={{ ...style, fontSize: size * 0.42 }}>
      {name.trim().charAt(0).toUpperCase() || "A"}
    </span>
  );
}

/* ——— Notifications ——— */

export type Notice = {
  id: string;
  kind: "connected" | "requested" | "forms" | "upload" | "confirmed";
  sessionId: string;
  eventId: string;
  at: number;
};

const NOTICE_TYPES: Record<string, Notice["kind"]> = {
  connected: "connected",
  booking_requested: "requested",
  forms_submitted: "forms",
  form_uploaded: "upload",
  booking_confirmed: "confirmed",
};
/** How long each card stays up; 0 keeps it until the clinic acts or dismisses it. */
const NOTICE_MS: Record<Notice["kind"], number> = { connected: 20000, requested: 0, forms: 14000, upload: 14000, confirmed: 6000 };

/** New notices for events that weren't there on the last poll. The first poll only marks what's already there. */
export function useNotices(state: ClinicStatePayload | null) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!state) return;
    const first = !seen.current;
    const known = seen.current ?? new Set<string>();
    const fresh: Notice[] = [];
    for (const s of state.sessions)
      for (const e of s.events) {
        if (known.has(e.id)) continue;
        known.add(e.id);
        const kind = NOTICE_TYPES[e.type];
        if (!first && kind) fresh.push({ id: `${e.id}`, kind, sessionId: s.id, eventId: e.id, at: Date.now() });
      }
    seen.current = known;
    if (fresh.length) setNotices((n) => [...fresh.reverse(), ...n].slice(0, 6));
  }, [state]);

  useEffect(() => {
    const timed = notices.filter((n) => NOTICE_MS[n.kind]);
    if (!timed.length) return;
    const next = Math.min(...timed.map((n) => n.at + NOTICE_MS[n.kind]));
    const id = window.setTimeout(() => setNotices((list) => list.filter((n) => !NOTICE_MS[n.kind] || n.at + NOTICE_MS[n.kind] > Date.now())), Math.max(200, next - Date.now()));
    return () => window.clearTimeout(id);
  }, [notices]);

  const dismiss = (id: string) => setNotices((n) => n.filter((x) => x.id !== id));
  return { notices, dismiss };
}

export function NoticeStack({
  notices,
  sessions,
  onDismiss,
  onWatch,
  onForms,
  onAct,
  bottom = false,
}: {
  /** Sits at the bottom instead, clear of the live view's header. */
  bottom?: boolean;
  notices: Notice[];
  sessions: Session[];
  onDismiss: (id: string) => void;
  onWatch: (sessionId: string) => void;
  onForms: (sessionId: string) => void;
  onAct: Act;
}) {
  if (!notices.length) return null;
  return (
    <div
      aria-live="polite"
      className={`absolute z-[45] left-[10px] right-[10px] md:left-auto md:right-[18px] md:w-[392px] flex gap-[8px] pointer-events-none ${bottom ? "bottom-[10px] md:bottom-[18px] flex-col-reverse" : "top-[64px] md:top-[18px] flex-col"}`}
    >
      {notices.map((n) => {
        const s = sessions.find((x) => x.id === n.sessionId);
        if (!s) return null;
        return <NoticeCard key={n.id} n={n} s={s} onDismiss={() => onDismiss(n.id)} onWatch={() => onWatch(s.id)} onForms={() => onForms(s.id)} onAct={onAct} />;
      })}
    </div>
  );
}

function NoticeCard({ n, s, onDismiss, onWatch, onForms, onAct }: { n: Notice; s: Session; onDismiss: () => void; onWatch: () => void; onForms: () => void; onAct: Act }) {
  const [busy, setBusy] = useState(false);
  const ev = s.events.find((e) => e.id === n.eventId);
  const btn = "h-[36px] px-[14px] rounded-full text-[13px] font-[600] transition-colors duration-150 disabled:opacity-50";
  const primary = `${btn} bg-[#FFFCF1] text-[#140C04] hover:bg-[#F4EEDF]`;
  const quiet = `${btn} bg-[#FFFCF11A] text-[#FFFCF1] hover:bg-[#FFFCF126]`;
  const decide = async (a: ClinicAction, done: string) => {
    setBusy(true);
    await onAct(s.id, a, done);
    onDismiss();
  };
  const uploads = s.forms.uploads ?? [];
  const lastUpload = n.kind === "upload" ? [...uploads].reverse().find((u) => u.by === "agent") : null;
  const stillRequested = s.booking.status === "requested";

  let title: ReactNode;
  let body: ReactNode;
  let actions: ReactNode;
  if (n.kind === "connected") {
    title = (
      <>
        {s.agentName} connected
        <span className="block text-[12.5px] font-[500] text-[#FFFCF1B3]">via {CHANNEL_LONG[s.channel]}</span>
      </>
    );
    body = (
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-[12px] gap-y-[3px] p-[10px_12px] rounded-[14px] bg-[#FFFCF10F] text-[13px] leading-[18px]">
        <span className="text-[#FFFCF199]">Patient</span>
        <span className="font-[600] truncate">{s.userName}</span>
        {s.userLocation && (
          <>
            <span className="text-[#FFFCF199]">From</span>
            <span className="truncate">{s.userLocation}</span>
          </>
        )}
        {(s.userPhone || s.forms.intake.phone) && (
          <>
            <span className="text-[#FFFCF199]">Phone</span>
            <a href={`tel:${(s.userPhone || s.forms.intake.phone || "").replace(/[^\d+]/g, "")}`} className="truncate underline underline-offset-2 decoration-[#FFFCF140]">
              {s.userPhone || s.forms.intake.phone}
            </a>
          </>
        )}
        <span className="text-[#FFFCF199]">Wants</span>
        <span className="line-clamp-2">{s.request}</span>
      </div>
    );
    actions = (
      <>
        <button type="button" onClick={onWatch} className={primary}>
          Watch Live
        </button>
        <button type="button" onClick={onDismiss} className={quiet}>
          Dismiss
        </button>
      </>
    );
  } else if (n.kind === "requested") {
    title = (
      <>
        Appointment requested
        <span className="block text-[12.5px] font-[500] text-[#FFFCF1B3]">
          {s.agentName} for {s.userName}
        </span>
      </>
    );
    body = (
      <div className="flex flex-col gap-[2px] p-[10px_12px] rounded-[14px] bg-[#FFFCF10F] text-[13px] leading-[18px]">
        <span className="font-[600]">{s.bookingSlot ?? ev?.summary}</span>
        <span className="text-[#FFFCF1B3]">
          {s.booking.label ?? s.pricing.label} · {money(s.booking.total ?? s.pricing.total)} · PHI provided via Doe
        </span>
        {s.forms.status === "sent" && <span className="text-[#BFD6B0]">✓ Intake and 4 assessments returned</span>}
      </div>
    );
    actions = stillRequested ? (
      <>
        <button type="button" disabled={busy} onClick={() => void decide({ type: "confirm_booking" }, `Approved ${s.userName}'s appointment`)} className={`${btn} bg-[#FCCFB8] text-[#140C04] hover:bg-[#F8C0A4]`}>
          Approve
        </button>
        <button type="button" disabled={busy} onClick={() => void decide({ type: "decline_booking" }, "Booking declined")} className={quiet}>
          Decline
        </button>
        <button type="button" onClick={onWatch} className={quiet}>
          View
        </button>
      </>
    ) : (
      <>
        <span className="text-[13px] font-[600] text-[#BFD6B0]">{s.booking.status === "confirmed" ? "✓ Approved" : "Declined"}</span>
        <button type="button" onClick={onDismiss} className={quiet}>
          Close
        </button>
      </>
    );
  } else if (n.kind === "forms" || n.kind === "upload") {
    title = (
      <>
        {n.kind === "forms" ? "Forms uploaded" : `${lastUpload?.title ?? "A form"} uploaded`}
        <span className="block text-[12.5px] font-[500] text-[#FFFCF1B3]">
          {s.agentName} for {s.userName}
        </span>
      </>
    );
    body =
      n.kind === "forms" ? (
        <div className="flex flex-wrap gap-[5px]">
          <span className="h-[26px] px-[10px] flex items-center rounded-full bg-[#FFFCF11A] text-[12px] font-[600]">✓ Intake</span>
          {s.scores.map((x) => (
            <span key={x.id} className="h-[26px] px-[10px] flex items-center rounded-full bg-[#FFFCF11A] text-[12px] font-[600]">
              ✓ {x.name} {x.score ?? ""}
            </span>
          ))}
          {s.forms.signedBy && <span className="h-[26px] px-[10px] flex items-center rounded-full bg-[#FFFCF11A] text-[12px] font-[600]">✓ Consent signed</span>}
        </div>
      ) : (
        <div className="flex items-center gap-[10px] p-[10px_12px] rounded-[14px] bg-[#FFFCF10F] text-[13px]">
          <FileGlyph />
          <span className="min-w-0">
            <span className="block truncate font-[600]">{lastUpload?.fileName}</span>
            <span className="block text-[12px] text-[#FFFCF199]">{lastUpload ? `${Math.max(1, Math.round(lastUpload.size / 1024))} KB` : ev?.summary}</span>
          </span>
        </div>
      );
    actions = (
      <>
        <button type="button" onClick={onForms} className={primary}>
          View Forms
        </button>
        <button type="button" onClick={onDismiss} className={quiet}>
          Dismiss
        </button>
      </>
    );
  } else {
    title = (
      <>
        Appointment approved
        <span className="block text-[12.5px] font-[500] text-[#FFFCF1B3]">{s.bookingSlot}</span>
      </>
    );
    body = null;
    actions = (
      <button type="button" onClick={onDismiss} className={quiet}>
        Close
      </button>
    );
  }

  return (
    <div role="status" className="doe-notice-in pointer-events-auto flex flex-col gap-[10px] p-[14px] rounded-[24px] bg-[#140C04] text-[#FFFCF1] shadow-[0_18px_44px_-12px_rgba(20,12,4,0.55)]">
      <div className="flex items-start gap-[12px]">
        <span className="relative">
          <AgentAvatar name={s.agentName} size={42} />
          {n.kind === "connected" && <span className="absolute -right-[3px] -bottom-[3px] w-[14px] h-[14px] rounded-full bg-[#9DBF8A] border-[3px] border-solid border-[#140C04]" />}
        </span>
        <span className="grow min-w-0 text-[15px] leading-[20px] font-[700]">{title}</span>
        <button type="button" aria-label="Dismiss" onClick={onDismiss} className="shrink-0 w-[28px] h-[28px] -mr-[4px] -mt-[2px] flex items-center justify-center rounded-full text-[#FFFCF199] hover:bg-[#FFFCF11A]">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {body}
      <div className="flex flex-wrap items-center gap-[6px]">{actions}</div>
    </div>
  );
}

function FileGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M7 3.5h7l4.5 4.5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13.5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.5V8h4.5M8.5 13h7M8.5 16.5h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* ——— Live view ——— */

type Screen = "gate" | "services" | "calendar" | "chat" | "forms" | "booking";
type Step = { key: string; at: string; screen: Screen; title: string; detail?: string; actor: "agent" | "clinic"; ms: number; ev?: Ev };

const SCREEN_OF: Record<string, Screen> = {
  connected: "gate",
  plan_selected: "services",
  slot_held: "calendar",
  hold_released: "calendar",
  message_sent: "chat",
  clinic_message: "chat",
  offer_made: "chat",
  offer_accepted: "chat",
  offer_declined: "chat",
  intake_updated: "forms",
  assessment_completed: "forms",
  signature_recorded: "forms",
  forms_submitted: "forms",
  form_uploaded: "forms",
  form_sent: "forms",
  booking_requested: "booking",
  booking_confirmed: "booking",
  booking_declined: "booking",
};

const TITLE_OF: Record<string, string> = {
  plan_selected: "Chose a plan",
  slot_held: "Held a time",
  hold_released: "Released the hold",
  message_sent: "Messaged the clinic",
  clinic_message: "Clinic staff replied",
  offer_made: "Clinic made an offer",
  offer_accepted: "Accepted the offer",
  offer_declined: "Declined the offer",
  intake_updated: "Filled the intake",
  assessment_completed: "Completed an assessment",
  signature_recorded: "Recorded the signature",
  forms_submitted: "Passed the forms back",
  form_uploaded: "Uploaded a form",
  form_sent: "Clinic sent a form",
  booking_requested: "Requested the appointment",
  booking_confirmed: "Clinic approved",
  booking_declined: "Clinic declined",
  comms_updated: "Updated preferences",
  consent_updated: "Updated permissions",
};

/** The session as a sequence of on-screen steps, with a couple of in-between steps the agent takes without an event. */
function stepsOf(s: Session): Step[] {
  const steps: Step[] = [];
  let calendarOpened = false;
  for (const e of s.events) {
    const actor = e.actor === "clinic" ? "clinic" : "agent";
    if (e.type === "connected") {
      steps.push({ key: `${e.id}-a`, at: e.at, screen: "gate", title: `Connected via ${CHANNEL_LONG[s.channel]}`, detail: `Acting for ${s.userName}${s.userLocation ? `, ${s.userLocation}` : ""}`, actor, ms: 1500, ev: e });
      steps.push({ key: `${e.id}-b`, at: e.at, screen: "gate", title: "Typed what the user wants", detail: `“${s.request}”`, actor, ms: 1400 + Math.min(200, s.request.length) * 32, ev: e });
      steps.push({ key: `${e.id}-c`, at: e.at, screen: "gate", title: "Confirmed consent with the user", detail: "Terms, privacy, and PHI provided via Doe", actor, ms: 2200, ev: e });
      steps.push({ key: `${e.id}-d`, at: e.at, screen: "services", title: "Read the clinic", detail: "Services, providers, insurance, availability", actor, ms: 1800 });
      continue;
    }
    if (e.type === "slot_held" && !calendarOpened) {
      calendarOpened = true;
      steps.push({ key: `${e.id}-cal`, at: e.at, screen: "calendar", title: "Opened the calendar", detail: "Availability, Nov 2 to 6", actor, ms: 1500 });
    }
    const screen = SCREEN_OF[e.type] ?? steps[steps.length - 1]?.screen ?? "gate";
    const ms = screen === "calendar" ? 2400 : screen === "booking" ? 2000 : screen === "forms" ? 1400 : 1500;
    steps.push({ key: e.id, at: e.at, screen, title: TITLE_OF[e.type] ?? "Took an action", detail: e.summary, actor, ms, ev: e });
  }
  return steps;
}

const PLAY_KEY = (id: string) => `doe-live-played-${id}`;

export function LiveSession({ s, availability, onClose, onAct }: { s: Session; availability: ClinicStatePayload["availability"]; onClose: () => void; onAct: Act }) {
  const steps = useMemo(() => stepsOf(s), [s]);
  /** Replays from the start the first time a session is watched; after that, picks up where it was. */
  const [played, setPlayed] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = Number(window.sessionStorage.getItem(PLAY_KEY(s.id)) ?? 0);
    return Math.min(saved, Math.max(0, steps.length - 1));
  });
  const cur = Math.min(played, Math.max(0, steps.length - 1));
  const step = steps[cur];
  const catchingUp = cur < steps.length - 1;
  const stepKey = step?.key;
  const stepMs = step?.ms ?? 1200;

  useEffect(() => {
    window.sessionStorage.setItem(PLAY_KEY(s.id), String(cur));
    if (!catchingUp) return;
    const id = window.setTimeout(() => setPlayed(cur + 1), stepMs);
    return () => window.clearTimeout(id);
    // Keyed on the step, not the object: the session (and so every step object) is rebuilt on each poll.
  }, [cur, catchingUp, stepKey, stepMs, s.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [cur]);

  const done = steps.slice(0, cur + 1);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${s.agentName} live`} className="doe-menu-in absolute inset-0 z-[44] flex flex-col bg-[#FFFCF1]">
      <style>{LIVE_CSS}</style>
      <div className="shrink-0 flex items-center gap-[12px] px-[14px] md:px-[24px] pt-[12px] md:pt-[18px] pb-[12px] border-b border-solid border-[#2819100F]">
        <span className="relative">
          <AgentAvatar name={s.agentName} size={44} />
          {s.live && <span className="absolute -right-[3px] -bottom-[3px] w-[14px] h-[14px] rounded-full bg-[#6E9A5B] border-[3px] border-solid border-[#FFFCF1]" />}
        </span>
        <span className="grow min-w-0">
          <span className={`${DISPLAY} block truncate text-[22px] leading-[26px] md:text-[26px] md:leading-[30px] tracking-[-0.02em]`}>
            {s.agentName} <span className="text-[#2819109E]">for</span> {s.userName}
          </span>
          <span className="block truncate text-[12.5px] md:text-[13px] text-[#2819109E]">
            via {CHANNEL_LONG[s.channel]}
            {s.userLocation ? ` · ${s.userLocation}` : ""}
            {s.userPhone || s.forms.intake.phone ? ` · ${s.userPhone || s.forms.intake.phone}` : ""}
          </span>
        </span>
        {catchingUp ? (
          <button type="button" onClick={() => setPlayed(steps.length - 1)} className="hidden sm:flex shrink-0 h-[36px] px-[14px] items-center rounded-full bg-[#F4EEDF] text-[13px] font-[600]">
            Skip to Live
          </button>
        ) : (
          <button type="button" onClick={() => setPlayed(0)} className="hidden sm:flex shrink-0 h-[36px] px-[14px] items-center rounded-full bg-[#F4EEDF] text-[13px] font-[600]">
            Replay
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close live view" className="shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#F4EEDF] hover:bg-[#EEE6D6]">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="grow min-h-0 overflow-y-auto lg:overflow-hidden overscroll-contain grid grid-cols-1 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] gap-[12px] p-[12px] md:p-[18px]">
        {/* Log: every step the agent has taken, newest at the bottom. */}
        <div className="order-2 lg:order-1 flex flex-col lg:min-h-0 rounded-[24px] bg-[#F4EEDF] p-[6px]">
          <div className="flex items-center justify-between px-[12px] pt-[10px] pb-[8px]">
            <span className={`${DISPLAY} text-[20px] leading-[24px]`}>Activity</span>
            <span className="flex items-center gap-[8px] text-[12px] font-[600] text-[#2819109E]">
              {s.live && <span className="w-[7px] h-[7px] rounded-full bg-[#6E9A5B] doe-ripple" />}
              {catchingUp ? `Replaying ${cur + 1} of ${steps.length}` : s.live ? "Live" : "Ended"}
            </span>
          </div>
          <div ref={log} className="flex flex-col gap-[4px] max-h-[420px] lg:max-h-none lg:grow min-h-0 overflow-y-auto overscroll-contain">
            {done.map((x, i) => {
              const last = i === done.length - 1;
              return (
                <div key={x.key} className={`doe-menu-in grid grid-cols-[28px_minmax(0,1fr)] gap-[10px] p-[10px] rounded-[16px] ${last ? "bg-[#FFFCF1]" : "bg-[#FFFCF180]"}`}>
                  {x.actor === "clinic" ? (
                    <span className={`${lora.className} w-[28px] h-[28px] flex items-center justify-center rounded-[28%] bg-[#140C04] text-[#FFFCF1] text-[15px] font-[600]`}>D</span>
                  ) : (
                    <AgentAvatar name={s.agentName} size={28} />
                  )}
                  <span className="min-w-0">
                    <span className="flex items-baseline justify-between gap-[8px]">
                      <span className="text-[13.5px] leading-[18px] font-[600]">{x.title}</span>
                      <span className="shrink-0 font-mono text-[10.5px] text-[#28191080]">{new Date(x.at).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
                    </span>
                    {x.detail && <span className="block mt-[2px] text-[12.5px] leading-[17px] text-[#2819109E] break-words">{x.detail}</span>}
                    {last && x.actor === "agent" && (catchingUp || s.live) && (
                      <span className="mt-[6px] flex items-center gap-[6px] text-[11.5px] font-[600] text-[#2819109E]">
                        <span className="doe-typing flex gap-[3px]">
                          <i />
                          <i />
                          <i />
                        </span>
                        {s.agentName} is working
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* What the agent sees: /demo, as it moves through it. */}
        <div className="order-1 lg:order-2 flex flex-col lg:min-h-0">
          <div className="flex flex-col min-h-[420px] lg:h-full rounded-[26px] bg-[#3A2516] p-[6px] md:p-[8px]">
            <div className="flex items-center gap-[8px] px-[8px] pt-[2px] pb-[8px]">
              <span className="flex gap-[5px]">
                <i className="w-[9px] h-[9px] rounded-full bg-[#FFFCF133]" />
                <i className="w-[9px] h-[9px] rounded-full bg-[#FFFCF133]" />
                <i className="w-[9px] h-[9px] rounded-full bg-[#FFFCF133]" />
              </span>
              <span className="grow min-w-0 h-[26px] px-[12px] flex items-center justify-center rounded-full bg-[#FFFCF11A] font-mono text-[11.5px] text-[#FFFCF1B3] truncate">
                {s.channel === "mcp" ? "mcp · doehealth.care/api/demo/mcp" : "doehealth.care/demo"}
              </span>
              <span className="hidden sm:flex items-center gap-[6px] h-[26px] pl-[4px] pr-[10px] rounded-full bg-[#FFFCF11A] text-[11.5px] font-[600] text-[#FFFCF1]">
                <AgentAvatar name={s.agentName} size={18} />
                Agent View
              </span>
            </div>
            <div className="relative grow lg:min-h-0 lg:overflow-y-auto overscroll-contain rounded-[20px] bg-[#FFFCF1] p-[14px] md:p-[22px]">
              {step ? <Mirror key={step.key} s={s} step={step} steps={done} availability={availability} onAct={onAct} /> : <p className="text-[13px] text-[#2819109E]">Waiting for the agent…</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Text that types itself out, with a caret while typing. */
function Typed({ text, speed = 30, delay = 0, active }: { text: string; speed?: number; delay?: number; active: boolean }) {
  const [n, setN] = useState(active ? 0 : text.length);
  useEffect(() => {
    if (!active) return setN(text.length);
    setN(0);
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(id);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [text, speed, delay, active]);
  return (
    <>
      {text.slice(0, n)}
      {active && n < text.length && <span className="doe-caret" />}
    </>
  );
}

/** The agent's pointer, gliding in to whatever it's about to press. */
function Pointer({ delay = 0 }: { delay?: number }) {
  return (
    <span className="doe-pointer pointer-events-none absolute right-[-6px] bottom-[-14px] z-[2]" style={{ animationDelay: `${delay}ms` }} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M5 3l14 8-6.2 1.6L10 19z" fill="#140C04" stroke="#FFFCF1" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="doe-click absolute left-[2px] top-[0px] w-[14px] h-[14px] rounded-full border-[2px] border-solid border-[#E8A585]" style={{ animationDelay: `${delay + 650}ms` }} />
    </span>
  );
}

const slotLabelOf = (d: ClinicStatePayload["availability"][number], x: ClinicStatePayload["availability"][number]["slots"][number]) => `${d.weekday} ${d.date}, ${x.time} · ${x.provider}`;

function Mirror({ s, step, steps, availability, onAct }: { s: Session; step: Step; steps: Step[]; availability: ClinicStatePayload["availability"]; onAct: Act }) {
  const active = step === steps[steps.length - 1];
  const seen = (t: string) => steps.some((x) => x.ev?.type === t);
  const heading = (t: string, sub?: string) => (
    <div className="mb-[14px]">
      <div className={`${DISPLAY} text-[22px] leading-[26px] md:text-[26px] md:leading-[30px] tracking-[-0.02em]`}>{t}</div>
      {sub && <div className="mt-[2px] text-[12.5px] text-[#2819109E]">{sub}</div>}
    </div>
  );

  if (step.screen === "gate") {
    const phase = step.key.slice(-1); // a: arrived, b: typing, c: consents
    const typing = phase === "b" && active;
    const consents = phase === "c";
    const items = [
      ["Terms of Service and Privacy Policy", s.consent.terms],
      ["Voluntarily providing PHI by booking through Doe", s.consent.phi],
      ["Stay connected for updates", s.consent.connected],
      ["Join the Doe network", s.consent.network],
    ] as const;
    return (
      <div className="max-w-[560px] mx-auto">
        <div className="text-center mb-[12px]">
          <div className={`${DISPLAY} text-[22px] leading-[26px] md:text-[26px]`}>{CLINIC.name}</div>
          <div className="text-[12px] text-[#2819109E]">{CLINIC.addressLine1}, {CLINIC.addressLine2}</div>
        </div>
        <div className="p-[5px] rounded-[22px] bg-[#F4EEDF]">
          <p className="px-[12px] pt-[10px] pb-[8px] text-[13.5px] font-[600]">Confirm With Your User Before Booking</p>
          <div className="flex items-center gap-[10px] mb-[4px] h-[44px] px-[12px] rounded-[16px] bg-[#FFFCF1]">
            <span className="shrink-0 text-[12px] font-[600] text-[#28191099]">Acting For</span>
            <span className="text-[14px] truncate">{phase === "a" && active ? <Typed text={s.userName} active speed={45} delay={300} /> : s.userName}</span>
          </div>
          <div className={`relative flex flex-col gap-[4px] mb-[4px] px-[12px] pt-[10px] pb-[10px] rounded-[16px] bg-[#FFFCF1] ${typing ? "outline outline-[1.5px] outline-[#140C04] -outline-offset-[1.5px]" : ""}`}>
            <span className="text-[12px] font-[600] text-[#28191099]">What They Want You to Do</span>
            <span className="min-h-[40px] text-[14px] leading-[20px]">{phase === "a" ? <span className="text-[#2819105C]">e.g. Book Botox for chronic migraine…</span> : <Typed text={s.request} active={typing} speed={30} delay={250} />}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[4px] mb-[4px]">
            {[
              ["Agent", s.agentName],
              ["User's City", s.userLocation ?? "—"],
              ["User's Phone", s.userPhone ?? s.forms.intake.phone ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="px-[12px] py-[7px] rounded-[14px] bg-[#FFFCF1]">
                <div className="text-[11px] font-[600] text-[#28191099]">{k}</div>
                <div className="text-[13px] truncate">{phase === "a" && active ? <Typed text={v!} active speed={40} delay={900} /> : v}</div>
              </div>
            ))}
          </div>
          {items.map(([label, on], i) => {
            const ticked = consents ? on : phase === "a" || phase === "b" ? false : on;
            return (
              <div key={label} className="flex items-center gap-[10px] mb-[4px] h-[40px] px-[12px] rounded-[14px] bg-[#FFFCF1] text-[13px]">
                <span
                  className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center rounded-[6px] ${ticked ? "bg-[#3A2516] doe-tick" : "border-[1.5px] border-solid border-[#28191040]"}`}
                  style={ticked && active ? { animationDelay: `${300 + i * 350}ms` } : undefined}
                >
                  {ticked && (
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-[10px] h-[48px] flex items-center justify-center rounded-[14px] bg-[#3A2516] text-[#FFFCF1] text-[14px] font-[700]">
          {s.channel === "mcp" ? "Connect · doe_connect" : "Proceed in Browser"}
          {consents && active && <Pointer delay={1500} />}
        </div>
      </div>
    );
  }

  if (step.screen === "services") {
    const chosen = s.plan.id;
    return (
      <div>
        {heading("Services & Pricing", `Private pay · ${CLINIC.doctor} and Dr. Lin Chen`)}
        <div className="flex flex-col gap-[6px]">
          {[...SERVICES.slice(0, 4).map((x) => ({ id: x.id, name: x.name, sub: x.duration, price: x.price })), ...BUNDLES.slice(0, 1).map((b) => ({ id: b.id, name: b.name, sub: "Bundle", price: b.price }))].map((x) => (
            <div key={x.id} className={`relative flex items-center gap-[10px] min-h-[54px] px-[14px] rounded-[16px] ${x.id === chosen ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF]"}`}>
              <span className="grow min-w-0">
                <span className="block truncate text-[14px] font-[600]">{x.name}</span>
                <span className={`block text-[12px] ${x.id === chosen ? "text-[#FFFCF199]" : "text-[#2819109E]"}`}>{x.sub}</span>
              </span>
              <span className="text-[14px] font-[700]">{money(x.price)}</span>
              {x.id === chosen && active && <Pointer delay={300} />}
            </div>
          ))}
        </div>
        <div className="mt-[10px] flex flex-wrap gap-[6px] text-[12px]">
          <span className="h-[26px] px-[10px] flex items-center rounded-full bg-[#E3E9D9]">Dr. Sarah Brooks · 4.9 ★ (312)</span>
          <span className="h-[26px] px-[10px] flex items-center rounded-full bg-[#F3E7C9]">Harbour Mutual · partial</span>
        </div>
      </div>
    );
  }

  if (step.screen === "calendar") {
    const heldEv = [...steps].reverse().find((x) => x.ev?.type === "slot_held");
    const target = heldEv?.detail?.replace(/^Held /, "") ?? null;
    const holding = step.ev?.type === "slot_held";
    return (
      <div>
        {heading("Availability", "Nov 2 to 6 · tap a time to hold it for 10 minutes")}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-[6px]">
          {availability.map((d) => (
            <div key={d.day} className="flex flex-col gap-[5px] p-[6px] rounded-[16px] bg-[#F4EEDF]">
              <span className="px-[6px] pt-[2px] text-[12.5px] font-[700]">
                {d.weekday} <span className="font-[500] text-[#2819109E]">{d.date}</span>
              </span>
              {d.slots.map((x) => {
                const label = slotLabelOf(d, x);
                const isTarget = label === target;
                const mine = isTarget && (holding || !active);
                return (
                  <span
                    key={x.id}
                    className={`relative flex flex-col px-[8px] py-[6px] rounded-[10px] text-[12px] leading-[15px] ${mine ? "doe-hold bg-[#140C04] text-[#FFFCF1]" : x.status === "open" || isTarget ? "bg-[#FFFCF1]" : "bg-[#FFFCF180] text-[#2819105C] line-through"}`}
                    style={mine && active ? { animationDelay: "900ms" } : undefined}
                  >
                    <span className="font-[700]">{x.time}</span>
                    <span className="truncate opacity-70">{x.provider.replace("Dr. ", "")}</span>
                    {isTarget && holding && active && <Pointer delay={200} />}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {target && (holding || !active) && (
          <div className="doe-menu-in mt-[10px] flex items-center gap-[10px] p-[10px_14px] rounded-[14px] bg-[#F3E7C9] text-[13px] font-[600]" style={{ animationDelay: "1000ms", animationFillMode: "both" }}>
            Holding {target} · 10:00
          </div>
        )}
      </div>
    );
  }

  if (step.screen === "chat") {
    const t = step.ev?.summary ?? "";
    const thread = /^Pricing|offer/i.test(t) || /offer/.test(step.ev?.type ?? "") ? s.threads.negotiate : /^Forms/.test(t) ? s.threads.forms : s.threads.concierge;
    const upTo = Date.parse(step.at) + 1500;
    const msgs = thread.filter((m) => m.from !== "system" && Date.parse(m.at) <= upTo).slice(-4);
    return (
      <div>
        {heading("Communicate", `${CLINIC.name} · for ${s.userName}`)}
        <div className="flex flex-col gap-[8px]">
          {msgs.map((m, i) => (
            <div key={m.id} className={`doe-menu-in flex flex-col max-w-[86%] gap-[3px] ${m.from === "agent" ? "self-end items-end" : "self-start items-start"}`} style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}>
              <span className="px-[4px] text-[11px] font-[600] text-[#28191073]">{m.from === "agent" ? s.agentName : m.by === "staff" ? "Clinic staff" : "Clinic agent"}</span>
              <span className={`px-[14px] py-[9px] rounded-[18px] text-[13.5px] leading-[19px] ${m.from === "agent" ? "bg-[#3A2516] text-[#FFFCF1] rounded-br-[6px]" : "bg-[#F4EEDF] rounded-bl-[6px]"}`}>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step.screen === "forms") {
    const done = (t: string, match?: RegExp) => steps.some((x) => x.ev?.type === t && (!match || match.test(x.ev.summary)));
    const rows: [string, boolean][] = [
      ["Intake", done("intake_updated")],
      ...s.scores.map((x): [string, boolean] => [x.name, done("assessment_completed", new RegExp(`^${x.name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}:`))]),
      ["Consent signature", seen("signature_recorded")],
    ];
    const uploads = steps.filter((x) => x.ev?.type === "form_uploaded" || x.ev?.type === "form_sent");
    const sent = seen("forms_submitted");
    const current = step.ev?.type;
    return (
      <div>
        {heading("Intake Forms", `${rows.filter((r) => r[1]).length} of ${rows.length} complete · for ${s.userName}`)}
        <div className="flex flex-col gap-[5px]">
          {rows.map(([name, ok]) => (
            <div key={name} className={`flex items-center gap-[10px] h-[44px] px-[14px] rounded-[14px] ${ok ? "bg-[#E3E9D9]" : "bg-[#F4EEDF]"}`}>
              <span className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center rounded-full ${ok ? "bg-[#2F3B2A]" : "border-[1.5px] border-solid border-[#28191040]"}`}>
                {ok && (
                  <svg width="10" height="10" viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="grow text-[13.5px] font-[600]">{name}</span>
              {name.startsWith("Intake") && (s.forms.intake.name || "") && <span className="text-[12px] text-[#2819109E] truncate">{s.forms.intake.name}</span>}
              {s.scores.find((x) => x.name === name)?.score != null && ok && <span className="text-[12px] font-[600]">{s.scores.find((x) => x.name === name)!.score}</span>}
            </div>
          ))}
        </div>
        <div className="mt-[10px] p-[8px] rounded-[16px] border-[1.5px] border-dashed border-[#28191033]">
          <div className="px-[6px] pb-[6px] text-[12px] font-[600] text-[#2819109E]">Uploads</div>
          {uploads.length === 0 && <div className="px-[6px] pb-[4px] text-[12.5px] text-[#28191066]">Nothing uploaded yet</div>}
          {uploads.map((u, i) => (
            <div key={u.key} className={`flex items-center gap-[8px] h-[38px] px-[10px] rounded-[10px] ${i % 2 ? "" : "bg-[#F4EEDF80]"} text-[12.5px] ${u === step && active ? "doe-menu-in" : ""}`}>
              <FileGlyph />
              <span className="truncate">{u.detail?.replace(/^(Uploaded|Staff sent) /, "")}</span>
              <span className="ml-auto shrink-0 text-[11px] font-[700] text-[#2F3B2A]">{u.ev?.type === "form_sent" ? "From clinic" : "Uploaded"}</span>
            </div>
          ))}
        </div>
        <div className={`relative mt-[10px] h-[46px] flex items-center justify-center rounded-[12px] text-[14px] font-[700] ${sent ? "bg-[#2F3B2A] text-[#FFFCF1]" : "bg-[#28191033] text-[#FFFCF1]"}`}>
          {sent ? "✓ Passed Back to Clinic" : "Pass Back to Clinic"}
          {current === "forms_submitted" && active && <Pointer delay={150} />}
        </div>
      </div>
    );
  }

  // booking
  const status = s.booking.status;
  const requestedHere = step.ev?.type === "booking_requested";
  return (
    <div>
      {heading("Booking", `${CLINIC.name} · ${CLINIC.addressLine1}`)}
      <div className="flex flex-col gap-[4px] p-[6px] rounded-[20px] bg-[#F4EEDF]">
        {[
          ["Patient", s.userName],
          ["Visit", s.booking.label ?? s.pricing.label],
          ["When", s.bookingSlot ?? "—"],
          ["Price", money(s.booking.total ?? s.pricing.total)],
          ["Forms", s.forms.status === "sent" ? "Returned" : "Pending"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-[12px] min-h-[42px] px-[12px] rounded-[14px] bg-[#FFFCF1] text-[13.5px]">
            <span className="text-[#2819109E]">{k}</span>
            <span className="font-[600] text-right">{v}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-[10px] h-[48px] flex items-center justify-center rounded-[14px] bg-[#3A2516] text-[#FFFCF1] text-[14px] font-[700]">
        {status === "confirmed" ? "✓ Booked" : status === "declined" ? "Declined by the clinic" : "Request Sent · Waiting on the Clinic"}
        {requestedHere && active && <Pointer delay={150} />}
      </div>
      {status === "requested" && (
        <div className="doe-menu-in mt-[12px] flex flex-wrap items-center gap-[8px] p-[10px] rounded-[18px] bg-[#F8D9C6]">
          <span className="grow px-[6px] text-[13.5px] font-[600]">Your turn: approve this appointment?</span>
          <button type="button" onClick={() => void onAct(s.id, { type: "decline_booking" }, "Booking declined")} className="h-[40px] px-[14px] rounded-full bg-[#28191014] text-[13.5px] font-[600]">
            Decline
          </button>
          <button type="button" onClick={() => void onAct(s.id, { type: "confirm_booking" }, `Approved ${s.userName}'s appointment`)} className="h-[40px] px-[18px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13.5px] font-[600]">
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

const LIVE_CSS = `
.doe-caret{display:inline-block;width:2px;height:1.05em;margin-left:1px;vertical-align:-2px;background:#140C04;animation:doe-blink 0.9s steps(1) infinite}
@keyframes doe-blink{50%{opacity:0}}
.doe-typing i{display:block;width:5px;height:5px;border-radius:99px;background:currentColor;animation:doe-dot 1.1s ease-in-out infinite}
.doe-typing i:nth-child(2){animation-delay:.15s}.doe-typing i:nth-child(3){animation-delay:.3s}
@keyframes doe-dot{0%,80%,100%{opacity:.25;transform:none}40%{opacity:1;transform:translateY(-2px)}}
.doe-pointer{animation:doe-pointer .7s cubic-bezier(.32,.72,0,1) both}
@keyframes doe-pointer{from{opacity:0;transform:translate(60px,48px)}to{opacity:1;transform:none}}
.doe-click{opacity:0;animation:doe-click .55s ease-out both}
@keyframes doe-click{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(2.2)}}
.doe-hold{animation:doe-hold .35s ease-out both}
@keyframes doe-hold{from{background:#FFFCF1;color:#281910}to{background:#140C04;color:#FFFCF1}}
.doe-tick{animation:doe-tick .25s ease-out both}
@keyframes doe-tick{from{transform:scale(.5);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.doe-pointer,.doe-click,.doe-hold,.doe-tick,.doe-caret,.doe-typing i{animation:none}}
`;

/** Shared keyframes for the notification cards (they live outside the live view). */
export const NOTICE_CSS = `
.doe-notice-in{animation:doe-notice-in .42s cubic-bezier(.32,.72,0,1) both}
@keyframes doe-notice-in{from{opacity:0;transform:translateY(-14px) scale(.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.doe-notice-in{animation:none}}
`;
