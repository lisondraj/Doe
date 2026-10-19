"use client";

import {
  AppShell,
  At,
  Avatar,
  Button,
  C,
  Card,
  CheckBox,
  Chip,
  Cursor,
  F,
  Icon,
  Inset,
  LiveStrip,
  PageTitle,
  type SceneSpec,
  Segmented,
  Small,
  StatusDot,
  Title,
  enter,
  glide,
  keys,
  lerp,
  pulse,
  ramp,
  useT,
} from "@/components/doehealth-blog/scenes/kit";

const PHASES = [
  { name: "Cleaning and X-rays", when: "Nov 10", cost: "$0" },
  { name: "Two fillings", when: "Nov 17", cost: "$180" },
  { name: "Crown, upper left molar", when: "Dec 3", cost: "$640" },
  { name: "Whitening", when: "January", cost: "$350", optional: true },
];

/** A single card: a treatment plan in phases, with what insurance leaves the patient to pay. */
function TreatmentPlan() {
  const t = useT();
  const line = glide(t, 0.6, 2);
  const share = ramp(t, 3, 1.1);
  return (
    <At x={120} y={115} w={1040}>
      <Card pad={30}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Small>Treatment plan for Marcus Lee</Small>
            <Title size={32} style={{ marginTop: 4 }}>Bright Street Dental</Title>
          </div>
          <Chip tone="neutral" icon={<Icon name="shield" size={14} />}>
            Delta Dental PPO
          </Chip>
        </div>
        <div style={{ position: "relative", marginTop: 30 }}>
          <div style={{ position: "absolute", left: 11, right: 11, top: 11, height: 2, background: C.line2 }} />
          <div style={{ position: "absolute", left: 11, top: 11, height: 2, width: `calc((100% - 22px) * ${line})`, background: C.ink }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PHASES.map((phase, i) => (
              <div key={phase.name} style={enter(t, 0.4 + i * 0.5, 0.5, 10)}>
                <CheckBox checked={ramp(t, 0.8 + i * 0.5, 0.3) * (phase.optional ? 0 : 1)} size={24} />
                <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: phase.optional ? "transparent" : C.beige, border: phase.optional ? "1px dashed rgba(40,25,16,0.28)" : `1px solid ${C.line}`, minHeight: 128, boxSizing: "border-box" }}>
                  <Small>Phase {i + 1} · {phase.when}</Small>
                  <div style={{ fontSize: 17, fontWeight: 600, marginTop: 6, lineHeight: "22px" }}>{phase.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    <div style={{ fontFamily: F.display, fontSize: 24 }}>{phase.cost}</div>
                    {phase.optional ? <Chip tone="dashed" size={0.85}>Optional</Chip> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Inset style={{ marginTop: 22, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 15.5, fontWeight: 600 }}>Marcus pays $820 of $2,140</div>
            <Small>Insurance covers ${Math.round(1320 * share).toLocaleString()}</Small>
          </div>
          <div style={{ height: 10, borderRadius: 99, background: C.sand2, marginTop: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${61.7 * share}%`, borderRadius: 99, background: C.ink }} />
          </div>
        </Inset>
        <div style={{ marginTop: 14 }}>
          <LiveStrip p={ramp(t, 4.2, 0.4)} label="Plan shared with Marcus's agent" />
        </div>
      </Card>
    </At>
  );
}

const CLINICIANS = [
  { label: "JO", name: "Jamie Ortiz", cred: "NP · Family practice", when: "Today, 2:40 PM", fit: true },
  { label: "SK", name: "Sam Kaplan", cred: "PA · Urgent care", when: "Today, 4:15 PM", fit: true },
  { label: "RM", name: "Dr. Rachel Moss", cred: "MD · Urology", when: "Next Thu", fit: true },
  { label: "AL", name: "Alex Lund", cred: "PA · Orthopedics", when: "Today, 1:00 PM", fit: false },
];

/** Whole product page: providers matched to a request by what each one is licensed to treat. */
function ScopeMatch() {
  const t = useT();
  const sorted = glide(t, 1.6, 0.5);
  return (
    <At x={50} y={28}>
      <AppShell active={3} width={1180} height={664}>
        <At x={40} y={34}>
          <PageTitle>Providers</PageTitle>
        </At>
        <At x={40} y={116} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip tone="ink" icon={<Icon name="search" size={14} color={C.paper} />}>
            UTI symptoms, seen today
          </Chip>
          <Segmented options={["All", "NP", "PA", "MD"]} at={0} width={260} />
        </At>
        <At x={40} y={170} w={640} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CLINICIANS.map((c, i) => {
            const dim = c.fit ? 1 : lerp(1, 0.45, sorted);
            const best = i === 0 ? ramp(t, 2.2, 0.3) : 0;
            return (
              <div key={c.name} style={{ ...enter(t, 0.3 + i * 0.12), display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: best > 0.5 ? C.salmon : C.paper, border: `1px solid ${C.line}`, opacity: (enter(t, 0.3 + i * 0.12).opacity as number) * dim }}>
                <Avatar label={c.label} size={40} tone={best > 0.5 ? "paper" : "sand"} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{c.name}</div>
                  <Small style={{ marginTop: 2 }}>{c.cred}</Small>
                </div>
                {c.fit ? (
                  <Chip tone={best > 0.5 ? "paper" : "green"} icon={<Icon name="check" size={13} color={best > 0.5 ? C.walnut : C.liveText} />}>
                    In scope
                  </Chip>
                ) : (
                  <Chip tone="dashed">Outside scope</Chip>
                )}
                <Small style={{ width: 110, textAlign: "right", color: C.ink }}>{c.when}</Small>
              </div>
            );
          })}
        </At>
        <At x={710} y={170} w={350} style={enter(t, 2.4, 0.5, 14)}>
          <Card pad={22} style={{ boxShadow: "0 1px 2px rgba(40,25,16,0.06), 0 8px 24px rgba(40,25,16,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar label="JO" size={40} tone="salmon" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Jamie Ortiz, NP</div>
                <Small>Full practice authority · Oregon</Small>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
              <Small>Treats</Small>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {["UTIs", "Sinus infections", "Rashes", "Birth control", "Physicals"].map((x, i) => (
                  <Chip key={x} tone={i === 0 ? "ink" : "neutral"} size={0.9}>{x}</Chip>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>Prescribes <span style={{ color: C.muted }}>Yes</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>Telehealth <span style={{ color: C.muted }}>Yes</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>Visit <span style={{ color: C.muted }}>$95 · 20 min</span></div>
            </div>
          </Card>
        </At>
        <At x={40} y={556}>
          <LiveStrip p={ramp(t, 3.4, 0.4)} label="Matched by scope · booked by agent for 2:40 PM" />
        </At>
      </AppShell>
    </At>
  );
}

const ZONES = [
  { name: "Inner Sunset", x: 230, y: 250, r: 120, at: 0.4 },
  { name: "Noe Valley", x: 520, y: 330, r: 110, at: 0.7 },
  { name: "Richmond", x: 260, y: 470, r: 100, at: 1 },
  { name: "Bernal Heights", x: 640, y: 520, r: 90, at: 3, gap: true },
];

const CAREGIVERS = [
  { label: "GL", x: [200, 250], y: [230, 270] },
  { label: "MT", x: [540, 500], y: [310, 350] },
  { label: "KO", x: [280, 240], y: [480, 450] },
  { label: "DS", x: [520, 640], y: [420, 520], late: true },
];

/** The coverage map, set into the corner: where caregivers are, and a gap filling as a shift is assigned. */
function Coverage() {
  const t = useT();
  const covered = ramp(t, 3, 0.6);
  return (
    <At x={230} y={90}>
      <AppShell active={0} width={1320} height={880} plain>
        <svg width={1244} height={856} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`v${i}`} x1={i * 58 + 14} y1={0} x2={i * 58 - 26} y2={856} stroke={C.sand2} strokeWidth={i % 4 === 0 ? 5 : 2} />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 58 + 20} x2={1244} y2={i * 58 + 38} stroke={C.sand2} strokeWidth={i % 4 === 1 ? 5 : 2} />
          ))}
          {ZONES.map((z) => {
            const p = z.gap ? 1 : ramp(t, z.at, 0.6);
            const fill = z.gap ? `rgba(224, 124, 85, ${0.12 * (1 - covered)})` : "rgba(110, 154, 91, 0.12)";
            return (
              <g key={z.name} opacity={p}>
                <circle cx={z.x} cy={z.y} r={z.r * (0.7 + 0.3 * p)} fill={fill} stroke={z.gap ? C.alert : C.live} strokeOpacity={z.gap ? 1 - covered * 0.6 : 0.5} strokeDasharray={z.gap && covered < 0.5 ? "6 6" : undefined} strokeWidth={1.5} />
                {z.gap ? <circle cx={z.x} cy={z.y} r={z.r * covered} fill="rgba(110, 154, 91, 0.12)" /> : null}
              </g>
            );
          })}
        </svg>
        {ZONES.map((z) => (
          <At key={z.name} x={z.x - 70} y={z.y - z.r - 14} w={140} style={{ display: "flex", justifyContent: "center", ...enter(t, z.gap ? 0.2 : z.at + 0.2, 0.4, 6) }}>
            <Chip tone={z.gap && covered < 0.5 ? "salmon" : "paper"} size={0.9}>
              {z.name}
              {z.gap ? (covered < 0.5 ? " · uncovered" : " · covered") : ""}
            </Chip>
          </At>
        ))}
        {CAREGIVERS.map((c) => {
          const p = c.late ? glide(t, 2, 1.2) : glide(t, 0.5, 4);
          return (
            <At key={c.label} x={lerp(c.x[0], c.x[1], p) - 18} y={lerp(c.y[0], c.y[1], p) - 18} style={enter(t, 0.6, 0.4, 0)}>
              <div style={{ borderRadius: 99, boxShadow: `0 0 0 4px ${C.paper}, 0 6px 16px rgba(40,25,16,0.2)` }}>
                <Avatar label={c.label} size={36} tone={c.late ? "salmon" : "ink"} />
              </div>
            </At>
          );
        })}
        <At x={700} y={40} w={250} style={enter(t, 0.3)}>
          <Card pad={20}>
            <PageTitle size={34}>Coverage</PageTitle>
            <Small style={{ marginTop: 6 }}>Home care · today</Small>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><StatusDot /> 8 caregivers on shift</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><StatusDot color={covered > 0.5 ? C.live : C.alert} /> {covered > 0.5 ? "All areas covered" : "1 area uncovered"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="calendar" size={15} /> 3 visits open to agents</div>
            </div>
          </Card>
        </At>
      </AppShell>
    </At>
  );
}

const SLOTS = [
  { time: "8:00", label: "Visit · H. Brooks", booked: true },
  { time: "9:00", label: "Open", booked: false },
  { time: "10:00", label: "Drive · 12 min", booked: true, soft: true },
  { time: "10:30", label: "Visit · C. Diaz", booked: true },
];

/** A single request and the caregiver schedule it lands on. */
function HomeVisit() {
  const t = useT();
  const placed = glide(t, 2.6, 0.6);
  return (
    <>
      <At x={110} y={90} w={500} style={enter(t, 0.3, 0.5, 16)}>
        <Card pad={26}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Small>Request from Eleanor’s agent</Small>
            <Chip tone="salmon" size={0.9}>New</Chip>
          </div>
          <Title size={28} style={{ marginTop: 8 }}>Home visit for Eleanor Park, 81</Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, fontSize: 15 }}>
            {[
              ["doc", "Wound care and medication review"],
              ["clock", "Tuesday or Wednesday morning"],
              ["mapPin", "Inner Sunset · ground floor, no stairs"],
              ["shield", "Medicare Part A · home health"],
            ].map(([icon, text], i) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, ...enter(t, 0.6 + i * 0.2, 0.4, 6) }}>
                <Icon name={icon as "doc"} size={16} />
                {text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <Button height={40} style={{ transform: `scale(${1 - 0.05 * pulse(t, 2.2)})`, width: "100%" }}>
              {placed > 0.5 ? "Confirmed · Tue, Nov 10 · 9:00 AM" : "Assign Grace Liu, RN"}
            </Button>
          </div>
        </Card>
      </At>
      <At x={660} y={150} w={460} style={enter(t, 1, 0.5, 16)}>
        <Card pad={24}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar label="GL" size={40} tone="ink" />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Grace Liu, RN</div>
              <Small>Tue, Nov 10 · 2.1 mi from Eleanor</Small>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
            {SLOTS.map((s) => {
              const open = !s.booked;
              return (
                <div key={s.time} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Small style={{ width: 44 }}>{s.time}</Small>
                  <div style={{ position: "relative", flex: 1, height: s.soft ? 30 : 46, borderRadius: 12, overflow: "hidden", boxSizing: "border-box", border: open ? "1px dashed rgba(40,25,16,0.28)" : `1px solid ${C.line}`, background: s.soft ? "transparent" : open ? "transparent" : C.beige, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13.5, color: open || s.soft ? C.muted : C.walnut }}>
                    {open ? <div style={{ position: "absolute", inset: 0, background: C.salmon, transform: `translateX(${(placed - 1) * 100}%)` }} /> : null}
                    <span style={{ position: "relative", color: open && placed > 0.5 ? C.salmonText : undefined, fontWeight: open && placed > 0.5 ? 600 : 500 }}>
                      {open && placed > 0.5 ? "Visit · E. Park · wound care" : s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16 }}>
            <LiveStrip p={ramp(t, 3.4, 0.4)} label="Eleanor's agent has the details" />
          </div>
        </Card>
      </At>
      <Cursor x={keys(t, [0.4, 2], [560, 380])} y={keys(t, [0.4, 2], [660, 362])} pressed={pulse(t, 2.1)} />
    </>
  );
}

export const PRACTICE_SCENES = {
  "dental-plan": { loop: 6.5, still: 5.2, focus: [0.5, 0.45], render: () => <TreatmentPlan /> },
  "npp-scope": { loop: 6.5, still: 4.6, focus: [0.4, 0.5], render: () => <ScopeMatch /> },
  "homecare-coverage": { loop: 6.5, still: 4.8, focus: [0.5, 0.5], render: () => <Coverage /> },
  "homecare-visit": { loop: 6.5, still: 5, focus: [0.4, 0.5], render: () => <HomeVisit /> },
} satisfies Record<string, SceneSpec>;
