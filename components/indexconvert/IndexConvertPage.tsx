"use client";

/**
 * /indexconvert: a clinic watches Doe read its website and turn it into an agent-readable page, then sees that page,
 * ready but not activated, with one email field to claim it. Built in /demo's frame: Doe's brown around a cream box
 * with rounded corners, sand boxes inside it. "Agent's View" shows the same page as the JSON and MCP an agent receives.
 */
import { type CSSProperties, type FormEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import "@/lib/indexconvert/indexconvert.css";
import { IndexConvertSphere } from "@/components/indexconvert/IndexConvertSphere";
import { dmSans, lora } from "@/lib/home/fonts";
import {
  BOOKING,
  CLINIC,
  FIELD_COUNT,
  HOURS,
  ISSUES,
  LOCATIONS,
  OFFERS,
  PRICE_COUNT,
  PRICES,
  PROVIDERS,
  SERVICE_COUNT,
  SERVICES,
  SOURCE_PAGES,
} from "@/lib/indexconvert/ford-plastic-surgery";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SUB = "text-[#2819109E]";
const MUTED = "text-[#28191080]";

/* ------------------------------------------------------------------ Timeline */

/** The loader's steps, in order, with how long each runs. */
const STEPS: { title: string; detail: string; ms: number; bar?: boolean }[] = [
  { title: "Finding your page", detail: `${CLINIC.domain} · ${SOURCE_PAGES.length} pages`, ms: 1500 },
  { title: "Checking what personal agents see", detail: "No agent-readable page yet", ms: 1700 },
  { title: "Structuring as JSON, metadata & HTML", detail: `${FIELD_COUNT} fields · ${SERVICE_COUNT} services · ${PRICE_COUNT} prices`, ms: 2300 },
  { title: "Integrating with Model Context Protocol", detail: "5 tools ready", ms: 1700 },
  { title: "Integrating with Doe's API", detail: "Locations, hours, providers, prices", ms: 1500 },
  { title: "Building your agent-readable page", detail: "Done", ms: 2600, bar: true },
];
const STEP_STARTS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((n, s) => n + s.ms, 0));
const BUILD_MS = STEPS.reduce((n, s) => n + s.ms, 0);
/** How long "visible within Muse" holds before the page opens. */
const MUSE_MS = 1600;
const TOTAL_MS = BUILD_MS + MUSE_MS;
/** Each source page gets an equal slice of the build. */
const SLOT_MS = BUILD_MS / SOURCE_PAGES.length;
const LOADER_FADE_MS = 420;

/** What the loader lifts off each page as the scan line passes, keyed by screenshot. */
const PAGE_READS: Record<string, [string, string][]> = {
  home: [["name", "Ford Plastic Surgery"], ["specialty", "Facial plastic surgery"], ["area", "Bloor-Yorkville, Toronto"]],
  pricing: [["price", "Deep Plane Facelift · $22,500"], ["price", "Rhinoplasty · $17,100"], ["consult", "$300 + HST"]],
  medspa: [["price", "BOTOX · $13/unit"], ["service", "Morpheus8 · $950"], ["service", "HALO · $1,500"]],
  staff: [["provider", "Isabel Middleman, PA-C"], ["provider", "Caroline Watson"], ["role", "Injectables"]],
  locations: [["location", "7 St Thomas St, Suite 410"], ["location", "St. Thomas Surgical Centre"], ["privileges", "Lakeridge Health"]],
  facelift: [["provider", "Dr. Derek Ford"], ["provider", "Dr. Steven Hanna"], ["service", "Endoscopic mid facelift"]],
  contact: [["hours", "Mon–Fri 8:30–4:30"], ["phone", CLINIC.phone], ["booking", "Consult request form"]],
};
const READ_SPOTS = [
  { top: "18%", side: "left" },
  { top: "44%", side: "right" },
  { top: "70%", side: "left" },
] as const;

/* ------------------------------------------------------------------ Agent data */

const SLUG = "ford-plastic-surgery";
const BASE = `/v1/clinics/${SLUG}`;
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

/** "$22,500" → { from: 22500 }; "$13 / unit" → { from: 13, per: "unit" }. */
function parsePrice(price: string) {
  const [amount, per] = price.split("/").map((s) => s.trim());
  return { from: Number(amount!.replace(/[^\d]/g, "")), ...(per ? { per } : {}) };
}

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const AGENT = {
  warnings: ISSUES.map((i) => ({ code: slug(i.title), detail: i.detail })),
  locations: {
    locations: LOCATIONS.map((l) => ({ name: l.name, type: l.detail, address: `${l.address}, ${l.city}` })),
    hours: Object.fromEntries(HOURS.map((h, i) => [DAY_KEYS[i], h.time ? "08:30-16:30" : null])),
    phone: "+1-416-925-7337",
    toll_free: "+1-888-925-7337",
  },
  providers: PROVIDERS.map((p) => ({ id: slug(p.name.split(",")[0]!), name: p.name, role: p.role, notes: p.fact })),
  services: Object.fromEntries(SERVICES.map((g) => [slug(g.group), g.items.map(slug)])),
  prices: {
    currency: "CAD",
    tax: "HST extra",
    basis: "starting_price",
    consult: { price: 300, credited_toward_procedure_within_days: 90 },
    items: PRICES.flatMap((g) => g.items.map((p) => ({ service: slug(p.name), ...parsePrice(p.price) }))),
  },
  offers: OFFERS.map((o) => ({ id: slug(o.title), detail: o.detail })),
  booking: {
    channels: [
      { type: "web_form", url: `https://${CLINIC.url}/contact/`, response: "callback" },
      { type: "phone", value: "+1-416-925-7337", hours: "mon-fri 08:30-16:30" },
    ],
    form_fields: BOOKING.fields.map(slug),
    agent_booking: { enabled: false, reason: "not_activated" },
  },
  tools: [
    { name: "search_services", input: { query: "string" } },
    { name: "get_prices", input: { service: "string" } },
    { name: "list_providers", input: {} },
    { name: "get_hours", input: { location: "string?" } },
    { name: "request_consultation", input: { service: "string", provider: "string?", contact: "object" } },
  ].map((t) => ({ ...t, state: "ready", enabled: false })),
};

