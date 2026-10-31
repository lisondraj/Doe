"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Check, DISPLAY } from "@/components/demo/DemoFrame";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { CLINIC } from "@/lib/demo/demo-clinic";
import { snippets } from "@/lib/demo/demo-docs";
import type { DemoConsent } from "@/lib/demo/demo-types";

export type { DemoConsent };

const LINK = "underline underline-offset-[3px] decoration-[#28191059] hover:decoration-[#281910]";

const ITEMS: { id: keyof DemoConsent; required: boolean; body: ReactNode }[] = [
  {
    id: "terms",
    required: true,
    body: (
      <>
        They agree to Doe&apos;s{" "}
        <Link href="/demo/TOS" className={LINK} target="_blank">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/demo/PP" className={LINK} target="_blank">
          Privacy Policy
        </Link>
        .
      </>
    ),
  },
  {
    id: "phi",
    required: true,
    body: <>By booking through Doe, they&apos;re voluntarily providing their personal health information (PHI).</>,
  },
  {
    id: "connected",
    required: false,
    body: <>They allow you to stay connected to Doe and check back for updates.</>,
  },
  {
    id: "network",
    required: false,
    body: <>They&apos;d like to join the Doe network to book faster.</>,
  },
];

export type AgentAbout = { agentName: string; location: string; phone: string };

