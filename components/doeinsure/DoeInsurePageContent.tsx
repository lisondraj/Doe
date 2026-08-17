"use client";

import { FormEvent, useState } from "react";

import {
  DOEINSURE_CONTACT_EMAIL,
  DOEINSURE_COVERAGE,
  DOEINSURE_CTA,
  DOEINSURE_FAQ,
  DOEINSURE_HERO,
  DOEINSURE_HOW,
  DOEINSURE_POLICY_CARD,
  DOEINSURE_STATS,
  DOEINSURE_UNDERWRITE,
  DOEINSURE_WHO,
} from "@/lib/doeinsure/doeinsure-copy";

function DoeInsureQuoteForm() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(DOEINSURE_CTA.stages[0]);
  const [product, setProduct] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Doe Insure — ${company || "coverage request"}`);
    const body = encodeURIComponent(
      [`Company: ${company}`, `Email: ${email}`, `Stage: ${stage}`, `What we ship: ${product}`].join("\n"),
    );
    window.location.href = `mailto:${DOEINSURE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="doeinsure-form" onSubmit={onSubmit}>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.company}</span>
        <input value={company} onChange={(event) => setCompany(event.target.value)} name="company" required />
      </label>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.email}</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          name="email"
          type="email"
          required
        />
      </label>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.stage}</span>
        <select value={stage} onChange={(event) => setStage(event.target.value)} name="stage">
          {DOEINSURE_CTA.stages.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.product}</span>
        <textarea
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          name="product"
          required
        />
      </label>
      <button className="doeinsure-btn doeinsure-btn--block" type="submit">
        {DOEINSURE_CTA.submit}
      </button>
    </form>
  );
}

export function DoeInsurePageContent() {
  return (
    <>
      <section className="doeinsure-wrap doeinsure-hero" id="top">
        <div>
          <span className="doeinsure-eyebrow">{DOEINSURE_HERO.eyebrow}</span>
          <h1>
            {DOEINSURE_HERO.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="doeinsure-hero__lede">{DOEINSURE_HERO.lede}</p>
          <div className="doeinsure-hero__actions">
            <a className="doeinsure-btn" href="#request">
              {DOEINSURE_HERO.primaryCta}
            </a>
            <a className="doeinsure-btn doeinsure-btn--ghost" href="#coverage">
              {DOEINSURE_HERO.secondaryCta}
            </a>
          </div>
        </div>

        <aside className="doeinsure-card" aria-label="Sample policy">
          <div className="doeinsure-card__kicker">
            <span>{DOEINSURE_POLICY_CARD.kicker}</span>
            <span>{DOEINSURE_POLICY_CARD.id}</span>
          </div>
          <p className="doeinsure-card__name">{DOEINSURE_POLICY_CARD.name}</p>
          <p className="doeinsure-card__limit">{DOEINSURE_POLICY_CARD.limit}</p>
          <p className="doeinsure-card__meta">{DOEINSURE_POLICY_CARD.limitLabel}</p>
          <div className="doeinsure-pills">
            <span className="doeinsure-pill">{DOEINSURE_POLICY_CARD.status}</span>
            <span className="doeinsure-pill doeinsure-pill--outline">{DOEINSURE_POLICY_CARD.rider}</span>
          </div>
          <span className="doeinsure-card__insured-label">{DOEINSURE_POLICY_CARD.insuredLabel}</span>
          <span className="doeinsure-card__insured">{DOEINSURE_POLICY_CARD.insured}</span>
        </aside>
      </section>

      <section className="doeinsure-stats" aria-label="Doe Insure at a glance">
        <div className="doeinsure-wrap doeinsure-stats__row">
          {DOEINSURE_STATS.map((stat) => (
            <div key={stat.label} className="doeinsure-stat">
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="doeinsure-section" id="coverage">
        <div className="doeinsure-wrap">
          <span className="doeinsure-eyebrow">{DOEINSURE_COVERAGE.eyebrow}</span>
          <h2>{DOEINSURE_COVERAGE.title}</h2>
          <div className="doeinsure-grid">
            {DOEINSURE_COVERAGE.items.map((item) => (
              <article key={item.id} className="doeinsure-tile">
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="who">
        <div className="doeinsure-wrap">
          <span className="doeinsure-eyebrow">{DOEINSURE_WHO.eyebrow}</span>
          <h2>{DOEINSURE_WHO.title}</h2>
          <div className="doeinsure-who">
            {DOEINSURE_WHO.items.map((item) => (
              <article key={item.name} className="doeinsure-who-card">
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="doeinsure-section" id="how">
        <div className="doeinsure-wrap">
          <span className="doeinsure-eyebrow">{DOEINSURE_HOW.eyebrow}</span>
          <h2>{DOEINSURE_HOW.title}</h2>
          <div className="doeinsure-steps">
            {DOEINSURE_HOW.steps.map((step) => (
              <article key={step.n} className="doeinsure-step">
                <span className="doeinsure-step__n">{step.n}</span>
                <h3>{step.name}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray">
        <div className="doeinsure-wrap">
          <span className="doeinsure-eyebrow">{DOEINSURE_UNDERWRITE.eyebrow}</span>
          <h2>{DOEINSURE_UNDERWRITE.title}</h2>
          <div className="doeinsure-checks">
            {DOEINSURE_UNDERWRITE.items.map((item) => (
              <p key={item} className="doeinsure-check">
                <i aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="doeinsure-section" id="faq">
        <div className="doeinsure-wrap">
          <span className="doeinsure-eyebrow">{DOEINSURE_FAQ.eyebrow}</span>
          <h2>{DOEINSURE_FAQ.title}</h2>
          <dl className="doeinsure-faq">
            {DOEINSURE_FAQ.items.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="request">
        <div className="doeinsure-wrap doeinsure-cta-grid">
          <div>
            <span className="doeinsure-eyebrow">{DOEINSURE_CTA.eyebrow}</span>
            <h2>{DOEINSURE_CTA.title}</h2>
            <p className="doeinsure-hero__lede">{DOEINSURE_CTA.body}</p>
          </div>
          <DoeInsureQuoteForm />
        </div>
      </section>
    </>
  );
}
