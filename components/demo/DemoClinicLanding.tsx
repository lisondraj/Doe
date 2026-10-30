"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { Check, DISPLAY, DemoFrame, EASE } from "@/components/demo/DemoFrame";
import { DemoForms } from "@/components/demo/DemoForms";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { DemoThread } from "@/components/demo/DemoThread";
import { BUNDLES, CLINIC, COMMS, OFFERS, PAYMENT_NOTES, PROVIDERS, SERVICES, money } from "@/lib/demo/demo-clinic";
import type { AgentAction } from "@/lib/demo/demo-engine";
import type { AgentPayload } from "@/lib/demo/demo-service";
import type { DemoPlan, DemoThreadId } from "@/lib/demo/demo-types";

type Act = (a: AgentAction) => Promise<{ ok: true; result: Record<string, unknown> } | { ok: false; error: string }>;

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

const THREAD_TITLES: Record<DemoThreadId, { title: string; subtitle: string }> = {
  concierge: { title: "Clinic concierge", subtitle: "Questions" },
  negotiate: { title: "Pricing & bundles", subtitle: "Negotiation" },
  forms: { title: "Forms", subtitle: "Intake and assessments" },
};

const planKey = (p: DemoPlan) => `${p.kind}:${p.id}`;
const NEGOTIABLE: { plan: DemoPlan; label: string }[] = [
  { plan: { kind: "service", id: "botox" }, label: "Botox session" },
  { plan: { kind: "bundle", id: "start" }, label: "Start bundle" },
  { plan: { kind: "bundle", id: "year" }, label: "Year of relief" },
  { plan: { kind: "bundle", id: "rescue" }, label: "Botox + nerve block" },
];

