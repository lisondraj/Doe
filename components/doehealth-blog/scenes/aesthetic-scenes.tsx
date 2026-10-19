"use client";

import type { CSSProperties } from "react";

import {
  AppShell,
  At,
  Bubble,
  Button,
  C,
  Card,
  Chip,
  Cursor,
  F,
  Icon,
  Inset,
  LiveStrip,
  PageTitle,
  Phone,
  type SceneSpec,
  Small,
  Title,
  Toggle,
  Typing,
  enter,
  glide,
  keys,
  pulse,
  ramp,
  useT,
} from "@/components/doehealth-blog/scenes/kit";

function Row({ label, value, style }: { label: string; value: string; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderTop: `1px solid ${C.line}`, fontSize: 15, ...style }}>
      <span>{label}</span>
      <span style={{ color: C.muted }}>{value}</span>
    </div>
  );
}

/** A patient's own phone asking for two services at once, and the practice that answers. */
function Request() {
  const t = useT();
  const booked = ramp(t, 4.3, 0.35);
  return (
    <>
      <At x={170} y={30}>
        <Phone contact="Doe">
          <Bubble t={t} at={0.4} out>
            Can I get a mole check and a Botox consult this Saturday? Under $600, near Hayes Valley.
          </Bubble>
          <Typing t={t} from={1.2} to={2} />
          <Bubble t={t} at={2}>
            Lumen Dermatology has both at 11:00 AM Saturday, 0.8 mi away. $120 for the skin check, consult free with treatment.
          </Bubble>
          <Bubble t={t} at={3.5} out>
            Book it
          </Bubble>
        </Phone>
      </At>
      <At x={600} y={120} w={500} style={enter(t, 2.3, 0.6, 20)}>
        <Card pad={26}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Title size={28}>Lumen Dermatology</Title>
              <Small style={{ marginTop: 6 }}>Hayes Valley · 0.8 mi · Board-certified dermatologists</Small>
            </div>
            <Chip tone="salmon">Sat · 11:00 AM</Chip>
          </div>
          <div style={{ marginTop: 18 }}>
            <Row label="Skin check, 20 min" value="$120" />
            <Row label="Botox consult, 30 min" value="Free with treatment" />
            <Row label="Botox, if you go ahead" value="$13 / unit" />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
            <Small>Back to back, one visit</Small>
            {booked > 0.5 ? (
              <Chip tone="green" size={1.15} icon={<Icon name="check" size={14} color={C.liveText} />}>
                Booked · Sat, Nov 7
              </Chip>
            ) : (
              <Button height={40} style={{ transform: `scale(${1 - 0.05 * pulse(t, 4.1)})` }}>
                Book both
              </Button>
            )}
          </div>
        </Card>
      </At>
    </>
  );
}

const PACKAGES = [
  { name: "Glow Series", detail: "3 HydraFacials, 4 weeks apart", price: "$540" },
  { name: "Botox + Skin Check", detail: "Consult, treatment, follow-up", price: "$380" },
  { name: "Laser Hair Removal", detail: "6 sessions, one area", price: "$1,200" },
  { name: "Acne Clear Program", detail: "3 visits and a home plan", price: "$450" },
  { name: "Bridal Skin Prep", detail: "8 weeks, starts any Monday", price: "$980", off: true },
  { name: "Skin Membership", detail: "Monthly facial, 10% off treatments", price: "$149 / mo" },
];

