"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DOEINSURE_FLAP, DOEINSURE_RADAR } from "@/lib/doeinsure/doeinsure-copy";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";

const RADAR_STEP_MS = 920;
const RADAR_STEP_MS_IPHONE = 1120;
const FLAP_STEP_MS = 1080;
const FLAP_STEP_MS_IPHONE = 1280;
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

function FlapBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? FLAP_STEP_MS_IPHONE : FLAP_STEP_MS;
  const [flipped, setFlipped] = useState(0);
  const [auto, setAuto] = useState(false);
  const rows = DOEINSURE_FLAP.rows;
  const complete = flipped >= rows.length;

  useEffect(() => {
    if (!revealed) return;
    setFlipped(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setFlipped((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, flipped, stepMs]);

  return (
    <>
      <header className="doeinsure-flap__head">
        <span>{DOEINSURE_FLAP.board}</span>
        <h2 className="doeinsure-flap__title">
          {DOEINSURE_FLAP.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
      </header>

      <div
        className={`doeinsure-flap__board${complete ? " is-done" : ""}`}
        style={{ "--flap-step-ms": `${stepMs}ms` } as CSSProperties}
      >
        <div className="doeinsure-flap__legend">
          <span>Code</span>
          <span>Clause</span>
          <span>{DOEINSURE_FLAP.fromLabel}</span>
          <span>{DOEINSURE_FLAP.toLabel}</span>
        </div>
        <ol>
          {rows.map((row, index) => {
            const on = index < flipped;
            const turning = index === flipped && !complete;
            return (
              <li key={row.code} className={`${on ? "is-on" : ""}${turning ? " is-turning" : ""}`}>
                <b className="doeinsure-flap__code">{row.code}</b>
                <span className="doeinsure-flap__clause">{row.clause}</span>
                <em className="doeinsure-flap__tile">{row.from}</em>
                <strong className="doeinsure-flap__tile doeinsure-flap__tile--to">
                  <i>{on ? row.to : row.from}</i>
                </strong>
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
      <section className="doeinsure-section doeinsure-section--board" id="flap">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <FlapBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
