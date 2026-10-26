"use client";

/**
 * Index tab — a literal index of the practice: one serif row per part of Doe, each with its live
 * status. Rows open in place (Providers-style) to show detail, and jump to their tab.
 */
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { SlowDotWave } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { SHOW_LEGACY_PROVIDERS } from "@/components/doehealth-product/DoeHealthProductProviders";
import { useLocations } from "@/components/doehealth-product/DoeHealthProductLocations";
type IndexTab = "schedule" | "interface" | "services" | "providers" | "locations" | "transit" | "payments" | "permissions";
type SectionId = "needs" | Exclude<IndexTab, "permissions"> | "agents" | "messages" | "systems";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const BODY = "font-['Inter-Regular','Inter',system-ui,sans-serif]";
const CHIP = `flex items-center h-[24px] shrink-0 px-[9px] rounded-[999px] text-[12px] leading-[16px] ${BODY} font-[500] text-walnut`;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function Glyph({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: "0" }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

/** Each provider gets its own disc tone and meter colour, all drawn from the Index palette. */
const PROVIDERS = [
  { name: "Dr. Brooks", status: "Room 2", seen: 5, booked: 9, here: true, tone: "#F7DCCB", meter: "#E07B53" },
  { name: "Dr. Patel", status: "Room 4", seen: 6, booked: 8, here: true, tone: "#DCE5D0", meter: "#6E9A5B" },
  { name: "Dr. Shah", status: "Room 1", seen: 3, booked: 6, here: true, tone: "#E9DCC7", meter: "#B98A55" },
  { name: "Dr. Chen", status: "Left at 1", seen: 7, booked: 7, here: true, tone: "#FCCFB8", meter: "#6F8FA3" },
  { name: "Dr. Lee", status: "Back Monday", seen: 0, booked: 0, here: false, tone: "#EEEADF", meter: "#A8A192" },
];

type Section = {
  id: SectionId;
  title: string;
  tile: string;
  icon?: ReactNode;
  summary?: ReactNode;
  tab?: IndexTab;
};

const SECTIONS: Section[] = [
  {
    id: "needs",
    title: "Needs you",
    tile: "#F7DCCB",
    icon: (
      <Glyph>
        <path d="M12 4.5a5 5 0 0 0-5 5v3.2L5.5 16h13L17 12.7V9.5a5 5 0 0 0-5-5zM10 19a2 2 0 0 0 4 0" />
      </Glyph>
    ),
  },
  {
    id: "schedule",
    title: "Schedule",
    tab: "schedule",
    tile: "#E9DCC7",
    icon: (
      <Glyph>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </Glyph>
    ),
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>38 booked</span>
      </>
    ),
  },
  {
    id: "interface",
    title: "Interface",
    tab: "interface",
    tile: "#E3E9D9",
    icon: (
      <Glyph>
        <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z" />
      </Glyph>
    ),
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>128 agent requests</span>
        <span className={`${CHIP} bg-sand`}>47 calls</span>
      </>
    ),
  },
  {
    id: "agents",
    title: "Agents",
    tab: "permissions",
    tile: "#DCE5D0",
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>12 Booked by Agents</span>
        <span className={`${CHIP} bg-sand`}>31 visits</span>
      </>
    ),
  },
  {
    id: "messages",
    title: "Messages",
    tile: "#FCCFB8",
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>6 unread</span>
        <span className={`${CHIP} bg-salmon`}>1 draft ready</span>
      </>
    ),
  },
  {
    id: "services",
    title: "Services",
    tab: "services",
    tile: "#EEEADF",
    icon: (
      <Glyph>
        <path d="M9 7h10M9 12h10M9 17h10" />
        <circle cx="5" cy="7" r="0.6" />
        <circle cx="5" cy="12" r="0.6" />
        <circle cx="5" cy="17" r="0.6" />
      </Glyph>
    ),
    summary: <span className={`${CHIP} bg-sand`}>24 offered</span>,
  },
  {
    id: "providers",
    title: "Providers",
    tab: "providers",
    tile: "#F7DCCB",
    icon: (
      <Glyph>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" />
      </Glyph>
    ),
    summary: (
      <span className="flex items-center gap-[8px]">
        <span className="flex items-center">
          {PROVIDERS.filter((p) => p.here).map((p, i) => (
            <span
              key={p.name}
              className={`w-[24px] h-[24px] rounded-[999px] border-2 border-solid [border-color:#FAF6EC] ${i > 0 ? "-ml-[6px]" : ""}`}
              style={{ backgroundColor: p.tone }}
            />
          ))}
        </span>
        <span className={`${CHIP} bg-sand`}>4 in today</span>
      </span>
    ),
  },
  {
    id: "locations",
    title: "Locations",
    tab: "locations",
    tile: "#E3E9D9",
  },
  {
    id: "transit",
    title: "Transit",
    tab: "transit",
    tile: "#EEEADF",
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>6 in today</span>
        <span className={`${CHIP} bg-sand`}>6 out</span>
        <span className={`${CHIP} bg-salmon`}>3 need you</span>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    tab: "payments",
    tile: "#E9DCC7",
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>$4,210 today</span>
        <span className={`${CHIP} bg-sand`}>$287 due</span>
      </>
    ),
  },
  {
    id: "systems",
    title: "Systems",
    tile: "#E9DCC7",
    icon: (
      <Glyph>
        <circle cx="12" cy="12" r="8.5" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
        <path d="M3.5 12h17" />
      </Glyph>
    ),
    summary: (
      <>
        <span className={`${CHIP} bg-sand`}>4 connected</span>
        <span className={`${CHIP} bg-salmon`}>Waystar offline</span>
      </>
    ),
  },
];

const ACCENT = "#C2603A";
const GREEN = "#6E9A5B";
/** Soft inner surface on a paper card: a half-step between paper and the beige row. */
const WELL = "#F7F2E6";

