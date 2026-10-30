"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { Check, DISPLAY, DemoFrame, EASE, Sheet } from "@/components/demo/DemoFrame";
import { DemoForms, formsProgress } from "@/components/demo/DemoForms";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { type ChatMode, type Chip, DemoChat, mergeThreads } from "@/components/demo/DemoThread";
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { BUNDLES, CLINIC, COMMS, COVERAGE, INSURERS, OFFERS, PAY_METHODS, PROVIDERS, SERVICES, money } from "@/lib/demo/demo-clinic";
import type { AgentAction } from "@/lib/demo/demo-engine";
import type { AgentPayload } from "@/lib/demo/demo-service";
import type { DemoConsent, DemoPlan, DemoThreadId } from "@/lib/demo/demo-types";

type Act = (a: AgentAction) => Promise<{ ok: true; result: Record<string, unknown> } | { ok: false; error: string }>;

const NAV = [
  { id: "services", label: "Services & Pricing" },
  { id: "availability", label: "Availability" },
  { id: "offers", label: "Offers" },
  { id: "bundles", label: "Bundles" },
  { id: "insurance", label: "Insurance & Payment" },
  { id: "communication", label: "Communication & Permissions" },
  { id: "forms", label: "Forms" },
] as const;

const planKey = (p: DemoPlan) => `${p.kind}:${p.id}`;
const NEGOTIABLE: { plan: DemoPlan; label: string }[] = [
  { plan: { kind: "service", id: "botox" }, label: "Botox session" },
  { plan: { kind: "bundle", id: "start" }, label: "Start bundle" },
  { plan: { kind: "bundle", id: "year" }, label: "Year of relief" },
  { plan: { kind: "bundle", id: "rescue" }, label: "Botox + nerve block" },
];

const THREAD_IDS: DemoThreadId[] = ["concierge", "negotiate", "forms"];

const PERMISSIONS: { id: keyof DemoConsent; title: string; meta: string; required: boolean }[] = [
  { id: "terms", title: "Doe's Terms & Privacy Policy", meta: "Agreed at connect", required: true },
  { id: "phi", title: "Share Health Information (PHI)", meta: "Needed to book through Doe", required: true },
  { id: "connected", title: "Stay Connected for Updates", meta: "You can check back on this booking", required: false },
  { id: "network", title: "Join the Doe Network", meta: "Faster booking and network offers", required: false },
];