/** Whole product page: packages and bundles, each switched on for agents. */
function Packages() {
  const t = useT();
  const on = glide(t, 2.6, 0.3);
  return (
    <At x={50} y={28}>
      <AppShell active={2} width={1180} height={664}>
        <At x={40} y={34}>
          <PageTitle>Packages</PageTitle>
        </At>
        <At x={700} y={40} style={{ display: "flex", gap: 10 }}>
          <Chip tone="outline" icon={<Icon name="building" size={14} />} trailing={<Icon name="chevronDown" size={13} />}>
            Lumen Dermatology
          </Chip>
          <Chip tone="ink" icon={<Icon name="plus" size={13} color={C.paper} />}>
            New package
          </Chip>
        </At>
        <At x={40} y={118} style={{ display: "grid", gridTemplateColumns: "repeat(3, 330px)", gap: 16 }}>
          {PACKAGES.map((pkg, i) => {
            const visible = pkg.off ? on : 1;
            return (
              <div key={pkg.name} style={{ ...enter(t, 0.3 + i * 0.12), height: 196, padding: 20, boxSizing: "border-box", borderRadius: 20, background: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(40,25,16,0.06), 0 8px 24px rgba(40,25,16,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{pkg.name}</div>
                <Small style={{ marginTop: 4 }}>{pkg.detail}</Small>
                <div style={{ fontFamily: F.display, fontSize: 30, marginTop: "auto" }}>{pkg.price}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
                  <Small style={{ color: visible > 0.5 ? C.ink : C.muted }}>{visible > 0.5 ? "Visible to agents" : "Hidden from agents"}</Small>
                  <Toggle progress={visible} />
                </div>
              </div>
            );
          })}
        </At>
        <At x={40} y={566}>
          <LiveStrip p={ramp(t, 3.2, 0.4)} label="Saved · Bridal Skin Prep is live for agents" />
        </At>
        <Cursor x={keys(t, [0.8, 2.3], [1000, 680])} y={keys(t, [0.8, 2.3], [600, 500])} pressed={pulse(t, 2.5)} size={26} />
      </AppShell>
    </At>
  );
}

const DAYS = ["Mon 2", "Tue 3", "Wed 4", "Thu 5", "Fri 6", "Sat 7"];
const HOURS = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM"];

/** [day, start hour index, length in hours, label, null = open slot that an agent fills at that second]. */
const BLOCKS: [number, number, number, string, number | null][] = [
  [0, 0, 1, "Facial · J. Kim", null],
  [0, 2, 1, "Open · 60 min", 1.2],
  [1, 1, 2, "Laser · R. Ortiz", null],
  [1, 4, 1, "Open · 45 min", 2.6],
  [2, 0, 1, "Open · 60 min", 1.9],
  [2, 3, 1, "Peel · M. Chen", null],
  [3, 2, 2, "Botox · A. Patel", null],
  [3, 0, 1, "Skin check · L. Ho", null],
  [4, 1, 1, "Open · 30 min", 3.3],
  [4, 3, 1, "Filler · S. Ruiz", null],
  [5, 2, 1, "Skin check · You", null],
  [5, 3, 1, "Botox consult", null],
];

/** The calendar, set off into the corner: open time filling as agents book it. */
function Calendar() {
  const t = useT();
  const COL = 148;
  const ROW = 82;
  const filled = BLOCKS.filter(([, , , , at]) => at !== null && t > at + 0.3).length;
  return (
    <At x={250} y={100}>
      <AppShell active={5} width={1320} height={880}>
        <At x={40} y={34} style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <PageTitle size={46}>This week</PageTitle>
          <Chip tone="green" style={{ marginBottom: 6 }}>
            {filled} of 4 open slots booked by agents
          </Chip>
        </At>
        <At x={40} y={112} style={{ display: "flex", paddingLeft: 60 }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{ width: COL, fontSize: 14, fontWeight: 600, color: i === 5 ? C.ink : C.muted }}>
              {d}
            </div>
          ))}
        </At>
        {HOURS.map((h, i) => (
          <At key={h} x={40} y={146 + i * ROW} w={60 + COL * 6} style={{ borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.faint, paddingTop: 4 }}>
            {h}
          </At>
        ))}
        {BLOCKS.map(([day, start, len, label, at], i) => {
          const fill = at === null ? 1 : ramp(t, at, 0.4);
          const open = at !== null;
          return (
            <At key={i} x={100 + day * COL} y={150 + start * ROW} w={COL - 10} h={len * ROW - 8} style={enter(t, 0.15 + i * 0.04, 0.4, 6)}>
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 12, boxSizing: "border-box", padding: "8px 10px", fontSize: 12.5, fontWeight: 500, background: open ? "transparent" : C.beige, border: open ? "1px dashed rgba(40,25,16,0.28)" : `1px solid ${C.line}`, color: open ? C.muted : C.walnut, overflow: "hidden" }}>
                {open ? <div style={{ position: "absolute", inset: 0, background: C.salmon, transformOrigin: "0 0", transform: `scaleY(${fill})` }} /> : null}
                <div style={{ position: "relative", color: open && fill > 0.5 ? C.salmonText : undefined }}>{open && fill > 0.5 ? "Booked by agent" : label}</div>
                {open && fill > 0.5 ? <div style={{ position: "relative", fontSize: 11, color: C.salmonText, opacity: 0.7, marginTop: 2 }}>New patient</div> : null}
              </div>
            </At>
          );
        })}
      </AppShell>
    </At>
  );
}

