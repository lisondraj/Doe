"use client";

/**
 * Insights tab — how patients' agents use the practice: when they ask, what they ask (and which questions have no
 * answer yet), how many are answered at once, bookings, response time and channels. A gap's Add button covers it.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

const RANGES = ["Day", "Week", "Month"] as const;

const QUESTIONS = [
  { id: "mutual", text: "Do you take Harbor Mutual?", count: 186, gap: false },
  { id: "opening", text: "Earliest opening this week", count: 142, gap: false },
  { id: "price", text: "Price of a hearing test", count: 118, gap: false },
  { id: "parking", text: "Is parking available?", count: 74, gap: true },
  { id: "under2", text: "Do you see children under 2?", count: 61, gap: true },
];

const AGENTS = [
  { name: "Instinct", value: 412 },
  { name: "ChatGPT", value: 338 },
  { name: "Muse", value: 301 },
  { name: "Gemini", value: 233 },
];

const CHANNELS = [
  { name: "MCP", value: 640 },
  { name: "App SDK", value: 388 },
  { name: "Voice", value: 176 },
  { name: "Web", value: 80 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["6a", "8", "10", "12p", "2", "4", "6", "8", "10", "12a", "2", "4"];

/** Requests per day-and-hour cell from 0 to 1: busiest mid-afternoon on weekdays, with a smaller morning peak. */
function busy(d: number, h: number) {
  const base = Math.exp(-(((h - 4.5) / 2.6) ** 2)) * (d < 5 ? 1 : 0.55) + 0.35 * Math.exp(-(((h - 8) / 1.6) ** 2)) + 0.1;
  return Math.min(1, base * (0.8 + 0.35 * Math.sin(d * 2.3 + h)));
}

/** Sand to salmon to burnt salmon, the section's own colours. */
function ramp(x: number) {
  const a = [0xef, 0xe8, 0xd9];
  const b = [0xf0, 0xb4, 0x96];
  const c = [0xd2, 0x6b, 0x45];
  const [from, to, t] = x < 0.5 ? [a, b, x / 0.5] : [b, c, (x - 0.5) / 0.5];
  return `rgb(${from.map((v, i) => Math.round(v + (to[i]! - v) * t)).join(",")})`;
}

const Card = ({ tone, span, children }: { tone?: string; span: number; children: React.ReactNode }) => (
  <div className="flex flex-col min-w-[0px] min-h-[0px] p-[20px_22px] rounded-[28px] overflow-hidden" style={{ gridColumn: `span ${span}`, backgroundColor: tone ?? "#FAF6EC" }}>
    {children}
  </div>
);