const clockLeft = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Dr. Brooks' clinic as the user's agent sees it, live: every control here is an API action on the agent's session. */
export function DemoClinicLanding({ state, act, onEnd }: { state: AgentPayload; act: Act; onEnd: () => void }) {
  const s = state.session;
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxThread, setInboxThread] = useState<DemoThreadId | null>(null);
  const [provider, setProvider] = useState<string>("all");
  const [day, setDay] = useState(state.availability[0]!.day);
  const [slot, setSlot] = useState<string | null>(s.hold?.slotId ?? null);
  const [phi, setPhi] = useState(false);
  const [typing, setTyping] = useState<Record<DemoThreadId, boolean>>({ concierge: false, negotiate: false, forms: false });
  const [read, setRead] = useState<Record<DemoThreadId, number>>({ concierge: 0, negotiate: 0, forms: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [active, setActive] = useState<string>("services");
  const [now, setNow] = useState(() => Date.now());
  const toastTimer = useRef<number | null>(null);
  const lastBooking = useRef(s.booking.status);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const flash = (text: string) => {
    setToast(text);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  /** Tells the agent when the clinic decides on its booking. */
  useEffect(() => {
    if (lastBooking.current !== s.booking.status) {
      if (s.booking.status === "confirmed") flash("Booking confirmed by the clinic");
      if (s.booking.status === "declined") flash("Clinic declined the booking");
      lastBooking.current = s.booking.status;
    }
  }, [s.booking.status]);

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

  const run = async (a: AgentAction, done?: string) => {
    const r = await act(a);
    if (!r.ok) flash(r.error);
    else if (done) flash(done);
    return r;
  };

  const unreadOf = (id: DemoThreadId) => s.threads[id].slice(read[id]).filter((m) => m.from === "clinic").length;
  const markRead = (id: DemoThreadId) => setRead((r) => ({ ...r, [id]: s.threads[id].length + 1 }));
  useEffect(() => {
    if (inboxOpen && inboxThread) setRead((r) => ({ ...r, [inboxThread]: s.threads[inboxThread].length }));
  }, [inboxOpen, inboxThread, s.threads]);
  const unread = (Object.keys(THREAD_TITLES) as DemoThreadId[]).reduce((n, id) => n + unreadOf(id), 0);

  const send = async (id: DemoThreadId, text: string) => {
    setTyping((t) => ({ ...t, [id]: true }));
    await run({ type: "send_message", thread: id, text });
    setTyping((t) => ({ ...t, [id]: false }));
    markRead(id);
  };

  const p = state.pricing;
  const locked = s.booking.status === "requested" || s.booking.status === "confirmed";
  const holdLeft = state.hold ? Math.max(0, Math.round((Date.parse(state.hold.expiresAt) - now) / 1000)) : 0;
  const heldId = state.hold && holdLeft > 0 ? state.hold.slotId : null;
  const ready = Boolean(heldId) && s.forms.status === "sent" && phi && state.bookable && !locked;

  const openInbox = (id: DemoThreadId | null = null) => {
    setInboxOpen(true);
    setInboxThread(id);
  };
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const chips: Record<DemoThreadId, string[]> = {
    concierge: ["How many units does Dr. Brooks use?", "How soon does it start working?", "Any side effects?", "What's the earliest opening?", "Cancellation policy?"],
    negotiate: [`Can you do ${money(Math.round((p.list * 0.88) / 25) * 25)}?`, "Is there a discount for my user?", "Can the consult be waived?"],
    forms: ["Can my user bring their headache diary?", "Is a referral letter needed?"],
  };

  const thread = (id: DemoThreadId, className: string) => (
    <DemoThread
      messages={s.threads[id]}
      typing={typing[id]}
      chips={chips[id]}
      placeholder={id === "negotiate" ? "Propose a price or ask for a deal" : "Ask the clinic for your user"}
      onSend={(t) => send(id, t)}
      onOffer={id === "negotiate" ? (mid, accept) => void run({ type: "respond_offer", message_id: mid, accept }, accept ? "Price locked for 48 hours" : undefined) : undefined}
      className={className}
    />
  );

  const summary = (
    <BookingSummary
      state={state}
      phi={phi}
      onPhi={() => setPhi((v) => !v)}
      ready={ready}
      holdLeft={holdLeft}
      heldId={heldId}
      onRequest={() => void run({ type: "request_booking", phi_confirmed: phi }, "Booking request sent")}
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
        <span className="absolute -top-[2px] -right-[2px] min-w-[19px] h-[19px] px-[5px] flex items-center justify-center rounded-full bg-[#140C04] text-[11px] leading-[11px] font-[700] text-[#FFFCF1] border-2 border-solid border-[#FFFCF1]">
          {unread}
        </span>
      )}
    </button>
  );

  const overlay = (
    <>
      <div
        className="lg:hidden absolute left-[10px] right-[10px] bottom-[10px] z-20 flex items-center gap-[12px] h-[62px] pl-[18px] pr-[8px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] shadow-[0_10px_30px_rgba(20,12,4,0.25)] transition-opacity duration-200"
        style={{ opacity: inboxOpen ? 0 : 1, pointerEvents: inboxOpen ? "none" : "auto" }}
      >
        <span className="flex flex-col grow min-w-0">
          <span className="truncate text-[12px] leading-[16px] text-[#FFFCF1A6]">{p.label}</span>
          <span className="text-[16px] leading-[20px] font-[700]">
            {money(s.booking.total ?? p.total)}
            <span className="ml-[6px] text-[12px] font-[500] text-[#FFFCF1A6]">
              {s.booking.status === "confirmed" ? "· Booked" : s.booking.status === "requested" ? "· Requested" : heldId ? `· Held ${clockLeft(holdLeft)}` : ""}
            </span>
          </span>
        </span>
        <button type="button" onClick={() => go("booking")} className="shrink-0 h-[46px] px-[18px] rounded-[999px] bg-[#FFFCF1] text-[#140C04] text-[14px] font-[600]">
          Review
        </button>
      </div>

      {toast && (
        <div className="absolute left-1/2 top-[72px] md:top-[82px] z-50 -translate-x-1/2 max-w-[90%] h-[38px] px-[16px] flex items-center rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis shadow-[0_8px_24px_rgba(20,12,4,0.25)] doe-menu-in">
          {toast}
        </div>
      )}

      <Inbox
        open={inboxOpen}
        threadId={inboxThread}
        state={state}
        unreadOf={unreadOf}
        onClose={() => setInboxOpen(false)}
        onOpenThread={(id) => openInbox(id)}
        onBack={() => setInboxThread(null)}
        renderThread={(id) => thread(id, "grow min-h-0")}
      />
    </>
  );

  const daySlots = state.availability.find((d) => d.day === day)?.slots.filter((x) => provider === "all" || x.provider === provider) ?? [];

  return (
    <DemoFrame agentView right={inboxButton} overlay={overlay}>
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
            {unread > 0 && <span className="min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#FFFCF1] text-[#140C04] text-[11px]">{unread}</span>}
          </button>
        </aside>

        <main className="min-w-0 flex flex-col gap-[28px] px-[16px] md:px-0 pt-[6px]">
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
              <div className="flex items-center justify-between gap-[10px]">
                <span className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">Session · {s.channel}</span>
                <button type="button" onClick={onEnd} className="h-[26px] px-[10px] rounded-full border border-solid border-[#FFFCF133] text-[11.5px] font-[600] text-[#FFFCF1CC] hover:text-[#FFFCF1]">
                  End session
                </button>
              </div>
              <dl className="mt-[12px] grid grid-cols-[88px_minmax(0,1fr)] gap-x-[12px] gap-y-[6px] text-[13.5px] leading-[19px]">
                {[
                  ["Acting for", s.userName],
                  ["Request", s.request],
                  ["Status", state.status],
                  ["Session", s.id],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-[#FFFCF180]">{k}</dt>
                    <dd className={`truncate ${k === "Session" ? "font-mono text-[12px] text-[#FFFCF1B3]" : "font-[600]"}`}>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-[12px] flex flex-wrap gap-[6px]">
                {[
                  ["Terms", s.consent.terms],
                  ["PHI", s.consent.phi],
                  ["Connected", s.consent.connected],
                  ["Network", s.consent.network],
                ].map(([label, on]) => (
                  <span key={label as string} className={`h-[24px] px-[9px] flex items-center rounded-full text-[11.5px] font-[600] ${on ? "bg-[#FFFCF11F] text-[#FFFCF1]" : "text-[#FFFCF166] border border-solid border-[#FFFCF126]"}`}>
                    {on ? "✓ " : "– "}
                    {label as string}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Section id="services" meta="CAD · private pay" title="Services & pricing">
            <div className="flex flex-col gap-[6px]">
              {SERVICES.map((x) => {
                const on = s.plan.kind === "service" && s.plan.id === x.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    disabled={locked}
                    onClick={() => void run({ type: "select_plan", plan: { kind: "service", id: x.id } })}
                    className={`flex items-start gap-[12px] p-[14px] rounded-[18px] text-left transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className="grow min-w-0">
                      <span className="flex flex-wrap items-center gap-[6px]">
                        <span className="text-[15px] leading-[20px] font-[600]">{x.name}</span>
                        {x.match && <span className="h-[20px] px-[8px] flex items-center rounded-full text-[10.5px] font-[700] bg-[#FCCFB8] text-[#281910]">User&apos;s request</span>}
                      </span>
                      <span className={`block mt-[3px] text-[13px] leading-[18px] ${on ? "text-[#FFFCF1B3]" : "text-[#2819109E]"}`}>
                        {x.detail} · {x.duration}
                      </span>
                    </span>
                    <span className="shrink-0 text-[16px] leading-[20px] font-[700]">{money(x.price)}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section id="availability" meta={heldId ? `Held · ${clockLeft(holdLeft)}` : "Live"} title="Availability">
            <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none]">
              {["all", ...PROVIDERS].map((x) => (
                <Pill key={x} on={provider === x} onClick={() => setProvider(x)}>
                  {x === "all" ? "Any provider" : x}
                </Pill>
              ))}
            </div>
            <div className="mt-[10px] grid grid-cols-5 gap-[6px]">
              {state.availability.map((d) => {
                const n = d.slots.filter((x) => (provider === "all" || x.provider === provider) && x.status === "open").length;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setDay(d.day)}
                    className={`flex flex-col items-center py-[10px] rounded-[16px] transition-colors duration-150 ${day === d.day ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className="text-[12px] leading-[16px] font-[500] opacity-70">{d.weekday}</span>
                    <span className="text-[15px] leading-[20px] font-[700]">{d.date.split(" ")[1]}</span>
                    <span className="text-[10.5px] leading-[14px] opacity-60">{n} open</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
              {daySlots.map((x) => {
                const taken = x.status === "taken";
                const mine = x.status.startsWith("yours");
                const on = slot === x.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    disabled={taken}
                    onClick={() => setSlot(x.id)}
                    className={`flex items-center justify-between h-[52px] px-[16px] rounded-[16px] border-[1.5px] border-solid transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${on ? "border-[#140C04] bg-[#FFFCF1]" : "border-transparent bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
                  >
                    <span className={`text-[15px] font-[700] ${taken ? "line-through" : ""}`}>{x.time}</span>
                    <span className="text-[13px] text-[#2819109E]">
                      {x.provider}
                      {mine ? ` · ${x.status === "yours_held" ? "Held" : x.status === "yours_booked" ? "Booked" : "Requested"}` : taken ? " · Taken" : ""}
                    </span>
                  </button>
                );
              })}
              {daySlots.length === 0 && <p className="text-[13px] text-[#2819109E] px-[4px] py-[12px]">No openings.</p>}
            </div>
            <div className="mt-[10px] flex items-center gap-[8px]">
              <button
                type="button"
                disabled={!slot || slot === heldId || locked}
                onClick={() => slot && void run({ type: "hold_slot", slot_id: slot }, "Slot held for 10 minutes")}
                className="h-[46px] px-[20px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
              >
                {heldId && slot === heldId ? `Held · ${clockLeft(holdLeft)}` : heldId ? "Hold instead" : "Hold 10 min"}
              </button>
              {heldId && !locked && (
                <button type="button" onClick={() => void run({ type: "release_hold" }, "Hold released")} className="h-[46px] px-[16px] rounded-full bg-[#F4EEDF] text-[13.5px] font-[600]">
                  Release
                </button>
              )}
            </div>
          </Section>

          <Section id="offers" title="Offers">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
              {OFFERS.map((o) => {
                const st = o.id === "agent" ? (p.deal ? "Replaced by negotiated price" : "Applied") : o.id === "network" ? (s.consent.network ? "Active" : "Network members only") : "Eligible";
                return (
                  <div key={o.id} className="flex flex-col gap-[6px] p-[14px] rounded-[18px] bg-[#F4EEDF]">
                    <span className="self-start h-[20px] px-[8px] flex items-center rounded-full bg-[#FFFCF1] text-[10.5px] font-[700] text-[#281910B3]">{o.tag}</span>
                    <span className="text-[15px] leading-[20px] font-[600]">{o.title}</span>
                    <span className={`mt-auto pt-[4px] text-[12px] font-[700] ${st === "Applied" || st === "Active" ? "text-[#4C7A4F]" : "text-[#28191080]"}`}>{st}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section id="bundles" title="Bundles">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
              {BUNDLES.map((b) => {
                const on = s.plan.kind === "bundle" && s.plan.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={locked}
                    onClick={() => void run({ type: "select_plan", plan: { kind: "bundle", id: b.id } })}
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
                  </button>
                );
              })}
            </div>
          </Section>

          <Section id="negotiate" meta="Agent to agent" title="Negotiate">
            <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none] mb-[10px]">
              {NEGOTIABLE.map((n) => {
                const deal = s.agreed[planKey(n.plan)];
                return (
                  <Pill key={planKey(n.plan)} on={planKey(s.plan) === planKey(n.plan)} onClick={() => !locked && void run({ type: "select_plan", plan: n.plan })}>
                    {n.label}
                    {deal ? ` · ${money(deal)}` : ""}
                  </Pill>
                );
              })}
            </div>
            <div className="rounded-[22px] bg-[#F4EEDF] overflow-hidden">
              <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[4px]">
                <span className="text-[13px] font-[600]">{p.label}</span>
                <span className="text-[13px] text-[#2819109E]">
                  List {money(p.list)}
                  {p.deal ? ` · agreed ${money(p.deal)}` : ""}
                </span>
              </div>
              {thread("negotiate", "h-[440px]")}
            </div>
          </Section>

          <Section id="ask" title="Ask the clinic">
            <div className="rounded-[22px] bg-[#F4EEDF] overflow-hidden">{thread("concierge", "h-[420px]")}</div>
          </Section>

          <Section id="insurance" title="Insurance & payment">
            <div className="rounded-[20px] bg-[#F4EEDF] px-[16px] py-[6px]">
              {PAYMENT_NOTES.map((n) => (
                <div key={n.k} className="flex items-baseline justify-between gap-[16px] py-[10px] border-b border-solid border-[#2819100F] last:border-b-0">
                  <span className="shrink-0 text-[13.5px] text-[#281910B3]">{n.k}</span>
                  <span className="text-right text-[13.5px] font-[600]">{n.v}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="communication" title="Communication">
            <div className="flex flex-col gap-[6px]">
              {COMMS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="switch"
                  aria-checked={Boolean(s.comms[c.id])}
                  onClick={() => void run({ type: "set_comms", id: c.id, on: !s.comms[c.id] })}
                  className="flex items-center gap-[12px] p-[14px] rounded-[18px] bg-[#F4EEDF] text-left hover:bg-[#EEE6D6] transition-colors duration-150"
                >
                  <span className="grow">
                    <span className="block text-[15px] leading-[20px] font-[600]">{c.title}</span>
                    <span className="block text-[12.5px] leading-[17px] text-[#28191080]">{c.meta}</span>
                  </span>
                  <Toggle on={Boolean(s.comms[c.id])} />
                </button>
              ))}
            </div>
          </Section>

          <Section id="forms" meta="5 required" title="Forms">
            <DemoForms
              forms={s.forms}
              userName={s.userName}
              onIntake={(fields) => run({ type: "update_intake", fields })}
              onAnswer={(id, answers) => run({ type: "answer_assessment", assessment_id: id, answers })}
              onSign={() => run({ type: "record_signature", signed_by: s.userName }, "Signature recorded")}
              onSubmit={() => run({ type: "submit_forms" }, "Forms passed back")}
            />
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

function Section({ id, meta, title, children }: { id: string; meta?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[124px] md:scroll-mt-[88px]">
      <div className="mb-[12px] flex items-baseline justify-between gap-[12px]">
        {meta && <span className="order-2 shrink-0 text-[12px] leading-[16px] font-[600] text-[#28191080]">{meta}</span>}
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
  state,
  phi,
  onPhi,
  ready,
  holdLeft,
  heldId,
  onRequest,
  onGo,
}: {
  state: AgentPayload;
  phi: boolean;
  onPhi: () => void;
  ready: boolean;
  holdLeft: number;
  heldId: string | null;
  onRequest: () => void;
  onGo: (id: string) => void;
}) {
  const s = state.session;
  const p = state.pricing;
  const b = state.booking;
  const live = b.status === "requested" || b.status === "confirmed";
  const steps: { label: string; done: boolean; go: string }[] = [
    {
      label: live && b.slot ? b.slot : heldId && state.hold ? `${state.hold.slot} · ${clockLeft(holdLeft)}` : "Hold a slot",
      done: Boolean((live && b.slot) || heldId),
      go: "availability",
    },
    { label: s.forms.status === "sent" ? "Forms passed back" : "Pass back forms", done: s.forms.status === "sent", go: "forms" },
    { label: p.deal ? `Agreed ${money(p.deal)}` : "Negotiate (optional)", done: Boolean(p.deal), go: "negotiate" },
  ];
  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="rounded-[20px] bg-[#FFFCF1] p-[16px]">
        <div className="text-[12px] leading-[16px] font-[500] text-[#28191080]">Booking for {s.userName}</div>
        <div className={`${DISPLAY} mt-[2px] text-[21px] leading-[25px] tracking-[-0.01em]`}>{p.label}</div>
        <div className="mt-[14px] flex flex-col gap-[6px] text-[13.5px] leading-[18px]">
          <Row k="List price" v={money(p.list)} strike={Boolean(p.deal)} />
          {p.deal ? <Row k="Negotiated" v={money(p.deal)} /> : <Row k="Agent booking −5%" v={`−${money(p.discount)}`} />}
          <div className="h-[1px] my-[4px] bg-[#2819101A]" />
          <Row k="Total" v={money(live ? (b.total ?? p.total) : p.total)} bold />
        </div>
        {!state.bookable && <p className="mt-[10px] text-[12.5px] font-[600] text-[#B4532F]">Not bookable by agents. Pick another plan.</p>}
        {b.status === "declined" && <p className="mt-[10px] text-[12.5px] font-[600] text-[#B4532F]">Declined by the clinic{b.note ? `: ${b.note}` : ""}. Hold another slot.</p>}
      </div>
      <div className="flex flex-col gap-[2px] p-[8px]">
        {steps.map((x) => (
          <button key={x.go} type="button" onClick={() => onGo(x.go)} className="flex items-center gap-[10px] min-h-[40px] px-[8px] rounded-[12px] text-left hover:bg-[#EEE6D6] transition-colors duration-150">
            <Check on={x.done} size={20} />
            <span className={`text-[13px] leading-[17px] ${x.done ? "font-[600]" : "text-[#281910A6]"}`}>{x.label}</span>
          </button>
        ))}
      </div>
      {!live && (
        <button
          type="button"
          role="checkbox"
          aria-checked={phi}
          onClick={onPhi}
          className="mx-[6px] mb-[8px] flex items-start gap-[10px] p-[12px] rounded-[14px] bg-[#FFFCF1] text-left border-[1.5px] border-solid transition-colors duration-150"
          style={{ borderColor: phi ? "#140C04" : "#2819101F", width: "calc(100% - 12px)" }}
        >
          <Check on={phi} size={20} />
          <span className="grow text-[12.5px] leading-[17px]">
            Confirmed with {s.userName.split(" ")[0]}: by booking through Doe, they&apos;re voluntarily providing their PHI.
            <span className="ml-[6px] inline-flex items-center h-[18px] px-[7px] rounded-full align-[1px] bg-[#FCCFB8] text-[10.5px] font-[700]">Required</span>
          </span>
        </button>
      )}
      <button
        type="button"
        disabled={!ready}
        onClick={onRequest}
        className="w-full h-[52px] rounded-[18px] text-[15px] font-[600] text-[#FFFCF1] disabled:cursor-not-allowed transition-colors duration-200"
        style={{ backgroundColor: b.status === "confirmed" ? "#4C7A4F" : b.status === "requested" ? "#38251D" : ready ? "#140C04" : "#28191033", transitionTimingFunction: EASE }}
      >
        {b.status === "confirmed" ? "Booked" : b.status === "requested" ? "Waiting for clinic" : "Send booking request"}
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
  state,
  unreadOf,
  onClose,
  onOpenThread,
  onBack,
  renderThread,
}: {
  open: boolean;
  threadId: DemoThreadId | null;
  state: AgentPayload;
  unreadOf: (id: DemoThreadId) => number;
  onClose: () => void;
  onOpenThread: (id: DemoThreadId) => void;
  onBack: () => void;
  renderThread: (id: DemoThreadId) => ReactNode;
}) {
  const ids = Object.keys(THREAD_TITLES) as DemoThreadId[];
  return (
    <div
      className={`absolute inset-0 z-40 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      style={{ visibility: open ? "visible" : "hidden", transition: `visibility 0ms linear ${open ? "0ms" : "380ms"}` }}
    >
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
            <span className={`${DISPLAY} text-[20px] leading-[24px]`}>{threadId ? THREAD_TITLES[threadId].title : "Agent inbox"}</span>
            <span className="text-[12px] leading-[16px] text-[#2819109E]">{threadId ? THREAD_TITLES[threadId].subtitle : CLINIC.name}</span>
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
              const msgs = state.session.threads[id];
              const last = [...msgs].reverse().find((m) => m.from !== "system") ?? msgs[msgs.length - 1];
              const n = unreadOf(id);
              return (
                <button key={id} type="button" onClick={() => onOpenThread(id)} className="flex items-start gap-[12px] p-[14px] rounded-[18px] bg-[#F4EEDF] text-left hover:bg-[#EEE6D6] transition-colors duration-150">
                  <span className="grow min-w-0">
                    <span className="flex items-baseline justify-between gap-[8px]">
                      <span className="text-[15px] leading-[20px] font-[600]">{THREAD_TITLES[id].title}</span>
                      {last && <span className="shrink-0 text-[11.5px] text-[#28191080]">{new Date(last.at).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}</span>}
                    </span>
                    {last && (
                      <span className="block mt-[2px] text-[13px] leading-[18px] text-[#2819109E] line-clamp-2">
                        {last.from === "agent" ? "You: " : ""}
                        {last.text}
                      </span>
                    )}
                  </span>
                  {n > 0 && <span className="shrink-0 min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#140C04] text-[11px] font-[700] text-[#FFFCF1]">{n}</span>}
                </button>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}