/** An example run: Muse can read the page, but its MCP and API calls stop at "not activated". */
const AGENT_RUN: { who: "muse" | "doe"; text: string; tone?: "ok" | "stop" }[] = [
  { who: "muse", text: `fetch https://${CLINIC.url}` },
  { who: "doe", text: `200 · MedicalClinic · ${FIELD_COUNT} fields`, tone: "ok" },
  { who: "muse", text: 'get_prices({ service: "deep_plane_facelift" })' },
  { who: "doe", text: "503 · mcp not_activated", tone: "stop" },
  { who: "muse", text: 'request_consultation({ provider: "dr_derek_ford" })' },
  { who: "doe", text: "403 · booking not_activated · clinic must claim", tone: "stop" },
];

/* ------------------------------------------------------------------ Page */

type Phase = "loading" | "leaving" | "done";
type View = "you" | "agent";

export function IndexConvertPage() {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [view, setView] = useState<View>("you");
  const [viewport, setViewport] = useState({ w: 390, h: 844 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /** One clock drives the steps, the URL fill and which page is behind the loader. `?skip` jumps to the page. */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("skip")) {
      setElapsed(TOTAL_MS);
      setPhase("done");
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      // The first frame's timestamp can land just before `start`.
      const t = Math.max(0, Math.min(TOTAL_MS, now - start));
      setElapsed(t);
      if (t < TOTAL_MS) frame = requestAnimationFrame(tick);
      else setPhase("leaving");
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("done"), LOADER_FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const switchView = (next: View) => {
    if (next === view) return;
    setView(next);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const loader =
    phase !== "done" ? (
      <div
        className="absolute inset-0 z-50 bg-[#FFFCF1]"
        style={{ opacity: phase === "leaving" ? 0 : 1, transition: `opacity ${LOADER_FADE_MS}ms ease`, pointerEvents: phase === "leaving" ? "none" : "auto" }}
      >
        <Loader
          elapsed={elapsed}
          viewport={viewport}
          onSkip={() => {
            setElapsed(TOTAL_MS);
            setPhase("leaving");
          }}
        />
      </div>
    ) : null;

  return (
    // The page mounts once the loader has faded, so the two never show through each other.
    <Frame scrollRef={scrollRef} right={phase === "done" ? <ViewSwitch view={view} onChange={switchView} /> : null} loader={loader}>
      {phase === "done" && <AgentPage view={view} scrollRef={scrollRef} />}
    </Frame>
  );
}

/* ------------------------------------------------------------------ Frame */

const DoeMark = () => <span className={`${lora.className} text-[26px] leading-[30px] font-[600] tracking-[-0.01em] text-[#281910]`}>Doe</span>;
const HEADER = "flex items-center justify-between gap-[12px] h-[64px] md:h-[72px] px-[18px] md:px-[32px]";

/** /demo's frame: Doe's brown fills the window and the page sits in a cream box that scrolls on its own. */
function Frame({ scrollRef, right, loader, children }: { scrollRef: RefObject<HTMLDivElement>; right: ReactNode; loader: ReactNode; children: ReactNode }) {
  return (
    <div
      className={`${dmSans.className} doehealth-product-page indexconvert-page fixed inset-0 bg-[#140C04] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
      }}
    >
      <div className="relative h-full w-full overflow-clip rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          <header className={`sticky top-0 z-30 ${HEADER} bg-[#FFFCF1E6] backdrop-blur-[12px]`}>
            <DoeMark />
            {right}
          </header>
          {children}
        </div>
        {loader}
      </div>
    </div>
  );
}

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div role="tablist" aria-label="View" className="ic-fade flex p-[3px] rounded-full bg-[#F4EEDF]">
      {(
        [
          ["you", "Your View"],
          ["agent", "Agent's View"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={() => onChange(id)}
          className={`h-[34px] px-[12px] md:px-[16px] rounded-full text-[13px] font-[600] whitespace-nowrap transition-colors duration-150 ${view === id ? "bg-[#140C04] text-[#FFFCF1]" : "text-[#281910B3] hover:text-[#281910]"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Check({ on, size = 20 }: { on: boolean; size?: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center rounded-[7px] transition-colors duration-150"
      style={{ width: size, height: size, backgroundColor: on ? "#140C04" : "transparent", border: on ? "none" : "1.5px solid #28191040" }}
      aria-hidden="true"
    >
      {on && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function Spinner({ size = 20, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="ic-spin shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke={light ? "#FFFCF133" : "#2819101F"} strokeWidth="2.6" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={light ? "#FFFCF1" : "#140C04"} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Loader */

function Loader({ elapsed, viewport, onSkip }: { elapsed: number; viewport: { w: number; h: number }; onSkip: () => void }) {
  const pageIndex = Math.min(SOURCE_PAGES.length - 1, Math.floor(elapsed / SLOT_MS));
  const stepIndex = STEPS.findIndex((_, i) => elapsed < STEP_STARTS[i]! + STEPS[i]!.ms);
  const built = stepIndex === -1;
  const progress = Math.min(1, elapsed / BUILD_MS);
  const page = SOURCE_PAGES[pageIndex]!;
  const desktop = viewport.w >= 768;
  /** Short iPhone screens get a smaller sphere and one step's detail at a time. */
  const compact = viewport.h < 780;
  const sphere = desktop ? (viewport.h < 860 ? 150 : 190) : viewport.h < 700 ? 96 : compact ? 120 : 156;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ParsingBackdrop pageIndex={pageIndex} />
      {/* Cream behind the column so the text stays readable over the page being read. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: desktop
            ? "radial-gradient(ellipse 25% 52% at 50% 55%, rgba(255,252,241,0.97) 0%, rgba(255,252,241,0.85) 55%, rgba(255,252,241,0) 100%)"
            : "radial-gradient(ellipse 74% 52% at 50% 57%, rgba(255,252,241,0.96) 0%, rgba(255,252,241,0.8) 58%, rgba(255,252,241,0) 100%)",
        }}
      />
      <div className={`relative z-10 ${HEADER}`}>
        <DoeMark />
        <button
          type="button"
          onClick={onSkip}
          className={`h-[34px] px-[14px] rounded-full bg-[#F4EEDF] text-[13px] font-[600] ${SUB} hover:text-[#281910] transition-colors`}
        >
          Skip
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[64px] md:top-[72px] z-10 flex flex-col items-center justify-center px-[16px] pb-[16px] md:pb-[28px]">
        <IndexConvertSphere size={sphere} speed={built ? 2.2 : 1} />
        <div className={`mt-[14px] text-[12px] leading-[16px] font-[600] uppercase tracking-[0.12em] ${MUTED}`}>{built ? "Ready" : "Loading"}</div>
        <h1 className={`${DISPLAY} mt-[4px] text-center text-[30px] leading-[34px] md:text-[42px] md:leading-[46px] tracking-[-0.02em]`}>{CLINIC.name}</h1>

        {/* The clinic's URL in a fill box that fills as the build runs, with the page being read after the domain. */}
        <div className="mt-[16px] w-full max-w-[420px]">
          <div className="relative h-[50px] rounded-[16px] bg-[#F4EEDF] overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-[#E9DCC7]" style={{ width: `${progress * 100}%` }} />
            <div className="relative h-full flex items-center gap-[10px] px-[14px]">
              {built ? <Check on size={20} /> : <Spinner />}
              <span className="min-w-[0px] truncate text-[15px] leading-[20px] font-[600]">
                {CLINIC.url}
                {!built && page.path !== "/" && <span className={`font-[500] ${MUTED}`}>{page.path}</span>}
              </span>
              <span className={`ml-auto shrink-0 tabular-nums text-[13px] font-[600] ${MUTED}`}>{Math.round(progress * 100)}%</span>
            </div>
          </div>
          {!compact && (
            <div className={`mt-[8px] text-center text-[12px] leading-[16px] ${MUTED}`}>
              {built ? `${SOURCE_PAGES.length} of ${SOURCE_PAGES.length} pages read` : `Reading page ${pageIndex + 1} of ${SOURCE_PAGES.length} · ${page.label}`}
            </div>
          )}
        </div>

        {/* Box in a box, like /demo's booking summary: steps on cream, inside sand with the Muse line underneath. */}
        <div className="mt-[14px] w-full max-w-[420px] rounded-[24px] bg-[#F4EEDF] p-[6px]">
          <ol className="rounded-[20px] bg-[#FFFCF1] p-[6px]">
            {STEPS.map((step, i) => {
              const state = built || i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
              const showDetail = state === "done" && (!compact || i === (built ? STEPS.length - 1 : stepIndex - 1));
              const stepProgress = state === "active" ? (elapsed - STEP_STARTS[i]!) / step.ms : 0;
              return (
                <li
                  key={step.title}
                  className="flex items-start gap-[10px] px-[10px] py-[6px] md:py-[7px] rounded-[14px] transition-colors duration-200"
                  style={{ backgroundColor: state === "active" ? "#F4EEDF" : "transparent" }}
                >
                  <span className="mt-[-1px]">{state === "active" ? <Spinner /> : <Check on={state === "done"} size={20} />}</span>
                  <span className="min-w-[0px] grow">
                    <span className="block text-[13.5px] leading-[18px] md:text-[14px] font-[600] transition-opacity duration-200" style={{ opacity: state === "pending" ? 0.4 : 1 }}>
                      {step.title}
                    </span>
                    {showDetail && <span className={`ic-fade block mt-[1px] text-[12.5px] leading-[16px] ${SUB}`}>{step.detail}</span>}
                    {step.bar && state === "active" && (
                      <span className="block mt-[7px] h-[4px] rounded-full bg-[#2819101A] overflow-hidden">
                        <span className="block h-full rounded-full bg-[#140C04]" style={{ width: `${stepProgress * 100}%` }} />
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="flex items-center gap-[10px] min-h-[44px] px-[16px]" style={{ opacity: built ? 1 : 0.4, transition: "opacity 300ms ease" }}>
            <Check on={built} size={20} />
            <span className="grow text-[14px] leading-[18px] font-[600]">Your page is visible within Muse</span>
            {built && <span className={`ic-fade hidden sm:inline text-[12px] font-[600] ${MUTED}`}>Not activated</span>}
          </div>
        </div>
      </div>

    </div>
  );
}

/**
 * The clinic's own pages behind the loader, one per slot: each scrolls while a scan line passes, the part above the
 * line turns from grey to full colour, and the values Doe lifted off it appear beside it. Edges fade into the cream.
 */
function ParsingBackdrop({ pageIndex }: { pageIndex: number }) {
  return (
    <div className="ic-corner-fade absolute inset-0 pointer-events-none" style={{ "--ic-slot": `${SLOT_MS}ms` } as CSSProperties} aria-hidden="true">
      {SOURCE_PAGES.map((page, i) => {
        // Mount the page on show, the one before (fading out) and the next one (paused, so it's loaded).
        if (i < pageIndex - 1 || i > pageIndex + 1) return null;
        const running: CSSProperties = { animationPlayState: i <= pageIndex ? "running" : "paused" };
        return (
          <div key={page.shot} className="absolute inset-0 overflow-hidden" style={{ opacity: i === pageIndex ? 1 : 0, transition: "opacity 450ms ease" }}>
            <Shot shot={page.shot} className="ic-read" style={{ ...running, opacity: 0.32, filter: "grayscale(1)" }} priority={i === 0} />
            <div className="ic-reveal absolute inset-0 overflow-hidden" style={running}>
              <Shot shot={page.shot} className="ic-read" style={{ ...running, opacity: 0.85 }} />
            </div>
            <div className="ic-scan absolute left-0 right-0 h-[1.5px] bg-[#281910]" style={{ ...running, opacity: 0.35 }} />
            {i === pageIndex &&
              (PAGE_READS[page.shot] ?? []).map(([key, value], n) => {
                const spot = READ_SPOTS[n]!;
                return (
                  <span
                    key={key + value}
                    className={`ic-chip absolute hidden md:inline-flex items-center gap-[8px] h-[34px] px-[12px] rounded-[12px] bg-[#FFFCF1] shadow-[0_6px_20px_rgba(20,12,4,0.1)] text-[13px] leading-[16px] font-[600] whitespace-nowrap ${spot.side === "left" ? "left-[7%]" : "right-[7%]"}`}
                    style={{ top: spot.top, animationDelay: `${(parseFloat(spot.top) / 100) * SLOT_MS * 0.8}ms`, animationDuration: `${SLOT_MS * 0.85}ms` }}
                  >
                    <span className={`font-mono text-[11px] font-[500] ${MUTED}`}>{key}</span>
                    {value}
                  </span>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

/** One of the site screenshots: the iPhone capture on phones, the 1440px capture from tablet width up. */
function Shot({ shot, className, style, priority }: { shot: string; className?: string; style?: CSSProperties; priority?: boolean }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={`/indexconvert/${shot}-d.jpg`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/indexconvert/${shot}-m.jpg`}
        alt=""
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute left-0 top-0 w-full h-auto select-none ${className ?? ""}`}
        style={style}
      />
    </picture>
  );
}

/* ------------------------------------------------------------------ Agent page */

const NAV = [
  { id: "review", you: "Needs review", agent: "warnings" },
  { id: "locations", you: "Locations & hours", agent: "locations" },
  { id: "providers", you: "Providers", agent: "providers" },
  { id: "services", you: "Services", agent: "services" },
  { id: "prices", you: "Prices", agent: "prices" },
  { id: "offers", you: "Offers & financing", agent: "offers" },
  { id: "booking", you: "Booking", agent: "booking" },
  { id: "preview", you: "Agent preview", agent: "tools" },
] as const;

type Claim = { email: string; status: "idle" | "sending" | "error"; error: string; claimed: string | null; plan: string | null; planSending: string | null };

async function postClaim(email: string, plan: string): Promise<string | null> {
  try {
    const res = await fetch("/api/indexconvert/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, clinic: CLINIC.domain, plan }),
    });
    if (res.ok) return null;
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "Something went wrong. Try again.";
  } catch {
    return "Couldn't reach Doe. Check your connection and try again.";
  }
}

function AgentPage({ view, scrollRef }: { view: View; scrollRef: RefObject<HTMLDivElement> }) {
  const agent = view === "agent";
  const claimRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [claimInView, setClaimInView] = useState(true);
  const [active, setActive] = useState<string>(NAV[0].id);
  /** Desktop puts the claim box in a sticky right column; narrower screens put it under the status panel. */
  const [wide, setWide] = useState(false);
  const [claim, setClaim] = useState<Claim>({ email: "", status: "idle", error: "", claimed: null, plan: null, planSending: null });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = claimRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setClaimInView(entry!.isIntersecting), { root: scrollRef.current, threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [wide, scrollRef]);

  useEffect(() => {
    setActive(NAV[0].id);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { root: scrollRef.current, rootMargin: "-25% 0px -65% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [view, scrollRef]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const goToClaim = () => {
    claimRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 450);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (claim.status === "sending") return;
    setClaim((c) => ({ ...c, status: "sending", error: "" }));
    const failure = await postClaim(claim.email, "claim");
    setClaim((c) => (failure ? { ...c, status: "error", error: failure } : { ...c, status: "idle", claimed: c.email.trim().toLowerCase() }));
  };

  const choosePlan = async (plan: string) => {
    if (!claim.claimed) return;
    setClaim((c) => ({ ...c, planSending: plan, error: "" }));
    const failure = await postClaim(claim.claimed, plan);
    setClaim((c) => (failure ? { ...c, planSending: null, error: failure } : { ...c, planSending: null, plan }));
  };

  const claimed = Boolean(claim.claimed);
  const claimBox = (
    <div ref={claimRef} id="claim" className="ic-rise scroll-mt-[124px]" style={{ animationDelay: "120ms" }}>
      <ClaimBox agent={agent} claim={claim} setEmail={(email) => setClaim((c) => ({ ...c, email }))} emailRef={emailRef} onSubmit={submit} onPlan={choosePlan} />
    </div>
  );

  return (
    <>
      <nav className="md:hidden sticky top-[64px] z-20 flex gap-[6px] overflow-x-auto px-[16px] py-[8px] bg-[#FFFCF1E6] backdrop-blur-[12px] ic-noscroll">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] transition-colors duration-150 ${agent ? "font-mono text-[12.5px]" : ""} ${active === n.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
          >
            {agent ? n.agent : n.you}
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
              className={`h-[36px] px-[12px] rounded-[10px] text-left text-[14px] font-[500] transition-colors duration-150 ${agent ? "font-mono text-[13px]" : ""} ${active === n.id ? "bg-[#F4EEDF] text-[#281910]" : "text-[#281910A6] hover:text-[#281910]"}`}
            >
              {agent ? n.agent : n.you}
            </button>
          ))}
          {!claimed && (
            <button
              type="button"
              onClick={goToClaim}
              className={`mt-[14px] h-[40px] px-[12px] flex items-center rounded-[12px] bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] ${agent ? "font-mono text-[12.5px]" : ""}`}
            >
              {agent ? "POST /claim" : "Claim this page"}
            </button>
          )}
        </aside>

        <main key={view} className="ic-fade min-w-0 flex flex-col gap-[28px] px-[16px] md:px-0 pt-[6px]">
          <div className="ic-rise flex flex-col gap-[14px]">
            <div className="flex items-center gap-[16px]">
              <IndexConvertSphere size={76} className="shrink-0" />
              <div className="min-w-0">
                <h1
                  className={
                    agent
                      ? "font-mono text-[18px] leading-[24px] md:text-[22px] md:leading-[28px] font-[600] break-all"
                      : `${DISPLAY} text-[26px] leading-[30px] md:text-[34px] md:leading-[38px] tracking-[-0.02em]`
                  }
                >
                  {agent ? SLUG : CLINIC.name}
                </h1>
                <p className={`mt-[4px] text-[13px] leading-[18px] ${SUB} ${agent ? "font-mono text-[12px]" : ""}`}>
                  {agent ? `${BASE} · schema.org/MedicalClinic` : `7 St Thomas St, Suite 410, Toronto · ${CLINIC.domain}`}
                </p>
              </div>
            </div>
            {agent ? <AgentStatus claimed={claimed} /> : <StatusPanel claimed={claimed} onClaim={goToClaim} />}
          </div>

          {!wide && claimBox}

          {agent ? <AgentSections /> : <YourSections claimed={claimed} />}

          <p className={`text-[12px] leading-[17px] ${MUTED} ${agent ? "font-mono text-[11.5px]" : ""}`}>
            Read by Doe from public pages on {CLINIC.domain}. Prices are CAD starting prices before HST, as listed on the site. Agent answers and calls shown
            are examples. Nothing here is live for agents until the clinic claims the page.
          </p>
        </main>

        {wide && <aside className="sticky top-[72px] self-start pt-[8px]">{claimBox}</aside>}
      </div>

      {/* iPhone: /demo's bottom pill, whenever the claim box is off screen. */}
      <div
        className="lg:hidden fixed left-[18px] right-[18px] z-20 flex items-center gap-[12px] h-[62px] pl-[20px] pr-[8px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] shadow-[0_10px_30px_rgba(20,12,4,0.25)]"
        style={{
          bottom: "calc(max(8px, env(safe-area-inset-bottom)) + 10px)",
          transform: !claimed && !claimInView ? "none" : "translateY(calc(100% + 40px))",
          transition: `transform 360ms ${EASE}`,
        }}
      >
        <span className={`flex flex-col grow min-w-0 ${agent ? "font-mono" : ""}`}>
          <span className="truncate text-[12px] leading-[16px] text-[#FFFCF1A6]">{agent ? "status" : "Agent page"}</span>
          <span className={`truncate font-[700] ${agent ? "text-[14px] leading-[20px]" : "text-[16px] leading-[20px]"}`}>{agent ? "not_activated" : "Not activated"}</span>
        </span>
        <button
          type="button"
          onClick={goToClaim}
          className={`shrink-0 h-[46px] px-[18px] rounded-[999px] bg-[#FFFCF1] text-[#140C04] text-[14px] font-[600] ${agent ? "font-mono text-[13px]" : ""}`}
        >
          {agent ? "claim" : "Claim free"}
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Status */

/** /demo's dark session panel, as the page's status: readable now, MCP and API ready, nothing on until claimed. */
function StatusPanel({ claimed, onClaim }: { claimed: boolean; onClaim: () => void }) {
  const rows: [string, string][] = [
    ["Agent-readable", `Yes · ${FIELD_COUNT} fields from ${SOURCE_PAGES.length} pages`],
    ["MCP", claimed ? "Ready · turns on when you confirm" : "Ready · not activated"],
    ["API", claimed ? "Ready · turns on when you confirm" : "Ready · not activated"],
    ["Agent booking", claimed ? "Pick a plan to turn on" : "Off until claimed"],
  ];
  return (
    <div className="rounded-[22px] bg-[#140C04] text-[#FFFCF1] p-[16px] md:p-[18px]">
      <div className="flex items-center justify-between gap-[10px]">
        <span className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">{claimed ? "Claimed · confirm your email" : "Not activated"}</span>
        {!claimed && (
          <button type="button" onClick={onClaim} className="shrink-0 h-[30px] px-[12px] rounded-full bg-[#FFFCF1] text-[#140C04] text-[12.5px] font-[600]">
            Claim to turn on
          </button>
        )}
      </div>
      <dl className="mt-[12px] grid grid-cols-[112px_minmax(0,1fr)] gap-x-[12px] gap-y-[6px] text-[13.5px] leading-[19px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-[#FFFCF180]">{k}</dt>
            <dd className="font-[600]">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {(
          [
            ["Structured", true],
            ["Agent-readable", true],
            ["MCP on", false],
            ["API on", false],
            ["Bookable", false],
          ] as const
        ).map(([label, on]) => (
          <span
            key={label}
            className={`h-[24px] px-[9px] flex items-center rounded-full text-[11.5px] font-[600] ${on ? "bg-[#FFFCF11F] text-[#FFFCF1]" : "text-[#FFFCF166] border border-solid border-[#FFFCF126]"}`}
          >
            {on ? "✓ " : "– "}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgentStatus({ claimed }: { claimed: boolean }) {
  return (
    <Endpoint method="GET" path={BASE} status="200">
      <Json
        value={{
          id: SLUG,
          name: CLINIC.name,
          url: `https://${CLINIC.url}`,
          status: claimed ? "claimed_pending_verification" : "not_activated",
          agent_readable: true,
          fields: FIELD_COUNT,
          sources: SOURCE_PAGES.length,
          mcp: { ready: true, active: false },
          api: { ready: true, active: false },
          booking: { enabled: false },
          claim: `POST ${BASE}/claim`,
        }}
      />
    </Endpoint>
  );
}

/* ------------------------------------------------------------------ Claim */

/** After claiming: the free page is theirs; paid plans let agents book. Prices from earlypreview's list. */
const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$29",
    was: "$49",
    note: "Founding price for the first 100 clinics, for a year. +$19 per extra provider.",
    features: ["Agents book consults", "MCP, well-known and API", "Email and scheduler sync", "Reminders and confirmations"],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "$59",
    was: "$149",
    note: "Founding price for the first 50 clinics, for six months. +$39 per extra provider.",
    features: ["Everything in Basic", "Priority in the Doe Engine", "Offers, waitlist and autofill", "Deposits and no-show protection"],
  },
] as const;

function ClaimBox({
  agent,
  claim,
  setEmail,
  emailRef,
  onSubmit,
  onPlan,
}: {
  agent: boolean;
  claim: Claim;
  setEmail: (email: string) => void;
  emailRef: RefObject<HTMLInputElement>;
  onSubmit: (e: FormEvent) => void;
  onPlan: (plan: string) => void;
}) {
  const claimed = claim.claimed;
  const steps: [string, boolean][] = agent
    ? [
        [`read ${CLINIC.domain}`, true],
        ["verify clinic email", false],
        ["activate mcp + api", false],
      ]
    : [
        [`Built from ${CLINIC.domain}`, true],
        [claimed ? `Confirm the link sent to ${claimed}` : "Confirm you work at the clinic", false],
        ["Turn on for agents", false],
      ];

  return (
    <div className={`rounded-[24px] bg-[#F4EEDF] p-[6px] ${agent ? "font-mono" : ""}`}>
      <div className="rounded-[20px] bg-[#FFFCF1] p-[16px]">
        {agent ? (
          <>
            <div className="text-[12px] leading-[16px] font-[600]">
              <span className="text-[#B4532F]">POST</span> {BASE}/claim
            </div>
            <pre className="mt-[10px] text-[12px] leading-[19px] whitespace-pre-wrap break-words">
              {claimed ? (
                <Json value={{ status: 202, result: "verification_sent", email: claimed, next: `POST ${BASE}/plan` }} light />
              ) : (
                <Json value={{ requires: "clinic_email", cost: 0, activates: ["mcp", "api"], booking: "from $29/mo" }} light />
              )}
            </pre>
          </>
        ) : (
          <>
            <div className={`text-[12px] leading-[16px] font-[500] ${MUTED}`}>{CLINIC.name}</div>
            <div className={`${DISPLAY} mt-[2px] text-[21px] leading-[25px] tracking-[-0.01em]`}>{claimed ? "Claimed" : "Claim this page"}</div>
            <div className="mt-[14px] flex flex-col gap-[6px] text-[13.5px] leading-[18px]">
              <Row k="Claiming" v="Free" />
              <Row k="Agent-readable" v="Ready" />
              <Row k="MCP + API" v="Ready, not on" />
              <div className="h-[1px] my-[4px] bg-[#2819101A]" />
              <Row k="Agent booking" v="From $29/mo" bold />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-[2px] p-[8px]">
        {steps.map(([label, done]) => (
          <div key={label} className="flex items-center gap-[10px] min-h-[38px] px-[8px]">
            <Check on={done} size={20} />
            <span className={`${agent ? "text-[12.5px]" : "text-[13px]"} leading-[17px] ${done ? "font-[600]" : "text-[#281910A6]"}`}>{label}</span>
          </div>
        ))}
      </div>

      {claimed ? (
        <div className="flex flex-col gap-[6px]">
          <div className={`px-[10px] pt-[2px] pb-[4px] text-[12px] font-[600] ${MUTED} ${agent ? "" : "uppercase tracking-[0.08em]"}`}>{agent ? `POST ${BASE}/plan` : "Next: let agents book"}</div>
          {PLANS.map((plan) => {
            const chosen = claim.plan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                disabled={Boolean(claim.plan) || Boolean(claim.planSending)}
                onClick={() => onPlan(plan.id)}
                className={`flex flex-col gap-[6px] p-[14px] rounded-[20px] text-left transition-colors duration-150 disabled:cursor-default ${chosen ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#FBF7EA]"} ${claim.plan && !chosen ? "opacity-50" : ""}`}
              >
                <span className="flex items-baseline gap-[8px]">
                  <span className={agent ? "text-[13px] font-[600]" : `${DISPLAY} text-[19px] leading-[23px]`}>{agent ? `{ "plan": "${plan.id}" }` : plan.name}</span>
                  <span className="ml-auto text-[18px] leading-[22px] font-[700]">{plan.price}</span>
                  <span className={`text-[12.5px] ${chosen ? "text-[#FFFCF199]" : MUTED}`}>
                    /mo <s>{plan.was}</s>
                  </span>
                </span>
                <span className={`text-[12px] leading-[16px] ${chosen ? "text-[#FFFCF1B3]" : SUB}`}>{plan.note}</span>
                <span className="flex flex-col gap-[3px]">
                  {plan.features.map((f) => (
                    <span key={f} className={`text-[13px] leading-[18px] ${chosen ? "text-[#FFFCF1C0]" : "text-[#281910B3]"}`}>
                      · {f}
                    </span>
                  ))}
                </span>
                <span className="mt-[4px] text-[13px] font-[700]">
                  {chosen ? (agent ? "202 · setup_link_sent" : "Chosen · we'll send the setup link") : claim.planSending === plan.id ? "Saving…" : agent ? "send →" : `Choose ${plan.name} →`}
                </span>
              </button>
            );
          })}
          {claim.error && <p className="px-[10px] text-[12.5px] leading-[17px] font-[600] text-[#B4532F]">{claim.error}</p>}
          <p className={`px-[10px] pb-[8px] text-[12px] leading-[17px] ${MUTED}`}>Or stay on Free: agents can still read your page, and you can upgrade any time.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-[6px]">
          <label htmlFor="ic-email" className="sr-only">
            Work email
          </label>
          <div className="relative">
            {agent && <span className={`absolute left-[16px] top-1/2 -translate-y-1/2 text-[13px] ${MUTED}`}>email:</span>}
            <input
              ref={emailRef}
              id="ic-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={claim.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`you@${CLINIC.domain}`}
              className={`h-[52px] w-full rounded-[18px] bg-[#FFFCF1] px-[16px] text-[16px] leading-[20px] placeholder:text-[#28191059] outline-none border-[1.5px] border-solid border-[#2819101F] focus:border-[#140C04] transition-colors ${agent ? "pl-[66px] text-[14px]" : ""}`}
            />
          </div>
          <button
            type="submit"
            disabled={claim.status === "sending"}
            className="w-full h-[52px] flex items-center justify-center gap-[10px] rounded-[18px] bg-[#140C04] text-[15px] font-[600] text-[#FFFCF1] disabled:opacity-70 transition-opacity"
          >
            {claim.status === "sending" ? (
              <>
                <Spinner size={16} light />
                {agent ? "sending" : "Claiming"}
              </>
            ) : agent ? (
              "POST /claim"
            ) : (
              "Claim & turn on"
            )}
          </button>
          {claim.status === "error" && (
            <p role="alert" className="px-[10px] text-[12.5px] leading-[17px] font-[600] text-[#B4532F]">
              {claim.error}
            </p>
          )}
          <p className={`px-[10px] pt-[2px] pb-[8px] text-[12px] leading-[17px] ${MUTED}`}>We&apos;ll email you a link to confirm you work at {CLINIC.name}. No card needed.</p>
        </form>
      )}
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-[10px]">
      <span className={bold ? "font-[700]" : "text-[#281910B3]"}>{k}</span>
      <span className={bold ? "text-[16px] font-[700]" : "font-[600]"}>{v}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ Your View */

function Section({ id, title, meta, agent, children }: { id: string; title: string; meta?: string; agent?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[124px] md:scroll-mt-[88px]">
      <div className="mb-[12px] flex items-baseline justify-between gap-[12px]">
        {meta && <span className={`order-2 shrink-0 text-[12px] leading-[16px] font-[600] ${MUTED} ${agent ? "font-mono font-[500]" : ""}`}>{meta}</span>}
        <h2
          className={
            agent ? "font-mono text-[16px] leading-[22px] md:text-[18px] md:leading-[24px] font-[600]" : `${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em]`
          }
        >
          {title}
        </h2>
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

const BOX = "rounded-[18px] bg-[#F4EEDF] p-[14px]";
const OFFER_TAGS = ["Credit", "Package", "Included", "Financing"];

function YourSections({ claimed }: { claimed: boolean }) {
  const [serviceTab, setServiceTab] = useState(0);
  const [priceTab, setPriceTab] = useState(0);
  return (
    <>
      <Section id="review" title="Needs review" meta={`${ISSUES.length} found`}>
        <div className="rounded-[20px] bg-[#F4EEDF] px-[16px] py-[4px]">
          {ISSUES.map((issue) => (
            <div key={issue.title} className="py-[11px] border-b border-solid border-[#2819100F] last:border-b-0">
              <div className="text-[14.5px] leading-[19px] font-[600]">{issue.title}</div>
              <div className={`mt-[2px] text-[13px] leading-[18px] ${SUB}`}>{issue.detail}</div>
            </div>
          ))}
        </div>
        <p className={`mt-[10px] text-[13px] leading-[18px] ${SUB}`}>
          {claimed ? "Fix any of these by typing a sentence once you confirm your email." : "Agents repeat these to patients as they are. Once claimed, fix each by typing a sentence."}
        </p>
      </Section>

      <Section id="locations" title="Locations & hours" meta={`${LOCATIONS.length} sites`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className={BOX}>
              <div className="text-[15px] leading-[20px] font-[600]">{loc.name}</div>
              <div className={`mt-[2px] text-[12.5px] leading-[17px] ${MUTED}`}>{loc.detail}</div>
              <div className="mt-[8px] text-[13.5px] leading-[19px]">
                {loc.address}
                <br />
                {loc.city}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[6px] rounded-[20px] bg-[#F4EEDF] px-[16px] py-[6px]">
          {[
            ["Monday – Friday", "8:30 a.m. – 4:30 p.m."],
            ["Saturday – Sunday", "Not listed"],
            ["Phone", CLINIC.phone],
            ["Toll-free", CLINIC.tollFree],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-[16px] py-[10px] border-b border-solid border-[#2819100F] last:border-b-0">
              <span className="shrink-0 text-[13.5px] text-[#281910B3]">{k}</span>
              <span className={`text-right text-[13.5px] font-[600] ${v === "Not listed" ? MUTED : ""}`}>{v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="providers" title="Providers" meta={`${PROVIDERS.length} listed`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          {PROVIDERS.map((p) => (
            <div key={p.name} className={BOX}>
              <div className="text-[15px] leading-[20px] font-[600]">{p.name}</div>
              <div className={`mt-[1px] text-[12.5px] leading-[17px] ${MUTED}`}>{p.role}</div>
              <div className="mt-[8px] text-[13px] leading-[18px] text-[#281910CC]">{p.fact}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="services" title="Services" meta={`${SERVICE_COUNT} services`}>
        <div className="flex gap-[6px] overflow-x-auto ic-noscroll">
          {SERVICES.map((g, i) => (
            <Pill key={g.group} on={serviceTab === i} onClick={() => setServiceTab(i)}>
              {g.group} · {g.items.length}
            </Pill>
          ))}
        </div>
        <div key={serviceTab} className="ic-fade mt-[10px] rounded-[20px] bg-[#F4EEDF] p-[8px] flex flex-wrap gap-[6px]">
          {SERVICES[serviceTab]!.items.map((s) => (
            <span key={s} className="h-[34px] px-[13px] flex items-center rounded-full bg-[#FFFCF1] text-[13px] font-[500]">
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section id="prices" title="Prices" meta="CAD · before HST">
        <div className="flex gap-[6px] overflow-x-auto ic-noscroll">
          {PRICES.map((g, i) => (
            <Pill key={g.group} on={priceTab === i} onClick={() => setPriceTab(i)}>
              {g.group} · {g.items.length}
            </Pill>
          ))}
        </div>
        <div key={priceTab} className="ic-fade mt-[10px] rounded-[20px] bg-[#F4EEDF] px-[16px] py-[6px] grid grid-cols-1 sm:grid-cols-2 sm:gap-x-[28px]">
          {PRICES[priceTab]!.items.map((p) => (
            <div key={p.name} className="flex items-baseline justify-between gap-[16px] py-[10px] border-b border-solid border-[#2819100F]">
              <span className="text-[13.5px] text-[#281910CC]">{p.name}</span>
              <span className="shrink-0 text-[13.5px] font-[700] tabular-nums">{p.price}</span>
            </div>
          ))}
        </div>
        <p className={`mt-[10px] text-[13px] leading-[18px] ${SUB}`}>
          Consultation {CLINIC.consult}. {CLINIC.consultNote}
        </p>
      </Section>

      <Section id="offers" title="Offers & financing">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          {OFFERS.map((o, i) => (
            <div key={o.title} className={`${BOX} flex flex-col gap-[6px]`}>
              <span className="self-start h-[20px] px-[8px] flex items-center rounded-full bg-[#FFFCF1] text-[10.5px] font-[700] text-[#281910B3]">{OFFER_TAGS[i]}</span>
              <span className="text-[15px] leading-[20px] font-[600]">{o.title}</span>
              <span className={`text-[13px] leading-[18px] ${SUB}`}>{o.detail}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="booking" title="Booking">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          <div className={BOX}>
            <div className={`text-[11px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Today</div>
            <div className="mt-[8px] flex flex-col gap-[6px]">
              {BOOKING.today.map((line) => (
                <span key={line} className="text-[13.5px] leading-[19px]">
                  · {line}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[18px] bg-[#140C04] text-[#FFFCF1] p-[14px]">
            <div className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">With Doe</div>
            <div className="mt-[8px] flex flex-col gap-[6px]">
              {["Agents book consults with the right surgeon, any hour", "Procedure, provider and documents arrive with the booking", "Confirmations and reminders sent for you"].map(
                (line) => (
                  <span key={line} className="text-[13.5px] leading-[19px]">
                    · {line}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section id="preview" title="How agents answer" meta="Example">
        <MusePreview />
      </Section>
    </>
  );
}

function MusePreview() {
  const [mode, setMode] = useState<"today" | "with">("with");
  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="flex p-[3px] gap-[2px]">
        {(
          [
            ["today", "Today"],
            ["with", "With your page on"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`grow h-[34px] rounded-full text-[13px] font-[600] transition-colors duration-150 ${mode === id ? "bg-[#140C04] text-[#FFFCF1]" : "text-[#281910B3] hover:text-[#281910]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-[4px] rounded-[20px] bg-[#FFFCF1] p-[14px] flex flex-col gap-[10px]">
        <div className={`text-[12px] font-[600] ${MUTED}`}>A patient asks Muse</div>
        <div className="self-end max-w-[88%] rounded-[18px] rounded-br-[6px] bg-[#F4EEDF] px-[14px] py-[10px] text-[14px] leading-[20px]">
          I want a deep plane facelift in Toronto. Who&apos;s good, what does it cost, and can I see someone next week?
        </div>
        {mode === "today" ? (
          <div
            key="today"
            className="ic-fade self-start max-w-[92%] rounded-[18px] rounded-bl-[6px] border-[1.5px] border-solid border-[#2819101F] px-[14px] py-[10px] text-[14px] leading-[20px] text-[#281910B3]"
          >
            Ford Plastic Surgery in Yorkville comes up for facelifts. I couldn&apos;t confirm their current prices or open consult times, so I can&apos;t book
            for you. Their site asks you to fill out a form and wait for a call back, weekdays 8:30 to 4:30.
          </div>
        ) : (
          <div key="with" className="ic-fade self-start max-w-[94%] flex flex-col gap-[6px]">
            <div className="rounded-[18px] rounded-bl-[6px] bg-[#140C04] text-[#FFFCF1] px-[14px] py-[10px] text-[14px] leading-[20px]">
              Ford Plastic Surgery, Bloor-Yorkville. Dr. Derek Ford was the first surgeon in Canada to offer the endoscopic mid facelift. A deep plane facelift
              starts at $22,500 and includes 3 lymphatic drainage sessions. Consults are $300, credited if you book within 3 months.
            </div>
            <div className="rounded-[18px] bg-[#F4EEDF] p-[12px]">
              <div className="text-[14px] leading-[18px] font-[600]">Consult · Dr. Derek Ford</div>
              <div className={`text-[12.5px] leading-[17px] ${MUTED}`}>7 St Thomas St, Suite 410 · or virtual</div>
              <div className="mt-[10px] flex gap-[6px]">
                {["Tue 10:30", "Wed 2:00", "Fri 9:15"].map((t, i) => (
                  <span key={t} className={`h-[32px] px-[12px] flex items-center rounded-full text-[13px] font-[600] ${i === 0 ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1]"}`}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={`mt-[10px] text-[12.5px] font-[600] ${MUTED}`}>Booking turns on when you claim</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Agent's View */

/** A dark response block: method and path on top, highlighted JSON below. */
function Endpoint({ method, path, status, maxHeight, children }: { method: string; path: string; status: string; maxHeight?: number; children: ReactNode }) {
  return (
    <div className="rounded-[22px] bg-[#140C04] text-[#FFFCF1] overflow-hidden font-mono">
      <div className="flex items-center gap-[10px] h-[44px] px-[16px] border-b border-solid border-[#FFFCF114] text-[12px]">
        <span className="shrink-0 font-[600] text-[#FCCFB8]">{method}</span>
        <span className="min-w-0 truncate text-[#FFFCF1CC]">{path}</span>
        <span className="ml-auto shrink-0 text-[#FFFCF180]">{status}</span>
      </div>
      <pre className="overflow-auto ic-noscroll p-[16px] text-[12px] leading-[19px] whitespace-pre-wrap break-words" style={maxHeight ? { maxHeight } : undefined}>
        {children}
      </pre>
    </div>
  );
}

const TOKEN = /("(?:\\.|[^"\\])*"(?:\s*:)?|-?\b\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)/g;

/** JSON with keys, strings and values tinted; `light` is for cream backgrounds. */
function Json({ value, light }: { value: unknown; light?: boolean }) {
  const parts = JSON.stringify(value, null, 2).split(TOKEN);
  const tint = (p: string) => {
    if (p.endsWith(":")) return light ? "#28191080" : "#FFFCF180";
    if (p.startsWith('"')) return light ? "#281910" : "#FFFCF1";
    return light ? "#B4532F" : "#FCCFB8";
  };
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color: tint(p) }}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

function AgentSections() {
  const block = (id: string, title: string, meta: string, data: unknown, maxHeight?: number) => (
    <Section id={id} title={title} meta={meta} agent>
      <Endpoint method="GET" path={`${BASE}/${title}`} status="200" maxHeight={maxHeight}>
        <Json value={data} />
      </Endpoint>
    </Section>
  );
  return (
    <>
      {block("review", "warnings", `${ISSUES.length} items`, AGENT.warnings)}
      {block("locations", "locations", `${LOCATIONS.length} items`, AGENT.locations, 460)}
      {block("providers", "providers", `${PROVIDERS.length} items`, AGENT.providers, 460)}
      {block("services", "services", `${SERVICE_COUNT} items`, AGENT.services, 460)}
      {block("prices", "prices", `${PRICE_COUNT} items · CAD`, AGENT.prices, 460)}
      {block("offers", "offers", `${OFFERS.length} items`, AGENT.offers)}
      {block("booking", "booking", "agent_booking: off", AGENT.booking)}
      <Section id="preview" title="tools" meta="mcp · not activated" agent>
        <div className="flex flex-col gap-[6px]">
          <Endpoint method="MCP" path="tools/list" status={`${AGENT.tools.length} tools`} maxHeight={460}>
            <Json value={AGENT.tools} />
          </Endpoint>
          <div className="rounded-[24px] bg-[#F4EEDF] p-[6px] font-mono">
            <div className={`px-[10px] py-[8px] text-[12px] font-[600] ${MUTED}`}>example run · muse</div>
            <div className="rounded-[20px] bg-[#FFFCF1] p-[14px] flex flex-col gap-[8px] text-[12.5px] leading-[18px]">
              {AGENT_RUN.map((line, i) => (
                <div key={i} className="flex gap-[10px]">
                  <span className={`shrink-0 w-[34px] ${MUTED}`}>{line.who}</span>
                  <span className={`shrink-0 ${MUTED}`}>{line.who === "muse" ? "→" : "←"}</span>
                  <span className={`min-w-0 break-words ${line.tone === "stop" ? "text-[#B4532F] font-[600]" : line.tone === "ok" ? "font-[600]" : ""}`}>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