/** Agent hand-offs waiting on Dr. Brooks. Each one is something an agent could not finish on its own. */
const NEEDS = [
  { id: "leo", who: "James Lisondra", time: "9:30", what: "Worsening Headache, booked with Dr. Brooks", from: "Muse", action: "Review", tone: "#F7DCCB" },
  { id: "grace", who: "Grace Kim", time: "10:42", what: "Pickup moves to CVS Beacon St", from: "Pharmacy Change Request", action: "Approve", tone: "#DCE5D0" },
  { id: "lily", who: "Lily’s mom", time: "1:48", what: "Wants Dr. Patel. Nothing open before Thu", from: "About EEG Visit", action: "Pick slot", tone: "#FCCFB8" },
  { id: "henry", who: "Henry Walsh", time: "9:30", what: "MRI results held until the $40 copay is paid", from: "Billing", action: "Release", tone: "#E9DCC7" },
] as const;

const DAY_FROM = 12;
const DAY_TO = 18;
const NOW = 15 + 20 / 60;
const LANES = [
  { who: "Brooks", blocks: [[12.25, 0.5], [13, 0.5], [13.75, 0.75], [14.75, 0.5], [15.5, 0.5], [16, 0.5], [16.75, 0.5]] },
  { who: "Patel", blocks: [[12, 0.75], [13.25, 0.5], [14, 0.5], [15, 0.5], [15.75, 0.5], [16.5, 0.75]] },
  { who: "Shah", blocks: [[12.5, 0.5], [13.5, 0.75], [14.5, 0.5], [16.25, 0.5], [17, 0.5]] },
  { who: "Chen", blocks: [[12, 0.75], [13.25, 0.5], [14, 0.5], [15, 0.5], [15.75, 0.5], [16.5, 0.75]] },
] as { who: string; blocks: [number, number][] }[];

const CALL_MIX = [
  { label: "Scheduling", value: 16, color: "#F2BFA6" },
  { label: "Intake", value: 9, color: "#B9CDA8" },
  { label: "Billing", value: 8, color: "#D9C49F" },
  { label: "Records", value: 7, color: "#CDC2BA" },
  { label: "Office", value: 7, color: "#E7DCC6" },
];

const AGENT_COUNTS = [
  { name: "ChatGPT", value: 6 },
  { name: "Gemini", value: 4 },
  { name: "Claude", value: 2 },
];

const THREADS = [
  { id: "grace", initials: "GK", who: "Grace Kim", time: "2:58", text: "Can I pick up the refill at the Beacon St CVS instead?", draft: "Yes, I’ve moved it to CVS on Beacon St. It’ll be ready after 5 today." },
  { id: "marcus", initials: "MW", who: "Marcus Webb", time: "1:17", text: "Should I be worried about the MRI report?", draft: "Dr. Brooks will call you tomorrow to go over it. Nothing urgent in the meantime." },
  { id: "ava", initials: "AM", who: "Ava Morales", time: "12:05", text: "Uploaded my insurance card, front and back.", draft: "Thanks, Ava. We’ve got it and your visit is all set." },
];

const SERVICES = [
  { id: "migraine", name: "Migraine follow-up", price: "$25 copay", week: 18, trend: [4, 6, 5, 9, 8, 12, 18] },
  { id: "eeg", name: "Routine EEG", price: "Covered", week: 14, trend: [2, 3, 6, 5, 9, 11, 14] },
  { id: "consult", name: "New patient consult", price: "$40 with most plans", week: 9, trend: [7, 8, 6, 9, 7, 8, 9] },
];

const STEPS = ["Sent", "Accepted", "Scheduled", "Seen"];
const REFERRAL_ROWS = [
  { id: "leo", who: "Leo Jacobs", specialty: "EEG lab", tone: PROVIDERS[0].tone, step: 0, stalled: "No reply in 4 days" },
  { id: "henry", who: "Henry Walsh", specialty: "Neuropsych", tone: PROVIDERS[1].tone, step: 1 },
  { id: "grace", who: "Grace Kim", specialty: "Physical therapy", tone: PROVIDERS[2].tone, step: 2 },
];

const OWED = [
  { id: "priya", initials: "PR", who: "Priya Raman", what: "New patient consult", amount: "$185" },
  { id: "daniel", initials: "DO", who: "Daniel Okafor", what: "EEG, after insurance", amount: "$62" },
  { id: "henry", initials: "HW", who: "Henry Walsh", what: "MRI copay", amount: "$40" },
];

const SYSTEMS = [
  { mark: "M", name: "ModMed", role: "Schedule", synced: "1 min ago", live: true },
  { mark: "P", name: "Phreesia", role: "Intake", synced: "2 min ago", live: true },
  { mark: "I", name: "InstaMed", role: "Payments", synced: "Just now", live: true },
  { mark: "K", name: "Kno2", role: "Referrals", synced: "4 min ago", live: true },
  { mark: "W", name: "Waystar", role: "Insurance", synced: "Since 9:12", live: false },
];

/** Coloured row tile for each index section; the icon glyph is left out. */
function Tile({ color }: { color: string }) {
  return <span className="w-[48px] h-[48px] shrink-0 rounded-[12px]" style={{ backgroundColor: color }} />;
}

