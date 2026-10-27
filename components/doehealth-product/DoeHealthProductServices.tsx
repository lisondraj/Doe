"use client";

/**
 * Services tab — based on Paper artboard "Pulse 02 Services" (file "Tender mountain", page
 * "Doe App v2").
 *
 * Nothing is selected by default, so the catalogue shows four columns. Selecting a service opens
 * the detail panel on the right and the cards glide into three columns. Each card is a toggle:
 * on means selected.
 *
 * Rendered as a shell-level layer (the root fills the inner shell), so it replaces the
 * integrations content panel while the Services tab is active.
 */
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { OfferPill, useOffers } from "@/components/doehealth-product/DoeHealthProductOffers";

/** Gap between cards, and between the grid and the detail panel. */
const GAP = 8;
/** Cards keep one height however many there are, so the list grows past its box and scrolls. */
const CARD_H = 184;
/** Shared timing for the grid reflow and the panel slide, so they move together. */
const MOVE_MS = 420;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Width of the detail panel, including the gutter it sits behind. */
const PANEL_OPEN_WIDTH = 432;

const svgBase = { display: "inline-block", flexShrink: "0" } as const;

type ChipTone = "tint" | "outline" | "today" | "salmon" | "dark";
type Chip = { label: string; tone: ChipTone; calendar?: boolean; eyeOff?: boolean };

type Service = {
  id: string;
  name: string;
  price: string;
  /** Light Doe colour for the card's circle. */
  tone: string;
  chips: Chip[];
  /** Quieter card, used for services hidden from agents. */
  muted?: boolean;
  self: string;
  insurance: string;
  length: string;
  /** Index into REFERRALS. */
  referral: number;
  plans: string[];
};

const REFERRALS = ["Never", "Some plans", "Always"];

