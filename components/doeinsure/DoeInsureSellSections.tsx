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
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";

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

const MATCH_SCAN_MS = 900;
const MATCH_SCAN_MS_IPHONE = 2600;

function MatchSection() {
  return (
    <section className="doeinsure-section" id="match">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="rise">
          {(revealed) => <MatchBody revealed={revealed} />}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

function MatchBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const scanMs = variant === "phone" ? MATCH_SCAN_MS_IPHONE : MATCH_SCAN_MS;
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
    if (!revealed) return undefined;

    setScanning(true);
    setDone({});
    setMatchingAll(false);
    const id = window.setTimeout(() => setScanning(false), scanMs);
    return () => window.clearTimeout(id);
  }, [scenario, scanMs, revealed]);

  const toggleClause = (clauseId: string) => {
    if (!revealed || scanning || matchingAll) return;
    const key = `${scenario}-${clauseId}`;
    setDone((current) => ({ ...current, [key]: !current[key] }));
  };

  const matchAll = () => {
    if (!revealed || scanning || matchingAll || complete) return;
    setMatchingAll(true);
    active.clauses.forEach((clause, index) => {
      window.setTimeout(() => {
        setDone((current) => ({ ...current, [`${scenario}-${clause.id}`]: true }));
        if (index === active.clauses.length - 1) setMatchingAll(false);
      }, (index + 1) * 480);
    });
  };

  return (
    <>
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

          <article
            className={`doeinsure-doc doeinsure-match__doc${scanning ? " is-scanning" : ""}`}
            key={active.id}
            style={
              variant === "phone"
                ? ({ "--match-scan-ms": `${scanMs}ms` } as CSSProperties)
                : undefined
            }
          >
            <div className="doeinsure-match__reader">
              <span className="doeinsure-match__draft">{DOEINSURE_MATCH.draftLabel}</span>
              {variant === "phone" ? (
                <div className={`doeinsure-match__load-pane${scanning ? " is-on" : ""}`} aria-hidden={!scanning}>
                  <div className="doeinsure-match__scan doeinsure-match__scan--phone is-on">
                    <span className="doeinsure-match__scan-label">Reading MSA</span>
                    <span className="doeinsure-match__scan-track" aria-hidden="true">
                      <i />
                    </span>
                  </div>
                </div>
              ) : (
                <div className={`doeinsure-match__scan${scanning ? " is-on" : ""}`} aria-hidden={!scanning}>
                  <span>{DOEINSURE_MATCH.scanning}</span>
                  <span className="doeinsure-match__scan-bar" aria-hidden="true" />
                </div>
              )}
              <p className="doeinsure-match__excerpt">{active.excerpt}</p>
            </div>
            <ul className={`doeinsure-match__clauses${scanning ? " is-wait" : " is-in"}`}>
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
    </>
  );
}

const STACK_HUB = { x: 50, y: 50 };
const STACK_HUB_MOBILE = { x: 14, y: 94 };
const STACK_CONNECT_MS = 720;
const STACK_CONNECT_MS_IPHONE = 2100;
const STACK_AUTO_DELAY_MS = 160;
const STACK_AUTO_DELAY_MS_IPHONE = 600;

function stackPath(x: number, y: number) {
  const midY = y < STACK_HUB.y ? 34 : 66;
  return `M ${x} ${y} Q ${STACK_HUB.x} ${midY} ${STACK_HUB.x} ${STACK_HUB.y}`;
}

