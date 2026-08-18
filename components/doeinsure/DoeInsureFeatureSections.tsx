"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DOEINSURE_PHI, DOEINSURE_RADAR } from "@/lib/doeinsure/doeinsure-copy";
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
    </>
  );
}
