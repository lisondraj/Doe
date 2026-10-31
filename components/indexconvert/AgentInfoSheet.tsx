"use client";

/**
 * The "?" beside each of Ford's settings and agent files, and the sheet that rises from the bottom when one is tapped:
 * a small drawing, a big question, and a plain explanation of why that piece helps personal agents find the clinic.
 * The explanations lean on how today's personal agents are built (always on, on their own cloud computer, with memory,
 * driven by an AI model) without naming any of them.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Same face as DISPLAY in IndexConvertPage. */
const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";

export type AgentTopicId = "mcp" | "api" | "pap" | "llms" | "robots" | "openapi" | "card" | SectionTopicId;
/** The sections of the agent page (What Agents See): what Doe does with each, written for the clinic's team. */
export type SectionTopicId = "providers" | "locations" | "services" | "offers" | "booking";

type Topic = {
  question: string;
  /** What it is, in a sentence a clinic manager would follow. */
  what: string;
  /** Why it helps a personal agent find and use the clinic, from how those agents work. */
  why: string;
  /** The small label over `why`. */
  whyLabel?: string;
  source?: { label: string; href: string };
};

export const AGENT_TOPICS: Record<AgentTopicId, Topic> = {
  mcp: {
    question: "What is Model Context Protocol (MCP)?",
    what: "MCP is a standard plug that lets an AI agent use your clinic's tools directly, such as looking up a price or asking for a consult, instead of guessing from your web page.",
    why: "Personal agents are built to get things done, not just chat. They stay on around the clock, work from their own cloud computer, remember what each patient likes, and use AI to choose which tool to call. With an MCP server, an agent can ask what a consult costs and get your real answer in a second.",
    source: { label: "modelcontextprotocol.io", href: "https://modelcontextprotocol.io/docs/getting-started/intro" },
  },
  api: {
    question: "What is an agent API?",
    what: "An API is a set of questions your clinic can answer in a fixed format: services, prices, surgeons and hours, laid out so software reads them cleanly.",
    why: "An agent can browse a website like a person, but it is slow, and pop-ups, sliders and price lists saved as pictures trip it up. Because agents juggle many errands at once, they go for a clean, structured answer first and only browse when there isn't one.",
    source: { label: "aws.amazon.com", href: "https://aws.amazon.com/what-is/api/" },
  },
  pap: {
    question: "What is the Personal Agent Protocol?",
    what: "A draft standard for how a company tells agents how to work with it: how they sign in, call your API or reach your own assistant, always on behalf of one person.",
    why: "A personal agent holds a patient's email, calendar and payment details and acts in their name. Clinics need to know who is asking and that the patient agreed. Following the protocol gives agents one clear, safe way to book you, and tells them to say they are agents.",
    source: { label: "personalagentprotocol.org", href: "https://personalagentprotocol.org/docs/spec" },
  },
  llms: {
    question: "What is llms.txt?",
    what: "A short plain-text file at the top of your site that says what your clinic is and where to read more. Think of it as a front-desk summary written for AI.",
    why: "AI models read text and have limited attention. On a busy site the facts sit behind menus, banners and sliders. A summary file lets an agent understand your clinic in one read, so it can recommend you with confidence.",
    source: { label: "llmstxt.org", href: "https://llmstxt.org" },
  },
  robots: {
    question: "What is robots.txt?",
    what: "A file that tells automated visitors which parts of your site they may read.",
    why: "Personal agents reach your site as automated visitors, and many sites turn them away by accident, which makes the clinic invisible to them. Ours lets the major AI agents in and points them to the other files.",
    source: { label: "developers.google.com", href: "https://developers.google.com/search/docs/crawling-indexing/robots/intro" },
  },
  openapi: {
    question: "What is an OpenAPI file?",
    what: "A menu of everything agents can ask your clinic, written for software: each question, what to send and what comes back.",
    why: "An agent that can use a computer still needs instructions. This file lets its AI pick the right request on its own, without trial and error, so checking a price or hours works the first time.",
    source: { label: "openapis.org", href: "https://www.openapis.org/what-is-openapi" },
  },
  card: {
    question: "What is an MCP server card?",
    what: "A business card for your MCP server: its name, address and tools, kept in a file at a standard spot.",
    why: "Agents don't hunt for connections by hand. They check well-known places for a card, then connect by themselves. With the card in place, an agent can discover your clinic and start using it without anyone setting it up.",
    source: { label: "registry.modelcontextprotocol.io", href: "https://registry.modelcontextprotocol.io" },
  },
  providers: {
    question: "How does Doe help agents find your providers?",
    what: "Doe reads your team page and lists each surgeon, injector and aesthetician with their role and what they do, in one clean list.",
    whyLabel: "Why it matters for your clinic",
    why: "When a patient asks their agent for a surgeon who does rhinoplasty, the agent needs names and specialties it can trust. Bios inside photos and sliders are easy to miss. A clean list means your providers are the ones it finds and recommends.",
  },
  locations: {
    question: "How does Doe help agents find your locations and hours?",
    what: "Doe lists each of your locations with its address, phone and opening hours, in a format every agent reads the same way.",
    whyLabel: "Why it matters for your clinic",
    why: "Agents often search by distance and time, like \"within 30 km, open Saturday\". If your address and hours sit in a footer or an image, an agent may pass you by. Clear locations put you in those answers.",
  },
  services: {
    question: "How does Doe help agents read your services and prices?",
    what: "Doe turns your treatment pages and price list into one list of services, each with its starting price in CAD.",
    whyLabel: "Why it matters for your clinic",
    why: "Patients ask agents to compare, like \"HALO under $1,800\". Prices in PDFs or pictures can't be compared. With yours laid out clearly, an agent can match you to the request and quote your real price.",
  },
  offers: {
    question: "How does Doe help agents see your offers and financing?",
    what: "Doe gathers your current promotions and financing options and keeps them next to the services they apply to.",
    whyLabel: "Why it matters for your clinic",
    why: "Agents look for value on a patient's behalf. A clearly listed offer or payment plan can be the reason an agent puts your clinic first, instead of an offer it never saw on a banner.",
  },
  booking: {
    question: "How does Doe help agents book with you?",
    what: "Doe tells agents how to request a consult with you: what to send, who it goes to, and whether booking is turned on.",
    whyLabel: "Why it matters for your clinic",
    why: "Agents want to finish the job, not just suggest a name. Once you activate, an agent can request a consult with the patient's consent, and your team gets the request with everything it needs.",
  },
};

