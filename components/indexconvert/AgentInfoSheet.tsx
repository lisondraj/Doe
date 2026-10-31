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

export type AgentTopicId = "mcp" | "api" | "pap" | "llms" | "robots" | "openapi" | "card";

type Topic = {
  question: string;
  /** What it is, in a sentence a clinic manager would follow. */
  what: string;
  /** Why it helps a personal agent find and use the clinic, from how those agents work. */
  why: string;
  source: { label: string; href: string };
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

function Drawing({ id }: { id: AgentTopicId }) {
  let art: ReactNode;
  if (id === "mcp")
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

/** Rises from the bottom over a dimmed page. Closing slides it back down before it lets go of the topic. */
export function InfoSheet({ topic, onClose }: { topic: AgentTopicId; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const info = AGENT_TOPICS[topic];

  const close = () => {
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

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={info.question}>
      <div className="absolute inset-0 bg-[#281910]" style={{ opacity: shown ? 0.45 : 0, transition: "opacity 280ms ease" }} onClick={close} />
      <div
        className="relative w-full max-w-[560px] max-h-[90svh] overflow-y-auto overscroll-contain rounded-t-[28px] bg-[#FFFCF1] px-[20px] pt-[10px] text-[#281910] shadow-[0_-12px_40px_rgba(40,25,16,0.18)]"
        style={{
          transform: shown ? "none" : "translateY(100%)",
          transition: "transform 340ms cubic-bezier(0.32, 0.72, 0, 1)",
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
        <p className="mt-[16px] text-[11.5px] leading-[16px] font-[700] uppercase tracking-[0.12em] text-[#28191080]">Why it helps agents find you</p>
        <p className="mt-[6px] text-[16px] leading-[25px] text-[#281910CC] [text-wrap:pretty]">{info.why}</p>
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
      </div>
    </div>,
    document.body,
  );
}
