"use client";

import {
  AgentBridge,
  AgentMessage,
  AppShell,
  At,
  Avatar,
  Button,
  C,
  Card,
  CheckBox,
  Chip,
  F,
  Icon,
  Inset,
  LiveStrip,
  PageTitle,
  type SceneSpec,
  Small,
  StatusDot,
  Title,
  Toggle,
  Typing,
  enter,
  glide,
  pulse,
  ramp,
  useT,
} from "@/components/doehealth-blog/scenes/kit";

const DIFFERENT = [
  { lead: "Same-day access", text: "Text or call your physician directly" },
  { lead: "Unhurried visits", text: "60 minutes, never rushed" },
  { lead: "A panel of 300", text: "Your doctor knows your history" },
  { lead: "Home and virtual", text: "Visits wherever you are" },
];

const FOR_WHOM = ["Executives", "Frequent travelers", "Young families", "Chronic conditions", "65 and over"];

/** Whole product page: the practice profile agents read to explain the model of care. */
function Profile() {
  const t = useT();
  return (
    <At x={50} y={28}>
      <AppShell active={3} width={1180} height={664}>
        <At x={40} y={34}>
          <Small>Practice profile</Small>
          <PageTitle size={46}>Hearth Concierge Medicine</PageTitle>
        </At>
        <At x={880} y={52}>
          <Button tone="outline" height={40} icon={<Icon name="eye" size={15} />}>
            Preview as agent
          </Button>
        </At>
        <At x={40} y={140} w={560}>
          <Card pad={24} style={{ boxShadow: "0 1px 2px rgba(40,25,16,0.06), 0 8px 24px rgba(40,25,16,0.05)" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>What sets us apart</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
              {DIFFERENT.map((item, i) => (
                <div key={item.lead} style={{ ...enter(t, 0.5 + i * 0.3), display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderTop: i ? `1px solid ${C.line}` : undefined }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={(["phone", "clock", "user", "building"] as const)[i]} size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15.5, fontWeight: 600 }}>{item.lead}</div>
                    <Small style={{ marginTop: 2 }}>{item.text}</Small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </At>
        <At x={630} y={140} w={430} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Inset style={{ padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Who we care for</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {FOR_WHOM.map((who, i) => (
                <Chip key={who} tone={ramp(t, 1.8 + i * 0.25, 0.2) > 0.5 && i !== 2 ? "ink" : "paper"}>
                  {who}
                </Chip>
              ))}
            </div>
          </Inset>
          <Inset style={{ padding: 20, ...enter(t, 2.6) }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Physicians</div>
            {[
              { label: "AO", name: "Dr. Amara Okafor", role: "Internal medicine · 18 years" },
              { label: "BH", name: "Dr. Ben Hollis", role: "Family medicine · 11 years" },
            ].map((doc) => (
              <div key={doc.name} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                <Avatar label={doc.label} size={38} tone="paper" />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{doc.name}</div>
                  <Small>{doc.role}</Small>
                </div>
              </div>
            ))}
          </Inset>
        </At>
        <At x={40} y={520}>
          <LiveStrip p={ramp(t, 3.6, 0.4)} label="Profile is live for agents" />
        </At>
      </AppShell>
    </At>
  );
}

const INCLUDED = ["Annual physical with full labs", "Same-day or next-day visits", "Text and call your physician", "Home visits within 10 miles", "Coordination with your specialists"];

/** A single card: one membership, written so an agent can explain exactly what it covers. */
function Membership() {
  const t = useT();
  return (
    <>
      <At x={270} y={130} w={560}>
        <Card pad={30}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title size={30}>Hearth Membership</Title>
            <Chip tone="green">Accepting members</Chip>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
            <div style={{ fontFamily: F.display, fontSize: 52, lineHeight: 1 }}>$225</div>
            <Small>per month, or $2,400 a year</Small>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
            {INCLUDED.map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16 }}>
                <CheckBox checked={ramp(t, 0.6 + i * 0.35, 0.3)} />
                {item}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <Small>Not included</Small>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, ...enter(t, 2.6, 0.4, 6) }}>
              <Chip tone="dashed">Hospital stays</Chip>
              <Chip tone="dashed">Imaging</Chip>
              <Chip tone="dashed">Specialist fees</Chip>
            </div>
          </div>
        </Card>
      </At>
      <At x={790} y={400} w={300} style={enter(t, 3.2, 0.5, 18)}>
        <Card pad={22}>
          <Small>Add-on</Small>
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>Family members</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 10 }}>
            <div style={{ fontFamily: F.display, fontSize: 30 }}>$95</div>
            <Small>per child, per month</Small>
          </div>
        </Card>
      </At>
    </>
  );
}

const MEMBERS = [
  { label: "DR", name: "Daniel Reyes", since: "Member since March", perms: ["Book visits", "Request refills", "Message Dr. Okafor"] },
  { label: "LW", name: "Linda Wu", since: "Member since 2025", perms: ["Book visits", "See lab results"] },
  { label: "TB", name: "Tom Becker", since: "Member since June", perms: ["Book visits", "Request refills"] },
];

/** The connected-agents page, set into the corner: members' agents with the access each one has. */
function Connected() {
  const t = useT();
  const approved = ramp(t, 3.1, 0.3);
  return (
    <At x={250} y={100}>
      <AppShell active={4} width={1320} height={880}>
        <At x={40} y={34}>
          <PageTitle size={46}>Connected agents</PageTitle>
          <Small style={{ marginTop: 8 }}>Members whose personal agents can reach the practice</Small>
        </At>
        <At x={40} y={140} w={620} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...MEMBERS, null].map((m, i) => {
            if (!m) {
              return (
                <div key="new" style={{ ...enter(t, 1.6, 0.5), display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: approved > 0.5 ? C.paper : C.salmon, border: `1px solid ${C.line}` }}>
                  <Avatar label="PS" size={40} tone={approved > 0.5 ? "sand" : "paper"} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>Priya Shah</div>
                    <Small style={{ marginTop: 2 }}>Joined today · asking to connect her agent</Small>
                  </div>
                  {approved > 0.5 ? (
                    <Chip tone="green" icon={<StatusDot />}>Connected</Chip>
                  ) : (
                    <Button height={36} style={{ transform: `scale(${1 - 0.06 * pulse(t, 2.9)})` }}>Approve</Button>
                  )}
                </div>
              );
            }
            return (
              <div key={m.name} style={{ ...enter(t, 0.3 + i * 0.15), display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: i === 0 ? C.beige : C.paper, border: `1px solid ${C.line}` }}>
                <Avatar label={m.label} size={40} tone="sand" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {m.perms.map((p) => (
                      <Chip key={p} tone="paper" size={0.85}>{p}</Chip>
                    ))}
                  </div>
                </div>
                <Chip tone="green" icon={<StatusDot />}>Connected</Chip>
              </div>
            );
          })}
        </At>
        <At x={690} y={140} w={290} style={enter(t, 0.9)}>
          <Card pad={20} style={{ boxShadow: "0 1px 2px rgba(40,25,16,0.06), 0 8px 24px rgba(40,25,16,0.05)" }}>
            <Small>Daniel’s agent can</Small>
            {[
              ["Book visits", 1],
              ["Request refills", 1],
              ["Message Dr. Okafor", 1],
              ["See lab results", 1 - glide(t, 2.2, 0.3)],
            ].map(([label, on]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${C.line}`, marginTop: 4, fontSize: 15 }}>
                {label}
                <Toggle progress={on as number} />
              </div>
            ))}
          </Card>
        </At>
      </AppShell>
    </At>
  );
}

/** A single exchange: a member's agent and the practice, after the membership is in place. */
function ConciergeAgents() {
  const t = useT();
  return (
    <At x={190} y={80} w={900}>
      <Card pad={30} style={{ minHeight: 540 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <AgentBridge left={{ label: "D", name: "Daniel's agent", role: "Personal agent" }} right={{ label: "H", name: "Hearth Concierge", role: "Practice agent", tone: "ink" }} />
          <Chip tone="neutral" icon={<Icon name="lock" size={13} />}>
            Member
          </Chip>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
          <AgentMessage
            t={t}
            at={0.5}
            from="Daniel's agent · 6:48 PM"
            text="Daniel flies to Lima on Friday. He needs his travel vaccines and a lisinopril refill before he goes."
            chips={
              <>
                <Chip tone="paper" icon={<Icon name="calendar" size={13} />}>Flight · Fri, Nov 13</Chip>
                <Chip tone="paper" icon={<Icon name="pill" size={13} />}>Lisinopril 10 mg</Chip>
              </>
            }
          />
          <Typing t={t} from={1.4} to={2.4} />
          <AgentMessage
            t={t}
            at={2.4}
            dark
            from="Hearth Concierge · Practice agent · 6:49 PM"
            text="Dr. Okafor can come to Daniel's home Wednesday at 7:30 AM for typhoid and hepatitis A. The refill is at Walgreens on Fillmore."
            chips={
              <>
                <Chip tone="outline" style={{ color: C.paper, borderColor: "rgba(255,252,241,0.25)" }} icon={<Icon name="calendar" size={13} color={C.paper} />}>Wed, Nov 11 · 7:30 AM</Chip>
                <Chip tone="outline" style={{ color: C.paper, borderColor: "rgba(255,252,241,0.25)" }} icon={<Icon name="check" size={13} color={C.paper} />}>Refill sent</Chip>
              </>
            }
          />
          <div style={{ ...enter(t, 3.6), alignSelf: "flex-end" }}>
            <Chip tone="green" icon={<Icon name="check" size={13} color={C.liveText} />}>Added to Daniel’s calendar</Chip>
          </div>
        </div>
      </Card>
    </At>
  );
}

export const CONCIERGE_SCENES = {
  "concierge-profile": { loop: 6.5, still: 5, focus: [0.4, 0.5], render: () => <Profile /> },
  "concierge-membership": { loop: 6, still: 4.6, focus: [0.45, 0.5], render: () => <Membership /> },
  "concierge-connected": { loop: 6, still: 4.4, focus: [0.48, 0.5], render: () => <Connected /> },
  "concierge-agents": { loop: 6.5, still: 5, focus: [0.5, 0.5], render: () => <ConciergeAgents /> },
} satisfies Record<string, SceneSpec>;