const SERVICES: Service[] = [
  {
    id: "new-patient",
    name: "New patient consult",
    price: "$325",
    tone: "#F7DCCB",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Tue", tone: "tint", calendar: true },
    ],
    self: "$325",
    insurance: "14 plans",
    length: "60 min",
    referral: 1,
    plans: ["BlueChoice"],
  },
  {
    id: "migraine-follow-up",
    name: "Migraine follow-up",
    price: "$185",
    tone: "#DCE5D0",
    chips: [{ label: "Tue", tone: "tint", calendar: true }],
    self: "$185",
    insurance: "14 plans",
    length: "30 min",
    referral: 0,
    plans: ["BlueChoice", "Tricare"],
  },
  {
    id: "routine-eeg",
    name: "Routine EEG",
    price: "$450",
    tone: "#F3E7C9",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Oct 21", tone: "tint", calendar: true },
    ],
    self: "$450",
    insurance: "9 plans",
    length: "60 min",
    referral: 1,
    plans: ["BlueChoice"],
  },
  {
    id: "emg",
    name: "EMG and nerve study",
    price: "$620",
    tone: "#DCE6F5",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$620",
    insurance: "18 plans",
    length: "60 min",
    referral: 1,
    plans: [],
  },
  {
    id: "botox",
    name: "Botox for chronic migraine",
    price: "$1,850",
    tone: "#FCCFB8",
    chips: [
      { label: "Self-pay only", tone: "dark" },
      { label: "Request only", tone: "outline" },
    ],
    self: "$1,850",
    insurance: "None",
    length: "30 min",
    referral: 2,
    plans: [],
  },
  {
    id: "memory",
    name: "Memory screening",
    price: "$395",
    tone: "#E9DCC7",
    chips: [
      { label: "Self-pay only", tone: "dark" },
      { label: "Wed", tone: "tint", calendar: true },
    ],
    self: "$395",
    insurance: "None",
    length: "45 min",
    referral: 0,
    plans: [],
  },
  {
    id: "seizure-follow-up",
    name: "Seizure follow-up",
    price: "$185",
    tone: "#F7DCCB",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$185",
    insurance: "14 plans",
    length: "30 min",
    referral: 0,
    plans: [],
  },
  {
    id: "return-to-play",
    name: "Return-to-play note",
    price: "$75",
    tone: "#DCE5D0",
    chips: [{ label: "Self-pay only", tone: "dark" }],
    self: "$75",
    insurance: "None",
    length: "15 min",
    referral: 0,
    plans: [],
  },
  {
    id: "ms-infusion",
    name: "MS infusion",
    price: "$1,800",
    tone: "#F3E7C9",
    chips: [{ label: "Hidden from agents", tone: "dark", eyeOff: true }],
    muted: true,
    self: "$1,800",
    insurance: "None",
    length: "4 hr",
    referral: 0,
    plans: [],
  },
  {
    id: "nerve-block",
    name: "Occipital nerve block",
    price: "$240",
    tone: "#DCE6F5",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$240",
    insurance: "14 plans",
    length: "20 min",
    referral: 0,
    plans: [],
  },
  {
    id: "ambulatory-eeg",
    name: "48-hour EEG",
    price: "$980",
    tone: "#FCCFB8",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Oct 21", tone: "tint", calendar: true },
    ],
    self: "$980",
    insurance: "9 plans",
    length: "48 hr",
    referral: 1,
    plans: ["BlueChoice"],
  },
  {
    id: "sleep",
    name: "Sleep consult",
    price: "$250",
    tone: "#E9DCC7",
    chips: [{ label: "Wed", tone: "tint", calendar: true }],
    self: "$250",
    insurance: "18 plans",
    length: "45 min",
    referral: 1,
    plans: [],
  },
  {
    id: "cluster",
    name: "Cluster headache plan",
    price: "$325",
    tone: "#F7DCCB",
    chips: [{ label: "Tue", tone: "tint", calendar: true }],
    self: "$325",
    insurance: "14 plans",
    length: "45 min",
    referral: 0,
    plans: [],
  },
  {
    id: "cgrp",
    name: "CGRP injection",
    price: "$980",
    tone: "#FCCFB8",
    chips: [{ label: "Referral", tone: "outline" }, { label: "Thu", tone: "tint", calendar: true }],
    self: "$980",
    insurance: "9 plans",
    length: "30 min",
    referral: 1,
    plans: ["BlueChoice"],
  },
  {
    id: "epilepsy-review",
    name: "Epilepsy medication review",
    price: "$185",
    tone: "#DCE5D0",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$185",
    insurance: "14 plans",
    length: "30 min",
    referral: 0,
    plans: [],
  },
  {
    id: "video-eeg",
    name: "Video EEG monitoring",
    price: "$2,400",
    tone: "#DCE6F5",
    chips: [{ label: "Referral", tone: "outline" }, { label: "Oct 28", tone: "tint", calendar: true }],
    self: "$2,400",
    insurance: "9 plans",
    length: "72 hr",
    referral: 2,
    plans: ["BlueChoice"],
  },
  {
    id: "ncs",
    name: "Nerve conduction study",
    price: "$480",
    tone: "#F3E7C9",
    chips: [{ label: "Wed", tone: "tint", calendar: true }],
    self: "$480",
    insurance: "18 plans",
    length: "45 min",
    referral: 1,
    plans: [],
  },
  {
    id: "concussion",
    name: "Concussion assessment",
    price: "$295",
    tone: "#E9DCC7",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$295",
    insurance: "14 plans",
    length: "45 min",
    referral: 0,
    plans: [],
  },
  {
    id: "neuropsych",
    name: "Neuropsych testing",
    price: "$1,150",
    tone: "#F7DCCB",
    chips: [{ label: "Self-pay only", tone: "dark" }, { label: "Request only", tone: "outline" }],
    self: "$1,150",
    insurance: "None",
    length: "3 hr",
    referral: 1,
    plans: [],
  },
  {
    id: "tremor",
    name: "Tremor evaluation",
    price: "$325",
    tone: "#DCE5D0",
    chips: [{ label: "Fri", tone: "tint", calendar: true }],
    self: "$325",
    insurance: "14 plans",
    length: "60 min",
    referral: 1,
    plans: [],
  },
  {
    id: "parkinson",
    name: "Parkinson’s follow-up",
    price: "$210",
    tone: "#F3E7C9",
    chips: [{ label: "Thu", tone: "tint", calendar: true }],
    self: "$210",
    insurance: "14 plans",
    length: "30 min",
    referral: 0,
    plans: ["Tricare"],
  },
  {
    id: "lp",
    name: "Lumbar puncture",
    price: "$860",
    tone: "#DCE6F5",
    chips: [{ label: "Referral", tone: "outline" }],
    self: "$860",
    insurance: "9 plans",
    length: "60 min",
    referral: 2,
    plans: ["BlueChoice"],
  },
  {
    id: "vertigo",
    name: "Vertigo evaluation",
    price: "$275",
    tone: "#FCCFB8",
    chips: [{ label: "Today", tone: "today", calendar: true }],
    self: "$275",
    insurance: "18 plans",
    length: "45 min",
    referral: 0,
    plans: [],
  },
  {
    id: "second-opinion",
    name: "Second opinion consult",
    price: "$400",
    tone: "#E9DCC7",
    chips: [{ label: "Self-pay only", tone: "dark" }],
    self: "$400",
    insurance: "None",
    length: "60 min",
    referral: 0,
    plans: [],
  },
];