const clockLeft = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Dr. Brooks' clinic as the user's agent sees it, live: every control here is an API action on the agent's session. */
export function DemoClinicLanding({ state, act, onEnd }: { state: AgentPayload; act: Act; onEnd: () => void }) {
  const s = state.session;
  const [chatOpen, setChatOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("concierge");
  const [formsOpen, setFormsOpen] = useState(false);
  const [provider, setProvider] = useState<string>("all");
  const [day, setDay] = useState(state.availability[0]!.day);
  const [slot, setSlot] = useState<string | null>(s.hold?.slotId ?? null);
  const [phi, setPhi] = useState(false);
  const [typing, setTyping] = useState(false);
  const [read, setRead] = useState<Record<DemoThreadId, number>>({ concierge: 0, negotiate: 0, forms: 0 });
  /** Switches flipped here show at once; the server's answer replaces them. */
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [active, setActive] = useState<string>("services");
  /** The iPhone section pills appear once Services is on screen, and stay while the page scrolls down. */
  const [pillsOn, setPillsOn] = useState(false);
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

  /** The booking card waits until the agent picks what to book; the session's default plan isn't a choice. */
  const chosen = s.booking.status !== "none" || s.events.some((e) => e.type === "plan_selected" || e.type === "offer_accepted");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    [...NAV.map((n) => n.id), "booking"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [chosen]);

  useEffect(() => {
    const el = document.getElementById("services");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPillsOn(entry!.isIntersecting || entry!.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const run = async (a: AgentAction, done?: string) => {
    const r = await act(a);
    if (!r.ok) flash(r.error);
    else if (done) flash(done);
    return r;
  };

  const toggle = async (key: string, a: AgentAction, on: boolean) => {
    setPending((p) => ({ ...p, [key]: on }));
    await run(a);
    setPending(({ [key]: _, ...rest }) => rest);
  };

  const unread = THREAD_IDS.reduce((n, id) => n + s.threads[id].slice(read[id]).filter((m) => m.from === "clinic").length, 0);
  useEffect(() => {
    if (chatOpen) setRead({ concierge: s.threads.concierge.length, negotiate: s.threads.negotiate.length, forms: s.threads.forms.length });
  }, [chatOpen, s.threads]);

  const items = useMemo(() => mergeThreads(s.threads), [s.threads]);

  const send = async (id: DemoThreadId, text: string) => {
    setTyping(true);
    await run({ type: "send_message", thread: id, text });
    setTyping(false);
  };

  const p = state.pricing;
  const locked = s.booking.status === "requested" || s.booking.status === "confirmed";
  const holdLeft = state.hold ? Math.max(0, Math.round((Date.parse(state.hold.expiresAt) - now) / 1000)) : 0;
  const heldId = state.hold && holdLeft > 0 ? state.hold.slotId : null;
  const ready = chosen && Boolean(heldId) && s.forms.status === "sent" && phi && state.bookable && !locked;
  const first = s.userName.split(" ")[0];

  const openChat = (m: ChatMode) => {
    setMode(m);
    setChatOpen(true);
  };
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const chips: Chip[] =
    mode === "negotiate"
      ? [`Can you do ${money(Math.round((p.list * 0.88) / 25) * 25)}?`, "Is there a discount for my user?", "Can the consult be waived?"].map((text) => ({ text, thread: "negotiate" }))
      : [
          ...["How many units does Dr. Brooks use?", "How soon does it start working?", "Any side effects?", "What's the earliest opening?", "Cancellation policy?"].map((text) => ({ text, thread: "concierge" as const })),
          ...["Can my user bring their headache diary?", "Is a referral letter needed?"].map((text) => ({ text, thread: "forms" as const })),
        ];

  const negotiateBar = (
    <div className="px-[12px] pt-[10px]">
      <div className="flex items-center justify-between gap-[10px] px-[4px] pb-[8px]">
        <span className="text-[12.5px] font-[600]">{chosen ? `Negotiating ${p.label}` : "Pick what to negotiate"}</span>
        {chosen && (
          <span className="text-[12.5px] text-[#2819109E]">
            List {money(p.list)}
            {p.deal ? ` · Agreed ${money(p.deal)}` : ""}
          </span>
        )}
      </div>
      <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none]">
        {NEGOTIABLE.map((n) => {
          const deal = s.agreed[planKey(n.plan)];
          return (
            <Pill key={planKey(n.plan)} sand on={chosen && planKey(s.plan) === planKey(n.plan)} onClick={() => !locked && void run({ type: "select_plan", plan: n.plan })}>
              {n.label}
              {deal ? ` · ${money(deal)}` : ""}
            </Pill>
          );
        })}
      </div>
    </div>
  );

  const summary = chosen ? (
    <BookingSummary
      state={state}
      phi={phi}
      onPhi={() => setPhi((v) => !v)}
      ready={ready}
      holdLeft={holdLeft}
      heldId={heldId}
      onRequest={() => void run({ type: "request_booking", phi_confirmed: phi }, "Booking request sent")}
      onGo={(id) => (id === "forms" ? setFormsOpen(true) : go(id))}
      onNegotiate={() => openChat("negotiate")}
    />
  ) : null;

  const communicate = (
    <button
      type="button"
      onClick={() => openChat("concierge")}
      aria-label={`Communicate with the clinic${unread ? `, ${unread} unread` : ""}`}
      className="relative shrink-0 h-[40px] pl-[12px] pr-[14px] flex items-center gap-[7px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13.5px] font-[600] hover:bg-[#2A1C10] transition-colors duration-150"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      Communicate
      {unread > 0 && (
        <span className="absolute -top-[4px] -right-[4px] min-w-[19px] h-[19px] px-[5px] flex items-center justify-center rounded-full bg-[#FCCFB8] text-[11px] leading-[11px] font-[700] text-[#281910] border-2 border-solid border-[#FFFCF1]">
          {unread}
        </span>
      )}
    </button>
  );

  const progress = formsProgress(s.forms);

  const overlay = (
    <>
      {chosen && (
        <div
          className="lg:hidden absolute left-[10px] right-[10px] bottom-[10px] z-20 flex items-center gap-[12px] h-[62px] pl-[18px] pr-[8px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] shadow-[0_10px_30px_rgba(20,12,4,0.25)] transition-opacity duration-200"
          style={{ opacity: chatOpen || formsOpen ? 0 : 1, pointerEvents: chatOpen || formsOpen ? "none" : "auto" }}
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
      )}

      {toast && (
        <div className="absolute left-1/2 top-[72px] md:top-[82px] z-50 -translate-x-1/2 max-w-[90%] h-[38px] px-[16px] flex items-center rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis shadow-[0_8px_24px_rgba(20,12,4,0.25)] doe-menu-in">
          {toast}
        </div>
      )}

      <Sheet open={chatOpen} onClose={() => setChatOpen(false)} label="Communicate with the clinic" title="Communicate" subtitle={`${CLINIC.name} · for ${s.userName}`}>
        <DemoChat
          items={items}
          typing={typing}
          mode={mode}
          onMode={setMode}
          chips={chips}
          negotiateBar={negotiateBar}
          onSend={send}
          onOffer={(mid, accept) => void run({ type: "respond_offer", message_id: mid, accept }, accept ? "Price locked for 48 hours" : undefined)}
        />
      </Sheet>

      <Sheet open={formsOpen} onClose={() => setFormsOpen(false)} label="Clinic forms" title="Intake Forms" subtitle={`${progress.done} of ${progress.total} complete · for ${s.userName}`} wide>
        <DemoForms
          forms={s.forms}
          userName={s.userName}
          onIntake={(fields) => run({ type: "update_intake", fields })}
          onAnswer={(id, answers) => run({ type: "answer_assessment", assessment_id: id, answers })}
          onSign={() => run({ type: "record_signature", signed_by: s.userName }, "Signature recorded")}
          onSubmit={async () => {
            const r = await run({ type: "submit_forms" }, "Forms passed back");
            if (r.ok) setFormsOpen(false);
          }}
        />
      </Sheet>
    </>
  );

  const daySlots = state.availability.find((d) => d.day === day)?.slots.filter((x) => provider === "all" || x.provider === provider) ?? [];
  const nav = chosen ? [...NAV, { id: "booking", label: "Booking", small: true } as const] : NAV;

  return (
    <DemoFrame agentView right={communicate} overlay={overlay}>
      {/* iPhone: section pills, shown from Services on down. Zero height, so the page doesn't shift. */}
      <nav className="md:hidden sticky top-[64px] z-20 h-0" aria-hidden={!pillsOn}>
        <div
          className="absolute inset-x-0 top-0 flex gap-[6px] overflow-x-auto px-[16px] py-[8px] bg-[#FFFCF1E6] backdrop-blur-[12px] [scrollbar-width:none]"
          style={{
            opacity: pillsOn ? 1 : 0,
            transform: pillsOn ? "none" : "translateY(-12px)",
            pointerEvents: pillsOn ? "auto" : "none",
            transition: `opacity 220ms ease, transform 300ms ${EASE}`,
          }}
        >
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              tabIndex={pillsOn ? 0 : -1}
              onClick={() => go(n.id)}
              className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] transition-colors duration-150 ${active === n.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <div
        className={`md:grid md:grid-cols-[200px_minmax(0,1fr)] ${chosen ? "lg:grid-cols-[200px_minmax(0,1fr)_340px]" : "lg:max-w-[1100px]"} md:gap-[28px] md:px-[32px] max-w-[1440px] mx-auto ${chosen ? "pb-[96px]" : "pb-[40px]"} lg:pb-[40px]`}
      >
        <aside className="hidden md:flex flex-col gap-[2px] sticky top-[78px] self-start mt-[6px] p-[6px] rounded-[22px] bg-[#F4EEDF]">
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.id)}
              className={`${"small" in n ? "lg:hidden " : ""}min-h-[36px] py-[8px] px-[12px] rounded-[10px] text-left text-[14px] leading-[18px] font-[500] transition-colors duration-150 ${active === n.id ? "bg-[#FFFCF1] text-[#281910]" : "text-[#281910A6] hover:text-[#281910]"}`}
            >
              {n.label}
            </button>
          ))}
        </aside>

        <main className="min-w-0 flex flex-col gap-[28px] px-[16px] md:px-0 pt-[6px]">
          <div className="flex flex-col gap-[10px]">
            {/* The clinic as /indexconvert's hero: centred on iPhone, a row from tablet up. */}
            <div className="rounded-[26px] bg-[#F4EEDF] p-[6px]">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-[14px] md:gap-[22px] rounded-[21px] bg-[#FFFCF1] px-[20px] pt-[24px] pb-[22px] md:px-[26px] md:py-[24px]">
                <DemoSphere size={84} className="shrink-0" />
                <div className="min-w-0">
                  <h1 className={`${DISPLAY} text-[30px] leading-[34px] md:text-[36px] md:leading-[40px] tracking-[-0.02em] [text-wrap:balance]`}>{CLINIC.name}</h1>
                  <p className="mt-[6px] text-[14.5px] leading-[20px] text-[#2819109E] [text-wrap:balance]">
                    {CLINIC.addressLine1}, {CLINIC.addressLine2}
                  </p>
                </div>
              </div>
            </div>
            {/* The session as /indexconvert's status box: the status set large, the details in an inner sand box. */}
            <div className="rounded-[26px] bg-[#F4EEDF] p-[6px]">
              <div className="rounded-[21px] bg-[#FFFCF1] px-[18px] pt-[16px] pb-[16px] md:px-[24px] md:pt-[20px] md:pb-[20px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em] text-[#28191080]">Your Session</span>
                  <button type="button" onClick={onEnd} className="h-[32px] px-[14px] rounded-full bg-[#F4EEDF] text-[12.5px] font-[600] hover:bg-[#EEE6D6] transition-colors duration-150">
                    End Session
                  </button>
                </div>
                <div className={`${DISPLAY} mt-[8px] text-[26px] leading-[30px] md:text-[30px] md:leading-[34px] tracking-[-0.02em]`}>{state.status}</div>
                <p className="mt-[4px] text-[14.5px] leading-[21px] text-[#2819109E]">Acting for {s.userName}</p>
                <dl className="mt-[14px] rounded-[18px] bg-[#F4EEDF] px-[16px] py-[12px] grid grid-cols-[76px_minmax(0,1fr)] gap-x-[12px] gap-y-[8px] text-[13.5px] leading-[19px]">
                  {[
                    ["Request", s.request || "None given"],
                    ["Session", s.id],
                  ].map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-[#281910B3]">{k}</dt>
                      <dd className={k === "Session" ? "truncate font-mono text-[12px] leading-[19px] text-[#28191099]" : "font-[600] break-words"}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <Section id="services" title="Services & Pricing">
            <div className="flex flex-col gap-[6px]">
              {SERVICES.map((x) => {
                const on = chosen && s.plan.kind === "service" && s.plan.id === x.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={on}
                    onClick={() => void run({ type: "select_plan", plan: { kind: "service", id: x.id } })}
                    className={`flex items-start gap-[12px] p-[14px] rounded-[18px] text-left transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#FAF4E4]"}`}
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

          <Section id="availability" title="Availability">
            <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none]">
              {["all", ...PROVIDERS].map((x) => (
                <Pill key={x} on={provider === x} onClick={() => setProvider(x)}>
                  {x === "all" ? "Any Provider" : x}
                </Pill>
              ))}
            </div>
            <div className="mt-[6px] grid grid-cols-5 gap-[6px]">
              {state.availability.map((d) => {
                const n = d.slots.filter((x) => (provider === "all" || x.provider === provider) && x.status === "open").length;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setDay(d.day)}
                    className={`flex flex-col items-center py-[10px] rounded-[16px] transition-colors duration-150 ${day === d.day ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#FAF4E4]"}`}
                  >
                    <span className="text-[12px] leading-[16px] font-[500] opacity-70">{d.weekday}</span>
                    <span className="text-[15px] leading-[20px] font-[700]">{d.date.split(" ")[1]}</span>
                    <span className="text-[10.5px] leading-[14px] opacity-60">{n} open</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-[6px] grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
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
                    className={`flex items-center justify-between h-[52px] px-[16px] rounded-[16px] border-[1.5px] border-solid transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${on ? "border-[#140C04] bg-[#FFFCF1]" : "border-transparent bg-[#FFFCF1] hover:bg-[#FAF4E4]"}`}
                  >
                    <span className={`text-[15px] font-[700] ${taken ? "line-through" : ""}`}>{x.time}</span>
                    <span className="text-[13px] text-[#2819109E]">
                      {x.provider}
                      {mine ? ` · ${x.status === "yours_held" ? "Held" : x.status === "yours_booked" ? "Booked" : "Requested"}` : taken ? " · Taken" : ""}
                    </span>
                  </button>
                );
              })}
              {daySlots.length === 0 && <p className="rounded-[16px] bg-[#FFFCF1] text-[13px] text-[#2819109E] px-[16px] py-[16px]">No openings.</p>}
            </div>
            <div className="mt-[6px] flex items-center gap-[6px]">
              <button
                type="button"
                disabled={!slot || slot === heldId || locked}
                onClick={() => slot && void run({ type: "hold_slot", slot_id: slot }, "Slot held for 10 minutes")}
                className="h-[46px] px-[20px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
              >
                {heldId && slot === heldId ? `Held · ${clockLeft(holdLeft)}` : heldId ? "Hold Instead" : "Hold 10 Min"}
              </button>
              {heldId && !locked && (
                <button type="button" onClick={() => void run({ type: "release_hold" }, "Hold released")} className="h-[46px] px-[16px] rounded-full bg-[#FFFCF1] text-[13.5px] font-[600]">
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
                  <div key={o.id} className="flex flex-col gap-[6px] p-[14px] rounded-[18px] bg-[#FFFCF1]">
                    <span className="self-start h-[20px] px-[8px] flex items-center rounded-full bg-[#F4EEDF] text-[10.5px] font-[700] text-[#281910B3]">{o.tag}</span>
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
                const on = chosen && s.plan.kind === "bundle" && s.plan.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={on}
                    onClick={() => void run({ type: "select_plan", plan: { kind: "bundle", id: b.id } })}
                    className={`flex flex-col gap-[8px] p-[16px] rounded-[20px] text-left transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#FAF4E4]"}`}
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
            <button
              type="button"
              onClick={() => openChat("negotiate")}
              className="mt-[6px] w-full flex items-center justify-between gap-[12px] p-[14px] rounded-[18px] bg-[#FFFCF1] hover:bg-[#FAF4E4] text-left transition-colors duration-150"
            >
              <span>
                <span className="block text-[15px] leading-[20px] font-[600]">Want a Better Price?</span>
                <span className="block mt-[2px] text-[13px] leading-[18px] text-[#2819109E]">Negotiate with the clinic&apos;s agent in Communicate.</span>
              </span>
              <span className="shrink-0 h-[36px] px-[14px] flex items-center rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600]">Negotiate</span>
            </button>
          </Section>

          <Section id="insurance" title="Insurance & Payment">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
              <div className="flex flex-col rounded-[18px] bg-[#FFFCF1] p-[16px]">
                <span className="text-[15px] font-[600]">Coverage</span>
                <div className="mt-[10px] flex flex-col gap-[12px]">
                  {COVERAGE.map((c) => (
                    <div key={c.k}>
                      <div className="flex items-baseline justify-between gap-[12px]">
                        <span className="text-[13.5px] text-[#281910B3]">{c.k}</span>
                        <span className="text-[13.5px] font-[700]">{c.v}</span>
                      </div>
                      <p className="mt-[2px] text-[12.5px] leading-[17px] text-[#28191080]">{c.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-[14px] flex flex-wrap gap-[6px]">
                  {INSURERS.map((i) => (
                    <span key={i} className="h-[26px] px-[10px] flex items-center rounded-full bg-[#F4EEDF] text-[12px] font-[600]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-[18px] bg-[#FFFCF1] p-[16px]">
                <span className="text-[15px] font-[600]">Ways to Pay</span>
                <div className="mt-[6px] flex flex-col">
                  {PAY_METHODS.map((m) => (
                    <div key={m.k} className="flex items-baseline justify-between gap-[12px] py-[8px] border-b border-solid border-[#2819100F] last:border-b-0">
                      <span className="text-[13.5px] font-[600]">{m.k}</span>
                      <span className="text-right text-[12.5px] text-[#2819109E]">{m.note}</span>
                    </div>
                  ))}
                </div>
                {chosen && (
                  <div className="mt-auto pt-[10px] flex items-baseline justify-between gap-[12px] border-t border-solid border-[#2819101A]">
                    <span className="text-[13px] text-[#281910B3]">{first} pays the clinic</span>
                    <span className="text-[16px] font-[700]">{money(s.booking.total ?? p.total)}</span>
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section id="communication" title="Communication & Permissions">
            <div className="rounded-[18px] bg-[#FFFCF1]">
              <div className="px-[16px] pt-[14px] pb-[4px] text-[15px] font-[600]">Clinic Updates</div>
              {COMMS.map((c) => {
                const on = pending[`comms:${c.id}`] ?? Boolean(s.comms[c.id]);
                return (
                  <SwitchRow
                    key={c.id}
                    title={c.title}
                    meta={c.meta}
                    on={on}
                    onChange={() => void toggle(`comms:${c.id}`, { type: "set_comms", id: c.id, on: !on }, !on)}
                  />
                );
              })}
            </div>
            <div className="mt-[6px] rounded-[18px] bg-[#FFFCF1]">
              <div className="px-[16px] pt-[14px] pb-[4px]">
                <span className="block text-[15px] font-[600]">Permissions From {first}</span>
                <span className="block mt-[2px] text-[12.5px] leading-[17px] text-[#28191080]">Change these whenever {first} asks. Required ones stay on for the session.</span>
              </div>
              {PERMISSIONS.map((x) => {
                const on = pending[`consent:${x.id}`] ?? Boolean(s.consent[x.id]);
                return (
                  <SwitchRow
                    key={x.id}
                    title={x.title}
                    meta={x.meta}
                    on={on}
                    required={x.required}
                    onChange={x.required ? undefined : () => void toggle(`consent:${x.id}`, { type: "set_consent", id: x.id as "connected" | "network", on: !on }, !on)}
                  />
                );
              })}
            </div>
          </Section>

          <Section id="forms" title="Forms">
            <div className="rounded-[18px] bg-[#FFFCF1] p-[16px] md:p-[18px]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="min-w-0">
                  <div className="text-[15px] leading-[20px] font-[600]">{s.forms.status === "sent" ? "Forms Passed Back" : `Dr. Brooks Needs ${progress.total} Forms Before the First Visit`}</div>
                  <p className="mt-[4px] text-[13px] leading-[19px] text-[#2819109E]">
                    {s.forms.status === "sent"
                      ? "The clinic has the signed intake and assessments."
                      : `Intake and consent, ${ASSESSMENTS.map((a) => a.name).join(", ")}. Start when ${first} is ready to answer; answers save as you go.`}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-[700] tabular-nums">
                  {progress.done}/{progress.total}
                </span>
              </div>
              <div className="mt-[12px] flex gap-[3px]" aria-hidden="true">
                {Array.from({ length: progress.total }, (_, i) => (
                  <span key={i} className={`h-[4px] grow rounded-full ${i < progress.done ? "bg-[#140C04]" : "bg-[#2819101A]"}`} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFormsOpen(true)}
                className="mt-[14px] h-[46px] px-[20px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] hover:bg-[#2A1C10] transition-colors duration-150"
              >
                {s.forms.status === "sent" ? "View Forms" : progress.done > 0 ? "Continue Forms" : "Start Forms"}
              </button>
            </div>
          </Section>

          {summary && (
            <div id="booking" className="lg:hidden scroll-mt-[124px] md:scroll-mt-[88px]">
              {summary}
            </div>
          )}
        </main>

        {summary && <aside className="hidden lg:block sticky top-[78px] self-start mt-[6px]">{summary}</aside>}
      </div>
    </DemoFrame>
  );
}

function SwitchRow({ title, meta, on, required, onChange }: { title: string; meta: string; on: boolean; required?: boolean; onChange?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-disabled={!onChange}
      onClick={onChange}
      className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] text-left border-t border-solid border-[#2819100F] first-of-type:border-t-0 transition-colors duration-150 last:rounded-b-[18px] ${onChange ? "hover:bg-[#FAF4E4]" : "cursor-default"}`}
    >
      <span className="grow min-w-0">
        <span className="flex flex-wrap items-center gap-[6px] text-[14.5px] leading-[20px] font-[600]">
          {title}
          {required && <span className="h-[18px] px-[7px] flex items-center rounded-full bg-[#F4EEDF] text-[10.5px] font-[700] text-[#28191099]">Required</span>}
        </span>
        <span className="block text-[12.5px] leading-[17px] text-[#28191080]">{meta}</span>
      </span>
      {required ? (
        <span className="shrink-0 flex items-center gap-[6px] text-[12.5px] font-[600] text-[#28191099]">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          On
        </span>
      ) : (
        <span className="shrink-0 flex items-center gap-[8px]">
          <span className="w-[24px] text-right text-[12px] font-[600] text-[#28191099]">{on ? "On" : "Off"}</span>
          <Toggle on={on} />
        </span>
      )}
    </button>
  );
}

/** A titled section: its content sits in an outer sand box, with cream boxes inside. `bare` skips the outer box for content that brings its own. */
function Section({ id, title, bare, children }: { id: string; title: string; bare?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[124px] md:scroll-mt-[88px]">
      <div className="mb-[12px]">
        <h2 className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em]`}>{title}</h2>
      </div>
      {bare ? children : <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">{children}</div>}
    </section>
  );
}

function Pill({ on, sand, onClick, children }: { on: boolean; sand?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] whitespace-nowrap transition-colors duration-150 ${on ? "bg-[#140C04] text-[#FFFCF1]" : sand ? "bg-[#F4EEDF] text-[#281910] hover:bg-[#EEE6D6]" : "bg-[#FFFCF1] text-[#281910] hover:bg-[#FAF4E4]"}`}
    >
      {children}
    </button>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`shrink-0 relative w-[44px] h-[26px] rounded-full transition-colors duration-200 ${on ? "bg-[#140C04]" : "bg-[#28191026]"}`}>
      <span className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-[#FFFCF1] shadow-[0_1px_4px_rgba(40,25,16,0.28)] transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
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
  onNegotiate,
}: {
  state: AgentPayload;
  phi: boolean;
  onPhi: () => void;
  ready: boolean;
  holdLeft: number;
  heldId: string | null;
  onRequest: () => void;
  onGo: (id: string) => void;
  onNegotiate: () => void;
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
        <div className="text-[12px] leading-[16px] font-[500] text-[#28191080]">Booking For {s.userName}</div>
        <div className={`${DISPLAY} mt-[2px] text-[21px] leading-[25px] tracking-[-0.01em]`}>{p.label}</div>
        <div className="mt-[14px] flex flex-col gap-[6px] text-[13.5px] leading-[18px]">
          <Row k="List Price" v={money(p.list)} strike={Boolean(p.deal)} />
          {p.deal ? <Row k="Negotiated" v={money(p.deal)} /> : <Row k="Agent Booking −5%" v={`−${money(p.discount)}`} />}
          <div className="h-[1px] my-[4px] bg-[#2819101A]" />
          <Row k="Total" v={money(live ? (b.total ?? p.total) : p.total)} bold />
        </div>
        {!state.bookable && <p className="mt-[10px] text-[12.5px] font-[600] text-[#B4532F]">Not bookable by agents. Pick another plan.</p>}
        {b.status === "declined" && <p className="mt-[10px] text-[12.5px] font-[600] text-[#B4532F]">Declined by the clinic{b.note ? `: ${b.note}` : ""}. Hold another slot.</p>}
      </div>
      <div className="flex flex-col gap-[2px] p-[8px]">
        {steps.map((x) => (
          <button key={x.go} type="button" onClick={() => (x.go === "negotiate" ? onNegotiate() : onGo(x.go))} className="flex items-center gap-[10px] min-h-[40px] px-[8px] rounded-[12px] text-left hover:bg-[#EEE6D6] transition-colors duration-150">
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
        className="w-full h-[60px] rounded-[16px] text-[15px] md:text-[16px] font-[700] text-[#FFFCF1] disabled:cursor-not-allowed transition-colors duration-200"
        style={{ backgroundColor: b.status === "confirmed" ? "#4C7A4F" : b.status === "requested" ? "#38251D" : ready ? "#140C04" : "#28191033", transitionTimingFunction: EASE }}
      >
        {b.status === "confirmed" ? "Booked" : b.status === "requested" ? "Waiting for Clinic" : "Send Booking Request"}
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