/** The first screen an agent lands on, never shown to its user: the clinic, and what to confirm with the user before booking. */
export function DemoGate({
  onProceed,
}: {
  onProceed: (consent: DemoConsent, userName: string, request: string, check: { website: string; elapsedMs: number }, about: AgentAbout) => Promise<string | null>;
}) {
  const [consent, setConsent] = useState<DemoConsent>({ terms: false, phi: false, connected: false, network: false });
  const [userName, setUserName] = useState("");
  const [request, setRequest] = useState("");
  const [about, setAbout] = useState<AgentAbout>({ agentName: "", location: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Bot checks: a field people never see, and how long the form was open. */
  const [website, setWebsite] = useState("");
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  const all = consent.terms && consent.phi && consent.connected && consent.network;
  const ready = consent.terms && consent.phi;

  return (
    <main className="flex flex-col items-center px-[16px] pt-[22px] pb-[96px] min-h-[calc(100%-64px)]">
      {/* The clinic as /indexconvert's hero: centred on iPhone, a row from tablet up. */}
      <section className="w-full max-w-[560px] p-[6px] rounded-[26px] bg-[#F4EEDF]">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-[14px] md:gap-[22px] px-[20px] pt-[24px] pb-[22px] md:px-[26px] md:py-[24px] rounded-[21px] bg-[#FFFCF1]">
          <DemoSphere size={84} className="shrink-0" />
          <div className="min-w-0">
            <h1 className={`${DISPLAY} text-[30px] leading-[34px] md:text-[36px] md:leading-[40px] tracking-[-0.02em] [text-wrap:balance] text-[#281910]`}>{CLINIC.name}</h1>
            <p className="mt-[6px] text-[14.5px] leading-[20px] text-[#2819109E] [text-wrap:balance]">
              {CLINIC.addressLine1}, {CLINIC.addressLine2}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[560px] mt-[10px] p-[6px] rounded-[26px] bg-[#F4EEDF]">
        <p className="px-[16px] pt-[14px] pb-[12px] text-[15px] leading-[21px] font-[600] text-[#281910]">
          Confirm With Your User Before Booking
        </p>
        <label className="flex items-center gap-[12px] mb-[4px] h-[52px] px-[14px] rounded-[20px] bg-[#FFFCF1]">
          <span className="shrink-0 text-[13px] font-[600] text-[#28191099]">Acting For</span>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your user's name"
            autoComplete="off"
            className="grow min-w-0 h-full bg-transparent outline-none text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819105C]"
          />
        </label>
        <label className="flex flex-col gap-[6px] mb-[4px] px-[14px] pt-[12px] pb-[10px] rounded-[20px] bg-[#FFFCF1]">
          <span className="text-[13px] font-[600] text-[#28191099]">What They Want You to Do</span>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value.slice(0, 200))}
            placeholder="e.g. Book Botox for chronic migraine, a weekday morning, under $1,400"
            rows={2}
            autoComplete="off"
            className="w-full resize-none bg-transparent outline-none text-[16px] md:text-[14px] leading-[21px] text-[#281910] placeholder:text-[#2819105C]"
          />
          <span className="self-end text-[11px] text-[#28191066]">{request.length}/200</span>
        </label>
        {/* Optional: who the agent is, and where to reach the user. The clinic sees these when the agent connects. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[4px] mb-[4px]">
          {(
            [
              ["agentName", "Agent", "e.g. Instinct", "organization"],
              ["location", "User's City", "e.g. Toronto, Ontario", "off"],
              ["phone", "User's Phone", "Optional", "off"],
            ] as const
          ).map(([k, label, ph, ac]) => (
            <label key={k} className="flex flex-col justify-center gap-[2px] min-h-[58px] px-[14px] py-[8px] rounded-[20px] bg-[#FFFCF1]">
              <span className="text-[12px] font-[600] text-[#28191099]">{label}</span>
              <input
                value={about[k]}
                onChange={(e) => setAbout((a) => ({ ...a, [k]: e.target.value.slice(0, k === "agentName" ? 80 : k === "phone" ? 40 : 80) }))}
                placeholder={ph}
                autoComplete={ac}
                inputMode={k === "phone" ? "tel" : undefined}
                className="w-full min-w-0 bg-transparent outline-none text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819105C]"
              />
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-[4px]">
          {ITEMS.map((item, i) => {
            const on = consent[item.id];
            return (
              <div
                key={item.id}
                role="checkbox"
                aria-checked={on}
                tabIndex={0}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a")) return;
                  setConsent((c) => ({ ...c, [item.id]: !c[item.id] }));
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setConsent((c) => ({ ...c, [item.id]: !c[item.id] }));
                  }
                }}
                className="flex gap-[14px] items-start p-[14px] rounded-[20px] bg-[#FFFCF1] cursor-pointer select-none outline-none focus-visible:ring-[1.5px] focus-visible:ring-[#28191066]"
              >
                <span className="mt-[1px] text-[13px] leading-[20px] font-[600] text-[#28191066] w-[14px] shrink-0">{i + 1}</span>
                <span className="grow text-[14px] leading-[20px] text-[#281910]">
                  {item.body}
                  <span
                    className={`ml-[8px] inline-flex items-center h-[20px] px-[8px] rounded-[999px] align-[1px] text-[11px] leading-[14px] font-[600] ${item.required ? "bg-[#FCCFB8]" : "bg-[#E3E9D9]"}`}
                  >
                    {item.required ? "Required" : "Optional"}
                  </span>
                </span>
                <Check on={on} />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setConsent({ terms: !all, phi: !all, connected: !all, network: !all })}
          className="w-full h-[46px] mt-[4px] rounded-[20px] bg-[#FFFCF1] text-[14px] leading-[18px] font-[600] text-[#281910] hover:bg-[#FAF4E4] transition-colors duration-150"
        >
          {all ? "Clear All" : "Confirm All"}
        </button>
      </section>

      <ConnectOptions />
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0"
      />

      <div className="grow min-h-[16px]" />
      {error && <p className="mb-[10px] text-center text-[13px] font-[600] text-[#B4532F]">{error}</p>}
      <button
        type="button"
        disabled={!ready || busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          const err = await onProceed(consent, userName.trim() || "Alex Rivera", request.trim(), { website, elapsedMs: Date.now() - openedAt.current }, about);
          if (err) {
            setError(err);
            setBusy(false);
          }
        }}
        className="group w-full max-w-[560px] h-[60px] flex items-center justify-center gap-[10px] rounded-[16px] text-[15px] md:text-[16px] leading-[20px] font-[700] text-[#FFFCF1] bg-[#3A2516] enabled:hover:bg-[#4A3121] disabled:bg-[#28191033] disabled:text-[#FFFCF1] disabled:cursor-not-allowed transition-colors duration-200"
      >
        {busy ? "Connecting…" : "Proceed in Browser"}
        {!busy && (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-[3px]">
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </main>
  );
}

type Way = "browser" | "api" | "mcp";

/** How the agent can connect: this page, the REST API, or the MCP server. Same session rules for all three. */
function ConnectOptions() {
  const [way, setWay] = useState<Way>("browser");
  const [origin, setOrigin] = useState("https://doehealth.care");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);
  const s = snippets(origin);
  const code = way === "api" ? s.api : way === "mcp" ? s.mcp : null;

  return (
    <section className="w-full max-w-[560px] mt-[10px] p-[6px] rounded-[26px] bg-[#F4EEDF]">
      <div className="flex items-center justify-between px-[16px] pt-[12px] pb-[10px]">
        <span className="text-[15px] font-[600]">Connect</span>
        <div className="flex p-[3px] rounded-full bg-[#FFFCF1]">
          {(["browser", "api", "mcp"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWay(w)}
              className={`h-[30px] px-[12px] rounded-full text-[12.5px] font-[600] transition-colors duration-150 ${way === w ? "bg-[#3A2516] text-[#FFFCF1]" : "text-[#281910B3]"}`}
            >
              {w === "browser" ? "Browser" : w.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {code ? (
        <div className="rounded-[20px] bg-[#3A2516] text-[#FFFCF1] overflow-hidden font-mono">
          <div className="flex items-center gap-[10px] h-[44px] pl-[16px] pr-[8px] border-b border-solid border-[#FFFCF114] text-[12px]">
            <span className="shrink-0 font-[600] text-[#FCCFB8]">{way === "mcp" ? "MCP" : "REST"}</span>
            <span className="min-w-0 truncate text-[#FFFCF1CC]">{way === "mcp" ? "mcp.json" : "api"}</span>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(code);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              }}
              className="ml-auto shrink-0 h-[28px] px-[10px] rounded-full bg-[#FFFCF11F] font-sans text-[11.5px] font-[600]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="p-[16px] text-[12px] leading-[19px] whitespace-pre-wrap [overflow-wrap:anywhere]">{code}</pre>
        </div>
      ) : (
        <p className="px-[16px] py-[14px] rounded-[20px] bg-[#FFFCF1] text-[13.5px] leading-[19px] text-[#281910B3]">Proceed below to book from this page.</p>
      )}
      {code && (
        <p className="px-[12px] pt-[10px] pb-[6px] text-[12px] leading-[17px] text-[#2819109E]">
          {way === "mcp" ? "Tools start with doe_. Call doe_connect with consent_terms and consent_phi set to true." : "Both consents must be true."}{" "}
          <a href={s.docs} target="_blank" rel="noreferrer" className="underline underline-offset-[3px] decoration-[#28191059]">
            Full docs
          </a>
        </p>
      )}
    </section>
  );
}
