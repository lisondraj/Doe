"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DOEINSURE_BOOK, DOEINSURE_HOUR } from "@/lib/doeinsure/doeinsure-copy";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";

const HOUR_STEP_MS = 1400;
const HOUR_STEP_MS_IPHONE = 1680;
const BOOK_STEP_MS = 1100;
const BOOK_STEP_MS_IPHONE = 1320;

function HourBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? HOUR_STEP_MS_IPHONE : HOUR_STEP_MS;
  const [index, setIndex] = useState(0);
  const [raised, setRaised] = useState(false);
  const [auto, setAuto] = useState(false);
  const asks = DOEINSURE_HOUR.asks;
  const active = asks[Math.min(index, asks.length - 1)];
  const complete = index >= asks.length;

  useEffect(() => {
    if (!revealed) return;
    setIndex(0);
    setRaised(false);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    if (!raised) {
      const id = window.setTimeout(() => setRaised(true), stepMs);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setRaised(false);
      setIndex((current) => current + 1);
    }, Math.round(stepMs * 0.72));
    return () => window.clearTimeout(id);
  }, [auto, complete, raised, stepMs]);

  return (
    <>
      <header className="doeinsure-hour__head">
        <span className="doeinsure-hour__desk">{DOEINSURE_HOUR.desk}</span>
        <h2 className="doeinsure-hour__title">
          {DOEINSURE_HOUR.title.map((line, lineIndex) => (
            <span
              key={line}
              className={lineIndex === DOEINSURE_HOUR.title.length - 1 ? "doeinsure-hour__title-accent" : undefined}
            >
              {line}
            </span>
          ))}
        </h2>
      </header>

      <div
        className={`doeinsure-hour__board${complete ? " is-done" : ""}`}
        style={{ "--hour-step-ms": `${stepMs}ms` } as CSSProperties}
      >
        <div className="doeinsure-hour__clock" aria-hidden="true">
          <em>{complete ? DOEINSURE_HOUR.raised : DOEINSURE_HOUR.live}</em>
          <b>{complete ? asks[asks.length - 1].time : active.time}</b>
          <span>{complete ? asks[asks.length - 1].who : active.who}</span>
        </div>

        <ol className="doeinsure-hour__wire">
          {asks.map((ask, askIndex) => {
            const on = askIndex === index && !complete;
            const done = askIndex < index || (askIndex === index && raised) || complete;
            return (
              <li
                key={ask.time}
                className={`${on ? "is-on" : ""}${done ? " is-done" : ""}`}
                aria-current={on ? "step" : undefined}
              >
                <time>{ask.time}</time>
                <div>
                  <strong>{ask.who}</strong>
                  <span>{ask.ask}</span>
                  <em>{ask.note}</em>
                </div>
                <p>
                  <span>
                    {DOEINSURE_HOUR.fromLabel} {ask.from}
                  </span>
                  <b>{done ? ask.to : on ? DOEINSURE_HOUR.raising : ask.from}</b>
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

function BookBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? BOOK_STEP_MS_IPHONE : BOOK_STEP_MS;
  const [moved, setMoved] = useState(0);
  const [auto, setAuto] = useState(false);
  const clinics = DOEINSURE_BOOK.clinics;
  const complete = moved >= clinics.length;
  const current = complete ? clinics.length : moved;

  useEffect(() => {
    if (!revealed) return;
    setMoved(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setMoved((value) => value + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, moved, stepMs]);

  return (
    <>
      <header className="doeinsure-folio__head">
        <h2 className="doeinsure-folio__title">
          {DOEINSURE_BOOK.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doeinsure-folio__count">
          <span>{DOEINSURE_BOOK.folio}</span>
          <b>
            {String(current).padStart(3, "0")} / {String(clinics.length).padStart(3, "0")}
          </b>
        </p>
      </header>

      <div className={`doeinsure-folio__spread${complete ? " is-done" : ""}`}>
        <section className="doeinsure-folio__page" aria-label={DOEINSURE_BOOK.leftLabel}>
          <span>{DOEINSURE_BOOK.leftLabel}</span>
          <ol>
            {clinics.map((clinic, index) => {
              const gone = index < moved;
              const leaving = index === moved && !complete;
              return (
                <li key={clinic.name} className={`${gone ? "is-gone" : ""}${leaving ? " is-leaving" : ""}`}>
                  <b>{clinic.name}</b>
                  <em>{clinic.lives}</em>
                </li>
              );
            })}
          </ol>
        </section>

        <i className="doeinsure-folio__gutter" aria-hidden="true" />

        <section className="doeinsure-folio__page doeinsure-folio__page--live" aria-label={DOEINSURE_BOOK.rightLabel}>
          <span>{DOEINSURE_BOOK.rightLabel}</span>
          <ol>
            {clinics.map((clinic, index) => {
              const on = index < moved;
              const arriving = index === moved - 1 && !complete;
              return (
                <li key={clinic.name} className={`${on ? "is-on" : ""}${arriving ? " is-in" : ""}`}>
                  <b aria-hidden={!on}>{clinic.name}</b>
                  <em aria-hidden={!on}>{on ? clinic.status : DOEINSURE_BOOK.transferring}</em>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </>
  );
}

export function DoeInsureFeatureSections() {
  return (
    <>
      <section className="doeinsure-section doeinsure-section--ink" id="hour">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <HourBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="book">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <BookBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