function stackPathMobile(index: number, count: number) {
  const y = count <= 1 ? 18 : 14 + index * (68 / (count - 1));
  return `M ${STACK_HUB_MOBILE.x} ${STACK_HUB_MOBILE.y} L ${STACK_HUB_MOBILE.x} ${y} L 88 ${y}`;
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
  const { variant } = useDoeInsurePageVariant();
  const connectMs = variant === "phone" ? STACK_CONNECT_MS_IPHONE : STACK_CONNECT_MS;
  const autoDelayMs = variant === "phone" ? STACK_AUTO_DELAY_MS_IPHONE : STACK_AUTO_DELAY_MS;
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
    const id = window.setTimeout(() => setLinking(next.id), autoDelayMs);
    return () => window.clearTimeout(id);
  }, [auto, autoDelayMs, complete, linking, on]);

  useEffect(() => {
    if (!linking) return undefined;
    const id = window.setTimeout(() => {
      setOn((current) => ({ ...current, [linking]: true }));
      setLinking(null);
    }, connectMs);
    return () => window.clearTimeout(id);
  }, [connectMs, linking]);

  const toggle = (id: string) => {
    if (busy && linking !== id) return;
    setAuto(false);
    setLinking(null);
    setOn((current) => ({ ...current, [id]: !current[id] }));
  };

  const status = complete
    ? DOEINSURE_STACK.ready
    : busy || connected.length
      ? DOEINSURE_STACK.reading
      : DOEINSURE_STACK.waiting;
  const stackPremium = Number.parseInt(DOEINSURE_STACK.premium.replace(/[^\d]/g, ""), 10);
  const stackOriginal = stackPremium * 2;
  const dropStep = Math.round(stackPremium / DOEINSURE_STACK.sources.length);
  const savingsProgress = connected.length + (linking ? 0.45 : 0);
  const dropTotal = Math.round(dropStep * savingsProgress);
  const stackQuote = stackOriginal - dropTotal;
  const stackFill = (savingsProgress / DOEINSURE_STACK.sources.length) * 100;

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
            <svg
              className="doeinsure-link__wires doeinsure-link__wires--desktop"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
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
            <svg
              className="doeinsure-link__wires doeinsure-link__wires--iphone"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {DOEINSURE_STACK.sources.map((item, index) => {
                const live = on[item.id] || linking === item.id;
                const d = stackPathMobile(index, DOEINSURE_STACK.sources.length);
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
              <button type="button" className="doeinsure-btn" disabled>
                {DOEINSURE_STACK.reading}
              </button>
            )}
          </div>

          <div
            className="doeinsure-stack-phone"
            style={{ "--stack-connect-ms": `${connectMs}ms` } as CSSProperties}
          >
            <article
              className={`doeinsure-stack-phone__quote${complete ? " is-on" : ""}${busy ? " is-reading" : ""}`}
            >
              <header className="doeinsure-stack-phone__quote-head">
                <span>{status}</span>
              </header>
              <strong className="doeinsure-stack-phone__company">{DOEINSURE_STACK.company}</strong>
              <p className="doeinsure-stack-phone__premium">
                <span className="doeinsure-stack-phone__premium-main">
                  <b key={stackQuote}>${stackQuote}</b>
                  <em className="doeinsure-stack-phone__period">{DOEINSURE_STACK.premiumNote}</em>
                </span>
                {dropTotal ? (
                  <span className="doeinsure-stack-phone__drop-col">
                    <em className="doeinsure-stack-phone__drop">−${dropTotal}</em>
                    <em className="doeinsure-stack-phone__drop-note">
                      after {connected.length} connection{connected.length === 1 ? "" : "s"}
                    </em>
                  </span>
                ) : null}
              </p>
              <div
                className="doeinsure-stack-phone__meter"
                aria-hidden="true"
                style={{ "--stack-fill": `${stackFill}%` } as CSSProperties}
              >
                <i />
              </div>
              <ul className="doeinsure-stack-phone__signals">
                {DOEINSURE_STACK.sources.map((item) => {
                  const live = Boolean(on[item.id]);
                  const reading = linking === item.id;
                  return (
                    <li
                      key={item.id}
                      className={live ? "is-on" : reading ? "is-reading" : undefined}
                    >
                      <span>{item.signal}</span>
                      <b>{reading ? "Reading" : live ? item.value : "—"}</b>
                    </li>
                  );
                })}
              </ul>
            </article>

            <div className="doeinsure-stack-phone__board">
              <p className="doeinsure-stack-phone__board-label">Sources</p>
              <ul className="doeinsure-stack-phone__sources">
                {DOEINSURE_STACK.sources.map((item) => {
                  const live = Boolean(on[item.id]);
                  const reading = linking === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`doeinsure-stack-phone__source${live ? " is-on" : ""}${reading ? " is-linking" : ""}`}
                        aria-pressed={live}
                        onClick={() => toggle(item.id)}
                      >
                        <i aria-hidden="true" />
                        <span>
                          <b>{item.name}</b>
                          <em>{item.signal}</em>
                        </span>
                        <strong className={live && !reading ? "is-drop" : undefined}>
                          {reading ? "Reading" : live ? `−$${dropStep}` : "Connect"}
                        </strong>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="doeinsure-stack-phone__cta">
              {complete ? (
                <a className="doeinsure-btn" href="#request">
                  {DOEINSURE_STACK.request}
                </a>
              ) : (
                <button type="button" className="doeinsure-btn" disabled>
                  {DOEINSURE_STACK.reading}
                </button>
              )}
            </div>
          </div>
        </div>
      </DoeInsureAppFrame>
    </>
  );
}

const ISSUE_STEP_MS = 780;
const ISSUE_ISSUED_HOLD_MS = 3000;

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
  const requestCount = DOEINSURE_ISSUE.requests.length;
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
    if (!revealed) return;
    setStep(0);
    setAuto(true);
  }, [revealed, request]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setStep((current) => current + 1), ISSUE_STEP_MS);
    return () => window.clearTimeout(id);
  }, [auto, complete, step]);

  useEffect(() => {
    if (!auto || !complete) return undefined;
    if (request >= requestCount - 1) {
      setAuto(false);
      return undefined;
    }
    const id = window.setTimeout(() => {
      setRequest((current) => current + 1);
      setStep(0);
    }, ISSUE_ISSUED_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [auto, complete, request, requestCount]);

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
                    <b className={filled ? undefined : "is-pending"} aria-hidden={!filled}>
                      {values[field.id]}
                    </b>
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
