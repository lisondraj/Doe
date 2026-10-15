"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Easing, interpolate } from "remotion";

import { dmSans, p22Mackinac } from "@/lib/home/fonts";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, blink, camera, fly, keys, lerp, pulse, ramp, typed } from "@/remotion/video1/motion";
import { C, F, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "@/remotion/video1/theme";
import { AppShell, Button, Caret, Chip, Cursor, Icon, Label, ShadowsContext, StatusDot, Toggle, type ChipTone, type IconName } from "@/remotion/video1/ui";

/*
 * Video1's Providers scene (full product) followed by its Services scene without the app frame,
 * on video1's own frame clock and camera keys. `frame` comes from scroll, never from time.
 */

/** Sofia's new card is part-way through being filled in when Providers leaves. */
const PROVIDERS_EXIT_AT = 214;
const PROVIDERS_END = PROVIDERS_EXIT_AT + 18;
/** Services starts once Providers has faded out, and stops before the cursor heads for the rail. */
const SERVICES_FROM = PROVIDERS_END;
const SERVICES_END = 230;
export const DOEHEALTH_DESK2_PRODUCT_FRAMES = SERVICES_FROM + SERVICES_END;

export function DoeHealthDesk2UpdatesProduct({ frame }: { frame: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / VIDEO1_WIDTH));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const servicesFrame = frame - SERVICES_FROM;
  return (
    <div ref={boxRef} className={`doehealth-desk2-find__product ${p22Mackinac.variable} ${dmSans.variable}`} aria-hidden="true">
      <div style={{ position: "absolute", left: 0, top: 0, width: VIDEO1_WIDTH, height: VIDEO1_HEIGHT, overflow: "hidden", transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <ShadowsContext.Provider value={false}>
          {frame < PROVIDERS_END ? <ProvidersScene frame={frame} /> : null}
          {servicesFrame >= 0 ? <ServicesScene frame={Math.min(servicesFrame, SERVICES_END)} /> : null}
        </ShadowsContext.Provider>
      </div>
    </div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const pa = rgb(a);
  const pb = rgb(b);
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(", ")})`;
};

const fill: CSSProperties = { position: "absolute", inset: 0 };

const SHELL = { x: 240, y: 90 };
/** The paper panel inside the shell; Services draws in its coordinates without the frame around it. */
const PANEL_ORIGIN = { x: SHELL.x + 64, y: SHELL.y + 12, w: 1364, h: 876 };

/* ─── Services cards + edit panel ──────────────────────────────────────────── */

const CODE_SHELL_S = 3.75;
const EDIT_FOCUS = { x: 1457, y: 322 };
/** Opens close in on the left edge, then pulls back to the whole page (video1's camera). */
const SERVICES_CAM = [
  { f: 0, x: SHELL.x + 960 / CODE_SHELL_S, y: 540, s: CODE_SHELL_S },
  { f: 44, x: 960, y: 540, s: 1.12 },
  { f: 76, x: 960, y: 540, s: 1.12 },
  { f: 116, x: EDIT_FOCUS.x, y: EDIT_FOCUS.y, s: 2.35 },
  { f: 212, x: EDIT_FOCUS.x, y: EDIT_FOCUS.y, s: 2.35 },
  { f: 252, x: 960, y: 540, s: 1 },
];
const PULL_BACK_EASE = Easing.bezier(0.2, 0.3, 0.3, 1);
const servicesCam = (f: number) => camera(f, SERVICES_CAM, f < SERVICES_CAM[1].f ? PULL_BACK_EASE : undefined);
const GRID = { x: 28, y: 158, colW: (908 - 24) / 3, rowH: 210, gap: 12 };
const PANEL_X = GRID.x + 3 * GRID.colW + 3 * GRID.gap;
const PANEL = { x: PANEL_X, y: 28, w: 1364 - 28 - PANEL_X, h: 876 - 56 };
const SECOND_PICK_AT = 61;

type Service = { name: string; price: string; icon: IconName; chips: { label: string; tone: ChipTone }[]; off?: boolean };

const SERVICES: Service[] = [
  { name: "New Patient Visit", price: "$225", icon: "user", chips: [{ label: "Tue", tone: "outline" }] },
  {
    name: "Ear Tube Consult",
    price: "$225",
    icon: "ear",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Tue", tone: "outline" },
    ],
  },
  {
    name: "Tonsils and Adenoids",
    price: "$225",
    icon: "pill",
    chips: [
      { label: "Referral", tone: "outline" },
      { label: "Oct 21", tone: "outline" },
    ],
  },
  { name: "Hearing Test", price: "$140", icon: "headset", chips: [{ label: "Today", tone: "green" }] },
  {
    name: "Ear Tube Surgery",
    price: "$2,850",
    icon: "plus",
    chips: [
      { label: "Prior auth", tone: "salmon" },
      { label: "Request only", tone: "outline" },
    ],
  },
  {
    name: "Tongue-Tie Release",
    price: "$395",
    icon: "doc",
    chips: [
      { label: "Self-pay only", tone: "ink" },
      { label: "Wed", tone: "outline" },
    ],
  },
  { name: "Earwax Removal", price: "$95", icon: "clock", chips: [{ label: "Today", tone: "green" }] },
  { name: "Swim Earplugs", price: "$75", icon: "shield", chips: [{ label: "Self-pay only", tone: "neutral" }] },
  { name: "Hearing Aid Fitting", price: "$1,800", icon: "headset", chips: [{ label: "Hidden from agents", tone: "neutral" }], off: true },
];

const SERVICE_HUES = [C.salmon, "#D6DEC6", C.sand2, C.sand2, C.salmon, "#D6DEC6", "#D6DEC6", C.salmon, C.sand2];

function ServicesScene({ frame }: { frame: number }) {
  const cam = servicesCam(frame);
  const enter = ramp(frame, 4, 20, EASE_IN_OUT);
  const move = ramp(frame, -24, 56, EASE_IN_OUT);
  const moveSecond = ramp(frame, 42, 14, EASE_IN_OUT);
  const panel = ramp(frame, 40, 24);
  const selected = [frame >= 39 ? 1 : -1, frame >= SECOND_PICK_AT ? 4 : -1];

  return (
    <div style={fill}>
      <div style={cam}>
        <div style={{ position: "absolute", left: PANEL_ORIGIN.x, top: PANEL_ORIGIN.y, width: PANEL_ORIGIN.w, height: PANEL_ORIGIN.h }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.name} service={service} hue={SERVICE_HUES[i]} selected={selected.includes(i)} style={{ left: GRID.x + (i % 3) * (GRID.colW + GRID.gap), top: GRID.y + Math.floor(i / 3) * (GRID.rowH + GRID.gap) }} />
          ))}
          <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: panel, transform: `translateX(${(1 - panel) * 80}px)` }}>
            <EditPanel frame={frame} />
          </div>
          {enter < 1 ? <div style={{ position: "absolute", inset: -400, background: C.beige, opacity: 1 - enter }} /> : null}
        </div>
        <div style={{ opacity: enter * (1 - ramp(frame, 70, 10)) }}>
          <Cursor x={lerp(1580, 790, move)} y={lerp(lerp(1100, 372, move), 594, moveSecond)} pressed={Math.max(pulse(frame, 36, 3, 6), pulse(frame, SECOND_PICK_AT - 3, 3, 6))} />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, hue, selected, style }: { service: Service; hue: string; selected: boolean; style: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        width: GRID.colW,
        height: GRID.rowH,
        boxSizing: "border-box",
        padding: 18,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        background: service.off ? C.beige : C.paper,
        border: selected ? `1.5px solid ${C.walnut}` : `1px solid ${C.line}`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: hue }} />
        <Toggle on={!service.off} />
      </div>
      <div style={{ marginTop: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: service.off ? C.muted : C.walnut }}>{service.name}</div>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.02em", color: service.off ? C.faint : C.walnut }}>{service.price}</div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {service.chips.map((chip) => (
          <Chip key={chip.label} tone={chip.tone}>
            {chip.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function EditPanel({ frame }: { frame: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", padding: 23, borderRadius: 22, background: C.ink, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, letterSpacing: "-0.02em", color: C.paper }}>{frame >= SECOND_PICK_AT ? 2 : 1} selected</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255, 252, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={16} color={C.paper} />
        </div>
      </div>
      <EditCard frame={frame} />
      <div style={fly(frame, { at: SECOND_PICK_AT, y: 24, dur: 18, blur: 0 })}>
        <SurgeryEditCard />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 44,
          padding: "0 16px",
          borderRadius: 14,
          background: "rgba(255, 252, 241, 0.08)",
          fontFamily: F.ui,
          fontSize: 15,
          color: C.paper,
          ...fly(frame, { at: 214, y: 12, dur: 16, blur: 0 }),
        }}
      >
        <StatusDot color={C.live} />
        Saved · live for agents now
      </div>
      <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
        <Button tone="salmon" style={{ flex: 1, fontSize: 15 }}>
          Save changes
        </Button>
        <Button tone="outline" style={{ color: C.paper, border: "1px solid rgba(255, 252, 241, 0.2)", fontSize: 15 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

const NEW_PRICE = "$245";

function EditCard({ frame }: { frame: number }) {
  const focused = frame >= 134;
  const selectAll = frame >= 140 && frame < 146;
  const typing = frame >= 146;
  const value = typing ? typed(NEW_PRICE, frame, 146, 9) : "$225";
  const seg = ramp(frame, 178, 14, EASE_IN_OUT);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 18, borderRadius: 18, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: SERVICE_HUES[1], flexShrink: 0 }} />
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "32px", letterSpacing: "-0.02em", color: C.walnut }}>Ear Tube Consult</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <EditField label="Self-pay">
          <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.paper, border: `1.5px solid ${focused ? C.walnut : C.line2}` }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut, background: selectAll ? "rgba(252, 207, 184, 0.9)" : "transparent", borderRadius: 3 }}>{value}</span>
            {focused ? <Caret height={18} width={1.5} visible={typing && frame < 166 ? 1 : blink(frame)} /> : null}
          </div>
        </EditField>
        <EditField label="Insurance">
          <SelectBox value="14 plans" />
        </EditField>
        <EditField label="Length">
          <SelectBox value="30 min" />
        </EditField>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label style={{ fontSize: 12 }}>Referral</Label>
        <div style={{ position: "relative", display: "flex", height: 36, padding: 3, borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
          <div style={{ position: "absolute", top: 3, bottom: 3, left: `calc(3px + ${seg} * (100% - 6px) / 3)`, width: "calc((100% - 6px) / 3)", borderRadius: 8, background: C.paper }} />
          {["Never", "Some plans", "Always"].map((label, i) => (
            <div
              key={label}
              style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: Math.round(seg) === i ? C.walnut : "rgba(40, 25, 16, 0.48)" }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, height: 28, paddingTop: 2 }}>
          {[
            { label: "BlueChoice", at: 194 },
            { label: "Harbor Mutual", at: 202 },
          ].map((chip) => (
            <div key={chip.label} style={fly(frame, { at: chip.at, y: 6, scale: 0.8, dur: 14, blur: 0 })}>
              <Chip tone="salmon" trailing={<Icon name="x" size={10} color={C.salmonText} stroke={2.2} />}>
                {chip.label}
              </Chip>
            </div>
          ))}
          <div style={fly(frame, { at: 208, y: 6, scale: 0.8, dur: 14, blur: 0 })}>
            <Chip tone="dashed">Add plan</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

function SurgeryEditCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 18, borderRadius: 18, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: SERVICE_HUES[4], flexShrink: 0 }} />
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "32px", letterSpacing: "-0.02em", color: C.walnut }}>Ear Tube Surgery</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <EditField label="Self-pay">
          <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.paper, border: `1.5px solid ${C.line2}` }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>$2,850</span>
          </div>
        </EditField>
        <EditField label="Insurance">
          <SelectBox value="9 plans" />
        </EditField>
        <EditField label="Length">
          <SelectBox value="60 min" />
        </EditField>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Label style={{ fontSize: 12 }}>Referral</Label>
        <div style={{ position: "relative", display: "flex", height: 36, padding: 3, borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
          <div style={{ position: "absolute", top: 3, bottom: 3, left: "calc(3px + 2 * (100% - 6px) / 3)", width: "calc((100% - 6px) / 3)", borderRadius: 8, background: C.paper }} />
          {["Never", "Some plans", "Always"].map((label, i) => (
            <div key={label} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: i === 2 ? C.walnut : "rgba(40, 25, 16, 0.48)" }}>
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, height: 28, paddingTop: 2 }}>
          <Chip tone="salmon">Prior auth</Chip>
          <Chip tone="outline">Request only</Chip>
        </div>
      </div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <Label style={{ fontSize: 12 }}>{label}</Label>
      {children}
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderRadius: 10, boxSizing: "border-box", background: C.beige }}>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>{value}</span>
      <Icon name="chevronDown" size={12} color="rgba(40, 25, 16, 0.48)" />
    </div>
  );
}

/* ─── Providers carousel + Add Provider ────────────────────────────────────── */

type Provider = { name: string; tag: string; type: string; role: string; tile: string; facts: [string, string][] };

const PROVIDERS: Provider[] = [
  {
    name: "Priya Raman",
    tag: "AuD",
    type: "Audiology",
    role: "Audiologist",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Audiology"],
      ["Clinic", "Mission"],
      ["In practice", "8 years"],
      ["Speaks", "English, Tamil"],
      ["Plans", "11 accepted"],
      ["NPI", "1639204871"],
    ],
  },
  {
    name: "Dr. Daniel Reyes",
    tag: "MD",
    type: "Pediatric ENT",
    role: "Staff Physician",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Pediatric ENT"],
      ["Clinic", "Mission"],
      ["In practice", "15 years"],
      ["Speaks", "English, Spanish"],
      ["Plans", "14 accepted"],
      ["NPI", "1902837465"],
    ],
  },
  {
    name: "Dr. Maya Okafor",
    tag: "MD",
    type: "Otolaryngology",
    role: "Staff Physician",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Otolaryngology"],
      ["Clinic", "Mission"],
      ["In practice", "12 years"],
      ["Speaks", "English +2"],
      ["Plans", "9 accepted"],
      ["NPI", "1487220391"],
    ],
  },
  {
    name: "Dr. Jun Lee",
    tag: "MD",
    type: "Head & neck surgery",
    role: "Surgeon",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Head & neck"],
      ["Clinic", "Mission"],
      ["In practice", "18 years"],
      ["Speaks", "English, Korean"],
      ["Plans", "10 accepted"],
      ["NPI", "1558329014"],
    ],
  },
  {
    name: "Dr. Ruth Chen",
    tag: "MD",
    type: "Laryngology",
    role: "Staff Physician",
    tile: "#F7DCCB",
    facts: [
      ["Specialty", "Laryngology"],
      ["Clinic", "Sunset"],
      ["In practice", "11 years"],
      ["Speaks", "English, Mandarin"],
      ["Plans", "9 accepted"],
      ["NPI", "1720493386"],
    ],
  },
  {
    name: "Dr. Omar Haddad",
    tag: "MD",
    type: "Otology",
    role: "Staff Physician",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Otology"],
      ["Clinic", "Sunset"],
      ["In practice", "7 years"],
      ["Speaks", "English, Arabic"],
      ["Plans", "8 accepted"],
      ["NPI", "1093847562"],
    ],
  },
  {
    name: "Dr. Lena Park",
    tag: "AuD",
    type: "Pediatric audiology",
    role: "Audiologist",
    tile: "#E9DCC7",
    facts: [
      ["Specialty", "Audiology"],
      ["Clinic", "Noe Valley"],
      ["In practice", "6 years"],
      ["Speaks", "English, Korean"],
      ["Plans", "10 accepted"],
      ["NPI", "1265093847"],
    ],
  },
];

/** Added live through "Add Provider", so she isn't in the list yet. */
const NEW_PROVIDER: Provider = {
  name: "Dr. Sofia Alvarez",
  tag: "DO",
  type: "Allergy",
  role: "Staff Physician",
  tile: "#F7DCCB",
  facts: [
    ["Specialty", "Allergy"],
    ["Clinic", "Noe Valley"],
    ["In practice", "9 years"],
    ["Speaks", "English, Spanish"],
    ["Plans", "12 accepted"],
    ["NPI", "1376540298"],
  ],
};

const CAROUSEL = { x: 40, focusTop: 258, rowH: 64, cardH: 340, gap: 8, width: 840 };
const WAVE_SIDE = { x: CAROUSEL.x + CAROUSEL.width - 160, w: 1364 - (CAROUSEL.x + CAROUSEL.width - 160) };

/** video1's vertical halftone wave beside the providers list (top 0.05, amp 50, fade 0.45), drawn for a given frame. */
function DotWave({ frame, width, height }: { frame: number; width: number; height: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const W = height;
    const H = width;
    const top = 0.05;
    const amp = 50;
    const fade = 0.45;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = C.dot;
    const t = frame / 30;
    const cols = 150;
    const rows = 34;
    for (let j = 0; j < rows; j++) {
      const v = j / (rows - 1);
      const s = 0.35 + 0.65 * Math.pow(v, 1.2);
      const baseY = H * top + Math.pow(v, 1.3) * H * 0.64;
      const rowFade = Math.min(1, Math.pow(v / 0.4, 1.2));
      for (let i = 0; i < cols; i++) {
        const x0 = -240 + (i / (cols - 1)) * (W + 480);
        const x = W / 2 + (x0 - W / 2) * (0.92 + 0.16 * v);
        const z = 0.6 * Math.sin(x0 / 210 + 0.6 + t * 0.8) + 0.4 * Math.sin(x0 / 120 - baseY / 80 + 1.2 + t * 1.3) + 0.3 * Math.sin(x0 / 330 + baseY / 150 + t * 0.45);
        const h = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
        const y = baseY - z * amp * s;
        const edgeFade = Math.min(1, Math.max(0, y / (H * fade)));
        ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * h) * (0.5 + 0.5 * s)) * rowFade * edgeFade;
        ctx.beginPath();
        ctx.arc(y, x, (0.9 + 2.2 * s) * (0.7 + 0.5 * h), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [frame, width, height]);

  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width, height }} />;
}
const ROW_TONES = { focus: C.beige, near: "#FAF6EC", far: "#F6F0E2" };
const ABOVE = { at: [0, 1, 2, 2.7], opacity: [1, 0.7, 0.35, 0] };
const BELOW = { at: [0, 1, 2, 3, 3.7], opacity: [1, 0.7, 0.4, 0.2, 0] };

/** Item tops for a fractional focus index, keeping the focused card's center fixed. */
function carouselLayout(items: { height: number; gap: number }[], focus: number) {
  const centers: number[] = [];
  let y = 0;
  for (const item of items) {
    centers.push(y + item.height / 2);
    y += item.height + item.gap;
  }
  const i0 = Math.min(items.length - 1, Math.floor(focus));
  const i1 = Math.min(items.length - 1, i0 + 1);
  const anchor = lerp(centers[i0], centers[i1], focus - i0);
  const shift = CAROUSEL.focusTop + CAROUSEL.cardH / 2 - anchor;
  return items.map((item, i) => centers[i] - item.height / 2 + shift);
}

/** The blank card is inserted under Maya Okafor (index 2). */
const NEW_SLOT = 3;
const ADD_CLICK_AT = 100;
const NAME_CLICK_AT = 138;
const ADD_BUTTON = { x: SHELL.x + 64 + 813, y: SHELL.y + 12 + 65 };
const NAME_FIELD = { x: SHELL.x + 64 + CAROUSEL.x + 308 + 120, y: SHELL.y + 12 + CAROUSEL.focusTop + 90 };

function ProvidersScene({ frame }: { frame: number }) {
  const insert = ramp(frame, ADD_CLICK_AT + 4, 30, EASE_IN_OUT);
  const focus = keys(frame, [40, 66], [1, 2]) + insert;
  const providerD = (i: number) => (i < NEW_SLOT ? i - focus : i + 1 - focus - (1 - insert));
  const rowHeight = (d: number) => lerp(CAROUSEL.cardH, CAROUSEL.rowH, Math.min(1, Math.abs(d)));
  const items = [
    ...PROVIDERS.slice(0, NEW_SLOT).map((_, i) => ({ height: rowHeight(providerD(i)), gap: CAROUSEL.gap })),
    { height: CAROUSEL.cardH * insert, gap: CAROUSEL.gap * insert },
    ...PROVIDERS.slice(NEW_SLOT).map((_, j) => ({ height: rowHeight(providerD(NEW_SLOT + j)), gap: CAROUSEL.gap })),
  ];
  const tops = carouselLayout(items, focus);
  const itemIndex = (i: number) => (i < NEW_SLOT ? i : i + 1);
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: 24, x: 960, y: 540, s: 1 },
    { f: 84, x: 900, y: 440, s: 1.12 },
    { f: 104, x: 900, y: 440, s: 1.12 },
    { f: 152, x: 840, y: 540, s: 1.2 },
    { f: 234, x: 830, y: 548, s: 1.25 },
  ]);
  const leave = ramp(frame, PROVIDERS_EXIT_AT, 18, EASE_IN);
  const startFocus = 1;
  const waveIn = ramp(frame, 10, 40, EASE_IN_OUT);
  const toAdd = ramp(frame, 74, 24, EASE_IN_OUT);
  const toName = ramp(frame, 110, 26, EASE_IN_OUT);

  return (
    <div style={fill}>
      <div style={cam}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, opacity: ramp(frame, 0, 12) * (1 - leave), transform: `translateY(${-80 * leave}px)` }}>
          <AppShell active={3} plain>
            <div style={{ position: "absolute", left: WAVE_SIDE.x, top: 0, width: WAVE_SIDE.w, height: 876, opacity: waveIn }}>
              <DotWave frame={frame} width={WAVE_SIDE.w} height={876} />
            </div>
            <div style={fly(frame, { at: 6, y: 16, dur: 20, blur: 0 })}>
              <ProvidersHeader press={pulse(frame, ADD_CLICK_AT, 3, 8)} />
            </div>
            <div style={{ position: "absolute", left: CAROUSEL.x, top: 0, width: CAROUSEL.width, height: 876 }}>
              {PROVIDERS.map((provider, i) => (
                <CarouselItem key={provider.name} provider={provider} d={providerD(i)} top={tops[itemIndex(i)]} height={items[itemIndex(i)].height} enter={ramp(frame, 10 + Math.abs(i - startFocus) * 4, 22)} />
              ))}
              <NewProviderCard frame={frame} top={tops[NEW_SLOT]} height={items[NEW_SLOT].height} open={insert} />
            </div>
            <div style={fly(frame, { at: 22, y: 12, dur: 18, blur: 0 })}>
              <ViewToggle />
            </div>
          </AppShell>
        </div>
        <div style={{ opacity: ramp(frame, 72, 8) * (1 - ramp(frame, NAME_CLICK_AT + 10, 10)) }}>
          <Cursor x={lerp(lerp(1480, ADD_BUTTON.x, toAdd), NAME_FIELD.x, toName)} y={lerp(lerp(980, ADD_BUTTON.y, toAdd), NAME_FIELD.y, toName)} pressed={Math.max(pulse(frame, ADD_CLICK_AT, 3, 6), pulse(frame, NAME_CLICK_AT, 3, 6))} />
        </div>
      </div>
    </div>
  );
}

type TypedField = { label: string; text: string; at: number; cps: number };

const NEW_TYPING: { name: TypedField; fields: TypedField[] } = {
  name: { label: "Name", text: NEW_PROVIDER.name, at: 142, cps: 24 },
  fields: [
    { label: "Credential", text: NEW_PROVIDER.tag, at: 184, cps: 20 },
    { label: "Specialty", text: NEW_PROVIDER.type, at: 190, cps: 26 },
    { label: "Clinic", text: "Noe Valley", at: 216, cps: 22 },
    { label: "In practice", text: "9 years", at: 999, cps: 20 },
    { label: "Plans", text: "12 accepted", at: 999, cps: 20 },
    { label: "NPI", text: "1376540298", at: 999, cps: 20 },
  ],
};
const AGENTS_TOGGLE_AT = 168;

/** Blank card opened by "Add Provider"; Sofia's details are typed into its fields. */
function NewProviderCard({ frame, top, height, open }: { frame: number; top: number; height: number; open: number }) {
  if (open <= 0.001) return null;
  const content = clamp01((open - 0.55) / 0.4);
  const name = typed(NEW_TYPING.name.text, frame, NEW_TYPING.name.at, NEW_TYPING.name.cps);
  const started = [NEW_TYPING.name, ...NEW_TYPING.fields].filter((f) => frame >= f.at);
  const active = frame >= NAME_CLICK_AT ? (started[started.length - 1] ?? NEW_TYPING.name) : null;
  const caret = (field: TypedField, size: number) =>
    active === field ? <Caret height={size} width={size > 24 ? 2.5 : 1.5} visible={frame >= field.at && typed(field.text, frame, field.at, field.cps).length < field.text.length ? 1 : blink(frame)} /> : null;
  const agentsIn = ramp(frame, AGENTS_TOGGLE_AT - 6, 10);
  const agentsOn = ramp(frame, AGENTS_TOGGLE_AT + 4, 10, EASE_IN_OUT);

  return (
    <div style={{ position: "absolute", left: 0, top, width: CAROUSEL.width, height, borderRadius: 24, overflow: "hidden", background: ROW_TONES.focus, opacity: Math.min(1, open * 1.6) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CAROUSEL.width, height: CAROUSEL.cardH, opacity: content, transform: `translateY(${(1 - content) * 10}px)` }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: 260, height: 298, borderRadius: 16, background: C.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plus" size={20} stroke={2} />
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.muted }}>Add photo</div>
        </div>
        <div style={{ position: "absolute", left: 308, top: 24, right: 22, bottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
            <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.muted }}>New provider</div>
            <Icon name="x" size={14} color="rgba(40, 25, 16, 0.4)" />
          </div>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderRadius: 14, background: C.paper }}>
            <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 34, letterSpacing: "-0.02em", color: name ? C.walnut : "rgba(40, 25, 16, 0.3)" }}>{name || (active ? "" : "Full name")}</span>
              {caret(NEW_TYPING.name, 34)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: agentsIn, transform: `translateX(${(1 - agentsIn) * 8}px)` }}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: agentsOn > 0.5 ? C.walnut : C.muted }}>Accepting Agents</span>
              <Toggle progress={agentsOn} />
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 8 }}>
            {NEW_TYPING.fields.map((field) => (
              <div key={field.label} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, padding: "0 14px", borderRadius: 14, background: C.paper }}>
                <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "rgba(40, 25, 16, 0.5)" }}>{field.label}</div>
                <div style={{ height: 20, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 15, lineHeight: "20px", color: C.walnut, whiteSpace: "nowrap" }}>
                  {typed(field.text, frame, field.at, field.cps)}
                  {caret(field, 17)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvidersHeader({ press = 0 }: { press?: number }) {
  return (
    <div style={{ position: "absolute", left: 40, top: 40, width: CAROUSEL.width, height: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut }}>Providers</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(40, 25, 16, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={16} stroke={2} />
        </div>
        <div style={{ display: "flex", alignItems: "center", height: 38, padding: "0 16px 0 12px", gap: 6, borderRadius: 999, background: C.ink, transform: `scale(${1 - 0.08 * press})` }}>
          <Icon name="plus" size={14} color={C.paper} stroke={2} />
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: C.paper }}>Add Provider</span>
        </div>
      </div>
    </div>
  );
}

function ViewToggle() {
  return (
    <div
      style={{ position: "absolute", left: 40, top: 824, width: 160, height: 38, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 2, padding: 4, borderRadius: 999, background: C.paper, border: "1px solid rgba(40, 25, 16, 0.09)" }}
    >
      <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 13px 0 10px", gap: 6, borderRadius: 999, background: C.ink }}>
        <Icon name="grid" size={14} color={C.paper} stroke={1.6} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, lineHeight: "16px", color: C.paper }}>Cards</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 13px 0 10px", gap: 6, borderRadius: 999 }}>
        <Icon name="list" size={14} color="rgba(40, 25, 16, 0.62)" stroke={1.8} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, lineHeight: "16px", color: "rgba(40, 25, 16, 0.62)" }}>List</span>
      </div>
    </div>
  );
}

/** Row and card geometry from the Paper carousel; the tile and name morph between the two. */
const MORPH = { tile: { row: { x: 22, y: 8, w: 48, h: 48, r: 12 }, card: { x: 20, y: 20, w: 260, h: 298, r: 16 } }, name: { row: { x: 84, y: 16, scale: 28 / 40 }, card: { x: 308, y: 28, scale: 1 } } };

function CarouselItem({ provider, d, top, height, enter }: { provider: Provider; d: number; top: number; height: number; enter: number }) {
  const ad = Math.abs(d);
  const band = d < 0 ? ABOVE : BELOW;
  const opacity = interpolate(ad, band.at, band.opacity, { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * enter;
  if (opacity <= 0.001) return null;
  const open = EASE_IN_OUT(1 - Math.min(1, ad));
  const background = ad <= 1 ? mix(ROW_TONES.focus, ROW_TONES.near, ad) : mix(ROW_TONES.near, ROW_TONES.far, Math.min(1, ad - 1));
  const { tile, name } = MORPH;
  const rowOnly = clamp01(1 - open * 2.2);
  const cardOnly = clamp01((open - 0.55) / 0.4);

  return (
    <div style={{ position: "absolute", left: 0, top, width: CAROUSEL.width, height, borderRadius: lerp(20, 24, open), overflow: "hidden", background, opacity, transform: `translateY(${(1 - enter) * 40}px)` }}>
      <div
        style={{
          position: "absolute",
          left: lerp(tile.row.x, tile.card.x, open),
          top: lerp(tile.row.y, tile.card.y, open),
          width: lerp(tile.row.w, tile.card.w, open),
          height: lerp(tile.row.h, tile.card.h, open),
          borderRadius: lerp(tile.row.r, tile.card.r, open),
          background: mix(provider.tile, C.salmon, open),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: lerp(name.row.x, name.card.x, open),
          top: lerp(name.row.y, name.card.y, open),
          transform: `scale(${lerp(name.row.scale, name.card.scale, open)})`,
          transformOrigin: "0 0",
          whiteSpace: "nowrap",
          fontFamily: F.display,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: "44px",
          letterSpacing: lerp(-0.015, -0.02, open) + "em",
          color: C.walnut,
        }}
      >
        {provider.name}
        <span style={{ opacity: cardOnly }}>, {provider.tag}</span>
      </div>
      <div style={{ position: "absolute", right: 22, top: 20, height: 24, display: "flex", gap: 14, opacity: rowOnly }}>
        <div style={rowChip}>{provider.tag}</div>
        <div style={rowChip}>{provider.type}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: CAROUSEL.width, height: CAROUSEL.cardH, opacity: cardOnly, transform: `translateY(${(1 - cardOnly) * 10}px)` }}>
        <ProviderCardDetails provider={provider} />
      </div>
    </div>
  );
}

const rowChip: CSSProperties = { display: "flex", alignItems: "center", height: 24, padding: "0 9px", flexShrink: 0, borderRadius: 999, background: C.beige, fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: C.walnut };

const outlineChip: CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: 30,
  padding: "0 14px",
  boxSizing: "border-box",
  borderRadius: 999,
  border: "1px solid rgba(40, 25, 16, 0.2)",
  fontFamily: F.ui,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "18px",
  color: C.walnut,
  whiteSpace: "nowrap",
};

/** Everything in the open card except the morphing tile and name. */
function ProviderCardDetails({ provider }: { provider: Provider }) {
  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "20px 22px 20px 20px", display: "flex", gap: 28 }}>
      <div style={{ width: 260, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0 6px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 12, height: 44 }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "rgba(40, 25, 16, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" style={{ display: "block" }}>
                <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke={C.walnut} strokeWidth={2} strokeLinejoin="round" />
                <path d="M13.5 6.5l4 4" fill="none" stroke={C.walnut} strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={outlineChip}>{provider.role}</div>
            <div style={outlineChip}>{provider.type}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", rowGap: 16, padding: "16px 18px", borderRadius: 16, background: C.paper }}>
          {provider.facts.map(([label, value]) => (
            <div key={label} style={{ width: 150, flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "rgba(40, 25, 16, 0.5)" }}>{label}</div>
              <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, lineHeight: "20px", color: C.walnut }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
