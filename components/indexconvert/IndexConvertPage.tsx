"use client";

/**
 * /indexconvert: a clinic watches Doe read its website and turn it into an agent-readable page, then sees that page,
 * ready but not activated, with one email field to claim it. Built in /demo's frame: Doe's brown around a cream box
 * with rounded corners, sand boxes inside it. "Agent's View" shows the same page as the JSON and MCP an agent receives.
 */
import { type CSSProperties, type FormEvent, type ReactNode, type RefObject, createContext, memo, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "@/lib/doehealthproduct/doehealthproduct.css";
import "@/lib/indexconvert/indexconvert.css";
import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { IndexConvertSphere } from "@/components/indexconvert/IndexConvertSphere";
import { dmSans, lora } from "@/lib/home/fonts";
import { startFilm, type FilmStart } from "@/lib/earlypreview/start-film";
import { useAdaptiveSrc } from "@/lib/earlypreview/use-adaptive-src";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";
import { useFilmCinema } from "@/lib/earlypreview/use-film-cinema";
import {
  BOOKING,
  CLINIC,
  FIELD_COUNT,
  HOURS,
  LOCATIONS,
  OFFERS,
  PRICE_COUNT,
  PRICES,
  PROVIDERS,
  SERVICE_COUNT,
  SERVICES,
  SOURCE_PAGES,
} from "@/lib/indexconvert/ford-plastic-surgery";
import { AGENT_TOPICS, InfoButton, InfoSheet, type AgentTopicId } from "@/components/indexconvert/AgentInfoSheet";
import { AGENT_FILES, API_ORIGIN, BASE, CLINIC_TOOLS, MCP_URL, SLUG } from "@/lib/indexconvert/agent-files";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SUB = "text-[#2819109E]";
const MUTED = "text-[#28191080]";

/* ------------------------------------------------------------------ Timeline */

/** The loader's steps, in order, with how long each runs. */
/** `subs` load one at a time under a step while it runs, then fold into its detail line. */
/** `phoneSubs` fill the first two steps on iPhone, where the step has room for its list; desktop shows the detail line. */
const STEPS: { title: string; detail: string; ms: number; subs?: string[]; phoneSubs?: string[]; bar?: boolean }[] = [
  {
    title: "Finding Ford's Page",
    detail: `${CLINIC.domain} · ${SOURCE_PAGES.length} pages`,
    ms: 1175,
    phoneSubs: [CLINIC.domain, `${SOURCE_PAGES.length} pages found`, "Prices, providers, hours"],
  },
  {
    title: "Checking What Personal Agents See at Ford",
    detail: "No llms.txt, MCP card or OpenAPI",
    ms: 1175,
    phoneSubs: ["No llms.txt", "No MCP card", "No OpenAPI"],
  },
  {
    title: "Building Ford's Agent-Readable Page",
    detail: `${FIELD_COUNT} fields · ${SERVICE_COUNT} services · ${PRICE_COUNT} prices`,
    ms: 1610,
    subs: ["JSON · 7 resources", "JSON-LD · schema.org/MedicalClinic", "Metadata & HTML"],
  },
  {
    title: "Building Ford's Agent Files",
    detail: `${AGENT_FILES.length} files ready`,
    ms: 1655,
    subs: ["openapi.json", "llms.txt", "robots.txt", ".well-known/mcp.json"],
  },
  {
    title: "Integrating Ford with Doe's MCP",
    detail: `${CLINIC_TOOLS.length} tools ready`,
    ms: 1655,
    subs: CLINIC_TOOLS.map((t) => t.name),
  },
  {
    title: "Integrating Ford with Doe's API",
    detail: "OpenAPI 3.1 · locations, providers, prices",
    ms: 1565,
    subs: ["GET /locations", "GET /providers", "GET /services", "GET /prices", "POST /consultations"],
  },
  {
    title: "Applying Personal Agent Protocol to Ford",
    detail: "Connected",
    ms: 1480,
    subs: ["Consent per user", "Agents say they're agents", "Connected to Doe"],
  },
];
const MAX_SUBS = Math.max(...STEPS.map((s) => s.subs?.length ?? s.phoneSubs?.length ?? 1));
const STEP_STARTS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((n, s) => n + s.ms, 0));
const BUILD_MS = STEPS.reduce((n, s) => n + s.ms, 0);
/** The read pills leave this long before the build ends. */
const CHIPS_OFF_MS = 650;
/** The page opens as soon as the last step (the Personal Agent Protocol) finishes: no "Ready" screen. */
const TOTAL_MS = BUILD_MS;
/** Each source page gets an equal slice of the build. */
const SLOT_MS = BUILD_MS / SOURCE_PAGES.length;
/** Cross-fade between two of the clinic's pages behind the loader. */
const PAGE_FADE_MS = 600;
const LOADER_FADE_MS = 420;

/** What the loader lifts off each page while it shows, keyed by screenshot. */
const PAGE_READS: Record<string, [string, string][]> = {
  home: [["name", "Ford Plastic Surgery"], ["specialty", "Facial plastic surgery"], ["area", "Bloor-Yorkville, Toronto"]],
  pricing: [["price", "Deep Plane Facelift · $22,500"], ["price", "Rhinoplasty · $17,100"], ["consult", "$300 + HST"]],
  medspa: [["price", "BOTOX · $13/unit"], ["service", "Morpheus8 · $950"], ["service", "HALO · $1,500"]],
  staff: [["provider", "Isabel Middleman, PA-C"], ["provider", "Caroline Watson"], ["role", "Injectables"]],
  locations: [["location", "7 St Thomas St, Suite 410"], ["location", "7 St Thomas St, Suite 202"], ["hours", "Mon–Fri 8:30–4:30"]],
  facelift: [["provider", "Dr. Derek Ford"], ["provider", "Dr. Steven Hanna"], ["service", "Endoscopic mid facelift"]],
  contact: [["hours", "Mon–Fri 8:30–4:30"], ["phone", CLINIC.phone], ["booking", "Consult request form"]],
};
/* ------------------------------------------------------------------ Agent data */

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

