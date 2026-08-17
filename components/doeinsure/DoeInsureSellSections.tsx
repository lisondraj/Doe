"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { DoeInsureAppFrame } from "@/components/doeinsure/DoeInsureAppUi";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DOEINSURE_FOLLOW } from "@/lib/doeinsure/doeinsure-copy";

const FOLLOW_STEP_MS = 780;

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

export function DoeInsureFollowSection() {
  return (
    <section className="doeinsure-section doeinsure-section--gray" id="follow">
      <div className="doeinsure-wrap" id="top">
        <DoeInsureReveal variant="rise">
          {(revealed) => <FollowBody revealed={revealed} />}
        </DoeInsureReveal>
      </div>
    </section>
  );
}
