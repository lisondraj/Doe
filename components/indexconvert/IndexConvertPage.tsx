"use client";

/**
 * /indexconvert — shows a clinic its own website being turned into an agent-readable Doe page, then the page itself,
 * built but inactive, with one email field to claim it. Styled from /doehealthproduct (paper shell, sand chips,
 * P22 Mackinac display type); laid out for iPhone first, two columns on desktop.
 */
import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import "@/lib/indexconvert/indexconvert.css";
import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { IndexConvertSphere } from "@/components/indexconvert/IndexConvertSphere";
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

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',Georgia,serif] font-[500]";
const CHIP = "inline-flex items-center h-[28px] shrink-0 px-[11px] rounded-[999px] text-[13px] leading-[16px] font-[500] text-walnut";
const CARD = "rounded-[24px] [background-color:#FFFCF1F2] border border-solid border-[#2819101F] backdrop-blur-[10px]";

/** The loader's steps, in order, with how long each runs. */
const STEPS: { title: string; detail: string; ms: number; warn?: boolean; bar?: boolean }[] = [
  { title: "Finding your page", detail: `${CLINIC.domain} · ${SOURCE_PAGES.length} pages`, ms: 1500 },
  { title: "Checking what personal agents can see", detail: "No agent-readable page found yet", ms: 1700, warn: true },
  { title: "Structuring as JSON, metadata & HTML", detail: `${FIELD_COUNT} fields · ${SERVICE_COUNT} services · ${PRICE_COUNT} prices`, ms: 2300 },
  { title: "Publishing to Model Context Protocol", detail: "MCP server · 5 tools for agents", ms: 1700 },
  { title: "Connecting to Doe's API", detail: "Locations, hours, providers and prices", ms: 1500 },
  { title: "Building your agent-readable page", detail: "Built", ms: 2600, bar: true },
];
const STEP_STARTS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((n, s) => n + s.ms, 0));
const BUILD_MS = STEPS.reduce((n, s) => n + s.ms, 0);
/** How long "visible within Muse" holds before the page opens. */
const MUSE_MS = 1600;
const TOTAL_MS = BUILD_MS + MUSE_MS;
/** Each source page gets an equal slice of the build. */
const SLOT_MS = BUILD_MS / SOURCE_PAGES.length;
const LOADER_FADE_MS = 600;
/** The page starts rising as the loader is most of the way out. */
const REVEAL_MS = 380;

/** What the loader lifts off each page as the scan line passes, keyed by screenshot. */
const PAGE_READS: Record<string, [string, string][]> = {
  home: [["name", "Ford Plastic Surgery"], ["specialty", "Facial plastic surgery"], ["area", "Bloor-Yorkville, Toronto"]],
  pricing: [["price", "Deep Plane Facelift · $22,500"], ["price", "Rhinoplasty · $17,100"], ["consult", "$300 + HST, credited"]],
  medspa: [["price", "BOTOX · $13/unit"], ["service", "Morpheus8 · $950"], ["service", "HALO · $1,500"]],
  staff: [["provider", "Isabel Middleman, PA-C"], ["provider", "Caroline Watson"], ["role", "Injectables · PA-C"]],
  locations: [["location", "7 St Thomas St, Suite 410"], ["location", "St. Thomas Surgical Centre"], ["privileges", "Lakeridge Health"]],
  facelift: [["provider", "Dr. Derek Ford"], ["provider", "Dr. Steven Hanna"], ["service", "Endoscopic mid facelift"]],
  contact: [["hours", "Mon–Fri 8:30–4:30"], ["phone", CLINIC.phone], ["booking", "Consult request form"]],
};
const READ_SPOTS = [
  { top: "18%", side: "left" },
  { top: "44%", side: "right" },
  { top: "70%", side: "left" },
] as const;

/** Disc colours for provider avatars, from the Index palette. */
const AVATAR_DOTS = ["#E07B53", "#6E9A5B", "#B98A55", "#6F8FA3", "#C2A987", "#E8A585"];

const MCP_TOOLS = ["search_services", "get_prices", "list_providers", "get_hours", "request_consultation"];

/** What agents would read once the page is live: a schema.org excerpt of the parse. */
const AGENT_JSON = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC.name,
    url: `https://${CLINIC.url}`,
    telephone: "+1-416-925-7337",
    address: { streetAddress: "7 St Thomas St, Suite 410", addressLocality: "Toronto", addressRegion: "ON", postalCode: "M5S 2B7", addressCountry: "CA" },
    openingHours: ["Mo-Fr 08:30-16:30"],
    medicalSpecialty: "PlasticSurgery",
    employee: PROVIDERS.slice(0, 2).map((p) => ({ "@type": "Physician", name: p.name, jobTitle: p.role })),
    makesOffer: PRICES[0]!.items.slice(0, 3).map((p) => ({
      "@type": "Offer",
      itemOffered: p.name,
      price: p.price.replace(/[^\d]/g, ""),
      priceCurrency: "CAD",
    })),
    "doe:status": "inactive_unclaimed",
  },
  null,
  2,
);

type Phase = "loading" | "leaving" | "done";

