"use client";

import {
  AgentBridge,
  AgentMessage,
  AppShell,
  At,
  C,
  Card,
  CheckBox,
  Chip,
  Cursor,
  F,
  Icon,
  type IconName,
  Inset,
  LiveStrip,
  PageTitle,
  type SceneSpec,
  Segmented,
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

const DEPARTMENTS: readonly { name: string; detail: string; icon: IconName; x: number; y: number }[] = [
  { name: "Cardiology", detail: "12 providers", icon: "user", x: 470, y: 150 },
  { name: "Imaging", detail: "East Campus", icon: "eye", x: 790, y: 150 },
  { name: "Orthopedics", detail: "9 providers", icon: "building", x: 860, y: 330 },
  { name: "Cardiac Rehab", detail: "Bayview · partner", icon: "sync", x: 790, y: 500 },
  { name: "Emergency", detail: "24/7", icon: "clock", x: 470, y: 500 },
  { name: "Laboratory", detail: "3 sites", icon: "doc", x: 390, y: 330 },
];

const HUB = { x: 690, y: 345 };

/** The order a cardiac workup moves through the map. */
const PATHWAY = [5, 0, 1, 3];

const CAMPUSES = [
  { name: "Main Campus", count: "14 departments" },
  { name: "East Campus", count: "6 departments" },
  { name: "Children's Pavilion", count: "5 departments" },
  { name: "Bayview Rehab", count: "Partner organization" },
];

/** Whole product page: the health system drawn as a map of campuses, departments, and the pathways between them. */
function NetworkMap() {
  const t = useT();
  const step = (i: number) => ramp(t, 3 + PATHWAY.indexOf(i) * 0.75, 0.4);
  return (
    <At x={50} y={28}>
      <AppShell active={4} width={1180} height={664}>
        <At x={40} y={34}>
          <PageTitle>Network</PageTitle>
        </At>
        <At x={560} y={38} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip tone="outline" icon={<Icon name="building" size={14} />} trailing={<Icon name="chevronDown" size={13} />}>
            Mission General Health
          </Chip>
          <Chip tone="neutral" icon={<Icon name="search" size={14} />}>
            Search departments
          </Chip>
          <Chip tone="ink" icon={<Icon name="plus" size={13} color={C.paper} />}>
            Add department
          </Chip>
        </At>

        <At x={40} y={120} w={250} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CAMPUSES.map((campus, i) => (
            <div key={campus.name} style={{ ...enter(t, 0.3 + i * 0.12), padding: "14px 16px", borderRadius: 16, background: i === 0 ? C.beige : "transparent", border: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{campus.name}</div>
              <Small style={{ marginTop: 3 }}>{campus.count}</Small>
            </div>
          ))}
          <div style={{ ...enter(t, 3), marginTop: 14 }}>
            <Inset>
              <Small>Pathway</Small>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>Cardiac workup</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {PATHWAY.map((i) => (
                  <Chip key={i} tone={step(i) > 0.5 ? "ink" : "paper"} size={0.9}>
                    {DEPARTMENTS[i].name}
                  </Chip>
                ))}
              </div>
            </Inset>
          </div>
        </At>

        <svg width={1104} height={640} style={{ position: "absolute", left: 0, top: 0 }}>
          {DEPARTMENTS.map((d, i) => {
            const p = ramp(t, 0.8 + i * 0.12, 0.7);
            return <line key={d.name} x1={HUB.x} y1={HUB.y} x2={HUB.x + (d.x + 70 - HUB.x) * p} y2={HUB.y + (d.y + 22 - HUB.y) * p} stroke={C.line2} strokeWidth={1.4} />;
          })}
          {PATHWAY.slice(1).map((to, k) => {
            const from = DEPARTMENTS[PATHWAY[k]];
            const dest = DEPARTMENTS[to];
            const p = glide(t, 3.2 + k * 0.75, 0.6);
            const x1 = from.x + 70;
            const y1 = from.y + 22;
            const x2 = dest.x + 70;
            const y2 = dest.y + 22;
            return <line key={to} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
          })}
        </svg>

        <At x={HUB.x - 34} y={HUB.y - 34} style={{ ...enter(t, 0.5) }}>
          <div style={{ width: 68, height: 68, borderRadius: 99, background: C.ink, color: C.paper, fontFamily: F.display, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${10 + 6 * pulse(t, 2.4, 0.3, 0.9)}px rgba(252, 207, 184, 0.35)` }}>D</div>
        </At>

        {DEPARTMENTS.map((d, i) => {
          const lit = PATHWAY.includes(i) ? step(i) : 0;
          return (
            <At key={d.name} x={d.x} y={d.y} style={enter(t, 1.1 + i * 0.12)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: 170, padding: "8px 12px", borderRadius: 14, boxSizing: "border-box", background: lit > 0.5 ? C.salmon : C.paper, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(40,25,16,0.06), 0 8px 24px rgba(40,25,16,0.06)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: lit > 0.5 ? "rgba(255,252,241,0.6)" : C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={d.icon} size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{d.detail}</div>
                </div>
              </div>
            </At>
          );
        })}
      </AppShell>
    </At>
  );
}

const PERMISSION_ROWS = [
  { name: "Primary Care", campus: "All campuses", mode: 0 },
  { name: "Cardiology", campus: "Main Campus", mode: 0 },
  { name: "Pediatric Surgery", campus: "Children's Pavilion", mode: 0, change: 1 },
  { name: "Imaging", campus: "East Campus", mode: 0 },
  { name: "Oncology Infusion", campus: "Main Campus", mode: 1, off: true },
  { name: "Behavioral Health", campus: "Main Campus", mode: 1 },
];

/** A single settings card: how agents may reach each department, changed live. */
function Permissions() {
  const t = useT();
  const slide = glide(t, 2, 0.45);
  const off = glide(t, 3.6, 0.3);
  const cx = keys(t, [0.6, 1.6, 2.6, 3.4], [1040, 830, 830, 958]);
  const cy = keys(t, [0.6, 1.6, 2.6, 3.4], [640, 337, 337, 457]);
  return (
    <>
      <At x={250} y={70} w={780}>
        <Card pad={28}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Title size={32}>Agent permissions</Title>
            <Chip tone="neutral" icon={<Icon name="building" size={14} />}>
              Mission General · 42 departments
            </Chip>
          </div>
          <Small style={{ marginTop: 8 }}>Choose what personal agents can book, request, or see in each department.</Small>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column" }}>
            {PERMISSION_ROWS.map((row, i) => {
              const mode = row.change ? row.mode + slide * row.change : row.mode;
              const accepting = row.off ? 1 - off : 1;
              return (
                <div key={row.name} style={{ ...enter(t, 0.3 + i * 0.1), display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: i ? `1px solid ${C.line}` : undefined, opacity: (enter(t, 0.3 + i * 0.1).opacity as number) * (0.55 + 0.45 * accepting) }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 600 }}>{row.name}</div>
                    <Small style={{ marginTop: 2 }}>{row.campus}</Small>
                  </div>
                  <Segmented options={["Bookable", "Request only", "Hidden"]} at={accepting < 0.5 ? 2 : mode} width={320} />
                  <Toggle progress={accepting} />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}>
            <LiveStrip p={ramp(t, 4.3, 0.4)} />
          </div>
        </Card>
      </At>
      <Cursor x={cx} y={cy} pressed={pulse(t, 1.9) + pulse(t, 3.5)} size={26} />
    </>
  );
}

const STEPS = [
  { title: "Referral to Cardiology", detail: "Lakeside Primary Care · Dr. Lin", at: 0.6 },
  { title: "Cardiology consult", detail: "Main Campus · Dr. Patel · Oct 28", at: 1.3 },
  { title: "Echocardiogram", detail: "Imaging, East Campus · Oct 30", at: 2.4 },
  { title: "Cardiac rehab, 12 sessions", detail: "Bayview Rehab · partner organization", at: 3.6 },
];

/** The app shell set into the corner: one patient's path across departments, campuses, and a partner. */
function Pathway() {
  const t = useT();
  return (
    <At x={290} y={120}>
      <AppShell active={3} width={1240} height={820}>
        <At x={44} y={40}>
          <Small>Patient pathway</Small>
          <PageTitle size={46}>Rosa Delgado</PageTitle>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Chip tone="neutral">64 yrs</Chip>
            <Chip tone="neutral">Harbor Mutual</Chip>
            <Chip tone="neutral">PCP · Dr. Lin</Chip>
          </div>
        </At>
        <At x={44} y={200} w={620} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS.map((step, i) => {
            const done = ramp(t, step.at + 0.35, 0.35);
            return (
              <div key={step.title} style={{ ...enter(t, step.at - 0.3), display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 18, background: i === 3 && done > 0.5 ? C.salmon : C.paper, border: `1px solid ${C.line}` }}>
                <CheckBox checked={done} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{step.title}</div>
                  <Small style={{ marginTop: 3 }}>{step.detail}</Small>
                </div>
                {i === 3 ? (
                  <Chip tone={done > 0.5 ? "paper" : "dashed"}>{done > 0.5 ? "Booked by Rosa's agent" : "Waiting"}</Chip>
                ) : (
                  <Chip tone="green">Done</Chip>
                )}
              </div>
            );
          })}
        </At>
        <At x={700} y={200} w={300} style={enter(t, 1.8)}>
          <Inset style={{ padding: 18 }}>
            <Small>Carried to the next step</Small>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {["Referral letter", "Consult notes", "Echo order", "Coverage · Harbor Mutual"].map((item, i) => (
                <Chip key={item} tone="paper" icon={<Icon name={i === 3 ? "shield" : "doc"} size={14} />} style={enter(t, 2 + i * 0.25, 0.4, 6)}>
                  {item}
                </Chip>
              ))}
            </div>
          </Inset>
        </At>
      </AppShell>
    </At>
  );
}

/** A single exchange: the patient's agent and the hospital's scheduling agent, passing the context along. */
function HospitalAgents() {
  const t = useT();
  return (
    <At x={190} y={80} w={900}>
      <Card pad={30} style={{ minHeight: 540 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <AgentBridge left={{ label: "R", name: "Rosa's agent", role: "Personal agent" }} right={{ label: "M", name: "Mission General", role: "Cardiology scheduling agent", tone: "ink" }} />
          <Chip tone="neutral" icon={<Icon name="link" size={13} />}>
            Agent to agent
          </Chip>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
          <AgentMessage
            t={t}
            at={0.5}
            from="Rosa's agent · 9:12 AM"
            text="Rosa's echo is done. Can Dr. Patel review it and book her follow-up before rehab starts?"
            chips={
              <>
                <Chip tone="paper" icon={<Icon name="doc" size={13} />}>Echo · Oct 30</Chip>
                <Chip tone="paper" icon={<Icon name="doc" size={13} />}>Referral · Dr. Lin</Chip>
              </>
            }
          />
          <Typing t={t} from={1.4} to={2.4} />
          <AgentMessage
            t={t}
            at={2.4}
            dark
            from="Mission General · Cardiology scheduling agent · 9:12 AM"
            text="Dr. Patel reviewed the echo. Follow-up is Thu, Nov 5 at 10:40 AM on Main Campus. Rehab at Bayview starts Nov 9."
            chips={
              <>
                <Chip tone="outline" style={{ color: C.paper, borderColor: "rgba(255,252,241,0.25)" }} icon={<Icon name="calendar" size={13} color={C.paper} />}>Thu, Nov 5 · 10:40 AM</Chip>
                <Chip tone="outline" style={{ color: C.paper, borderColor: "rgba(255,252,241,0.25)" }} icon={<Icon name="mapPin" size={13} color={C.paper} />}>Bayview Rehab · Nov 9</Chip>
              </>
            }
          />
          <div style={{ ...enter(t, 3.6), alignSelf: "flex-end" }}>
            <Chip tone="green" icon={<Icon name="check" size={13} color={C.liveText} />}>Shared with Bayview Rehab</Chip>
          </div>
        </div>
      </Card>
    </At>
  );
}

export const HOSPITAL_SCENES = {
  "hospital-network": { loop: 7.5, still: 6, focus: [0.55, 0.5], render: () => <NetworkMap /> },
  "hospital-permissions": { loop: 6.5, still: 5.2, focus: [0.62, 0.45], render: () => <Permissions /> },
  "hospital-pathway": { loop: 6.5, still: 5, focus: [0.45, 0.55], render: () => <Pathway /> },
  "hospital-agents": { loop: 6.5, still: 5, focus: [0.5, 0.5], render: () => <HospitalAgents /> },
} satisfies Record<string, SceneSpec>;
