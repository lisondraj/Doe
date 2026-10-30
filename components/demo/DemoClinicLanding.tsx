"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { Check, DISPLAY, DemoFrame, EASE } from "@/components/demo/DemoFrame";
import type { DemoConsent } from "@/components/demo/DemoGate";
import { DemoIntakeForm, type IntakeState } from "@/components/demo/DemoIntakeForm";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { DemoThread } from "@/components/demo/DemoThread";
import {
  BUNDLES,
  CLINIC,
  COMMS,
  DAYS,
  DEMO_USER,
  OFFERS,
  PAYMENT_NOTES,
  PROVIDERS,
  SERVICES,
  money,
} from "@/lib/demo/demo-clinic";
import { type DemoMessage, type DemoThreadId, conciergeReply, formsReply, negotiateReply } from "@/lib/demo/demo-replies";

type Plan = { kind: "service" | "bundle"; id: string };
type Thread = { title: string; subtitle: string; messages: DemoMessage[]; unread: number; typing: boolean };
type Booking = "none" | "sent" | "confirmed";

const NAV = [
  { id: "services", label: "Services & pricing" },
  { id: "availability", label: "Availability" },
  { id: "offers", label: "Offers" },
  { id: "bundles", label: "Bundles" },
  { id: "negotiate", label: "Negotiate" },
  { id: "ask", label: "Ask the clinic" },
  { id: "insurance", label: "Insurance & payment" },
  { id: "communication", label: "Communication" },
  { id: "forms", label: "Forms" },
  { id: "booking", label: "Booking", small: true },
] as const;

const PLANS: { plan: Plan; label: string; price: number }[] = [
  ...SERVICES.map((s) => ({ plan: { kind: "service" as const, id: s.id }, label: s.name, price: s.price })),
  ...BUNDLES.map((b) => ({ plan: { kind: "bundle" as const, id: b.id }, label: b.name, price: b.price })),
];
const planKey = (p: Plan) => `${p.kind}:${p.id}`;
const planOf = (p: Plan) => PLANS.find((x) => planKey(x.plan) === planKey(p))!;
const NEGOTIABLE: Plan[] = [
  { kind: "service", id: "botox" },
  { kind: "bundle", id: "start" },
  { kind: "bundle", id: "year" },
  { kind: "bundle", id: "rescue" },
];

const clock = () => new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
let seq = 0;
const msg = (from: DemoMessage["from"], text: string, extra: Partial<DemoMessage> = {}): DemoMessage => ({
  id: `m${++seq}`,
  from,
  text,
  at: clock(),
  ...extra,
});

function initialThreads(consent: DemoConsent): Record<DemoThreadId, Thread> {
  return {
    concierge: {
      title: "Clinic concierge",
      subtitle: "Questions about care and visits",
      unread: 1,
      typing: false,
      messages: [
        msg("system", `Agent session opened for ${DEMO_USER.name}${consent.connected ? " · stays connected" : ""}`),
        msg(
          "clinic",
          `Hi, I'm the agent for ${CLINIC.name}. I see your user is looking for Botox for chronic migraine. Ask me anything about the treatment, timing or the visit.`,
        ),
      ],
    },
    negotiate: {
      title: "Pricing & bundles",
      subtitle: "Negotiate with the clinic",
      unread: 1,
      typing: false,
      messages: [
        msg(
          "clinic",
          "All prices are private pay, in CAD. If your user has a budget in mind, propose a price and I'll check what Dr. Brooks can do.",
        ),
      ],
    },
    forms: {
      title: "Intake form",
      subtitle: "Forms the clinic needs",
      unread: 1,
      typing: false,
      messages: [
        msg(
          "clinic",
          "Please pass back the new patient intake before the first visit. Most of it can come from your user's profile; we only need their signature.",
        ),
      ],
    },
  };
}