/** Position of a card in a grid of `cols` columns with fixed-height rows, as calc() so it can transition. */
function cellStyle(index: number, cols: number): CSSProperties {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const w = `(100% - ${(cols - 1) * GAP}px) / ${cols}`;
  const move = `${MOVE_MS}ms ${EASE}`;
  return {
    left: `calc(${col} * ((${w}) + ${GAP}px))`,
    top: `${row * (CARD_H + GAP)}px`,
    width: `calc(${w})`,
    height: `${CARD_H}px`,
    transition: `left ${move}, top ${move}, width ${move}, height ${move}, box-shadow 200ms ease`,
    willChange: "left, top, width, height",
  };
}

const TONE: Record<ChipTone, { box: string; text: string; ink: string }> = {
  tint: { box: "bg-[#28191010]", text: "text-walnut", ink: "#281910" },
  outline: { box: "border border-solid border-[#28191033]", text: "text-walnut", ink: "#281910" },
  today: { box: "bg-[#D6DEC6]", text: "text-[#2F3B2A]", ink: "#2F3B2A" },
  salmon: { box: "bg-salmon", text: "text-ink", ink: "#140C04" },
  dark: { box: "bg-walnut", text: "[color:var(--color-paper)]", ink: "#FFFCF1" },
};

function CalendarGlyph({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
      <rect x="4" y="5.5" width="16" height="14" rx="3" fill="none" stroke={color} strokeWidth="2.2" />
      <path d="M4 10h16" fill="none" stroke={color} strokeWidth="2.2" />
    </svg>
  );
}

