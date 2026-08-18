"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEINSURE_PHI,
  DOEINSURE_PRIOR,
  DOEINSURE_PULSE,
  DOEINSURE_RADAR,
  DOEINSURE_RELEASES,
  DOEINSURE_TOWER,
} from "@/lib/doeinsure/doeinsure-copy";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";

const RADAR_STEP_MS = 920;
const RADAR_STEP_MS_IPHONE = 1120;
const PHI_STEP_MS = 980;
const PHI_STEP_MS_IPHONE = 1180;
const RADAR_CX = 100;
const RADAR_CY = 100;
const RADAR_R = 78;

function radarPoint(index: number, total: number, value: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (Math.max(12, value) / 100) * RADAR_R;
  return {
    x: RADAR_CX + Math.cos(angle) * radius,
    y: RADAR_CY + Math.sin(angle) * radius,
  };
}

function RadarBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? RADAR_STEP_MS_IPHONE : RADAR_STEP_MS;
  const axes = DOEINSURE_RADAR.axes;
  const [lit, setLit] = useState(0);
  const [auto, setAuto] = useState(false);
  const complete = lit >= axes.length;

  useEffect(() => {
    if (!revealed) return;
    setLit(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setLit((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, lit, stepMs]);

  const polygon = useMemo(() => {
    return axes
      .map((axis, index) => {
        const value = index < lit ? axis.value : 12;
        const point = radarPoint(index, axes.length, value);
        return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
      })
      .join(" ");
  }, [axes, lit]);

  const sweep = complete ? 360 : (lit / axes.length) * 360;

  return (
    <>
      <header className="doeinsure-radar__head">
        <h2 className="doeinsure-radar__title">
          {DOEINSURE_RADAR.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doeinsure-radar__status">
          <i aria-hidden="true" />
          {complete ? DOEINSURE_RADAR.locked : DOEINSURE_RADAR.scan}
        </p>
      </header>

      <div
        className={`doeinsure-radar__plot${complete ? " is-locked" : ""}`}
        style={{ "--radar-step-ms": `${stepMs}ms`, "--radar-sweep": `${sweep}deg` } as CSSProperties}
      >
        <svg className="doeinsure-radar__svg" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="52" />
          <circle cx="100" cy="100" r="26" />
          {axes.map((_, index) => {
            const tip = radarPoint(index, axes.length, 100);
            return <line key={index} x1="100" y1="100" x2={tip.x} y2={tip.y} />;
          })}
          <polygon points={polygon} />
          <line className="doeinsure-radar__sweep" x1="100" y1="100" x2="100" y2="22" />
        </svg>

        <ol className="doeinsure-radar__readout">
          {axes.map((axis, index) => {
            const on = index < lit;
            return (
              <li key={axis.id} className={on ? "is-on" : undefined}>
                <span>{axis.label}</span>
                <b aria-hidden={!on}>{on ? axis.value : "00"}</b>
                <em aria-hidden={!on}>{axis.note}</em>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

function PhiBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? PHI_STEP_MS_IPHONE : PHI_STEP_MS;
  const [onCount, setOnCount] = useState(0);
  const [auto, setAuto] = useState(false);
  const toggles = DOEINSURE_PHI.toggles;
  const complete = onCount >= toggles.length;

  useEffect(() => {
    if (!revealed) return;
    setOnCount(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setOnCount((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, onCount, stepMs]);

  return (
    <>
      <header className="doeinsure-phi__head">
        <h2 className="doeinsure-phi__title">
          {DOEINSURE_PHI.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
      </header>

      <div className={`doeinsure-phi${complete ? " is-ready" : ""}`}>
        <div className="doeinsure-phi__panel">
          <header className="doeinsure-phi__bar">
            <span>PHI path</span>
            <em>{complete ? DOEINSURE_PHI.ready : DOEINSURE_PHI.mapping}</em>
          </header>
          <ul className="doeinsure-phi__toggles">
            {toggles.map((item, index) => {
              const on = index < onCount;
              return (
                <li key={item.id} className={on ? "is-on" : undefined}>
                  <span>
                    <b>{item.label}</b>
                    <em>{item.hint}</em>
                  </span>
                  <i aria-hidden="true">
                    <u />
                  </i>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="doeinsure-phi__cover">
          <span>{DOEINSURE_PHI.coverLabel}</span>
          <ul>
            {DOEINSURE_PHI.cover.map((line, index) => (
              <li key={line} className={onCount > index ? "is-on" : undefined}>
                {line}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

const PRIOR_STEP_MS = 720;
const PRIOR_STEP_MS_IPHONE = 860;
const RELEASE_STEP_MS = 640;
const RELEASE_STEP_MS_IPHONE = 780;
const TOWER_STEP_MS = 580;
const TOWER_STEP_MS_IPHONE = 720;
const PULSE_STEP_MS = 620;
const PULSE_STEP_MS_IPHONE = 760;

function useSteppedReveal(revealed: boolean, count: number, stepMs: number) {
  const [lit, setLit] = useState(0);
  const [auto, setAuto] = useState(false);
  const complete = lit >= count;

  useEffect(() => {
    if (!revealed) return;
    setLit(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setLit((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, lit, stepMs]);

  return { lit, complete };
}

function PriorBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? PRIOR_STEP_MS_IPHONE : PRIOR_STEP_MS;
  const years = DOEINSURE_PRIOR.years;
  const { lit, complete } = useSteppedReveal(revealed, years.length, stepMs);
  const headIndex = Math.max(0, lit - 1);
  const visualHead = years.length - 1 - headIndex;
  const headPct = years.length <= 1 ? 0 : (visualHead / (years.length - 1)) * 100;

  return (
    <>
      <header className="doeinsure-prior__head">
        <h2 className="doeinsure-prior__title">
          {DOEINSURE_PRIOR.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doeinsure-prior__status">
          <i aria-hidden="true" />
          {complete ? DOEINSURE_PRIOR.statusLocked : DOEINSURE_PRIOR.statusRewind}
        </p>
      </header>

      <div
        className={`doeinsure-prior${complete ? " is-locked" : ""}`}
        style={{ "--prior-step-ms": `${stepMs}ms`, "--prior-head": `${headPct}%` } as CSSProperties}
      >
        <div className="doeinsure-prior__film" aria-hidden="true" />
        <ol className="doeinsure-prior__years">
          {[...years].reverse().map((item, visualIndex) => {
            const dataIndex = years.length - 1 - visualIndex;
            const on = dataIndex < lit;
            const current = dataIndex === headIndex && lit > 0;
            return (
              <li key={item.year} className={`${on ? "is-on" : ""}${current ? " is-now" : ""}`}>
                <b>
                  {item.year}
                  {dataIndex === 0 ? <em> {DOEINSURE_PRIOR.today}</em> : null}
                </b>
                <span>{item.clinic}</span>
                <i>{item.count}</i>
              </li>
            );
          })}
        </ol>
        <div className="doeinsure-prior__head-rail" aria-hidden="true">
          <span className="doeinsure-prior__playhead" />
        </div>
        <p className={`doeinsure-prior__lock${complete ? " is-on" : ""}`}>
          <span>{DOEINSURE_PRIOR.retroLabel}</span>
          <b>{years[years.length - 1]?.year}</b>
        </p>
      </div>
    </>
  );
}

function ReleasesBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? RELEASE_STEP_MS_IPHONE : RELEASE_STEP_MS;
  const items = DOEINSURE_RELEASES.items;
  const { lit, complete } = useSteppedReveal(revealed, items.length, stepMs);
  const spinePct = items.length <= 1 ? 0 : ((Math.max(0, lit - 1)) / (items.length - 1)) * 100;

  return (
    <>
      <header className="doeinsure-releases__head">
        <h2 className="doeinsure-releases__title">
          {DOEINSURE_RELEASES.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doeinsure-releases__status">
          {complete ? DOEINSURE_RELEASES.onPolicy : DOEINSURE_RELEASES.shipping}
        </p>
      </header>

      <ol
        className={`doeinsure-releases${complete ? " is-on" : ""}`}
        style={{ "--release-step-ms": `${stepMs}ms`, "--release-spine": `${spinePct}%` } as CSSProperties}
      >
        {items.map((item, index) => {
          const on = index < lit;
          return (
            <li key={item.version} className={on ? "is-on" : undefined} style={{ "--i": index } as CSSProperties}>
              <span className="doeinsure-releases__node" aria-hidden="true" />
              <div>
                <b>{item.version}</b>
                <strong>{item.name}</strong>
                <em>
                  {item.date}
                  <i>{item.note}</i>
                </em>
              </div>
              <u className={on ? "is-on" : undefined}>{DOEINSURE_RELEASES.onPolicy}</u>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function TowerBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? TOWER_STEP_MS_IPHONE : TOWER_STEP_MS;
  const layers = DOEINSURE_TOWER.layers;
  const { lit, complete } = useSteppedReveal(revealed, layers.length, stepMs);

  return (
    <>
      <header className="doeinsure-tower__head">
        <h2 className="doeinsure-tower__title">
          {DOEINSURE_TOWER.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className={`doeinsure-tower__total${complete ? " is-on" : ""}`}>
          <span>{DOEINSURE_TOWER.totalLabel}</span>
          <b>{DOEINSURE_TOWER.total}</b>
        </p>
      </header>

      <ol
        className={`doeinsure-tower${complete ? " is-on" : ""}`}
        style={{ "--tower-step-ms": `${stepMs}ms` } as CSSProperties}
      >
        {layers.map((layer, index) => {
          const on = index < lit;
          return (
            <li
              key={layer.id}
              className={on ? "is-on" : undefined}
              style={{ "--tower-w": `${layer.width}%`, "--i": index } as CSSProperties}
            >
              <span>{layer.name}</span>
              <b>{layer.limit}</b>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? PULSE_STEP_MS_IPHONE : PULSE_STEP_MS;
  const events = DOEINSURE_PULSE.events;
  const { lit, complete } = useSteppedReveal(revealed, events.length, stepMs);
  const clock = complete ? DOEINSURE_PULSE.clock : events[Math.max(0, lit - 1)]?.time ?? "00:00";

  return (
    <>
      <header className="doeinsure-pulse__head">
        <h2 className="doeinsure-pulse__title">
          {DOEINSURE_PULSE.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doeinsure-pulse__clock">
          <span>{DOEINSURE_PULSE.clockLabel}</span>
          <b>{clock}</b>
        </p>
      </header>

      <div
        className={`doeinsure-pulse${complete ? " is-on" : ""}`}
        style={{ "--pulse-step": `${stepMs}ms` } as CSSProperties}
      >
        <p className="doeinsure-pulse__flag">{complete ? DOEINSURE_PULSE.done : DOEINSURE_PULSE.waiting}</p>
        <ol>
          {events.map((event, index) => {
            const on = index < lit;
            return (
              <li key={event.time} className={on ? "is-on" : undefined} style={{ "--i": index } as CSSProperties}>
                <b>{event.time}</b>
                <span>{event.line}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

export function DoeInsureFeatureSections() {
  return (
    <>
      <section className="doeinsure-section doeinsure-section--print" id="radar">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <RadarBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="phi">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <PhiBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="prior">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <PriorBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="releases">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="left">{(revealed) => <ReleasesBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="tower">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <TowerBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="pulse">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="right">{(revealed) => <PulseBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
