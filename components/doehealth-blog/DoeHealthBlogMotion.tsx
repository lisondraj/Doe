"use client";

import { type ComponentType, type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotField } from "@/components/doehealth-blog/DoeHealthBlogDotField";
import { articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import type { DoeHealthBlogDots, DoeHealthBlogMotionScene, DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";
import { p22Mackinac } from "@/lib/home/fonts";

/**
 * Drawn figures for articles about plans rather than screens: no product shell, no brown frame. Each one is the
 * article's flat beige box with its own dot design behind it, and cream cards on top that build in step by step,
 * hold, and start again. A figure only runs while it is on screen; with reduced motion it shows its finished state.
 */

type SceneSpec = { steps: number; ms: number; hold: number; dots: DoeHealthBlogDots; tone: DoeHealthBlogPlaceholderTone };

const SCENES: Record<DoeHealthBlogMotionScene, SceneSpec> = {
  roadmap: { steps: 11, ms: 700, hold: 3200, dots: "wave", tone: "cream" },
  index: { steps: 8, ms: 1100, hold: 3200, dots: "curtain", tone: "sand" },
  auth: { steps: 5, ms: 1500, hold: 3000, dots: "rings", tone: "panel" },
  integrations: { steps: 5, ms: 1500, hold: 3200, dots: "tide", tone: "clay" },
  phi: { steps: 6, ms: 1400, hold: 3200, dots: "halftone", tone: "cream" },
  watch: { steps: 6, ms: 1100, hold: 3000, dots: "sphere", tone: "umber" },
};

const vars = (v: Record<string, string | number>) => v as CSSProperties;
const on = (cond: boolean) => (cond ? " is-on" : "");

/** Counts 0 → steps while the box is on screen, holds on the last step, then starts over. */
function useSteps(ref: React.RefObject<HTMLElement | null>, { steps, ms, hold }: SceneSpec) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(steps);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, steps]);

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => setStep((s) => (s >= steps ? 0 : s + 1)), step >= steps ? hold : step === 0 ? 450 : ms);
    return () => window.clearTimeout(timer);
  }, [visible, step, steps, ms, hold]);

  return step;
}