const Title = ({ title, note, right }: { title: string; note: string; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-[10px] mb-[10px] shrink-0">
    <span className="flex flex-col">
      <span className={`text-[22px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{title}</span>
      <span className={`mt-[3px] text-[12.5px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.55)]`}>{note}</span>
    </span>
    {right}
  </div>
);

const Tag = ({ children, tone }: { children: React.ReactNode; tone?: "sage" | "salmon" | "line" }) => (
  <span
    className={`flex items-center gap-[6px] h-[26px] px-[12px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap ${
      tone === "sage" ? "bg-[#D6DEC6] text-[#2F3B2A]" : tone === "salmon" ? "bg-[#FCCFB8] text-[#7A3E26]" : tone === "line" ? "shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)] text-walnut" : "bg-[#FFFCF1BF] text-walnut"
    }`}
  >
    {children}
  </span>
);

function Bars({ rows }: { rows: { name: string; value: number }[] }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div className="flex flex-col grow justify-around">
      {rows.map((r) => (
        <div key={r.name} className={`grid grid-cols-[84px_1fr_44px] items-center gap-[12px] ${SANS} text-[14px] leading-[18px] font-[500] text-walnut`}>
          <span>{r.name}</span>
          <span className="h-[10px] rounded-[999px] bg-[#FFFCF1CC] overflow-hidden">
            <span className="block h-full rounded-[999px] bg-[#E8A585]" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="text-right [font-variant-numeric:tabular-nums]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const size = 140;
  const w = 16;
  const r = (size - w) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFFCF1D9" strokeWidth={w} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#2F3B2A"
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={`${(c * value) / 100} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function Lines({ now, before }: { now: number[]; before: number[] }) {
  const w = 520;
  const h = 150;
  const max = Math.max(...now, ...before) * 1.15;
  const xs = now.map((_, i) => (i * (w - 48)) / (now.length - 1) + 24);
  const ys = (v: number[]) => v.map((x) => h - 14 - (x / max) * (h - 30));
  const path = (v: number[]) => `M${xs.map((x, i) => `${x.toFixed(0)},${ys(v)[i]!.toFixed(0)}`).join(" L")}`;
  const last = ys(now)[now.length - 1]!;
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
      <path d={`${path(now)} L${xs[xs.length - 1]},${h - 14} L${xs[0]},${h - 14} Z`} fill="rgba(232,165,133,0.28)" />
      <path d={path(before)} fill="none" stroke="rgba(40,25,16,0.3)" strokeWidth="1.6" strokeDasharray="4 4" />
      <path d={path(now)} fill="none" stroke="#C9704B" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xs[xs.length - 1]} cy={last} r="5" fill="#FBE6DB" stroke="#C9704B" strokeWidth="2.4" />
    </svg>
  );
}

function Histogram({ values, labels, hot }: { values: number[]; labels: string[]; hot: number }) {
  const h = 100;
  const w = 300;
  const max = Math.max(...values);
  const bw = (w - 8) / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
      {values.map((v, i) => (
        <g key={labels[i]}>
          <rect x={4 + i * bw + 4} y={h - (v / max) * (h - 8)} width={bw - 8} height={(v / max) * (h - 8)} rx="10" fill={i === hot ? "#E8A585" : "#FFFCF1E6"} />
          <text x={4 + i * bw + bw / 2} y={h + 15} textAnchor="middle" fontSize="11" fill="rgba(40,25,16,0.55)" fontFamily="DM Sans" fontWeight="500">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function DoeHealthProductInsightsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("Week");
  const [covered, setCovered] = useState<Record<string, boolean>>({});
  const gaps = QUESTIONS.filter((q) => q.gap && !covered[q.id]);

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[16px] pt-[34px] px-[40px] pb-[26px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-center justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Insights</span>
        <span className="flex items-center gap-[10px]">
          <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="tablist" aria-label="Range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
                className={`h-[32px] px-[16px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${range === r ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
              >
                {r}
              </button>
            ))}
          </span>
          <span className={`flex items-center gap-[8px] h-[38px] px-[16px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
            <span className="text-[rgba(40,25,16,0.55)]">Agents</span>All 6
          </span>
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Export</span>
        </span>
      </div>

      <div className="relative grid grid-cols-12 grow min-h-[0px] gap-[12px] [grid-template-rows:1.08fr_1.12fr_0.8fr]">
        <Card span={8}>
          <Title title="When agents ask" note="Requests per hour" right={<Tag>Peak Tue 4 pm</Tag>} />
          <div className="grid grow min-h-[0px] gap-[4px]" style={{ gridTemplateColumns: "36px repeat(12, 1fr)", gridTemplateRows: "18px repeat(7, 1fr)" }}>
            <span />
            {HOURS.map((h, i) => (
              <span key={i} className={`text-center text-[11.5px] ${SANS} font-[500] text-[rgba(40,25,16,0.45)]`}>
                {h}
              </span>
            ))}
            {DAYS.map((d, di) => (
              <div key={d} className="contents">
                <span className={`flex items-center text-[12px] ${SANS} font-[500] text-[rgba(40,25,16,0.5)]`}>{d}</span>
                {HOURS.map((_, hi) => (
                  <span key={hi} className="rounded-[7px]" style={{ backgroundColor: ramp(busy(di, hi)) }} />
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card span={4} tone="#E6ECDB">
          <Title title="Answered at once" note="No staff needed" right={<Tag>+4 pts</Tag>} />
          <div className="flex items-center gap-[22px] grow">
            <span className="relative flex items-center justify-center">
              <Ring value={94} />
              <span className={`absolute text-[38px] leading-[40px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>94%</span>
            </span>
            <span className="flex flex-col gap-[8px] grow">
              {[
                ["Answered", "1,207"],
                ["Gap topics", String(gaps.length)],
                ["Held", "5"],
              ].map(([label, value]) => (
                <span key={label} className="flex justify-between"><Tag>{label}</Tag><b className={`${SANS} text-[14px] font-[500] self-center`}>{value}</b></span>
              ))}
            </span>
          </div>
        </Card>

        <Card span={5}>
          <Title title="Top questions" note={gaps.length ? `${gaps.length} ${gaps.length === 1 ? "topic has" : "topics have"} no answer yet` : "Every topic has an answer"} right={<Tag tone="line">See all</Tag>} />
          <div className="flex flex-col gap-[5px] grow justify-around">
            {QUESTIONS.slice(0, 4).map((q, i) => {
              const gap = q.gap && !covered[q.id];
              return (
                <div key={q.id} className="flex items-center gap-[14px] h-[38px] shrink-0 px-[14px] rounded-[14px] bg-[#FFFCF1CC]">
                  <span className={`w-[16px] text-[17px] ${DISPLAY} text-[rgba(40,25,16,0.35)]`}>{i + 1}</span>
                  <span className={`grow truncate text-[14px] ${SANS} font-[500] text-walnut`}>{q.text}</span>
                  <span className={`w-[36px] text-right text-[14px] ${SANS} font-[500] [font-variant-numeric:tabular-nums]`}>{q.count}</span>
                  <span className="w-[72px] flex justify-end">
                    <Tag tone={gap ? "salmon" : "sage"}>{gap ? "Gap" : "Covered"}</Tag>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card span={3} tone="#F4EEDF">
          <Title title="By agent" note="Requests" />
          <Bars rows={AGENTS} />
        </Card>

        <Card span={4} tone="#FBE6DB">
          <Title title="Visits booked" note="This week vs last" right={<Tag>+12%</Tag>} />
          <div className="grow min-h-[0px]">
            <Lines now={[6, 9, 7, 11, 8, 3, 3]} before={[5, 7, 8, 8, 7, 4, 3]} />
          </div>
        </Card>

        <Card span={4} tone="#F3EBD2">
          <Title title="Response time" note="Seconds" right={<Tag>0.8 s median</Tag>} />
          <div className="grow min-h-[0px]">
            <Histogram values={[22, 41, 28, 13, 6]} labels={["<0.5", "0.5", "0.8", "1.2", "2+"]} hot={1} />
          </div>
        </Card>

        <Card span={4}>
          <Title title="By channel" note="How agents connect" />
          <Bars rows={CHANNELS} />
        </Card>

        <Card span={4}>
          <Title title="Gaps to fix" note="Add an answer in one step" />
          <div className="flex flex-col gap-[5px] grow">
            {gaps.length === 0 ? (
              <span className={`flex items-center justify-center grow rounded-[16px] bg-[#F4EEDF] text-[14px] ${SANS} font-[500] text-sub`}>No gaps left</span>
            ) : (
              gaps.map((q) => (
                <div key={q.id} className="flex items-center gap-[10px] h-[40px] shrink-0 pl-[16px] pr-[6px] rounded-[14px] bg-[#F4EEDF]">
                  <span className={`grow truncate text-[14px] ${SANS} font-[500] text-walnut`}>{q.text}</span>
                  <button
                    type="button"
                    onClick={() => setCovered((prev) => ({ ...prev, [q.id]: true }))}
                    className={`flex items-center gap-[6px] h-[30px] px-[14px] rounded-[999px] bg-ink text-[12.5px] ${SANS} font-[500] [color:#FFFCF1] hover:bg-[#2B1D12] transition-colors duration-150`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
