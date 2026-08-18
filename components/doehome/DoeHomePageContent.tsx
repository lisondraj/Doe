"use client";

import { FormEvent, useState } from "react";

import { DoeHomeFeatureSections } from "@/components/doehome/DoeHomeFeatureSections";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEHOME_CONTACT_EMAIL,
  DOEHOME_CTA,
  DOEHOME_FAQ,
  DOEHOME_HERO,
  DOEHOME_PRODUCTS,
  DOEHOME_STACK,
  DOEHOME_STATS,
} from "@/lib/doehome/doehome-copy";

function mailtoDoeHome(lines: string[], subjectName: string) {
  const subject = encodeURIComponent(`Doe — ${subjectName}`);
  const body = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.location.href = `mailto:${DOEHOME_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function HeroEmailForm({
  email,
  onEmailChange,
}: {
  email: string;
  onEmailChange: (value: string) => void;
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mailtoDoeHome([`Work email: ${email}`], email);
  };

  return (
    <form className="doeinsure-hero-form" onSubmit={onSubmit}>
      <label className="doeinsure-hero-form__field">
        <span className="doeinsure-hero-form__label">{DOEHOME_HERO.emailLabel}</span>
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={DOEHOME_HERO.emailPlaceholder}
          required
        />
      </label>
      <button className="doeinsure-btn" type="submit">
        {DOEHOME_HERO.primaryCta}
      </button>
    </form>
  );
}

function IntakeForm({
  email,
  onEmailChange,
}: {
  email: string;
  onEmailChange: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mailtoDoeHome(
      [
        `Name: ${name}`,
        `Clinic: ${company}`,
        website ? `Website: ${website}` : "",
        `Work email: ${email}`,
      ],
      company || name || email,
    );
  };

  return (
    <form className="doeinsure-form doeinsure-form--intake" onSubmit={onSubmit}>
      <label className="doeinsure-field">
        <span>
          {DOEHOME_CTA.fields.name}
          <i className="doeinsure-field__mark" aria-hidden="true">
            *
          </i>
        </span>
        <input value={name} onChange={(event) => setName(event.target.value)} name="name" autoComplete="name" required />
      </label>
      <label className="doeinsure-field">
        <span>
          {DOEHOME_CTA.fields.company}
          <i className="doeinsure-field__mark" aria-hidden="true">
            *
          </i>
        </span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          name="company"
          autoComplete="organization"
          required
        />
      </label>
      <label className="doeinsure-field">
        <span>{DOEHOME_CTA.fields.website}</span>
        <input
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="https://"
        />
      </label>
      <label className="doeinsure-field">
        <span>
          {DOEHOME_CTA.fields.email}
          <i className="doeinsure-field__mark" aria-hidden="true">
            *
          </i>
        </span>
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <button className="doeinsure-btn doeinsure-btn--block" type="submit">
        {DOEHOME_CTA.submit}
      </button>
    </form>
  );
}

function ProductPreview() {
  const [index, setIndex] = useState(0);
  const product = DOEHOME_PRODUCTS[index];

  return (
    <button
      type="button"
      className="doeinsure-card doeinsure-card--click doeinsure-hero__file"
      aria-label="Doe products. Click to see another."
      onClick={() => setIndex((current) => (current + 1) % DOEHOME_PRODUCTS.length)}
    >
      <div className="doeinsure-card__kicker">
        <span>{product.kicker}</span>
        <span>
          {index + 1} / {DOEHOME_PRODUCTS.length}
        </span>
      </div>
      <p className="doeinsure-card__name">{product.name}</p>
      <p className="doeinsure-card__limit">{product.limit}</p>
      <p className="doeinsure-card__meta">{product.limitLabel}</p>
      <div className="doeinsure-pills">
        <span className="doeinsure-pill">{product.status}</span>
        <span className="doeinsure-pill doeinsure-pill--outline">{product.rider}</span>
      </div>
      <span className="doeinsure-card__insured-label">{product.insuredLabel}</span>
      <span className="doeinsure-card__insured">{product.insured}</span>
      <span className="doeinsure-card__hint">click for Pulse, Fabric, Float, Genome</span>
    </button>
  );
}

export function DoeHomePageContent() {
  const [email, setEmail] = useState("");
  const [stat, setStat] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <>
      <section className="doeinsure-hero" id="top">
        <div className="doeinsure-hero__stage">
          <div className="doeinsure-wrap doeinsure-hero__grid">
            <div className="doeinsure-hero__copy">
              <h1 className="doeinsure-hero__title">
                <span className="doeinsure-hero__line doeinsure-hero__line--accent">{DOEHOME_HERO.title}</span>
                {DOEHOME_HERO.tagline.map((line) => (
                  <span key={line} className="doeinsure-hero__line">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="doeinsure-hero__lede">{DOEHOME_HERO.lede}</p>
              <HeroEmailForm email={email} onEmailChange={setEmail} />
              <a className="doeinsure-hero__secondary" href="#genome">
                {DOEHOME_HERO.secondaryCta}
              </a>
            </div>
            <ProductPreview />
          </div>
        </div>
        <div className="doeinsure-stats" aria-label="Doe at a glance">
          <div className="doeinsure-wrap doeinsure-stats__row">
            {DOEHOME_STATS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={`doeinsure-stat${stat === index ? " is-on" : ""}`}
                aria-pressed={stat === index}
                onClick={() => setStat(index)}
              >
                <b>{item.value}</b>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <DoeHomeFeatureSections />

      <section className="doeinsure-section" id="platform">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>
              {DOEHOME_STACK.title.map((line) => (
                <span key={line} className="doeinsure-stages-title__line">
                  {line}
                </span>
              ))}
            </h2>
            <div className="doeinsure-grid">
              {DOEHOME_STACK.items.map((item) => (
                <article key={item.name} className="doeinsure-tile">
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="faq">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEHOME_FAQ.title}</h2>
            <div className="doeinsure-faq">
              {DOEHOME_FAQ.items.map((item, index) => {
                const open = faq === index;
                return (
                  <div key={item.q} className={open ? "is-on" : undefined}>
                    <button type="button" aria-expanded={open} onClick={() => setFaq(open ? null : index)}>
                      <span>{item.q}</span>
                      <i aria-hidden="true">{open ? "–" : "+"}</i>
                    </button>
                    <div className={`doeinsure-fold${open ? " is-on" : ""}`}>
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section" id="request">
        <div className="doeinsure-wrap">
          <DoeInsureReveal className="doeinsure-cta-grid">
            <div>
              <h2>{DOEHOME_CTA.title}</h2>
              <p className="doeinsure-hero__lede doeinsure-cta__lede">
                <span>{DOEHOME_CTA.body}</span>
              </p>
            </div>
            <IntakeForm email={email} onEmailChange={setEmail} />
          </DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