function Stage({ scene, label, children }: { scene: DoeHealthBlogMotionScene; label: string; children: (step: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const spec = SCENES[scene];
  const step = useSteps(ref, spec);
  const { bg, dot } = articleBoxColors(spec.tone);
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`doe-motion doe-motion--${scene}${step === 0 ? " is-reset" : ""}`}
      data-step={step}
      style={{ background: bg }}
    >
      <div className="doe-motion__dots" aria-hidden>
        <DoeHealthBlogDotField dots={spec.dots} color={dot} />
      </div>
      <div className="doe-motion__stage" aria-hidden>
        {children(step)}
      </div>
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className="doe-motion__kicker">{children}</p>;
}

function Title({ children }: { children: ReactNode }) {
  return <p className={`doe-motion__title ${p22Mackinac.className}`}>{children}</p>;
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="doe-motion__check" aria-hidden>
      <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="doe-motion__lock" aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="1.8" fill="currentColor" />
      <path d={open ? "M5.3 7V5.2a2.7 2.7 0 0 1 5.3-.8" : "M5.3 7V5.2a2.7 2.7 0 0 1 5.4 0V7"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------- roadmap */

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;

type Bar = { label: string; short?: string; from: number; to: number; kind?: "dark" | "soft" | "salmon" | "dotted" };
type Lane = { name: string; bars: readonly Bar[]; marks?: readonly { at: number; label: string; short?: string }[] };

const LANES: readonly Lane[] = [
  {
    name: "Product",
    bars: [
      { label: "The Index", short: "Index", from: 0, to: 2, kind: "dark" },
      { label: "Doe Auth", short: "Auth", from: 2, to: 4, kind: "dark" },
      { label: "Pilots on synthetic patients", short: "Pilots", from: 4, to: 8, kind: "soft" },
      { label: "PHI via agents", short: "PHI", from: 8, to: 11, kind: "salmon" },
    ],
  },
  {
    name: "Integrations",
    bars: [
      { label: "Sandbox · questions and offers live", short: "Sandbox", from: 2, to: 8, kind: "soft" },
      { label: "Live where cleared", short: "Live", from: 8, to: 11, kind: "salmon" },
    ],
  },
  {
    name: "PHIPA and HIPAA",
    bars: [{ label: "Programs: assessments, agreements, BAAs", short: "Assessments and agreements", from: 2, to: 11, kind: "dark" }],
    marks: [
      { at: 5, label: "PIA · TRA", short: "PIA" },
      { at: 6.5, label: "Pen test", short: "Test" },
      { at: 8, label: "Gate", short: "Gate" },
    ],
  },
  { name: "SOC 2", bars: [{ label: "Readiness → Type I", short: "Type I", from: 8, to: 11, kind: "dark" }] },
  { name: "Sandbox evals", bars: [{ label: "Every model, prompt, tool, permission", from: 0, to: 11, kind: "dotted" }] },
  { name: "Per-clinic metrics", bars: [{ label: "Readiness · demand · trust · safety", from: 0, to: 11, kind: "dotted" }] },
];

function Roadmap() {
  return (
    <Stage scene="roadmap" label="Roadmap from November 2026 to September 2027">
      {(step) => (
        <div className="doe-motion-roadmap" style={vars({ "--now": step / MONTHS.length })}>
          <div className="doe-motion-roadmap__head">
            <Kicker>Nov 2026 → Q3 2027</Kicker>
            <Title>The plan on one rail</Title>
          </div>
          <div className="doe-motion-roadmap__grid">
            <div className="doe-motion-roadmap__months">
              {MONTHS.map((m, i) => (
                <span key={m} className={on(step > i)}>
                  <span className="doe-motion-roadmap__m-long">{m}</span>
                  <span className="doe-motion-roadmap__m-short">{m[0]}</span>
                  {i === 0 ? <em>’26</em> : i === 2 ? <em>’27</em> : null}
                </span>
              ))}
              <span className="doe-motion-roadmap__q3">Q3</span>
            </div>
            {LANES.map((lane) => (
              <div key={lane.name} className={`doe-motion-roadmap__lane${lane.marks ? " has-marks" : ""}`}>
                <span className="doe-motion-roadmap__lane-name">{lane.name}</span>
                <div className="doe-motion-roadmap__track">
                  {lane.bars.map((bar) => {
                    const reveal = Math.min(1, Math.max(0, (step - bar.from) / (bar.to - bar.from)));
                    return (
                      <span
                        key={bar.label}
                        className={`doe-motion-roadmap__bar is-${bar.kind ?? "dark"}${on(reveal >= 1)}`}
                        style={vars({ "--from": bar.from, "--span": bar.to - bar.from, "--reveal": reveal })}
                      >
                        <span>
                          <span className="doe-motion-roadmap__m-long">{bar.label}</span>
                          <span className="doe-motion-roadmap__m-short">{bar.short ?? bar.label}</span>
                        </span>
                      </span>
                    );
                  })}
                  {lane.marks?.map((mark) => (
                    <span key={mark.label} className={`doe-motion-roadmap__mark${on(step >= mark.at)}`} style={vars({ "--at": mark.at })}>
                      <i />
                      <span className="doe-motion-roadmap__m-long">{mark.label}</span>
                      <span className="doe-motion-roadmap__m-short">{mark.short ?? mark.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <span className="doe-motion-roadmap__now" aria-hidden />
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------ index */

const FIELDS = [
  { label: "Services", value: "IUD insertion · Pap test · Travel vaccines", code: ['services: ["iud-insertion", "pap-test",', '  "travel-vaccines"]'] },
  { label: "Providers", value: "Dr. Amara Osei, family medicine · accepting", code: ['provider: { name: "Dr. Amara Osei",', "  accepting: true }"] },
  { label: "Coverage", value: "OHIP · Sun Life · Manulife", code: ['coverage: ["OHIP", "Sun Life", "Manulife"]'] },
  { label: "Self-pay", value: "Travel consult · $85", code: ['price: { "travel-consult": 85, cad: true }'] },
  { label: "Offers", value: "Flu clinic, Saturday walk-ins", code: ['offer: { "flu-clinic": "sat-walk-in" }'] },
] as const;

function IndexScene() {
  return (
    <Stage scene="index" label="An administrator fills in a clinic page that becomes agent-readable data">
      {(step) => (
        <div className="doe-motion-index">
          <div className="doe-motion-card doe-motion-index__form">
            <div className="doe-motion-index__form-head">
              <Kicker>Clinic page · editing</Kicker>
              <Title>Queen West Family Health</Title>
              <span className={`doe-motion-chip is-dark${on(step >= 1)}`}>
                <Check /> Claim verified · registry and callback
              </span>
            </div>
            <ul className="doe-motion-index__fields">
              {FIELDS.map((field, i) => (
                <li key={field.label} className={on(step >= i + 2) + (step === i + 2 ? " is-typing" : "")}>
                  <span>{field.label}</span>
                  <strong>
                    <span className="doe-motion-index__type">{field.value}</span>
                  </strong>
                </li>
              ))}
            </ul>
          </div>
          <div className={`doe-motion-index__pipe${on(step >= 2)}`} aria-hidden>
            <i />
          </div>
          <div className="doe-motion-card doe-motion-card--ink doe-motion-index__out">
            <Kicker>doe.care/queen-west-family-health · agent view</Kicker>
            <pre className="doe-motion-index__code">
              {FIELDS.map((field, i) => (
                <span key={field.label} className={on(step >= i + 2)}>
                  {field.code.join("\n")}
                  {"\n"}
                </span>
              ))}
            </pre>
            <div className="doe-motion-index__chips">
              <span className={`doe-motion-chip is-salmon${on(step >= 7)}`}>No PHI</span>
              <span className={`doe-motion-chip is-salmon${on(step >= 7)}`}>No integrations</span>
              <span className={`doe-motion-chip is-salmon${on(step >= 8)}`}>Site + agents, one record</span>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------- auth */

const AUTH_STEPS = [
  { lead: "Agent asks", text: "Book a travel consult for Maya" },
  { lead: "Maya approves", text: "Passkey on her own phone" },
  { lead: "Grant signed", text: "One clinic, one purpose, 7 days" },
  { lead: "Policy checked", text: "Travel consult · agents allowed" },
  { lead: "Arrives verified", text: "No password ever shared" },
] as const;

/** Where the request is along the line at each step, as a fraction from the agent to the clinic. */
const PACKET = [0, 0.5, 0.5, 0.5, 0.78, 1];

function AuthScene() {
  return (
    <Stage scene="auth" label="Doe Auth verifies an agent acting for a patient">
      {(step) => (
        <div className="doe-motion-auth">
          <div className="doe-motion-auth__line" style={vars({ "--p": PACKET[step] ?? 1 })}>
            <span className={`doe-motion-auth__node${on(step >= 1)}`}>
              <i>M</i>
              <span>Maya’s agent</span>
            </span>
            <span className={`doe-motion-auth__node is-doe${on(step >= 2)}`}>
              <i className={p22Mackinac.className}>Doe</i>
              <span>Doe Auth</span>
            </span>
            <span className={`doe-motion-auth__node${on(step >= 5)}`}>
              <i>Q</i>
              <span>Queen West</span>
            </span>
            <span className="doe-motion-auth__rail" aria-hidden>
              <b />
            </span>
            <span className={`doe-motion-auth__packet${step === 0 || step >= 5 ? " is-hidden" : ""}`} aria-hidden />
            <span className={`doe-motion-auth__phone${on(step === 2)}`}>
              <Lock /> Approve with Face ID?
            </span>
          </div>
          <div className="doe-motion-auth__body">
            <ol className="doe-motion-auth__steps">
              {AUTH_STEPS.map((s, i) => (
                <li key={s.lead} className={on(step >= i + 1) + (step === i + 1 ? " is-now" : "")}>
                  <span className="doe-motion-auth__num">{step > i + 1 ? <Check /> : i + 1}</span>
                  <span>
                    <strong>{s.lead}</strong> {s.text}
                  </span>
                </li>
              ))}
            </ol>
            <div className={`doe-motion-card doe-motion-auth__grant${on(step >= 3)}`}>
              <Kicker>Grant · signed by Doe Auth</Kicker>
              <dl>
                <div>
                  <dt>For</dt>
                  <dd>Verified person, passkey</dd>
                </div>
                <div>
                  <dt>Agent</dt>
                  <dd>Key-bound, not copyable</dd>
                </div>
                <div>
                  <dt>Clinic</dt>
                  <dd>Queen West only</dd>
                </div>
                <div>
                  <dt>Purpose</dt>
                  <dd>Book a visit</dd>
                </div>
                <div>
                  <dt>Expires</dt>
                  <dd>7 days · revocable</dd>
                </div>
              </dl>
              <span className={`doe-motion-chip is-dark${on(step >= 5)}`}>
                <Check /> Verified by Doe Auth
              </span>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ----------------------------------------------------------- integrations */

const INTEGRATIONS = [
  { name: "Ask questions", tier: "Public", phi: false },
  { name: "Offers & pricing", tier: "Public", phi: false },
  { name: "Book visits", tier: "PHI", phi: true },
  { name: "Send documents", tier: "PHI", phi: true },
  { name: "Verify insurance", tier: "PHI", phi: true },
] as const;

const STAGES = ["Sandbox", "Pilot", "Live"] as const;
const PERIODS = ["Jan ’27", "Jan ’27", "Mar ’27", "May ’27", "Jun ’27", "Jul ’27"];

function IntegrationsScene() {
  return (
    <Stage scene="integrations" label="Five integrations moving from sandbox to pilot to live">
      {(step) => {
        const gateOpen = step >= 5;
        return (
          <div className="doe-motion-int">
            <div className="doe-motion-int__head">
              <div>
                <Kicker>Integrations</Kicker>
                <Title>Sandbox, then pilot, then live</Title>
              </div>
              <span className="doe-motion-int__period">{PERIODS[step]}</span>
            </div>
            <div className="doe-motion-card doe-motion-int__table">
              <div className="doe-motion-int__row doe-motion-int__row--head">
                <span />
                {STAGES.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              {INTEGRATIONS.map((row) => {
                const stage = step === 0 ? -1 : step === 1 ? 0 : step === 2 ? 1 : row.phi ? (gateOpen ? 2 : 1) : 2;
                return (
                  <div key={row.name} className={`doe-motion-int__row${row.phi ? " is-phi" : ""}`} style={vars({ "--stage": Math.max(0, stage) })}>
                    <span className="doe-motion-int__name">
                      {row.name}
                      <em className={row.phi ? "is-phi" : ""}>{row.tier}</em>
                    </span>
                    <span className="doe-motion-int__track">
                      <b className={stage >= 0 ? "is-on" : ""} />
                      {row.phi ? (
                        <span className={`doe-motion-int__gate${on(step >= 3)}${gateOpen ? " is-open" : ""}`}>
                          <Lock open={gateOpen} />
                          <span>{gateOpen ? "Cleared" : "Q3 gate"}</span>
                        </span>
                      ) : null}
                      <i className={`${stage >= 0 ? "is-on" : ""}${stage === 2 ? " is-live" : ""}`} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Stage>
  );
}

/* -------------------------------------------------------------------- phi */

const CHART = [
  { f: "Name", need: true },
  { f: "Diagnoses", need: false },
  { f: "Date of birth", need: true },
  { f: "Medications", need: false },
  { f: "Allergies", need: false },
  { f: "Phone", need: true },
  { f: "Lab results", need: false },
  { f: "Visit notes", need: false },
  { f: "Health card or member ID", need: true },
  { f: "Imaging", need: false },
  { f: "Family history", need: false },
  { f: "Visit type", need: true },
  { f: "Address", need: false },
  { f: "Preferred time", need: true },
  { f: "Past referrals", need: false },
  { f: "Billing history", need: false },
] as const;

const LEDGER = ["Who asked", "For whom", "Grant", "Clinic policy", "Model", "Data touched", "Result"] as const;

function PhiScene() {
  return (
    <Stage scene="phi" label="A booking takes six fields of a chart, encrypted and recorded">
      {(step) => (
        <div className="doe-motion-phi">
          <div className="doe-motion-card doe-motion-phi__chart">
            <Kicker>The chart · stays with the clinic</Kicker>
            <ul>
              {CHART.map((c) => (
                <li key={c.f} className={c.need ? `is-need${on(step >= 2)}` : `is-rest${on(step >= 2)}`}>
                  {c.f}
                </li>
              ))}
            </ul>
            <span className={`doe-motion-chip is-dark${on(step >= 1)}`}>
              <Check /> Grant: book a visit
            </span>
          </div>
          <div className={`doe-motion-phi__arrow${on(step >= 3)}`} aria-hidden>
            <span className={p22Mackinac.className}>6</span>
            <i />
          </div>
          <div className="doe-motion-phi__right">
            <div className={`doe-motion-card doe-motion-card--ink doe-motion-phi__req${on(step >= 3)}${step >= 6 ? " is-released" : ""}`}>
              <Kicker>Booking request</Kicker>
              <ul>
                {CHART.filter((c) => c.need).map((c) => (
                  <li key={c.f}>{c.f}</li>
                ))}
              </ul>
              <span className={`doe-motion-chip is-salmon${on(step >= 4)}`}>
                <Lock /> Clinic’s own key
              </span>
              <span className="doe-motion-phi__released">Released after the action</span>
            </div>
            <div className={`doe-motion-card doe-motion-phi__ledger${on(step >= 5)}`}>
              <Kicker>Doe Ledger · append-only</Kicker>
              <ul>
                {LEDGER.map((l, i) => (
                  <li key={l} style={vars({ "--i": i })}>
                    <Check /> {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------ watch */

const ATTACKS = [
  "Prompt injection",
  "Injected pages",
  "Malicious documents",
  "Tool hijacking",
  "Privilege escalation",
  "PHI exfiltration",
  "Identity spoofing",
  "Invented consent",
] as const;
const RELEASES = ["r41", "r42", "r43", "r44", "r45", "r46"] as const;
/** The one cell that fails: malicious documents on r44, fixed on r45. */
const FAIL = { row: 2, col: 3 };

const METRICS = [
  { label: "Page complete", value: 96, unit: "%" },
  { label: "Questions answered", value: 412, unit: "" },
  { label: "Verified requests", value: 38, unit: "" },
  { label: "Eval pass rate", value: 100, unit: "%" },
] as const;
const BARS = [3, 4, 4, 6, 5, 7, 8, 7, 9, 10, 9, 12];

function WatchScene() {
  return (
    <Stage scene="watch" label="Sandbox evals across releases, and one clinic's metrics">
      {(step) => {
        const suspended = step === FAIL.col + 1;
        const k = step / RELEASES.length;
        return (
          <div className="doe-motion-watch">
            <div className="doe-motion-card doe-motion-watch__evals">
              <div className="doe-motion-watch__head">
                <Kicker>Sandbox · synthetic patients</Kicker>
                <span className="doe-motion-watch__status">
                  <span className={`doe-motion-chip is-salmon${on(suspended)}`}>Send documents suspended</span>
                  <span className={`doe-motion-chip is-dark${on(step > FAIL.col + 1)}`}>
                    <Check /> Restored on r45
                  </span>
                </span>
              </div>
              <div className="doe-motion-watch__matrix" style={vars({ "--cols": RELEASES.length })}>
                <span />
                {RELEASES.map((r, c) => (
                  <span key={r} className={`doe-motion-watch__rel${on(step > c)}`}>
                    {r}
                  </span>
                ))}
                {ATTACKS.map((a, row) => (
                  <div key={a} className="doe-motion-watch__mrow">
                    <span className="doe-motion-watch__attack">{a}</span>
                    {RELEASES.map((r, c) => {
                      const fail = row === FAIL.row && c === FAIL.col;
                      return (
                        <i
                          key={r}
                          className={`${step > c ? "is-on" : ""}${fail ? " is-fail" : ""}`}
                          style={vars({ "--d": `${row * 45}ms` })}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="doe-motion-card doe-motion-watch__clinic">
              <Kicker>One clinic · counts only, no patient content</Kicker>
              <Title>Queen West Family Health</Title>
              <dl>
                {METRICS.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd className={p22Mackinac.className}>
                      {Math.round(m.value * (m.unit === "%" ? Math.max(0.6, k) : k))}
                      {m.unit}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="doe-motion-watch__spark" aria-hidden>
                {BARS.map((b, i) => (
                  <i key={i} style={vars({ "--h": (b / 12) * Math.min(1, k * 1.15), "--d": `${i * 40}ms` })} />
                ))}
              </div>
              <span className="doe-motion-watch__spark-label">Agent requests, last 12 weeks</span>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}

const FIGURES: Record<DoeHealthBlogMotionScene, ComponentType> = {
  roadmap: Roadmap,
  index: IndexScene,
  auth: AuthScene,
  integrations: IntegrationsScene,
  phi: PhiScene,
  watch: WatchScene,
};

export function DoeHealthBlogMotion({ scene }: { scene: DoeHealthBlogMotionScene }) {
  const Figure = FIGURES[scene];
  return <Figure />;
}
