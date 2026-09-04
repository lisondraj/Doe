"use client";

import { plusJakartaSans, larkenLight } from "@/lib/home/fonts";

const HOW_CARDS = [
  {
    n: "01",
    title: "You text",
    body: "A refill, a side effect, or your kid's sore throat. Same thread you already use.",
  },
  {
    n: "02",
    title: "Doe sets it up",
    body: "A tracker, reminder, or guide comes back in the conversation. No app to open.",
  },
  {
    n: "03",
    title: "It stays on the chart",
    body: "Next time you ask, Doe already knows Simon's vaccines and Susan's meds.",
  },
] as const;

const MOSAIC_FAMILY = [
  { name: "Simon", initial: "S", tone: "son" },
  { name: "Janice", initial: "J", tone: "you" },
  { name: "Fred", initial: "F", tone: "partner" },
  { name: "Susan", initial: "Su", tone: "grandmother" },
] as const;

export function DoeDtc2HowSection() {
  return (
    <section className="doedtc2-how" aria-label="How Doe works">
      <div className="doedtc2-how__inner">
        <h2 className={`doedtc2-how__title ${larkenLight.className}`}>
          <span className="doedtc2-how__title-line">Text.</span>
          <span className="doedtc2-how__title-line">Doe does the rest.</span>
        </h2>
        <ol className="doedtc2-how__cards">
          {HOW_CARDS.map((card) => (
            <li key={card.n} className="doedtc2-how-card">
              <span className={`doedtc2-how-card__n ${larkenLight.className}`}>{card.n}</span>
              <h3 className={`doedtc2-how-card__title ${plusJakartaSans.className}`}>{card.title}</h3>
              <p className="doedtc2-how-card__body">{card.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DoeDtc2MosaicSection() {
  return (
    <section className="doedtc2-mosaic" aria-label="Doe in the thread">
      <div className="doedtc2-mosaic__grid">
        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--thread" aria-label="iMessage thread">
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            Nausea after dinner again.
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
            I&apos;ll start a nightly side-effect tracker.
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            And remind Susan at 8.
          </div>
        </article>

        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--time" aria-label="Evening reminder">
          <p className={`doedtc2-mosaic-card__time ${plusJakartaSans.className}`}>8:00</p>
          <p className="doedtc2-mosaic-card__when">Tonight</p>
        </article>

        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--chart" aria-label="Simon chart">
          <span
            className="doedtc2-feature-card__profile-widget-avatar doedtc2-feature-card__avatar--son"
            aria-hidden
          >
            S
          </span>
          <div className="doedtc2-mosaic-card__chart-copy">
            <span className={`doedtc2-mosaic-card__name ${plusJakartaSans.className}`}>Simon&apos;s chart</span>
            <span className="doedtc-tag">Son</span>
          </div>
        </article>

        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--vaccines" aria-label="Vaccines">
          <ul className="doedtc2-feature-card__vaccine-list">
            <li className="doedtc2-feature-card__vaccine-item">
              <span className="doedtc2-feature-card__vaccine-name">MMR</span>
              <span className="doedtc2-feature-card__vaccine-date">Mar 2023</span>
            </li>
            <li className="doedtc2-feature-card__vaccine-item">
              <span className="doedtc2-feature-card__vaccine-name">DTaP</span>
              <span className="doedtc2-feature-card__vaccine-date">Aug 2024</span>
            </li>
            <li className="doedtc2-feature-card__vaccine-item">
              <span className="doedtc2-feature-card__vaccine-name">Flu</span>
              <span className="doedtc2-feature-card__vaccine-date">Due</span>
            </li>
          </ul>
        </article>

        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--family" aria-label="Family">
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            Is there anything outstanding to do for my grandmother&apos;s checkups?
          </div>
          <div className="doedtc2-feature-card__avatars" aria-hidden>
            {MOSAIC_FAMILY.map((member) => (
              <span
                key={member.name}
                className={`doedtc2-feature-card__avatar doedtc2-feature-card__avatar--${member.tone}`}
              >
                {member.initial}
              </span>
            ))}
          </div>
        </article>

        <article className="doedtc2-mosaic-card doedtc2-mosaic-card--status" aria-label="Reminder status">
          <span
            className="doedtc2-feature-card__profile-widget-avatar doedtc2-feature-card__profile-widget-avatar--grandmother"
            aria-hidden
          >
            Su
          </span>
          <span className={`doedtc2-mosaic-card__name ${plusJakartaSans.className}`}>Susan</span>
          <span className="doedtc-tag doedtc-tag--waiting">Awaiting reply</span>
        </article>
      </div>
    </section>
  );
}
