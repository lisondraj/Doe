"use client";

import { FormEvent, useEffect, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DoeInsureSellSections } from "@/components/doeinsure/DoeInsureSellSections";
import {
  DOEINSURE_CONTACT_EMAIL,
  DOEINSURE_CTA,
  DOEINSURE_FAQ,
  DOEINSURE_HERO,
  DOEINSURE_POLICY_SAMPLES,
  DOEINSURE_STATS,
  DOEINSURE_STAGES,
  DOEINSURE_UNDERWRITE,
} from "@/lib/doeinsure/doeinsure-copy";
import { useDoeInsureLadderScroll } from "@/lib/doeinsure/use-doeinsure-ladder-scroll";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";

const UNDERWRITE_STEP_MS = 980;
const UNDERWRITE_STEP_MS_IPHONE = 1180;

function mailtoDoeInsure(lines: string[], subjectName: string) {
  const subject = encodeURIComponent(`Doe Insure — ${subjectName}`);
  const body = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.location.href = `mailto:${DOEINSURE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function StageTags({ tags }: { tags: readonly string[] }) {
  return (
    <div className="doeinsure-stage-block__tags">
      {tags.map((tag) => (
        <span key={tag} className="doeinsure-stage-block__tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

function DoeInsureHeroEmailForm({
  email,
  onEmailChange,
}: {
  email: string;
  onEmailChange: (value: string) => void;
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mailtoDoeInsure([`Work email: ${email}`], email);
  };

  return (
    <form className="doeinsure-hero-form" onSubmit={onSubmit}>
      <label className="doeinsure-hero-form__field">
        <span className="doeinsure-hero-form__label">{DOEINSURE_HERO.emailLabel}</span>
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={DOEINSURE_HERO.emailPlaceholder}
          required
        />
      </label>
      <button className="doeinsure-btn" type="submit">
        {DOEINSURE_HERO.primaryCta}
      </button>
    </form>
  );
}

function DoeInsureIntakeForm({
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
    mailtoDoeInsure(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        website ? `Website: ${website}` : "",
        `Work email: ${email}`,
      ],
      company || name || email,
    );
  };

  return (
    <form className="doeinsure-form doeinsure-form--intake" onSubmit={onSubmit}>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.name}</span>
        <input value={name} onChange={(event) => setName(event.target.value)} name="name" autoComplete="name" required />
      </label>
      <label className="doeinsure-field">
        <span>{DOEINSURE_CTA.fields.company}</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          name="company"
          autoComplete="organization"
          required
        />
      </label>
      <label className="doeinsure-field">
        <span>
          {DOEINSURE_CTA.fields.website}
          <em>{DOEINSURE_CTA.fields.websiteHint}</em>
        </span>
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
        <span>{DOEINSURE_CTA.fields.email}</span>
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
        {DOEINSURE_CTA.submit}
      </button>
    </form>
  );
}

function PolicyPreview() {
  const [index, setIndex] = useState(0);
  const policy = DOEINSURE_POLICY_SAMPLES[index];

  return (
    <button
      type="button"
      className="doeinsure-card doeinsure-card--click doeinsure-hero__file"
      aria-label="Sample policy. Click to see another."
      onClick={() => setIndex((current) => (current + 1) % DOEINSURE_POLICY_SAMPLES.length)}
    >
      <div className="doeinsure-card__kicker">
        <span>{policy.kicker}</span>
        <span>{policy.id}</span>
      </div>
      <p className="doeinsure-card__name" key={`${policy.id}-name`}>
        {policy.name}
      </p>
      <p className="doeinsure-card__limit" key={`${policy.id}-limit`}>
        {policy.limit}
      </p>
      <p className="doeinsure-card__meta">{policy.limitLabel}</p>
      <div className="doeinsure-pills">
        <span className="doeinsure-pill">{policy.status}</span>
        <span className="doeinsure-pill doeinsure-pill--outline">{policy.rider}</span>
      </div>
      <span className="doeinsure-card__insured-label">{policy.insuredLabel}</span>
      <span className="doeinsure-card__insured">{policy.insured}</span>
      <span className="doeinsure-card__hint">
        {index + 1} / {DOEINSURE_POLICY_SAMPLES.length} · click for another sample
      </span>
    </button>
  );
}

function UnderwriteBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeInsurePageVariant();
  const stepMs = variant === "phone" ? UNDERWRITE_STEP_MS_IPHONE : UNDERWRITE_STEP_MS;
  const [index, setIndex] = useState(-1);
  const [auto, setAuto] = useState(false);
  const items = DOEINSURE_UNDERWRITE.items;
  const complete = index >= items.length;

  useEffect(() => {
    if (!revealed) return;
    setIndex(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setIndex((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, index, stepMs]);

  return (
    <>
      <h2>{DOEINSURE_UNDERWRITE.title}</h2>
      <div
        className={`doeinsure-checks${complete ? " is-complete" : ""}${index >= 0 && !complete ? " is-reading" : ""}`}
        style={{ "--underwrite-step-ms": `${stepMs}ms` } as CSSProperties}
      >
        {items.map((item, itemIndex) => {
          const on = itemIndex < index;
          const reading = itemIndex === index && !complete;
          return (
            <div
              key={item}
              className={`doeinsure-check${on ? " is-on" : ""}${reading ? " is-reading" : ""}`}
              aria-current={reading ? "step" : undefined}
            >
              <i aria-hidden="true" />
              {item}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function DoeInsurePageContent() {
  const [email, setEmail] = useState("");
  const [stat, setStat] = useState(0);
  const { ladderRef, activeIndex: stage } = useDoeInsureLadderScroll(DOEINSURE_STAGES.items.length);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <>
      <section className="doeinsure-hero" id="top">
        <div className="doeinsure-hero__stage">
          <div className="doeinsure-wrap doeinsure-hero__grid">
            <div className="doeinsure-hero__copy">
              <h1 className="doeinsure-hero__title">
                {DOEINSURE_HERO.headline.map((line, index) => (
                  <span
                    key={line}
                    className={`doeinsure-hero__line${index === DOEINSURE_HERO.headline.length - 1 ? " doeinsure-hero__line--accent" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p className="doeinsure-hero__lede">{DOEINSURE_HERO.lede}</p>
              <DoeInsureHeroEmailForm email={email} onEmailChange={setEmail} />
              <a className="doeinsure-hero__secondary" href="#scale">
                {DOEINSURE_HERO.secondaryCta}
              </a>
            </div>
            <PolicyPreview />
          </div>
        </div>
        <div className="doeinsure-stats" aria-label="Doe Insure at a glance">
          <div className="doeinsure-wrap doeinsure-stats__row">
            {DOEINSURE_STATS.map((item, index) => (
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

      <section className="doeinsure-section" id="stages">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>
              {DOEINSURE_STAGES.title.map((line) => (
                <span key={line} className="doeinsure-stages-title__line">
                  {line}
                </span>
              ))}
            </h2>
            <div className="doeinsure-ladder" ref={ladderRef}>
              {DOEINSURE_STAGES.items.map((item, index) => {
                const filled = stage === index;
                return (
                  <div
                    key={item.id}
                    className={`doeinsure-rung${filled ? " is-filled" : ""}`}
                    style={{ "--rung": index } as CSSProperties}
                    aria-current={filled ? "step" : undefined}
                  >
                    <b className="doeinsure-rung__limit">{item.limit}</b>
                    <span className="doeinsure-rung__who">
                      <h3>{item.name}</h3>
                      <em>{item.badge}</em>
                    </span>
                    <StageTags tags={item.tags} />
                    <ul>
                      {item.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <DoeInsureSellSections />

      <section className="doeinsure-section doeinsure-section--gray" id="underwrite">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>{(revealed) => <UnderwriteBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section" id="faq">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_FAQ.title}</h2>
            <div className="doeinsure-faq">
              {DOEINSURE_FAQ.items.map((item, index) => {
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

      <section className="doeinsure-section doeinsure-section--gray" id="request">
        <div className="doeinsure-wrap">
          <DoeInsureReveal className="doeinsure-cta-grid">
            <div>
              <h2>{DOEINSURE_CTA.title}</h2>
              <p className="doeinsure-hero__lede">{DOEINSURE_CTA.body}</p>
            </div>
            <DoeInsureIntakeForm email={email} onEmailChange={setEmail} />
          </DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