const WEEK = [
  { day: "Mon", open: 3 },
  { day: "Tue", open: 2 },
  { day: "Wed", open: 4 },
  { day: "Thu", open: 1 },
  { day: "Fri", open: 3 },
  { day: "Sat", open: 0 },
  { day: "Sun", open: 0 },
];

/** A single card: this week's unused hours, and an offer that fills them. */
function Capacity() {
  const t = useT();
  const on = glide(t, 1.9, 0.3);
  const fill = ramp(t, 2.8, 1.6);
  const left = Math.round(13 - 9 * fill);
  return (
    <>
      <At x={290} y={60} w={700}>
        <Card pad={28}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title size={30}>Open capacity</Title>
            <Chip tone="neutral">Next 7 days</Chip>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
            <div style={{ fontFamily: F.display, fontSize: 44 }}>{left}</div>
            <Small>open hours</Small>
            <div style={{ marginLeft: "auto", display: "flex", gap: 14, ...enter(t, 2.8, 0.4, 4) }}>
              <Small style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: C.salmon }} /> Booked by agents
              </Small>
              <Small style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: C.sand2 }} /> Open
              </Small>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 150, marginTop: 14 }}>
            {WEEK.map((d, i) => {
              const h = Math.max(4, d.open * 32 * ramp(t, 0.3 + i * 0.08, 0.6));
              const booked = i === 3 ? 0 : fill * 0.7;
              return (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: "100%", height: 128, display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: h, borderRadius: 10, overflow: "hidden", background: d.open ? C.sand2 : C.chip, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ height: `${booked * 100}%`, background: C.salmon }} />
                    </div>
                  </div>
                  <Small>{d.day}</Small>
                </div>
              );
            })}
          </div>
          <Inset style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>Same-week HydraFacial · $149</div>
              <Small style={{ marginTop: 2 }}>Usually $189 · Mon to Fri openings only</Small>
            </div>
            <Small style={{ color: on > 0.5 ? C.ink : C.muted }}>Offer to agents</Small>
            <Toggle progress={on} />
          </Inset>
          <div style={{ marginTop: 14 }}>
            <LiveStrip p={ramp(t, 2.4, 0.4)} label="Offer live for agents · ends Friday" />
          </div>
        </Card>
      </At>
      <Cursor x={keys(t, [0.6, 1.7], [1080, 930])} y={keys(t, [0.6, 1.7], [640, 398])} pressed={pulse(t, 1.8)} size={26} />
    </>
  );
}

export const AESTHETIC_SCENES = {
  "aesthetic-request": { loop: 6.5, still: 5.5, focus: [0.55, 0.5], render: () => <Request /> },
  "aesthetic-packages": { loop: 6, still: 4.4, focus: [0.4, 0.5], render: () => <Packages /> },
  "aesthetic-calendar": { loop: 6, still: 4.6, focus: [0.5, 0.55], render: () => <Calendar /> },
  "aesthetic-capacity": { loop: 6.5, still: 5, focus: [0.5, 0.5], render: () => <Capacity /> },
} satisfies Record<string, SceneSpec>;