function Pill({ children, primary, onClick, className = "" }: { children: ReactNode; primary?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center h-[32px] shrink-0 px-[14px] gap-[6px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${primary ? "bg-ink [color:#FFFCF1] hover:bg-[#2B1D12]" : "bg-[#F1EBDD] text-walnut hover:bg-[#EAE2D1]"} ${className}`}
    >
      {children}
    </button>
  );
}

function Check({ size = 14 }: { size?: number }) {
  return (
    <Glyph size={size}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Glyph>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col min-w-[0px] rounded-[22px] bg-paper p-[16px] ${className}`}>{children}</div>;
}

function Avatar({ initials, size = 36, tone = WELL }: { initials: string; size?: number; tone?: string }) {
  return (
    <span
      className={`shrink-0 flex items-center justify-center rounded-[999px] ${SANS} font-[600] text-walnut`}
      style={{ width: size, height: size, fontSize: size * 0.34, backgroundColor: tone }}
    >
      {initials}
    </span>
  );
}

function Chip({ children, dot, tone = WELL }: { children: ReactNode; dot?: string; tone?: string }) {
  return (
    <span className={`flex items-center gap-[6px] h-[24px] shrink-0 px-[9px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: tone }}>
      {dot && <span className="w-[6px] h-[6px] rounded-[99px]" style={{ backgroundColor: dot }} />}
      {children}
    </span>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative w-[38px] h-[22px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#E4DCCB]"}`}
    >
      <span className="absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-[999px] bg-paper" style={{ transform: `translateX(${on ? 16 : 0}px)`, transition: `transform 240ms ${EASE}` }} />
    </button>
  );
}

function Ring({ value, size = 64, stroke = 7, color = "#E8A585", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={WELL} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * Math.max(0.001, value)} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

const TITLE = `text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`;
const MUTED = `text-[12px] leading-[16px] ${SANS} font-[500] text-sub`;

/** Plain round badge in the card's top-left, filled with the card's tone. */
function KindIcon({ tone }: { tone: string }) {
  return <span className="w-[32px] h-[32px] shrink-0 rounded-full" style={{ backgroundColor: tone }} />;
}

/** Width of the soft fade on a carousel edge that still has cards hidden past it. */
const CAROUSEL_FADE = 48;

function NeedsDetail({ done, onDone }: { done: Set<string>; onDone: (id: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  /** Fades a side only while there are cards scrolled out of view beyond it. */
  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  };

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const l = edges.left ? CAROUSEL_FADE : 0;
  const r = edges.right ? CAROUSEL_FADE : 0;
  const mask = `linear-gradient(90deg, transparent 0px, #000 ${l}px, #000 calc(100% - ${r}px), transparent 100%)`;

  return (
    <div
      ref={trackRef}
      onScroll={measure}
      className="flex gap-[8px] overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {NEEDS.map((n, i) => {
        const isDone = done.has(n.id);
        return (
          <Card key={n.id} className={`w-[232px] shrink-0 snap-start gap-[12px] transition-opacity duration-300 ${isDone ? "opacity-60" : ""}`}>
            <span className="flex items-center justify-between">
              <KindIcon tone={n.tone} />
              <span className={MUTED}>{n.time}</span>
            </span>
            <span className="flex flex-col gap-[2px] min-h-[72px]">
              <span className={TITLE}>{n.who}</span>
              <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-walnut`}>{n.what}</span>
              <span className={MUTED}>{n.from}</span>
            </span>
            {isDone ? (
              <span className={`flex items-center justify-center gap-[6px] h-[32px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: WELL }}>
                <Check />
                Done
              </span>
            ) : (
              <Pill primary={i === 0} onClick={() => onDone(n.id)}>
                {n.action}
              </Pill>
            )}
          </Card>
        );
      })}
    </div>
  );
}

const at = (hour: number) => `${((hour - DAY_FROM) / (DAY_TO - DAY_FROM)) * 100}%`;

