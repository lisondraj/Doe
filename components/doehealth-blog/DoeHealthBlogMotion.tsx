"use client";

import { type ComponentType, type CSSProperties, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotField } from "@/components/doehealth-blog/DoeHealthBlogDotField";
import type { DoeHealthBlogDots, DoeHealthBlogMotionScene } from "@/lib/doehealth/doehealth-blog-articles";
import { p22Mackinac } from "@/lib/home/fonts";

import "@/lib/doehealth/doehealth-blog-motion.css";

/**
 * Animated diagrams drawn for an article itself, not the product shell: flat beige boxes, the Doe dot fields behind,
 * P22 titles, cream cards and the salmon accent. Each scene steps through its states while it is on screen, and holds
 * its last state for reduced motion.
 */

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Steps 0…count-1 every `ms` while the box is on screen; pinned to the last step for reduced motion. */
function useLiveStep(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(count - 1);
      return;
    }
    const seen = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.35 });
    seen.observe(el);
    return () => seen.disconnect();
  }, [count]);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [live, count, ms]);

  return { ref, step, live };
}

function Shell({
  scene,
  dots,
  bg,
  dot,
  live,
  innerRef,
  children,
}: {
  scene: DoeHealthBlogMotionScene;
  dots: DoeHealthBlogDots;
  bg: string;
  dot: string;
  live: boolean;
  innerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div ref={innerRef} className={`dbm dbm--${scene}`} data-live={live ? "true" : "false"} style={{ background: bg }}>
      <div className="dbm__dots">
        <DoeHealthBlogDotField dots={dots} color={dot} />
      </div>
      <div className="dbm__stage">{children}</div>
    </div>
  );
}

/* ─── 1. Layers: public → identity → actions → PHI ───────────────────────── */

const LAYERS = [
  { when: "Nov–Dec ’26", title: "Public clinic pages", sub: "The Index", data: "No PHI" },
  { when: "Jan–Feb ’27", title: "A verified patient", sub: "Doe Auth", data: "Identity and a grant" },
  { when: "Mar–Jun ’27", title: "Actions in the sandbox", sub: "Integrations", data: "Synthetic patients" },
  { when: "Q3 ’27", title: "PHI through personal agents", sub: "Gate cleared", data: "PHIPA · HIPAA" },
] as const;

