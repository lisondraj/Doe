"use client";

import { useEffect, useState } from "react";

import { DoeInsureAppFrame } from "@/components/doeinsure/DoeInsureAppUi";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
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
                  <i
                    style={{
                      transform: revealed ? `scaleY(${height})` : "scaleY(0)",
                    }}
                  />
                  <span>{item.label}</span>
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
                    <span>{item.name}</span>
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
                              {on ? <span className="doeinsure-match__clause-match">{clause.policyMatch}</span> : null}
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
                <p className="doeinsure-match__progress-label">
                  {matchedCount} of {clauseTotal} {DOEINSURE_MATCH.progressLabel.toLowerCase()}
                </p>
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
                  <span>{item.name}</span>
                  <b>{item.signal}</b>
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

export function DoeInsureSellSections() {
  return (
    <>
      <ScaleSection />
      <MatchSection />
      <StackSection />
    </>
  );
}