export function IndexConvertPage() {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [viewport, setViewport] = useState({ w: 390, h: 844 });

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

  const skip = () => {
    setElapsed(TOTAL_MS);
    setPhase("leaving");
  };

  return (
    <div className="doehealth-product-page indexconvert-page fixed inset-0 overflow-hidden [background-color:#FFFCF1] [color:#281910] antialiased">
      {phase !== "loading" && <AgentPage />}
      {phase !== "done" && (
        <div
          className="absolute inset-0 z-40 [background-color:#FFFCF1]"
          style={{ opacity: phase === "leaving" ? 0 : 1, transition: `opacity ${LOADER_FADE_MS}ms ease`, pointerEvents: phase === "leaving" ? "none" : "auto" }}
        >
          <Loader elapsed={elapsed} viewport={viewport} onSkip={skip} />
        </div>
      )}
    </div>
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
  /** Short iPhone screens drop the sphere size and show one step's detail at a time. */
  const compact = viewport.h < 780;
  const sphere = desktop ? (viewport.h < 860 ? 170 : 220) : viewport.h < 700 ? 110 : compact ? 136 : 176;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ParsingBackdrop pageIndex={pageIndex} />
      {/* Paper glow behind the column so the text stays readable over the page being read. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: desktop
            ? "radial-gradient(ellipse 25% 50% at 50% 54%, rgba(255,252,241,0.96) 0%, rgba(255,252,241,0.82) 55%, rgba(255,252,241,0) 100%)"
            : "radial-gradient(ellipse 72% 50% at 50% 56%, rgba(255,252,241,0.95) 0%, rgba(255,252,241,0.78) 58%, rgba(255,252,241,0) 100%)",
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-[20px] py-[20px]">
        <IndexConvertSphere size={sphere} speed={built ? 2.4 : 1} />
        <div className="mt-[14px] flex items-center gap-[8px] text-[12px] leading-[16px] uppercase tracking-[0.16em] font-[500] text-sub">
          {built ? "Ready" : "Loading"}
        </div>
        <h1 className={`${DISPLAY} mt-[6px] text-center text-[32px] leading-[36px] md:text-[46px] md:leading-[50px] tracking-[-0.02em] text-walnut`}>
          {CLINIC.name}
        </h1>

        {/* The clinic's URL in a fill box, filling as the build runs, with the page being read after the domain. */}
        <div className="mt-[16px] w-full max-w-[420px]">
          <div className="relative h-[48px] rounded-[16px] bg-sand overflow-hidden border border-solid border-[#2819100F]">
            <div className="absolute inset-y-0 left-0 overflow-hidden [background-color:#FCCFB8]" style={{ width: `${progress * 100}%` }}>
              {!built && (
                <div
                  className="ic-sheen absolute inset-y-0 left-0 w-[40%]"
                  style={{ background: "linear-gradient(90deg, rgba(255,252,241,0), rgba(255,252,241,0.65), rgba(255,252,241,0))" }}
                />
              )}
            </div>
            <div className="relative h-full flex items-center gap-[10px] px-[14px]">
              {built ? <DoneIcon /> : <Spinner />}
              <span className="min-w-[0px] truncate text-[15px] leading-[20px] font-[500] text-walnut">
                {CLINIC.url}
                {!built && page.path !== "/" && <span className="text-sub">{page.path}</span>}
              </span>
              <span className="ml-auto shrink-0 tabular-nums text-[13px] leading-[16px] font-[500] text-sub">{Math.round(progress * 100)}%</span>
            </div>
          </div>
          {!compact && (
            <div className="mt-[8px] text-center text-[12px] leading-[16px] text-sub">
              {built ? `${SOURCE_PAGES.length} of ${SOURCE_PAGES.length} pages read` : `Reading page ${pageIndex + 1} of ${SOURCE_PAGES.length} · ${page.label}`}
            </div>
          )}
        </div>

        <ol className={`mt-[14px] w-full max-w-[420px] flex flex-col p-[6px] md:p-[8px] ${CARD}`}>
          {STEPS.map((step, i) => {
            const state = built || i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
            const showDetail = state === "done" && (!compact || i === (built ? STEPS.length - 1 : stepIndex - 1));
            const stepProgress = state === "active" ? (elapsed - STEP_STARTS[i]!) / step.ms : state === "done" ? 1 : 0;
            return (
              <li
                key={step.title}
                className="flex items-start gap-[11px] px-[10px] py-[7px] rounded-[14px]"
                style={{ backgroundColor: state === "active" ? "#F4EEDF" : "transparent", transition: "background-color 250ms ease" }}
              >
                <span className="mt-[1px]">{state === "done" ? (step.warn ? <WarnIcon /> : <DoneIcon small />) : state === "active" ? <Spinner small /> : <PendingIcon />}</span>
                <span className="min-w-[0px] grow">
                  <span
                    className="block text-[14px] leading-[18px] font-[500] text-walnut"
                    style={{ opacity: state === "pending" ? 0.42 : 1, transition: "opacity 250ms ease" }}
                  >
                    {step.title}
                  </span>
                  {showDetail && (
                    <span className={`ic-fade block mt-[1px] text-[12px] leading-[16px] ${step.warn ? "text-[#B4532A]" : "text-sub"}`}>{step.detail}</span>
                  )}
                  {step.bar && state === "active" && (
                    <span className="block mt-[7px] h-[4px] rounded-[999px] bg-[#2819100F] overflow-hidden">
                      <span className="block h-full rounded-[999px] bg-ink" style={{ width: `${stepProgress * 100}%` }} />
                    </span>
                  )}
                </span>
              </li>
            );
          })}
          {built && (
            <li className="ic-rise flex items-center gap-[11px] mt-[4px] px-[10px] py-[9px] rounded-[14px] [background-color:#DCE5D0]">
              <HalftoneDisc size={22} step={3.4} maxDot={1.5} color="#6E9A5B" />
              <span className="grow text-[14px] leading-[18px] font-[600] text-walnut">Your page is visible within Muse</span>
              <span className="shrink-0 text-[12px] leading-[16px] font-[500] text-sub">Preview</span>
            </li>
          )}
        </ol>
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute z-20 right-[16px] bottom-[max(14px,env(safe-area-inset-bottom))] h-[32px] px-[12px] rounded-[999px] text-[12px] font-[500] text-sub hover:text-walnut transition-colors"
      >
        Skip
      </button>
    </div>
  );
}