function LayersScene() {
  const { ref, step, live } = useLiveStep(LAYERS.length + 2, 1700);
  const built = Math.min(step, LAYERS.length);
  return (
    <Shell scene="layers" dots="rings" bg="#FBF4E2" dot="#D9BC8A" live={live} innerRef={ref}>
      <ol className="dbm-layers">
        {LAYERS.map((layer, i) => {
          const state = i < built ? (i === built - 1 ? "current" : "built") : "next";
          return (
            <li key={layer.title} className="dbm-layers__row" data-state={state} style={vars({ "--i": i })}>
              <span className="dbm-layers__when">{layer.when}</span>
              <div className="dbm-layers__bar">
                <div className="dbm-layers__text">
                  <span className="dbm-layers__sub">{layer.sub}</span>
                  <span className={`dbm-layers__title ${p22Mackinac.className}`}>{layer.title}</span>
                </div>
                <span className="dbm-chip">{layer.data}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}

/* ─── 2. Profile: what staff enter, what agents read ─────────────────────── */

const FIELDS = [
  { label: "Services", value: "Cleanings · Implants · Clear aligners", read: 'services: ["cleaning", "implant", "aligners"]' },
  { label: "Providers", value: "Dr. A. Mensah · Dr. L. Okafor", read: 'providers: [{ name, role: "DDS", verified }]' },
  { label: "Hours", value: "Mon–Fri 8–6 · Sat 9–2", read: 'hours: { mon_fri: "08–18", sat: "09–14" }' },
  { label: "Insurance", value: "Sun Life · Manulife · Canada Life", read: "insurance: [3 plans accepted]" },
  { label: "Pricing", value: "New-patient exam, $95", read: 'price: { exam_new: 95, currency: "CAD" }' },
] as const;

function ProfileScene() {
  const { ref, step, live } = useLiveStep(FIELDS.length + 3, 1300);
  const filled = Math.min(step, FIELDS.length);
  const done = step > FIELDS.length;
  return (
    <Shell scene="profile" dots="wave" bg="#FAF1DD" dot="#D4AE7A" live={live} innerRef={ref}>
      <div className="dbm-profile">
        <div className="dbm-card dbm-profile__edit">
          <p className="dbm-card__eyebrow">Clinic page · edited by the front desk</p>
          <p className={`dbm-card__title ${p22Mackinac.className}`}>Harbourview Dental</p>
          <dl>
            {FIELDS.map((field, i) => (
              <div key={field.label} className="dbm-profile__field" data-on={i < filled ? "" : undefined} data-typing={i === filled - 1 && !done ? "" : undefined}>
                <dt>{field.label}</dt>
                <dd>
                  <span>{field.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="dbm-profile__pipe" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="dbm-card dbm-card--dark dbm-profile__read">
          <p className="dbm-card__eyebrow">What agents read</p>
          <pre>
            {FIELDS.map((field, i) => (
              <span key={field.label} data-on={i < filled ? "" : undefined}>
                {field.read}
              </span>
            ))}
          </pre>
        </div>
        <div className="dbm-profile__chips">
          <span className="dbm-chip" data-on={filled > 0 ? "" : undefined}>
            PHI filter · 0 flagged
          </span>
          <span className="dbm-chip" data-on={done ? "" : undefined}>
            Verified by the clinic
          </span>
          <span className="dbm-chip dbm-chip--salmon" data-on={done ? "" : undefined}>
            Live to every agent
          </span>
        </div>
      </div>
    </Shell>
  );
}

/* ─── 3. Doe Auth: a grant travels from patient to clinic ─────────────────── */

const AUTH_NODES = ["Patient", "Personal agent", "Doe Auth", "Clinic"] as const;
const AUTH_STEPS = [
  "The patient verifies once and signs a grant for one purpose.",
  "The agent presents the grant, bound to its own key. No password.",
  "Doe checks identity, scope, and expiry.",
  "The clinic sees a verified patient and one allowed action.",
] as const;

function AuthScene() {
  const { ref, step, live } = useLiveStep(AUTH_STEPS.length + 1, 1900);
  const at = Math.min(step, AUTH_NODES.length - 1);
  return (
    <Shell scene="auth" dots="curtain" bg="#F8F2E4" dot="#C9BDA8" live={live} innerRef={ref}>
      <div className="dbm-auth" style={vars({ "--at": at })}>
        <div className="dbm-auth__rail" aria-hidden>
          <span className="dbm-auth__fill" />
        </div>
        <ol className="dbm-auth__nodes">
          {AUTH_NODES.map((node, i) => (
            <li key={node} data-on={i <= at ? "" : undefined} data-here={i === at ? "" : undefined}>
              <span className="dbm-auth__dot" />
              <span className={`dbm-auth__name ${p22Mackinac.className}`}>{node}</span>
            </li>
          ))}
        </ol>
        <div className="dbm-auth__token">
          <span className="dbm-auth__token-k">Grant</span>
          <span>Request a visit · Harbourview Dental</span>
          <span className="dbm-auth__token-k">Expires in 7 days</span>
        </div>
        <div className="dbm-auth__checks" data-on={at >= 2 ? "" : undefined}>
          {["Identity", "Scope", "Expiry", "Agent key"].map((check, i) => (
            <span key={check} className="dbm-chip" style={vars({ "--i": i })}>
              ✓ {check}
            </span>
          ))}
        </div>
        <div className="dbm-card dbm-auth__clinic" data-on={at >= 3 ? "" : undefined}>
          <p className="dbm-card__eyebrow">At the clinic</p>
          <p className={`dbm-card__title ${p22Mackinac.className}`}>Verified patient</p>
          <p className="dbm-auth__clinic-line">May request a visit · nothing else · revocable</p>
        </div>
        <p className="dbm-auth__say" key={at}>
          {AUTH_STEPS[at]}
        </p>
      </div>
    </Shell>
  );
}

/* ─── 4. Lanes: each integration moves from sandbox to pilot to live ─────── */

const LANES = [
  { name: "Ask questions", tier: "L1", phi: false },
  { name: "Offers & pricing", tier: "L0", phi: false },
  { name: "Book a visit", tier: "L2", phi: true },
  { name: "Send documents", tier: "L3", phi: true },
  { name: "Verify insurance", tier: "L3", phi: true },
] as const;

/** Column (0 sandbox, 1 pilot, 2 live) for each lane at each step; the gate opens at step 3. */
const LANE_COLS: readonly (readonly number[])[] = [
  [0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [2, 2, 0, 0, 0],
  [2, 2, 0, 0, 0],
  [2, 2, 1, 1, 1],
  [2, 2, 1, 1, 1],
];
const GATE_OPEN_STEP = 3;

function LanesScene() {
  const { ref, step, live } = useLiveStep(LANE_COLS.length, 1700);
  const open = step >= GATE_OPEN_STEP;
  return (
    <Shell scene="lanes" dots="halftone" bg="#FBF0D9" dot="#E0AB62" live={live} innerRef={ref}>
      <div className="dbm-lanes" data-open={open ? "" : undefined}>
        <div className="dbm-lanes__head">
          <span />
          <span>Sandbox</span>
          <span>Pilot</span>
          <span>Live</span>
        </div>
        <div className="dbm-lanes__gate" aria-hidden>
          <span className="dbm-lanes__gate-line" />
          <span className="dbm-lanes__gate-tag">{open ? "Gate cleared · Q3 ’27" : "PHIPA · HIPAA gate"}</span>
        </div>
        {LANES.map((lane, i) => {
          const col = LANE_COLS[step][i];
          const held = lane.phi && !open;
          return (
            <div key={lane.name} className="dbm-lanes__row">
              <span className="dbm-lanes__name">
                <span className={p22Mackinac.className}>{lane.name}</span>
                <span className="dbm-lanes__tier">
                  {lane.tier}
                  {lane.phi ? " · PHI" : " · public"}
                </span>
              </span>
              <div className="dbm-lanes__track">
                <span className="dbm-lanes__pill" data-col={col} data-held={held ? "" : undefined} style={vars({ "--col": col })}>
                  {held ? "Synthetic only" : col === 0 ? "Evals" : col === 1 ? "Design partners" : "All clinics"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

/* ─── 5. Evals: every lane against every attack class, on each change ───── */

const ATTACKS = ["Prompt injection", "Injected pages", "Malicious docs", "Jailbreaks", "Tool hijacking", "Privilege escalation", "Agent-to-agent", "PHI leakage", "Exfiltration", "Memory poisoning", "Identity spoofing", "Invented consent"] as const;
const ATTACK_SHORT = ["Inj", "Web", "Doc", "Jail", "Tool", "Priv", "A2A", "Leak", "Exfil", "Mem", "Spoof", "Cnsnt"] as const;
const EVAL_LANES = ["Questions", "Offers", "Booking", "Documents", "Insurance"] as const;
/** One cell held per run, cleared on the next. Odd runs pass clean. */
const FAILS: readonly ([number, number] | null)[] = [[2, 0], null, [3, 7], null, [4, 10], null];

function EvalsScene() {
  const { ref, step, live } = useLiveStep(FAILS.length, 2600);
  const fail = FAILS[step];
  const prev = FAILS[(step + FAILS.length - 1) % FAILS.length];
  const total = EVAL_LANES.length * ATTACKS.length;
  return (
    <Shell scene="evals" dots="tide" bg="#F8F2E4" dot="#C9BDA8" live={live} innerRef={ref}>
      <div className="dbm-evals">
        <div className="dbm-evals__top">
          <p className="dbm-card__eyebrow">Sandbox · synthetic patients only</p>
          <p className={`dbm-evals__run ${p22Mackinac.className}`}>Run {214 + step}</p>
          <p className="dbm-evals__score">
            {fail ? `${total - 1} of ${total} passed · ${EVAL_LANES[fail[0]]} held` : `${total} of ${total} passed`}
          </p>
        </div>
        <div className="dbm-evals__grid" key={step} style={vars({ "--cols": ATTACKS.length })}>
          <div className="dbm-evals__row dbm-evals__row--head">
            <span />
            {ATTACK_SHORT.map((a, c) => (
              <span key={a} className="dbm-evals__col" title={ATTACKS[c]}>
                {a}
              </span>
            ))}
          </div>
          {EVAL_LANES.map((lane, r) => (
            <div key={lane} className="dbm-evals__row">
              <span className="dbm-evals__lane">{lane}</span>
              {ATTACKS.map((a, c) => {
                const isFail = fail && fail[0] === r && fail[1] === c;
                const wasFail = prev && prev[0] === r && prev[1] === c;
                return (
                  <span
                    key={a}
                    className="dbm-evals__cell"
                    data-fail={isFail ? "" : undefined}
                    data-fixed={wasFail && !isFail ? "" : undefined}
                    style={vars({ "--d": r * ATTACKS.length + c })}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="dbm-evals__legend">
          <span className="dbm-evals__key">
            <i /> Passed
          </span>
          <span className="dbm-evals__key dbm-evals__key--fail">
            <i /> Held until the fix passes
          </span>
          <span className="dbm-evals__key dbm-evals__key--fixed">
            <i /> Fixed since last run
          </span>
        </div>
      </div>
    </Shell>
  );
}

/* ─── 6. Metrics: every clinic's own numbers ─────────────────────────────── */

const CLINICS = [
  { name: "Harbourview Dental", kind: "Dental · Toronto", profile: 96, reads: [12, 18, 15, 24, 29, 27, 36], reply: "4 min", lanes: "4 / 4" },
  { name: "Queen West Physio", kind: "Physiotherapy · Toronto", profile: 88, reads: [8, 9, 14, 13, 17, 22, 21], reply: "11 min", lanes: "3 / 3" },
  { name: "Annex Skin Clinic", kind: "Aesthetics · Toronto", profile: 74, reads: [20, 26, 23, 31, 30, 38, 44], reply: "7 min", lanes: "2 / 2" },
] as const;
const MISSED = [3, 1, 5] as const;

function MetricsScene() {
  const { ref, step, live } = useLiveStep(4, 2400);
  return (
    <Shell scene="metrics" dots="sphere" bg="#FAF0E0" dot="#CDAE84" live={live} innerRef={ref}>
      <div className="dbm-metrics">
        {CLINICS.map((clinic, ci) => {
          const shift = step % 4;
          const reads = clinic.reads.map((v, i) => v + ((i * 7 + shift * 5 + ci * 3) % 9));
          const max = Math.max(...reads);
          return (
            <div key={clinic.name} className="dbm-card dbm-metrics__card" style={vars({ "--i": ci })}>
              <p className="dbm-card__eyebrow">{clinic.kind}</p>
              <p className={`dbm-card__title ${p22Mackinac.className}`}>{clinic.name}</p>
              <div className="dbm-metrics__stat">
                <span>Profile</span>
                <span className="dbm-metrics__meter">
                  <i style={vars({ "--v": `${clinic.profile}%` })} />
                </span>
                <b>{clinic.profile}%</b>
              </div>
              <div className="dbm-metrics__spark">
                <span>Agent reads · 7 days</span>
                <div>
                  {reads.map((v, i) => (
                    <i key={i} style={vars({ "--h": `${(v / max) * 100}%`, "--j": i })} />
                  ))}
                </div>
              </div>
              <div className="dbm-metrics__row">
                <div>
                  <span>Median reply</span>
                  <b className={p22Mackinac.className}>{clinic.reply}</b>
                </div>
                <div>
                  <span>Missed requests</span>
                  <b className={p22Mackinac.className}>{MISSED[ci] + (shift % 2)}</b>
                </div>
                <div>
                  <span>Lanes passing</span>
                  <b className={p22Mackinac.className}>{clinic.lanes}</b>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

/* ─── 7. Tracks: product and compliance, Nov ’26 to Sep ’27 ──────────────── */

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;
type Track = { name: string; from: number; to: number; note: string; tone: "ink" | "salmon" | "line" };
const TRACK_GROUPS: readonly { title: string; rows: readonly Track[] }[] = [
  {
    title: "Product",
    rows: [
      { name: "The Index", from: 0, to: 2, note: "Claims · no PHI", tone: "ink" },
      { name: "Doe Auth", from: 2, to: 4, note: "Verify the patient", tone: "ink" },
      { name: "Integrations", from: 2, to: 8, note: "Sandbox, then pilots", tone: "ink" },
      { name: "PHI lanes", from: 8, to: 11, note: "Personal agents ↔ clinics", tone: "salmon" },
    ],
  },
  {
    title: "Compliance",
    rows: [
      { name: "PHIPA", from: 1.6, to: 8, note: "PIA · TRA · agreements", tone: "line" },
      { name: "HIPAA", from: 1.6, to: 8, note: "Risk analysis · BAAs", tone: "line" },
      { name: "Pen test", from: 2, to: 3.7, note: "Before Auth", tone: "line" },
      { name: "SOC 2", from: 6, to: 11, note: "Readiness → audit", tone: "line" },
    ],
  },
  {
    title: "Throughout",
    rows: [
      { name: "Sandbox evals", from: 0, to: 11, note: "Every change", tone: "line" },
      { name: "Clinic metrics", from: 0, to: 11, note: "Per clinic", tone: "line" },
    ],
  },
];

function TracksScene() {
  const { ref, live } = useLiveStep(1, 100000);
  let n = 0;
  return (
    <Shell scene="tracks" dots="wave" bg="#FBF4E2" dot="#D9BC8A" live={live} innerRef={ref}>
      <div className="dbm-tracks" style={vars({ "--months": MONTHS.length })}>
        <div className="dbm-tracks__months">
          <span />
          <div>
            {MONTHS.map((m, i) => (
              <span key={m} data-year={i === 0 ? "’26" : i === 2 ? "’27" : undefined}>
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="dbm-tracks__body">
          <span className="dbm-tracks__gate" aria-hidden>
            <i>PHI gate · Q3</i>
          </span>
          <span className="dbm-tracks__now" aria-hidden />
          {TRACK_GROUPS.map((group) => (
            <div key={group.title} className="dbm-tracks__group">
              <p className="dbm-tracks__group-title">{group.title}</p>
              {group.rows.map((row) => {
                const i = n++;
                return (
                  <div key={row.name} className="dbm-tracks__row">
                    <span className={`dbm-tracks__name ${p22Mackinac.className}`}>{row.name}</span>
                    <div className="dbm-tracks__lane">
                      <span
                        className="dbm-tracks__bar"
                        data-tone={row.tone}
                        style={vars({ "--from": row.from, "--to": row.to, "--i": i })}
                      >
                        <span>{row.note}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const SCENES: Record<DoeHealthBlogMotionScene, ComponentType> = {
  layers: LayersScene,
  profile: ProfileScene,
  auth: AuthScene,
  lanes: LanesScene,
  evals: EvalsScene,
  metrics: MetricsScene,
  tracks: TracksScene,
};

export function DoeHealthBlogMotion({ scene }: { scene: DoeHealthBlogMotionScene }) {
  const Scene = SCENES[scene];
  return <Scene />;
}