/** A clean circled question mark. Sits at the end of a row, so it stays small and quiet. */
export function InfoButton({ label, onClick, size = 24, className = "" }: { label: string; onClick: () => void; size?: number; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-full border-[1.5px] border-solid border-[#28191055] text-[#281910] font-[700] leading-none hover:bg-[#FFFCF1] active:bg-[#FFFCF1] transition-colors duration-150 ${className}`}
    >
      <span style={{ fontSize: Math.round(size * 0.55) }} aria-hidden="true">
        ?
      </span>
    </button>
  );
}

const cream = "#FFFCF1";
const ink = "#3A2516";
const tan = "#C2A987";
const line = "#28191033";

/** A small agent mark: the page's dotted sphere on a cream disc. */
function AgentDot({ cx, cy, r = 20 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={cream} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <circle key={i} cx={cx + Math.cos(a) * r * 0.45} cy={cy + Math.sin(a) * r * 0.45} r={r * 0.12} fill={tan} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.15} fill="#B99A72" />
    </g>
  );
}

function Clinic({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="56" height="56" rx="12" fill={ink} />
      <rect x={x + 12} y={y + 14} width="32" height="5" rx="2.5" fill={cream} opacity="0.85" />
      <rect x={x + 12} y={y + 25} width="24" height="5" rx="2.5" fill={cream} opacity="0.5" />
      <rect x={x + 12} y={y + 36} width="28" height="5" rx="2.5" fill={cream} opacity="0.5" />
    </g>
  );
}