/**
 * The clinic's own pages behind the loader, one per slot: each scrolls while a scan line passes, and everything above
 * the line turns into the warm "parsed" copy with the values Doe lifted off it. Edges fade into the paper.
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
            <Shot shot={page.shot} className="ic-read" style={{ ...running, opacity: 0.42, filter: "grayscale(1) contrast(0.9)" }} priority={i === 0} />
            <div className="ic-reveal absolute inset-0 overflow-hidden" style={running}>
              <Shot shot={page.shot} className="ic-read" style={{ ...running, opacity: 0.88, filter: "sepia(0.3) saturate(0.9)" }} />
              <div
                className="absolute inset-0"
                style={{ backgroundImage: "radial-gradient(rgba(185,154,114,0.35) 1px, transparent 1.2px)", backgroundSize: "9px 9px" }}
              />
            </div>
            <div
              className="ic-scan absolute left-0 right-0 h-[2px]"
              style={{
                ...running,
                background: "linear-gradient(90deg, rgba(232,165,133,0), #E8A585 18%, #E07B53 50%, #E8A585 82%, rgba(232,165,133,0))",
                boxShadow: "0 0 28px 8px rgba(232,165,133,0.38)",
              }}
            />
            {i === pageIndex &&
              (PAGE_READS[page.shot] ?? []).map(([key, value], n) => {
                const spot = READ_SPOTS[n]!;
                return (
                  <span
                    key={key + value}
                    className={`ic-chip absolute hidden md:inline-flex items-center gap-[8px] h-[34px] px-[12px] rounded-[12px] [background-color:#FFFCF1F5] border border-solid border-[#2819101F] shadow-[0_6px_24px_rgba(40,25,16,0.1)] text-[13px] leading-[16px] font-[500] text-walnut whitespace-nowrap ${spot.side === "left" ? "left-[7%]" : "right-[7%]"}`}
                    style={{ top: spot.top, animationDelay: `${(parseFloat(spot.top) / 100) * SLOT_MS * 0.8}ms`, animationDuration: `${SLOT_MS * 0.85}ms` }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#B98A55]">{key}</span>
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

function Spinner({ small }: { small?: boolean }) {
  const s = small ? 16 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className="ic-spin shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#2819101F" strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="#281910" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DoneIcon({ small }: { small?: boolean }) {
  const s = small ? 16 : 18;
  return (
    <span className="shrink-0 flex items-center justify-center rounded-[999px] bg-ink" style={{ width: s, height: s }}>
      <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function WarnIcon() {
  return (
    <span className="shrink-0 flex items-center justify-center w-[16px] h-[16px] rounded-[999px] [background-color:#E07B53]">
      <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v9M12 19v.5" fill="none" stroke="#FFFCF1" strokeWidth="3.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function PendingIcon() {
  return <span className="block w-[16px] h-[16px] rounded-[999px] border-[1.5px] border-solid border-[#28191033]" />;
}

/* ------------------------------------------------------------------ Agent page */

function AgentPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [claimInView, setClaimInView] = useState(true);
  const [claimed, setClaimed] = useState<string | null>(null);
  /** Desktop puts the claim card in a sticky right column; iPhone puts it inline after the hero. */
  const [wide, setWide] = useState(false);

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
    const observer = new IntersectionObserver(([entry]) => setClaimInView(entry!.isIntersecting), { root: scrollRef.current, threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [wide]);

  /** Cards rise in order once the loader has mostly faded. */
  const rise = (n: number): CSSProperties => ({ animationDelay: `${REVEAL_MS + n * 90}ms` });

  const claimCard = (
    <div ref={claimRef} className="ic-rise" style={rise(1)}>
      <ClaimCard emailRef={emailRef} claimed={claimed} onClaimed={setClaimed} />
    </div>
  );
  const museCard = (
    <div className="ic-rise" style={rise(3)}>
      <MuseCard />
    </div>
  );

  const goToClaim = () => {
    claimRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 450);
  };


  return (
    <div className="absolute inset-0">
      {/* Their website, behind everything, faded at the edges. */}
      <div className="ic-fade absolute inset-0 overflow-hidden pointer-events-none" style={{ animationDelay: `${REVEAL_MS - 200}ms` }} aria-hidden="true">
        <div className="ic-corner-fade absolute inset-0">
          <Shot shot="home" style={{ opacity: 0.55 }} />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,252,241,0.15) 0%, rgba(255,252,241,0.55) 55%, rgba(255,252,241,0.9) 100%)" }} />
      </div>

      <div ref={scrollRef} className="ic-scroll absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="relative mx-auto w-full max-w-[1200px] px-[12px] md:px-[24px] pt-[max(12px,env(safe-area-inset-top))] pb-[120px] lg:pb-[48px]">
          <TopBar onClaim={goToClaim} claimed={!!claimed} />

          <div className="mt-[12px] lg:mt-[20px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_404px] gap-[12px] lg:gap-[20px] items-start">
            <div className="flex flex-col gap-[12px] lg:gap-[16px] min-w-[0px]">
              <HeroCard claimed={!!claimed} style={rise(0)} />
              {!wide && claimCard}
              <IssuesCard claimed={!!claimed} style={rise(2)} />
              {museCard}
              <LocationsCard style={rise(3)} />
              <ProvidersCard style={rise(4)} />
              <ServicesCard style={rise(5)} />
              <PricesCard style={rise(6)} />
              <OffersCard style={rise(7)} />
              <BookingCard style={rise(8)} />
              <AgentDataCard claimed={!!claimed} style={rise(9)} />
              {!claimed && (
                <button
                  type="button"
                  onClick={goToClaim}
                  className={`${CARD} ic-rise w-full flex items-center justify-between gap-[16px] p-[20px] md:p-[24px] text-left hover:[background-color:#FFFCF1] transition-colors`}
                  style={rise(10)}
                >
                  <span>
                    <span className={`${DISPLAY} block text-[22px] leading-[26px] md:text-[26px] md:leading-[30px] tracking-[-0.01em]`}>Everything above is ready.</span>
                    <span className="block mt-[4px] text-[14px] leading-[20px] text-sub">One email switches it on for personal agents.</span>
                  </span>
                  <span className="shrink-0 h-[44px] px-[18px] flex items-center rounded-[14px] bg-ink text-[14px] font-[600] [color:#FFFCF1]">Claim free</span>
                </button>
              )}
              <p className="px-[8px] text-[12px] leading-[17px] text-sub">
                Parsed by Doe from public pages on {CLINIC.domain}. Prices are CAD starting prices before HST, as listed on the site. Muse previews are
                examples. Nothing here is live for agents until the page is claimed.
              </p>
            </div>

            {wide && (
              <div className="flex flex-col gap-[16px] sticky top-[20px]">
                {claimCard}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iPhone: a claim bar whenever the claim card is off screen. */}
      <div
        className="lg:hidden absolute left-0 right-0 bottom-0 z-30 px-[12px] pb-[max(12px,env(safe-area-inset-bottom))] pt-[10px]"
        style={{
          transform: !claimed && !claimInView ? "none" : "translateY(120%)",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          background: "linear-gradient(180deg, rgba(255,252,241,0) 0%, rgba(255,252,241,0.92) 40%)",
        }}
      >
        <div className="flex items-center gap-[12px] h-[60px] pl-[16px] pr-[8px] rounded-[20px] bg-ink shadow-[0_10px_30px_rgba(20,12,4,0.25)]">
          <span className="ic-pulse w-[8px] h-[8px] shrink-0 rounded-[999px] [background-color:#E07B53]" />
          <span className="grow min-w-[0px]">
            <span className="block truncate text-[14px] leading-[18px] font-[600] [color:#FFFCF1]">Inactive for agents</span>
            <span className="block truncate text-[12px] leading-[16px] [color:#FFFCF199]">Claim free in one step</span>
          </span>
          <button type="button" onClick={goToClaim} className="shrink-0 h-[44px] px-[18px] rounded-[14px] bg-salmon text-[14px] font-[600] text-walnut">
            Claim page
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onClaim, claimed }: { onClaim: () => void; claimed: boolean }) {
  return (
    <div className={`${CARD} ic-rise flex items-center gap-[10px] h-[56px] pl-[18px] pr-[8px]`} style={{ animationDelay: `${REVEAL_MS - 60}ms` }}>
      <span className={`${DISPLAY} text-[22px] leading-[24px] tracking-[-0.02em]`}>Doe</span>
      <span className="hidden sm:block w-[1px] h-[18px] bg-[#2819101F]" />
      <span className="hidden sm:block text-[13px] leading-[16px] font-[500] text-sub">Agent Index</span>
      <span className="ml-auto flex items-center gap-[8px]">
        <StatusPill claimed={claimed} />
        {!claimed && (
          <button type="button" onClick={onClaim} className="hidden lg:flex h-[40px] px-[16px] items-center rounded-[13px] bg-ink text-[13px] font-[600] [color:#FFFCF1]">
            Claim page
          </button>
        )}
      </span>
    </div>
  );
}

function StatusPill({ claimed }: { claimed: boolean }) {
  return claimed ? (
    <span className={`${CHIP} gap-[7px] [background-color:#DCE5D0]`}>
      <span className="w-[7px] h-[7px] rounded-[999px] [background-color:#6E9A5B]" />
      Claimed · verifying
    </span>
  ) : (
    <span className={`${CHIP} gap-[7px] bg-sand`}>
      <span className="ic-pulse w-[7px] h-[7px] rounded-[999px] [background-color:#E07B53]" />
      Inactive
    </span>
  );
}

