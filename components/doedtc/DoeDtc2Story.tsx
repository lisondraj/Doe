"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { larkenLight, plusJakartaSans } from "@/lib/home/fonts";

const STEPS = [
  {
    id: "text",
    title: "Text like a friend",
    body: "Ask about a refill, Ozempic nausea, or your kid's sore throat. Same thread you already use.",
    visual: (
      <div className="doedtc2-story-peek doedtc2-story-peek--thread" aria-hidden>
        <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
          Nausea after dinner again.
        </div>
        <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
          I&apos;ll start a nightly side-effect tracker.
        </div>
      </div>
    ),
  },
  {
    id: "setup",
    title: "Doe sets it up",
    body: "A tracker, reminder, or guide lands in the conversation, already filled in. No extra app to open.",
    visual: (
      <div className="doedtc2-story-peek doedtc2-story-peek--setup" aria-hidden>
        <div className="doedtc2-story-widget">
          <span className="doedtc2-story-widget__label">Side-effect tracker</span>
          <span className="doedtc2-story-widget__name">Ozempic nausea</span>
          <span className="doedtc-tag">Nightly</span>
        </div>
      </div>
    ),
  },
  {
    id: "follow",
    title: "Follow-through stays on",
    body: "Doe texts Susan at 8, then waits until she replies. You do not have to chase it.",
    visual: (
      <div className="doedtc2-story-peek doedtc2-story-peek--follow" aria-hidden>
        <p className={`doedtc2-story-follow__time ${plusJakartaSans.className}`}>8:00</p>
        <p className="doedtc2-story-follow__note">Take your evening meds</p>
        <span className="doedtc-tag doedtc-tag--waiting">Awaiting reply</span>
      </div>
    ),
  },
] as const;

export function DoeDtc2Story() {
  return (
    <div className="doedtc2-sheet">
      <section className="doedtc2-how" aria-labelledby="doedtc2-how-title">
        <div className="doedtc2-how__intro">
          <h2 id="doedtc2-how-title" className={`doedtc2-sheet-title ${larkenLight.className}`}>
            How Doe works.
          </h2>
          <p className="doedtc2-sheet-lead">
            No app to learn. You text. Doe does the rest in the same thread.
          </p>
        </div>
        <ol className="doedtc2-how__steps">
          {STEPS.map((step, index) => (
            <li key={step.id} className="doedtc-card doedtc-card--flat doedtc2-how-step">
              <span className={`doedtc2-how-step__index ${plusJakartaSans.className}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {step.visual}
              <h3 className={`doedtc2-how-step__title ${plusJakartaSans.className}`}>{step.title}</h3>
              <p className="doedtc2-how-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="doedtc2-close" aria-labelledby="doedtc2-close-title">
        <h2 id="doedtc2-close-title" className={`doedtc2-sheet-title ${larkenLight.className}`}>
          Start with a text.
        </h2>
        <p className="doedtc2-sheet-lead">
          Doe texts you back in a minute. No app.
        </p>
        <div className="doedtc2-close__form doedtc-profile-layout">
          <DoeDtcLandingForm hideLabel phoneInputId="doedtc2-close-phone" />
        </div>
      </section>
    </div>
  );
}
