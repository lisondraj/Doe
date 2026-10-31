"use client";

/**
 * /demo/clinic — Dr. Brooks' side of /demo, live: every agent that connects (browser, API or MCP), what each one
 * does, and the clinic's answers, offers and booking decisions. Built in /doehealthproduct's design: an ink rail that
 * expands to show labels, a cream shell with rounded corners, toned tiles and cards, and Mackinac display titles.
 * On iPhone the rail becomes a tab bar at the bottom of the brown frame, and lists open their detail as a full page.
 */
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { Check, DISPLAY } from "@/components/demo/DemoFrame";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { FormsLibrary } from "@/components/demo/DemoClinicForms";
import { Integrations } from "@/components/demo/DemoClinicIntegrations";
import { AgentAvatar, CHANNEL_LONG, LiveSession, LiveVisit, NOTICE_CSS, NoticeStack, useNotices } from "@/components/demo/DemoClinicLive";
import { Card, CardTitle, Empty, PageTitle, Segmented, Switch, SyncDot, Tag } from "@/components/demo/DemoClinicUi";
import { INTAKE_FIELDS, BUNDLES, CLINIC, SERVICES, money } from "@/lib/demo/demo-clinic";
import { API_BASE, MCP_PATH } from "@/lib/demo/demo-docs";
import type { ClinicAction, DemoStatus } from "@/lib/demo/demo-engine";
import type { ClinicStatePayload } from "@/lib/demo/demo-service";
import type { DemoConfig, DemoThreadId } from "@/lib/demo/demo-types";
import { dmSans, lora } from "@/lib/home/fonts";

type Tab = "overview" | "inbox" | "schedule" | "services" | "forms" | "integrations";
type Session = ClinicStatePayload["sessions"][number];
type InboxFilter = "all" | "you" | "live" | "booked";
type Act = (id: string, a: ClinicAction, done?: string) => Promise<void>;

const POLL_MS = 3000;
const RAIL_COLLAPSED = 64;
const RAIL_EXPANDED = 232;
const RAIL_KEY = "doe-clinic-rail";
/** The agent discount /demo applies when no price was negotiated (see demo-engine). */
const AGENT_DISCOUNT = 0.05;

const STATUS: Record<DemoStatus, { bg: string; fg: string }> = {
  "Ready to confirm": { bg: "#FCCFB8", fg: "#140C04" },
  Negotiating: { bg: "#F3E2B4", fg: "#281910" },
  Holding: { bg: "#F3E7C9", fg: "#281910" },
  Booked: { bg: "#D6DEC6", fg: "#2F3B2A" },
  Declined: { bg: "#E6E0D2", fg: "#281910B3" },
  "Forms returned": { bg: "#E3E9D9", fg: "#2F3B2A" },
  Browsing: { bg: "#F4EEDF", fg: "#281910" },
};

const THREADS: { id: DemoThreadId; label: string }[] = [
  { id: "concierge", label: "Concierge" },
  { id: "negotiate", label: "Pricing" },
  { id: "forms", label: "Forms" },
];

const QUICK_REPLIES: Record<DemoThreadId, string[]> = {
  concierge: ["Thanks, Dr. Brooks is reviewing this now.", "We'll confirm within the hour.", "Could you share a few other times that work?"],
  negotiate: ["That's the best we can do for this plan.", "The Start bundle is better value for a first visit."],
  forms: ["Thanks, we have the forms.", "Please finish the remaining assessments before the visit."],
};

const CHANNEL = { browser: "Browser", api: "API", mcp: "MCP" } as const;
const needsYou = (s: Session) => s.status === "Ready to confirm" || s.status === "Negotiating";

const ago = (iso: string, now: number) => {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
};
const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

const TABS: { id: Tab; label: string; short: string; icon: ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    short: "Today",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3.5" y="13" width="17" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </>
    ),
  },
  {
    id: "inbox",
    label: "Interface",
    short: "Inbox",
    icon: (
      <>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3h0A1.5 1.5 0 0 1 4 11.5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M19 9.5a1.5 1.5 0 0 1 1 1.4v4.6a1.5 1.5 0 0 1-1.5 1.5H18v3l-3.5-3H12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "schedule",
    label: "Schedule",
    short: "Schedule",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "services",
    label: "Services",
    short: "Services",
    icon: (
      <>
        <path d="M9 7h10M9 12h10M9 17h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="5" cy="7" r="1.2" fill="currentColor" />
        <circle cx="5" cy="12" r="1.2" fill="currentColor" />
        <circle cx="5" cy="17" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    id: "forms",
    label: "Forms",
    short: "Forms",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "integrations",
    label: "Integrations",
    short: "Connect",
    icon: (
      <>
        <path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3.5a5.5 5.5 0 0 1-11 0z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16.5v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
];

function useClinicState() {
  const [state, setState] = useState<ClinicStatePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/demo/clinic/state", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setState(await res.json());
      setError(null);
      setSyncedAt(Date.now());
    } catch {
      setError("Can't reach the clinic's data. Retrying.");
    }
  }, []);
  /** Polls every 1.5 s while an agent is live, so each step shows as it happens; every 3 s otherwise. */
  const fast = useRef(false);
  const tick = useRef(0);
  useEffect(() => {
    fast.current = Boolean(state?.sessions.some((x) => x.live));
  }, [state]);
  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      tick.current += 1;
      if (document.visibilityState !== "visible") return;
      if (fast.current || tick.current % 2 === 0) void load();
    }, POLL_MS / 2);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const post = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch("/api/demo/clinic/actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      await load();
      return res.ok ? null : ((data.error as string) ?? "That didn't work.");
    },
    [load],
  );
  return { state, error, syncedAt, post, reload: load };
}