/** A category's services split into those with a listed price and those without, matching names loosely. */
function splitGroup(group: string) {
  const priced = PRICES.find((x) => x.group === group)?.items ?? [];
  const names = priced.map((x) => x.name.toLowerCase());
  const unpriced = (SERVICES.find((x) => x.group === group)?.items ?? []).filter((item) => {
    const l = item.toLowerCase();
    return !names.some((n) => n.includes(l) || l.includes(n));
  });
  return { priced, unpriced };
}

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const AGENT = {
  locations: {
    locations: LOCATIONS.map((l) => ({
      name: l.name,
      type: l.detail,
      address: `${l.address}, ${l.city}`,
      hours: Object.fromEntries(HOURS.map((h, i) => [DAY_KEYS[i], h.time ? "08:30-16:30" : null])),
    })),
    phone: "+1-416-925-7337",
    toll_free: "+1-888-925-7337",
  },
  providers: PROVIDERS.map((p) => ({ id: slug(p.name.split(",")[0]!), name: p.name, role: p.role, notes: p.fact })),
  services: {
    currency: "CAD",
    tax: "HST extra",
    basis: "starting_price",
    categories: Object.fromEntries(
      SERVICES.map((g) => {
        const { priced, unpriced } = splitGroup(g.group);
        return [slug(g.group), { priced: priced.map((p) => ({ service: slug(p.name), ...parsePrice(p.price) })), no_price_listed: unpriced.map(slug) }];
      }),
    ),
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
};

/* ------------------------------------------------------------------ Page */

type Phase = "intro" | "loading" | "leaving" | "done";
type View = "you" | "agent";

export function IndexConvertPage() {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [view, setView] = useState<View>("you");
  const [viewport, setViewport] = useState({ w: 390, h: 844 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /** `?skip` jumps straight to the page. */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("skip")) {
      setElapsed(TOTAL_MS);
      setPhase("done");
    }
  }, []);

  /** One clock drives the steps, the URL fill and which page is behind the loader. It starts when the visitor asks to see the page. */
  useEffect(() => {
    if (phase !== "loading") return;
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
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("done"), LOADER_FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // The phone's status bar follows the frame: darker brown in What Agents See.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute("content", phase === "done" && view === "agent" ? "#140C04" : "#3A2516");
  }, [phase, view]);

  const switchView = (next: View) => {
    if (next === view) return;
    setView(next);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const loader =
    phase === "loading" || phase === "leaving" ? (
      <div
        className="ic-fade absolute inset-0 z-50 bg-[#FFFCF1]"
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

  // Cinema mode only once the page is up: the loader and the opening screen are never blacked out. On every screen
  // size the playing film is brought to the centre of the scroll box and the page is locked until the film stops.
  useFilmCinema(scrollRef, { enabled: phase === "done", lock: true });

  return (
    // The page mounts once the loader has faded, so the two never show through each other.
    <Frame
      scrollRef={scrollRef}
      right={phase === "done" ? <ViewSwitch view={view} onChange={switchView} /> : null}
      dark={phase === "done" && view === "agent"}
      loader={loader}
      mark={phase === "done"}
      lead={
        phase === "intro" ? (
          // Lined up with the opening screen's column below it.
          <div className="w-full max-w-[560px] md:max-w-[720px] xl:max-w-[1180px] mx-auto">
            {/* Desktop: indented to the Ford box's inner edge (its 6px shell and 26px padding), so the two read as one column. */}
            <h1 className={`${DISPLAY} max-w-[19ch] md:max-w-[24ch] md:pl-[32px] md:box-content text-left text-[clamp(22px,6.4vw,25px)] leading-[1.14] md:text-[36px] md:leading-[42px] tracking-[-0.02em] [text-wrap:balance]`}>
              We can add your clinic to Doe&apos;s listings so clients can find you faster through Instinct or Muse.
            </h1>
          </div>
        ) : undefined
      }
      edgeFade={phase === "intro"}
    >
      {phase === "intro" && <Intro onStart={() => {
        setElapsed(0);
        setPhase("loading");
      }} />}
      {phase === "done" && <AgentPage view={view} scrollRef={scrollRef} />}
    </Frame>
  );
}

/* ------------------------------------------------------------------ Frame */

/** The Doe wordmark as /earlypreview's nav sets it: Lora, regular weight, text-4xl. */
const DoeMark = ({ center = false }: { center?: boolean }) => (
  <span className={`${lora.className} ${center ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0" : ""} text-[36px] leading-[36px] font-normal text-[color:var(--ic-ink)]`}>Doe</span>
);
const HEADER = "flex items-center justify-between gap-[12px] h-[76px] md:h-[72px] px-[18px] md:px-[32px]";

/** /demo's frame: Doe's brown fills the window and the page sits in a cream box that scrolls on its own. */
function Frame({
  scrollRef,
  right,
  loader,
  mark = true,
  centerMark = false,
  dark = false,
  lead,
  edgeFade = false,
  children,
}: {
  scrollRef: RefObject<HTMLDivElement>;
  right: ReactNode;
  loader: ReactNode;
  mark?: boolean;
  centerMark?: boolean;
  /** What Agents See: the darker brown throughout (see indexconvert.css). */
  dark?: boolean;
  /** Words in the header's left, in place of the logo. */
  lead?: ReactNode;
  /** Fades whatever scrolls past the top or bottom edge of the shell. */
  edgeFade?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      data-ic-view={dark ? "agent" : undefined}
      className={`${dmSans.className} doehealth-product-page indexconvert-page fixed inset-0 bg-[color:var(--ic-ink)] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
      }}
    >
      <div className="relative h-full w-full overflow-clip rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
          // A rise or fade that has played is marked done, which drops its animation (indexconvert.css), so cinema mode
          // swapping and handing back the animation of the film's wrappers can neither hide them nor replay them.
          onAnimationEnd={(event) => {
            if (event.animationName === "ic-rise" || event.animationName === "ic-fade") (event.target as Element).setAttribute("data-ic-done", "");
          }}
        >
          {/* iPhone, with a lead: the plain nav with Doe centred; the lead (the opening screen's title) is tablet and desktop only. */}
          {lead && (
            <header className={`md:hidden sticky top-0 z-30 ${HEADER} bg-[#FFFCF1E6] backdrop-blur-[12px]`}>
              <DoeMark center />
              {right}
            </header>
          )}
          {/* A lead is the opening screen's title: it sets the header's height and scrolls away with the page. */}
          <header
            className={
              lead
                ? "max-md:hidden relative z-30 flex items-start justify-between gap-[12px] px-[28px] pt-[28px] pb-[2px]"
                : `sticky top-0 z-30 ${HEADER} bg-[#FFFCF1E6] backdrop-blur-[12px]`
            }
          >
            {lead ?? (mark ? <DoeMark center={centerMark} /> : <span />)}
            {right}
          </header>
          {children}
        </div>
        {edgeFade && (
          <>
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute inset-x-0 top-[72px] z-20 h-[22px]"
              style={{ background: "linear-gradient(to bottom, #FFFCF1 0%, rgba(255,252,241,0) 100%)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[96px]"
              style={{ background: "linear-gradient(to top, #FFFCF1 6%, rgba(255,252,241,0.82) 38%, rgba(255,252,241,0) 100%)" }}
            />
          </>
        )}
        {/* The claim modal mounts here: over the whole inner shell, inside the brown frame. */}
        <div id="ic-modal-root" className="absolute inset-0 z-40 pointer-events-none" />
        {loader}
      </div>
    </div>
  );
}

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  /** In Your View a pill opens what agents see; in Agent's View a clean arrow goes back. */
  if (view === "you") {
    return (
      <button
        type="button"
        onClick={() => onChange("agent")}
        className="ic-ink-dark group ic-fade h-[40px] pl-[16px] pr-[12px] flex items-center gap-[8px] rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[13px] font-[600] whitespace-nowrap hover:bg-[color:var(--ic-ink-hover)] transition-colors duration-150"
      >
        What Agents See
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-[2px]">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  }
  return (
    <div className="ic-fade flex items-center gap-[6px]">
      <button
        type="button"
        onClick={() => onChange("you")}
        aria-label="Back to your page"
        title="Back"
        className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#F4EEDF] text-[#281910] hover:bg-[#EEE6D6] transition-colors duration-150"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="h-[40px] px-[16px] flex items-center rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[13px] font-[600] whitespace-nowrap">Agent&apos;s View</span>
    </div>
  );
}

function Check({ on, size = 20 }: { on: boolean; size?: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center transition-colors duration-150"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.35), backgroundColor: on ? "var(--ic-ink)" : "transparent", border: on ? "none" : "1.5px solid #28191040" }}
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

/** Check's opposite: a small brown square with a cream X. */
function Cross({ size = 20 }: { size?: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center bg-[color:var(--ic-ink)]"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.35) }}
      aria-hidden="true"
    >
      {/* An even glyph size in an even square, so the X sits on whole pixels, dead centre. */}
      <svg width={Math.round(size / 4) * 2} height={Math.round(size / 4) * 2} viewBox="0 0 24 24" className="block">
        <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="#FFFCF1" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Spinner({ size = 20, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="ic-spin shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke={light ? "#FFFCF133" : "#2819101F"} strokeWidth="2.6" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" style={{ stroke: light ? "#FFFCF1" : "var(--ic-ink)" }} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Loader */

function Loader({ elapsed, viewport, onSkip }: { elapsed: number; viewport: { w: number; h: number }; onSkip: () => void }) {
  const pageIndex = Math.min(SOURCE_PAGES.length - 1, Math.floor(elapsed / SLOT_MS));
  const stepIndex = STEPS.findIndex((_, i) => elapsed < STEP_STARTS[i]! + STEPS[i]!.ms);
  const built = stepIndex === -1;
  /** The bar follows the steps: each finished step is one share, the running one fills its share in time. */
  const stepFrac = built ? 1 : Math.min(1, Math.max(0, (elapsed - STEP_STARTS[stepIndex]!) / STEPS[stepIndex]!.ms));
  const progress = built ? 1 : (stepIndex + stepFrac) / STEPS.length;
  const page = SOURCE_PAGES[pageIndex]!;
  /** Once the last step finishes the page opens, so the loader never shows a "Ready" step: it holds the last one. */
  const shown = built ? STEPS.length - 1 : stepIndex;
  const step = STEPS[shown]!;
  const desktop = viewport.w >= 768;
  /** Short screens show only the part in progress under the step, not the whole list. */
  const compact = viewport.h < (desktop ? 780 : 760);
  /** iPhone: a larger sphere and larger lines, and only the running step's rows are reserved, so the step fills the space above the bar. */
  const sphere = desktop ? 76 : compact ? 72 : 96;
  const rowH = desktop ? 19 : 25;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ParsingBackdrop pageIndex={pageIndex} />
      {/* Cream from the top and from the bottom, each solid where its words sit and fading out toward the middle, where
          the page being read shows through. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[48%] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #FFFCF1 0%, #FFFCF1 56%, rgba(255,252,241,0.82) 72%, rgba(255,252,241,0) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[64%] md:h-[56%] pointer-events-none"
        style={{ background: "linear-gradient(to top, #FFFCF1 0%, #FFFCF1 66%, rgba(255,252,241,0.85) 80%, rgba(255,252,241,0) 100%)" }}
      />
      <PageDirectory pageIndex={pageIndex} built={built} />

      <div className="relative z-10 h-full flex flex-col">
        <div className={HEADER}>
          <DoeMark />
          <button
            type="button"
            onClick={onSkip}
            className={`h-[34px] px-[14px] rounded-full bg-[#F4EEDF] text-[13px] font-[600] ${SUB} hover:text-[#281910] transition-colors`}
          >
            Skip
          </button>
        </div>

        {/* One line while it runs, left under the logo. */}
        <div className="px-[18px] md:px-[32px] pt-[6px] md:pt-[10px]">
          <h1
            className={`ic-rise ${DISPLAY} max-w-[16ch] md:max-w-[20ch] text-left text-[31px] leading-[36px] md:text-[44px] md:leading-[50px] tracking-[-0.02em] [text-wrap:balance]`}
          >
            Hang tight! We&apos;re finding the listing we built {CLINIC.name}.
          </h1>
        </div>

        <ReadChips pageIndex={pageIndex} hidden={elapsed > BUILD_MS - CHIPS_OFF_MS} />

        {/* The build: the sphere, the step in progress with its parts, and a thin bar with the page being read. */}
        <div className="px-[18px] md:px-[32px] pb-[18px] md:pb-[28px]">
          <div className="w-full max-w-[460px]">
            <IndexConvertSphere size={sphere} speed={built ? 2.2 : 1} />
            <h2 key={step.title} className="ic-fade mt-[18px] md:mt-[14px] [text-wrap:balance] text-[24px] leading-[29px] md:text-[22px] md:leading-[28px] font-[600] tracking-[-0.015em] md:tracking-[-0.01em]">
              {step.title}
            </h2>
            <div className="mt-[6px] md:mt-[4px]" style={{ minHeight: compact ? rowH : rowH * (desktop ? MAX_SUBS : (step.subs ?? step.phoneSubs ?? [step.detail]).length) }}>
              {desktop && !step.subs ? (
                <p className={`ic-fade text-[12.5px] leading-[19px] ${SUB}`}>{step.detail}</p>
              ) : (
                <SubSteps key={step.title} subs={step.subs ?? step.phoneSubs ?? [step.detail]} progress={stepFrac} onlyCurrent={compact} large={!desktop} />
              )}
            </div>

            <div className="mt-[14px] h-[4px] rounded-full bg-[#2819101A] overflow-hidden">
              <div className="h-full rounded-full bg-[color:var(--ic-ink)] origin-left will-change-transform" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <div className="mt-[10px] flex items-center gap-[8px]">
              {built ? <Check on size={16} /> : <Spinner size={16} />}
              <span className="min-w-[0px] truncate text-[13px] leading-[18px] font-[600]">
                {CLINIC.url}
                {!built && page.path !== "/" && <span className={`font-[500] ${MUTED}`}>{page.path}</span>}
              </span>
              <span className={`ml-auto shrink-0 tabular-nums text-[13px] font-[600] ${MUTED}`}>{Math.round(progress * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Desktop: a brief directory of the clinic's pages on the right, ticking off as each is read. */
const PageDirectory = memo(function PageDirectory({ pageIndex, built }: { pageIndex: number; built: boolean }) {
  return (
    <div className="hidden lg:block absolute right-[32px] top-1/2 -translate-y-1/2 z-10 w-[236px] rounded-[20px] bg-[#F4EEDF] p-[5px]">
      <div className={`flex items-baseline justify-between px-[10px] pt-[6px] pb-[6px] text-[11px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>
        <span>Pages</span>
      </div>
      <ol className="flex flex-col rounded-[16px] bg-[#FFFCF1] p-[4px]">
        {SOURCE_PAGES.map((p, i) => {
          const read = built || i < pageIndex;
          const now = !built && i === pageIndex;
          return (
            <li
              key={p.path}
              className="flex items-center gap-[8px] h-[30px] px-[8px] rounded-[11px] transition-colors duration-300"
              style={{ backgroundColor: now ? "#F4EEDF" : "transparent" }}
            >
              {now ? <Spinner size={14} /> : <Check on={read} size={14} />}
              <span className={`min-w-0 truncate font-mono text-[11.5px] leading-[14px] ${now || read ? "text-[#281910]" : "text-[#28191066]"}`}>{p.path}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
});

/** A step's parts, indented in grey: each loads in turn, a small spinner on the one in progress. */
function SubSteps({ subs, progress, onlyCurrent = false, large = false }: { subs: string[]; progress: number; onlyCurrent?: boolean; large?: boolean }) {
  // Leave the last sliver of the step with every part done.
  const current = Math.floor(Math.min(0.999, progress / 0.9) * subs.length);
  return (
    <span className="block pl-[2px]">
      {subs.map((sub, i) =>
        i > current || (onlyCurrent && i < current) ? null : (
          <span key={sub} className={`ic-fade flex items-center ${large ? "gap-[9px] h-[25px] text-[15px] leading-[20px]" : "gap-[7px] h-[19px] text-[12.5px] leading-[16px]"} font-[400] ${SUB}`}>
            {i < current ? (
              <svg width={large ? 14 : 11} height={large ? 14 : 11} viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#28191080" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <Spinner size={large ? 14 : 11} />
            )}
            <span className="min-w-0 truncate">{sub}</span>
          </span>
        ),
      )}
    </span>
  );
}

/**
 * The clinic's own pages behind the loader, one per slot: each scrolls down while it shows, then fades to the next.
 * Edges fade into the cream.
 */
const ParsingBackdrop = memo(function ParsingBackdrop({ pageIndex }: { pageIndex: number }) {
  return (
    <div className="ic-corner-fade absolute inset-0 pointer-events-none" style={{ "--ic-slot": `${SLOT_MS}ms` } as CSSProperties} aria-hidden="true">
      {SOURCE_PAGES.map((page, i) => {
        // Mount the page on show, the one before (fading out) and the next one (paused, so it's loaded).
        if (i < pageIndex - 1 || i > pageIndex + 1) return null;
        const running: CSSProperties = { animationPlayState: i <= pageIndex ? "running" : "paused" };
        return (
          <div key={page.shot} className="absolute inset-0 overflow-hidden" style={{ opacity: i === pageIndex ? 1 : 0, transition: `opacity ${PAGE_FADE_MS}ms ease` }}>
            <Shot shot={page.shot} className="ic-read" style={{ ...running, opacity: 0.9 }} priority={i === 0} />
          </div>
        );
      })}
    </div>
  );
});

/** The values Doe lifted off the page on show, centred in the clear middle between the two cream fades, one after another. */
const ReadChips = memo(function ReadChips({ pageIndex, hidden }: { pageIndex: number; hidden: boolean }) {
  const page = SOURCE_PAGES[pageIndex]!;
  return (
    <div
      key={page.shot}
      className="flex-1 min-h-[0px] flex flex-col items-center justify-center gap-[8px] px-[18px] pointer-events-none"
      style={{ "--ic-slot": `${SLOT_MS}ms`, opacity: hidden ? 0 : 1, transition: "opacity 400ms ease" } as CSSProperties}
      aria-hidden="true"
    >
      {(PAGE_READS[page.shot] ?? []).map(([key, value], n) => (
        <span
          key={key + value}
          className="ic-chip inline-flex items-center gap-[10px] h-[40px] max-w-full pl-[5px] pr-[16px] rounded-full bg-[#FFFCF1] shadow-[0_0_0_1px_rgba(40,25,16,0.08),0_8px_24px_rgba(40,25,16,0.10)] text-[14px] leading-[18px] font-[600] whitespace-nowrap"
          style={{ animationDelay: `${SLOT_MS * (0.08 + n * 0.12)}ms`, animationDuration: `${SLOT_MS * 0.8}ms` }}
        >
          <span className={`shrink-0 h-[30px] px-[11px] flex items-center rounded-full bg-[#F4EEDF] text-[10.5px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>{key}</span>
          <span className="min-w-0 truncate">{value}</span>
        </span>
      ))}
    </div>
  );
});

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
        className={`absolute top-0 w-full max-w-[1440px] h-auto select-none ${className ?? ""}`}
        // Centred and never wider than the 1440px capture, so it isn't upscaled on big screens.
        style={{ left: "max(0px, calc(50% - 720px))", ...style }}
      />
    </picture>
  );
}

/* ------------------------------------------------------------------ Agent page */

const NAV = [
  { id: "providers", you: "Providers", agent: "providers" },
  { id: "locations", you: "Locations & Hours", agent: "locations" },
  { id: "services", you: "Services & Pricing", agent: "services" },
  { id: "offers", you: "Offers & Financing", agent: "offers" },
  { id: "booking", you: "Booking", agent: "booking" },
] as const;

/** A desktop side column fading in from `shift` px to the side, and out of the way (no clicks) while hidden. */
const revealStyle = (on: boolean, shift: number): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : `translateX(${shift}px)`,
  pointerEvents: on ? "auto" : "none",
  visibility: on ? "visible" : "hidden",
  transition: on ? `opacity 320ms ease, transform 420ms ${EASE}, visibility 0s` : `opacity 220ms ease, transform 320ms ${EASE}, visibility 0s linear 220ms`,
});

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
  const activateRef = useRef<HTMLButtonElement>(null);
  const [claimInView, setClaimInView] = useState(true);
  /** The section pills appear once Providers is on screen, and stay while the page scrolls down. */
  const [pillsOn, setPillsOn] = useState(false);
  const [active, setActive] = useState<string>(NAV[0].id);
  /** Desktop puts the claim box in a sticky right column; narrower screens put it under the status panel. */
  const [wide, setWide] = useState(false);
  /** Desktop opens on the centre column alone: the section nav joins once the edit section ("Here's the information…")
   * is reached, the claim box once the Activate button has scrolled away. */
  const [leftOn, setLeftOn] = useState(false);
  const [rightOn, setRightOn] = useState(false);
  /** iPhone sets the clinic's box slim, as a band along the bottom of the first screen. */
  const [phone, setPhone] = useState(false);
  const [modal, setModal] = useState<ClaimReason | null>(null);
  const [modalShown, setModalShown] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [claim, setClaim] = useState<Claim>({ email: "", status: "idle", error: "", claimed: null, plan: null, planSending: null });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = !agent && !wide ? activateRef.current : claimRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setClaimInView(entry!.isIntersecting), { root: scrollRef.current, threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [wide, view, agent, scrollRef]);

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

  useEffect(() => {
    const el = document.getElementById("providers");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPillsOn(entry!.isIntersecting || entry!.boundingClientRect.top < 0), { root: scrollRef.current, threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      setPillsOn(false);
    };
  }, [view, scrollRef]);

  useEffect(() => {
    if (!wide) return;
    const el = document.getElementById(agent ? "providers" : "included");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLeftOn(entry!.isIntersecting || entry!.boundingClientRect.top < 0), { root: scrollRef.current, threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      setLeftOn(false);
    };
  }, [wide, view, agent, scrollRef]);

  useEffect(() => {
    if (!wide) return;
    const el = activateRef.current;
    // Claimed, there's no Activate button: the claim box (now the plans) shows from the start.
    if (!el) {
      setRightOn(true);
      return;
    }
    // Gone once it has slid up under the 72px top bar.
    const io = new IntersectionObserver(([entry]) => setRightOn(!entry!.isIntersecting && entry!.boundingClientRect.top < 100), {
      root: scrollRef.current,
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setRightOn(false);
    };
  }, [wide, view, agent, scrollRef, claim.claimed]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => setPortalEl(document.getElementById("ic-modal-root")), []);
  const openModal = (reason: ClaimReason) => {
    setModal(reason);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setModalShown(true)));
  };
  const closeModal = () => {
    setModalShown(false);
    window.setTimeout(() => setModal(null), 270);
  };
  const goToClaim = () => openModal("activate");

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
    <div ref={wide || agent ? claimRef : undefined} id={wide || agent ? "claim" : undefined} className="ic-rise scroll-mt-[136px] md:scroll-mt-[88px]" style={{ animationDelay: "120ms" }}>
      {agent && !claimed ? (
        <ConnectBox />
      ) : (
        <ClaimBox agent={agent} claim={claim} setEmail={(email) => setClaim((c) => ({ ...c, email }))} emailRef={emailRef} onSubmit={submit} onPlan={choosePlan} />
      )}
    </div>
  );

  return (
    <ClaimModalContext.Provider value={openModal}>
      {/* iPhone: section pills, shown from the Providers section on down. Zero height, so the page doesn't shift. */}
      <nav className="md:hidden sticky top-[76px] z-20 h-0" aria-hidden={!pillsOn}>
        <div
          className="absolute inset-x-0 top-0 flex gap-[6px] overflow-x-auto px-[16px] py-[8px] bg-[#FFFCF1E6] backdrop-blur-[12px] ic-noscroll"
          style={{
            opacity: pillsOn ? 1 : 0,
            transform: pillsOn ? "none" : "translateY(-12px)",
            pointerEvents: pillsOn ? "auto" : "none",
            transition: `opacity 220ms ease, transform 300ms ${EASE}`,
          }}
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              tabIndex={pillsOn ? 0 : -1}
              onClick={() => go(n.id)}
              className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] transition-colors duration-150 ${agent ? "font-mono text-[12.5px]" : ""} ${active === n.id ? "bg-[color:var(--ic-ink)] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
            >
              {agent ? n.agent : n.you}
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop: the side columns split the 200px + 340px they had, so the centre column keeps its width and sits
          centred; each side fades in on its cue (leftOn, rightOn). */}
      <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)_270px] md:gap-[28px] md:px-[32px] max-w-[1440px] mx-auto pb-[96px] lg:pb-[40px]">
        <aside
          className="hidden md:flex flex-col gap-[2px] sticky top-[72px] self-start pt-[8px] lg:max-w-[220px]"
          aria-hidden={wide && !leftOn ? true : undefined}
          style={wide ? revealStyle(leftOn, -12) : undefined}
        >
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
              className="mt-[14px] h-[40px] px-[12px] flex items-center rounded-[12px] bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[13px] font-[600]"
            >
              Activate
            </button>
          )}
        </aside>

        <main key={view} className="ic-fade min-w-0 flex flex-col gap-[28px] px-[16px] md:px-0 pt-[6px]">
          {agent ? (
          <div className="ic-rise flex flex-col gap-[14px]">
            {/* Why this view exists: agents don't browse the way people do. */}
            <AgentsDifferent />
            <div className="rounded-[26px] bg-[#F4EEDF] p-[6px]">
              <div className="rounded-[21px] bg-[#FFFCF1] px-[20px] py-[20px] md:px-[26px] md:py-[22px] text-left">
                <div className="flex items-center gap-[16px]">
                  <IndexConvertSphere size={64} className="shrink-0" />
                  <div className="min-w-0">
                    <h1
                      className={
                        agent
                          ? "font-mono text-[14.5px] leading-[20px] sm:text-[18px] sm:leading-[24px] md:text-[22px] md:leading-[28px] font-[600]"
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
              </div>
            </div>
            <AgentStatus claimed={claimed} />
            <AgentsStudied />
            <AgentsPartners />
          </div>
          ) : (
            <div className="ic-rise flex flex-col gap-[10px]">
              {/* iPhone: the first screen fits the viewport: the title, the clinic's box, its settings and files, then the
                  switch and the button at the foot. The rest follows below. */}
              <div className="flex flex-col gap-[10px] max-md:min-h-[calc(100svh-116px)]">
                <h2 className={`${DISPLAY} whitespace-nowrap px-[4px] pt-[2px] max-md:text-center max-md:pt-[8px] max-md:pb-[0px] max-md:[@media(max-height:760px)]:pt-[0px] max-md:[@media(max-height:760px)]:text-[25px] text-left text-[clamp(22px,7.6vw,32px)] leading-[1.06] tracking-[-0.03em] md:pb-[8px] md:text-[clamp(27px,7.4vw,52px)] md:leading-[1.12] md:tracking-[-0.02em]`}>
                  We&apos;ve made your clinic
                  <br /> more discoverable
                  <br /> to personal agents.
                </h2>
                {/* iPhone: a quiet line under the title saying what's left to do. */}
                <div className="md:hidden flex flex-col items-center gap-[12px] [@media(max-height:760px)]:gap-[8px] pb-[16px] [@media(max-height:760px)]:pb-[6px]">
                  <p className="whitespace-nowrap text-center text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.14em] text-[#28191080]">
                    Claim your listing
                    <br />
                    to activate
                  </p>
                  {/* The personal agents it was tested in, one centred row, each checked. */}
                  <AgentIconsRow ring="#FFFCF1" />
                </div>
                <Hero className="max-md:order-1" compact={phone} />
                <SetupFiles phone className="md:hidden order-2" />
                {/* iPhone and tablet: the claim form sits in the status box, so it doubles as the claim target. */}
                <div ref={wide ? undefined : claimRef} id={wide ? undefined : "claim"} className="max-md:order-3 max-md:mt-auto scroll-mt-[136px] md:scroll-mt-[88px]">
                  <StatusPanel
                    activateRef={activateRef}
                    claimed={claim.claimed}
                    onClaim={goToClaim}
                  />
                </div>
              </div>
              <AgentSearches className="md:hidden" />
              <AboutDoe />
            </div>
          )}

          {/* Agent's View keeps its claim box here on iPhone; Your View shows it once claimed, for the plans. */}
          {!wide && (agent || claimed) && claimBox}

          {agent ? <AgentSections /> : <YourSections claimed={claimed} onEdit={() => openModal("edit")} />}

        </main>

        {wide && (
          <aside className="sticky top-[72px] self-start pt-[8px]" aria-hidden={!rightOn ? true : undefined} style={revealStyle(rightOn, 12)}>
            {claimBox}
          </aside>
        )}
      </div>

      {/* iPhone: a black pill that is the Activate button, shown once the one in the page scrolls away. */}
      <button
        type="button"
        onClick={goToClaim}
        tabIndex={!claimed && !claimInView ? 0 : -1}
        aria-hidden={claimed || claimInView}
        className={`ic-ink-default group lg:hidden fixed left-[18px] right-[18px] z-20 flex items-center justify-center gap-[10px] h-[62px] px-[14px] rounded-[999px] bg-[color:var(--ic-ink)] text-[#FFFCF1] font-[700] uppercase whitespace-nowrap shadow-[0_10px_30px_rgba(58,37,22,0.25)] text-[12.5px] tracking-[0.04em]`}
        style={{
          bottom: "calc(max(8px, env(safe-area-inset-bottom)) + 10px)",
          transform: !claimed && !claimInView ? "none" : "translateY(calc(100% + 40px))",
          transition: `transform 360ms ${EASE}`,
        }}
      >
        <span className="relative inline-flex shrink-0 items-center w-[36px] h-[20px] rounded-full bg-[#FFFCF133]" aria-hidden="true">
          <span className="absolute left-[3px] top-[3px] w-[14px] h-[14px] rounded-full bg-[#FFFCF1] transition-transform duration-300 group-active:translate-x-[16px]" />
        </span>
        Activate for Personal Agents
      </button>
      {modal && portalEl
        ? createPortal(
            <ClaimModal
              reason={modal}
              visible={modalShown}
              claim={claim}
              setEmail={(email) => setClaim((c) => ({ ...c, email }))}
              onSubmit={submit}
              onClose={closeModal}
            />,
            portalEl,
          )
        : null}
    </ClaimModalContext.Provider>
  );
}

/* ------------------------------------------------------------------ Status */

/** The clinic as a small hero: sphere, name, what it is, where, its site. Centred on iPhone, a row from tablet up. */
function Hero({
  action,
  compact = false,
  nameOnly = false,
  className = "",
  innerClassName = "",
}: {
  action?: ReactNode;
  compact?: boolean;
  /** Just the sphere and the clinic's name, for the slim band on iPhone. */
  nameOnly?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`flex flex-col rounded-[26px] bg-[#F4EEDF] p-[6px] shrink-0 ${className}`}>
      <div className={`grow flex flex-col justify-center ${compact ? "rounded-[21px] bg-[#FFFCF1] px-[16px] pt-[26px] pb-[24px] [@media(max-height:760px)]:pt-[16px] [@media(max-height:760px)]:pb-[14px] md:px-[22px] md:py-[18px]" : "rounded-[21px] bg-[#FFFCF1] px-[20px] pt-[24px] pb-[22px] md:px-[26px] md:py-[24px]"} ${innerClassName}`}>
        <div className={compact ? "flex flex-col items-center text-center gap-[12px] [@media(max-height:760px)]:gap-[8px]" : "flex flex-col items-center text-center md:flex-row md:text-left gap-[14px] md:gap-[22px] xl:flex-1 xl:min-w-0"}>
          <IndexConvertSphere size={compact ? 64 : 84} className="shrink-0" />
          <div className="min-w-0">
            <h1 className={`${DISPLAY} tracking-[-0.02em] [text-wrap:balance] ${compact ? "text-[24px] leading-[28px] [@media(max-height:760px)]:text-[21px] [@media(max-height:760px)]:leading-[25px] md:text-[30px] md:leading-[34px]" : "text-[30px] leading-[34px] md:text-[36px] md:leading-[40px]"}`}>{CLINIC.name}</h1>
            {!nameOnly && (
              <>
                <p className={`mt-[4px] max-w-[32ch] ${SUB} ${compact ? "mx-auto whitespace-nowrap " : "[text-wrap:balance] "}${compact ? "text-[15px] leading-[20px] [@media(max-height:760px)]:text-[13.5px] [@media(max-height:760px)]:leading-[18px] font-[500]" : "mx-auto md:mx-0 mt-[6px] text-[14.5px] leading-[20px]"}`}>
                  {compact ? (
                    <>
                      {LOCATIONS[0].address},
                      <br />
                      {CLINIC.area}
                    </>
                  ) : (
                    `${CLINIC.kind} in ${CLINIC.area}, since ${CLINIC.since}`
                  )}
                </p>
                <a
                  href={`https://${CLINIC.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center rounded-full bg-[#F4EEDF] font-[600] hover:bg-[#EEE6D6] transition-colors duration-150 ${compact ? "mt-[8px] h-[34px] px-[14px] text-[14.5px] [@media(max-height:760px)]:mt-[6px] [@media(max-height:760px)]:h-[30px] [@media(max-height:760px)]:text-[13px]" : "mt-[12px] h-[32px] px-[14px] text-[13px]"}`}
                >
                  {CLINIC.domain}
                </a>
              </>
            )}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}

/** One illustration per step, drawn small and quiet on a sand tile. */
function StepVisual({ n }: { n: 1 | 2 | 3 | 4 | 5 }) {
  const tile = "h-[112px] rounded-[16px] bg-[#F4EEDF] flex items-center justify-center overflow-hidden";
  /** A small caption under a card in the tiles below. */
  const cap = `mt-[6px] text-[11px] leading-[14px] font-[600] whitespace-nowrap ${MUTED}`;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  // Step 1: Ford's own site, read into a page agents can use.
  if (n === 1)
    return (
      <div className={`${tile} gap-[12px]`}>
        <div className="flex flex-col items-center">
          <div className="w-[64px] h-[64px] rounded-[14px] overflow-hidden bg-[#FFFCF1] ring-1 ring-[#2819101A]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/indexconvert/home-m.jpg" alt="" draggable={false} className="block w-full h-full object-cover object-top select-none" />
          </div>
          <span className={cap}>Your site</span>
        </div>
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true" className="mb-[20px] text-[#281910]">
          <path d="M1 7h22M17 1.5L23 7l-6 5.5" {...stroke} strokeWidth={2} />
        </svg>
        <div className="flex flex-col items-center">
          <div className="w-[64px] h-[64px] rounded-[14px] bg-[color:var(--ic-ink)] px-[10px] py-[10px] flex flex-col justify-center gap-[5px] font-mono text-[8.5px] leading-[10px] text-[#FFFCF1]">
            <span className="text-[#FCCFB8]">{"{"}</span>
            <span className="block h-[4px] w-[36px] rounded-full bg-[#FFFCF1] opacity-85" />
            <span className="block h-[4px] w-[26px] rounded-full bg-[#FFFCF1] opacity-50" />
            <span className="block h-[4px] w-[32px] rounded-full bg-[#FFFCF1] opacity-50" />
            <span className="self-end text-[#FCCFB8]">{"}"}</span>
          </div>
          <span className={cap}>Agent page</span>
        </div>
      </div>
    );
  // Step 2: the claim, as the email field and its button.
  if (n === 2)
    return (
      <div className={`${tile} px-[14px]`}>
        <div className="flex items-center gap-[8px] h-[44px] w-full max-w-[250px] pl-[14px] pr-[5px] rounded-full bg-[#FFFCF1] ring-1 ring-[#2819101A]">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-[#28191080]">
            <rect x="3.5" y="5.5" width="17" height="13" rx="3" {...stroke} />
            <path d="M4.5 8l7.5 5.5L19.5 8" {...stroke} />
          </svg>
          <span className={`min-w-0 flex-1 truncate text-[12.5px] ${MUTED}`}>you@clinic.com</span>
          <span className="shrink-0 h-[34px] px-[14px] flex items-center rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[12px] font-[700] uppercase tracking-[0.04em]">Claim</span>
        </div>
      </div>
    );
  // Step 3: what agents can do once it's on, one small card each.
  if (n === 3) {
    const acts: { label: string; icon: ReactNode }[] = [
      {
        label: "Book",
        icon: (
          <>
            <rect x="4" y="5.5" width="16" height="14.5" rx="3" {...stroke} />
            <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" {...stroke} />
            <path d="M9 14.5l2 2 4-4" {...stroke} />
          </>
        ),
      },
      {
        label: "Intake",
        icon: (
          <>
            <rect x="5.5" y="4.5" width="13" height="16" rx="2.5" {...stroke} />
            <path d="M9.5 3.5h5v2.5h-5zM9 11h6M9 14.5h6M9 18h3.5" {...stroke} />
          </>
        ),
      },
      {
        label: "Payments",
        icon: (
          <>
            <rect x="3.5" y="6" width="17" height="12" rx="2.5" {...stroke} />
            <path d="M3.5 10h17M7 14.5h4" {...stroke} />
          </>
        ),
      },
    ];
    return (
      <div className={`${tile} gap-[6px] px-[10px]`}>
        {acts.map((a) => (
          <div key={a.label} className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] rounded-[13px] bg-[#FFFCF1] flex items-center justify-center text-[color:var(--ic-ink)]">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                {a.icon}
              </svg>
            </div>
            <span className={`${cap} w-[56px] text-center`}>{a.label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="w-[50px] h-[50px] rounded-[13px] border-[1.5px] border-dashed border-[#28191033] flex items-center justify-center gap-[4px]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[4px] h-[4px] rounded-full bg-[#28191066]" />
            ))}
          </div>
          <span className={`${cap} w-[56px] text-center`}>& more</span>
        </div>
      </div>
    );
  }
  // Step 4: Doe in the middle, wired to the channels agents read.
  if (n === 4) {
    const chip = "h-[26px] w-[52px] flex items-center justify-center rounded-full bg-[#FFFCF1] font-mono text-[11.5px] font-[600]";
    const wire = "h-[36px] w-[18px] border-[#28191033] border-dashed";
    return (
      <div className={tile}>
        <div className="flex flex-col gap-[10px]">
          <span className={chip}>MCP</span>
          <span className={chip}>API</span>
        </div>
        <span className={`${wire} border-y-[1.5px] border-r-[1.5px] rounded-r-[10px]`} aria-hidden="true" />
        <span className="w-[10px] h-[1.5px] bg-[#28191033]" aria-hidden="true" />
        <span className="w-[52px] h-[52px] rounded-[16px] bg-[color:var(--ic-ink)] flex items-center justify-center">
          <IndexConvertSphere size={34} color="#FCCFB8" />
        </span>
        <span className="w-[10px] h-[1.5px] bg-[#28191033]" aria-hidden="true" />
        <span className={`${wire} border-y-[1.5px] border-l-[1.5px] rounded-l-[10px]`} aria-hidden="true" />
        <div className="flex flex-col gap-[10px]">
          <span className={chip}>JSON</span>
          <span className={chip}>EXA</span>
        </div>
      </div>
    );
  }
  // Step 5: the personal agents' own icons, each with a small check, over the booking they make.
  return (
    <div className={`${tile} flex-col gap-[12px] px-[12px]`}>
      <AgentIconsRow />
      <div className="flex items-center gap-[8px] h-[32px] pl-[6px] pr-[14px] rounded-full bg-[#FFFCF1]">
        <IndexConvertSphere size={22} className="shrink-0" />
        <span className="text-[12.5px] font-[600] whitespace-nowrap">Consult booked</span>
        <span className={`text-[12.5px] whitespace-nowrap ${MUTED}`}>Tue 10:30</span>
      </div>
    </div>
  );
}

const STEP_BOXES: { n: 1 | 2 | 3 | 4 | 5; title: string; detail?: string }[] = [
  { n: 1, title: "We've created an agentic-readable version of your clinic page" },
  { n: 2, title: "Claim your page" },
  { n: 3, title: "Allow potential clients to book through agents, complete intake, make payments & more" },
  { n: 4, title: "We handle the rest", detail: "We connect your clinic directly to the channels that make it visible and interactable to personal agents." },
  { n: 5, title: "Potential clients can now use their personal agent to find and book you." },
];

/** How it works, one box per step: sand shell, cream inside, a small picture, then the line. */
function StepBoxes() {
  return (
    <>
      {STEP_BOXES.map((st) => (
        // Tablet: two across, the fifth spanning both. Desktop: three over two.
        <div key={st.n} className={`rounded-[26px] bg-[#F4EEDF] p-[6px] flex flex-col ${st.n === 5 ? "md:col-span-2 xl:col-span-3" : st.n === 4 ? "xl:col-span-3" : "xl:col-span-2"}`}>
          <div className="flex-1 rounded-[21px] bg-[#FFFCF1] p-[10px] md:p-[12px]">
            <StepVisual n={st.n} />
            <div className="px-[8px] pt-[14px] pb-[8px] md:px-[12px]">
              <div className="flex items-start gap-[12px]">
                <span className="shrink-0 mt-[1px] w-[26px] h-[26px] flex items-center justify-center rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[13px] font-[700]">{st.n}</span>
                <div className="min-w-0">
                  <div className="text-[17px] leading-[24px] font-[600] [text-wrap:balance]">{st.title}</div>
                  {st.detail && <div className={`mt-[4px] text-[14.5px] leading-[22px] ${SUB} [text-wrap:pretty]`}>{st.detail}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/** The first screen: the clinic's box and one button. The agent-readable page itself waits behind it. */
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="ic-fade flex justify-center px-[16px] md:px-[28px] pt-[22px] pb-[96px]">
      {/* iPhone: one column. Tablet: one wider column, steps two across. Desktop: full-width bands: the clinic with its
          button, the five steps three over two, then the founders. */}
      <div className="w-full max-w-[560px] md:max-w-[720px] xl:max-w-[1180px] flex flex-col gap-[10px]">
        {/* iPhone: a quiet line under the centred Doe logo, in the same type as "Claim your listing to activate". */}
        <p className="md:hidden -mt-[10px] pb-[12px] whitespace-nowrap text-center text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.14em] text-[#28191080]">
          Doe can help increase bookings
          <br />
          through personal agents
        </p>
        <Hero
          innerClassName="xl:flex-row xl:items-center xl:gap-[36px] xl:!px-[32px] xl:!py-[28px]"
          action={
            <div className="w-full xl:w-[500px] xl:shrink-0">
            {/* Where the clinic stands today: the personal agents, each crossed out, in a quiet dashed box. */}
            <div className="mt-[20px] xl:mt-0 w-full rounded-[16px] border-[1.5px] border-dashed border-[#28191033] px-[14px] pt-[14px] pb-[16px]">
              <p className={`whitespace-nowrap text-center text-[clamp(11.5px,3.5vw,13px)] leading-[18px] font-[500] ${SUB}`}>
                Personal agents have a hard time
                <br /> connecting to {CLINIC.name}
              </p>
              <AgentIconsRow blocked ring="#FFFCF1" className="mt-[12px]" />
            </div>
            <button
              type="button"
              onClick={onStart}
              className="group mt-[10px] w-full h-[60px] flex items-center justify-center gap-[10px] rounded-[16px] bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[15px] md:text-[16px] font-[700] hover:bg-[color:var(--ic-ink-hover)] transition-colors duration-150"
            >
              See The Page We Built You
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-[3px]">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            </div>
          }
        />
        <div className="flex flex-col gap-[10px] md:grid md:grid-cols-2 xl:grid-cols-6 max-xl:order-1">
          <StepBoxes />
        </div>
        <AboutDoe intro />
      </div>
    </main>
  );
}

const CONNECTIONS: { name: string; detail: string; topic: AgentTopicId }[] = [
  { name: "Ford's MCP Server", detail: `${CLINIC_TOOLS.length} tools: prices, providers, consults`, topic: "mcp" },
  { name: "Ford's Agent API", detail: "Services, prices & surgeons for agents", topic: "api" },
  { name: "Ford's Agent Protocol", detail: "Patient consent · agents say they're agents", topic: "pap" },
];

/** Which explanation each agent file opens. */
const FILE_TOPIC: Record<string, AgentTopicId> = {
  "/llms.txt": "llms",
  "/robots.txt": "robots",
  "/openapi.json": "openapi",
  "/.well-known/mcp.json": "card",
};

/** A label over its rows, in the page's type rather than chips. */
function StatusGroup({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return (
    <div className="mt-[18px]">
      <div className="flex items-baseline justify-between gap-[12px] pb-[6px] border-b border-solid border-[#2819101A]">
        <span className="text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em]">{title}</span>
        {meta && <span className={`text-[12px] leading-[16px] ${MUTED}`}>{meta}</span>}
      </div>
      {children}
    </div>
  );
}

/** A small abstract street map with a pin, round and faded to nothing at the rim; `variant` picks a different map. */
function LocationMap({ variant, size = 76 }: { variant: number; size?: number }) {
  const v = variant % 2;
  return (
    <span
      className="shrink-0 block"
      style={{
        width: size,
        height: size,
        WebkitMaskImage: "radial-gradient(circle at center, #000 46%, rgba(0,0,0,0.55) 62%, transparent 76%)",
        maskImage: "radial-gradient(circle at center, #000 46%, rgba(0,0,0,0.55) 62%, transparent 76%)",
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="block">
        <rect width="100" height="100" fill="#EDE4D0" />
        {v === 0 ? (
          <>
            <rect x="62" y="56" width="26" height="22" rx="5" fill="#DCE5D0" />
            <g stroke="#FFFCF1" strokeLinecap="round" fill="none">
              <path d="M-4 22H104M-4 48H104M-4 74H104" strokeWidth="6" />
              <path d="M30 -4V104M62 -4V104" strokeWidth="6" />
              <path d="M-4 92L104 28" strokeWidth="5" />
            </g>
          </>
        ) : (
          <>
            <rect x="4" y="6" width="28" height="22" rx="5" fill="#DCE5D0" />
            <rect x="60" y="68" width="30" height="20" rx="5" fill="#D9E3E6" />
            <g stroke="#FFFCF1" strokeLinecap="round" fill="none">
              <path d="M24 -4V104M52 -4V104M80 -4V104" strokeWidth="6" />
              <path d="M-4 30H104M-4 64H104" strokeWidth="6" />
              <path d="M-4 82Q40 58 104 78" strokeWidth="5" />
            </g>
          </>
        )}
        <g transform={v === 0 ? "translate(46 44)" : "translate(56 48)"}>
          <ellipse cx="0" cy="13" rx="6" ry="2.2" fill="#281910" opacity="0.18" />
          <path d="M0 12C-8 2 -9.5 -2 -9.5 -6.5a9.5 9.5 0 0 1 19 0C9.5 -2 8 2 0 12z" style={{ fill: "var(--ic-ink)" }} />
          <circle cx="0" cy="-6.5" r="3.6" fill="#FFFCF1" />
        </g>
      </svg>
    </span>
  );
}

const FOUNDERS_THUMB = "/earlypreview/thumbs/hero.jpg";

/**
 * The founders' film (/earlypreview's hero), in the What Is Doe box. Its thumbnail rests until a tap, which plays it with
 * sound; the page's cinema mode (see useFilmCinema in IndexConvertPage) then blacks out everything around the film.
 */
function FoundersFilm() {
  const film = useEarlyPreviewFilm("hero");
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef<FilmStart>({ rewound: false });
  const source = useAdaptiveSrc(videoRef, playing ? film : undefined);

  useEffect(() => {
    if (playing && film && videoRef.current) startFilm(videoRef.current, startRef.current);
  }, [playing, film]);

  return (
    // The figure is the film's frame in cinema mode; the rounded clip sits inside it, so the hint above can show.
    <figure className="relative m-0 cursor-pointer" onClick={() => setPlaying(true)}>
      {/* iPhone, in cinema mode only: a quiet line on the black above the film saying how to leave. It lets taps
          through, so a tap on it lands on the black and ends cinema like any other. */}
      <span
        aria-hidden="true"
        className="md:hidden pointer-events-none absolute inset-x-0 bottom-full mb-[18px] text-center text-[11.5px] leading-[14px] font-[600] uppercase tracking-[0.14em] text-[#FFFCF180] opacity-0 transition-opacity duration-500 [[data-cinema]_&]:opacity-100 [[data-cinema]_&]:delay-300"
      >
        Tap outside the video to exit
      </span>
      <div className="relative rounded-[18px] overflow-hidden aspect-[16/9] lg:aspect-[2.3/1] bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOUNDERS_THUMB} alt="James and Matthew Lisondra, the founders of Doe" draggable={false} className="absolute inset-0 block h-full w-full object-cover select-none" style={{ objectPosition: "50% 32%" }} />
      {playing && (
        <video
          ref={videoRef}
          {...source}
          className="absolute inset-0 h-full w-full object-cover bg-black"
          playsInline
          controls
          preload="auto"
          aria-label="What Is Doe, video"
          onLoadedMetadata={() => videoRef.current && startFilm(videoRef.current, startRef.current)}
        />
      )}
      {!playing && (
        <button type="button" aria-label="Play What Is Doe" className="absolute inset-0 flex items-center justify-center">
          <span className="w-[64px] h-[64px] rounded-full bg-[#FFFCF1E6] text-[color:var(--ic-ink)] flex items-center justify-center shadow-[0_8px_24px_rgba(58,37,22,0.25)]">
            <svg width="26" height="26" viewBox="1.35 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
            </svg>
          </span>
        </button>
      )}
      </div>
    </figure>
  );
}

/** The personal agents Ford shows up in, each one tested. `light` icons are mostly white, so they get a hairline edge. */
const AGENT_APPS: { name: string; href: string; icon: string; light?: boolean }[] = [
  { name: "Muse", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/", icon: "/indexconvert/agents/muse.png", light: true },
  { name: "Instinct", href: "https://instinct.com", icon: "/indexconvert/agents/instinct.png", light: true },
  { name: "GPT Dots", href: "https://openai.com/index/introducing-dots/", icon: "/indexconvert/agents/gpt-dots.png", light: true },
  { name: "Claude Duet", href: "https://claude.com/product/claude-duet", icon: "/indexconvert/agents/claude-duet.png", light: true },
  { name: "Poke", href: "https://poke.com/docs", icon: "/indexconvert/agents/poke.png" },
];

/** iPhone: the agents Ford now appears in, one per row: app icon, name, and a tested & confirmed mark. */
function AgentSearches({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[26px] bg-[#F4EEDF] p-[6px] ${className}`}>
      <div className="rounded-[21px] bg-[#FFFCF1] px-[18px] pt-[20px] pb-[10px]">
        <h3 className={`${DISPLAY} whitespace-nowrap text-[clamp(20px,6.15vw,24px)] leading-[1.17] tracking-[-0.02em]`}>
          {CLINIC.name}
          <br /> was easier to interact
          <br /> with when activated.
        </h3>
        <p className={`mt-[6px] whitespace-nowrap text-[14px] leading-[19px] ${SUB}`}>
          Tested in each personal agent
          <br /> with your page activated.
        </p>
        <ul className="mt-[12px] flex flex-col divide-y divide-[#28191014]">
          {AGENT_APPS.map((a) => (
            <li key={a.name} className="flex items-center gap-[14px] py-[12px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.icon}
                alt=""
                width={48}
                height={48}
                draggable={false}
                className={`block shrink-0 w-[48px] h-[48px] rounded-[12px] object-cover select-none ${a.light ? "ring-1 ring-[#2819101A]" : ""}`}
              />
              <span className="min-w-0 flex-1">
                <a href={a.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[4px] text-[16px] leading-[21px] font-[600] no-underline">
                  {a.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className={MUTED}>
                    <path d="M9 5.5l6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <span className={`mt-[3px] flex items-center gap-[6px] text-[13px] leading-[18px] ${SUB}`}>
                  <Check on size={14} />
                  Tested &amp; confirmed
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The personal agents' own icons in one centred row, each with a small check. `ring` matches the colour behind it. */
/** `blocked` swaps each check for a small X and quiets the icons: agents that can't connect yet. */
function AgentIconsRow({ ring = "#F4EEDF", blocked = false, className = "" }: { ring?: string; blocked?: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-[8px] ${className}`}>
      {AGENT_APPS.map((a) => (
        <span key={a.name} className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.icon}
            alt={a.name}
            width={36}
            height={36}
            draggable={false}
            className={`block w-[36px] h-[36px] rounded-[10px] object-cover select-none ${a.light ? "ring-1 ring-[#2819101A]" : ""} ${blocked ? "grayscale-[0.7] opacity-[0.7]" : ""}`}
          />
          <span className="absolute -right-[4px] -bottom-[4px] rounded-[6px]" style={{ boxShadow: `0 0 0 2px ${ring}` }}>
            {blocked ? <Cross size={14} /> : <Check on size={14} />}
          </span>
        </span>
      ))}
    </div>
  );
}

const MUSE = AGENT_APPS[0];

/** A patient asking their personal agent for a clinic, and Muse answering with Ford. HALO price from Ford's pricing page. */
function AgentChat({ className = "" }: { className?: string }) {
  const sent = "max-w-[78%] self-end rounded-[20px] rounded-br-[6px] bg-[color:var(--ic-ink)] px-[14px] py-[8px] text-[14.5px] leading-[20px] text-[#FFFCF1]";
  return (
    <div className={`flex flex-col gap-[4px] ${className}`} aria-label="Example chat with a personal agent">
      <div className={sent}>Find a HALO laser clinic within 30 km under $1,800, available within 10 months</div>
      <div className="mt-[12px] flex items-end gap-[8px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MUSE.icon}
          alt=""
          width={32}
          height={32}
          draggable={false}
          className="block shrink-0 w-[32px] h-[32px] rounded-[9px] object-cover select-none shadow-[0_1px_3px_rgba(40,25,16,0.12)] ring-1 ring-[#2819101A]"
        />
        <div className="min-w-0 max-w-[78%]">
          <div className={`pl-[12px] pb-[3px] text-[11.5px] leading-[14px] font-[600] ${MUTED}`}>{MUSE.name}</div>
          <div className="rounded-[20px] rounded-bl-[6px] bg-[#F4EEDF] px-[14px] py-[8px] text-[14.5px] leading-[20px] text-[#281910]">
            {CLINIC.name} at {LOCATIONS[0].address.split(",")[0]} is 10 minutes from you and offers HALO from $1,500. Want me to book?
          </div>
        </div>
      </div>
    </div>
  );
}

/** The founders and why Doe exists: their photo from /earlypreview's film in a rounded box, then the note. */
function AboutDoe({ intro = false }: { intro?: boolean }) {
  return (
    <div className="rounded-[26px] bg-[#F4EEDF] p-[6px]">
      <div className={`rounded-[21px] bg-[#FFFCF1] p-[10px] md:p-[12px] ${intro ? "xl:grid xl:grid-cols-[1.2fr_1fr] xl:items-center xl:gap-[12px]" : ""}`}>
        {intro ? (
          <div className="rounded-[18px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOUNDERS_THUMB}
              alt="James and Matthew Lisondra, the founders of Doe"
              draggable={false}
              className="block w-full aspect-[16/9] object-cover select-none"
              style={{ objectPosition: "50% 32%" }}
            />
          </div>
        ) : (
          <FoundersFilm />
        )}
        <div className={`px-[10px] pt-[18px] pb-[14px] md:px-[16px] md:pt-[22px] md:pb-[18px] ${intro ? "xl:px-[24px] xl:py-[28px]" : ""}`}>
          {intro ? (
            <>
              <p className={`${DISPLAY} max-w-[22ch] text-[clamp(26px,6.6vw,38px)] leading-[1.14] tracking-[-0.02em] [text-wrap:balance]`}>
                We&apos;ve built Doe to prepare Canadian clinics for personal agents.
              </p>
              <AgentChat className="mt-[18px] mb-[22px]" />
            </>
          ) : (
            <>
              <span className={`${DISPLAY} inline-flex items-center h-[40px] px-[18px] rounded-full bg-[#F4EEDF] text-[19px] leading-[24px] tracking-[-0.01em]`}>What Is Doe?</span>
              <p className={`${DISPLAY} mt-[16px] max-w-[30ch] text-[22px] leading-[28px] md:text-[26px] md:leading-[32px] tracking-[-0.01em] [text-wrap:balance]`}>
                Hi! I&apos;m a medical student from uOttawa.
              </p>
            </>
          )}
          <p className="mt-[10px] max-w-[58ch] text-[15px] leading-[24px] md:text-[16px] md:leading-[26px] text-[#281910CC] [text-wrap:pretty]">
            {intro ? (
              "My brother and I built Doe for free to help clinics reach more patients/clients as Muse, Instinct and other apps become more available."
            ) : (
              <>
                My brother and I built Doe to prepare Canadian clinics for personal agents. In 2027, patients &amp; clients will be searching for and booking services through Muse, Instinct, Claude Duet
                and GPT Dots. We believe most clinics are not ready.
              </>
            )}
          </p>
          {!intro && <DoeListings className="mt-[18px] mb-[6px] max-w-[520px]" />}
          {!intro && (
            <p className="mt-[12px] max-w-[58ch] text-[15px] leading-[24px] md:text-[16px] md:leading-[26px] text-[#281910CC] [text-wrap:pretty]">
              We&apos;ve made Doe free to use, however some features require expensive compute costs to run so we&apos;ve added a little fee to those interested. You can reach us anytime with any questions
              or help.
            </p>
          )}
          <a
            href="mailto:james@doe.care"
            className="mt-[16px] inline-flex items-center gap-[10px] h-[44px] pl-[14px] pr-[18px] rounded-full bg-[#F4EEDF] text-[14px] font-[600] hover:bg-[#EEE6D6] transition-colors duration-150"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5.5" width="17" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M4.5 8l7.5 5.5L19.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            james@doe.care
          </a>
        </div>
      </div>
    </div>
  );
}

/** Doe's listings as personal agents see them: other clinics live, Ford listed but not active yet. */
function DoeListings({ className = "" }: { className?: string }) {
  /** A clinic already on Doe, drawn as a quiet placeholder: no names. */
  const other = (w1: string, w2: string) => (
    <li className="flex items-center gap-[10px] px-[10px] py-[10px]">
      <span className="shrink-0 w-[30px] h-[30px] rounded-full bg-[#F4EEDF]" />
      <span className="min-w-0 flex-1 flex flex-col gap-[6px]">
        <span className="h-[7px] rounded-full bg-[#2819101F]" style={{ width: w1 }} />
        <span className="h-[6px] rounded-full bg-[#28191012]" style={{ width: w2 }} />
      </span>
      <span className="shrink-0 inline-flex items-center gap-[5px] h-[24px] px-[9px] rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[11px] font-[600]">
        <svg width="10" height="10" viewBox="0 0 24 24" className="block">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Active
      </span>
    </li>
  );
  return (
    <figure className={`rounded-[18px] bg-[#F4EEDF] p-[10px] ${className}`} aria-label={`Doe's listings, seen by personal agents. ${CLINIC.name} is listed but not active yet.`}>
      <div className="flex items-center justify-between gap-[10px] px-[4px] pb-[10px]">
        <span className="inline-flex items-center gap-[8px] whitespace-nowrap text-[13px] font-[600]">
          <IndexConvertSphere size={20} className="shrink-0" />
          Doe listings
        </span>
        <span className={`inline-flex items-center gap-[6px] whitespace-nowrap text-[11.5px] font-[600] ${MUTED}`}>
          Seen by
          <span className="flex gap-[2px]">
            {AGENT_APPS.map((a) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={a.name}
                src={a.icon}
                alt=""
                width={16}
                height={16}
                draggable={false}
                className={`block w-[16px] h-[16px] rounded-[4px] object-cover select-none ${a.light ? "ring-1 ring-[#2819101A]" : ""}`}
              />
            ))}
          </span>
        </span>
      </div>
      <ul className="rounded-[14px] bg-[#FFFCF1]" aria-hidden="true">
        {other("46%", "30%")}
        <li className="flex items-center gap-[8px] sm:gap-[10px] mx-[4px] my-[4px] px-[6px] sm:px-[8px] py-[8px] rounded-[12px] border-[1.5px] border-dashed border-[#28191033]">
          <IndexConvertSphere size={26} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block whitespace-nowrap text-[13px] sm:text-[13.5px] leading-[18px] font-[600]">{CLINIC.name}</span>
            <span className={`block truncate text-[11.5px] leading-[15px] ${SUB}`}>{CLINIC.area}</span>
          </span>
          <span className={`shrink-0 inline-flex items-center gap-[5px] h-[24px] pl-[9px] sm:pl-[4px] pr-[9px] rounded-full bg-[#F4EEDF] text-[11px] font-[600] whitespace-nowrap ${MUTED}`}>
            <span className="relative max-sm:hidden inline-flex items-center w-[20px] h-[14px] rounded-full bg-[#2819101F]">
              <span className="absolute left-[2px] w-[10px] h-[10px] rounded-full bg-[#FFFCF1]" />
            </span>
            Not active
          </span>
        </li>
        {other("54%", "36%")}
      </ul>
      <figcaption className={`px-[4px] pt-[10px] text-[12px] leading-[16px] ${SUB} [text-wrap:balance]`}>
        Agents can see {CLINIC.name}, but can&apos;t book until it&apos;s activated.
      </figcaption>
    </figure>
  );
}

/** The black Activate button, the same in Your View, Agent's View and the status box. */
function ActivateButton({ onClick, buttonRef, className = "" }: { onClick: () => void; buttonRef?: RefObject<HTMLButtonElement>; className?: string }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={`group w-full h-[60px] [@media(max-height:760px)]:h-[52px] flex items-center justify-center gap-[9px] sm:gap-[14px] px-[10px] rounded-[16px] bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[12px] sm:text-[15px] md:text-[16px] font-[700] uppercase tracking-[0.03em] sm:tracking-[0.08em] whitespace-nowrap hover:bg-[color:var(--ic-ink-hover)] transition-colors duration-150 ${className}`}
    >
      <span className="relative inline-flex shrink-0 items-center w-[34px] h-[20px] sm:w-[40px] sm:h-[22px] rounded-full bg-[#FFFCF133]" aria-hidden="true">
        <span className="absolute left-[3px] top-[3px] w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rounded-full bg-[#FFFCF1] transition-transform duration-300 group-hover:translate-x-[14px] sm:group-hover:translate-x-[18px]" />
      </span>
      Activate for Personal Agents
    </button>
  );
}

type ClaimReason = "edit" | "activate";

/** Opens the claim modal. Every switch, edit icon and Activate button on the page calls it. */
const ClaimModalContext = createContext<(reason: ClaimReason) => void>(() => undefined);

/** A switch in the Off position: the page is built but not live. */
function OffSwitch({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const openClaim = useContext(ClaimModalContext);
  const [on, setOn] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const full = size === "lg";
  const w = full ? "100%" : size === "md" ? 64 : 44;
  const h = full ? 64 : size === "md" ? 36 : 26;
  const gap = 4;
  const k = h - gap * 2;
  /** Slides to active, lets that read, then opens the claim; it rests back to off behind the modal. */
  const press = () => {
    if (on) return;
    setOn(true);
    timers.current.push(
      window.setTimeout(() => openClaim("activate"), 380),
      window.setTimeout(() => setOn(false), 1100),
    );
  };
  const text = on ? "ACTIVE" : (label ?? "OFF");
  return (
    <button
      type="button"
      onClick={press}
      aria-label={`${label ?? "Off"}: claim to activate`}
      className={`group relative flex shrink-0 items-center rounded-full border border-solid transition-colors duration-300 ${on ? "bg-[color:var(--ic-ink)] border-[color:var(--ic-ink)]" : "bg-[#2819101F] border-[#28191026] hover:bg-[#28191029]"}`}
      style={{ width: w, height: h }}
    >
      <span
        className={`absolute rounded-full bg-[#FFFCF1] shadow-[0_1px_4px_rgba(40,25,16,0.28)] transition-[left] duration-300 ease-out ${on ? "" : "group-hover:translate-x-[3px]"}`}
        style={{ width: k, height: k, top: gap, left: on ? `calc(100% - ${k + gap}px)` : gap }}
      />
      {size === "lg" ? (
        <span
          className={`absolute inset-y-0 flex items-center justify-center text-[14px] font-[700] tracking-[0.12em] transition-colors duration-300 ${on ? "text-[#FFFCF1]" : "text-[#28191080]"}`}
          style={on ? { left: 0, right: k + gap * 2 } : { left: k + gap * 2, right: 0 }}
        >
          {text}
        </span>
      ) : (
        size === "md" && (
          <span
            className={`absolute font-[700] tracking-[0.1em] transition-colors duration-300 ${on ? "text-[#FFFCF1]" : "text-[#28191080]"}`}
            style={on ? { left: 9, fontSize: 10 } : { right: 9, fontSize: 10 }}
          >
            {text}
          </span>
        )
      )}
    </button>
  );
}

/** The claim modal: it fills the inner shell in beige and leaves Doe's brown frame around it. */
function ClaimModal({
  reason,
  visible,
  claim,
  setEmail,
  onSubmit,
  onClose,
}: {
  reason: ClaimReason;
  visible: boolean;
  claim: Claim;
  setEmail: (email: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 280);
    return () => window.clearTimeout(t);
  }, [visible]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** iPhone: "send to a clinic staff" swaps the claim form for one that hands the claim to someone at the clinic. */
  const [handoff, setHandoff] = useState(false);
  const claimed = claim.claimed;
  /** Opened from an edit icon it says why; from a switch or Activate button it goes straight to the form. */
  const heading = claimed ? "Confirm Your Email" : handoff ? "Send to Clinic Staff" : reason === "edit" ? "To make edits, claim your page!" : "Claim Your Page to Activate";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={heading ?? "Claim your page"}
      className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-[#F4EEDF] pointer-events-auto"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 260ms ease" }}
    >
      <div className={`relative ${HEADER}`}>
        <DoeMark />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#FFFCF1] text-[#281910] hover:bg-[#FAF4E4] transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Centered in the shell: the bottom padding matches the header above, so the middle is the shell's middle. */}
      <div className="mx-auto w-full max-w-[560px] flex-1 px-[16px] pb-[64px] md:pb-[72px] flex flex-col justify-center gap-[14px]">
        {heading && (
          <h2 className={`${DISPLAY} mx-auto max-w-[17ch] pt-[4px] text-center text-[30px] leading-[35px] md:text-[38px] md:leading-[44px] tracking-[-0.02em] [text-wrap:balance]`}>{heading}</h2>
        )}
        <Hero />
        {claimed ? (
          <div className="rounded-[26px] bg-[#FFFCF1] px-[20px] py-[22px] text-center">
            <div className="text-[17px] leading-[24px] font-[600] [text-wrap:balance]">We sent a link to {claimed}.</div>
            <div className={`mt-[4px] text-[14.5px] leading-[21px] ${SUB} [text-wrap:balance]`}>Confirm it to activate your page.</div>
          </div>
        ) : handoff ? (
          <HandoffForm onBack={() => setHandoff(false)} />
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-[8px]">
            <label htmlFor="ic-modal-email" className="sr-only">
              Work email
            </label>
            <input
              ref={input}
              id="ic-modal-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={claim.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[56px] w-full rounded-[20px] bg-[#FFFCF1] px-[18px] text-[16px] leading-[20px] placeholder:text-[#28191059] outline-none border-[1.5px] border-solid border-[#2819101F] focus:border-[color:var(--ic-ink)] transition-colors"
            />
            <button
              type="submit"
              disabled={claim.status === "sending"}
              className="w-full h-[58px] flex items-center justify-center gap-[10px] rounded-[20px] bg-[color:var(--ic-ink)] text-[15px] font-[700] text-[#FFFCF1] hover:bg-[color:var(--ic-ink-hover)] disabled:opacity-70 transition-colors duration-150"
            >
              {claim.status === "sending" ? (
                <>
                  <Spinner size={16} light />
                  Claiming
                </>
              ) : (
                <>
                  <span className="relative inline-flex shrink-0 items-center w-[34px] h-[20px] rounded-full bg-[#FFFCF133]" aria-hidden="true">
                    <span className="absolute left-[3px] top-[3px] w-[14px] h-[14px] rounded-full bg-[#FFFCF1]" />
                  </span>
                  Claim &amp; Activate Your Page
                </>
              )}
            </button>
            {claim.status === "error" && (
              <p role="alert" className="px-[10px] text-[12.5px] leading-[17px] font-[600] text-[#B4532F]">
                {claim.error}
              </p>
            )}
            <button
              type="button"
              onClick={() => setHandoff(true)}
              className="md:hidden whitespace-nowrap underline underline-offset-[3px] mx-auto mt-[8px] px-[12px] py-[6px] text-center text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.1em] text-[#28191099] hover:text-[#281910] transition-colors duration-150"
            >
              Or send to a clinic staff
              <br />
              and complete later
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

type HandoffChannel = "phone" | "email";

/**
 * Hands the claim to someone at the clinic: the sender's email (theirs or the provider's), and the staff member's phone
 * number or email. Saved with the claim and sent to Doe, who gets it to them.
 */
function HandoffForm({ onBack }: { onBack: () => void }) {
  const [from, setFrom] = useState("");
  const [channel, setChannel] = useState<HandoffChannel>("phone");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/indexconvert/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: from, clinic: CLINIC.domain, plan: "handoff", staff: { [channel]: contact } }),
      });
      if (res.ok) return setStatus("sent");
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Something went wrong. Try again.");
    } catch {
      setError("Couldn't reach Doe. Check your connection and try again.");
    }
    setStatus("error");
  };

  if (status === "sent") {
    return (
      <div className="rounded-[26px] bg-[#FFFCF1] px-[20px] py-[22px] text-center">
        <div className="text-[17px] leading-[24px] font-[600] [text-wrap:balance]">Sent. We&apos;ll get it to them.</div>
        <div className={`mt-[4px] text-[14.5px] leading-[21px] ${SUB} [text-wrap:balance]`}>They can claim and activate the page whenever they&apos;re ready.</div>
      </div>
    );
  }

  const field =
    "h-[56px] w-full rounded-[20px] bg-[#FFFCF1] px-[18px] text-[16px] leading-[20px] placeholder:text-[#28191059] outline-none border-[1.5px] border-solid border-[#2819101F] focus:border-[color:var(--ic-ink)] transition-colors";
  return (
    <form onSubmit={send} className="flex flex-col gap-[8px]">
      <label htmlFor="ic-handoff-from" className="sr-only">
        Your email or provider&apos;s email
      </label>
      <input
        ref={input}
        id="ic-handoff-from"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="Your email or provider's email"
        className={field}
      />
      {/* Phone number or staff email: one field, its kind picked above it. */}
      <div className="mt-[6px] grid grid-cols-2 gap-[4px] rounded-[16px] bg-[#EEE6D6] p-[4px]" role="radiogroup" aria-label="Send to clinic staff by">
        {(
          [
            ["phone", "Phone Number"],
            ["email", "Clinic Staff Email"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={channel === key}
            onClick={() => {
              setChannel(key);
              setContact("");
            }}
            className={`h-[38px] rounded-[12px] text-[13px] font-[600] transition-colors duration-150 ${channel === key ? "bg-[#FFFCF1] text-[#281910] shadow-[0_1px_3px_rgba(40,25,16,0.12)]" : "text-[#281910A6]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <label htmlFor="ic-handoff-contact" className="sr-only">
        {channel === "phone" ? "Clinic staff phone number" : "Clinic staff email"}
      </label>
      <input
        key={channel}
        id="ic-handoff-contact"
        type={channel === "phone" ? "tel" : "email"}
        inputMode={channel === "phone" ? "tel" : "email"}
        autoComplete="off"
        required
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder={channel === "phone" ? "Phone number" : "staff@clinic.com"}
        className={field}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full h-[58px] flex items-center justify-center gap-[10px] rounded-[20px] bg-[color:var(--ic-ink)] text-[15px] font-[700] text-[#FFFCF1] hover:bg-[color:var(--ic-ink-hover)] disabled:opacity-70 transition-colors duration-150"
      >
        {status === "sending" ? (
          <>
            <Spinner size={16} light />
            Sending
          </>
        ) : (
          "Send"
        )}
      </button>
      {status === "error" && (
        <p role="alert" className="px-[10px] text-[12.5px] leading-[17px] font-[600] text-[#B4532F]">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onBack}
        className="mx-auto underline underline-offset-[3px] mt-[8px] px-[12px] py-[6px] text-center text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.1em] text-[#28191099] hover:text-[#281910] transition-colors duration-150"
      >
        Or claim it yourself now
      </button>
    </form>
  );
}

/**
 * The page's status, set as type: the whole box reads "not activated". Connections to Doe's MCP, API and the Personal
 * Agent Protocol are made but not live; the four agent files are ready. On iPhone the claim email sits at its foot.
 */
function StatusPanel({ claimed, onClaim, activateRef }: { claimed: string | null; onClaim: () => void; activateRef: RefObject<HTMLButtonElement> }) {
  return (
    // iPhone, before claiming: the switch and the button sit bare under the clinic's box, without the box around them.
    <div className={`rounded-[26px] bg-[#F4EEDF] p-[6px] ${claimed ? "" : "max-md:bg-transparent max-md:p-0"}`}>
      <div className={`rounded-[21px] bg-[#FFFCF1] px-[18px] pt-[18px] pb-[16px] md:px-[24px] md:pt-[22px] md:pb-[20px] ${claimed ? "" : "max-md:p-0"}`}>
        {claimed ? (
          <div className="text-[30px] leading-[34px] md:text-[38px] md:leading-[42px] font-[700] tracking-[0.02em] uppercase">Confirm Your Email</div>
        ) : (
          <OffSwitch size="lg" label="NOT ACTIVE" />
        )}
        {claimed && <p className={`mt-[6px] text-[14.5px] leading-[21px] ${SUB}`}>Link sent to {claimed}.</p>}
        {!claimed && (
          <p className="max-md:hidden mt-[10px] max-w-[46ch] text-[17px] leading-[25px] md:text-[19px] md:leading-[27px] text-[#281910B3] [text-wrap:pretty]">
            Claim this page to activate it and begin securing customers through personal agents.
          </p>
        )}
        {!claimed && (
          <ActivateButton
            buttonRef={activateRef}
            className="mt-[10px] md:mt-[16px]"
            onClick={onClaim}
          />
        )}

        {/* tablet and desktop: settings and files sit inside the status box; iPhone sets them under it. */}
        <SetupFiles className="max-md:hidden mt-[18px]" />
      </div>

    </div>
  );
}

/**
 * Ford's settings and files in one inner sand box, greyed because none of it is live yet. Screens under 760px tall
 * (`[@media(max-height:760px)]`) drop the detail lines and list the files inline, so the first screen still fits.
 */
function SetupFiles({ className = "", phone = false }: { className?: string; phone?: boolean }) {
  const label = "text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em]";
  const [topic, setTopic] = useState<AgentTopicId | null>(null);
  return (
    <div className={`rounded-[18px] bg-[#F4EEDF] px-[14px] pt-[12px] pb-[12px] ${phone ? "pt-[16px]" : ""} ${className}`}>
      {topic && <InfoSheet topic={topic} onClose={() => setTopic(null)} />}
      {/* iPhone: a big title and a line on what these are for, with a small Not Active tag in the corner. */}
      {phone && (
        <div className="pb-[6px]">
          <div className="flex items-start justify-between gap-[10px]">
            <h3 className={`${DISPLAY} whitespace-nowrap text-left text-[24px] leading-[28px] [@media(max-height:760px)]:text-[21px] [@media(max-height:760px)]:leading-[25px] tracking-[-0.02em]`}>Here&apos;s what we<br /> made you.</h3>
            <span className={`shrink-0 mt-[3px] h-[22px] px-[9px] flex items-center rounded-full bg-[#FFFCF1] text-[10.5px] font-[700] uppercase tracking-[0.08em] ${MUTED}`}>Not Active</span>
          </div>
          <p className={`mt-[4px] whitespace-nowrap text-[14px] leading-[19px] ${SUB}`}>
            All of these help personal agents
            <br /> discover and interact with you easier.
          </p>
        </div>
      )}
      <div className="opacity-60">
        {!phone && (
          <div className="flex items-baseline justify-between gap-[10px]">
            <span className={label}>Ford&apos;s Agent Settings</span>
            <span className={`text-[11.5px] font-[600] ${MUTED}`}>Not published</span>
          </div>
        )}
        <div className="mt-[4px] flex flex-col">
          {CONNECTIONS.map((c) => (
            <div key={c.name} className="flex items-start gap-[10px] py-[6px] [@media(max-height:760px)]:py-[3px]">
              <span className="pt-[1px]">
                <Check on size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-[20px] font-[600]">{c.name}</span>
                <span className={`block text-[12.5px] leading-[17px] ${SUB} truncate [@media(max-height:760px)]:hidden`}>{c.detail}</span>
              </span>
              <InfoButton label={AGENT_TOPICS[c.topic].question} onClick={() => setTopic(c.topic)} className="mt-[-1px] [@media(max-height:760px)]:mt-[-2px]" />
            </div>
          ))}
        </div>

        {!phone && <div className={`mt-[8px] ${label}`}>Ford&apos;s Agent Files</div>}
        <div className="mt-[8px] grid grid-cols-2 gap-[6px] [@media(max-height:760px)]:hidden">
          {AGENT_FILES.map((f) => (
            <div key={f.path} className="flex items-center gap-[7px] h-[32px] px-[9px] rounded-[10px] bg-[#FFFCF1]">
              <Check on size={14} />
              <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] leading-[15px]">{f.path.replace("/.well-known", "")}</span>
              <InfoButton label={AGENT_TOPICS[FILE_TOPIC[f.path]].question} onClick={() => setTopic(FILE_TOPIC[f.path])} size={20} />
            </div>
          ))}
        </div>
        {/* Short screens: the files on one line, so the switch and the button still fit on the first screen. */}
        <div className="hidden [@media(max-height:760px)]:flex mt-[4px] flex-wrap items-center gap-x-[8px] gap-y-[4px] font-mono text-[11.5px] leading-[17px]">
          {AGENT_FILES.map((f) => (
            <span key={f.path} className="inline-flex items-center gap-[4px]">
              {f.path.replace("/.well-known", "")}
              <InfoButton label={AGENT_TOPICS[FILE_TOPIC[f.path]].question} onClick={() => setTopic(FILE_TOPIC[f.path])} size={16} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The claim's email field and button, shared by the status box (iPhone) and the claim box (desktop). */
function ClaimForm({
  claim,
  setEmail,
  emailRef,
  onSubmit,
  agent = false,
}: {
  claim: Claim;
  setEmail: (email: string) => void;
  emailRef: RefObject<HTMLInputElement>;
  onSubmit: (e: FormEvent) => void;
  agent?: boolean;
}) {
  return (
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
          className={`h-[52px] w-full rounded-[18px] bg-[#FFFCF1] px-[16px] text-[16px] leading-[20px] placeholder:text-[#28191059] outline-none border-[1.5px] border-solid border-[#2819101F] focus:border-[color:var(--ic-ink)] transition-colors ${agent ? "pl-[66px] text-[14px]" : ""}`}
        />
      </div>
      <button
        type="submit"
        disabled={claim.status === "sending"}
        className="w-full h-[52px] flex items-center justify-center gap-[10px] rounded-[18px] bg-[color:var(--ic-ink)] text-[15px] font-[600] text-[#FFFCF1] disabled:opacity-70 transition-opacity"
      >
        {claim.status === "sending" ? (
          <>
            <Spinner size={16} light />
            Claiming
          </>
        ) : (
          "Claim free & activate"
        )}
      </button>
      {claim.status === "error" && (
        <p role="alert" className="px-[10px] text-[12.5px] leading-[17px] font-[600] text-[#B4532F]">
          {claim.error}
        </p>
      )}
    </form>
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
          status: claimed ? "claimed_pending_verification" : "ready",
          published: false,
          connected: { doe_mcp: true, doe_api: true, pap: "applied" },
          files: AGENT_FILES.map((f) => f.path),
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


/* ------------------------------------------------------------------ Agent's View: why */

/** A dark code card, in the page's ink, with a file name over it. */
function CodeCard({ name, children, className = "" }: { name: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-[color:var(--ic-ink)] text-[#FFFCF1] overflow-hidden font-mono ${className}`}>
      <div className="flex items-center gap-[6px] h-[34px] px-[14px] border-b border-solid border-[#FFFCF114] text-[11.5px] text-[#FFFCF180]">
        <span className="w-[7px] h-[7px] rounded-full bg-[#FFFCF133]" aria-hidden="true" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#FFFCF133]" aria-hidden="true" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#FFFCF133]" aria-hidden="true" />
        <span className="ml-[6px] truncate">{name}</span>
      </div>
      <pre className="p-[14px] text-[11.5px] leading-[19px] whitespace-pre overflow-x-auto ic-noscroll">{children}</pre>
    </div>
  );
}

/** Code with comments dimmed and the first word of a line tinted. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const comment = line.trimStart().startsWith("#") || line.trimStart().startsWith("//");
        const [head, ...rest] = line.split(/(?<=^\S+)/);
        return (
          <span key={i} className="block">
            {comment ? (
              <span className="text-[#FFFCF166]">{line}</span>
            ) : (
              <>
                <span className="text-[#FCCFB8]">{head}</span>
                {rest.join("")}
              </>
            )}
            {line === "" ? " " : null}
          </span>
        );
      })}
    </>
  );
}

/** Sand shell, cream inside: the page's box. */
function Box({ children, className = "", innerClassName = "" }: { children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <div className={`rounded-[26px] bg-[#F4EEDF] p-[6px] ${className}`}>
      <div className={`rounded-[21px] bg-[#FFFCF1] ${innerClassName}`}>{children}</div>
    </div>
  );
}

/** First box in Agent's View: a person sees a page, an agent reads data. */
function AgentsDifferent() {
  return (
    <Box innerClassName="p-[10px] md:p-[12px]">
      <div className="grid grid-cols-2 gap-[8px] rounded-[16px] bg-[#F4EEDF] p-[10px] md:p-[14px]">
        {/* A person: a busy web page, a pop-up over it. */}
        <figure className="flex flex-col items-center">
          <div className="relative w-full h-[118px] rounded-[12px] bg-[#FFFCF1] overflow-hidden shadow-[0_0_0_1px_rgba(40,25,16,0.06)]" aria-hidden="true">
            <div className="flex items-center gap-[4px] h-[18px] px-[8px] border-b border-solid border-[#2819100F]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#28191026]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#28191026]" />
              <span className="ml-[4px] h-[6px] flex-1 rounded-full bg-[#2819100F]" />
            </div>
            <div className="p-[8px] flex flex-col gap-[5px]">
              <div className="flex gap-[4px]">
                {[0, 1, 2, 3].map((i) => <span key={i} className="h-[5px] w-[18%] rounded-full bg-[#28191018]" />)}
              </div>
              <div className="h-[34px] rounded-[6px] bg-[#E9DCC6]" />
              <span className="h-[5px] w-[80%] rounded-full bg-[#28191014]" />
              <span className="h-[5px] w-[60%] rounded-full bg-[#28191014]" />
            </div>
            <div className="absolute right-[8px] bottom-[8px] w-[46%] rounded-[8px] bg-[#FFFCF1] p-[6px] shadow-[0_4px_14px_rgba(40,25,16,0.16)]">
              <span className="block h-[4px] w-[80%] rounded-full bg-[#28191026]" />
              <span className="mt-[4px] block h-[10px] w-[60%] rounded-full bg-[color:var(--ic-ink)]" />
            </div>
          </div>
          <figcaption className={`mt-[8px] text-[11.5px] leading-[14px] font-[600] ${MUTED}`}>People browse pages</figcaption>
        </figure>
        {/* An agent: a request and a clean answer. */}
        <figure className="flex flex-col items-center">
          <div className="w-full h-[118px] rounded-[12px] bg-[color:var(--ic-ink)] p-[10px] font-mono text-[10px] leading-[15px] text-[#FFFCF1CC] overflow-hidden" aria-hidden="true">
            <div><span className="text-[#FCCFB8]">GET</span> /prices</div>
            <div className="text-[#FFFCF166]">200 · json</div>
            <div className="mt-[4px]">{"{"}</div>
            <div className="pl-[10px]"><span className="text-[#FFFCF180]">&quot;HALO&quot;:</span> <span className="text-[#FCCFB8]">1500</span>,</div>
            <div className="pl-[10px]"><span className="text-[#FFFCF180]">&quot;consult&quot;:</span> <span className="text-[#FCCFB8]">300</span></div>
            <div>{"}"}</div>
          </div>
          <figcaption className={`mt-[8px] text-[11.5px] leading-[14px] font-[600] ${MUTED}`}>Agents read data</figcaption>
        </figure>
      </div>
      <div className="px-[8px] pt-[18px] pb-[10px] md:px-[12px]">
        <h2 className={`${DISPLAY} text-[28px] leading-[32px] md:text-[34px] md:leading-[38px] tracking-[-0.02em] [text-wrap:balance]`}>
          Agents use the internet differently.
        </h2>
        <p className={`mt-[8px] max-w-[46ch] text-[15px] leading-[23px] ${SUB} [text-wrap:balance]`}>
          People scroll, tap menus and look at photos. Agents skip all of that: they read files, call tools and want a clear answer fast.
        </p>
      </div>
    </Box>
  );
}

const STUDIED: { title: string; body: string; file: string; code: string }[] = [
  {
    title: "We guide agents where to go.",
    body: "Signposts on your site point every agent straight to your prices, providers and hours, instead of leaving it to guess.",
    file: "robots.txt · llms.txt",
    code: `# Agents: start here
User-agent: *
Allow: /

LLMs   /llms.txt
MCP    /.well-known/mcp.json
API    /openapi.json`,
  },
  {
    title: "We give agents different ways to find and connect with you.",
    body: "Some agents call tools, some call an API, some just read the page. Your clinic is ready for each one.",
    file: "connections",
    code: `MCP      ${CLINIC_TOOLS.length} tools · prices, consults
API      GET /providers · /prices
JSON-LD  schema.org/MedicalClinic
PAP      patient consent, per user`,
  },
];

/** What Doe learned helps agents, row by row: code on one side, the big line on the other, alternating on wide screens. */
function AgentsStudied() {
  return (
    <section className="flex flex-col gap-[14px] pt-[10px]">
      <h2 className={`${DISPLAY} px-[4px] text-[28px] leading-[32px] md:text-[38px] md:leading-[44px] tracking-[-0.02em] [text-wrap:balance]`}>
        We studied what helps businesses be more easily interacted with.
      </h2>
      <Box innerClassName="flex flex-col divide-y divide-[#28191014]">
        {STUDIED.map((r, i) => (
          <div key={r.title} className="grid gap-[16px] p-[14px] md:grid-cols-2 md:items-center md:gap-[24px] md:p-[18px]">
            <CodeCard name={r.file} className={i % 2 ? "md:order-2" : ""}>
              <Lines text={r.code} />
            </CodeCard>
            <div className="px-[4px]">
              <h3 className={`${DISPLAY} text-[26px] leading-[30px] md:text-[30px] md:leading-[35px] tracking-[-0.02em] [text-wrap:balance]`}>{r.title}</h3>
              <p className={`mt-[8px] text-[15px] leading-[23px] ${SUB} [text-wrap:balance]`}>{r.body}</p>
            </div>
          </div>
        ))}
      </Box>
    </section>
  );
}

/** Doe built into a personal agent: the agent searches Doe and answers with Ford. */
function AgentsPartners() {
  return (
    <Box innerClassName="p-[10px] md:p-[12px]">
      <div className="rounded-[16px] bg-[#F4EEDF] px-[12px] py-[16px] md:px-[20px] md:py-[20px] flex justify-center">
        <div className="w-full max-w-[360px] rounded-[18px] bg-[#FFFCF1] p-[12px] shadow-[0_8px_24px_rgba(40,25,16,0.08)]" aria-label="Example: a personal agent searching Doe">
          <div className="flex items-center gap-[8px] pb-[10px] border-b border-solid border-[#2819100F]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MUSE.icon} alt="" width={24} height={24} draggable={false} className="block w-[24px] h-[24px] rounded-[7px] object-cover ring-1 ring-[#2819101A]" />
            <span className="text-[13px] font-[600]">{MUSE.name}</span>
          </div>
          <div className="mt-[10px] ml-auto w-fit max-w-[85%] rounded-[16px] rounded-br-[6px] bg-[color:var(--ic-ink)] px-[12px] py-[7px] text-[13px] leading-[18px] text-[#FFFCF1]">
            Find a facelift surgeon in Toronto
          </div>
          <div className="mt-[10px] inline-flex items-center gap-[8px] h-[30px] pl-[4px] pr-[12px] rounded-full bg-[#F4EEDF] text-[12px] font-[600]">
            <IndexConvertSphere size={22} className="shrink-0" />
            Searched Doe
            <span className={`font-[500] ${MUTED}`}>· healthcare clinics</span>
          </div>
          <div className="mt-[8px] flex items-center gap-[10px] rounded-[14px] p-[10px] shadow-[0_0_0_1px_rgba(40,25,16,0.08)]">
            <IndexConvertSphere size={34} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] leading-[18px] font-[600] truncate">{CLINIC.name}</div>
              <div className={`text-[12px] leading-[16px] ${SUB} truncate`}>Deep plane facelift · from $22,500</div>
            </div>
            <span className="shrink-0 h-[28px] px-[10px] flex items-center rounded-full bg-[color:var(--ic-ink)] text-[#FFFCF1] text-[11.5px] font-[600]">Book</span>
          </div>
        </div>
      </div>
      <div className="px-[8px] pt-[18px] pb-[10px] md:px-[12px]">
        <h2 className={`${DISPLAY} text-[26px] leading-[31px] md:text-[32px] md:leading-[38px] tracking-[-0.02em] [text-wrap:balance]`}>
          We&apos;re partnering with dozens of agents to integrate Doe as the default way to search for healthcare clinics.
        </h2>
        <AgentIconsRow className="mt-[16px] !justify-start" ring="#FFFCF1" />
      </div>
    </Box>
  );
}

/* ------------------------------------------------------------------ Claim */

const CONNECT_TABS = ["MCP", "API", "PAP"] as const;

/** What an agent runs to reach Ford through Doe's MCP and API, and to open a Personal Agent Protocol session for its user. */
const CONNECT_CODE: Record<(typeof CONNECT_TABS)[number], string> = {
  MCP: JSON.stringify(
    {
      mcpServers: {
        [SLUG]: { type: "http", url: MCP_URL },
      },
    },
    null,
    2,
  ) + `\n\n// tools: ${CLINIC_TOOLS.map((t) => t.name).join(", ")}`,
  API: `curl ${API_ORIGIN}${BASE} \\
  -H 'Authorization: Bearer $DOE_AGENT_KEY'

curl -X POST ${API_ORIGIN}${BASE}/consultations \\
  -H 'Authorization: Bearer $DOE_AGENT_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"service":"deep-plane-facelift","provider":"derek-ford"}'`,
  PAP: `curl -X POST ${API_ORIGIN}${BASE}/pap/sessions \\
  -H 'Authorization: Bearer $DOE_AGENT_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "clinic": "${SLUG}",
    "agent": { "name": "my-agent", "disclosed": true },
    "consent": { "granted": true, "scope": ["read", "consult_request"] }
  }'`,
};

/** Agent's View claim box: the code for an agent to connect to Ford's page on Doe's MCP and API and open a PAP session, all three stacked. */
function ConnectBox() {
  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="rounded-[20px] bg-[#FFFCF1] p-[16px]">
        <div className="flex items-start justify-between gap-[12px]">
          <div className={`${DISPLAY} text-[21px] leading-[25px] tracking-[-0.01em] [text-wrap:balance]`}>Connections Are Ready, Not Yet Active</div>
          <span className="mt-[1px]">
            <OffSwitch />
          </span>
        </div>
        <div className="mt-[14px] flex flex-col gap-[8px]">
          {CONNECT_TABS.map((t) => (
            <div key={t} className="rounded-[16px] bg-[color:var(--ic-ink)] text-[#FFFCF1] overflow-hidden">
              <div className="flex items-center h-[34px] px-[14px] border-b border-solid border-[#FFFCF114] font-mono text-[11.5px] text-[#FFFCF180]">
                {t === "MCP" ? "mcp.json" : t === "API" ? "api" : "pap/sessions"}
              </div>
              <pre className="p-[14px] font-mono text-[11.5px] leading-[18px] whitespace-pre-wrap [overflow-wrap:anywhere]">{CONNECT_CODE[t]}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
        ["Page built", true],
        [claimed ? `Confirm the link sent to ${claimed}` : "Confirm you work at the clinic", false],
        ["Activate for Personal Agents", false],
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
            <div className={`${DISPLAY} mt-[2px] text-[21px] leading-[25px] tracking-[-0.01em]`}>{claimed ? "Claimed" : "Activate for Personal Agents"}</div>
            <div className="mt-[14px] flex flex-col gap-[6px] text-[13.5px] leading-[18px]">
              <div className="flex items-center justify-between gap-[10px]">
                <span className="text-[#281910B3]">Personal Agents</span>
                <span className="flex items-center gap-[8px] font-[600]">
                  Off
                  <OffSwitch size="sm" />
                </span>
              </div>
              <Row k="Claiming" v="Free" />
              <Row k="Settings" v="Ready" />
              <Row k="Files" v="Not published" />
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
                className={`flex flex-col gap-[6px] p-[14px] rounded-[20px] text-left transition-colors duration-150 disabled:cursor-default ${chosen ? "bg-[color:var(--ic-ink)] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#FBF7EA]"} ${claim.plan && !chosen ? "opacity-50" : ""}`}
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
        <ClaimForm claim={claim} setEmail={setEmail} emailRef={emailRef} onSubmit={onSubmit} agent={agent} />
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

/** A titled section: its content in an outer sand box with cream boxes inside, as on /demo. `bare` is for content that brings its own box. */
function Section({ id, title, meta, agent, bare, action, children }: { id: string; title: string; meta?: string; agent?: boolean; bare?: boolean; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[136px] md:scroll-mt-[88px]">
      <div className="mb-[12px] flex items-center justify-between gap-[12px]">
        {action && <span className="order-2 shrink-0">{action}</span>}
        {meta && <span className={`order-2 shrink-0 text-[12px] leading-[16px] font-[600] ${MUTED} ${agent ? "font-mono font-[500]" : ""}`}>{meta}</span>}
        <h2
          className={
            agent ? "font-mono text-[16px] leading-[22px] md:text-[18px] md:leading-[24px] font-[600]" : `${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em]`
          }
        >
          {title}
        </h2>
      </div>
      {bare ? children : <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">{children}</div>}
    </section>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 h-[34px] px-[14px] rounded-[999px] text-[13px] font-[600] whitespace-nowrap transition-colors duration-150 ${on ? "bg-[color:var(--ic-ink)] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-[#FAF4E4]"}`}
    >
      {children}
    </button>
  );
}

const BOX = "rounded-[18px] bg-[#FFFCF1] p-[14px]";

/** A round pencil button; editing starts once the page is claimed, so it leads to the claim box. */
function EditButton({ onClick, label, className = "" }: { onClick: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title="Edit"
      className={`shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#F4EEDF] text-[#281910B3] hover:bg-[#EEE6D6] hover:text-[#281910] transition-colors duration-150 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z M14.5 7.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
/** Provider disc colours, from /doehealthproduct's Index palette. */
const AVATAR_DOTS = ["#E07B53", "#6E9A5B", "#B98A55", "#6F8FA3", "#C2A987", "#E8A585"];
const OFFER_TAGS = ["Credit", "Package", "Included", "Financing"];

function YourSections({ claimed, onEdit }: { claimed: boolean; onEdit: () => void }) {
  return (
    <>
      <div className="flex flex-col gap-[22px] pt-[14px] md:pt-[22px]">
        <div className="h-px bg-[#2819101F]" />
        <div id="included" className="flex flex-col items-start gap-[14px]">
          <h2 className={`${DISPLAY} whitespace-nowrap px-[4px] text-left text-[clamp(22px,7.4vw,52px)] leading-[1.12] tracking-[-0.02em]`}>
            Here&apos;s the information
            <br />
            we made visible to
            <br />
            personal agents.
          </h2>
          <span className="ml-[4px] inline-flex items-center gap-[8px] h-[34px] pl-[12px] pr-[16px] rounded-full bg-[#F4EEDF] text-[13px] font-[600] text-[#281910CC]">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z M14.5 7.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Feel Free to Edit!
          </span>
        </div>
      </div>

      <Section id="providers" title="Providers">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          {PROVIDERS.map((p, i) => (
            <div key={p.name} className={`${BOX} relative flex items-start gap-[14px]`}>
              <EditButton onClick={onEdit} label={`Edit ${p.name}`} className="absolute top-[10px] right-[10px]" />
              <HalftoneDisc size={68} step={7.4} maxDot={3.2} color={AVATAR_DOTS[i % AVATAR_DOTS.length]} className="shrink-0" />
              <div className="min-w-0 pr-[34px]">
                <div className="text-[15px] leading-[20px] font-[600]">{p.name}</div>
                <div className={`mt-[1px] text-[12.5px] leading-[17px] ${MUTED}`}>{p.role}</div>
                <div className="mt-[8px] text-[13px] leading-[18px] text-[#281910CC]">{p.fact}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="locations" title="Locations & Hours" action={<EditButton onClick={onEdit} label="Edit locations" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px] items-start">
          {LOCATIONS.map((loc, i) => (
            <div key={loc.name} className={BOX}>
              <div className="flex items-center gap-[12px]">
                <LocationMap variant={i} />
                <div className="min-w-0">
                  <div className="text-[15px] leading-[20px] font-[600]">{loc.name}</div>
                  <div className={`mt-[2px] text-[12.5px] leading-[17px] ${MUTED}`}>{loc.detail}</div>
                  <div className="mt-[6px] text-[13.5px] leading-[19px]">
                    {loc.address}
                    <br />
                    {loc.city}
                  </div>
                </div>
              </div>
              <div className="mt-[12px] rounded-[14px] bg-[#F4EEDF] px-[12px] pt-[8px] pb-[6px]">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] leading-[14px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Hours</span>
                  <EditButton onClick={onEdit} label={`Edit hours for ${loc.name}`} className="!bg-[#FFFCF1]" />
                </div>
                {[
                  ["Monday – Friday", "8:30 a.m. – 4:30 p.m."],
                  ["Saturday – Sunday", "Not listed"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-[12px] py-[7px]">
                    <span className="shrink-0 text-[13px] text-[#281910B3]">{k}</span>
                    <span className={`text-right text-[13px] font-[600] ${v === "Not listed" ? MUTED : ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[6px] rounded-[18px] bg-[#FFFCF1] px-[16px] py-[8px]">
          {[
            ["Phone", CLINIC.phone],
            ["Toll-free", CLINIC.tollFree],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-[16px] py-[8px]">
              <span className="shrink-0 text-[13.5px] text-[#281910B3]">{k}</span>
              <span className="text-right text-[13.5px] font-[600]">{v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="services"
        title="Services & Pricing"
        action={
          <button
            type="button"
            onClick={onEdit}
            className="h-[32px] pl-[10px] pr-[14px] flex items-center gap-[6px] rounded-full bg-[#F4EEDF] text-[13px] font-[600] hover:bg-[#EEE6D6] transition-colors duration-150"
          >
            <span className="text-[16px] leading-[16px] font-[500]">+</span>
            Service
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6px] items-start">
          {SERVICES.map((g) => {
            const { priced, unpriced } = splitGroup(g.group);
            return (
              <div key={g.group} className="rounded-[18px] bg-[#FFFCF1] p-[16px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <div className="flex items-baseline gap-[8px]">
                    <span className={`${DISPLAY} text-[20px] leading-[24px] tracking-[-0.01em]`}>{g.group}</span>
                    <span className={`text-[12.5px] font-[600] ${MUTED}`}>{g.items.length}</span>
                  </div>
                  <EditButton onClick={onEdit} label={`Edit ${g.group} services`} />
                </div>
                <div className="mt-[8px] flex flex-col">
                  {priced.map((x) => (
                    <div key={x.name} className="flex items-baseline justify-between gap-[14px] py-[7px]">
                      <span className="text-[13.5px] leading-[18px] text-[#281910CC]">{x.name}</span>
                      <span className="shrink-0 text-[13.5px] font-[700] tabular-nums">{x.price}</span>
                    </div>
                  ))}
                </div>
                {unpriced.length > 0 && (
                  <div className="mt-[12px]">
                    <div className={`text-[11px] leading-[14px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>No Price Listed</div>
                    <div className="mt-[8px] flex flex-wrap gap-[5px]">
                      {unpriced.map((item) => (
                        <span key={item} className="h-[28px] px-[11px] flex items-center rounded-full bg-[#F4EEDF] text-[12.5px] font-[500]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>


      <Section id="offers" title="Offers & Financing" action={<EditButton onClick={onEdit} label="Edit offers" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
          {OFFERS.map((o, i) => (
            <div key={o.title} className={`${BOX} relative flex flex-col gap-[6px]`}>
              <EditButton onClick={onEdit} label={`Edit ${o.title}`} className="absolute top-[10px] right-[10px]" />
              <span className="self-start h-[20px] px-[8px] flex items-center rounded-full bg-[#F4EEDF] text-[10.5px] font-[700] text-[#281910B3]">{OFFER_TAGS[i]}</span>
              <span className="pr-[40px] text-[15px] leading-[20px] font-[600]">{o.title}</span>
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
          <div className="rounded-[18px] bg-[color:var(--ic-ink)] text-[#FFFCF1] p-[14px]">
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


    </>
  );
}


/* ------------------------------------------------------------------ Agent's View */

/** A dark response block: method and path on top, highlighted JSON below. A tall block doesn't scroll; what spills past the bottom edge fades out. */
function Endpoint({ method, path, status, maxHeight, children }: { method: string; path: string; status: string; maxHeight?: number; children: ReactNode }) {
  const body = useRef<HTMLPreElement>(null);
  const [spills, setSpills] = useState(false);
  useEffect(() => {
    const el = body.current;
    if (!el || !maxHeight) return;
    const check = () => setSpills(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxHeight]);
  const fade = spills ? "linear-gradient(to bottom, #000 calc(100% - 72px), transparent 100%)" : undefined;
  return (
    <div className="rounded-[22px] bg-[color:var(--ic-ink)] text-[#FFFCF1] overflow-hidden font-mono">
      <div className="flex items-center gap-[10px] h-[44px] px-[16px] border-b border-solid border-[#FFFCF114] text-[12px]">
        <span className="shrink-0 font-[600] text-[#FCCFB8]">{method}</span>
        <span className="min-w-0 truncate text-[#FFFCF1CC]">{path}</span>
        <span className="ml-auto shrink-0 text-[#FFFCF180]">{status}</span>
      </div>
      <pre
        ref={body}
        className="overflow-hidden p-[16px] text-[12px] leading-[19px] whitespace-pre-wrap break-words"
        style={{ ...(maxHeight ? { maxHeight } : {}), ...(fade ? { WebkitMaskImage: fade, maskImage: fade } : {}) }}
      >
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
      <div className="flex flex-col gap-[22px] pt-[14px] md:pt-[22px]">
        <div className="h-px bg-[#2819101F]" />
        <h2 className={`${DISPLAY} whitespace-nowrap px-[4px] text-left text-[clamp(22px,7.4vw,52px)] leading-[1.12] tracking-[-0.02em]`}>
          You edit your info,
          <br />
          we keep agents updated.
        </h2>
      </div>
      {block("providers", "providers", `${PROVIDERS.length} items`, AGENT.providers, 460)}
      {block("locations", "locations", `${LOCATIONS.length} items`, AGENT.locations, 460)}
      {block("services", "services", `${SERVICE_COUNT} items · CAD`, AGENT.services, 460)}
      {block("offers", "offers", `${OFFERS.length} items`, AGENT.offers)}
      {block("booking", "booking", "agent_booking: off", AGENT.booking)}
    </>
  );
}