function ScheduleDetail() {
  const [checkedIn, setCheckedIn] = useState(false);
  return (
    <div className="grid grid-cols-[1fr_250px] gap-[8px]">
      <Card className="gap-[10px]">
        <span className="flex items-center justify-between">
          <span className={TITLE}>Afternoon</span>
        </span>
        <div className="relative flex flex-col gap-[6px]">
          {LANES.map((lane) => (
            <div key={lane.who} className="flex items-center gap-[10px]">
              <span className={`w-[56px] shrink-0 ${MUTED}`}>{lane.who}</span>
              <div className="relative grow h-[26px] rounded-[10px]" style={{ backgroundColor: WELL }}>
                {lane.blocks.map(([start, len]) => {
                  const past = start + len <= NOW;
                  const current = start <= NOW && start + len > NOW;
                  const next = start === 15.5 && lane.who === "Brooks";
                  return (
                    <span
                      key={start}
                      className="absolute top-[4px] bottom-[4px] rounded-[7px]"
                      style={{
                        left: `calc(${at(start)} + 2px)`,
                        width: `calc(${(len / (DAY_TO - DAY_FROM)) * 100}% - 4px)`,
                        backgroundColor: next ? "#E8A585" : current ? "#281910" : past ? "#E6DCC8" : "#EFE3CF",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute top-[-4px] bottom-[-4px] left-[66px] right-0">
            <span className="absolute top-0 bottom-0 w-[1.5px] -translate-x-1/2" style={{ left: at(NOW), backgroundColor: ACCENT }} />
          </div>
        </div>
        <div className="relative h-[14px] ml-[66px]">
          {[12, 13, 14, 15, 16, 17, 18].map((h) => (
            <span key={h} className={`absolute -translate-x-1/2 text-[11px] leading-[14px] ${SANS} text-sub`} style={{ left: at(h) }}>
              {h === 12 ? "12" : h - 12}
            </span>
          ))}
        </div>
      </Card>
      <Card className="gap-[12px]">
        <span className={TITLE}>Recent</span>
        <span className="flex items-center gap-[10px]">
          <span className="w-[36px] h-[36px] shrink-0 rounded-full" style={{ backgroundColor: "#FCCFB8" }} />
          <span className="flex flex-col min-w-[0px]">
            <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>James Lisondra</span>
            <span className={MUTED}>Booked</span>
          </span>
        </span>
        <span className="grid grid-cols-2 gap-[6px]">
          <Chip><span className="text-[#4F6B42]"><Check size={12} /></span>Intake</Chip>
          <Chip><span className="text-[#4F6B42]"><Check size={12} /></span>Co-Pay</Chip>
          <Chip><span className="text-[#4F6B42]"><Check size={12} /></span>Harbor</Chip>
          <Chip><span className="text-[#4F6B42]"><Check size={12} /></span>Exam B</Chip>
        </span>
        <Pill primary={!checkedIn} onClick={() => setCheckedIn(true)} className="mt-auto">
          {checkedIn ? (
            <>
              <Check />
              Checked in
            </>
          ) : (
            "See details"
          )}
        </Pill>
      </Card>
    </div>
  );
}

/** Calls on the line first, then recent ones. */
const CALLS = [
  { name: "James Lisondra", about: "Booking appt", time: "Now", live: true },
  { name: "Hannah Lee", about: "Moving Friday’s visit", time: "2:14", live: true },
  { name: "Marcus Webb", about: "Gabapentin dose question", time: "0:48", live: true },
  { name: "Mia Jacobs", about: "Leo’s staring spells again", time: "11:08", live: false },
  { name: "Lily’s mom", about: "Asked for Dr. Patel", time: "1:48", live: false },
  { name: "Grace Kim", about: "Pickup moved to Beacon St", time: "10:42", live: false },
  { name: "Ava Morales", about: "Uploaded insurance card", time: "12:05", live: false },
  { name: "Henry Walsh", about: "MRI results question", time: "9:30", live: false },
];

/** Width of the soft fade on a carousel edge that still has cards hidden past it. */
const CALL_FADE = 40;

/** Horizontal carousel of call cards; fades only on the side that has hidden cards. */
function CallCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  };

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const l = edges.left ? CALL_FADE : 0;
  const r = edges.right ? CALL_FADE : 0;
  const mask = `linear-gradient(90deg, transparent 0px, #000 ${l}px, #000 calc(100% - ${r}px), transparent 100%)`;

  return (
    <div
      ref={trackRef}
      onScroll={measure}
      className="flex gap-[8px] overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {CALLS.map((c) => (
        <Card key={c.name} className="w-[180px] h-[170px] shrink-0 snap-start justify-between">
          <span className="flex items-center justify-between gap-[8px]">
            <Chip dot={c.live ? GREEN : undefined}>
              {c.live ? "On the line" : "Recent"}
            </Chip>
            <span className={MUTED}>{c.time}</span>
          </span>
          <span className="flex flex-col min-w-[0px]">
            <span className={TITLE}>{c.name}</span>
            <span className={`truncate ${MUTED}`}>{c.about}</span>
          </span>
          <Pill primary={c.live} className="w-full">
            {c.live ? "See Details" : "Listen"}
          </Pill>
        </Card>
      ))}
    </div>
  );
}

function VoiceDetail() {
  const total = CALL_MIX.reduce((sum, c) => sum + c.value, 0);
  const dots = CALL_MIX.flatMap((c) => Array.from({ length: c.value }, () => c.color));
  return (
    <div className="grid grid-cols-[260px_1fr] gap-[8px]">
    <Card className="h-[170px] justify-center">
      <div className="flex flex-col grow min-w-[0px] justify-center gap-[14px]">
        <div className="flex items-baseline gap-[8px]">
          <span className={`text-[28px] leading-[30px] ${DISPLAY} text-ink`}>{total}</span>
          <span className={MUTED}>calls today</span>
        </div>
        <div className="flex flex-wrap gap-[5px]">
          {dots.map((color, i) => (
            <span key={i} className="w-[9px] h-[9px] rounded-[99px]" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-[12px] gap-y-[4px]">
          {CALL_MIX.map((c) => (
            <span key={c.label} className="flex items-center gap-[5px]">
              <span className="w-[7px] h-[7px] rounded-[99px]" style={{ backgroundColor: c.color }} />
              <span className={MUTED}>{c.label}</span>
            </span>
          ))}
        </div>
      </div>
    </Card>
    <CallCarousel />
    </div>
  );
}

function AgentsDetail() {
  const [accepting, setAccepting] = useState(true);
  return (
    <div className="grid grid-cols-[1fr_250px] gap-[8px]">
      <Card className="gap-[10px]">
        <span className="flex items-center gap-[8px]">
          <Chip tone="#281910">
            <span className="[color:#FFFCF1]">ChatGPT</span>
          </Chip>
          <span className={MUTED}>for Maya Chen · 9:12</span>
        </span>
        <span className={`self-start max-w-[80%] px-[14px] py-[10px] rounded-[18px] rounded-tl-[6px] text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: WELL }}>
          Is there a migraine follow-up before work this week? She has Harbor.
        </span>
        <span className="self-end flex items-center gap-[12px] w-[78%] p-[12px] rounded-[18px] rounded-tr-[6px] border border-solid border-[#2819101F]">
          <span className="w-[44px] h-[44px] shrink-0 flex flex-col items-center justify-center rounded-[12px] bg-ink [color:#FFFCF1]">
            <span className={`text-[10px] leading-[12px] ${SANS} font-[600] uppercase`}>Thu</span>
            <span className={`text-[17px] leading-[20px] ${DISPLAY}`}>22</span>
          </span>
          <span className="flex flex-col grow min-w-[0px]">
            <span className={TITLE}>8:30 AM · Dr. Brooks</span>
            <span className={MUTED}>Migraine follow-up · $0 with Harbor</span>
          </span>
          <Chip dot={GREEN}>Booked</Chip>
        </span>
      </Card>
      <Card className="gap-[12px]">
        <span className="flex items-center justify-between">
          <span className={TITLE}>{accepting ? "Accepting agents" : "Agents paused"}</span>
          <Toggle on={accepting} onChange={() => setAccepting((v) => !v)} label="Accept agents" />
        </span>
        <span className="flex items-center gap-[12px]">
          <Ring value={accepting ? 12 / 16 : 0}>
            <span className={`text-[18px] leading-[20px] ${DISPLAY} text-ink`}>12</span>
          </Ring>
          <span className={MUTED}>booked by agents today, of 16 asks</span>
        </span>
        <span className="flex flex-col gap-[6px] mt-auto">
          {AGENT_COUNTS.map((a) => (
            <span key={a.name} className="flex items-center justify-between">
              <span className={MUTED}>{a.name}</span>
              <span className={`text-[12px] leading-[16px] ${SANS} font-[600] text-walnut`}>{a.value}</span>
            </span>
          ))}
        </span>
      </Card>
    </div>
  );
}

function MessagesDetail() {
  const [picked, setPicked] = useState(THREADS[0]!.id);
  const [sent, setSent] = useState<Set<string>>(() => new Set());
  const thread = THREADS.find((t) => t.id === picked)!;
  const isSent = sent.has(thread.id);
  return (
    <Card className="grid grid-cols-[270px_1fr] gap-[12px] p-[8px]">
      <span className="flex flex-col gap-[2px]">
        {THREADS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPicked(t.id)}
            className={`flex items-center gap-[10px] p-[10px] rounded-[16px] text-left transition-colors duration-150 ${picked === t.id ? "" : "hover:bg-[#FAF6EC]"}`}
            style={picked === t.id ? { backgroundColor: WELL } : undefined}
          >
            <Avatar initials={t.initials} size={32} tone={picked === t.id ? "#FFFCF1" : WELL} />
            <span className="flex flex-col grow min-w-[0px]">
              <span className="flex items-center justify-between gap-[6px]">
                <span className={`text-[13px] leading-[18px] ${SANS} font-[600] text-walnut`}>{t.who}</span>
                <span className={MUTED}>{t.time}</span>
              </span>
              <span className={`truncate ${MUTED}`}>{t.text}</span>
            </span>
            {!sent.has(t.id) && <span className="w-[7px] h-[7px] shrink-0 rounded-[99px]" style={{ backgroundColor: ACCENT }} />}
          </button>
        ))}
      </span>
      <span key={thread.id} className="doe-menu-in flex flex-col gap-[10px] p-[8px]">
        <span className={`self-start max-w-[90%] px-[14px] py-[10px] rounded-[18px] rounded-tl-[6px] text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: WELL }}>
          {thread.text}
        </span>
        <span className="flex flex-col gap-[10px] p-[12px] rounded-[18px] border border-solid border-[#2819101F]">
          <span className={`flex items-center gap-[6px] ${MUTED}`}>
            <span className="w-[6px] h-[6px] rounded-[99px]" style={{ backgroundColor: isSent ? GREEN : "#E8A585" }} />
            {isSent ? "Sent" : "Drafted by Doe"}
          </span>
          <span className={`text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`}>{thread.draft}</span>
          <span className="flex justify-end gap-[6px]">
            {!isSent && <Pill>Edit</Pill>}
            <Pill primary={!isSent} onClick={() => setSent((prev) => new Set(prev).add(thread.id))}>
              {isSent ? (
                <>
                  <Check />
                  Sent
                </>
              ) : (
                "Send"
              )}
            </Pill>
          </span>
        </span>
      </span>
    </Card>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 200;
  const h = 40;
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 4 - (v / max) * (h - 8)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1]!;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="#FCCFB84D" />
      <path d={d} fill="none" stroke="#E8A585" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#C2603A" />
    </svg>
  );
}

function ServicesDetail() {
  const [bookable, setBookable] = useState<Record<string, boolean>>({ migraine: true, eeg: true, consult: true });
  return (
    <div className="grid grid-cols-3 gap-[8px]">
      {SERVICES.map((s) => (
        <Card key={s.id} className="gap-[12px]">
          <span className="flex items-start justify-between gap-[8px]">
            <span className="flex flex-col">
              <span className={TITLE}>{s.name}</span>
              <span className={MUTED}>{s.price}</span>
            </span>
            <span className={`text-[22px] leading-[26px] ${DISPLAY} text-ink`}>{s.week}</span>
          </span>
          <Sparkline values={s.trend} />
          <span className="flex items-center justify-between pt-[10px] border-t border-solid border-line">
            <span className={MUTED}>Agents can book</span>
            <Toggle on={!!bookable[s.id]} onChange={() => setBookable((prev) => ({ ...prev, [s.id]: !prev[s.id] }))} label={`Agents can book ${s.name}`} />
          </span>
        </Card>
      ))}
    </div>
  );
}

function ProvidersDetail() {
  return (
    <div className="grid grid-cols-5 gap-[8px]">
      {PROVIDERS.map((p) => (
        <Card key={p.name} className={`items-center gap-[10px] text-center ${p.here ? "" : "opacity-55"}`}>
          <Ring value={p.booked ? p.seen / p.booked : 0} size={72} stroke={6} color={p.meter}>
            <span className="block rounded-[999px]" style={{ width: 52, height: 52, backgroundColor: p.tone }} />
          </Ring>
          <span className="flex flex-col items-center">
            <span className={TITLE}>{p.name}</span>
            <span className={MUTED}>{p.here && p.booked ? `${p.booked} Booked` : "Off today"}</span>
          </span>
          {p.here && p.status.startsWith("Room") ? (
            <button
              type="button"
              className={`flex items-center gap-[4px] h-[24px] shrink-0 pl-[9px] pr-[6px] rounded-[999px] bg-[#F1EBDD] hover:bg-[#EAE2D1] transition-colors duration-150 text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
            >
              See Details
              <Glyph size={14}>
                <path d="M9 6l6 6-6 6" />
              </Glyph>
            </button>
          ) : (
            <Chip>{p.status}</Chip>
          )}
        </Card>
      ))}
    </div>
  );
}

/** Every site in the group, with who works there and how busy it is today. */
function LocationsDetail() {
  const { locations } = useLocations();
  return (
    <div className="flex gap-[8px] overflow-x-auto snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {locations.map((l) => (
        <Card key={l.id} className={`w-[196px] shrink-0 snap-start gap-[12px] ${l.status === "paused" ? "opacity-60" : ""}`}>
          <span className="flex items-center justify-between">
            <span className="w-[32px] h-[32px] flex items-center justify-center rounded-full" style={{ backgroundColor: l.tone }}>
              <span className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: l.dot }} />
            </span>
            {l.status === "open" ? <Chip dot={GREEN}>Open</Chip> : <Chip tone="#F3E7C9">{l.note ?? "Paused"}</Chip>}
          </span>
          <span className="flex flex-col min-h-[52px]">
            <span className={`${TITLE} line-clamp-2`}>{l.name || "Untitled location"}</span>
            <span className={MUTED}>{l.city || "No address yet"}</span>
          </span>
          <span className="flex items-center justify-between pt-[10px] border-t border-solid border-line">
            <span className={MUTED}>{l.providers.length} {l.providers.length === 1 ? "provider" : "providers"}</span>
            <span className={`text-[12px] leading-[16px] ${SANS} font-[600] text-walnut`}>{l.stats.today} today</span>
          </span>
        </Card>
      ))}
    </div>
  );
}

function ReferralsDetail() {
  const [nudged, setNudged] = useState(false);
  return (
    <Card className="gap-[4px] p-[8px]">
      {REFERRAL_ROWS.map((r) => (
        <div key={r.id} className="grid grid-cols-[220px_1fr_120px] items-center gap-[16px] p-[10px] rounded-[16px] hover:bg-[#FAF6EC] transition-colors duration-150">
          <span className="flex items-center gap-[10px] min-w-[0px]">
            <span className="shrink-0 w-[32px] h-[32px] rounded-[999px]" style={{ backgroundColor: r.tone }} />
            <span className="flex items-center gap-[8px] min-w-[0px]">
              <span className={`truncate text-[13px] leading-[18px] ${SANS} font-[600] text-walnut`}>{r.who}</span>
              <Chip>{r.specialty}</Chip>
            </span>
          </span>
          <span className="flex items-center">
            {STEPS.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && <span className="grow h-[2px] rounded-[2px]" style={{ backgroundColor: i <= r.step ? "#E8A585" : WELL }} />}
                <span className="relative flex flex-col items-center">
                  <span
                    className="w-[14px] h-[14px] rounded-[999px] border-2 border-solid"
                    style={{ borderColor: i <= r.step ? "#E8A585" : "#E4DCCB", backgroundColor: i < r.step ? "#E8A585" : "#FFFCF1" }}
                  />
                  <span className={`absolute top-[18px] whitespace-nowrap text-[10px] leading-[12px] ${SANS} font-[500] ${i === r.step ? "text-walnut" : "text-sub"}`}>{s}</span>
                </span>
              </Fragment>
            ))}
          </span>
          <span className="flex justify-end">
            {r.stalled ? (
              <Pill primary={!nudged} onClick={() => setNudged(true)}>
                {nudged ? (
                  <>
                    <Check />
                    Nudged
                  </>
                ) : (
                  "Nudge"
                )}
              </Pill>
            ) : (
              <span className={MUTED}>On track</span>
            )}
          </span>
        </div>
      ))}
    </Card>
  );
}

function PaymentsDetail() {
  const [sent, setSent] = useState<Set<string>>(() => new Set());
  return (
    <div className="grid grid-cols-[230px_1fr] gap-[8px]">
      <Card className="items-center justify-center gap-[10px]">
        <Ring value={4210 / 6000} size={104} stroke={10}>
          <span className="flex flex-col items-center">
            <span className={`text-[20px] leading-[24px] ${DISPLAY} text-ink`}>$4,210</span>
            <span className={MUTED}>of $6,000</span>
          </span>
        </Ring>
        <Chip dot={GREEN}>$860 paid by agents</Chip>
      </Card>
      <Card className="gap-[4px] p-[8px]">
        <span className={`px-[10px] pt-[6px] pb-[4px] ${TITLE}`}>Still owed</span>
        {OWED.map((o) => {
          const isSent = sent.has(o.id);
          return (
            <span key={o.id} className="flex items-center gap-[10px] p-[10px] rounded-[16px] hover:bg-[#FAF6EC] transition-colors duration-150">
              <Avatar initials={o.initials} size={32} />
              <span className="flex flex-col grow min-w-[0px]">
                <span className={`text-[13px] leading-[18px] ${SANS} font-[600] text-walnut`}>{o.who}</span>
                <span className={MUTED}>{o.what}</span>
              </span>
              <span className={`w-[52px] text-right text-[16px] leading-[20px] ${DISPLAY} text-ink`}>{o.amount}</span>
              <Pill primary={!isSent} onClick={() => setSent((prev) => new Set(prev).add(o.id))} className="w-[104px]">
                {isSent ? (
                  <>
                    <Check />
                    Sent
                  </>
                ) : (
                  "Send link"
                )}
              </Pill>
            </span>
          );
        })}
      </Card>
    </div>
  );
}

function SystemsDetail() {
  const [state, setState] = useState<"offline" | "connecting" | "live">("offline");
  const reconnect = () => {
    setState("connecting");
    window.setTimeout(() => setState("live"), 1400);
  };
  return (
    <div className="grid grid-cols-5 gap-[8px]">
      {SYSTEMS.map((s) => {
        const live = s.live || state === "live";
        return (
          <Card key={s.name} className="gap-[12px]">
            <span className="flex items-center justify-between">
              <span className={`w-[38px] h-[38px] flex items-center justify-center rounded-[12px] text-[16px] leading-[20px] ${DISPLAY} text-walnut`} style={{ backgroundColor: WELL }}>
                {s.mark}
              </span>
              <Chip dot={live ? GREEN : ACCENT}>{live ? "Live" : "Offline"}</Chip>
            </span>
            <span className="flex flex-col">
              <span className={TITLE}>{s.name}</span>
              <span className={MUTED}>{s.role}</span>
            </span>
            {s.live || state === "live" ? (
              <span className={`mt-auto ${MUTED}`}>Synced {s.live ? s.synced : "just now"}</span>
            ) : (
              <Pill primary onClick={reconnect} className="mt-auto">
                {state === "connecting" ? <span className="animate-spin w-[12px] h-[12px] rounded-[999px] border-2 border-solid border-[#FFFCF166] [border-top-color:#FFFCF1]" /> : "Reconnect"}
              </Pill>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function SectionDetail({ id, done, onDone }: { id: SectionId; done: Set<string>; onDone: (id: string) => void }) {
  if (id === "needs") return <NeedsDetail done={done} onDone={onDone} />;
  if (id === "schedule") return <ScheduleDetail />;
  if (id === "interface") return <VoiceDetail />;
  if (id === "agents") return <AgentsDetail />;
  if (id === "messages") return <MessagesDetail />;
  if (id === "services") return <ServicesDetail />;
  if (id === "providers") return <ProvidersDetail />;
  if (id === "locations") return <LocationsDetail />;
  if (id === "transit") return <ReferralsDetail />;
  if (id === "payments") return <PaymentsDetail />;
  return <SystemsDetail />;
}

const MARK = `w-[18px] h-[18px] shrink-0 flex items-center justify-center rounded-[6px] text-[10px] leading-[10px] ${SANS} font-[700]`;

/** A file Muse handed over with the booking. */
function Attached({ children }: { children: ReactNode }) {
  return (
    <span className={`flex items-center gap-[6px] h-[32px] min-w-[0px] px-[10px] rounded-[10px] bg-[#FFFCF1] border border-solid border-[#2819101A] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>
      <Glyph size={18}>
        <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5" />
      </Glyph>
      <span className="truncate">{children}</span>
      <Glyph size={12}>
        <path d="M9 6l6 6-6 6" />
      </Glyph>
    </span>
  );
}

function Done({ children }: { children: ReactNode }) {
  return <span className={`flex items-center h-[20px] shrink-0 px-[7px] rounded-[999px] bg-[#E3E9D9] text-[11px] leading-[14px] ${SANS} font-[600] text-walnut`}>{children}</span>;
}

const BOOKING_STEPS: { title: string; detail?: ReactNode; states?: string[]; file?: string }[] = [
  { title: "Reviewed calendar" },
  {
    title: "Matched availability to the clinic",
    detail: (
      <span className="flex items-center gap-[5px]">
        <span className={`${MARK} bg-ink [color:#FFFCF1]`}>M</span>
        ModMed schedule
      </span>
    ),
  },
  { title: "Intake form", states: ["Sent & Completed"], file: "Intake form.pdf" },
  { title: "Pre-visit video", states: ["Sent & Completed"], file: "Pre-visit video, 4:20" },
  { title: "Prior authorization", states: ["Sent & Approved"], file: "Approval BC-4471-2093.pdf" },
];

/** Top-right notice: James’s agent, Muse, booking him in and showing each step it took. */
function BookingNotice() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="absolute top-[28px] right-[28px] z-[2] flex flex-col w-[360px] rounded-[24px] bg-paper border border-solid border-[#2819100F] shadow-[0_18px_48px_-24px_#140C0459] overflow-hidden">
      <div className="flex items-center gap-[12px] px-[18px] pt-[18px]">
        <Avatar initials="" size={40} tone="#F3E7C9" />
        <span className="flex flex-col grow min-w-[0px]">
          <span className={`truncate ${TITLE}`}>James Lisondra</span>
          <span className={`truncate ${MUTED}`}>Connected through Muse</span>
        </span>
        {confirmed && <Chip dot={GREEN} tone="#E3E9D9">Booked</Chip>}
      </div>

      <div className="mx-[18px] mt-[14px] flex items-center justify-between gap-[10px] px-[14px] py-[12px] rounded-[16px]" style={{ backgroundColor: WELL }}>
        <span className={`truncate text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Worsening Headache</span>
        <span className={`shrink-0 text-[18px] leading-[22px] ${DISPLAY} text-walnut`}>9:30 am</span>
      </div>
      <div className="mx-[18px] mt-[8px] flex items-center px-[14px] py-[10px] rounded-[16px] border border-solid border-[#2819101F]">
        <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>Dr. Brooks</span>
      </div>

      <div className="flex flex-col px-[18px] pt-[14px]">
        {BOOKING_STEPS.map((s, i) => (
          <div key={s.title} className="flex gap-[12px]">
            <span className="flex flex-col items-center">
              <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded-[999px] bg-ink [color:#FFFCF1]">
                <Check size={12} />
              </span>
              {i < BOOKING_STEPS.length - 1 && <span className="grow w-[1.5px] my-[3px] bg-[#2819101F]" />}
            </span>
            <span className={`flex flex-col gap-[5px] grow min-w-[0px] ${i < BOOKING_STEPS.length - 1 ? "pb-[14px]" : ""}`}>
              <span className="flex items-center justify-between gap-[8px] min-h-[22px]">
                <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{s.title}</span>
                {s.states && (
                  <span className="flex items-center gap-[4px]">
                    {s.states.map((st) => (
                      <Done key={st}>{st}</Done>
                    ))}
                  </span>
                )}
              </span>
              {s.detail && <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{s.detail}</span>}
              {s.file && (
                <span className="flex">
                  <Attached>{s.file}</Attached>
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="p-[18px] pt-[16px]">
        <button
          type="button"
          disabled={confirmed}
          onClick={() => setConfirmed(true)}
          className={`w-full h-[44px] flex items-center justify-center gap-[8px] rounded-[999px] text-[15px] leading-[20px] ${SANS} font-[500] transition-colors duration-150 ${confirmed ? "bg-[#E3E9D9] text-walnut cursor-default" : "bg-ink [color:#FFFCF1] hover:bg-[#2B1D12]"}`}
        >
          {confirmed && <Check size={15} />}
          {confirmed ? "Appointment confirmed" : "Confirm appointment"}
        </button>
      </div>
    </div>
  );
}

const TOP_FADE = 48;
const BOTTOM_FADE = 96;

export function DoeHealthProductIndex({
  onNavigate,
}: {
  clinic: { name: string; location: string };
  onNavigate?: (tab: IndexTab) => void;
}) {
  const [open, setOpen] = useState<SectionId>("needs");
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const remaining = NEEDS.length - done.size;
  const markDone = (id: string) => setDone((prev) => new Set(prev).add(id));
  const listRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: 0, bottom: BOTTOM_FADE });

  const measure = () => {
    const el = listRef.current;
    if (!el) return;
    const below = el.scrollHeight - el.clientHeight - el.scrollTop;
    const top = Math.round(Math.min(TOP_FADE, Math.max(0, el.scrollTop)));
    const bottom = Math.round(Math.min(BOTTOM_FADE, Math.max(0, below)));
    setFade((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  };

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  /** Opens a row, then scrolls just enough to bring the whole opened row into view once it has grown. */
  const openSection = (id: SectionId) => {
    setOpen(id);
    window.setTimeout(() => {
      const el = listRef.current;
      const row = el?.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (!el || !row) return;
      const top = row.offsetTop - TOP_FADE;
      const bottom = row.offsetTop + row.offsetHeight + BOTTOM_FADE / 2 - el.clientHeight;
      if (top < el.scrollTop) el.scrollTo({ top, behavior: "smooth" });
      else if (bottom > el.scrollTop) el.scrollTo({ top: Math.min(top, bottom), behavior: "smooth" });
    }, 320);
  };

  const { locations } = useLocations();
  const opening = locations.filter((l) => l.status !== "open");
  const locationsSummary = (
    <>
      <span className={`${CHIP} bg-sand`}>{locations.length} locations</span>
      {opening[0] && <span className={`${CHIP} bg-[#F3E7C9]`}>{opening[0].short || opening[0].name} {opening[0].note?.toLowerCase() ?? opening[0].status}</span>}
    </>
  );

  const needsSummary =
    remaining > 0 ? (
      <span className={`${CHIP} bg-salmon`}>{remaining} waiting</span>
    ) : (
      <span className={`${CHIP} bg-[#E3E9D9]`}>All clear</span>
    );

  return (
    <>
      <div className="absolute top-[-28px] right-[-28px] bottom-[-28px] w-[640px] z-0 pointer-events-none [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full">
        <SlowDotWave width={640} height={1000} top={0.05} amp={50} vertical fade={0.45} color="#C2A987" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(90deg, var(--color-paper) 0%, transparent 42%)" }} />
      </div>
      <BookingNotice />
      <div className="relative z-[1] flex items-center justify-between w-[840px] shrink-0">
        <div className={`text-[46px] leading-[50px] tracking-[-0.025em] ${DISPLAY} text-walnut`}>Dr. Brooks’ Index</div>
        <button
          type="button"
          className={`flex items-center h-[30px] px-[12px] gap-[6px] rounded-[999px] bg-[#EEEADF] hover:bg-[#E6E0D2] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
        >
          <Glyph size={13}>
            <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />
          </Glyph>
          Sync Now
        </button>
      </div>
      <div
        ref={listRef}
        onScroll={measure}
        className="relative z-[1] w-[840px] grow min-h-[0px] -mb-[28px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: `linear-gradient(180deg, transparent 0px, #000 ${fade.top}px, #000 calc(100% - ${fade.bottom}px), transparent 100%)`,
          WebkitMaskImage: `linear-gradient(180deg, transparent 0px, #000 ${fade.top}px, #000 calc(100% - ${fade.bottom}px), transparent 100%)`,
        }}
      >
        <div ref={innerRef} className="flex flex-col gap-[8px] pb-[40px]">
        {SECTIONS.filter((section) => SHOW_LEGACY_PROVIDERS || section.id !== "providers").map((section) => {
          const expanded = open === section.id;
          const summary = section.id === "needs" ? needsSummary : section.id === "locations" ? locationsSummary : section.summary;
          return (
            <div
              key={section.id}
              data-section={section.id}
              className={`group flex flex-col pl-[8px] pr-[14px] transition-[background-color,border-radius,padding] duration-300 ${expanded ? "py-[14px] rounded-[24px] bg-sand" : "py-[8px] rounded-[20px] bg-[#FAF6EC] hover:bg-[#F4EEDF]"}`}
              style={{ transitionTimingFunction: EASE }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={() => openSection(section.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openSection(section.id);
                  }
                }}
                className={`flex items-center gap-[14px] outline-none ${expanded ? "cursor-default" : "cursor-pointer"}`}
              >
                <Tile color={section.tile} />
                <span
                  className={`grow tracking-[-0.015em] ${DISPLAY} text-walnut`}
                  style={{
                    fontSize: expanded ? 40 : 28,
                    lineHeight: expanded ? "44px" : "32px",
                    transition: `font-size 300ms ${EASE}, line-height 300ms ${EASE}`,
                  }}
                >
                  {section.title}
                </span>
                {(!expanded || section.id === "needs") && <span className="flex items-center gap-[6px]">{summary}</span>}
                {section.tab && expanded && (
                  <span onClick={(e) => e.stopPropagation()} className="doe-menu-in flex">
                    <Pill primary onClick={() => section.tab && onNavigate?.(section.tab)}>
                      Open {section.tab === "permissions" ? "permissions" : section.title}
                      <Glyph size={14}>
                        <path d="M9 6l6 6-6 6" />
                      </Glyph>
                    </Pill>
                  </span>
                )}
              </div>
              <div
                className="grid"
                style={{ gridTemplateRows: expanded ? "1fr" : "0fr", transition: `grid-template-rows 300ms ${EASE}` }}
              >
                <div className="min-h-[0px] overflow-hidden">
                  <div
                    className="mt-[14px] ml-[6px]"
                    style={{ opacity: expanded ? 1 : 0, transition: `opacity 200ms ease ${expanded ? "100ms" : "0ms"}` }}
                  >
                    <SectionDetail id={section.id} done={done} onDone={markDone} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