export function DemoClinicDashboard() {
  const { state, error, syncedAt, post, reload } = useClinicState();
  const [tab, setTab] = useState<Tab>("overview");
  const [openId, setOpenId] = useState<string | null>(null);
  /** Below lg, the inbox shows either its list or one session's detail. */
  const [detail, setDetail] = useState(false);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [railOpen, setRailOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const flash = useCallback((text: string) => {
    setToast(text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, []);

  /** The tab lives in the URL hash, so a refresh or a shared link opens the same page. */
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (TABS.some((t) => t.id === h)) setTab(h);
    };
    fromHash();
    const stored = window.localStorage.getItem(RAIL_KEY);
    setRailOpen(stored ? stored === "1" : window.innerWidth >= 1440);
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const go = useCallback((t: Tab) => {
    setTab(t);
    if (t !== "inbox") setDetail(false);
    window.history.replaceState(null, "", `#${t}`);
    scroller.current?.scrollTo({ top: 0 });
  }, []);

  const toggleRail = () =>
    setRailOpen((v) => {
      window.localStorage.setItem(RAIL_KEY, v ? "0" : "1");
      return !v;
    });

  /** 1–6 switch tabs on a keyboard, unless you're typing. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      const t = TABS[Number(e.key) - 1];
      if (t) go(t.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  /** Cards for an agent connecting, uploading or passing back forms, and requesting an appointment. */
  const { notices, dismiss } = useNotices(state);
  const [liveId, setLiveId] = useState<string | null>(null);
  const [formsFocus, setFormsFocus] = useState<{ id: string; n: number } | null>(null);

  const act: Act = async (sessionId, action, done) => {
    const err = await post({ session_id: sessionId, ...action });
    flash(err ?? done ?? "Done");
  };
  const setConfig = async (config: Partial<DemoConfig>) => {
    const err = await post({ type: "set_config", config });
    if (err) flash(err);
  };

  const sessions = useMemo(() => state?.sessions ?? [], [state]);
  const visits = useMemo(() => state?.visits ?? [], [state]);
  /** Live view target: a session, or an MCP visit, which becomes its session once the agent starts a booking. */
  const liveVisit = liveId ? (visits.find((v) => v.id === liveId) ?? null) : null;
  const liveSession = liveId ? (sessions.find((x) => x.id === (liveVisit?.sessionId ?? liveId)) ?? null) : null;
  const waiting = sessions.filter(needsYou).length;

  /** The tab's title carries what's waiting, so it shows from another tab. */
  useEffect(() => {
    document.title = `${waiting ? `(${waiting}) ` : ""}Doe | Clinic dashboard`;
  }, [waiting]);

  /** Opens on whoever needs the clinic first, and stays put when another agent connects. */
  useEffect(() => {
    if (openId || !sessions.length) return;
    setOpenId((sessions.find((s) => s.status === "Ready to confirm") ?? sessions[0])!.id);
  }, [openId, sessions]);
  const open = sessions.find((s) => s.id === openId) ?? sessions[0] ?? null;
  const openSession = (id: string) => {
    setOpenId(id);
    setDetail(true);
    go("inbox");
  };

  const page: Record<Tab, ReactNode> = {
    overview: (
      <Overview
        state={state}
        now={now}
        syncedAt={syncedAt}
        onOpen={openSession}
        onWatch={setLiveId}
        visits={visits}
        onWaiting={() => {
          setFilter("you");
          setDetail(false);
          go("inbox");
        }}
        flash={flash}
      />
    ),
    inbox: (
      <Inbox
        sessions={sessions}
        open={open}
        config={state?.config ?? null}
        now={now}
        filter={filter}
        onFilter={setFilter}
        detail={detail}
        onBack={() => setDetail(false)}
        onOpen={(id) => {
          setOpenId(id);
          setDetail(true);
        }}
        onAct={act}
        onWatch={setLiveId}
      />
    ),
    schedule: <Schedule state={state} onOpen={openSession} />,
    services: <Services config={state?.config ?? null} onConfig={setConfig} />,
    forms: <Forms sessions={sessions} focus={formsFocus} onAct={act} />,
    integrations: <Integrations state={state} flash={flash} />,
  };

  return (
    <div
      className={`${dmSans.className} doehealth-product-page fixed inset-0 flex flex-col md:flex-row bg-[#140C04] text-[#281910] antialiased [font-synthesis:none] pt-[max(8px,env(safe-area-inset-top))] pr-[max(8px,env(safe-area-inset-right))] pl-[max(8px,env(safe-area-inset-left))] md:pl-[env(safe-area-inset-left)] md:pb-[max(12px,env(safe-area-inset-bottom))] md:pt-[max(12px,env(safe-area-inset-top))] md:pr-[max(12px,env(safe-area-inset-right))]`}
    >
      {/* Desktop rail, as /doehealthproduct's: icons, expanding to show labels. */}
      <nav
        aria-label="Clinic"
        className="doe-rail hidden md:flex flex-col shrink-0 overflow-hidden px-[12px] pt-[14px] pb-[4px]"
        data-expanded={railOpen}
        style={{ width: railOpen ? RAIL_EXPANDED : RAIL_COLLAPSED, transition: "width 200ms ease" }}
      >
        <div className="flex items-center gap-[10px] h-[40px] whitespace-nowrap">
          <span className={`${lora.className} w-[40px] shrink-0 text-center text-[28px] leading-[28px] font-[600] text-[#FFFCF1]`}>D</span>
          <span className="doe-nav-label flex flex-col min-w-0">
            <span className="truncate text-[13px] leading-[16px] font-[600] text-[#FFFCF1]">Brooks Migraine</span>
            <span className="truncate text-[11.5px] leading-[14px] text-[#FFFCF180]">Toronto · Clinic View</span>
          </span>
        </div>
        <div className="flex flex-col gap-[10px] mt-[40px]">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={t.label}
              title={railOpen ? undefined : `${t.label} (${i + 1})`}
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => go(t.id)}
              className="doe-nav-item relative w-full h-[40px] shrink-0 flex items-center rounded-[10px] whitespace-nowrap"
            >
              <span className="relative w-[40px] h-[40px] shrink-0 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  {t.icon}
                </svg>
                {t.id === "inbox" && waiting > 0 && !railOpen && <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#FCCFB8] ring-2 ring-[#140C04]" />}
              </span>
              <span className="doe-nav-label grow text-left text-[14px] leading-[18px] font-[500]">{t.label}</span>
              {t.id === "inbox" && waiting > 0 && (
                <span className="doe-nav-label mr-[10px] min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#FCCFB8] text-[11px] font-[700] text-[#140C04]">{waiting}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-[10px] mt-auto">
          <a
            href="/demo"
            target="_blank"
            rel="noreferrer"
            aria-label="Open /demo as an agent"
            title={railOpen ? undefined : "Open /demo as an agent"}
            className="doe-nav-item w-full h-[40px] shrink-0 flex items-center rounded-[10px] whitespace-nowrap"
          >
            <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v3.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2H10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="doe-nav-label text-[14px] leading-[18px] font-[500]">Try as an Agent</span>
          </a>
          <button
            type="button"
            aria-label={railOpen ? "Collapse" : "Expand"}
            onClick={toggleRail}
            className="doe-nav-item w-full h-[40px] shrink-0 flex items-center rounded-[10px] whitespace-nowrap"
          >
            <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <path d="M9.5 4.5v15" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <path d={railOpen ? "M16 9.5l-2.5 2.5 2.5 2.5" : "M13.5 9.5l2.5 2.5-2.5 2.5"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="doe-nav-label text-[14px] leading-[18px] font-[500]">{railOpen ? "Collapse" : "Expand"}</span>
          </button>
          <div className="flex items-center h-[48px] whitespace-nowrap" title={`${CLINIC.doctor} · ${CLINIC.name}`}>
            <span className="w-[40px] h-[48px] shrink-0 flex items-center justify-center">
              <HalftoneDisc size={32} step={4.4} maxDot={1.7} color="#E8A585" />
            </span>
            <span className="doe-nav-label flex flex-col min-w-0 pl-[2px]">
              <span className="truncate text-[14px] leading-[18px] font-[600] text-[#FFFCF1]">{CLINIC.doctor}</span>
              <span className="truncate text-[12px] leading-[16px] text-[#FFFCF199]">Owner</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="relative grow min-h-0 min-w-0 overflow-clip rounded-[34px] md:rounded-[24px] bg-[#FFFCF1]">
        <div ref={scroller} className="absolute inset-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          {/* iPhone top bar: the Doe mark, sync state and the clinic. */}
          <div className="md:hidden sticky top-0 z-20 flex items-center justify-between gap-[10px] h-[60px] px-[18px] bg-[#FFFCF1E6] backdrop-blur-[12px]">
            <span className={`${lora.className} text-[30px] leading-[30px] font-normal text-[#3A2516]`}>Doe</span>
            <span className="flex items-center gap-[8px] min-w-0">
              <SyncDot ok={!error} />
              <span className="truncate h-[32px] px-[12px] flex items-center rounded-full bg-[#140C04] text-[#FFFCF1] text-[12.5px] font-[600]">Brooks Migraine</span>
            </span>
          </div>
          <div key={tab} className="doe-menu-in px-[14px] sm:px-[20px] md:px-[28px] lg:px-[40px] pt-[6px] md:pt-[30px] pb-[32px] md:pb-[40px] max-w-[1480px] mx-auto">
            {error && <p className="mb-[12px] px-[14px] py-[10px] rounded-[14px] bg-[#FBEDE4] text-[13px] font-[600] text-[#B4532F]">{error}</p>}
            {page[tab]}
            {!state && !error && (
              <button type="button" onClick={() => void reload()} className="mt-[12px] text-[13px] font-[500] text-[#2819109E] underline underline-offset-2">
                Taking a while? Retry
              </button>
            )}
          </div>
        </div>
        <style>{NOTICE_CSS}</style>
        {liveSession && state && <LiveSession key={liveSession.id} s={liveSession} availability={state.availability} onClose={() => setLiveId(null)} onAct={act} />}
        {!liveSession && liveVisit && <LiveVisit v={liveVisit} onClose={() => setLiveId(null)} />}
        <NoticeStack
          bottom={Boolean(liveId)}
          notices={liveId ? notices.filter((n) => (n.sessionId !== liveId && n.sessionId !== liveSession?.id) || n.kind === "requested") : notices}
          sessions={sessions}
          visits={visits}
          onDismiss={dismiss}
          onWatch={(id) => setLiveId(id)}
          onForms={(id) => {
            setLiveId(null);
            setFormsFocus((f) => ({ id, n: (f?.n ?? 0) + 1 }));
            go("forms");
          }}
          onAct={act}
        />
        {toast && (
          <div
            role="status"
            className="absolute left-1/2 top-[68px] md:top-auto md:bottom-[18px] z-[46] -translate-x-1/2 w-max max-w-[92%] min-h-[40px] px-[18px] py-[10px] flex items-center rounded-[20px] bg-[#140C04] text-[#FFFCF1] text-[13px] leading-[18px] font-[600] shadow-[0_8px_24px_rgba(20,12,4,0.3)] doe-menu-in"
          >
            {toast}
          </div>
        )}
      </div>

      {/* iPhone tab bar, in the brown frame under the cream screen. */}
      <nav aria-label="Clinic" className="md:hidden shrink-0 grid grid-cols-6 pt-[6px] pb-[max(6px,env(safe-area-inset-bottom))]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => go(t.id)}
            className={`relative flex flex-col items-center justify-center gap-[3px] h-[52px] rounded-[14px] transition-colors duration-150 ${tab === t.id ? "text-[#FFFCF1]" : "text-[#FFFCF180]"}`}
          >
            <span className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {t.icon}
              </svg>
              {t.id === "inbox" && waiting > 0 && (
                <span className="absolute -top-[5px] -right-[9px] min-w-[16px] h-[16px] px-[4px] flex items-center justify-center rounded-full bg-[#FCCFB8] text-[10px] font-[700] text-[#140C04]">{waiting}</span>
              )}
            </span>
            <span className="text-[10.5px] leading-[12px] font-[600]">{t.short}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ——— Shared pieces, in /doehealthproduct's language ——— */






function StatusPill({ status }: { status: DemoStatus }) {
  const s = STATUS[status];
  return (
    <span className="shrink-0 h-[26px] px-[10px] flex items-center gap-[6px] rounded-full text-[12px] leading-[16px] font-[500] whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.fg }}>
      {status === "Ready to confirm" && <span className="w-[6px] h-[6px] rounded-full bg-[#C9704B]" />}
      {status === "Ready to confirm" ? "Needs You" : status}
    </span>
  );
}

function ChannelChip({ channel, invert = false }: { channel: Session["channel"]; invert?: boolean }) {
  return (
    <span className={`shrink-0 h-[20px] px-[7px] flex items-center rounded-[6px] font-mono text-[10.5px] font-[500] ${invert ? "bg-[#FFFCF1] text-[#140C04]" : "bg-[#140C04] text-[#FFFCF1]"}`}>{CHANNEL[channel]}</span>
  );
}




function Countdown({ until }: { until: string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const s = Math.max(0, Math.round((Date.parse(until) - Date.now()) / 1000));
  return (
    <span className="[font-variant-numeric:tabular-nums]">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
    </span>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="lg:hidden self-start flex items-center gap-[6px] h-[36px] pl-[10px] pr-[14px] mb-[10px] rounded-full bg-[#F4EEDF] text-[13.5px] font-[500] text-[#281910]">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

function Bars({ rows }: { rows: { name: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="flex flex-col grow justify-around gap-[12px]">
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[72px_1fr_36px] items-center gap-[12px] text-[14px] leading-[18px] font-[500] text-[#281910]">
          <span>{r.name}</span>
          <span className="h-[10px] rounded-full bg-[#FFFCF1CC] overflow-hidden">
            <span className="block h-full rounded-full bg-[#E8A585] transition-[width] duration-500" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="text-right [font-variant-numeric:tabular-nums]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function Ring({ value, size = 120 }: { value: number; size?: number }) {
  const w = 14;
  const r = (size - w) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFFCF1D9" strokeWidth={w} />
      {value > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2F3B2A"
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={`${(c * Math.min(100, value)) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
    </svg>
  );
}

function CopyRow({ label, value, flash }: { label: string; value: string; flash: (t: string) => void }) {
  return (
    <div className="flex items-center gap-[10px] p-[12px] pl-[14px] rounded-[16px] bg-[#FFFCF1CC] min-w-0">
      <span className="grow min-w-0">
        <span className="block text-[12px] font-[600] text-[#2819109E]">{label}</span>
        <span className="block mt-[2px] font-mono text-[12.5px] leading-[17px] break-all">{value || "…"}</span>
      </span>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(
            () => flash(`${label} copied`),
            () => flash("Couldn't copy"),
          );
        }}
        className="shrink-0 h-[34px] px-[14px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[12.5px] font-[500] hover:bg-[#2B1D12] transition-colors duration-150"
      >
        Copy
      </button>
    </div>
  );
}

/* ——— Overview ——— */

function Overview({
  state,
  now,
  syncedAt,
  onOpen,
  onWatch,
  visits,
  onWaiting,
  flash,
}: {
  state: ClinicStatePayload | null;
  now: number;
  syncedAt: number | null;
  onOpen: (id: string) => void;
  onWatch: (id: string) => void;
  visits: ClinicStatePayload["visits"];
  onWaiting: () => void;
  flash: (t: string) => void;
}) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  if (!state) return <PageTitle kicker={CLINIC.name}>Loading…</PageTitle>;
  const a = state.analytics;
  const latest = state.sessions[0];
  const live = state.sessions.filter((s) => s.live);
  /** MCP agents connected but not booking yet. */
  const reading = visits.filter((v) => v.live && !v.sessionId);
  const waiting = state.sessions.filter((s) => needsYou(s) || s.status === "Holding");
  const needCount = state.sessions.filter(needsYou).length;
  const feed = state.sessions
    .flatMap((s) => s.events.map((e) => ({ ...e, sessionId: s.id, who: s.agentName })))
    .sort((x, y) => Date.parse(y.at) - Date.parse(x.at))
    .slice(0, 16);
  const funnel = [
    ["Connected", a.sessions],
    ["Held a Slot", a.held],
    ["Forms Back", a.formsReturned],
    ["Requested", a.requested],
    ["Booked", a.confirmed],
  ] as const;
  const reply = a.medianReplyMs === null ? "—" : a.medianReplyMs < 1000 ? "<1s" : a.medianReplyMs < 60000 ? `${Math.round(a.medianReplyMs / 1000)}s` : `${Math.round(a.medianReplyMs / 60000)}m`;
  const confirmRate = a.requested ? Math.round((a.confirmed / a.requested) * 100) : 0;
  const synced = syncedAt ? Math.max(0, Math.round((now - syncedAt) / 1000)) : null;

  const tile = "relative flex flex-col min-w-0 min-h-[128px] md:min-h-[148px] p-[16px_18px] md:p-[18px_20px] text-left";
  const label = "text-[13px] md:text-[14px] leading-[1.3] font-[500] text-[rgba(40,25,16,0.7)]";
  const value = `mt-auto pt-[10px] text-[34px] leading-[1.05] md:text-[42px] tracking-[-0.03em] ${DISPLAY} text-[#140C04] [font-variant-numeric:tabular-nums] truncate`;
  const note = "mt-[4px] text-[12.5px] md:text-[13.5px] leading-[1.35] text-[#2819109E] truncate";

  return (
    <>
      <PageTitle
        kicker={CLINIC.name}
        right={
          <>
            <span className="hidden md:flex items-center gap-[8px] h-[38px] px-[14px] rounded-full bg-[#F4EEDF] text-[13px] font-[500] text-[#281910]">
              <SyncDot ok />
              Live{synced !== null && <span className="text-[#2819109E]">· synced {synced < 6 ? "now" : `${synced}s ago`}</span>}
            </span>
            <DemoSphere size={56} className="hidden sm:block" />
          </>
        }
      >
        Agents
      </PageTitle>

      {latest ? (
        <button
          type="button"
          onClick={() => onOpen(latest.id)}
          className="relative w-full mb-[10px] flex items-center gap-[14px] p-[14px] md:p-[16px_20px] rounded-[24px] bg-[#140C04] text-[#FFFCF1] text-left overflow-hidden hover:bg-[#21160D] transition-colors duration-150"
        >
          <HalftoneDisc size={150} step={7} color="#E8A585" opacity={0.28} className="absolute right-[-36px] top-[-50px]" />
          <span className="relative">
            <AgentAvatar name={latest.agentName} size={40} />
          </span>
          <span className="relative grow min-w-0">
            <span className="flex items-center gap-[8px] min-w-0">
              <ChannelChip channel={latest.channel} invert />
              <span className="truncate text-[14.5px] font-[600]">
                {latest.live ? "Connected now" : "Last connected"}: {latest.agentName} for {latest.userName}
              </span>
            </span>
            <span className="block mt-[3px] truncate text-[12.5px] text-[#FFFCF199]">
              {ago(latest.createdAt, now)} · {latest.status} · <span className="font-mono">{latest.id}</span>
            </span>
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onWatch(latest.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                onWatch(latest.id);
              }
            }}
            className="relative shrink-0 h-[34px] px-[14px] flex items-center gap-[6px] rounded-full bg-[#FFFCF1] text-[#140C04] text-[13px] font-[600]"
          >
            {latest.live && <span className="w-[6px] h-[6px] rounded-full bg-[#C9704B]" />}
            {latest.live ? "Watch Live" : "Replay"}
          </span>
        </button>
      ) : (
        <div className="mb-[10px]">
          <Empty>No agents have connected yet. Open /demo, or point an agent at the API or MCP endpoint below.</Empty>
        </div>
      )}

      {/* Today at a glance, in /doehealthproduct's Interface status tiles. */}
      <div className="grid grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] gap-[8px] md:gap-[10px] mb-[10px]">
        <div className={`${tile} col-span-2 lg:col-span-1 rounded-[22px] lg:rounded-l-[24px] lg:rounded-r-[4px] border-[1.5px] border-dashed border-[#2819102E] bg-[#FAF6EC]`}>
          <span className={label}>Live Now · {a.live + reading.length}</span>
          <span className="mt-auto pt-[10px] flex flex-col gap-[8px]">
            {live.length === 0 && !reading.length && <span className="text-[13.5px] text-[#2819109E]">No agent is connected right now.</span>}
            {reading.slice(0, 2).map((v) => (
              <button key={v.id} type="button" onClick={() => onWatch(v.id)} className="flex items-center gap-[10px] min-w-0 text-left">
                <span className="relative shrink-0">
                  <AgentAvatar name={v.agentName} size={28} />
                  <span className="absolute -right-[2px] -bottom-[2px] w-[10px] h-[10px] rounded-full border-[2px] border-solid border-[#FAF6EC] bg-[#E8A585]" />
                </span>
                <span className="truncate text-[14px] leading-[18px] font-[600]">{v.agentName}</span>
                <span className="truncate text-[12.5px] leading-[17px] text-[#2819109E]">reading the clinic via MCP</span>
              </button>
            ))}
            {live.slice(0, 3).map((s) => (
              <button key={s.id} type="button" onClick={() => onWatch(s.id)} className="flex items-center gap-[10px] min-w-0 text-left">
                <span className="relative shrink-0">
                  <AgentAvatar name={s.agentName} size={28} />
                  <span className="absolute -right-[2px] -bottom-[2px] w-[10px] h-[10px] rounded-full border-[2px] border-solid border-[#FAF6EC] bg-[#6E9A5B]" />
                </span>
                <span className="truncate text-[14px] leading-[18px] font-[600] text-[#281910]">{s.agentName}</span>
                <span className="truncate text-[12.5px] leading-[17px] text-[#2819109E]">for {s.userName}</span>
              </button>
            ))}
          </span>
        </div>
        <div className={`${tile} rounded-[22px] lg:rounded-[4px] bg-[#F4EEDF]`}>
          <span className={label}>Agents Connected</span>
          <span className={value}>{a.sessions}</span>
          <span className={note}>{a.agentActions} agent actions</span>
        </div>
        <div className={`${tile} rounded-[22px] lg:rounded-[4px] bg-[#E3E9D9]`}>
          <span className={label}>Booked Revenue</span>
          <span className={value}>{money(a.revenue)}</span>
          <span className={note}>
            {a.confirmed} of {a.requested} confirmed
          </span>
        </div>
        <button
          type="button"
          onClick={onWaiting}
          disabled={needCount === 0}
          className={`${tile} col-span-2 sm:col-span-1 rounded-[22px] lg:rounded-l-[4px] lg:rounded-r-[24px] transition-colors duration-150 ${needCount ? "bg-[#F8D9C6] hover:bg-[#F6CFB8]" : "bg-[#E3E9D9] cursor-default"}`}
        >
          <span className={label}>Waiting on You</span>
          <span className={value}>{needCount}</span>
          <span className={note}>{needCount ? "Open in the inbox" : "All clear"}</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-[10px] md:gap-[12px]">
        <Card className="col-span-12 lg:col-span-7">
          <CardTitle title="Funnel" note="From first connection to a booked visit" right={<Tag>{a.sessions ? Math.round((a.confirmed / a.sessions) * 100) : 0}% booked</Tag>} />
          <div className="flex flex-col gap-[8px]">
            {funnel.map(([k, n], i) => {
              const pct = a.sessions ? (n / a.sessions) * 100 : 0;
              return (
                <div key={k} className="grid grid-cols-[96px_1fr_44px] sm:grid-cols-[110px_1fr_60px] items-center gap-[10px]">
                  <span className="text-[13.5px] font-[500] text-[#281910] truncate">{k}</span>
                  <span className="h-[30px] rounded-[10px] bg-[#FFFCF1CC] overflow-hidden">
                    <span
                      className="block h-full rounded-[10px] transition-[width] duration-500"
                      style={{ width: `${Math.max(pct, n ? 4 : 0)}%`, backgroundColor: i === funnel.length - 1 ? "#2F3B2A" : i === 0 ? "#E8A585" : "#F0B496" }}
                    />
                  </span>
                  <span className={`${DISPLAY} text-right text-[20px] leading-[22px] [font-variant-numeric:tabular-nums]`}>{n}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card tone="#F4EEDF" className="col-span-12 md:col-span-6 lg:col-span-5">
          <CardTitle title="By channel" note="How agents connect" />
          <Bars
            rows={[
              { name: "Browser", value: a.byChannel.browser },
              { name: "API", value: a.byChannel.api },
              { name: "MCP", value: a.byChannel.mcp },
            ]}
          />
        </Card>

        <Card tone="#FBEDE4" className="col-span-12 md:col-span-6 lg:col-span-6">
          <CardTitle title="Waiting on you" note={waiting.length ? `${waiting.length} agent${waiting.length === 1 ? "" : "s"} negotiating, holding or ready` : "Nothing needs you right now"} />
          <div className="flex flex-col gap-[6px]">
            {waiting.length === 0 && <Empty>All clear.</Empty>}
            {waiting.slice(0, 6).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onOpen(s.id)}
                className="flex items-center gap-[12px] min-h-[56px] p-[10px_12px] rounded-[16px] bg-[#FFFCF1CC] text-left hover:bg-[#FFFCF1] transition-colors duration-150"
              >
                <ChannelChip channel={s.channel} />
                <span className="grow min-w-0">
                  <span className="block truncate text-[14px] font-[600]">
                    {s.userName} <span className="font-[500] text-[#2819109E]">· {s.pricing.label}</span>
                  </span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">{s.bookingSlot ?? s.holdSlot ?? `${s.agentName} · ${ago(s.updatedAt, now)}`}</span>
                </span>
                <StatusPill status={s.status} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardTitle title="Activity" note="Every agent and staff action, newest first" />
          <div className="flex flex-col gap-[2px] rounded-[16px] bg-[#FFFCF1CC] p-[6px] max-h-[360px] overflow-y-auto overscroll-contain">
            {feed.length === 0 && <p className="p-[10px] text-[13px] text-[#2819109E]">No activity yet.</p>}
            {feed.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onOpen(e.sessionId)}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-[10px] px-[10px] py-[8px] rounded-[10px] text-left hover:bg-[#F4EEDF] transition-colors duration-150"
              >
                <span className="font-mono text-[11px] leading-[18px] text-[#28191080]">{clock(e.at)}</span>
                <span className="min-w-0 text-[13px] leading-[18px]">
                  <span className="font-[600]">{e.actor === "clinic" ? "Clinic" : e.who}</span> <span className="text-[#281910B3]">{e.summary}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card tone="#E6ECDB" className="col-span-12 sm:col-span-6 lg:col-span-4">
          <CardTitle title="Confirmed" note="Of booking requests" />
          <div className="flex items-center gap-[18px] grow">
            <span className="relative flex items-center justify-center">
              <Ring value={confirmRate} />
              <span className={`absolute text-[30px] leading-[32px] tracking-[-0.03em] ${DISPLAY} text-[#281910]`}>{confirmRate}%</span>
            </span>
            <span className="flex flex-col gap-[8px] grow min-w-0">
              {[
                ["Requested", a.requested],
                ["Booked", a.confirmed],
                ["Holding", a.held],
              ].map(([k, v]) => (
                <span key={k} className="flex items-center justify-between gap-[8px]">
                  <Tag>{k}</Tag>
                  <b className="text-[14px] font-[500] [font-variant-numeric:tabular-nums]">{v}</b>
                </span>
              ))}
            </span>
          </div>
        </Card>

        <Card tone="#F3EBD2" className="col-span-12 sm:col-span-6 lg:col-span-3">
          <CardTitle title="Reply time" note="Clinic, median" />
          <span className={`${DISPLAY} mt-auto text-[52px] leading-[56px] tracking-[-0.03em] text-[#140C04]`}>{reply}</span>
          <span className="mt-[6px] flex flex-wrap gap-[6px]">
            <Tag>{a.openNegotiations} open negotiations</Tag>
          </span>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardTitle title="Agent access" note="Point any agent here" />
          <div className="flex flex-col gap-[6px]">
            <CopyRow label="REST API" value={origin && `${origin}${API_BASE}`} flash={flash} />
            <CopyRow label="MCP Server" value={origin && `${origin}${MCP_PATH}`} flash={flash} />
          </div>
        </Card>
      </div>
    </>
  );
}

/* ——— Interface (agent inbox) ——— */

function Inbox({
  sessions,
  open,
  config,
  now,
  filter,
  onFilter,
  detail,
  onBack,
  onOpen,
  onAct,
  onWatch,
}: {
  sessions: Session[];
  open: Session | null;
  config: DemoConfig | null;
  now: number;
  filter: InboxFilter;
  onFilter: (f: InboxFilter) => void;
  detail: boolean;
  onBack: () => void;
  onOpen: (id: string) => void;
  onAct: Act;
  onWatch: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const match = (s: Session, f: InboxFilter) => (f === "all" ? true : f === "you" ? needsYou(s) : f === "live" ? s.live : s.status === "Booked");
  const list = sessions.filter((s) => match(s, filter) && (!q || `${s.userName} ${s.agentName} ${s.pricing.label} ${s.id}`.toLowerCase().includes(q)));
  const count = (f: InboxFilter) => sessions.filter((s) => match(s, f)).length;
  const youCount = count("you");

  return (
    <>
      <div className={detail ? "hidden lg:block" : ""}>
        <PageTitle kicker="Agent inbox" right={<SearchBox value={query} onChange={setQuery} />}>
          Interface
        </PageTitle>
      </div>
      {sessions.length === 0 ? (
        <Empty>No agent sessions yet. Open /demo in another tab to connect one.</Empty>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)] gap-[12px] items-start">
          <div className={`flex flex-col gap-[10px] min-w-0 lg:sticky lg:top-[30px] ${detail ? "hidden lg:flex" : "flex"}`}>
            <Segmented
              value={filter}
              onChange={onFilter}
              options={(
                [
                  ["all", "All"],
                  ["you", "Needs You"],
                  ["live", "Live"],
                  ["booked", "Booked"],
                ] as const
              ).map(([id, l]) => ({
                id,
                label: (
                  <>
                    {l}
                    {id === "you" && youCount > 0 ? (
                      <span className="flex items-center h-[18px] px-[6px] rounded-full bg-[#FCCFB8] text-[12px] leading-[14px] text-[#140C04]">{youCount}</span>
                    ) : (
                      <span className="text-[12px] opacity-50">{count(id)}</span>
                    )}
                  </>
                ),
              }))}
            />
            <div className="flex flex-col gap-[6px] lg:max-h-[calc(100dvh-230px)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {list.length === 0 && <Empty>Nothing matches.</Empty>}
              {list.map((x) => {
                const selected = x.id === open?.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => onOpen(x.id)}
                    className={`flex flex-col gap-[6px] p-[8px] rounded-[20px] bg-[#F4EEDF] text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${selected ? "lg:outline-[#140C04] outline-transparent" : "outline-transparent hover:outline-[#28191026]"}`}
                  >
                    <span className="flex items-center gap-[10px] min-w-0 h-[34px] px-[6px]">
                      <span className="relative shrink-0">
                        <AgentAvatar name={x.agentName} size={28} />
                        {x.live && <span className="absolute -right-[2px] -bottom-[2px] w-[10px] h-[10px] rounded-full border-[2px] border-solid border-[#F4EEDF] bg-[#6E9A5B]" />}
                      </span>
                      <span className="truncate text-[14px] leading-[18px] font-[600] text-[#281910]">{x.userName}</span>
                      <span className="truncate text-[12px] leading-[16px] text-[#2819109E]">{x.live ? "Live" : ago(x.updatedAt, now)}</span>
                      <span className="ml-auto">
                        <StatusPill status={x.status} />
                      </span>
                    </span>
                    <span className="flex items-center gap-[8px] min-w-0 p-[10px_12px] rounded-[14px] bg-[#FFFCF1]">
                      <ChannelChip channel={x.channel} />
                      <span className="truncate text-[13px] leading-[18px] text-[#281910]">
                        {x.agentName} · {x.pricing.label}
                      </span>
                      <span className="ml-auto shrink-0 text-[13px] font-[600] [font-variant-numeric:tabular-nums]">{money(x.booking.total ?? x.pricing.total)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {open && (
            <div className={`min-w-0 flex-col ${detail ? "flex" : "hidden lg:flex"}`}>
              <BackButton onClick={onBack} label="Inbox" />
              <SessionDetail key={open.id} s={open} config={config} now={now} onAct={onAct} onWatch={() => onWatch(open.id)} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-[8px] w-full sm:w-[280px] h-[40px] px-[14px] rounded-full bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus-within:border-[#140C04] text-[#2819109E] transition-colors duration-150">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search patients or agents"
        className="grow min-w-0 bg-transparent outline-none text-[16px] md:text-[14px] leading-[18px] font-[500] text-[#281910] placeholder:text-[#2819109E]"
      />
    </label>
  );
}

function SessionDetail({ s, config, now, onAct, onWatch }: { s: Session; config: DemoConfig | null; now: number; onAct: Act; onWatch: () => void }) {
  const [thread, setThread] = useState<DemoThreadId>(s.status === "Negotiating" ? "negotiate" : "concierge");
  const [reply, setReply] = useState("");
  const [offer, setOffer] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const msgs = s.threads[thread];
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, thread]);

  const run = async (a: ClinicAction, done: string) => {
    setBusy(true);
    await onAct(s.id, a, done);
    setBusy(false);
  };
  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    void run({ type: "send_message", thread, text: t }, "Sent");
    setReply("");
  };
  const makeOffer = (n: number) => {
    if (!n) return;
    void run({ type: "make_offer", price: n }, `Offered ${money(n)}`);
    setOffer("");
  };
  const floor = config ? Math.round((s.pricing.list * config.floorPct) / 5) * 5 : null;
  const suggested = [
    { label: "List", price: s.pricing.list },
    { label: "−5%", price: Math.round((s.pricing.list * (1 - AGENT_DISCOUNT)) / 5) * 5 },
    ...(floor ? [{ label: "Floor", price: floor }] : []),
  ];

  return (
    <div className="flex flex-col gap-[10px] min-w-0">
      <div className="relative overflow-hidden flex flex-col gap-[12px] p-[16px] md:p-[20px_22px] rounded-[24px] md:rounded-[28px] bg-[#FAF6EC]">
        <div className="flex items-start gap-[12px]">
          <AgentAvatar name={s.agentName} size={44} />
          <div className="grow min-w-0">
            <div className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em] truncate`}>{s.userName}</div>
            <div className="mt-[2px] text-[13px] leading-[18px] text-[#2819109E] truncate">
              {s.agentName} via {CHANNEL_LONG[s.channel]} · {s.live ? "live" : `seen ${ago(s.lastSeenAt, now)}`}
            </div>
            {(s.userLocation || s.userPhone || s.forms.intake.phone) && (
              <div className="mt-[2px] text-[13px] leading-[18px] text-[#281910CC] truncate">
                {[s.userLocation, s.userPhone || s.forms.intake.phone].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
          <span className="flex flex-col items-end gap-[6px] shrink-0">
            <StatusPill status={s.status} />
            <button type="button" onClick={onWatch} className="h-[30px] px-[12px] flex items-center gap-[6px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[12.5px] font-[600]">
              {s.live && <span className="w-[6px] h-[6px] rounded-full bg-[#E8A585] doe-ripple" />}
              {s.live ? "Watch Live" : "Replay"}
            </button>
          </span>
        </div>
        {s.request && <p className="px-[14px] py-[10px] rounded-[14px] bg-[#FFFCF1CC] text-[13.5px] leading-[19px] text-[#281910]">“{s.request}”</p>}
        <div className="flex flex-wrap gap-[6px]">
          {(
            [
              ["Terms", s.consent.terms],
              ["PHI", s.consent.phi],
              ["Stays Connected", s.consent.connected],
              ["Doe Network", s.consent.network],
            ] as const
          ).map(([k, on]) => (
            <span key={k} className={`h-[26px] px-[10px] flex items-center gap-[5px] rounded-full text-[12px] font-[500] ${on ? "bg-[#D6DEC6] text-[#2F3B2A]" : "text-[#28191066] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.15)]"}`}>
              {on ? "✓" : "–"} {k}
            </span>
          ))}
          {s.identity && (
            <span className={`h-[26px] px-[10px] flex items-center gap-[5px] rounded-full text-[12px] font-[500] ${s.identity.status === "verified" ? "bg-[#D6DEC6] text-[#2F3B2A]" : "bg-[#F3E2B4] text-[#281910]"}`}>
              {s.identity.status === "verified" ? `✓ ID Verified${s.identity.method === "face-id" ? " · Face ID" : ""}` : "ID Check Sent"}
            </span>
          )}
          {s.identity?.license && (
            <a href={`/api/demo/clinic/id?session_id=${encodeURIComponent(s.id)}`} target="_blank" rel="noreferrer" className="h-[26px] px-[10px] flex items-center rounded-full text-[12px] font-[600] bg-[#140C04] text-[#FFFCF1]">
              View Licence
            </a>
          )}
          <span className="h-[26px] px-[10px] flex items-center rounded-full font-mono text-[11px] text-[#2819109E] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.12)] truncate max-w-full">{s.id}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
          <Fact k="Plan" v={s.pricing.label} />
          <Fact k="Price" v={`${money(s.booking.total ?? s.pricing.total)}${s.pricing.deal ? " · negotiated" : ""}`} />
          <Fact k={s.booking.slotId ? "Booking" : "Hold"} v={s.bookingSlot ?? s.holdSlot ?? "None"} />
        </div>

        {s.booking.status === "requested" && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-[8px] p-[10px] rounded-[18px] bg-[#F8D9C6]">
            <span className="grow px-[6px] text-[13.5px] leading-[18px] font-[600]">Booking request · PHI provided via Doe</span>
            <div className="flex gap-[6px]">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason (Optional)"
                className="grow sm:grow-0 sm:w-[160px] min-w-0 h-[40px] px-[14px] rounded-full bg-[#FFFCF1] text-[16px] md:text-[13px] outline-none"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  void run({ type: "decline_booking", note }, "Booking declined");
                  setNote("");
                }}
                className="shrink-0 h-[40px] px-[14px] rounded-full bg-[#28191014] hover:bg-[#2819101F] text-[13.5px] font-[500] disabled:opacity-50"
              >
                Decline
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void run({ type: "confirm_booking" }, "Booking confirmed")}
                className="shrink-0 h-[40px] px-[18px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13.5px] font-[500] hover:bg-[#2B1D12] disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
        {s.hold && (
          <div className="flex items-center gap-[8px] p-[8px] pl-[14px] rounded-[18px] bg-[#F3E7C9]">
            <span className="grow min-w-0 text-[13px] leading-[18px] font-[600]">
              <span className="block truncate">Holding {s.holdSlot}</span>
              <span className="block text-[12px] font-[500] text-[#2819109E]">
                Releases in <Countdown until={s.hold.expiresAt} />
              </span>
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => void run({ type: "release_hold" }, "Hold released")}
              className="shrink-0 h-[36px] px-[14px] rounded-full bg-[#FFFCF1] text-[13px] font-[500] disabled:opacity-50"
            >
              Release
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-[24px] md:rounded-[28px] bg-[#F4EEDF] p-[6px]">
        <Segmented
          value={thread}
          onChange={setThread}
          className="bg-transparent"
          options={THREADS.map((t) => ({ id: t.id, label: `${t.label} · ${s.threads[t.id].filter((m) => m.from !== "system").length}` }))}
        />
        <div ref={list} className="flex flex-col gap-[10px] min-h-[160px] max-h-[48dvh] lg:max-h-[420px] overflow-y-auto overscroll-contain px-[10px] py-[12px]">
          {msgs.length === 0 && <p className="self-center my-auto text-[13px] text-[#2819109E]">No messages in this thread yet.</p>}
          {msgs.map((l) =>
            l.from === "system" ? (
              <p key={l.id} className="self-center text-center text-[11.5px] font-[500] text-[#28191080]">
                {l.text}
              </p>
            ) : (
              <div key={l.id} className={`flex flex-col max-w-[86%] gap-[4px] ${l.from === "clinic" ? "self-end items-end" : "self-start items-start"}`}>
                <span className="px-[4px] text-[11px] leading-[14px] font-[600] text-[#2819109E]">
                  {l.from === "clinic" ? (l.by === "staff" ? "Clinic staff" : "Clinic agent") : s.agentName} · {clock(l.at)}
                </span>
                <span
                  className={`px-[14px] py-[10px] text-[14px] leading-[20px] ${
                    l.from === "clinic" ? `rounded-[18px] rounded-br-[6px] ${l.by === "staff" ? "bg-[#281910]" : "bg-[#140C04]"} text-[#FFFCF1]` : "rounded-[18px] rounded-bl-[6px] bg-[#FFFCF1] text-[#281910]"
                  }`}
                >
                  {l.text}
                  {l.offer && (
                    <span className="flex flex-wrap items-center gap-[6px] mt-[8px]">
                      <span className={`h-[22px] px-[8px] flex items-center rounded-full text-[11.5px] font-[700] ${l.from === "clinic" ? "bg-[#FFFCF11F]" : "bg-[#F4EEDF]"}`}>
                        Offer {money(l.offer.price)}
                      </span>
                      <span className="text-[11.5px] font-[600] opacity-75">{l.offer.label}</span>
                      {l.offer.list && l.offer.list > l.offer.price && <span className="text-[11.5px] font-[600] opacity-75">· save {money(l.offer.list - l.offer.price)}</span>}
                      <span className="text-[11.5px] font-[600] opacity-75 capitalize">{l.offer.status}</span>
                    </span>
                  )}
                </span>
              </div>
            ),
          )}
        </div>

        <div className="flex flex-col gap-[6px] p-[4px]">
          <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {thread === "negotiate"
              ? suggested.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    disabled={busy}
                    onClick={() => makeOffer(o.price)}
                    className="shrink-0 h-[32px] px-[12px] rounded-full bg-[#FFFCF1] text-[12.5px] font-[500] text-[#281910] hover:bg-[#FFFCF1CC] disabled:opacity-50"
                  >
                    Offer {o.label} · {money(o.price)}
                  </button>
                ))
              : QUICK_REPLIES[thread].map((t) => (
                  <button key={t} type="button" disabled={busy} onClick={() => send(t)} className="shrink-0 h-[32px] px-[12px] rounded-full bg-[#FFFCF1] text-[12.5px] font-[500] text-[#281910] hover:bg-[#FFFCF1CC] disabled:opacity-50">
                    {t}
                  </button>
                ))}
          </div>
          {thread === "negotiate" && (
            <form
              className="flex items-center gap-[8px] h-[46px] pl-[16px] pr-[4px] rounded-full bg-[#FFFCF1] border-[1.5px] border-solid border-transparent focus-within:border-[#140C04] transition-colors duration-150"
              onSubmit={(e) => {
                e.preventDefault();
                makeOffer(Number(offer.replace(/[^\d]/g, "")));
              }}
            >
              <span className="text-[14px] font-[600] text-[#2819109E]">$</span>
              <input
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder={`Custom price for ${s.pricing.label}`}
                inputMode="numeric"
                enterKeyHint="send"
                className="grow min-w-0 bg-transparent outline-none text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819109E]"
              />
              <button type="submit" disabled={busy} className="shrink-0 h-[38px] px-[16px] rounded-full bg-[#28191014] hover:bg-[#2819101F] text-[13.5px] font-[500] disabled:opacity-50">
                Offer
              </button>
            </form>
          )}
          <form
            className="flex items-center gap-[8px] h-[46px] pl-[16px] pr-[4px] rounded-full bg-[#FFFCF1] border-[1.5px] border-solid border-transparent focus-within:border-[#140C04] transition-colors duration-150"
            onSubmit={(e) => {
              e.preventDefault();
              send(reply);
            }}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Reply to ${s.agentName} as clinic staff`}
              enterKeyHint="send"
              className="grow min-w-0 bg-transparent outline-none text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819109E]"
            />
            <button type="submit" aria-label="Send" disabled={busy} className="w-[38px] h-[38px] shrink-0 flex items-center justify-center rounded-full bg-[#140C04] hover:bg-[#2B1D12] transition-colors duration-150 disabled:opacity-50">
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <UploadsPanel s={s} onAct={onAct} />

      <details className="group rounded-[24px] md:rounded-[28px] bg-[#FAF6EC] p-[14px_16px] md:p-[16px_22px]" open>
        <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <span className={`${DISPLAY} text-[20px] leading-[24px] text-[#281910]`}>Actions</span>
          <span className="flex items-center gap-[8px] text-[12.5px] font-[500] text-[#2819109E]">
            {s.events.length}
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </summary>
        <div className="mt-[10px] flex flex-col max-h-[260px] overflow-y-auto overscroll-contain rounded-[16px] bg-[#FFFCF1CC] p-[6px]">
          {[...s.events].reverse().map((e) => (
            <div key={e.id} className="grid grid-cols-[60px_44px_minmax(0,1fr)] sm:grid-cols-[72px_56px_minmax(0,1fr)] gap-[8px] px-[8px] py-[6px] text-[12.5px] leading-[17px]">
              <span className="font-mono text-[#28191080]">{clock(e.at)}</span>
              <span className="font-mono text-[10.5px] leading-[17px] text-[#2819109E] uppercase">{e.channel}</span>
              <span className="text-[#281910CC]">{e.summary}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-[2px] p-[10px_12px] rounded-[14px] bg-[#FFFCF1CC] min-w-0">
      <span className="text-[12px] font-[500] text-[#2819109E]">{k}</span>
      <span className="text-[14px] font-[600] truncate">{v}</span>
    </div>
  );
}

/* ——— Schedule ——— */

const SLOT_TONE = { Open: "#F4EEDF", Held: "#F3E7C9", Requested: "#FCCFB8", Booked: "#D6DEC6" } as const;

function Schedule({ state, onOpen }: { state: ClinicStatePayload | null; onOpen: (id: string) => void }) {
  const [provider, setProvider] = useState<string>("all");
  if (!state) return <PageTitle>Schedule</PageTitle>;
  const now = Date.now();
  const who = (id?: string) => state.sessions.find((s) => s.id === id);
  const providers = Array.from(new Set(state.availability.flatMap((d) => d.slots.map((x) => x.provider))));
  const labelOf = (id: string): keyof typeof SLOT_TONE => {
    const st = state.slots[id];
    const taken = Boolean(st && (st.kind !== "held" || (st.until && Date.parse(st.until) > now)));
    return !taken ? "Open" : st!.kind === "booked" ? "Booked" : st!.kind === "requested" ? "Requested" : "Held";
  };
  const days = state.availability.map((d) => ({ ...d, slots: d.slots.filter((x) => provider === "all" || x.provider === provider) }));
  const all = days.flatMap((d) => d.slots);
  const totals = (Object.keys(SLOT_TONE) as (keyof typeof SLOT_TONE)[]).map((k) => [k, all.filter((x) => labelOf(x.id) === k).length] as const);

  return (
    <>
      <PageTitle
        kicker={`Nov 2 to 6 · ${all.length} slots`}
        right={
          <Segmented
            value={provider}
            onChange={setProvider}
            options={[{ id: "all", label: "All" }, ...providers.map((p) => ({ id: p, label: p }))]}
          />
        }
      >
        Schedule
      </PageTitle>
      <div className="flex flex-wrap gap-[6px] mb-[12px]">
        {totals.map(([k, n]) => (
          <span key={k} className="flex items-center gap-[8px] h-[30px] px-[12px] rounded-full text-[12.5px] font-[500]" style={{ backgroundColor: SLOT_TONE[k] }}>
            {k}
            <b className="font-[700] [font-variant-numeric:tabular-nums]">{n}</b>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[8px] md:gap-[10px]">
        {days.map((d) => {
          const open = d.slots.filter((x) => labelOf(x.id) === "Open").length;
          return (
            <div key={d.day} className="flex flex-col gap-[8px] p-[8px] rounded-[22px] bg-[#FAF6EC]">
              <div className="flex items-baseline justify-between px-[8px] pt-[6px]">
                <span className={`${DISPLAY} text-[20px] leading-[24px]`}>
                  {d.weekday} <span className="text-[#2819109E]">{d.date.replace(/^\w+ /, "")}</span>
                </span>
                <span className="text-[12px] font-[500] text-[#2819109E]">{d.slots.length ? `${open} open` : "—"}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-[6px]">
                {d.slots.length === 0 && <span className="col-span-full px-[8px] pb-[8px] text-[12.5px] text-[#2819109E]">No slots for this provider.</span>}
                {d.slots.map((x) => {
                  const label = labelOf(x.id);
                  const s = label === "Open" ? undefined : who(state.slots[x.id]?.sessionId);
                  return (
                    <button
                      key={x.id}
                      type="button"
                      disabled={!s}
                      onClick={() => s && onOpen(s.id)}
                      className={`flex flex-col gap-[4px] min-h-[76px] p-[10px_12px] rounded-[16px] text-left transition-colors duration-150 disabled:cursor-default ${label === "Open" ? "bg-[#FFFCF1]" : "hover:brightness-[0.98]"}`}
                      style={label === "Open" ? undefined : { backgroundColor: SLOT_TONE[label] }}
                    >
                      <span className="flex items-center justify-between gap-[6px]">
                        <span className="text-[14px] font-[700] [font-variant-numeric:tabular-nums]">{x.time}</span>
                        <span className={`h-[20px] px-[7px] flex items-center rounded-full text-[10.5px] font-[700] ${label === "Open" ? "bg-[#F4EEDF]" : "bg-[#FFFCF1B3]"}`}>{label}</span>
                      </span>
                      <span className="text-[12px] text-[#2819109E] truncate">{x.provider}</span>
                      {s && <span className="text-[12.5px] font-[600] truncate">{s.userName}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ——— Services ——— */

function Services({ config, onConfig }: { config: DemoConfig | null; onConfig: (c: Partial<DemoConfig>) => Promise<void> }) {
  const [floor, setFloor] = useState<number | null>(null);
  if (!config) return <PageTitle>Services</PageTitle>;
  const rows = [
    ...SERVICES.map((s) => ({ id: s.id, name: s.name, sub: s.duration, price: s.price, kind: "Service" })),
    ...BUNDLES.map((b) => ({ id: b.id, name: b.name, sub: "Bundle", price: b.price, kind: "Bundle" })),
  ];
  const f = floor ?? config.floorPct;
  const pct = Math.round(f * 100);
  const bookable = rows.filter((r) => config.bookable[r.id]).length;
  const commit = (v: number) => {
    const next = Math.round(Math.min(1, Math.max(0.5, v)) * 100) / 100;
    setFloor(null);
    if (next !== config.floorPct) void onConfig({ floorPct: next });
  };
  const allOn = bookable === rows.length;

  return (
    <>
      <PageTitle
        kicker="Private pay · what agents can book"
        right={
          <button
            type="button"
            onClick={() => void onConfig({ bookable: Object.fromEntries(rows.map((r) => [r.id, !allOn])) })}
            className="h-[40px] px-[18px] rounded-full bg-[#28191014] hover:bg-[#2819101F] text-[14px] font-[500] transition-colors duration-150"
          >
            {allOn ? "Turn All Off" : "Make All Bookable"}
          </button>
        }
      >
        Services
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] mb-[10px]">
        <Card tone="#F3EBD2">
          <CardTitle title="Lowest negotiated price" note="The clinic's agent won't agree below this" right={<Tag>{pct}% of list</Tag>} />
          <div className="flex items-center gap-[10px] mt-auto">
            <button type="button" aria-label="Lower" onClick={() => commit(f - 0.01)} className="shrink-0 w-[40px] h-[40px] rounded-full bg-[#FFFCF1] text-[18px] font-[600]">
              −
            </button>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={pct}
              aria-label="Lowest negotiated price, percent of list"
              onChange={(e) => setFloor(Number(e.target.value) / 100)}
              onPointerUp={(e) => commit(Number((e.target as HTMLInputElement).value) / 100)}
              onKeyUp={(e) => commit(Number((e.target as HTMLInputElement).value) / 100)}
              onBlur={() => floor !== null && commit(floor)}
              className="grow min-w-0 h-[40px] accent-[#140C04]"
            />
            <button type="button" aria-label="Raise" onClick={() => commit(f + 0.01)} className="shrink-0 w-[40px] h-[40px] rounded-full bg-[#FFFCF1] text-[18px] font-[600]">
              +
            </button>
          </div>
        </Card>
        <button
          type="button"
          role="switch"
          aria-checked={config.autoConfirm}
          onClick={() => void onConfig({ autoConfirm: !config.autoConfirm })}
          className="flex flex-col min-w-0 p-[16px] md:p-[20px_22px] rounded-[24px] md:rounded-[28px] text-left transition-colors duration-200"
          style={{ backgroundColor: config.autoConfirm ? "#E6ECDB" : "#FAF6EC" }}
        >
          <CardTitle title="Auto-confirm bookings" note={config.autoConfirm ? "On · agent requests are booked at once" : "Off · staff confirm each request"} right={<Switch on={config.autoConfirm} />} />
          <span className="mt-auto text-[13px] leading-[18px] text-[#2819109E]">
            {bookable} of {rows.length} services and bundles are bookable by agents.
          </span>
        </button>
      </div>

      <Card tone="#F4EEDF" className="!p-[6px]">
        <div className="hidden md:grid grid-cols-[minmax(0,1fr)_110px_120px_120px_120px] gap-[12px] px-[16px] pt-[10px] pb-[8px] text-[12px] font-[600] uppercase tracking-[0.06em] text-[#281910B3]">
          <span>Service</span>
          <span>List</span>
          <span>Agent price</span>
          <span>Floor</span>
          <span className="text-right">Agents</span>
        </div>
        <div className="flex flex-col gap-[4px]">
          {rows.map((r) => {
            const on = Boolean(config.bookable[r.id]);
            return (
              <button
                key={r.id}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => void onConfig({ bookable: { [r.id]: !on } })}
                className={`grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_110px_120px_120px_120px] items-center gap-x-[12px] gap-y-[4px] min-h-[64px] p-[12px_16px] rounded-[18px] text-left transition-colors duration-150 ${on ? "bg-[#FFFCF1]" : "bg-[#FFFCF180]"}`}
              >
                <span className="min-w-0">
                  <span className={`block truncate text-[14.5px] font-[600] ${on ? "" : "text-[#2819109E]"}`}>{r.name}</span>
                  <span className="block text-[12.5px] text-[#2819109E]">
                    {r.sub}
                    <span className="md:hidden">
                      {" "}
                      · {money(r.price)} · agents {money(r.price - Math.round(r.price * AGENT_DISCOUNT))}
                    </span>
                  </span>
                </span>
                <span className="hidden md:block text-[14px] font-[700] [font-variant-numeric:tabular-nums]">{money(r.price)}</span>
                <span className="hidden md:block text-[13.5px] [font-variant-numeric:tabular-nums]">{money(r.price - Math.round(r.price * AGENT_DISCOUNT))}</span>
                <span className="hidden md:block text-[13.5px] text-[#2819109E] [font-variant-numeric:tabular-nums]">{money(Math.round((r.price * f) / 5) * 5)}</span>
                <span className="flex items-center justify-end gap-[10px] text-[12.5px] font-[500] text-[#2819109E]">
                  <span className="hidden sm:inline">{on ? "Bookable" : "Off"}</span>
                  <Switch on={on} />
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
}

/* ——— Forms ——— */

type FormsView = "library" | "returned";

/** The clinic's forms (the ones agents fill in at /demo), and what patients' agents have sent back. */
function Forms({ sessions, focus, onAct }: { sessions: Session[]; focus: { id: string; n: number } | null; onAct: Act }) {
  const [view, setView] = useState<FormsView>(focus ? "returned" : "library");
  const [open, setOpen] = useState(focus);
  useEffect(() => {
    if (!focus) return;
    setOpen(focus);
    setView("returned");
  }, [focus]);
  const back = sessions.filter((s) => s.forms.status === "sent").length;
  const toggle = (
    <Segmented
      value={view}
      onChange={setView}
      options={[
        { id: "library", label: "Library · 7" },
        { id: "returned", label: `Returned · ${back}` },
      ]}
    />
  );
  return (
    <>
      <PageTitle kicker={view === "library" ? "What patients' agents fill in before a visit" : "Sent back by patients' agents"} right={toggle}>
        Forms
      </PageTitle>
      {view === "library" ? (
        <FormsLibrary
          sessions={sessions}
          onOpenReturn={(id) => {
            setOpen((f) => ({ id, n: (f?.n ?? 0) + 1 }));
            setView("returned");
          }}
        />
      ) : (
        <ReturnedForms sessions={sessions} focus={open} onAct={onAct} />
      )}
    </>
  );
}

function ReturnedForms({ sessions, focus, onAct }: { sessions: Session[]; focus: { id: string; n: number } | null; onAct: Act }) {
  const withForms = sessions.filter((s) => s.forms.status === "sent" || Object.keys(s.forms.assessments).length > 0 || s.forms.signedBy || (s.forms.uploads?.length ?? 0) > 0);
  const [openId, setOpenId] = useState<string | null>(focus?.id ?? null);
  const [detail, setDetail] = useState(Boolean(focus));
  /** Opened from a "Forms uploaded" notification: jump to that session. */
  useEffect(() => {
    if (!focus) return;
    setOpenId(focus.id);
    setDetail(true);
  }, [focus]);
  const f = withForms.find((s) => s.id === openId) ?? withForms[0];
  const returned = withForms.filter((s) => s.forms.status === "sent").length;
  return (
    <>
      <p className={`-mt-[6px] mb-[12px] text-[13px] text-[#2819109E] ${detail ? "hidden lg:block" : ""}`}>
        {withForms.length ? `${returned} returned · ${withForms.length - returned} in progress` : "Nothing back yet"}
      </p>
      {!f ? (
        <Empty>No forms yet. They appear here as agents fill them.</Empty>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] gap-[12px] items-start">
          <div className={`flex-col gap-[6px] ${detail ? "hidden lg:flex" : "flex"}`}>
            {withForms.map((x) => {
              const done = x.scores.filter((s) => s.complete).length;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => {
                    setOpenId(x.id);
                    setDetail(true);
                  }}
                  className={`flex flex-col gap-[8px] p-[12px_14px] rounded-[20px] bg-[#F4EEDF] text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${x.id === f.id ? "lg:outline-[#140C04] outline-transparent" : "outline-transparent hover:outline-[#28191026]"}`}
                >
                  <span className="flex items-center gap-[10px] min-w-0">
                    <span className="grow min-w-0">
                      <span className="block truncate text-[14px] font-[600]">{x.userName}</span>
                      <span className="block truncate text-[12.5px] text-[#2819109E]">
                        {done} of {x.scores.length} assessments{x.forms.uploads?.length ? ` · ${x.forms.uploads.length} upload${x.forms.uploads.length === 1 ? "" : "s"}` : ""} · {x.agentName}
                      </span>
                    </span>
                    <Tag tone={x.forms.status === "sent" ? "sage" : undefined}>{x.forms.status === "sent" ? "Returned" : "In Progress"}</Tag>
                  </span>
                  <span className="h-[4px] rounded-full bg-[#2819100F] overflow-hidden">
                    <span className="block h-full rounded-full bg-[#2F3B2A]" style={{ width: `${(done / Math.max(1, x.scores.length)) * 100}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
          <div className={`flex-col min-w-0 ${detail ? "flex" : "hidden lg:flex"}`}>
            <BackButton onClick={() => setDetail(false)} label="Forms" />
            <div className="flex flex-col gap-[10px] p-[16px] md:p-[20px_22px] rounded-[24px] md:rounded-[28px] bg-[#FAF6EC]">
              <div className="flex items-baseline justify-between gap-[12px]">
                <div className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.02em] truncate`}>{f.userName}</div>
                <span className="shrink-0 text-[12.5px] font-[500] text-[#2819109E]">{f.forms.sentAt ? `Returned ${clock(f.forms.sentAt)}` : "In Progress"}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[6px]">
                {f.scores.map((x) => (
                  <div key={x.id} className="flex flex-col gap-[6px] p-[12px_14px] rounded-[16px] bg-[#FFFCF1CC]">
                    <span className="text-[12px] font-[500] text-[#2819109E]">{x.name}</span>
                    <span className={`${DISPLAY} text-[28px] leading-[30px]`}>{x.score ?? "…"}</span>
                    <span className="self-start h-[22px] px-[9px] flex items-center rounded-full text-[11px] font-[600]" style={{ backgroundColor: x.tone ?? "#F4EEDF" }}>
                      {x.band ?? "Not Finished"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
                {INTAKE_FIELDS.filter((x) => x.id !== "consent").map((x) => (
                  <div key={x.id} className="flex flex-col gap-[2px] p-[10px_12px] rounded-[14px] bg-[#FFFCF1CC]">
                    <span className="text-[12px] font-[500] text-[#2819109E]">{x.label}</span>
                    <span className="text-[14px] font-[500] break-words">{f.forms.intake[x.id]?.trim() || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[10px] p-[12px_14px] rounded-[16px] border-[1.5px] border-dashed border-[#28191033]">
                <Check on={Boolean(f.forms.signedBy)} size={20} />
                <span className="text-[13.5px]">{f.forms.signedBy ? `Consent signed by ${f.forms.signedBy} · PHI provided via Doe` : "Awaiting Signature"}</span>
              </div>
            </div>
            <div className="mt-[10px]">
              <UploadsPanel s={f} onAct={onAct} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ——— Uploads ——— */

type UploadView = NonNullable<Session["forms"]["uploads"]>[number] & { hasFile?: boolean; preview?: string };

/** Files and written forms passed between the agent and the clinic, and a way to send the agent a form. */
function UploadsPanel({ s, onAct }: { s: Session; onAct: Act }) {
  const uploads = (s.forms.uploads ?? []) as UploadView[];
  const [open, setOpen] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [composing, setComposing] = useState(false);
  const url = (u: UploadView, download = false) => `/api/demo/clinic/upload?session_id=${encodeURIComponent(s.id)}&upload_id=${encodeURIComponent(u.id)}${download ? "&download=1" : ""}`;
  return (
    <div className="rounded-[24px] md:rounded-[28px] bg-[#FAF6EC] p-[14px_16px] md:p-[16px_22px]">
      <CardTitle
        title="Uploads"
        note={uploads.length ? `${uploads.length} passed back and forth` : "Forms and files from the agent show here"}
        right={
          <button type="button" onClick={() => setComposing((c) => !c)} className="h-[32px] px-[12px] rounded-full bg-[#28191014] hover:bg-[#2819101F] text-[12.5px] font-[600]">
            {composing ? "Cancel" : "Send a Form"}
          </button>
        }
      />
      <div className="flex flex-col gap-[6px]">
        {uploads.map((u) => (
          <div key={u.id} className="flex flex-col gap-[6px] p-[10px_12px] rounded-[16px] bg-[#FFFCF1CC]">
            <div className="flex items-center gap-[10px]">
              <span className={`w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[10px] ${u.by === "agent" ? "bg-[#E3E9D9] text-[#2F3B2A]" : "bg-[#FCCFB8] text-[#7A3E26]"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3.5h7l4.5 4.5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13.5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M14 3.5V8h4.5M8.5 13h7M8.5 16.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="grow min-w-0">
                <span className="block truncate text-[14px] font-[600]">{u.title}</span>
                <span className="block truncate text-[12px] text-[#2819109E]">
                  {u.by === "agent" ? `Uploaded by ${s.agentName}` : "Sent by the clinic"} · {u.fileName} · {Math.max(1, Math.round(u.size / 1024))} KB · {clock(u.at)}
                </span>
              </span>
              {u.preview !== undefined || u.text ? (
                <button type="button" onClick={() => setOpen(open === u.id ? null : u.id)} className="shrink-0 h-[32px] px-[12px] rounded-full bg-[#F4EEDF] text-[12.5px] font-[600]">
                  {open === u.id ? "Hide" : "Read"}
                </button>
              ) : (
                <a href={url(u)} target="_blank" rel="noreferrer" className="shrink-0 h-[32px] px-[12px] flex items-center rounded-full bg-[#F4EEDF] text-[12.5px] font-[600]">
                  Open
                </a>
              )}
              <a href={url(u, true)} aria-label={`Download ${u.title}`} className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#F4EEDF]">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            {open === u.id && <UploadText url={url(u)} />}
          </div>
        ))}
        {!uploads.length && !composing && <Empty>No uploads yet. Agents can attach a migraine diary, referral or past prescription.</Empty>}
        {(s.shares ?? []).length > 0 && (
          <div className="flex flex-col gap-[4px] mt-[6px]">
            <span className="px-[4px] text-[11.5px] font-[600] uppercase tracking-[0.06em] text-[#28191080]">Copies shared with the patient</span>
            {[...(s.shares ?? [])].reverse().map((sh) => {
              const expired = Date.parse(sh.expiresAt) <= Date.now();
              const state = sh.revoked ? "Turned off" : expired ? "Expired" : "Active";
              return (
                <div key={sh.id} className="flex items-center gap-[10px] p-[10px_12px] rounded-[16px] bg-[#FFFCF1CC]">
                  <span className="grow min-w-0">
                    <span className="block text-[13.5px] font-[600]">
                      Private link · {sh.views ? `opened ${sh.views} time${sh.views === 1 ? "" : "s"}` : "not opened yet"}
                    </span>
                    <span className="block text-[12px] text-[#2819109E]">
                      Shared {clock(sh.createdAt)} by {s.agentName} · {sh.revoked ? "turned off" : `expires ${new Date(sh.expiresAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}`}
                      {sh.lastViewedAt ? ` · last opened ${clock(sh.lastViewedAt)}` : ""}
                    </span>
                  </span>
                  <span className={`shrink-0 h-[24px] px-[9px] flex items-center rounded-full text-[11.5px] font-[700] ${state === "Active" ? "bg-[#DCE5D0]" : "bg-[#F4EEDF] text-[#2819109E]"}`}>{state}</span>
                  {state === "Active" && (
                    <button type="button" onClick={() => void onAct(s.id, { type: "revoke_share", share_id: sh.id }, "Link turned off")} className="shrink-0 h-[30px] px-[12px] rounded-full bg-[#28191014] text-[12.5px] font-[600]">
                      Turn Off
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {composing && (
          <form
            className="flex flex-col gap-[6px] p-[10px] rounded-[16px] border-[1.5px] border-dashed border-[#28191033]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !text.trim()) return;
              void onAct(s.id, { type: "send_form", title: title.trim(), text: text.trim() }, `Sent ${title.trim()} to ${s.agentName}`);
              setTitle("");
              setText("");
              setComposing(false);
            }}
          >
            <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 120))} placeholder="Title, e.g. Before your Botox visit" className="h-[42px] px-[14px] rounded-[12px] bg-[#FFFCF1] text-[16px] md:text-[14px] outline-none" />
            <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 12000))} rows={4} placeholder="The form or instructions for the agent to go through with the patient" className="px-[14px] py-[10px] rounded-[12px] bg-[#FFFCF1] text-[16px] md:text-[14px] leading-[20px] outline-none resize-y" />
            <button type="submit" disabled={!title.trim() || !text.trim()} className="self-end h-[38px] px-[16px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] disabled:opacity-40">
              Send to {s.agentName}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function UploadText({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetch(url, { cache: "no-store" })
      .then((r) => r.text())
      .then((t) => live && setText(t))
      .catch(() => live && setText("Couldn't load this form."));
    return () => {
      live = false;
    };
  }, [url]);
  return <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-words p-[12px] rounded-[12px] bg-[#FFFCF1] font-mono text-[12px] leading-[18px] text-[#281910CC]">{text ?? "Loading…"}</pre>;
}