function HeroCard({ claimed, style }: { claimed: boolean; style: CSSProperties }) {
  const stats: [number | string, string][] = [
    [SOURCE_PAGES.length, "pages read"],
    [FIELD_COUNT, "fields structured"],
    [SERVICE_COUNT, "services"],
    [PRICE_COUNT, "prices"],
    [PROVIDERS.length, "providers"],
  ];
  return (
    <section className={`${CARD} ic-rise relative overflow-hidden p-[20px] md:p-[28px]`} style={style}>
      <HalftoneDisc size={260} step={8} color="#C2A987" opacity={0.28} className="absolute right-[-90px] top-[-100px] pointer-events-none" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-[6px]">
          <span className={`${CHIP} bg-sand`}>Agent page</span>
          <span className={`${CHIP} bg-sand`}>{CLINIC.url}</span>
        </div>
        <h2 className={`${DISPLAY} mt-[16px] text-[36px] leading-[40px] md:text-[52px] md:leading-[56px] tracking-[-0.025em]`}>{CLINIC.name}</h2>
        <p className="mt-[8px] text-[15px] leading-[22px] md:text-[16px] md:leading-[24px] text-sub">
          {CLINIC.kind} · {CLINIC.area} · Since {CLINIC.since}
        </p>

        <div className="mt-[18px] flex gap-[12px] items-start p-[14px] rounded-[18px]" style={{ backgroundColor: claimed ? "#DCE5D0" : "#F7DCCB" }}>
          <span className="mt-[3px] shrink-0">
            <span className={`block w-[9px] h-[9px] rounded-[999px] ${claimed ? "" : "ic-pulse"}`} style={{ backgroundColor: claimed ? "#6E9A5B" : "#E07B53" }} />
          </span>
          <span className="text-[14px] leading-[20px] text-walnut">
            {claimed ? (
              <>
                <strong className="font-[600]">Claimed.</strong> Verify your email and this page goes live for Muse and other personal agents.
              </>
            ) : (
              <>
                <strong className="font-[600]">Built, but switched off.</strong> Personal agents like Muse can&apos;t read, quote or book {CLINIC.name} until someone
                from the clinic claims this page.
              </>
            )}
          </span>
        </div>

        <div className="mt-[14px] grid grid-cols-3 md:grid-cols-5 gap-[6px]">
          {stats.map(([value, label], i) => (
            <div key={label} className={`rounded-[16px] bg-sand px-[12px] py-[10px] ${i > 2 ? "hidden md:block" : ""}`}>
              <div className={`${DISPLAY} text-[24px] leading-[28px] tracking-[-0.02em] tabular-nums`}>{value}</div>
              <div className="mt-[2px] text-[12px] leading-[15px] text-sub">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Claim */

type ClaimStatus = "idle" | "sending" | "error";

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

function ClaimCard({
  emailRef,
  claimed,
  onClaimed,
}: {
  emailRef: React.RefObject<HTMLInputElement>;
  claimed: string | null;
  onClaimed: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ClaimStatus>("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    const failure = await postClaim(email, "claim");
    if (failure) {
      setStatus("error");
      setError(failure);
      return;
    }
    setStatus("idle");
    onClaimed(email.trim().toLowerCase());
  };

  if (claimed) return <PlanCard email={claimed} />;

  return (
    <section className="rounded-[24px] bg-ink p-[6px] shadow-[0_18px_50px_rgba(20,12,4,0.22)]">
      <div className="relative overflow-hidden rounded-[19px] [background-color:#FFFCF1] p-[18px] md:p-[22px]">
        <HalftoneDisc size={170} step={6.5} color="#E8A585" opacity={0.45} className="absolute right-[-56px] top-[-62px] pointer-events-none" />
        <div className="relative">
          <StatusPill claimed={false} />
          <h3 className={`${DISPLAY} mt-[14px] text-[28px] leading-[32px] tracking-[-0.02em]`}>Claim your page</h3>
          <p className="mt-[8px] text-[14px] leading-[21px] text-sub">
            It&apos;s already built from your site. Claim it free and switch it on, so Muse and other personal agents can find your surgeons, quote your prices
            and send you consults.
          </p>
          <ul className="mt-[14px] flex flex-col gap-[8px]">
            {[
              "Free to claim, with a verified badge",
              `Fix the ${ISSUES.length} issues agents found by typing a sentence`,
              "Let agents book consults from $29/mo",
            ].map((line) => (
              <li key={line} className="flex items-start gap-[10px] text-[14px] leading-[19px] text-walnut">
                <span className="mt-[1px]">
                  <DoneIcon small />
                </span>
                {line}
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="mt-[18px] flex flex-col gap-[8px]">
            <label htmlFor="ic-email" className="sr-only">
              Work email
            </label>
            <input
              ref={emailRef}
              id="ic-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`you@${CLINIC.domain}`}
              className="h-[52px] w-full rounded-[15px] bg-sand px-[16px] text-[16px] leading-[20px] text-walnut placeholder:text-[#28191066] outline-none border-[1.5px] border-solid border-transparent focus:border-[#281910] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="h-[52px] w-full flex items-center justify-center gap-[10px] rounded-[15px] bg-ink text-[15px] font-[600] [color:#FFFCF1] disabled:opacity-70 transition-opacity"
            >
              {status === "sending" ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="ic-spin" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#FFFCF133" strokeWidth="3" />
                    <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="#FFFCF1" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Claiming…
                </>
              ) : (
                "Claim & activate"
              )}
            </button>
            {status === "error" && (
              <p role="alert" className="text-[13px] leading-[18px] text-[#B4532A]">
                {error}
              </p>
            )}
            <p className="text-[12px] leading-[17px] text-sub">We&apos;ll email a link to confirm you work at {CLINIC.name}. No card needed.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

/** After claiming: the free page is theirs; the paid tiers are what let agents book. Prices from earlypreview's list. */
const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$29",
    was: "$49",
    note: "Founding price, first 100 clinics, for a year. +$19 per extra provider.",
    features: ["Agents book consults and send documents", "MCP, well-known and API", "Email and scheduler integrations", "Reminders and confirmations"],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "$59",
    was: "$149",
    note: "Founding price, first 50 clinics, for six months. +$39 per extra provider.",
    features: ["Everything in Basic", "Priority in the Doe Engine", "Offers, waitlist and autofill", "Deposits and no-show protection"],
  },
] as const;

function PlanCard({ email }: { email: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState("");

  const choose = async (plan: string) => {
    setSending(plan);
    setError("");
    const failure = await postClaim(email, plan);
    setSending(null);
    if (failure) setError(failure);
    else setPicked(plan);
  };

  return (
    <section className="ic-rise rounded-[24px] bg-ink p-[6px] shadow-[0_18px_50px_rgba(20,12,4,0.22)]">
      <div className="rounded-[19px] [background-color:#FFFCF1] p-[18px] md:p-[22px]">
        <StatusPill claimed />
        <h3 className={`${DISPLAY} mt-[14px] text-[26px] leading-[30px] tracking-[-0.02em]`}>Check your inbox</h3>
        <p className="mt-[6px] text-[14px] leading-[20px] text-sub">
          We sent a confirmation link to <span className="font-[600] text-walnut">{email}</span>. Once you confirm, agents can read your page for free.
        </p>

        <div className="mt-[18px] text-[13px] leading-[16px] font-[600] uppercase tracking-[0.08em] text-sub">Next: let agents book</div>
        <div className="mt-[10px] flex flex-col gap-[8px]">
          {PLANS.map((plan) => {
            const chosen = picked === plan.id;
            return (
              <div key={plan.id} className="rounded-[18px] bg-sand p-[14px]" style={{ outline: chosen ? "1.5px solid #281910" : "none" }}>
                <div className="flex items-baseline gap-[8px]">
                  <span className="text-[15px] leading-[20px] font-[600]">{plan.name}</span>
                  <span className={`${DISPLAY} ml-auto text-[24px] leading-[28px]`}>{plan.price}</span>
                  <span className="text-[13px] text-sub">
                    /mo <s className="ml-[2px]">{plan.was}</s>
                  </span>
                </div>
                <p className="mt-[2px] text-[12px] leading-[16px] text-sub">{plan.note}</p>
                <ul className="mt-[10px] flex flex-col gap-[5px]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-[8px] text-[13px] leading-[17px]">
                      <span className="w-[5px] h-[5px] rounded-[999px] bg-ink shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={!!sending || !!picked}
                  onClick={() => choose(plan.id)}
                  className={`mt-[12px] h-[44px] w-full rounded-[13px] text-[14px] font-[600] transition-opacity disabled:cursor-default ${chosen ? "[background-color:#DCE5D0] text-walnut" : "bg-ink [color:#FFFCF1]"} ${picked && !chosen ? "opacity-40" : ""}`}
                >
                  {chosen ? "Chosen · setup link on its way" : sending === plan.id ? "Saving…" : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
        {error && (
          <p role="alert" className="mt-[8px] text-[13px] leading-[18px] text-[#B4532A]">
            {error}
          </p>
        )}
        <p className="mt-[10px] text-[12px] leading-[17px] text-sub">Or stay on Free: your page stays visible to agents, and you can upgrade any time.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Muse preview */

function MuseCard() {
  const [mode, setMode] = useState<"without" | "with">("with");
  return (
    <section className="rounded-[26px] bg-ink p-[14px] md:p-[16px] [color:#FFFCF1]">
      <div className="flex items-center gap-[10px] px-[4px]">
        <HalftoneDisc size={30} step={3.6} maxDot={1.6} color="#E8A585" />
        <span className="grow">
          <span className="block text-[15px] leading-[18px] font-[600]">Muse</span>
          <span className="block text-[12px] leading-[16px] [color:#FFFCF180]">A patient&apos;s personal agent</span>
        </span>
        <span className="text-[11px] uppercase tracking-[0.1em] [color:#FFFCF166]">Example</span>
      </div>

      <div className="mt-[12px] grid grid-cols-2 p-[3px] rounded-[13px] bg-[#FFFCF114]" role="tablist">
        {(
          [
            ["without", "Today"],
            ["with", "With your page"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className="h-[34px] rounded-[10px] text-[13px] font-[600] transition-colors"
            style={{ backgroundColor: mode === id ? "#FFFCF1" : "transparent", color: mode === id ? "#281910" : "#FFFCF1B3" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-[14px] flex flex-col gap-[10px] min-h-[300px]">
        <div className="self-end max-w-[86%] rounded-[18px] rounded-br-[6px] bg-[#FFFCF11F] px-[14px] py-[10px] text-[14px] leading-[20px]">
          I want a deep plane facelift in Toronto. Who&apos;s good, what does it cost, and can I see someone next week?
        </div>
        {mode === "without" ? (
          <div key="without" className="ic-fade self-start max-w-[92%] rounded-[18px] rounded-bl-[6px] bg-[#FFFCF10F] px-[14px] py-[10px] text-[14px] leading-[20px] [color:#FFFCF1B3]">
            Ford Plastic Surgery in Yorkville comes up for facelifts. I couldn&apos;t confirm their current prices or open consult times, so I can&apos;t book for you.
            Their site asks you to fill out a form and wait for a call back, weekdays 8:30 to 4:30.
          </div>
        ) : (
          <div key="with" className="ic-fade self-start max-w-[94%] flex flex-col gap-[8px]">
            <div className="rounded-[18px] rounded-bl-[6px] [background-color:#FFFCF1] px-[14px] py-[10px] text-[14px] leading-[20px] text-walnut">
              <strong className="font-[600]">Ford Plastic Surgery</strong>, Bloor-Yorkville. Dr. Derek Ford was the first surgeon in Canada to offer the endoscopic
              mid facelift. A deep plane facelift starts at <strong className="font-[600]">$22,500</strong> and includes 3 lymphatic drainage sessions. Consults are
              $300, credited if you book within 3 months.
            </div>
            <div className="rounded-[18px] [background-color:#FFFCF1] p-[12px] text-walnut">
              <div className="flex items-center gap-[10px]">
                <HalftoneDisc size={36} step={4} maxDot={1.8} color="#E07B53" />
                <span className="grow min-w-[0px]">
                  <span className="block text-[14px] leading-[18px] font-[600]">Consult · Dr. Derek Ford</span>
                  <span className="block text-[12px] leading-[16px] text-sub">7 St Thomas St, Suite 410 · or virtual</span>
                </span>
              </div>
              <div className="mt-[10px] flex gap-[6px]">
                {["Tue 10:30", "Wed 2:00", "Fri 9:15"].map((t, i) => (
                  <span key={t} className={`${CHIP} h-[30px] ${i === 0 ? "bg-ink [color:#FFFCF1]" : "bg-sand"}`}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-[10px] flex items-center justify-center gap-[8px] h-[40px] rounded-[12px] bg-sand text-[13px] font-[600] text-sub">
                <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                Booking switches on when you claim
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Parsed sections */

function Section({
  title,
  count,
  source,
  style,
  children,
  tone,
}: {
  title: string;
  count?: string;
  source?: string;
  style: CSSProperties;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <section className={`${CARD} ic-rise p-[18px] md:p-[24px]`} style={{ ...style, ...(tone ? { backgroundColor: tone } : {}) }}>
      <div className="flex items-center gap-[10px] flex-wrap">
        <h3 className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em]`}>{title}</h3>
        {count && <span className={`${CHIP} bg-sand`}>{count}</span>}
        {source && <span className="ml-auto text-[12px] leading-[16px] text-sub font-mono">{source}</span>}
      </div>
      <div className="mt-[14px]">{children}</div>
    </section>
  );
}

function IssuesCard({ claimed, style }: { claimed: boolean; style: CSSProperties }) {
  return (
    <Section title="What agents trip on" count={`${ISSUES.length} found`} style={style}>
      <ol className="flex flex-col gap-[6px]">
        {ISSUES.map((issue, i) => (
          <li key={issue.title} className="flex gap-[12px] items-start p-[12px] rounded-[16px] [background-color:#F7DCCB99]">
            <span className="shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[999px] [background-color:#FFFCF1] text-[12px] font-[600] tabular-nums">{i + 1}</span>
            <span className="min-w-[0px]">
              <span className="block text-[14px] leading-[19px] font-[600]">{issue.title}</span>
              <span className="block mt-[1px] text-[13px] leading-[18px] text-sub">{issue.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[12px] text-[13px] leading-[18px] text-sub">
        {claimed ? "Fix any of these by typing a sentence once you confirm your email." : "Agents give patients the wrong answer, or none. Claim the page to fix each one by typing a sentence."}
      </p>
    </Section>
  );
}

function LocationsCard({ style }: { style: CSSProperties }) {
  return (
    <Section title="Locations & hours" count={`${LOCATIONS.length} sites`} source="/about/our-locations/" style={style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
        {LOCATIONS.map((loc) => (
          <div key={loc.name} className="rounded-[18px] bg-sand p-[14px]">
            <div className="text-[15px] leading-[20px] font-[600]">{loc.name}</div>
            <div className="mt-[1px] text-[12px] leading-[16px] text-sub">{loc.detail}</div>
            <div className="mt-[8px] text-[13px] leading-[18px]">
              {loc.address}
              <br />
              {loc.city}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[10px] grid grid-cols-7 gap-[4px]">
        {HOURS.map((h) => (
          <div
            key={h.day}
            className={`rounded-[13px] px-[4px] py-[8px] text-center ${h.time ? "bg-sand" : "border-[1.5px] border-dashed border-[#2819102E]"}`}
          >
            <div className="text-[12px] leading-[15px] font-[600]">{h.day}</div>
            <div className={`mt-[2px] text-[10px] leading-[13px] md:text-[11px] ${h.time ? "text-walnut" : "text-[#B4532A]"}`}>{h.time ?? "Not listed"}</div>
          </div>
        ))}
      </div>
      <div className="mt-[10px] flex flex-wrap gap-[6px]">
        <span className={`${CHIP} bg-sand`}>Call {CLINIC.phone}</span>
        <span className={`${CHIP} bg-sand`}>Toll-free {CLINIC.tollFree}</span>
      </div>
    </Section>
  );
}

function ProvidersCard({ style }: { style: CSSProperties }) {
  return (
    <Section title="Providers" count={`${PROVIDERS.length} listed`} source="/about/our-staff/" style={style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
        {PROVIDERS.map((p, i) => (
          <div key={p.name} className="flex gap-[12px] items-start rounded-[18px] bg-sand p-[12px]">
            <HalftoneDisc size={42} step={4.4} maxDot={1.9} color={AVATAR_DOTS[i % AVATAR_DOTS.length]} />
            <span className="min-w-[0px]">
              <span className="block text-[15px] leading-[19px] font-[600]">{p.name}</span>
              <span className="block text-[12px] leading-[16px] text-sub">{p.role}</span>
              <span className="block mt-[6px] text-[13px] leading-[18px]">{p.fact}</span>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Tabs({ groups, active, onSelect }: { groups: { group: string; count: number }[]; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="ic-scroll flex gap-[6px] overflow-x-auto -mx-[2px] px-[2px] pb-[2px]" role="tablist">
      {groups.map((g, i) => (
        <button
          key={g.group}
          type="button"
          role="tab"
          aria-selected={active === i}
          onClick={() => onSelect(i)}
          className="shrink-0 h-[36px] px-[14px] flex items-center gap-[7px] rounded-[12px] text-[13px] font-[600] transition-colors"
          style={{ backgroundColor: active === i ? "#281910" : "#F4EEDF", color: active === i ? "#FFFCF1" : "#281910" }}
        >
          {g.group}
          <span style={{ opacity: 0.6 }}>{g.count}</span>
        </button>
      ))}
    </div>
  );
}

function ServicesCard({ style }: { style: CSSProperties }) {
  const [tab, setTab] = useState(0);
  return (
    <Section title="Services" count={`${SERVICE_COUNT} services`} style={style}>
      <Tabs groups={SERVICES.map((g) => ({ group: g.group, count: g.items.length }))} active={tab} onSelect={setTab} />
      <div key={tab} className="ic-fade mt-[12px] flex flex-wrap gap-[6px]">
        {SERVICES[tab]!.items.map((s) => (
          <span key={s} className={`${CHIP} h-[32px] bg-sand`}>
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}

function PricesCard({ style }: { style: CSSProperties }) {
  const [tab, setTab] = useState(0);
  return (
    <Section title="Prices" count={`${PRICE_COUNT} prices`} source="/about/pricing-financing/" style={style}>
      <Tabs groups={PRICES.map((g) => ({ group: g.group, count: g.items.length }))} active={tab} onSelect={setTab} />
      <div key={tab} className="ic-fade mt-[10px] grid grid-cols-1 md:grid-cols-2 md:gap-x-[24px]">
        {PRICES[tab]!.items.map((p) => (
          <div key={p.name} className="flex items-baseline gap-[10px] py-[9px] border-b border-solid border-[#2819100F]">
            <span className="text-[14px] leading-[19px]">{p.name}</span>
            <span className="grow border-b border-dotted border-[#28191033] translate-y-[-3px]" />
            <span className="text-[14px] leading-[19px] font-[600] tabular-nums">{p.price}</span>
          </div>
        ))}
      </div>
      <p className="mt-[10px] text-[12px] leading-[16px] text-sub">
        CAD starting prices before HST. Consult {CLINIC.consult}. {CLINIC.consultNote}
      </p>
    </Section>
  );
}

function OffersCard({ style }: { style: CSSProperties }) {
  const tones = ["#DCE5D0", "#F3E7C9", "#F7DCCB", "#E3E9D9"];
  return (
    <Section title="Offers & financing" count={`${OFFERS.length} found`} style={style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
        {OFFERS.map((o, i) => (
          <div key={o.title} className="rounded-[18px] p-[14px]" style={{ backgroundColor: tones[i % tones.length] }}>
            <div className="text-[15px] leading-[20px] font-[600]">{o.title}</div>
            <div className="mt-[4px] text-[13px] leading-[18px] text-walnut/80">{o.detail}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BookingCard({ style }: { style: CSSProperties }) {
  return (
    <Section title="Booking" source="/contact/" style={style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
        <div className="rounded-[18px] bg-sand p-[14px]">
          <div className="text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em] text-sub">Today</div>
          <ul className="mt-[8px] flex flex-col gap-[7px]">
            {BOOKING.today.map((line) => (
              <li key={line} className="flex gap-[9px] text-[13px] leading-[18px]">
                <span className="mt-[6px] w-[5px] h-[5px] rounded-[999px] shrink-0 [background-color:#28191066]" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-[10px] flex flex-wrap gap-[5px]">
            {BOOKING.fields.map((f) => (
              <span key={f} className={`${CHIP} h-[26px] text-[12px] [background-color:#FFFCF1]`}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[18px] bg-ink p-[14px] [color:#FFFCF1]">
          <div className="text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em] [color:#FFFCF180]">With Doe</div>
          <ul className="mt-[8px] flex flex-col gap-[7px]">
            {[
              "Agents book consults with the right surgeon, any hour",
              "Procedure, provider and documents arrive with the booking",
              "Confirmations and reminders sent for you",
            ].map((line) => (
              <li key={line} className="flex gap-[9px] text-[13px] leading-[18px]">
                <span className="mt-[6px] w-[5px] h-[5px] rounded-[999px] shrink-0 bg-salmon" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function AgentDataCard({ claimed, style }: { claimed: boolean; style: CSSProperties }) {
  return (
    <Section title="What agents read" count="JSON · MCP · API" style={style}>
      <div className="flex flex-wrap gap-[6px]">
        {MCP_TOOLS.map((t) => (
          <span key={t} className={`${CHIP} h-[28px] bg-sand font-mono text-[12px]`}>
            {t}
          </span>
        ))}
      </div>
      <div className="relative mt-[12px] rounded-[18px] bg-ink overflow-hidden">
        <pre className="ic-scroll max-h-[300px] overflow-hidden p-[16px] text-[12px] leading-[18px] font-mono [color:#FFFCF1CC] whitespace-pre">{AGENT_JSON}</pre>
        <div
          className="absolute inset-x-0 bottom-0 h-[150px] flex items-end justify-center pb-[16px]"
          style={{ background: "linear-gradient(180deg, rgba(20,12,4,0) 0%, rgba(20,12,4,0.92) 60%)" }}
        >
          <span className={`${CHIP} gap-[7px] [background-color:#FFFCF1]`}>
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
            </svg>
            {claimed ? "Goes live when you confirm your email" : "Live for agents once claimed"}
          </span>
        </div>
      </div>
    </Section>
  );
}
