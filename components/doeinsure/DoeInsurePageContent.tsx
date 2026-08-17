"use client";

import { FormEvent, useState, type CSSProperties } from "react";

import { DoeInsureHowApp } from "@/components/doeinsure/DoeInsureAppUi";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DoeInsureSellSections } from "@/components/doeinsure/DoeInsureSellSections";
import {
  DOEINSURE_CONTACT_EMAIL,
  DOEINSURE_COMPARE,
  DOEINSURE_CONNECT,
  DOEINSURE_COVERAGE,
  DOEINSURE_CTA,
  DOEINSURE_FAQ,
  DOEINSURE_HERO,
  DOEINSURE_HOW,
  DOEINSURE_LIMITS,
  DOEINSURE_NEXT,
  DOEINSURE_POLICY_SAMPLES,
  DOEINSURE_STATS,
  DOEINSURE_STAGES,
  DOEINSURE_UNDERWRITE,
  DOEINSURE_WHO,
} from "@/lib/doeinsure/doeinsure-copy";
import { useDoeInsureLadderScroll } from "@/lib/doeinsure/use-doeinsure-ladder-scroll";

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

export function DoeInsurePageContent() {
  const [email, setEmail] = useState("");
  const [stat, setStat] = useState(0);
  const [cover, setCover] = useState(0);
  const { ladderRef, activeIndex: stage } = useDoeInsureLadderScroll(DOEINSURE_STAGES.items.length);
  const [who, setWho] = useState(0);
  const [how, setHow] = useState(0);
  const [linked, setLinked] = useState<Record<string, boolean>>({ AWS: true, GitHub: true });
  const [compare, setCompare] = useState<"old" | "next">("next");
  const [next, setNext] = useState(0);
  const [limit, setLimit] = useState(1);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [faq, setFaq] = useState<number | null>(0);

  const activeCover = DOEINSURE_COVERAGE.items[cover];
  const activeLimit = DOEINSURE_LIMITS.items[limit];
  const linkedCount = DOEINSURE_CONNECT.items.filter((item) => linked[item.name]).length;

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

      <section className="doeinsure-section" id="coverage">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_COVERAGE.title}</h2>
            <div className="doeinsure-catalog">
              <div className="doeinsure-catalog__nav" role="tablist" aria-label="Coverage lines">
                {DOEINSURE_COVERAGE.items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={cover === index}
                    className={cover === index ? "is-on" : undefined}
                    onClick={() => setCover(index)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="doeinsure-catalog__pane" role="tabpanel" key={activeCover.id}>
                <span>{String(cover + 1).padStart(2, "0")}</span>
                <h3>{activeCover.name}</h3>
                <p>{activeCover.body}</p>
              </div>
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="who">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_WHO.title}</h2>
            <div className="doeinsure-who-list">
              {DOEINSURE_WHO.items.map((item, index) => {
                const open = who === index;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`doeinsure-who-row${open ? " is-on" : ""}`}
                    aria-expanded={open}
                    onClick={() => setWho(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="doeinsure-who-row__copy">
                      <h3>{item.name}</h3>
                      <span className={`doeinsure-fold${open ? " is-on" : ""}`}>
                        <span>
                          <p>{item.body}</p>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section" id="how">
        <div className="doeinsure-wrap">
          <DoeInsureReveal className="doeinsure-split">
            <div>
              <h2>{DOEINSURE_HOW.title}</h2>
              <div className="doeinsure-stepper">
                <div className="doeinsure-stepper__nav" role="tablist" aria-label="How it works">
                  {DOEINSURE_HOW.steps.map((step, index) => (
                    <button
                      key={step.n}
                      type="button"
                      role="tab"
                      aria-selected={how === index}
                      className={how === index ? "is-on" : undefined}
                      onClick={() => setHow(index)}
                    >
                      <span>{step.n}</span>
                      {step.name}
                    </button>
                  ))}
                </div>
                <div className="doeinsure-stepper__pane" key={DOEINSURE_HOW.steps[how].n}>
                  <h3>{DOEINSURE_HOW.steps[how].name}</h3>
                  <p>{DOEINSURE_HOW.steps[how].body}</p>
                </div>
              </div>
            </div>
            <DoeInsureHowApp step={how} />
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="connect">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_CONNECT.title}</h2>
            <p className="doeinsure-hero__lede">{DOEINSURE_CONNECT.lede}</p>
            <p className="doeinsure-connect__count">
              {linkedCount} of {DOEINSURE_CONNECT.items.length} connected
            </p>
            <ul className="doeinsure-connect">
              {DOEINSURE_CONNECT.items.map((item) => {
                const on = Boolean(linked[item.name]);
                return (
                  <li key={item.name} className={on ? "is-on" : undefined}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{on ? item.body : item.reads}</p>
                    </div>
                    <button
                      type="button"
                      className={`doeinsure-inline${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() =>
                        setLinked((current) => ({ ...current, [item.name]: !current[item.name] }))
                      }
                    >
                      {on ? DOEINSURE_CONNECT.done : DOEINSURE_CONNECT.action}
                    </button>
                  </li>
                );
              })}
            </ul>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_COMPARE.title}</h2>
            <div className="doeinsure-compare-toggle" role="tablist" aria-label="Compare">
              {DOEINSURE_COMPARE.columns.map((column, index) => {
                const key = index === 0 ? "old" : "next";
                return (
                  <button
                    key={column}
                    type="button"
                    role="tab"
                    aria-selected={compare === key}
                    className={compare === key ? "is-on" : undefined}
                    onClick={() => setCompare(key)}
                  >
                    {column}
                  </button>
                );
              })}
            </div>
            <div className="doeinsure-compare" role="table">
              {DOEINSURE_COMPARE.rows.map((row) => (
                <div key={row.label} className="doeinsure-compare__row" role="row">
                  <span role="rowheader">{row.label}</span>
                  <span role="cell" className={compare === "next" ? "is-next" : "is-old"}>
                    {compare === "next" ? row.next : row.old}
                  </span>
                </div>
              ))}
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_NEXT.title}</h2>
            <ol className="doeinsure-line">
              {DOEINSURE_NEXT.steps.map((step, index) => {
                const open = next === index;
                return (
                  <li key={step.n} className={open ? "is-on" : undefined}>
                    <button type="button" aria-expanded={open} onClick={() => setNext(index)}>
                      <span>{step.n}</span>
                      <strong>{step.name}</strong>
                    </button>
                    <div className={`doeinsure-fold${open ? " is-on" : ""}`}>
                      <div>
                        <p>{step.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_LIMITS.title}</h2>
            <div className="doeinsure-limit-nav" role="tablist" aria-label="Working limits">
              {DOEINSURE_LIMITS.items.map((item, index) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={limit === index}
                  className={limit === index ? "is-on" : undefined}
                  onClick={() => setLimit(index)}
                >
                  <b>{item.value}</b>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="doeinsure-limit-pane" key={activeLimit.value}>
              <p>{activeLimit.note}</p>
              <ul>
                {activeLimit.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </DoeInsureReveal>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="underwrite">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2>{DOEINSURE_UNDERWRITE.title}</h2>
            <div className="doeinsure-checks">
              {DOEINSURE_UNDERWRITE.items.map((item) => {
                const on = Boolean(checks[item]);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`doeinsure-check${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    onClick={() => setChecks((current) => ({ ...current, [item]: !current[item] }))}
                  >
                    <i aria-hidden="true" />
                    {item}
                  </button>
                );
              })}
            </div>
          </DoeInsureReveal>
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
