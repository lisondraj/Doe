"use client";

/**
 * Index tab — a literal index of the practice: one serif row per part of Doe, each with its live
 * status. Rows open in place (Providers-style) to show detail, and jump to their tab.
 */
import { type CSSProperties, Fragment, type ReactNode, useState } from "react";
import { DoeHealthProductSphere } from "@/components/doehealth-product/DoeHealthProductSphere";
import { DotWave, HalftoneDisc, RippleRings, waveCrest } from "@/components/doehealth-product/DoeHealthProductHalftone";

type IndexTab = "schedule" | "voice" | "services" | "providers";
type SectionId = "needs" | IndexTab | "systems";

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

type Section = {
  id: SectionId;
  title: string;
  tile: string;
  icon: ReactNode;
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
        <span className={`${CHIP} bg-sand`}>Next 3:30</span>
      </>
    ),
  },
  {
    id: "voice",
    title: "Voice",
    tab: "voice",
    tile: "#E3E9D9",
    icon: (
      <Glyph>
        <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z" />
      </Glyph>
    ),
    summary: (
      <>
        <span className={`${CHIP} bg-sand gap-[6px]`}>
          <span className="w-[6px] h-[6px] rounded-[99px] bg-[#6E9A5B]" />2 on the line
        </span>
        <span className={`${CHIP} bg-sand`}>47 calls</span>
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
          {["RR", "AP", "JL", "NS"].map((initials, i) => (
            <span
              key={initials}
              className={`w-[24px] h-[24px] flex items-center justify-center rounded-[999px] border-2 border-solid [border-color:#FAF6EC] bg-[#E9DCC7] text-[9px] leading-[10px] ${SANS} font-[600] text-walnut ${i > 0 ? "-ml-[6px]" : ""}`}
            >
              {initials}
            </span>
          ))}
        </span>
        <span className={`${CHIP} bg-sand`}>4 in today</span>
      </span>
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

const NEEDS = [
  { id: "leo", who: "Leo Jacobs", time: "11:08 AM", chip: "Third ear infection", tone: "#F7DCCB", pin: "#E8A585", note: "From his mom’s call", action: "Review", primary: true },
  { id: "grace", who: "Grace Kim", time: "10:42 AM", chip: "Lisinopril refill", tone: "#EEEADF", pin: "#C2A987", note: "10 mg · CVS Beacon St", action: "Approve" },
  { id: "lily", who: "Lily’s mom", time: "1:48 PM", chip: "Wants Dr. Patel", tone: "#E3E9D9", pin: "#8DAA7C", note: "About Lily’s rash", action: "Call back" },
  { id: "henry", who: "Henry Walsh", time: "9:30 AM", chip: "LDL up to 162", tone: "#E9DCC7", pin: "#B5A79C", note: "Lipid panel is back", action: "Sign" },
];

const DAY_FROM = 12;
const DAY_TO = 18;
const NOW = 15 + 20 / 60;

/** Afternoon appointments per provider as [start hour, length in hours]. */
const LANES = [
  { who: "Dr. Roberts", blocks: [[12.25, 0.5], [13, 0.5], [13.75, 0.75], [14.75, 0.5], [15.5, 0.5, "Maya Chen"], [16, 0.5], [16.75, 0.5]] },
  { who: "Dr. Patel", blocks: [[12, 0.75], [13.25, 0.5], [14, 0.5], [15, 0.5], [15.75, 0.5], [16.5, 0.75]] },
  { who: "Dr. Shah", blocks: [[12.5, 0.5], [13.5, 0.75], [14.5, 0.5], [16.25, 0.5], [17, 0.5]] },
] as { who: string; blocks: [number, number, string?][] }[];

const LIVE_CALLS = [
  { name: "Hannah Lee", about: "Moving Friday’s visit", time: "2:14", seed: 1 },
  { name: "Marcus Webb", about: "Lab results question", time: "0:48", seed: 4 },
];

const CALL_MIX = [
  { label: "Scheduling", value: 16, color: "#F2BFA6" },
  { label: "Intake", value: 9, color: "#B9CDA8" },
  { label: "Billing", value: 8, color: "#D9C49F" },
  { label: "Records", value: 7, color: "#CDC2BA" },
  { label: "Office", value: 7, color: "#E7DCC6" },
];

const DEMAND = [
  { label: "Ear check", value: 18, color: "#E8A585", x: 118, y: 112 },
  { label: "Flu shot", value: 14, color: "#8DAA7C", x: 288, y: 104 },
  { label: "Annual physical", value: 9, color: "#C2A987", x: 428, y: 120 },
  { label: "Hearing test", value: 6, color: "#B5A79C", x: 546, y: 98 },
  { label: "Sick visit", value: 5, color: "#EDB59C", x: 650, y: 130 },
  { label: "Lab work", value: 4, color: "#C9B79A", x: 750, y: 108 },
];

const PROVIDERS = [
  { initials: "RR", name: "Dr. Roberts", status: "Room 2", seen: 5, booked: 9, tile: "#FCCFB8", here: true },
  { initials: "AP", name: "Dr. Patel", status: "Room 4", seen: 6, booked: 8, tile: "#DCE5D0", here: true },
  { initials: "NS", name: "Dr. Shah", status: "Room 1", seen: 3, booked: 6, tile: "#E9DCC7", here: true },
  { initials: "JL", name: "Dr. Lin", status: "Left at 1 PM", seen: 7, booked: 7, tile: "#EEEADF", here: true },
  { initials: "DL", name: "Dr. Lee", status: "Back Monday", seen: 0, booked: 0, tile: "#EEEADF", here: false },
];

const SYSTEMS = [
  { mark: "M", name: "ModMed", role: "Schedule", stat: "1,284 upcoming", live: true },
  { mark: "P", name: "Phreesia", role: "Intake", stat: "128 forms today", live: true },
  { mark: "I", name: "InstaMed", role: "Payments", stat: "$4.2k collected", live: true },
  { mark: "K", name: "Kno2", role: "Referrals", stat: "37 open", live: true },
  { mark: "W", name: "Waystar", role: "Insurance", stat: "Since 9:12 AM", live: false },
];

function Tile({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] text-walnut" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

function Pill({ children, primary, onClick }: { children: ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center h-[32px] shrink-0 px-[14px] gap-[6px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${primary ? "bg-ink [color:#FFFCF1] hover:bg-[#2B1D12]" : "bg-[#EEEADF] text-walnut hover:bg-[#E6E0D2]"}`}
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className={`text-[12px] leading-[16px] ${BODY} text-sub`}>{children}</span>;
}

function Value({ children }: { children: ReactNode }) {
  return <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{children}</span>;
}

function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`flex flex-col rounded-[14px] bg-paper ${className}`} style={style}>
      {children}
    </div>
  );
}

function Check({ size = 14 }: { size?: number }) {
  return (
    <Glyph size={size}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Glyph>
  );
}

const FIELD_W = 812;
const FIELD_H = 210;
const WAVE_TOP = 150;

function Field({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[16px] bg-paper ${className}`} style={{ height: FIELD_H }}>
      {children}
    </div>
  );
}

function NeedsDetail({ done, onDone }: { done: Set<string>; onDone: (id: string) => void }) {
  if (done.size === NEEDS.length) {
    return (
      <Field>
        <DotWave width={FIELD_W} height={FIELD_H} top={WAVE_TOP - 40} color="#B9CDA8" />
        <span className={`absolute left-1/2 top-[56px] -translate-x-1/2 flex items-center gap-[10px] h-[40px] px-[16px] rounded-[999px] bg-paper border border-solid border-[#2819101F] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
          <span className="text-[#4F6B42]">
            <Check />
          </span>
          All clear. Doe will bring anything new here.
        </span>
      </Field>
    );
  }
  return (
    <Field>
      <DotWave width={FIELD_W} height={FIELD_H} top={WAVE_TOP} />
      {NEEDS.map((n, i) => {
        const isDone = done.has(n.id);
        const cx = FIELD_W * (0.125 + i * 0.25);
        const pinY = Math.round(waveCrest(cx, WAVE_TOP) - 2);
        return (
          <Fragment key={n.id}>
            <span className="absolute w-[1px] bg-[#28191033]" style={{ left: cx, top: 128, height: pinY - 128 }} />
            <span
              className="absolute w-[12px] h-[12px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-2 border-solid [border-color:#FFFCF1] transition-colors duration-300"
              style={{ left: cx, top: pinY, backgroundColor: isDone ? "#6E9A5B" : n.pin }}
            />
            <div
              className={`absolute top-[14px] -translate-x-1/2 w-[180px] flex flex-col gap-[8px] p-[12px] rounded-[14px] bg-paper border border-solid border-[#2819101F] transition-opacity duration-300 ${isDone ? "opacity-60" : ""}`}
              style={{ left: cx }}
            >
              <div className="flex items-baseline justify-between gap-[8px]">
                <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut ${isDone ? "line-through" : ""}`}>{n.who}</span>
                <span className={`shrink-0 text-[11px] leading-[14px] ${BODY} text-sub`}>{n.time}</span>
              </div>
              <span className={`self-start ${CHIP}`} style={{ backgroundColor: n.tone }}>
                {n.chip}
              </span>
              <div className="flex h-[32px] items-center">
                {isDone ? (
                  <span className={`flex items-center gap-[6px] text-[13px] leading-[16px] ${SANS} font-[500] text-[#4F6B42]`}>
                    <Check />
                    Done
                  </span>
                ) : (
                  <Pill primary={n.primary} onClick={() => onDone(n.id)}>
                    {n.action}
                  </Pill>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </Field>
  );
}

const at = (hour: number) => `${((hour - DAY_FROM) / (DAY_TO - DAY_FROM)) * 100}%`;

function ScheduleDetail() {
  return (
    <div className="flex gap-[8px]">
      <Card className="relative grow min-w-[0px] gap-[8px] pt-[16px] pb-[12px] px-[16px]">
        {LANES.map((lane) => (
          <div key={lane.who} className="flex items-center gap-[12px] h-[30px]">
            <span className={`w-[78px] shrink-0 text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>{lane.who}</span>
            <div className="relative grow h-[24px] rounded-[7px] bg-sand">
              {lane.blocks.map(([start, length, label]) => {
                const past = start + length <= NOW;
                return (
                  <span
                    key={start}
                    className={`absolute top-[3px] bottom-[3px] flex items-center overflow-hidden rounded-[5px] px-[6px] whitespace-nowrap text-[11px] leading-[14px] ${SANS} font-[600] text-walnut`}
                    style={{
                      left: `calc(${at(start)} + 1px)`,
                      width: `calc(${(length / (DAY_TO - DAY_FROM)) * 100}% - 2px)`,
                      backgroundColor: label ? "#E8A585" : past ? "#E6DCC8" : "#F6D9C8",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className="relative flex h-[16px] ml-[90px]">
          {[12, 13, 14, 15, 16, 17, 18].map((h) => (
            <span key={h} className={`absolute -translate-x-1/2 text-[11px] leading-[14px] ${BODY} text-sub`} style={{ left: at(h) }}>
              {h === 12 ? "12" : h - 12}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute top-[10px] bottom-[30px] left-[106px] right-[16px]">
          <span className="absolute top-0 bottom-0 w-[1.5px] -translate-x-1/2 bg-ink" style={{ left: at(NOW) }} />
        </div>
      </Card>
      <Card className="relative w-[200px] shrink-0 gap-[2px] p-[16px] bg-[#FCCFB8]">
        <span className={`text-[12px] leading-[16px] ${BODY} text-walnut opacity-70`}>Next in 10 min</span>
        <span className={`text-[34px] leading-[40px] tracking-[-0.02em] ${DISPLAY} text-ink`}>3:30</span>
        <span className="mt-auto flex flex-col gap-[2px]">
          <span className={`text-[14px] leading-[18px] ${SANS} font-[600] text-ink`}>Maya Chen</span>
          <span className={`text-[12px] leading-[16px] ${BODY} text-walnut opacity-70`}>Annual physical · Dr. Roberts</span>
        </span>
      </Card>
    </div>
  );
}

function VoiceDetail() {
  const total = CALL_MIX.reduce((sum, c) => sum + c.value, 0);
  const dots = CALL_MIX.flatMap((c) => Array.from({ length: c.value }, () => c.color));
  return (
    <Field className="flex">
      {LIVE_CALLS.map((call, i) => (
        <div key={call.name} className="flex items-center gap-[16px] w-[272px] shrink-0 px-[20px] border-r border-solid border-line">
          <RippleRings size={112} color={i === 0 ? "#E8A585" : "#C2A987"} />
          <div className="flex flex-col gap-[6px] min-w-[0px]">
            <span className={`flex items-center gap-[5px] text-[12px] leading-[16px] ${SANS} font-[500] text-[#C2603A] [font-variant-numeric:tabular-nums]`}>
              <span className="w-[6px] h-[6px] rounded-[99px] bg-[#D9774F]" />
              {call.time}
            </span>
            <span className={`text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{call.name}</span>
            <span className={`text-[12px] leading-[16px] ${BODY} text-sub`}>{call.about}</span>
            <button
              type="button"
              className={`mt-[4px] self-start flex items-center h-[28px] px-[10px] gap-[5px] rounded-[999px] border border-solid border-[#28191033] hover:bg-[#F4EEDF] transition-colors duration-150 text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
            >
              <Glyph size={13}>
                <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z" />
              </Glyph>
              Listen
            </button>
          </div>
        </div>
      ))}
      <div className="flex flex-col grow min-w-[0px] justify-center gap-[14px] px-[22px]">
        <div className="flex items-baseline gap-[8px]">
          <span className={`text-[28px] leading-[30px] ${DISPLAY} text-ink`}>{total}</span>
          <span className={`text-[13px] leading-[16px] ${BODY} text-sub`}>calls today, one dot each</span>
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
              <span className={`text-[11px] leading-[14px] ${BODY} text-sub`}>{c.label}</span>
            </span>
          ))}
        </div>
      </div>
    </Field>
  );
}

function ServicesDetail() {
  return (
    <Field>
      {DEMAND.map((d) => {
        const size = Math.round((34 + d.value * 3) * 2);
        return (
          <HalftoneDisc
            key={d.label}
            size={size}
            color={d.color}
            step={7}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: d.x, top: d.y }}
          >
            <span className="flex flex-col items-center px-[9px] py-[4px] rounded-[10px] bg-paper">
              <span className={`whitespace-nowrap text-[12px] leading-[15px] ${SANS} font-[600] text-walnut`}>{d.label}</span>
              <span className={`text-[16px] leading-[18px] ${DISPLAY} text-ink`}>{d.value}</span>
            </span>
          </HalftoneDisc>
        );
      })}
      <span className={`absolute right-[16px] top-[14px] ${CHIP} gap-[6px] bg-[#DCE5D0]`}>
        <span className="w-[6px] h-[6px] rounded-[99px] bg-[#6E9A5B]" />
        Flu shot promotion · 41 booked
      </span>
    </Field>
  );
}

function ProvidersDetail() {
  return (
    <Field className="grid grid-cols-5 items-center px-[8px]">
      {PROVIDERS.map((p) => (
        <div key={p.initials} className={`flex flex-col items-center gap-[12px] ${p.here ? "" : "opacity-55"}`}>
          <HalftoneDisc
            size={112}
            step={6.5}
            color={p.here ? "#F0C9B4" : "#E3D9C6"}
            split={p.here ? { fraction: p.seen / p.booked, color: "#281910" } : undefined}
          >
            <span className={`w-[46px] h-[46px] flex items-center justify-center rounded-[999px] bg-paper text-[18px] leading-[20px] ${DISPLAY} text-walnut`}>
              {p.initials}
            </span>
          </HalftoneDisc>
          <span className="flex flex-col items-center gap-[2px]">
            <Value>{p.name}</Value>
            <Label>{p.here ? `${p.seen} of ${p.booked} seen · ${p.status}` : p.status}</Label>
          </span>
        </div>
      ))}
    </Field>
  );
}

const HUB = { x: FIELD_W / 2, y: FIELD_H / 2, r: 62 };
const NODE_W = 212;

function SystemsDetail() {
  const nodes = SYSTEMS.map((s, i) => {
    const left = i < 2;
    const y = left ? [62, 148][i] : [40, 105, 170][i - 2];
    return { ...s, left, y };
  });
  return (
    <Field>
      <svg width={FIELD_W} height={FIELD_H} className="absolute left-0 top-0" aria-hidden="true">
        {nodes.map((n) => {
          const sx = HUB.x + (n.left ? -HUB.r : HUB.r);
          const ex = n.left ? 16 + NODE_W : FIELD_W - 16 - NODE_W;
          const mx = (sx + ex) / 2;
          return (
            <path
              key={n.name}
              d={`M${sx} ${HUB.y} C${mx} ${HUB.y} ${mx} ${n.y} ${ex} ${n.y}`}
              fill="none"
              stroke={n.live ? "#C2A987" : "#E8A585"}
              strokeWidth={n.live ? 3 : 2}
              strokeLinecap="round"
              strokeDasharray={n.live ? "0 7" : "5 6"}
              className={n.live ? "doe-flow" : undefined}
              style={n.live && n.left ? { animationDirection: "reverse" } : undefined}
            />
          );
        })}
      </svg>
      <DoeHealthProductSphere className="absolute" style={{ left: HUB.x - 76, top: HUB.y - 76, width: 152, height: 152 }} />
      <span className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center h-[26px] px-[10px] rounded-[999px] bg-ink text-[12px] leading-[16px] ${SANS} font-[600] [color:#FFFCF1]`} style={{ left: HUB.x, top: HUB.y }}>
        Doe
      </span>
      {nodes.map((n) => (
        <div
          key={n.name}
          className={`absolute -translate-y-1/2 flex items-center gap-[10px] h-[52px] px-[10px] rounded-[14px] border border-solid ${n.live ? "bg-paper border-[#2819101F]" : "bg-[#FBE4D8] border-[#E8A58566]"}`}
          style={{ width: NODE_W, top: n.y, ...(n.left ? { left: 16 } : { right: 16 }) }}
        >
          <span className={`w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[10px] text-[14px] leading-[16px] ${DISPLAY} text-walnut ${n.live ? "bg-sand" : "bg-[#FFFCF1B3]"}`}>
            {n.mark}
          </span>
          <span className="flex flex-col grow min-w-[0px]">
            <Value>{n.name}</Value>
            <Label>{n.live ? n.stat : "Offline since 9:12"}</Label>
          </span>
          {!n.live && (
            <button type="button" className={`shrink-0 flex items-center h-[26px] px-[9px] rounded-[999px] bg-ink text-[11px] leading-[14px] ${SANS} font-[500] [color:#FFFCF1]`}>
              Reconnect
            </button>
          )}
        </div>
      ))}
    </Field>
  );
}

function SectionDetail({ id, done, onDone }: { id: SectionId; done: Set<string>; onDone: (id: string) => void }) {
  if (id === "needs") return <NeedsDetail done={done} onDone={onDone} />;
  if (id === "schedule") return <ScheduleDetail />;
  if (id === "voice") return <VoiceDetail />;
  if (id === "services") return <ServicesDetail />;
  if (id === "providers") return <ProvidersDetail />;
  return <SystemsDetail />;
}

export function DoeHealthProductIndex({
  clinic,
  onNavigate,
}: {
  clinic: { name: string; location: string };
  onNavigate?: (tab: IndexTab) => void;
}) {
  const [open, setOpen] = useState<SectionId>("needs");
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const remaining = NEEDS.length - done.size;
  const markDone = (id: string) => setDone((prev) => new Set(prev).add(id));

  const needsSummary =
    remaining > 0 ? (
      <span className={`${CHIP} bg-salmon`}>{remaining} waiting</span>
    ) : (
      <span className={`${CHIP} bg-[#E3E9D9]`}>All clear</span>
    );

  return (
    <>
      <DoeHealthProductSphere
        className="absolute pointer-events-none"
        style={{ left: 880, top: 0, width: 900, height: 900 }}
        color="#E8A585"
      />
      <div className="relative flex items-center justify-between w-[840px] shrink-0">
        <div className={`text-[46px] leading-[50px] tracking-[-0.025em] ${DISPLAY} text-walnut`}>Dr. Robert’s Index</div>
        <div className="flex items-center h-[38px] px-[14px] rounded-[999px] gap-[8px] bg-[#EEEADF]">
          <span className="w-[7px] h-[7px] rounded-[99px] bg-[#6E9A5B]" />
          <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{clinic.name}</span>
          <span className={`text-[14px] leading-[18px] ${BODY} text-sub`}>Open until 6 PM</span>
        </div>
      </div>
      <div className="relative flex flex-col w-[840px] gap-[8px]">
        {SECTIONS.map((section) => {
          const expanded = open === section.id;
          const summary = section.id === "needs" ? needsSummary : section.summary;
          return (
            <div
              key={section.id}
              className={`group flex flex-col pl-[8px] pr-[14px] transition-[background-color,border-radius,padding] duration-300 ${expanded ? "py-[14px] rounded-[24px] bg-sand" : "py-[8px] rounded-[20px] bg-[#FAF6EC] hover:bg-[#F4EEDF]"}`}
              style={{ transitionTimingFunction: EASE }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={() => setOpen(section.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(section.id);
                  }
                }}
                className={`flex items-center gap-[14px] outline-none ${expanded ? "cursor-default" : "cursor-pointer"}`}
              >
                <Tile color={section.tile}>{section.icon}</Tile>
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
                      Open {section.title}
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
      <div className="relative mt-auto flex items-center gap-[12px] w-[840px] shrink-0">
        <span className="w-[7px] h-[7px] rounded-[99px] bg-[#6E9A5B]" />
        <span className={`text-[13px] leading-[18px] ${BODY} text-sub`}>Everything synced a minute ago</span>
        <button
          type="button"
          className={`flex items-center h-[30px] px-[12px] gap-[6px] rounded-[999px] bg-[#EEEADF] hover:bg-[#E6E0D2] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
        >
          <Glyph size={13}>
            <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />
          </Glyph>
          Sync now
        </button>
      </div>
    </>
  );
}
