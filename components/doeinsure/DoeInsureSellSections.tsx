"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { DoeInsureAppFrame } from "@/components/doeinsure/DoeInsureAppUi";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEINSURE_FOLLOW,
  DOEINSURE_ISSUE,
  DOEINSURE_MATCH,
  DOEINSURE_SCALE,
  DOEINSURE_STACK,
} from "@/lib/doeinsure/doeinsure-copy";

function ScaleSection() {
  const [month, setMonth] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"ours" | "traditional">("ours");
  const point = DOEINSURE_SCALE.months[month];
  const maxMrr = 86;

  return (
    <section className="doeinsure-section doeinsure-section--gray" id="scale">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          {(revealed) => (
            <ScaleBody
              month={month}
              mode={mode}
              playing={playing}
              point={point}
              maxMrr={maxMrr}
              revealed={revealed}
              setMode={setMode}
              setMonth={setMonth}
              setPlaying={setPlaying}
            />
          )}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

function ScaleBody({
  month,
  mode,
  playing,
  point,
  maxMrr,
  revealed,
  setMode,
  setMonth,
  setPlaying,
}: {
  month: number;
  mode: "ours" | "traditional";
  playing: boolean;
  point: (typeof DOEINSURE_SCALE.months)[number];
  maxMrr: number;
  revealed: boolean;
  setMode: (mode: "ours" | "traditional") => void;
  setMonth: (value: number | ((current: number) => number)) => void;
  setPlaying: (value: boolean | ((current: boolean) => boolean)) => void;
}) {
  useEffect(() => {
    if (!revealed) return;
    setPlaying(true);
  }, [revealed, setPlaying]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setMonth((current) => {
        if (current >= DOEINSURE_SCALE.months.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [playing, setMonth, setPlaying]);

  return (
    <>
      <h2 className="doeinsure-stages-title">
        {DOEINSURE_SCALE.title.map((line) => (
          <span key={line} className="doeinsure-stages-title__line">
            {line}
          </span>
        ))}
      </h2>
      <DoeInsureAppFrame file="Usage · Harbor Notes" className="doeinsure-app--scale">
        <div className="doeinsure-scale-board">
          <p className="doeinsure-scale-board__month">{point.label}</p>
          <b
            className={`doeinsure-scale-board__premium${mode === "traditional" ? " is-old" : ""}`}
            key={`${mode}-${point.label}`}
          >
            {mode === "ours" ? point.premium : point.traditional}
          </b>
          <span className="doeinsure-scale-board__note">
            {mode === "ours" ? DOEINSURE_SCALE.oursNote : DOEINSURE_SCALE.traditionalNote}
          </span>
          <dl className="doeinsure-scale-board__meta">
            <div>
              <dt>MRR</dt>
              <dd key={`mrr-${point.label}`}>{point.mrr}</dd>
            </div>
            <div>
              <dt>Active users</dt>
              <dd key={`users-${point.label}`}>{point.users}</dd>
            </div>
            <div>
              <dt>{mode === "ours" ? "This month" : "Prepaid"}</dt>
              <dd key={`pay-${mode}-${point.label}`}>{mode === "ours" ? point.premium : point.traditional}</dd>
            </div>
          </dl>
          <div className="doeinsure-bars" role="tablist" aria-label="Months">
            {DOEINSURE_SCALE.months.map((item, index) => {
              const height = Math.max(0.18, Number.parseInt(item.mrr.replace(/\D/g, ""), 10) / maxMrr);
              return (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  aria-selected={month === index}
                  className={month === index ? "is-on" : undefined}
                  onClick={() => {
                    setPlaying(false);
                    setMonth(index);
                  }}
                >
                  <span className="doeinsure-bars__plot">
                    <i
                      style={
                        {
                          "--bar-fill": revealed ? height : 0,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="doeinsure-bars__label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </DoeInsureAppFrame>
    </>
  );
}

function MatchSection() {
  const [scenario, setScenario] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [scanning, setScanning] = useState(false);
  const [matchingAll, setMatchingAll] = useState(false);
  const active = DOEINSURE_MATCH.scenarios[scenario];
  const clauseTotal = active.clauses.length;
  const matchedCount = active.clauses.filter((clause) => done[`${scenario}-${clause.id}`]).length;
  const complete = matchedCount === clauseTotal;
  const limitMatched = Boolean(done[`${scenario}-limit`]);
  const workingLimit = limitMatched || complete ? active.ask : active.from;
  const progress = clauseTotal ? (matchedCount / clauseTotal) * 100 : 0;
  const policyUpdates = active.clauses
    .filter((clause) => done[`${scenario}-${clause.id}`])
    .map((clause) => clause.policyMatch);

  useEffect(() => {
    setScanning(true);
    setDone({});
    setMatchingAll(false);
    const id = window.setTimeout(() => setScanning(false), 900);
    return () => window.clearTimeout(id);
  }, [scenario]);

  const toggleClause = (clauseId: string) => {
    if (scanning || matchingAll) return;
    const key = `${scenario}-${clauseId}`;
    setDone((current) => ({ ...current, [key]: !current[key] }));
  };

  const matchAll = () => {
    if (scanning || matchingAll || complete) return;
    setMatchingAll(true);
    active.clauses.forEach((clause, index) => {
      window.setTimeout(() => {
        setDone((current) => ({ ...current, [`${scenario}-${clause.id}`]: true }));
        if (index === active.clauses.length - 1) setMatchingAll(false);
      }, (index + 1) * 480);
    });
  };

  return (
    <section className="doeinsure-section" id="match">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          <h2 className="doeinsure-stages-title">
            {DOEINSURE_MATCH.title.map((line) => (
              <span key={line} className="doeinsure-stages-title__line">
                {line}
              </span>
            ))}
          </h2>
          <DoeInsureAppFrame file="Contract desk" className="doeinsure-app--match">
            <div className="doeinsure-match">
              <div className="doeinsure-match__systems" role="tablist" aria-label={DOEINSURE_MATCH.scenarioLabel}>
                {DOEINSURE_MATCH.scenarios.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={scenario === index}
                    className={scenario === index ? "is-on" : undefined}
                    onClick={() => setScenario(index)}
                  >
                    <span className="doeinsure-match__system-name">{item.name}</span>
                    <b>{item.ask}</b>
                    <span className="doeinsure-stage-block__tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="doeinsure-stage-block__tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>

              <article className="doeinsure-doc doeinsure-match__doc" key={active.id}>
                {scanning ? (
                  <div className="doeinsure-match__scan">
                    <span>{DOEINSURE_MATCH.scanning}</span>
                    <span className="doeinsure-match__scan-bar" aria-hidden="true" />
                  </div>
                ) : (
                  <>
                    <p>{active.excerpt}</p>
                    <ul className="doeinsure-match__clauses">
                      {active.clauses.map((clause) => {
                        const key = `${scenario}-${clause.id}`;
                        const on = Boolean(done[key]);
                        return (
                          <li key={clause.id}>
                            <button
                              type="button"
                              className={on ? "is-on" : undefined}
                              disabled={matchingAll}
                              onClick={() => toggleClause(clause.id)}
                            >
                              <span className="doeinsure-match__clause-top">
                                <span>{clause.label}</span>
                                {on ? <em>Matched</em> : null}
                              </span>
                              <strong>{clause.text}</strong>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </article>

              <aside className={`doeinsure-match__file${complete ? " is-on" : ""}`}>
                <div className="doeinsure-card__kicker">
                  <span>{DOEINSURE_MATCH.fileLabel}</span>
                  <span>{complete ? DOEINSURE_MATCH.hoursDone : DOEINSURE_MATCH.hours}</span>
                </div>
                <span className="doeinsure-match__status">
                  {complete ? DOEINSURE_MATCH.unblocked : DOEINSURE_MATCH.blocked}
                </span>
                <div className="doeinsure-match__progress" aria-hidden="true">
                  <i style={{ width: `${progress}%` }} />
                </div>
                <div className="doeinsure-scan__limits">
                  <span>
                    {DOEINSURE_MATCH.currentLabel}
                    <b key={workingLimit}>{workingLimit}</b>
                  </span>
                  <span>
                    {DOEINSURE_MATCH.requiredLabel}
                    <b>{active.ask}</b>
                  </span>
                </div>
                <div className="doeinsure-match__updates">
                  <span>{DOEINSURE_MATCH.policyUpdates}</span>
                  <ul>
                    {policyUpdates.length ? (
                      policyUpdates.map((update) => (
                        <li key={update}>{update}</li>
                      ))
                    ) : (
                      <li className="is-wait">{DOEINSURE_MATCH.waitingUpdates}</li>
                    )}
                  </ul>
                </div>
                {complete ? (
                  <a className="doeinsure-btn" href="#request">
                    {DOEINSURE_MATCH.request}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="doeinsure-btn"
                    disabled={scanning || matchingAll}
                    onClick={matchAll}
                  >
                    {matchingAll ? DOEINSURE_MATCH.scanning : DOEINSURE_MATCH.matchAll}
                  </button>
                )}
              </aside>
            </div>
          </DoeInsureAppFrame>
        </DoeInsureReveal>
      </div>
    </section>
  );
}

const STACK_HUB = { x: 50, y: 50 };
const STACK_CONNECT_MS = 720;

function stackPath(x: number, y: number) {
  const midY = y < STACK_HUB.y ? 34 : 66;
  return `M ${x} ${y} Q ${STACK_HUB.x} ${midY} ${STACK_HUB.x} ${STACK_HUB.y}`;
}

function StackSection() {
  return (
    <section className="doeinsure-section doeinsure-section--gray" id="stack">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          {(revealed) => <StackBody revealed={revealed} />}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

function StackBody({ revealed }: { revealed: boolean }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [linking, setLinking] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);
  const connected = DOEINSURE_STACK.sources.filter((item) => on[item.id]);
  const complete = connected.length === DOEINSURE_STACK.sources.length;
  const busy = Boolean(linking);

  useEffect(() => {
    if (!revealed || complete) return undefined;
    setAuto(true);
    return undefined;
  }, [complete, revealed]);

  useEffect(() => {
    if (!auto || linking || complete) return undefined;
    const next = DOEINSURE_STACK.sources.find((item) => !on[item.id]);
    if (!next) {
      setAuto(false);
      return undefined;
    }
    const id = window.setTimeout(() => setLinking(next.id), 160);
    return () => window.clearTimeout(id);
  }, [auto, complete, linking, on]);

  useEffect(() => {
    if (!linking) return undefined;
    const id = window.setTimeout(() => {
      setOn((current) => ({ ...current, [linking]: true }));
      setLinking(null);
    }, STACK_CONNECT_MS);
    return () => window.clearTimeout(id);
  }, [linking]);

  const toggle = (id: string) => {
    if (busy && linking !== id) return;
    setAuto(false);
    setLinking(null);
    setOn((current) => ({ ...current, [id]: !current[id] }));
  };

  const connectAll = () => {
    if (busy || complete) return;
    setAuto(true);
  };

  const status = complete
    ? DOEINSURE_STACK.ready
    : busy || connected.length
      ? DOEINSURE_STACK.reading
      : DOEINSURE_STACK.waiting;

  return (
    <>
      <h2 className="doeinsure-stages-title">
        {DOEINSURE_STACK.title.map((line) => (
          <span key={line} className="doeinsure-stages-title__line">
            {line}
          </span>
        ))}
      </h2>
      <DoeInsureAppFrame file="Risk file · Harbor Notes" className="doeinsure-app--stack">
        <div className={`doeinsure-link${complete ? " is-on" : ""}`}>
          <div className="doeinsure-link__map">
            <p className="doeinsure-link__map-label">Sources</p>
            <svg className="doeinsure-link__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {DOEINSURE_STACK.sources.map((item) => {
                const live = on[item.id] || linking === item.id;
                const d = stackPath(item.x, item.y);
                return (
                  <g key={item.id}>
                    <path className="doeinsure-link__wire" d={d} />
                    <path
                      className={`doeinsure-link__wire-live${live ? " is-on" : ""}${linking === item.id ? " is-linking" : ""}`}
                      d={d}
                      pathLength={1}
                    />
                    {linking === item.id ? (
                      <circle className="doeinsure-link__packet" r="1.25">
                        <animateMotion dur="0.72s" fill="freeze" path={d} />
                      </circle>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {DOEINSURE_STACK.sources.map((item) => {
              const live = Boolean(on[item.id]);
              const active = live || linking === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`doeinsure-link__node${active ? " is-on" : ""}${linking === item.id ? " is-linking" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  aria-pressed={live}
                  onClick={() => toggle(item.id)}
                >
                  <span className="doeinsure-link__node-copy">
                    <span>{item.name}</span>
                    <b>{item.signal}</b>
                  </span>
                  <em className="doeinsure-link__node-state">
                    {linking === item.id ? "Reading" : live ? item.value : "Connect"}
                  </em>
                </button>
              );
            })}

            <div className={`doeinsure-link__hub${complete ? " is-on" : ""}`}>
              <span>{status}</span>
              <strong>{complete ? DOEINSURE_STACK.premium : DOEINSURE_STACK.company}</strong>
              {complete ? <em>{DOEINSURE_STACK.premiumNote}</em> : null}
              <ul>
                {connected.length ? (
                  connected.map((item) => (
                    <li key={item.id}>
                      {item.signal}
                      <b>{item.value}</b>
                    </li>
                  ))
                ) : (
                  <li className="is-wait">Connect a source</li>
                )}
              </ul>
            </div>
          </div>

          <div className={`doeinsure-link__bar${complete ? " is-on" : ""}`}>
            <p>
              <span>
                {connected.length} of {DOEINSURE_STACK.sources.length}
              </span>
              <b>{status}</b>
            </p>
            {complete ? (
              <a className="doeinsure-btn" href="#request">
                {DOEINSURE_STACK.request}
              </a>
            ) : (
              <button type="button" className="doeinsure-btn" disabled={busy} onClick={connectAll}>
                {busy ? DOEINSURE_STACK.reading : DOEINSURE_STACK.connectAll}
              </button>
            )}
          </div>
        </div>
      </DoeInsureAppFrame>
    </>
  );
}

const ISSUE_STEP_MS = 520;

function IssueSection() {
  return (
    <section className="doeinsure-section" id="issue">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          {(revealed) => <IssueBody revealed={revealed} />}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

function IssueBody({ revealed }: { revealed: boolean }) {
  const [request, setRequest] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const active = DOEINSURE_ISSUE.requests[request];
  const total = DOEINSURE_ISSUE.fields.length;
  const complete = step >= total;
  const busy = auto && !complete;

  const values: Record<string, string> = {
    holder: active.holder,
    insured: DOEINSURE_ISSUE.insured,
    limit: active.limit,
    endorsement: active.endorsement,
  };

  useEffect(() => {
    setStep(0);
    if (!revealed) return;
    setAuto(true);
  }, [revealed, request]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setStep((current) => current + 1), ISSUE_STEP_MS);
    return () => window.clearTimeout(id);
  }, [auto, complete, step]);

  const pick = (index: number) => {
    setAuto(false);
    setRequest(index);
  };

  return (
    <>
      <h2 className="doeinsure-stages-title">
        {DOEINSURE_ISSUE.title.map((line) => (
          <span key={line} className="doeinsure-stages-title__line">
            {line}
          </span>
        ))}
      </h2>
      <DoeInsureAppFrame file="Certificate desk" className="doeinsure-app--issue">
        <div className={`doeinsure-issue${complete ? " is-on" : ""}`}>
          <div className="doeinsure-issue__rail" role="tablist" aria-label="Certificate requests">
            {DOEINSURE_ISSUE.requests.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={request === index}
                className={request === index ? "is-on" : undefined}
                onClick={() => pick(index)}
              >
                <span>{item.time}</span>
                <b>{item.name}</b>
              </button>
            ))}
          </div>

          <article className="doeinsure-issue__sheet" key={active.id}>
            <div className={`doeinsure-issue__scan${busy ? " is-on" : ""}`} aria-hidden="true" />
            <div className="doeinsure-issue__top">
              <strong className={`doeinsure-issue__limit${step > 0 ? " is-on" : ""}`}>{active.limit}</strong>
              <p className="doeinsure-issue__kicker">
                {complete ? DOEINSURE_ISSUE.issued : busy ? DOEINSURE_ISSUE.issuing : DOEINSURE_ISSUE.waiting}
              </p>
            </div>
            <span className="doeinsure-issue__note">{DOEINSURE_ISSUE.insured}</span>
            <ul>
              {DOEINSURE_ISSUE.fields.map((field, index) => {
                const filled = step > index;
                return (
                  <li key={field.id} className={filled ? "is-on" : undefined}>
                    <span>{field.label}</span>
                    <i />
                    <b>{filled ? values[field.id] : ""}</b>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </DoeInsureAppFrame>
    </>
  );
}

const FOLLOW_STEP_MS = 780;

function FollowSection() {
  return (
    <section className="doeinsure-section doeinsure-section--gray" id="follow">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          {(revealed) => <FollowBody revealed={revealed} />}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

function FollowBody({ revealed }: { revealed: boolean }) {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const total = DOEINSURE_FOLLOW.ships.length;
  const complete = step >= total;
  const busy = auto && !complete;
  const active = DOEINSURE_FOLLOW.ships[Math.min(step, total - 1)];
  const status = complete
    ? DOEINSURE_FOLLOW.current
    : busy
      ? `${DOEINSURE_FOLLOW.shipping} ${active.version}`
      : DOEINSURE_FOLLOW.waiting;

  useEffect(() => {
    if (!revealed) return;
    setStep(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setStep((current) => current + 1), FOLLOW_STEP_MS);
    return () => window.clearTimeout(id);
  }, [auto, complete, step]);

  const pick = (index: number) => {
    setAuto(false);
    setStep(index + 1);
  };

  return (
    <>
      <h2 className="doeinsure-stages-title">
        {DOEINSURE_FOLLOW.title.map((line) => (
          <span key={line} className="doeinsure-stages-title__line">
            {line}
          </span>
        ))}
      </h2>
      <DoeInsureAppFrame file="Product file · Harbor Notes" className="doeinsure-app--follow">
        <div className={`doeinsure-follow${complete ? " is-on" : ""}`}>
          <div className="doeinsure-follow__head">
            <strong>{status}</strong>
            <span>{DOEINSURE_FOLLOW.company}</span>
          </div>
          <ol
            className="doeinsure-follow__log"
            style={{ "--follow-progress": total ? String(step / total) : "0" } as CSSProperties}
          >
            {DOEINSURE_FOLLOW.ships.map((item, index) => {
              const on = step > index;
              const live = busy && step === index;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${on ? "is-on" : ""}${live ? " is-live" : ""}`}
                    aria-pressed={on}
                    onClick={() => pick(index)}
                  >
                    <i aria-hidden="true" />
                    <b>{item.version}</b>
                    <span>
                      {item.name}
                      <em>{item.cover}</em>
                    </span>
                    <p>{on ? DOEINSURE_FOLLOW.endorsed : live ? DOEINSURE_FOLLOW.shipping : DOEINSURE_FOLLOW.queued}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </DoeInsureAppFrame>
    </>
  );
}

export function DoeInsureSellSections() {
  return (
    <>
      <ScaleSection />
      <MatchSection />
      <StackSection />
      <IssueSection />
      <FollowSection />
    </>
  );
}
