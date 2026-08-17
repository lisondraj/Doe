"use client";

import { useEffect, useState } from "react";

import { DoeInsureAppFrame, DoeInsureQuoteApp } from "@/components/doeinsure/DoeInsureAppUi";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEINSURE_MATCH,
  DOEINSURE_QUOTE,
  DOEINSURE_SCALE,
} from "@/lib/doeinsure/doeinsure-copy";

function QuoteSection() {
  return (
    <section className="doeinsure-section" id="quote">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="left" className="doeinsure-split">
          <div>
            <span className="doeinsure-eyebrow">{DOEINSURE_QUOTE.eyebrow}</span>
            <h2>{DOEINSURE_QUOTE.title}</h2>
            <p className="doeinsure-hero__lede">{DOEINSURE_QUOTE.lede}</p>
          </div>
          <DoeInsureQuoteApp />
        </DoeInsureReveal>
      </div>
    </section>
  );
}

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
    }, 640);
    return () => window.clearInterval(id);
  }, [playing, setMonth, setPlaying]);

  return (
    <>
      <span className="doeinsure-eyebrow">{DOEINSURE_SCALE.eyebrow}</span>
      <h2>{DOEINSURE_SCALE.title}</h2>
      <p className="doeinsure-hero__lede">{DOEINSURE_SCALE.lede}</p>
      <DoeInsureAppFrame file="Usage · Harbor Notes">
      <div className="doeinsure-scale-board">
        <div className="doeinsure-scale-board__top">
          <div className="doeinsure-compare-toggle" role="tablist" aria-label="Premium type">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "ours"}
              className={mode === "ours" ? "is-on" : undefined}
              onClick={() => setMode("ours")}
            >
              {DOEINSURE_SCALE.ours}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "traditional"}
              className={mode === "traditional" ? "is-on" : undefined}
              onClick={() => setMode("traditional")}
            >
              {DOEINSURE_SCALE.traditional}
            </button>
          </div>
          <button
            type="button"
            className="doeinsure-inline is-on"
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              if (month >= DOEINSURE_SCALE.months.length - 1) setMonth(0);
              setPlaying(true);
            }}
          >
            {playing ? DOEINSURE_SCALE.pause : DOEINSURE_SCALE.play}
          </button>
        </div>
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
  const [system, setSystem] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const hospital = DOEINSURE_MATCH.systems[system];
  const matchedCount = hospital.clauses.filter((clause) => done[`${system}-${clause.id}`]).length;
  const complete = matchedCount === hospital.clauses.length;

  return (
    <section className="doeinsure-section" id="match">
      <div className="doeinsure-wrap">
        <DoeInsureReveal variant="right">
          <span className="doeinsure-eyebrow">{DOEINSURE_MATCH.eyebrow}</span>
          <h2>{DOEINSURE_MATCH.title}</h2>
          <p className="doeinsure-hero__lede">{DOEINSURE_MATCH.lede}</p>
          <DoeInsureAppFrame file="Contract desk">
          <div className="doeinsure-match">
            <div className="doeinsure-match__systems" role="tablist" aria-label="Health systems">
              {DOEINSURE_MATCH.systems.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={system === index}
                  className={system === index ? "is-on" : undefined}
                  onClick={() => {
                    setSystem(index);
                    setDone({});
                  }}
                >
                  <span>{item.name}</span>
                  <b>{item.ask}</b>
                </button>
              ))}
            </div>
            <article className="doeinsure-doc" key={hospital.name}>
              <div className="doeinsure-card__kicker">
                <span>Hospital draft</span>
                <span>{hospital.name}</span>
              </div>
              <p>{hospital.excerpt}</p>
              <ul>
                {hospital.clauses.map((clause) => {
                  const key = `${system}-${clause.id}`;
                  const on = Boolean(done[key]);
                  return (
                    <li key={clause.id}>
                      <button
                        type="button"
                        className={on ? "is-on" : undefined}
                        onClick={() => setDone((current) => ({ ...current, [key]: !current[key] }))}
                      >
                        <span>{clause.label}</span>
                        {clause.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
            <aside className={`doeinsure-match__file${complete ? " is-on" : ""}`}>
              <div className="doeinsure-card__kicker">
                <span>Policy file</span>
                <span>{complete ? DOEINSURE_MATCH.hoursDone : DOEINSURE_MATCH.hours}</span>
              </div>
              <span className="doeinsure-match__status">
                {complete ? DOEINSURE_MATCH.unblocked : DOEINSURE_MATCH.blocked}
              </span>
              <div className="doeinsure-scan__limits">
                <span>
                  {DOEINSURE_MATCH.currentLabel}
                  <b key={complete ? "to" : "from"}>{complete ? hospital.ask : hospital.from}</b>
                </span>
                <span>
                  {DOEINSURE_MATCH.requiredLabel}
                  <b>{hospital.ask}</b>
                </span>
              </div>
              <p>
                {matchedCount} of {hospital.clauses.length} clauses matched
              </p>
              {complete ? (
                <a className="doeinsure-btn" href="#request">
                  {DOEINSURE_MATCH.request}
                </a>
              ) : (
                <button
                  type="button"
                  className="doeinsure-btn"
                  onClick={() =>
                    setDone(
                      Object.fromEntries(hospital.clauses.map((clause) => [`${system}-${clause.id}`, true])),
                    )
                  }
                >
                  {DOEINSURE_MATCH.matchAll}
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

export function DoeInsureSellSections() {
  return (
    <>
      <QuoteSection />
      <ScaleSection />
      <MatchSection />
    </>
  );
}