/** Dr. Brooks' clinic, as the user's personal agent sees it once it's through the consent screen. */
export function DemoClinicLanding({ consent }: { consent: DemoConsent }) {
  const [threads, setThreads] = useState(() => initialThreads(consent));
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxThread, setInboxThread] = useState<DemoThreadId | null>(null);
  const [plan, setPlan] = useState<Plan>({ kind: "service", id: "botox" });
  const [agreed, setAgreed] = useState<Record<string, number>>({});
  const [provider, setProvider] = useState<string>("all");
  const [day, setDay] = useState(DAYS[0]!.id);
  const [slot, setSlot] = useState<string | null>(null);
  const [held, setHeld] = useState<string | null>(null);
  const [comms, setComms] = useState(() => Object.fromEntries(COMMS.map((c) => [c.id, c.on])));
  const [intake, setIntake] = useState<IntakeState>("draft");
  const [booking, setBooking] = useState<Booking>("none");
  const [toast, setToast] = useState<string | null>(null);
  const [active, setActive] = useState<string>("services");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /** Highlights the section in view in the nav. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const flash = (text: string) => {
    setToast(text);
    later(() => setToast((t) => (t === text ? null : t)), 2600);
  };

  /** The thread open in the inbox, read by replies that land after a delay. */
  const viewing = useRef<DemoThreadId | null>(null);
  viewing.current = inboxOpen ? inboxThread : null;

  /** Adds a message; it counts as unread unless the thread is open in the inbox. */
  const post = (id: DemoThreadId, m: DemoMessage, unread = m.from !== "agent") =>
    setThreads((t) => ({
      ...t,
      [id]: { ...t[id], typing: false, messages: [...t[id].messages, m], unread: t[id].unread + (unread && viewing.current !== id ? 1 : 0) },
    }));

  const typing = (id: DemoThreadId, on: boolean) => setThreads((t) => ({ ...t, [id]: { ...t[id], typing: on } }));

  const current = planOf(plan);

  const send = (id: DemoThreadId, text: string) => {
    post(id, msg("agent", text));
    typing(id, true);
    later(() => {
      if (id === "concierge") post(id, msg("clinic", conciergeReply(text)));
      else if (id === "forms") post(id, msg("clinic", formsReply()));
      else {
        const r = negotiateReply(text, current.label, current.price);
        post(id, msg("clinic", r.text, r.offer ? { offer: r.offer } : {}));
      }
    }, 1100);
  };

  const answerOffer = (messageId: string, accept: boolean) => {
    const m = threads.negotiate.messages.find((x) => x.id === messageId);
    if (!m?.offer) return;
    setThreads((t) => ({
      ...t,
      negotiate: {
        ...t.negotiate,
        messages: t.negotiate.messages.map((x) =>
          x.id === messageId && x.offer ? { ...x, offer: { ...x.offer, status: accept ? "accepted" : "declined" } } : x,
        ),
      },
    }));
    if (accept) {
      const p = PLANS.find((x) => x.label === m.offer!.label);
      if (p) {
        setAgreed((a) => ({ ...a, [planKey(p.plan)]: m.offer!.price }));
        setPlan(p.plan);
      }
      post("negotiate", msg("agent", `Accepted ${money(m.offer.price)} for ${m.offer.label} on behalf of ${DEMO_USER.name}.`));
      typing("negotiate", true);
      later(() => post("negotiate", msg("clinic", "Locked in. The price holds for 48 hours and shows on the booking.")), 900);
      flash(`Price locked: ${money(m.offer.price)}`);
    } else {
      post("negotiate", msg("agent", "My user will pass on that one for now."));
    }
  };

  const slotInfo = DAYS.flatMap((d) => d.slots.map((s) => ({ ...s, day: d }))).find((s) => s.id === held);

  const holdSlot = () => {
    if (!slot) return;
    const s = DAYS.flatMap((d) => d.slots.map((x) => ({ ...x, day: d }))).find((x) => x.id === slot)!;
    setHeld(slot);
    post("concierge", msg("system", `Held ${s.day.weekday} ${s.day.date}, ${s.time} with ${s.provider} for 10 minutes`), false);
    later(() => post("concierge", msg("clinic", `I've held ${s.day.weekday} ${s.day.date} at ${s.time} with ${s.provider}. Send the booking request when your user is ready.`)), 700);
    flash("Slot held for 10 minutes");
  };

  const passBack = () => {
    setIntake("sent");
    post("forms", msg("agent", "Passing back the new patient intake, signed by my user."));
    typing("forms", true);
    later(() => post("forms", msg("clinic", "Received, thank you. Dr. Brooks will review it before the visit.")), 1000);
    flash("Intake passed back to the clinic");
  };

  const list = current.price;
  const deal = agreed[planKey(plan)];
  const discount = deal ? 0 : Math.round(list * 0.05);
  const total = (deal ?? list) - discount;
  const ready = Boolean(held) && intake === "sent";

  const requestBooking = () => {
    if (!slotInfo) return;
    setBooking("sent");
    post("concierge", msg("agent", `Booking request: ${current.label}, ${slotInfo.day.weekday} ${slotInfo.day.date} at ${slotInfo.time} with ${slotInfo.provider}, ${money(total)}.`));
    typing("concierge", true);
    later(() => {
      setBooking("confirmed");
      post("concierge", msg("clinic", `Confirmed. ${DEMO_USER.name} is booked for ${slotInfo.day.weekday} ${slotInfo.day.date} at ${slotInfo.time}. I'll send reminders to you 48 and 2 hours before.`));
      flash("Booking confirmed");
    }, 2200);
  };

  const unread = Object.values(threads).reduce((n, t) => n + t.unread, 0);

  const openInbox = (id: DemoThreadId | null = null) => {
    setInboxOpen(true);
    setInboxThread(id);
    if (id) setThreads((t) => ({ ...t, [id]: { ...t[id], unread: 0 } }));
  };

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const chips = {
    concierge: ["How many units does Dr. Brooks use?", "How soon does it start working?", "Any side effects?", "Does my user need a referral?", "Cancellation policy?"],
    negotiate: [`Can you do ${money(Math.round((list * 0.88) / 25) * 25)}?`, "Is there a discount for my user?", "Can the consult be waived?"],
    forms: ["Can my user bring their headache diary?", "Is a referral letter needed?"],
  } satisfies Record<DemoThreadId, string[]>;

  const thread = (id: DemoThreadId, className: string) => (
    <DemoThread
      messages={threads[id].messages}
      typing={threads[id].typing}
      chips={chips[id]}
      placeholder={id === "negotiate" ? "Propose a price or ask for a deal" : "Ask the clinic for your user"}
      onSend={(t) => send(id, t)}
      onOffer={id === "negotiate" ? answerOffer : undefined}
      className={className}
    />
  );

  const summary = (
    <BookingSummary
      label={current.label}
      list={list}
      deal={deal}
      discount={discount}
      total={total}
      slot={slotInfo ? `${slotInfo.day.weekday} ${slotInfo.day.date}, ${slotInfo.time} · ${slotInfo.provider}` : null}
      intake={intake}
      booking={booking}
      ready={ready}
      onRequest={requestBooking}
      onGo={go}
    />
  );

  const inboxButton = (
    <button
      type="button"
      onClick={() => openInbox(null)}
      aria-label={`Agent inbox, ${unread} unread`}
      className="relative w-[42px] h-[42px] flex items-center justify-center rounded-full bg-[#F4EEDF] hover:bg-[#EEE6D6] transition-colors duration-150"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13.5l2.2-7.1A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.4l2.2 7.1V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="none" stroke="#281910" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M4 13.5h4.5l1 2h5l1-2H20" fill="none" stroke="#281910" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
      {unread > 0 && (
        <span className="absolute -top-[2px] -right-[2px] min-w-[19px] h-[19px] px-[5px] flex items-center justify-center rounded-full bg-[#E8704A] text-[11px] leading-[11px] font-[700] text-[#FFFCF1] border-2 border-solid border-[#FFFCF1]">
          {unread}
        </span>
      )}
    </button>
  );

  const overlay = (
    <>
      {/* Phone: what the user will pay, always in reach. */}
      <div
        className="lg:hidden absolute left-[10px] right-[10px] bottom-[10px] z-20 flex items-center gap-[12px] h-[62px] pl-[18px] pr-[8px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] shadow-[0_10px_30px_rgba(20,12,4,0.25)] transition-opacity duration-200"
        style={{ opacity: inboxOpen ? 0 : 1, pointerEvents: inboxOpen ? "none" : "auto" }}
      >
        <span className="flex flex-col grow min-w-0">
          <span className="truncate text-[12px] leading-[16px] text-[#FFFCF1A6]">{current.label}</span>
          <span className="text-[16px] leading-[20px] font-[700]">
            {money(total)}
            <span className="ml-[6px] text-[12px] font-[500] text-[#FFFCF1A6]">{booking === "confirmed" ? "· Booked" : held ? "· Slot held" : ""}</span>
          </span>
        </span>
        <button type="button" onClick={() => go("booking")} className="shrink-0 h-[46px] px-[18px] rounded-[999px] bg-[#FFFCF1] text-[#140C04] text-[14px] font-[600]">
          {booking === "confirmed" ? "View booking" : "Review"}
        </button>
      </div>

      {toast && (
        <div className="absolute left-1/2 top-[72px] md:top-[82px] z-50 -translate-x-1/2 h-[38px] px-[16px] flex items-center rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] whitespace-nowrap shadow-[0_8px_24px_rgba(20,12,4,0.25)] doe-menu-in">
          {toast}
        </div>
      )}

      <Inbox
        open={inboxOpen}
        threadId={inboxThread}
        threads={threads}
        onClose={() => setInboxOpen(false)}
        onOpenThread={(id) => openInbox(id)}
        onBack={() => setInboxThread(null)}
        renderThread={(id) => thread(id, "grow min-h-0")}
      />
    </>
  );

  return (
    <DemoFrame right={inboxButton} overlay={overlay}>
      {/* Phone: sections as a sticky row of pills under the bar. */}
      <nav className="md:hidden sticky top-[64px] z-20 flex gap-[6px] overflow-x-auto px-[16px] py-[8px] bg-[#FFFCF1E6] backdrop-blur-[12px] [scrollbar-width:none]">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] transition-colors duration-150 ${active === n.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_340px] md:gap-[28px] md:px-[32px] max-w-[1440px] mx-auto pb-[96px] lg:pb-[40px]">
        <aside className="hidden md:flex flex-col gap-[2px] sticky top-[72px] self-start pt-[8px]">
          <span className="px-[12px] pb-[8px] text-[11px] font-[600] uppercase tracking-[0.08em] text-[#28191073]">On this page</span>
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.id)}
              className={`${"small" in n ? "lg:hidden " : ""}h-[36px] px-[12px] rounded-[10px] text-left text-[14px] font-[500] transition-colors duration-150 ${active === n.id ? "bg-[#F4EEDF] text-[#281910]" : "text-[#281910A6] hover:text-[#281910]"}`}
            >
              {n.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => openInbox(null)}
            className="mt-[14px] h-[40px] px-[12px] flex items-center justify-between rounded-[12px] bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600]"
          >
            Agent inbox
            {unread > 0 && <span className="min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#E8704A] text-[11px]">{unread}</span>}
          </button>
        </aside>

        <main className="min-w-0 flex flex-col gap-[28px] px-[16px] md:px-0 pt-[6px]">
          {/* Hero: the clinic and the agent's session. */}
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-center gap-[16px]">
              <DemoSphere size={76} className="shrink-0" />
              <div className="min-w-0">
                <h1 className={`${DISPLAY} text-[26px] leading-[30px] md:text-[34px] md:leading-[38px] tracking-[-0.02em]`}>{CLINIC.name}</h1>
                <p className="mt-[4px] text-[13px] leading-[18px] text-[#2819109E]">
                  {CLINIC.addressLine1}, {CLINIC.addressLine2}
                </p>
              </div>
            </div>
            <div className="rounded-[22px] bg-[#140C04] text-[#FFFCF1] p-[16px] md:p-[18px]">
              <div className="flex items-center gap-[8px] text-[11px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#9BC59D] animate-pulse" /> Agent session · via Doe
              </div>
              <p className="mt-[8px] text-[16px] leading-[22px] font-[500]">
                You&apos;re browsing for {DEMO_USER.name}. Their request: {DEMO_USER.request}, private pay.
              </p>
              <div className="mt-[12px] flex flex-wrap gap-[6px]">
                {[
                  ["Terms accepted", true],
                  ["Stays connected", consent.connected],
                  ["Doe network", consent.network],
                ].map(([label, on]) => (
                  <span key={label as string} className={`h-[26px] px-[10px] flex items-center rounded-full text-[12px] font-[600] ${on ? "bg-[#FFFCF11F] text-[#FFFCF1]" : "bg-transparent text-[#FFFCF166] border border-solid border-[#FFFCF126]"}`}>
                    {on ? "✓ " : ""}
                    {label as string}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[6px]">
              {[
                ["Botox from", money(1450)],
                ["Earliest", "Mon, 9:00 am"],
                ["Replies in", "Under 5 min"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[16px] bg-[#F4EEDF] px-[12px] py-[10px]">
                  <div className="text-[11px] leading-[14px] text-[#2819109E]">{k}</div>
                  <div className="mt-[2px] text-[14px] leading-[18px] font-[700]">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <Section id="services" kicker="All private pay, in CAD" title="Services & pricing">
            <div className="flex flex-col gap-[6px]">
              {SERVICES.map((s) => {
                const on = plan.kind === "service" && plan.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPlan({ kind: "service", id: s.id })}
                    className={`flex items-start gap-[12px] p-[14px] rounded-[18px] text-left transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className="grow min-w-0">
                      <span className="flex flex-wrap items-center gap-[6px]">
                        <span className="text-[15px] leading-[20px] font-[600]">{s.name}</span>
                        {s.match && <span className={`h-[20px] px-[8px] flex items-center rounded-full text-[10.5px] font-[700] ${on ? "bg-[#FCCFB8] text-[#281910]" : "bg-[#FCCFB8]"}`}>Your user&apos;s request</span>}
                      </span>
                      <span className={`block mt-[3px] text-[13px] leading-[18px] ${on ? "text-[#FFFCF1B3]" : "text-[#2819109E]"}`}>{s.detail}</span>
                      <span className={`block mt-[4px] text-[12px] leading-[16px] font-[500] ${on ? "text-[#FFFCF180]" : "text-[#28191080]"}`}>{s.duration}</span>
                    </span>
                    <span className="shrink-0 text-[16px] leading-[20px] font-[700]">{money(s.price)}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section id="availability" kicker="Live from the clinic's calendar" title="Availability">
            <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none]">
              {["all", ...PROVIDERS].map((p) => (
                <Pill key={p} on={provider === p} onClick={() => setProvider(p)}>
                  {p === "all" ? "Any provider" : p}
                </Pill>
              ))}
            </div>
            <div className="mt-[10px] grid grid-cols-5 gap-[6px]">
              {DAYS.map((d) => {
                const n = d.slots.filter((s) => provider === "all" || s.provider === provider).length;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDay(d.id)}
                    className={`flex flex-col items-center py-[10px] rounded-[16px] transition-colors duration-150 ${day === d.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className="text-[12px] leading-[16px] font-[500] opacity-70">{d.weekday}</span>
                    <span className="text-[15px] leading-[20px] font-[700]">{d.date.split(" ")[1]}</span>
                    <span className="text-[10.5px] leading-[14px] opacity-60">{n} open</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
              {DAYS.find((d) => d.id === day)!
                .slots.filter((s) => provider === "all" || s.provider === provider)
                .map((s) => {
                  const on = slot === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlot(s.id)}
                      className={`flex items-center justify-between h-[52px] px-[16px] rounded-[16px] border-[1.5px] border-solid transition-colors duration-150 ${on ? "border-[#140C04] bg-[#FFFCF1]" : "border-transparent bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                    >
                      <span className="text-[15px] font-[700]">{s.time}</span>
                      <span className="text-[13px] text-[#2819109E]">
                        {s.provider}
                        {held === s.id ? " · Held" : ""}
                      </span>
                    </button>
                  );
                })}
              {DAYS.find((d) => d.id === day)!.slots.filter((s) => provider === "all" || s.provider === provider).length === 0 && (
                <p className="text-[13px] text-[#2819109E] px-[4px] py-[12px]">No openings with this provider on this day.</p>
              )}
            </div>
            <div className="mt-[10px] flex items-center gap-[10px]">
              <button
                type="button"
                disabled={!slot || slot === held || booking !== "none"}
                onClick={holdSlot}
                className="h-[46px] px-[20px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
              >
                {held && slot === held ? "Held for your user" : held ? "Hold this slot instead" : "Hold for your user"}
              </button>
              <span className="text-[12.5px] leading-[17px] text-[#2819109E]">Holds last 10 minutes while you confirm with your user.</span>
            </div>
          </Section>

          <Section id="offers" kicker="What the clinic is offering agents" title="Offers">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
              {OFFERS.map((o) => {
                const status = o.id === "agent" ? "Applied" : o.id === "network" ? (consent.network ? "Active" : "Join network to unlock") : "Eligible";
                return (
                  <div key={o.id} className="flex flex-col gap-[6px] p-[14px] rounded-[18px] bg-[#F4EEDF]">
                    <span className="self-start h-[20px] px-[8px] flex items-center rounded-full bg-[#FFFCF1] text-[10.5px] font-[700] text-[#281910B3]">{o.tag}</span>
                    <span className="text-[15px] leading-[20px] font-[600]">{o.title}</span>
                    <span className="text-[13px] leading-[18px] text-[#2819109E]">{o.detail}</span>
                    <span className={`mt-auto pt-[4px] text-[12px] font-[700] ${status === "Applied" || status === "Active" ? "text-[#4C7A4F]" : "text-[#28191080]"}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section id="bundles" kicker="Packages the clinic puts together" title="Bundles">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
              {BUNDLES.map((b) => {
                const on = plan.kind === "bundle" && plan.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPlan({ kind: "bundle", id: b.id })}
                    className={`flex flex-col gap-[8px] p-[16px] rounded-[20px] text-left transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className={`${DISPLAY} text-[19px] leading-[23px]`}>{b.name}</span>
                    <span className="flex flex-col gap-[4px]">
                      {b.includes.map((i) => (
                        <span key={i} className={`text-[13px] leading-[18px] ${on ? "text-[#FFFCF1C0]" : "text-[#281910B3]"}`}>
                          · {i}
                        </span>
                      ))}
                    </span>
                    <span className="mt-auto flex items-baseline gap-[8px] pt-[6px]">
                      <span className="text-[20px] leading-[24px] font-[700]">{money(b.price)}</span>
                      <span className={`text-[13px] line-through ${on ? "text-[#FFFCF166]" : "text-[#28191066]"}`}>{money(b.was)}</span>
                    </span>
                    <span className={`text-[12px] leading-[16px] ${on ? "text-[#FFFCF199]" : "text-[#28191080]"}`}>{b.note}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section id="negotiate" kicker="Agent to agent" title="Negotiate">
            <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none] mb-[10px]">
              {NEGOTIABLE.map((p) => {
                const info = planOf(p);
                return (
                  <Pill key={planKey(p)} on={planKey(plan) === planKey(p)} onClick={() => setPlan(p)}>
                    {info.label === "Botox for chronic migraine" ? "Botox session" : info.label}
                    {agreed[planKey(p)] ? ` · ${money(agreed[planKey(p)]!)}` : ""}
                  </Pill>
                );
              })}
            </div>
            <div className="rounded-[22px] bg-[#F4EEDF] overflow-hidden">
              <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[4px]">
                <span className="text-[13px] font-[600]">{current.label}</span>
                <span className="text-[13px] text-[#2819109E]">
                  List {money(list)}
                  {deal ? ` · agreed ${money(deal)}` : ""}
                </span>
              </div>
              {thread("negotiate", "h-[440px]")}
            </div>
          </Section>

          <Section id="ask" kicker="Answered by the clinic's agent" title="Ask the clinic">
            <div className="rounded-[22px] bg-[#F4EEDF] overflow-hidden">{thread("concierge", "h-[420px]")}</div>
          </Section>

          <Section id="insurance" kicker="Private pay clinic" title="Insurance & payment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
              {PAYMENT_NOTES.map((n) => (
                <div key={n.title} className="p-[14px] rounded-[18px] bg-[#F4EEDF]">
                  <div className="text-[15px] leading-[20px] font-[600]">{n.title}</div>
                  <div className="mt-[4px] text-[13px] leading-[18px] text-[#2819109E]">{n.detail}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="communication" kicker="How the clinic reaches you and your user" title="Communication">
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[12px] p-[14px] rounded-[18px] bg-[#F4EEDF]">
                <span className="grow">
                  <span className="block text-[15px] leading-[20px] font-[600]">Persistent connection</span>
                  <span className="block text-[13px] leading-[18px] text-[#2819109E]">
                    {consent.connected ? "Your agent stays connected and checks back for updates." : "Off. Your user didn't allow a persistent connection; updates wait until your next visit."}
                  </span>
                </span>
                <span className={`h-[26px] px-[10px] flex items-center rounded-full text-[12px] font-[700] ${consent.connected ? "bg-[#DCE5D0]" : "bg-[#FFFCF1]"}`}>{consent.connected ? "On" : "Off"}</span>
              </div>
              {COMMS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="switch"
                  aria-checked={comms[c.id]}
                  onClick={() => setComms((v) => ({ ...v, [c.id]: !v[c.id] }))}
                  className="flex items-center gap-[12px] p-[14px] rounded-[18px] bg-[#F4EEDF] text-left hover:bg-[#EEE6D6] transition-colors duration-150"
                >
                  <span className="grow">
                    <span className="block text-[15px] leading-[20px] font-[600]">{c.title}</span>
                    <span className="block text-[13px] leading-[18px] text-[#2819109E]">{c.detail}</span>
                  </span>
                  <Toggle on={Boolean(comms[c.id])} />
                </button>
              ))}
            </div>
          </Section>

          <Section id="forms" kicker="The clinic asked for one form" title="Forms">
            <DemoIntakeForm state={intake} onPassBack={passBack} />
          </Section>

          <div id="booking" className="lg:hidden scroll-mt-[124px] md:scroll-mt-[88px]">
            {summary}
          </div>
        </main>

        <aside className="hidden lg:block sticky top-[72px] self-start pt-[8px]">{summary}</aside>
      </div>
    </DemoFrame>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[124px] md:scroll-mt-[88px]">
      <div className="mb-[12px] flex flex-col gap-[2px]">
        <span className="text-[12px] leading-[16px] font-[500] text-[#28191080]">{kicker}</span>
        <h2 className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em]`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] whitespace-nowrap transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910] hover:bg-[#EEE6D6]"}`}
    >
      {children}
    </button>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`shrink-0 relative w-[44px] h-[26px] rounded-full transition-colors duration-200 ${on ? "bg-[#140C04]" : "bg-[#28191026]"}`}>
      <span className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-[#FFFCF1] transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </span>
  );
}

function BookingSummary({
  label,
  list,
  deal,
  discount,
  total,
  slot,
  intake,
  booking,
  ready,
  onRequest,
  onGo,
}: {
  label: string;
  list: number;
  deal?: number;
  discount: number;
  total: number;
  slot: string | null;
  intake: IntakeState;
  booking: Booking;
  ready: boolean;
  onRequest: () => void;
  onGo: (id: string) => void;
}) {
  const steps: { label: string; done: boolean; go: string }[] = [
    { label: slot ?? "Hold a slot", done: Boolean(slot), go: "availability" },
    { label: intake === "sent" ? "Intake passed back" : "Pass back the intake form", done: intake === "sent", go: "forms" },
    { label: deal ? `Price agreed at ${money(deal)}` : "Negotiate a price (optional)", done: Boolean(deal), go: "negotiate" },
  ];
  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="rounded-[20px] bg-[#FFFCF1] p-[16px]">
        <div className="text-[12px] leading-[16px] font-[500] text-[#28191080]">Booking for {DEMO_USER.name}</div>
        <div className={`${DISPLAY} mt-[2px] text-[21px] leading-[25px] tracking-[-0.01em]`}>{label}</div>
        <div className="mt-[14px] flex flex-col gap-[6px] text-[13.5px] leading-[18px]">
          <Row k="List price" v={money(list)} strike={Boolean(deal)} />
          {deal ? <Row k="Negotiated" v={money(deal)} /> : <Row k="Booked by agent, 5% off" v={`−${money(discount)}`} />}
          <div className="h-[1px] my-[4px] bg-[#2819101A]" />
          <Row k="Your user pays" v={money(total)} bold />
          <span className="text-[11.5px] leading-[15px] text-[#28191080]">Private pay · itemized receipt for reimbursement</span>
        </div>
      </div>
      <div className="flex flex-col gap-[2px] p-[8px]">
        {steps.map((s) => (
          <button key={s.go} type="button" onClick={() => onGo(s.go)} className="flex items-center gap-[10px] min-h-[40px] px-[8px] rounded-[12px] text-left hover:bg-[#EEE6D6] transition-colors duration-150">
            <Check on={s.done} size={20} />
            <span className={`text-[13px] leading-[17px] ${s.done ? "font-[600]" : "text-[#281910A6]"}`}>{s.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!ready || booking !== "none"}
        onClick={onRequest}
        className="w-full h-[52px] rounded-[18px] text-[15px] font-[600] text-[#FFFCF1] disabled:cursor-not-allowed transition-colors duration-200"
        style={{ backgroundColor: booking === "confirmed" ? "#4C7A4F" : ready && booking === "none" ? "#140C04" : booking === "sent" ? "#38251D" : "#28191033", transitionTimingFunction: EASE }}
      >
        {booking === "confirmed" ? "Booked · confirmation in inbox" : booking === "sent" ? "Sending to clinic…" : "Send booking request"}
      </button>
    </div>
  );
}

function Row({ k, v, strike, bold }: { k: string; v: string; strike?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-[10px]">
      <span className={bold ? "font-[700]" : "text-[#281910B3]"}>{k}</span>
      <span className={`${bold ? "text-[18px] font-[700]" : "font-[600]"} ${strike ? "line-through text-[#28191066]" : ""}`}>{v}</span>
    </div>
  );
}

function Inbox({
  open,
  threadId,
  threads,
  onClose,
  onOpenThread,
  onBack,
  renderThread,
}: {
  open: boolean;
  threadId: DemoThreadId | null;
  threads: Record<DemoThreadId, Thread>;
  onClose: () => void;
  onOpenThread: (id: DemoThreadId) => void;
  onBack: () => void;
  renderThread: (id: DemoThreadId) => ReactNode;
}) {
  const ids = Object.keys(threads) as DemoThreadId[];
  return (
    <div className={`absolute inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-[#140C042E] transition-opacity duration-300" style={{ opacity: open ? 1 : 0 }} onClick={onClose} />
      <aside
        role="dialog"
        aria-label="Agent inbox"
        className={`absolute inset-0 md:left-auto md:top-[10px] md:bottom-[10px] md:right-[10px] md:w-[420px] md:rounded-[22px] flex flex-col bg-[#FFFCF1] md:shadow-[0_20px_60px_rgba(20,12,4,0.25)] transition-transform duration-[380ms] ${
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-[110%]"
        }`}
        style={{ transitionTimingFunction: EASE }}
      >
        <div className="shrink-0 flex items-center gap-[10px] h-[64px] px-[14px] border-b border-solid border-[#2819100F]">
          {threadId ? (
            <button type="button" onClick={onBack} aria-label="All threads" className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#F4EEDF]">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          <span className="grow min-w-0 flex flex-col">
            <span className={`${DISPLAY} text-[20px] leading-[24px]`}>{threadId ? threads[threadId].title : "Agent inbox"}</span>
            <span className="text-[12px] leading-[16px] text-[#2819109E]">{threadId ? threads[threadId].subtitle : `From ${CLINIC.name} to your agent`}</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Close inbox" className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#F4EEDF]">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {threadId ? (
          <div className="grow min-h-0 flex flex-col bg-[#F4EEDF]">{renderThread(threadId)}</div>
        ) : (
          <div className="grow min-h-0 overflow-y-auto p-[10px] flex flex-col gap-[6px]">
            {ids.map((id) => {
              const t = threads[id];
              const last = [...t.messages].reverse().find((m) => m.from !== "system") ?? t.messages[t.messages.length - 1]!;
              return (
                <button key={id} type="button" onClick={() => onOpenThread(id)} className="flex items-start gap-[12px] p-[14px] rounded-[18px] bg-[#F4EEDF] text-left hover:bg-[#EEE6D6] transition-colors duration-150">
                  <span className="mt-[6px] w-[8px] h-[8px] shrink-0 rounded-full" style={{ backgroundColor: t.unread ? "#E8704A" : "transparent" }} />
                  <span className="grow min-w-0">
                    <span className="flex items-baseline justify-between gap-[8px]">
                      <span className="text-[15px] leading-[20px] font-[600]">{t.title}</span>
                      <span className="shrink-0 text-[11.5px] text-[#28191080]">{last.at}</span>
                    </span>
                    <span className="block mt-[2px] text-[13px] leading-[18px] text-[#2819109E] line-clamp-2">
                      {last.from === "agent" ? "You: " : ""}
                      {last.text}
                    </span>
                  </span>
                  {t.unread > 0 && <span className="shrink-0 min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#140C04] text-[11px] font-[700] text-[#FFFCF1]">{t.unread}</span>}
                </button>
              );
            })}
            <p className="px-[8px] pt-[8px] text-[12px] leading-[16px] text-[#28191080]">
              The clinic writes here when something changes: holds, prices, forms and confirmations.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