function Pill({ x, y, w, label, dark = false }: { x: number; y: number; w: number; label: string; dark?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="18" rx="9" fill={dark ? ink : cream} />
      <text x={x + w / 2} y={y + 12.5} fontSize="9.5" fontWeight="600" textAnchor="middle" fill={dark ? cream : "#281910"} fontFamily="ui-monospace, monospace">
        {label}
      </text>
    </g>
  );
}

/** The little picture on each section's card: a person, a pin, a list, a tag, a calendar. */
function Glyph({ id, x, y }: { id: SectionTopicId; x: number; y: number }) {
  const s = { fill: "none", stroke: ink, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g transform={`translate(${x} ${y})`}>
      {id === "providers" && (
        <>
          <circle cx="12" cy="8" r="4.5" {...s} />
          <path d="M3.5 21c1-5 4.5-7.5 8.5-7.5s7.5 2.5 8.5 7.5" {...s} />
        </>
      )}
      {id === "locations" && (
        <>
          <path d="M12 22s7-6.4 7-12a7 7 0 0 0-14 0c0 5.6 7 12 7 12z" {...s} />
          <circle cx="12" cy="10" r="2.6" {...s} />
        </>
      )}
      {id === "services" && <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...s} />}
      {id === "offers" && (
        <>
          <path d="M3 12V4h8l10 10-8 8z" {...s} />
          <circle cx="7.5" cy="8.5" r="1.4" {...s} />
        </>
      )}
      {id === "booking" && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="3" {...s} />
          <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" {...s} />
        </>
      )}
    </g>
  );
}

/** A busy page on the left, Doe's clean card for the section in the middle, an agent reading it on the right. */
function SectionArt({ id }: { id: SectionTopicId }) {
  return (
    <>
      {/* The clinic's own page: banner, menus, a pop-up. */}
      <rect x="14" y="20" width="62" height="80" rx="10" fill={cream} />
      <rect x="22" y="28" width="46" height="16" rx="4" fill="#E9DCC6" />
      <rect x="22" y="50" width="38" height="4" rx="2" fill={line} />
      <rect x="22" y="59" width="30" height="4" rx="2" fill={line} />
      <rect x="22" y="68" width="42" height="4" rx="2" fill={line} />
      <rect x="40" y="76" width="32" height="18" rx="5" fill={cream} stroke={line} strokeWidth="1" />
      <rect x="45" y="83" width="22" height="5" rx="2.5" fill={ink} opacity="0.7" />
      <path d="M82 60h12M88 54l6 6-6 6" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Doe's clean card for this section. */}
      <rect x="100" y="10" width="64" height="84" rx="14" fill={ink} />
      <rect x="114" y="20" width="36" height="36" rx="10" fill={cream} />
      <Glyph id={id} x={120} y={26} />
      <rect x="112" y="66" width="40" height="4" rx="2" fill={cream} opacity="0.85" />
      <rect x="112" y="76" width="28" height="4" rx="2" fill={cream} opacity="0.5" />
      <path d="M170 60h12M176 54l6 6-6 6" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <AgentDot cx={208} cy={60} r={20} />
      <Pill x={92} y={99} w={80} label={id} />
    </>
  );
}

const SECTION_TOPICS: SectionTopicId[] = ["providers", "locations", "services", "offers", "booking"];

