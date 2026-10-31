"use client";

/**
 * /demo/clinic — Dr. Brooks' side of /demo, live: every agent that connects (browser, API or MCP), what each one
 * does, and the clinic's answers, offers and booking decisions. A simple /doehealthproduct: brown rail, cream shell.
 */
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import { Check, DISPLAY } from "@/components/demo/DemoFrame";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { INTAKE_FIELDS, BUNDLES, CLINIC, SERVICES, money } from "@/lib/demo/demo-clinic";
import { API_BASE, MCP_PATH } from "@/lib/demo/demo-docs";
import type { ClinicAction, DemoStatus } from "@/lib/demo/demo-engine";
import type { ClinicStatePayload } from "@/lib/demo/demo-service";
import type { DemoConfig, DemoThreadId } from "@/lib/demo/demo-types";
import { dmSans, lora } from "@/lib/home/fonts";

type Tab = "overview" | "inbox" | "schedule" | "services" | "forms";
type Session = ClinicStatePayload["sessions"][number];

const POLL_MS = 3000;

const STATUS_TONE: Record<DemoStatus, string> = {
  Negotiating: "#FCCFB8",
  Holding: "#F3E7C9",
  "Ready to confirm": "#E3E9D9",
  Booked: "#DCE5D0",
  Declined: "#E9DCC7",
  "Forms returned": "#EEEADF",
  Browsing: "#F4EEDF",
};

const THREADS: { id: DemoThreadId; label: string }[] = [
  { id: "concierge", label: "Concierge" },
  { id: "negotiate", label: "Pricing" },
  { id: "forms", label: "Forms" },
];

const ago = (iso: string, now: number) => {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
};
const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
const CHANNEL = { browser: "Browser", api: "API", mcp: "MCP" } as const;

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
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
    label: "Agent Inbox",
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
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
];