function ServiceCard({
  service: s,
  selected,
  style,
  onToggle,
}: {
  service: Service;
  selected: boolean;
  style: CSSProperties;
  onToggle: () => void;
}) {
  const surface = s.muted ? "bg-sand" : "[background-color:var(--color-paper)]";
  const ring = selected ? "[box-shadow:#281910_0px_0px_0px_1.5px_inset]" : "";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`absolute flex flex-col justify-between p-[16px] rounded-[16px] cursor-pointer outline-none ${surface} ${ring}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="w-[36px] h-[36px] rounded-[50%] shrink-0" style={{ backgroundColor: s.tone }} />
        <div
          className={`w-[34px] h-gutter flex items-center p-[2px] rounded-[999px] shrink-0 ${selected ? "justify-end bg-walnut" : "justify-start bg-[#28191029]"}`}
        >
          <div className="w-[16px] h-[16px] rounded-[50%] shrink-0 [background-color:var(--color-paper)]" />
        </div>
      </div>
      <div className="flex flex-col gap-[2px]">
        <div className="text-msg leading-[22px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">{s.name}</div>
        <div
          className={`text-[28px] leading-[34px] tracking-[-0.01em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] ${s.muted ? "text-[#2819108C]" : "text-walnut"}`}
        >
          {s.price}
        </div>
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {s.chips.map((c) => {
          const tone = TONE[c.tone];
          return (
            <div key={c.label} className={`flex items-center h-[24px] px-[9px] rounded-[999px] gap-[5px] ${tone.box}`}>
              {c.calendar && <CalendarGlyph color={tone.ink} />}
              {c.eyeOff && (
                <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                  <path
                    d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.4.7-1.4 2-2.8 3.3M6.6 7.6C4.6 9 3.3 11 2.5 12c1 1.5 4.5 6 9.5 6 1.6 0 3-.4 4.3-1.1"
                    fill="none"
                    stroke={tone.ink}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <div className={`text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] ${tone.text}`}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value, chevron, muted }: { label: string; value: string; chevron?: boolean; muted?: boolean }) {
  return (
    <div className="flex flex-col grow basis-[0%] gap-[6px]">
      <div className="text-[12px] leading-[16px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#2819109E]">{label}</div>
      <div className="h-[40px] flex items-center justify-between px-[12px] rounded-[10px] shrink-0 bg-sand">
        <div className={`text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] ${muted ? "text-[#2819107A]" : "text-walnut"}`}>{value}</div>
        {chevron && (
          <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
            <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="#2819107A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

/** Offers that include this service: each can be published or ended here, and a new one starts as a draft. */
function ServiceOffers({ service: s }: { service: Service }) {
  const { offers, update, add } = useOffers();
  const mine = offers.filter((o) => o.services.includes(s.name));
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="text-[12px] leading-[16px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#2819109E]">Offers</div>
      {mine.map((o) => (
        <div key={o.id} className="flex items-center gap-[10px] h-[44px] pl-[12px] pr-[6px] rounded-[10px] shrink-0 bg-sand">
          <div className="shrink-0 text-[16px] leading-[20px] tracking-[-0.01em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">{o.value || "—"}</div>
          <div className="grow min-w-[0px] truncate text-[13px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">{o.title || "Untitled offer"}</div>
          <OfferPill status={o.status} />
          <button
            type="button"
            onClick={() => update(o.id, { status: o.status === "live" ? "ended" : "live" })}
            className={`h-[30px] shrink-0 px-[12px] rounded-[8px] text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] font-[500] transition-colors duration-150 ${
              o.status === "live" ? "[background-color:#FFFCF1] text-walnut" : "bg-ink [color:#FFFCF1]"
            }`}
          >
            {o.status === "live" ? "End" : o.status === "ended" ? "Run again" : "Publish"}
          </button>
        </div>
      ))}
      <div className="flex pt-[2px]">
        <button
          type="button"
          onClick={() => add([s.name], `${s.name} offer`)}
          className="flex items-center h-[26px] px-[10px] rounded-[999px] border border-dashed border-[#28191040] text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]"
        >
          Add offer
        </button>
      </div>
    </div>
  );
}

function ServiceDetail({ service: s, onRemove }: { service: Service; onRemove: () => void }) {
  return (
    <div className="flex flex-col shrink-0 p-[18px] rounded-[18px] gap-[14px] [background-color:#FFFCF1]">
      <div className="flex items-start justify-between">
        <div className="text-[26px] leading-[32px] tracking-[-0.02em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">{s.name}</div>
        <button type="button" aria-label={`Remove ${s.name}`} onClick={onRemove} className="shrink-0 mt-[8px] p-[2px]">
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" fill="none" stroke="#28191066" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex gap-[8px]">
        <Field label="Self-pay" value={s.self} />
        <Field label="Insurance" value={s.insurance} chevron muted={s.insurance === "None"} />
        <Field label="Length" value={s.length} chevron />
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="text-[12px] leading-[16px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#2819109E]">Referral</div>
        <div className="flex h-[36px] p-[3px] rounded-[10px] shrink-0 bg-sand">
          {REFERRALS.map((r, i) => (
            <div
              key={r}
              className={`grow basis-[0%] flex items-center justify-center rounded-[8px] text-label leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] ${
                i === s.referral ? "[box-shadow:#2819101F_0px_1px_2px] [background-color:#FFFCF1] text-walnut" : "text-[#2819107A]"
              }`}
            >
              {r}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap pt-[2px] gap-[6px]">
          {s.plans.map((p) => (
            <div key={p} className="flex items-center h-[26px] pr-[8px] pl-[10px] rounded-[999px] gap-[6px] bg-salmon">
              <div className="text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#7A3E26]">{p}</div>
              <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" fill="none" stroke="#7A3E26" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
          ))}
          <div className="flex items-center h-[26px] px-[10px] rounded-[999px] border border-dashed border-[#28191040]">
            <div className="text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">Add plan</div>
          </div>
        </div>
      </div>
      <ServiceOffers service={s} />
    </div>
  );
}

export function DoeHealthProductServicesPage() {
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [scrolled, setScrolled] = useState(false);
  const [more, setMore] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const selected = SERVICES.filter((s) => picked.has(s.id));
  const count = selected.length;
  const cols = count > 0 ? 3 : 4;
  const rows = Math.ceil(SERVICES.length / cols);

  const measure = () => {
    const el = listRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 0);
    setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 1);
  };
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows]);

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] grow h-full flex p-[12px] rounded-[24px] overflow-clip antialiased [background:radial-gradient(rgba(40,25,16,0.13)_0.9px,transparent_1.1px)_0px_0px/16px_16px,none_0%_0%_rgb(255,252,241)]">
      <div className="grow min-w-[0px] h-full flex flex-col p-[28px] pt-[24px] gap-[20px]">
        <div className="flex items-end justify-between [width:100%] shrink-0 relative">
          <span className="text-[58px] leading-[62px] tracking-[-0.03em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
            Services
          </span>
          <div className="flex items-center gap-[8px]">
            <div className="w-[80px] h-[38px] flex items-center shrink-0 p-[3px] rounded-[999px] gap-[2px] bg-[#EEEADF]">
              <div className="w-[34px] h-[32px] flex items-center justify-center rounded-[999px] shrink-0 [box-shadow:#2819101F_0px_1px_2px] [background-color:#FFFCF1]">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                  <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1.2" fill="none" stroke="#281910" strokeWidth="1.5" />
                  <rect x="9" y="2.5" width="4.5" height="4.5" rx="1.2" fill="none" stroke="#281910" strokeWidth="1.5" />
                  <rect x="2.5" y="9" width="4.5" height="4.5" rx="1.2" fill="none" stroke="#281910" strokeWidth="1.5" />
                  <rect x="9" y="9" width="4.5" height="4.5" rx="1.2" fill="none" stroke="#281910" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="w-[34px] h-[32px] flex items-center justify-center rounded-[999px] shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                  <path d="M6 4h8M6 8h8M6 12h8" fill="none" stroke="#281910" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="3" cy="4" r="1" fill="#281910" />
                  <circle cx="3" cy="8" r="1" fill="#281910" />
                  <circle cx="3" cy="12" r="1" fill="#281910" />
                </svg>
              </div>
            </div>
            <div className="w-[38px] h-[38px] flex items-center justify-center rounded-[50%] shrink-0 bg-[#EEEADF]">
              <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="#281910" strokeWidth="2" />
                <path d="M16 16l4 4" fill="#000000" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center h-[40px] pr-[18px] pl-[14px] rounded-[999px] gap-[6px] bg-ink">
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                <path d="M7 2.5v9M2.5 7h9" fill="#000000" stroke="#FFFCF1" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">Add service</div>
            </div>
          </div>
        </div>
        <div className="flex items-center [width:100%] h-[40px] shrink-0 rounded-[999px] gap-[8px] py-[4px]">
          <div className="flex items-center h-[40px] gap-[2px] shrink-0 p-[4px] rounded-[999px] bg-sand">
            <div className="flex items-baseline h-[30px] pt-[6px] rounded-[999px] gap-[6px] px-[14px] [box-shadow:#2819101A_0px_1px_2px] [background-color:#FFFCF1]">
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">All</div>
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2819107A]">{SERVICES.length}</div>
            </div>
            <div className="flex items-baseline h-[30px] pt-[6px] rounded-[999px] gap-[6px] px-[14px]">
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">Headache</div>
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2819105C]">3</div>
            </div>
            <div className="flex items-baseline h-[30px] pt-[6px] rounded-[999px] gap-[6px] px-[14px]">
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">Seizure</div>
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2819105C]">3</div>
            </div>
            <div className="flex items-baseline h-[30px] pt-[6px] rounded-[999px] gap-[6px] px-[14px]">
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">Nerve</div>
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2819105C]">2</div>
            </div>
            <div className="flex items-baseline h-[30px] pt-[6px] rounded-[999px] gap-[6px] px-[14px]">
              <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">Sleep</div>
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2819105C]">1</div>
            </div>
          </div>
          <div className="flex items-center h-[40px] gap-[10px] shrink-0 px-[16px] rounded-[999px] bg-sand">
            <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#28191080]">Insurance</div>
            <div className="flex items-center justify-end w-[34px] h-gutter shrink-0 p-[2px] rounded-[999px] bg-walnut">
              <div className="w-[16px] h-[16px] rounded-[50%] shrink-0 [background-color:#FFFCF1]" />
            </div>
            <div className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">Self-pay prices</div>
          </div>
        </div>
        <div className="relative flex [width:100%] grow min-h-[0px] p-[8px] rounded-[18px] bg-[#F4EEDF] overflow-hidden">
          <div ref={listRef} className="[width:100%] h-full min-h-[0px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onScroll={measure}>
            <div className="relative" style={{ height: rows * CARD_H + (rows - 1) * GAP }}>
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} service={s} selected={picked.has(s.id)} style={cellStyle(i, cols)} onToggle={() => toggle(s.id)} />
              ))}
            </div>
          </div>
          <div
            className="absolute top-[8px] left-[8px] right-[8px] h-[72px] rounded-t-[12px] pointer-events-none transition-opacity duration-200"
            style={{ backgroundImage: 'linear-gradient(180deg, #F4EEDF 0%, #F4EEDF 10%, #F4EEDFC0 32%, #F4EEDF70 58%, #F4EEDF28 82%, #F4EEDF00 100%)', opacity: scrolled ? 1 : 0 }}
          />
          <div
            className="absolute bottom-[8px] left-[8px] right-[8px] h-[72px] rounded-b-[12px] pointer-events-none transition-opacity duration-200"
            style={{ backgroundImage: 'linear-gradient(0deg, #F4EEDF 0%, #F4EEDF 10%, #F4EEDFC0 32%, #F4EEDF70 58%, #F4EEDF28 82%, #F4EEDF00 100%)', opacity: more ? 1 : 0 }}
          />
          <div className={`absolute top-[16px] left-[calc(50%-12px)] w-[24px] h-[24px] flex items-center justify-center pointer-events-none transition-opacity duration-200 ${scrolled ? "opacity-100" : "opacity-0"}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
              <path d="M3.5 10 8 5.5 12.5 10" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={`absolute bottom-[16px] left-[calc(50%-12px)] w-[24px] h-[24px] flex items-center justify-center pointer-events-none transition-opacity duration-200 ${more ? "opacity-100" : "opacity-0"}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
              <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div
        className="h-full shrink-0 overflow-hidden"
        style={{ width: count > 0 ? PANEL_OPEN_WIDTH : 0, transition: `width ${MOVE_MS}ms ${EASE}` }}
        aria-hidden={count === 0}
      >
        <div className="h-full pl-[12px]" style={{ width: PANEL_OPEN_WIDTH }}>
          <div className="w-[420px] h-full flex flex-col p-[22px] rounded-[20px] gap-[24px] [box-shadow:#FFFCF10F_0px_1px_0px_inset,#00000029_0px_4px_14px] bg-ink border border-solid border-[#FFFCF11F]">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-baseline gap-[10px]">
                <div className="text-[24px] leading-[30px] tracking-[-0.02em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
                  {count} selected
                </div>
              </div>
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => setPicked(new Set())}
                className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[10px] bg-[#FFFCF114]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={svgBase}>
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#FFFCF1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="relative flex flex-col grow min-h-[0px]">
              <div className="flex flex-col grow min-h-[0px] overflow-y-auto [scrollbar-width:none] gap-[12px] pb-[24px]">
                {selected.map((s) => (
                  <ServiceDetail key={s.id} service={s} onRemove={() => toggle(s.id)} />
                ))}
              </div>
              <div
                className="absolute left-[0px] right-[0px] bottom-[0px] h-[130px] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(16.2% 0.008 0.021 / 0%) 0%, oklab(16.2% 0.008 0.021 / 40%) 40%, oklab(16.1% 0.003 0.033 / 75%) 72%, oklab(16.2% 0.008 0.021) 92%, oklab(16.2% 0.008 0.021) 100%)' }}
              />
            </div>
            <div className="flex shrink-0 [width:100%] mt-auto gap-[8px]">
              <div className="grow h-[46px] flex items-center justify-center rounded-[12px] bg-salmon">
                <div className="text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-ink">Intelligent Edit</div>
              </div>
              <div className="h-[46px] flex items-center justify-center shrink-0 px-[18px] rounded-[12px] border border-solid border-[#FFFCF12E]">
                <div className="text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">Hide all</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