function Drawing({ id }: { id: AgentTopicId }) {
  let art: ReactNode;
  if ((SECTION_TOPICS as string[]).includes(id)) art = <SectionArt id={id as SectionTopicId} />;
  else if (id === "mcp")
    art = (
      <>
        <AgentDot cx={48} cy={52} />
        <Clinic x={146} y={24} />
        <path d="M70 52h42" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <rect x="112" y="44" width="16" height="16" rx="5" fill={ink} />
        <path d="M128 52h12" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <Pill x={14} y={92} w={62} label="prices" />
        <Pill x={82} y={92} w={72} label="providers" />
        <Pill x={160} y={92} w={66} label="consult" />
      </>
    );
  else if (id === "api")
    art = (
      <>
        <rect x="22" y="30" width="62" height="60" rx="12" fill={cream} />
        <text x="53" y="68" fontSize="26" fontWeight="700" textAnchor="middle" fill={tan}>?</text>
        <Clinic x={162} y={32} />
        <path d="M94 48h56M142 41l8 7-8 7" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 74H94M102 67l-8 7 8 7" fill="none" stroke={tan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  else if (id === "pap")
    art = (
      <>
        <circle cx="46" cy="50" r="12" fill={cream} />
        <path d="M24 92c2-18 12-26 22-26s20 8 22 26z" fill={cream} />
        <AgentDot cx={194} cy={60} />
        <path d="M120 22l32 11v26c0 20-14 33-32 40-18-7-32-20-32-40V33z" fill={ink} />
        <path d="M105 60l11 11 20-22" fill="none" stroke={cream} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M72 62h8M160 60h14" stroke={line} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
      </>
    );
  else if (id === "llms")
    art = (
      <>
        <rect x="78" y="10" width="84" height="100" rx="12" fill={cream} />
        <rect x="90" y="22" width="46" height="8" rx="4" fill={ink} />
        <rect x="90" y="40" width="60" height="5" rx="2.5" fill={line} />
        <rect x="90" y="52" width="52" height="5" rx="2.5" fill={line} />
        <rect x="90" y="64" width="58" height="5" rx="2.5" fill={line} />
        <rect x="90" y="76" width="38" height="5" rx="2.5" fill={line} />
        <Pill x={90} y={88} w={60} label="llms.txt" dark />
        <path d="M196 34l3.5 9.5L209 47l-9.5 3.5L196 60l-3.5-9.5L183 47l9.5-3.5z" fill={tan} />
        <path d="M36 70l2.4 6.6L45 79l-6.6 2.4L36 88l-2.4-6.6L27 79l6.6-2.4z" fill={tan} opacity="0.7" />
      </>
    );
  else if (id === "robots")
    art = (
      <>
        <rect x="124" y="18" width="12" height="84" rx="4" fill={ink} />
        <rect x="204" y="18" width="12" height="84" rx="4" fill={ink} />
        <rect x="124" y="18" width="92" height="10" rx="5" fill={ink} />
        <Pill x={144} y={64} w={52} label="Allow: /" />
        <AgentDot cx={58} cy={60} r={22} />
        <path d="M86 60h28M106 53l8 7-8 7" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  else if (id === "openapi")
    art = (
      <>
        {[
          ["GET", "/services", 12],
          ["GET", "/prices", 42],
          ["GET", "/providers", 72],
        ].map(([m, p, y]) => (
          <g key={String(p)}>
            <rect x="34" y={Number(y)} width="172" height="26" rx="13" fill={cream} />
            <rect x="40" y={Number(y) + 5} width="36" height="16" rx="8" fill={ink} />
            <text x="58" y={Number(y) + 16.4} fontSize="8.5" fontWeight="700" textAnchor="middle" fill={cream} fontFamily="ui-monospace, monospace">{m}</text>
            <text x="86" y={Number(y) + 17} fontSize="11" fill="#281910" fontFamily="ui-monospace, monospace">{p}</text>
          </g>
        ))}
      </>
    );
  else
    art = (
      <>
        <rect x="40" y="18" width="160" height="84" rx="14" fill={cream} />
        <rect x="54" y="34" width="24" height="24" rx="7" fill={ink} />
        <rect x="88" y="36" width="70" height="7" rx="3.5" fill={ink} />
        <rect x="88" y="49" width="50" height="5" rx="2.5" fill={line} />
        <Pill x={54} y={70} w={50} label="tools" />
        <Pill x={110} y={70} w={80} label="mcp.json" dark />
      </>
    );
  return (
    <svg viewBox="0 0 240 120" width="100%" height="100%" style={{ maxWidth: 300, fontFamily: "inherit" }} aria-hidden="true">
      {art}
    </svg>
  );
}

/** How far down, or how fast, a swipe must go to close the sheet; anything less springs back. */
const SWIPE_CLOSE_PX = 110;
const SWIPE_CLOSE_SPEED = 0.6; // px per ms

/**
 * Rises from the bottom over a dimmed page. Closing slides it back down before it lets go of the topic. Swiping down
 * closes it too: the drag starts only once the sheet is scrolled to its top, so reading it still scrolls as usual.
 */
export function InfoSheet({ topic, onClose }: { topic: AgentTopicId; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  /** How far the sheet is being dragged down, in px; null when no swipe is under way. */
  const [drag, setDrag] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const info = AGENT_TOPICS[topic];

  const close = () => {
    setDrag(null);
    setShown(false);
    window.setTimeout(onClose, 280);
  };
  const closeRefFn = useRef(close);
  closeRefFn.current = close;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 300);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRefFn.current();
    };
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, []);

  // Swipe down to close. Native listeners, so touchmove can stop the page behind from scrolling while the sheet moves.
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let speed = 0;
    let dragging = false;
    const onStart = (e: TouchEvent) => {
      startY = lastY = e.touches[0]!.clientY;
      lastT = performance.now();
      speed = 0;
      dragging = false;
    };
    const onMove = (e: TouchEvent) => {
      const y = e.touches[0]!.clientY;
      const dy = y - startY;
      if (!dragging) {
        if (dy <= 0 || el.scrollTop > 0) return;
        dragging = true;
        startY = y;
      }
      e.preventDefault();
      const now = performance.now();
      speed = (y - lastY) / Math.max(1, now - lastT);
      lastY = y;
      lastT = now;
      setDrag(Math.max(0, y - startY));
    };
    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      const dist = lastY - startY;
      if (dist > SWIPE_CLOSE_PX || (dist > 24 && speed > SWIPE_CLOSE_SPEED)) closeRefFn.current();
      else setDrag(null);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  const dragging = drag !== null;
  /** The dim fades as the sheet is pulled down. */
  const dim = shown ? 0.45 * (dragging ? Math.max(0, 1 - drag / 400) : 1) : 0;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={info.question}>
      <div className="absolute inset-0 bg-[#281910]" style={{ opacity: dim, transition: dragging ? "none" : "opacity 280ms ease" }} onClick={close} />
      <div
        ref={sheetRef}
        className="relative w-full max-w-[560px] max-h-[90svh] overflow-y-auto overscroll-contain rounded-t-[28px] bg-[#FFFCF1] px-[20px] pt-[10px] text-[#281910] shadow-[0_-12px_40px_rgba(40,25,16,0.18)]"
        style={{
          transform: !shown ? "translateY(100%)" : dragging ? `translateY(${drag}px)` : "none",
          transition: dragging ? "none" : "transform 340ms cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom: "calc(max(16px, env(safe-area-inset-bottom)) + 12px)",
        }}
      >
        <div className="relative flex items-center justify-center h-[28px]">
          <span className="block w-[40px] h-[4px] rounded-full bg-[#28191026]" aria-hidden="true" />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-0 top-0 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#F4EEDF] hover:bg-[#EEE6D6] transition-colors duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mt-[6px] h-[148px] rounded-[20px] bg-[#F4EEDF] flex items-center justify-center overflow-hidden">
          <Drawing id={topic} />
        </div>
        <h2 className={`${DISPLAY} mt-[20px] text-[30px] leading-[34px] tracking-[-0.02em] [text-wrap:balance]`}>{info.question}</h2>
        <p className="mt-[12px] text-[16px] leading-[25px] text-[#281910E6] [text-wrap:pretty]">{info.what}</p>
        <p className="mt-[16px] text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.12em] text-[#28191080]">{info.whyLabel ?? "Why it helps agents find you"}</p>
        <p className="mt-[6px] text-[16px] leading-[25px] text-[#281910CC] [text-wrap:pretty]">{info.why}</p>
        {info.source && (
        <a
          href={info.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[20px] inline-flex items-center gap-[8px] h-[44px] pl-[18px] pr-[14px] rounded-full bg-[#F4EEDF] text-[14px] font-[600] no-underline hover:bg-[#EEE6D6] transition-colors duration-150"
        >
          Read more
          <span className="font-[500] text-[#28191099]">{info.source.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="text-[#28191099]">
            <path d="M9 5.5l6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