function useClinicState() {
  const [state, setState] = useState<ClinicStatePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/demo/clinic/state", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setState(await res.json());
      setError(null);
    } catch {
      setError("Can't reach the clinic's data. Retrying.");
    }
  }, []);
  useEffect(() => {
    void load();
    const id = window.setInterval(() => document.visibilityState === "visible" && void load(), POLL_MS);
    return () => window.clearInterval(id);
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
  return { state, error, post };
}

export function DemoClinicDashboard() {
  const { state, error, post } = useClinicState();
  const [tab, setTab] = useState<Tab>("overview");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const seen = useRef<Set<string> | null>(null);
  const timer = useRef<number | null>(null);

  const flash = useCallback((text: string) => {
    setToast(text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  /** Announces each agent that connects while the dashboard is open. */
  useEffect(() => {
    if (!state) return;
    const ids = new Set(state.sessions.map((s) => s.id));
    if (seen.current) {
      const fresh = state.sessions.filter((s) => !seen.current!.has(s.id));
      if (fresh[0]) flash(`Agent connected: ${fresh[0].agentName} via ${CHANNEL[fresh[0].channel]} for ${fresh[0].userName}`);
    }
    seen.current = ids;
  }, [state, flash]);

  const act = async (sessionId: string, action: ClinicAction, done?: string) => {
    const err = await post({ session_id: sessionId, ...action });
    flash(err ?? done ?? "Done");
  };
  const setConfig = async (config: Partial<DemoConfig>) => {
    const err = await post({ type: "set_config", config });
    if (err) flash(err);
  };

  const sessions = state?.sessions ?? [];
  const waiting = sessions.filter((s) => s.status === "Ready to confirm" || s.status === "Negotiating").length;
  /** Opens on whoever needs the clinic first, and stays put when another agent connects. */
  useEffect(() => {
    const list = state?.sessions;
    if (openId || !list?.length) return;
    setOpenId((list.find((s) => s.status === "Ready to confirm") ?? list[0])!.id);
  }, [openId, state]);
  const open = sessions.find((s) => s.id === openId) ?? sessions[0] ?? null;
  const openSession = (id: string) => {
    setOpenId(id);
    setTab("inbox");
  };

  const page: Record<Tab, ReactNode> = {
    overview: <Overview state={state} now={now} onOpen={openSession} />,
    inbox: <Inbox sessions={sessions} open={open} now={now} onOpen={setOpenId} onAct={act} />,
    schedule: <Schedule state={state} onOpen={openSession} />,
    services: <Services config={state?.config ?? null} onConfig={setConfig} />,
    forms: <Forms sessions={sessions} />,
  };

  return (
    <div
      className={`${dmSans.className} doehealth-product-page fixed inset-0 flex bg-[#3A2516] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
        paddingLeft: "env(safe-area-inset-left)",
      }}
    >
      <nav className="hidden md:flex flex-col shrink-0 w-[64px] lg:w-[220px] px-[12px] pt-[18px] pb-[16px] gap-[8px]">
        <div className="flex items-center gap-[10px] h-[40px] mb-[24px]">
          <span className={`${lora.className} w-[40px] text-center text-[28px] leading-[28px] font-[600] text-[#FFFCF1]`}>D</span>
          <span className="hidden lg:flex flex-col min-w-0">
            <span className="truncate text-[13px] leading-[16px] font-[600] text-[#FFFCF1]">Brooks Migraine</span>
            <span className="truncate text-[11.5px] leading-[14px] text-[#FFFCF180]">Toronto</span>
          </span>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => setTab(t.id)}
            className={`flex items-center h-[40px] rounded-[10px] transition-colors duration-200 ${tab === t.id ? "bg-[#FFFCF11A] text-[#FFFCF1]" : "text-[#FFFCF1B3] hover:text-[#FFFCF1]"}`}
          >
            <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                {t.icon}
              </svg>
            </span>
            <span className="hidden lg:block text-[14px] font-[500]">{t.label}</span>
            {t.id === "inbox" && waiting > 0 && (
              <span className="hidden lg:flex ml-auto mr-[10px] min-w-[20px] h-[20px] px-[6px] items-center justify-center rounded-full bg-[#FFFCF1] text-[11px] font-[700] text-[#3A2516]">{waiting}</span>
            )}
          </button>
        ))}
        <div className="mt-auto flex items-center gap-[10px] h-[48px]">
          <span className="w-[40px] flex justify-center">
            <span className="w-[32px] h-[32px] rounded-full bg-[#E8A585] flex items-center justify-center text-[12px] font-[700] text-[#281910]">SB</span>
          </span>
          <span className="hidden lg:flex flex-col min-w-0">
            <span className="truncate text-[14px] leading-[18px] font-[600] text-[#FFFCF1]">{CLINIC.doctor}</span>
            <span className="truncate text-[12px] leading-[16px] text-[#FFFCF199]">Owner</span>
          </span>
        </div>
      </nav>

      <div className="relative grow min-w-0 h-full ml-[8px] md:ml-0 overflow-clip rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div className="absolute inset-0 overflow-y-auto overscroll-contain">
          <div className="md:hidden sticky top-0 z-20 bg-[#FFFCF1E6] backdrop-blur-[12px]">
            <div className="flex items-center justify-between h-[64px] px-[18px]">
              <span className={`${lora.className} text-[30px] leading-[30px] font-normal text-[#3A2516]`}>Doe</span>
              <span className="h-[34px] px-[14px] flex items-center rounded-full bg-[#3A2516] text-[#FFFCF1] text-[12.5px] font-[600]">Clinic View</span>
            </div>
            <div className="flex gap-[6px] overflow-x-auto px-[16px] pb-[10px] [scrollbar-width:none]">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 h-[34px] px-[14px] rounded-full text-[13px] font-[600] ${tab === t.id ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#F4EEDF]"}`}
                >
                  {t.label}
                  {t.id === "inbox" && waiting > 0 ? ` · ${waiting}` : ""}
                </button>
              ))}
            </div>
          </div>
          <div key={tab} className="doe-menu-in px-[16px] md:px-[28px] pt-[8px] md:pt-[28px] pb-[32px] max-w-[1320px]">
            {error && <p className="mb-[12px] text-[13px] font-[600] text-[#B4532F]">{error}</p>}
            {page[tab]}
          </div>
        </div>
        {toast && (
          <div className="absolute left-1/2 top-[16px] z-40 -translate-x-1/2 max-w-[92%] min-h-[40px] px-[18px] py-[10px] flex items-center rounded-full bg-[#3A2516] text-[#FFFCF1] text-[13px] font-[600] shadow-[0_8px_24px_rgba(58,37,22,0.25)] doe-menu-in">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function Title({ kicker, children, right }: { kicker?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-[12px] mb-[16px]">
      <div className="flex flex-col gap-[2px] min-w-0">
        {kicker && <span className="text-[12px] leading-[16px] font-[500] text-[#28191080]">{kicker}</span>}
        <h1 className={`${DISPLAY} text-[28px] leading-[32px] md:text-[34px] md:leading-[38px] tracking-[-0.02em]`}>{children}</h1>
      </div>
      {right}
    </div>
  );
}

function Card({ title, right, children, className = "" }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[22px] bg-[#F4EEDF] p-[6px] ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-[12px] pt-[10px] pb-[8px]">
          <span className="text-[12px] leading-[16px] font-[600] uppercase tracking-[0.08em] text-[#281910B3]">{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function StatusChip({ status }: { status: DemoStatus }) {
  return (
    <span className="shrink-0 h-[24px] px-[10px] flex items-center rounded-full text-[11.5px] font-[700]" style={{ backgroundColor: STATUS_TONE[status] }}>
      {status}
    </span>
  );
}

function ChannelChip({ channel }: { channel: Session["channel"] }) {
  return <span className="shrink-0 h-[20px] px-[7px] flex items-center rounded-[6px] bg-[#3A2516] text-[#FFFCF1] font-mono text-[10.5px] font-[500]">{CHANNEL[channel]}</span>;
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-[16px] bg-[#FFFCF1] p-[16px] text-[13px] leading-[19px] text-[#2819109E]">{children}</div>;
}

function Overview({ state, now, onOpen }: { state: ClinicStatePayload | null; now: number; onOpen: (id: string) => void }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  if (!state) return <Title kicker={CLINIC.name}>Loading…</Title>;
  const a = state.analytics;
  const latest = state.sessions[0];
  const waiting = state.sessions.filter((s) => s.status === "Ready to confirm" || s.status === "Negotiating" || s.status === "Holding");
  const feed = state.sessions
    .flatMap((s) => s.events.map((e) => ({ ...e, sessionId: s.id, who: s.agentName })))
    .sort((x, y) => Date.parse(y.at) - Date.parse(x.at))
    .slice(0, 14);
  const funnel = [
    ["Connected", a.sessions],
    ["Held a Slot", a.held],
    ["Forms Back", a.formsReturned],
    ["Requested", a.requested],
    ["Booked", a.confirmed],
  ] as const;
  const reply = a.medianReplyMs === null ? "—" : a.medianReplyMs < 1000 ? "<1s" : a.medianReplyMs < 60000 ? `${Math.round(a.medianReplyMs / 1000)}s` : `${Math.round(a.medianReplyMs / 60000)}m`;

  return (
    <>
      <Title kicker={CLINIC.name} right={<DemoSphere size={64} className="hidden sm:block" />}>
        Agents
      </Title>

      {latest ? (
        <Card className="mb-[12px]">
        <button type="button" onClick={() => onOpen(latest.id)} className="w-full flex items-center gap-[12px] p-[14px] rounded-[18px] bg-[#3A2516] text-[#FFFCF1] text-left">
          <span className="shrink-0 h-[20px] px-[7px] flex items-center rounded-[6px] bg-[#FFFCF1] text-[#3A2516] font-mono text-[10.5px] font-[500]">{CHANNEL[latest.channel]}</span>
          <span className="grow min-w-0">
            <span className="block truncate text-[14px] font-[600]">
              {latest.live ? "Connected now" : "Last connected"}: {latest.agentName} for {latest.userName}
            </span>
            <span className="block truncate text-[12px] text-[#FFFCF199]">
              {ago(latest.createdAt, now)} · {latest.status} · <span className="font-mono">{latest.id}</span>
            </span>
          </span>
          <span className="shrink-0 text-[12.5px] font-[600] text-[#FFFCF1CC]">Open</span>
        </button>
        </Card>
      ) : (
        <Card className="mb-[12px]">
          <Empty>No agents have connected yet. Open /demo, or point an agent at the API or MCP endpoint below.</Empty>
        </Card>
      )}

      <Card>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[4px]">
        {[
          ["Agents Connected", String(a.sessions), `${a.live} live now`],
          ["By Channel", `${a.byChannel.browser} · ${a.byChannel.api} · ${a.byChannel.mcp}`, "Browser · API · MCP"],
          ["Bookings", `${a.confirmed} / ${a.requested}`, "confirmed / requested"],
          ["Booked Revenue", money(a.revenue), "confirmed, private pay"],
          ["Median Reply", reply, `${a.agentActions} agent actions`],
        ].map(([k, v, sub]) => (
          <div key={k} className="rounded-[16px] bg-[#FFFCF1] p-[16px] min-w-0">
            <div className="text-[12px] leading-[16px] text-[#2819109E]">{k}</div>
            <div className={`${DISPLAY} mt-[6px] text-[26px] leading-[30px] truncate`}>{v}</div>
            <div className="mt-[2px] text-[11.5px] text-[#28191080]">{sub}</div>
          </div>
        ))}
      </div>
      </Card>

      <Card title="Funnel" className="mt-[12px]">
        <div className="grid grid-cols-5 gap-[4px]">
          {funnel.map(([k, n]) => (
            <div key={k} className="rounded-[16px] bg-[#FFFCF1] p-[12px] flex flex-col gap-[8px] min-w-0">
              <span className="text-[11.5px] font-[600] text-[#28191099] truncate">{k}</span>
              <span className={`${DISPLAY} text-[22px] leading-[24px]`}>{n}</span>
              <span className="h-[4px] rounded-full bg-[#2819100F] overflow-hidden">
                <span className="block h-full bg-[#3A2516]" style={{ width: `${a.sessions ? (n / a.sessions) * 100 : 0}%` }} />
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-[12px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[12px]">
        <Card title={`Waiting on You · ${waiting.length}`}>
          <div className="flex flex-col gap-[4px]">
            {waiting.length === 0 && <Empty>Nothing needs you right now.</Empty>}
            {waiting.map((s) => (
              <button key={s.id} type="button" onClick={() => onOpen(s.id)} className="flex items-center gap-[12px] p-[12px] rounded-[16px] bg-[#FFFCF1] text-left hover:bg-[#FFFCF1CC] transition-colors duration-150">
                <ChannelChip channel={s.channel} />
                <span className="grow min-w-0">
                  <span className="block truncate text-[14px] font-[600]">
                    {s.userName} <span className="font-[500] text-[#2819109E]">· {s.pricing.label}</span>
                  </span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">{s.bookingSlot ?? s.holdSlot ?? `${s.agentName} · ${ago(s.updatedAt, now)}`}</span>
                </span>
                <StatusChip status={s.status} />
              </button>
            ))}
          </div>
        </Card>
        <Card title="Activity">
          <div className="flex flex-col gap-[2px] rounded-[16px] bg-[#FFFCF1] p-[8px] max-h-[420px] overflow-y-auto">
            {feed.length === 0 && <p className="p-[8px] text-[13px] text-[#2819109E]">No activity yet.</p>}
            {feed.map((e) => (
              <button key={e.id} type="button" onClick={() => onOpen(e.sessionId)} className="grid grid-cols-[72px_minmax(0,1fr)] gap-[10px] px-[8px] py-[7px] rounded-[10px] text-left hover:bg-[#F4EEDF] transition-colors duration-150">
                <span className="font-mono text-[11px] leading-[18px] text-[#28191080]">{clock(e.at)}</span>
                <span className="min-w-0 text-[12.5px] leading-[18px]">
                  <span className="font-[600]">{e.actor === "clinic" ? "Clinic" : e.who}</span> <span className="text-[#281910B3]">{e.summary}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Agent Access" className="mt-[12px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[4px]">
          {[
            ["REST API", `${origin}${API_BASE}`],
            ["MCP Server", `${origin}${MCP_PATH}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[16px] bg-[#FFFCF1] p-[12px]">
              <div className="text-[11.5px] font-[600] text-[#28191099]">{k}</div>
              <div className="mt-[2px] font-mono text-[12.5px] break-all">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Inbox({
  sessions,
  open,
  now,
  onOpen,
  onAct,
}: {
  sessions: Session[];
  open: Session | null;
  now: number;
  onOpen: (id: string) => void;
  onAct: (id: string, a: ClinicAction, done?: string) => Promise<void>;
}) {
  const [thread, setThread] = useState<DemoThreadId>("concierge");
  const [reply, setReply] = useState("");
  const [offer, setOffer] = useState("");
  const [note, setNote] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const msgs = open?.threads[thread] ?? [];
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [msgs.length, open?.id, thread]);

  return (
    <>
      <Title>Agent Inbox</Title>
      {sessions.length === 0 ? (
        <Card>
          <Empty>No agent sessions yet.</Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[12px]">
          <Card>
            <div className="flex flex-col gap-[4px] max-h-[760px] overflow-y-auto">
              {sessions.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => onOpen(x.id)}
                  className={`flex items-start gap-[10px] p-[12px] rounded-[16px] bg-[#FFFCF1] text-left transition-colors duration-150 ${x.id === open?.id ? "ring-[1.5px] ring-[#3A2516]" : "hover:bg-[#FFFCF1CC]"}`}
                >
                  <ChannelChip channel={x.channel} />
                  <span className="grow min-w-0">
                    <span className="flex items-baseline justify-between gap-[8px]">
                      <span className="truncate text-[14px] font-[600]">{x.userName}</span>
                      <span className="shrink-0 text-[11.5px] text-[#28191080]">{x.live ? "Live" : ago(x.updatedAt, now)}</span>
                    </span>
                    <span className="block truncate text-[12.5px] text-[#2819109E]">
                      {x.agentName} · {x.pricing.label}
                    </span>
                  </span>
                  <StatusChip status={x.status} />
                </button>
              ))}
            </div>
          </Card>

          {open && (
            <Card>
              <div className="rounded-[18px] bg-[#FFFCF1] p-[16px]">
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="min-w-0">
                    <div className={`${DISPLAY} text-[22px] leading-[26px]`}>{open.userName}</div>
                    <div className="mt-[2px] text-[13px] text-[#2819109E]">
                      {open.agentName} via {CHANNEL[open.channel]} · {open.live ? "live" : `seen ${ago(open.lastSeenAt, now)}`}
                    </div>
                    <div className="mt-[2px] font-mono text-[11.5px] text-[#28191080]">{open.id}</div>
                  </div>
                  <StatusChip status={open.status} />
                </div>
                <div className="mt-[10px] flex flex-wrap gap-[6px]">
                  {(
                    [
                      ["Terms", open.consent.terms],
                      ["PHI", open.consent.phi],
                      ["Stays Connected", open.consent.connected],
                      ["Doe Network", open.consent.network],
                    ] as const
                  ).map(([k, on]) => (
                    <span key={k} className={`h-[24px] px-[9px] flex items-center rounded-full text-[11.5px] font-[600] ${on ? "bg-[#E3E9D9]" : "text-[#28191066] border border-solid border-[#2819101F]"}`}>
                      {on ? "✓" : "–"} {k}
                    </span>
                  ))}
                </div>

                <div className="mt-[14px] grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
                  <Fact k="Plan" v={open.pricing.label} />
                  <Fact k="Price" v={`${money(open.booking.total ?? open.pricing.total)}${open.pricing.deal ? " · negotiated" : ""}`} />
                  <Fact k={open.booking.slotId ? "Booking" : "Hold"} v={open.bookingSlot ?? open.holdSlot ?? "None"} />
                </div>

                {open.booking.status === "requested" && (
                  <div className="mt-[10px] flex flex-wrap items-center gap-[6px] p-[10px] rounded-[16px] bg-[#E3E9D9]">
                    <span className="grow text-[13px] font-[600]">Booking request · PHI provided via Doe</span>
                    <button type="button" onClick={() => void onAct(open.id, { type: "confirm_booking" }, "Booking confirmed")} className="h-[38px] px-[16px] rounded-full bg-[#3A2516] text-[#FFFCF1] text-[13px] font-[600]">
                      Confirm
                    </button>
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (Optional)" className="w-[150px] h-[38px] px-[12px] rounded-full bg-[#FFFCF1] text-[16px] md:text-[13px] outline-none" />
                    <button
                      type="button"
                      onClick={() => {
                        void onAct(open.id, { type: "decline_booking", note }, "Booking declined");
                        setNote("");
                      }}
                      className="h-[38px] px-[14px] rounded-full bg-[#FFFCF1] text-[13px] font-[600]"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {open.hold && (
                  <div className="mt-[10px] flex items-center gap-[8px] p-[10px] rounded-[16px] bg-[#F3E7C9]">
                    <span className="grow text-[13px] font-[600]">Holding {open.holdSlot}</span>
                    <button type="button" onClick={() => void onAct(open.id, { type: "release_hold" }, "Hold released")} className="h-[34px] px-[14px] rounded-full bg-[#FFFCF1] text-[12.5px] font-[600]">
                      Release
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-[4px] p-[6px] pt-[8px]">
                {THREADS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThread(t.id)}
                    className={`h-[32px] px-[12px] rounded-full text-[12.5px] font-[600] ${thread === t.id ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#FFFCF1]"}`}
                  >
                    {t.label} · {open.threads[t.id].filter((m) => m.from !== "system").length}
                  </button>
                ))}
              </div>
              <div ref={list} className="flex flex-col gap-[8px] max-h-[360px] overflow-y-auto px-[8px] py-[6px]">
                {msgs.map((l) =>
                  l.from === "system" ? (
                    <p key={l.id} className="self-center text-[11.5px] font-[500] text-[#28191080]">
                      {l.text}
                    </p>
                  ) : (
                    <div key={l.id} className={`flex flex-col max-w-[88%] gap-[3px] ${l.from === "clinic" ? "self-end items-end" : "self-start items-start"}`}>
                      <span className="px-[4px] text-[11px] font-[600] text-[#28191073]">
                        {l.from === "clinic" ? (l.by === "staff" ? "Clinic staff" : "Clinic agent") : open.agentName} · {clock(l.at)}
                      </span>
                      <span className={`px-[14px] py-[10px] rounded-[18px] text-[14px] leading-[20px] ${l.from === "clinic" ? "bg-[#3A2516] text-[#FFFCF1] rounded-br-[6px]" : "bg-[#FFFCF1] rounded-bl-[6px]"}`}>
                        {l.text}
                        {l.offer && (
                          <span className="block mt-[6px] text-[12px] font-[700] opacity-80">
                            Offer {money(l.offer.price)} · {l.offer.status}
                          </span>
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-col gap-[6px] p-[6px] pt-[8px]">
                {thread === "negotiate" && (
                  <form
                    className="flex gap-[6px]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const n = Number(offer.replace(/[^\d]/g, ""));
                      if (!n) return;
                      void onAct(open.id, { type: "make_offer", price: n }, `Offered ${money(n)}`);
                      setOffer("");
                    }}
                  >
                    <input
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                      placeholder={`Offer a price for ${open.pricing.label}`}
                      inputMode="numeric"
                      className="grow min-w-0 h-[42px] px-[14px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[16px] md:text-[13.5px] outline-none"
                    />
                    <button type="submit" className="h-[42px] px-[16px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[13.5px] font-[600]">
                      Offer
                    </button>
                  </form>
                )}
                <form
                  className="flex gap-[6px]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reply.trim()) return;
                    void onAct(open.id, { type: "send_message", thread, text: reply.trim() }, "Sent");
                    setReply("");
                  }}
                >
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply as clinic staff"
                    className="grow min-w-0 h-[42px] px-[14px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[16px] md:text-[13.5px] outline-none"
                  />
                  <button type="submit" className="h-[42px] px-[16px] rounded-full bg-[#3A2516] text-[#FFFCF1] text-[13.5px] font-[600]">
                    Send
                  </button>
                </form>
              </div>

              <div className="m-[6px] mt-[4px] rounded-[16px] bg-[#FFFCF1] p-[10px]">
                <div className="px-[4px] pb-[6px] text-[11px] font-[600] uppercase tracking-[0.08em] text-[#28191080]">Actions</div>
                <div className="flex flex-col max-h-[220px] overflow-y-auto">
                  {[...open.events].reverse().map((e) => (
                    <div key={e.id} className="grid grid-cols-[76px_56px_minmax(0,1fr)] gap-[8px] px-[4px] py-[5px] text-[12px] leading-[17px]">
                      <span className="font-mono text-[#28191080]">{clock(e.at)}</span>
                      <span className="font-mono text-[10.5px] leading-[17px] text-[#2819109E] uppercase">{e.channel}</span>
                      <span className="text-[#281910CC]">{e.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-[2px] p-[10px] rounded-[12px] bg-[#F4EEDF99] min-w-0">
      <span className="text-[11.5px] font-[600] text-[#28191099]">{k}</span>
      <span className="text-[13.5px] font-[600] truncate">{v}</span>
    </div>
  );
}

function Schedule({ state, onOpen }: { state: ClinicStatePayload | null; onOpen: (id: string) => void }) {
  if (!state) return <Title>Schedule</Title>;
  const now = Date.now();
  const who = (id?: string) => state.sessions.find((s) => s.id === id);
  return (
    <>
      <Title kicker="Nov 2 to 6">Schedule</Title>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[6px]">
        {state.availability.map((d) => (
          <Card key={d.day} title={`${d.weekday} ${d.date}`}>
            <div className="flex flex-col gap-[4px]">
              {d.slots.map((x) => {
                const st = state.slots[x.id];
                const taken = Boolean(st && (st.kind !== "held" || (st.until && Date.parse(st.until) > now)));
                const s = taken ? who(st!.sessionId) : undefined;
                const label = !taken ? "Open" : st!.kind === "booked" ? "Booked" : st!.kind === "requested" ? "Requested" : "Held";
                return (
                  <button
                    key={x.id}
                    type="button"
                    disabled={!s}
                    onClick={() => s && onOpen(s.id)}
                    className="flex flex-col gap-[2px] p-[10px] rounded-[14px] bg-[#FFFCF1] text-left disabled:cursor-default"
                  >
                    <span className="flex items-center justify-between gap-[6px]">
                      <span className="text-[13.5px] font-[700]">{x.time}</span>
                      <span
                        className="h-[20px] px-[7px] flex items-center rounded-full text-[10.5px] font-[700]"
                        style={{ backgroundColor: label === "Open" ? "#F4EEDF" : label === "Booked" ? "#DCE5D0" : label === "Requested" ? "#E3E9D9" : "#F3E7C9" }}
                      >
                        {label}
                      </span>
                    </span>
                    <span className="text-[11.5px] text-[#2819109E] truncate">{x.provider}</span>
                    {s && <span className="text-[12px] font-[600] truncate">{s.userName}</span>}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function Services({ config, onConfig }: { config: DemoConfig | null; onConfig: (c: Partial<DemoConfig>) => Promise<void> }) {
  if (!config) return <Title>Services & Pricing</Title>;
  const rows = [
    ...SERVICES.map((s) => ({ id: s.id, name: s.name, sub: s.duration, price: s.price })),
    ...BUNDLES.map((b) => ({ id: b.id, name: b.name, sub: "Bundle", price: b.price })),
  ];
  const pct = Math.round(config.floorPct * 100);
  return (
    <>
      <Title kicker="Private pay · what agents can book">Services & Pricing</Title>
      <Card className="mb-[12px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[4px]">
        <div className="flex items-center gap-[12px] p-[14px] rounded-[16px] bg-[#FFFCF1]">
          <span className="grow">
            <span className="block text-[14px] font-[600]">Lowest Negotiated Price</span>
            <span className="block text-[12.5px] text-[#2819109E]">{pct}% of list</span>
          </span>
          <button type="button" aria-label="Lower" onClick={() => void onConfig({ floorPct: Math.max(0.5, config.floorPct - 0.01) })} className="w-[36px] h-[36px] rounded-full bg-[#F4EEDF] text-[18px] font-[600]">
            −
          </button>
          <button type="button" aria-label="Raise" onClick={() => void onConfig({ floorPct: Math.min(1, config.floorPct + 0.01) })} className="w-[36px] h-[36px] rounded-full bg-[#F4EEDF] text-[18px] font-[600]">
            +
          </button>
        </div>
        <button type="button" role="switch" aria-checked={config.autoConfirm} onClick={() => void onConfig({ autoConfirm: !config.autoConfirm })} className="flex items-center gap-[12px] p-[14px] rounded-[16px] bg-[#FFFCF1] text-left">
          <span className="grow">
            <span className="block text-[14px] font-[600]">Auto-Confirm Agent Bookings</span>
            <span className="block text-[12.5px] text-[#2819109E]">{config.autoConfirm ? "On" : "Off · staff confirm each request"}</span>
          </span>
          <Check on={config.autoConfirm} />
        </button>
      </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-[4px]">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => void onConfig({ bookable: { [r.id]: !config.bookable[r.id] } })}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] md:grid-cols-[minmax(0,1fr)_120px_140px_auto] items-center gap-[12px] p-[14px] rounded-[16px] bg-[#FFFCF1] text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-[600]">{r.name}</span>
                <span className="block text-[12px] text-[#2819109E]">{r.sub}</span>
              </span>
              <span className="text-[14px] font-[700]">{money(r.price)}</span>
              <span className="hidden md:block text-[12.5px] text-[#2819109E]">Floor {money(Math.round((r.price * config.floorPct) / 5) * 5)}</span>
              <span className="flex items-center gap-[8px] text-[12px] font-[600]">
                <span className="hidden sm:inline">{config.bookable[r.id] ? "Bookable" : "Off"}</span>
                <Check on={Boolean(config.bookable[r.id])} size={20} />
              </span>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

function Forms({ sessions }: { sessions: Session[] }) {
  const withForms = sessions.filter((s) => s.forms.status === "sent" || Object.keys(s.forms.assessments).length > 0 || s.forms.signedBy);
  const [openId, setOpenId] = useState<string | null>(null);
  const f = withForms.find((s) => s.id === openId) ?? withForms[0];
  return (
    <>
      <Title>Forms</Title>
      {!f ? (
        <Card>
          <Empty>No forms yet. They appear here as agents fill them.</Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[12px]">
          <Card>
            <div className="flex flex-col gap-[4px]">
              {withForms.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setOpenId(x.id)}
                  className={`flex items-center gap-[12px] p-[12px] rounded-[16px] bg-[#FFFCF1] text-left ${x.id === f.id ? "ring-[1.5px] ring-[#3A2516]" : ""}`}
                >
                  <span className="grow min-w-0">
                    <span className="block truncate text-[14px] font-[600]">{x.userName}</span>
                    <span className="block truncate text-[12.5px] text-[#2819109E]">
                      {x.scores.filter((s) => s.complete).length} of 4 assessments · {x.agentName}
                    </span>
                  </span>
                  <span className={`shrink-0 h-[24px] px-[10px] flex items-center rounded-full text-[11.5px] font-[700] ${x.forms.status === "sent" ? "bg-[#DCE5D0]" : "bg-[#F3E7C9]"}`}>
                    {x.forms.status === "sent" ? "Returned" : "In Progress"}
                  </span>
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <div className="rounded-[18px] bg-[#FFFCF1] p-[16px]">
              <div className="flex items-baseline justify-between gap-[12px]">
                <div className={`${DISPLAY} text-[21px] leading-[25px]`}>{f.userName}</div>
                <span className="text-[12px] font-[600] text-[#28191080]">{f.forms.sentAt ? `Returned ${clock(f.forms.sentAt)}` : "In Progress"}</span>
              </div>
              <div className="mt-[14px] grid grid-cols-2 gap-[6px]">
                {f.scores.map((x) => (
                  <div key={x.id} className="flex flex-col gap-[4px] p-[12px] rounded-[14px] bg-[#F4EEDF99]">
                    <span className="text-[11.5px] font-[600] text-[#28191099]">{x.name}</span>
                    <span className={`${DISPLAY} text-[22px] leading-[26px]`}>{x.score ?? "…"}</span>
                    <span className="self-start h-[20px] px-[8px] flex items-center rounded-full text-[10.5px] font-[700]" style={{ backgroundColor: x.tone ?? "#F4EEDF" }}>
                      {x.band ?? "Not Finished"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
                {INTAKE_FIELDS.filter((x) => x.id !== "consent").map((x) => (
                  <div key={x.id} className="flex flex-col gap-[2px] p-[10px] rounded-[12px] bg-[#F4EEDF99]">
                    <span className="text-[11.5px] font-[600] text-[#28191099]">{x.label}</span>
                    <span className="text-[14px] font-[500] break-words">{f.forms.intake[x.id]?.trim() || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="mt-[10px] flex items-center gap-[10px] p-[12px] rounded-[12px] border-[1.5px] border-dashed border-[#28191033]">
                <Check on={Boolean(f.forms.signedBy)} size={20} />
                <span className="text-[13px]">{f.forms.signedBy ? `Consent signed by ${f.forms.signedBy} · PHI provided via Doe` : "Awaiting Signature"}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
