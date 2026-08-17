"use client";

import { FormEvent, useState } from "react";

import {
  DOEINSURE_CONTACT_EMAIL,
  DOEINSURE_CERTIFICATE,
  DOEINSURE_COMPARE,
  DOEINSURE_CONNECT,
  DOEINSURE_COVERAGE,
  DOEINSURE_CTA,
  DOEINSURE_FAQ,
  DOEINSURE_HERO,
  DOEINSURE_HOW,
  DOEINSURE_LIMITS,
  DOEINSURE_NEXT,
  DOEINSURE_PLATFORM,
  DOEINSURE_POLICY_SAMPLES,
  DOEINSURE_QUOTE,
  DOEINSURE_STATS,
  DOEINSURE_STAGES,
  DOEINSURE_UNDERWRITE,
  DOEINSURE_WHO,
} from "@/lib/doeinsure/doeinsure-copy";

function mailtoDoeInsure(lines: string[], subjectName: string) {
  const subject = encodeURIComponent(`Doe Insure — ${subjectName}`);
  const body = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.location.href = `mailto:${DOEINSURE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
      className="doeinsure-card doeinsure-card--click"
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

function LiveStackCard({
  ui,
}: {
  ui: (typeof DOEINSURE_PLATFORM.featured)[0]["ui"];
}) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const rows = "rows" in ui ? ui.rows : [];
  const connected = rows.filter((row) => "source" in row && on[row.source]).length;

  return (
    <aside className="doeinsure-card doeinsure-offer__ui">
      <div className="doeinsure-card__kicker">
        <span>{ui.kicker}</span>
        <span>{connected === rows.length ? "Quote ready" : "Waiting"}</span>
      </div>
      <ul className="doeinsure-sources">
        {rows.map((row) => {
          if (!("source" in row)) return null;
          const active = Boolean(on[row.source]);
          return (
            <li key={row.source}>
              <button
                type="button"
                className={`doeinsure-source${active ? " is-on" : ""}`}
                aria-pressed={active}
                onClick={() => setOn((current) => ({ ...current, [row.source]: !current[row.source] }))}
              >
                <span>{row.source}</span>
                <span>{row.metric}</span>
                <b>{active ? row.value : "Off"}</b>
                <i aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <span className="doeinsure-offer__foot">
        {connected === rows.length ? ui.foot : `${connected} of ${rows.length} sources connected`}
      </span>
    </aside>
  );
}

function ScaleCard({
  ui,
}: {
  ui: (typeof DOEINSURE_PLATFORM.featured)[1]["ui"];
}) {
  const [grown, setGrown] = useState(false);

  return (
    <aside className="doeinsure-card doeinsure-offer__ui">
      <div className="doeinsure-card__kicker">
        <span>{ui.kicker}</span>
        <span>{grown ? "June" : "January"}</span>
      </div>
      <ul className="doeinsure-scale">
        {ui.rows.map((row, index) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <b key={`${row.label}-${grown ? "to" : "from"}`}>{grown ? row.to : row.from}</b>
            <div className="doeinsure-meter doeinsure-meter--row" aria-hidden="true">
              <i style={{ width: grown ? "100%" : `${[16, 14, 34][index]}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="doeinsure-inline" onClick={() => setGrown((value) => !value)}>
        {grown ? "Show January" : "Run to June"}
      </button>
      <span className="doeinsure-offer__foot">{ui.foot}</span>
    </aside>
  );
}

function ContractCard({
  ui,
}: {
  ui: (typeof DOEINSURE_PLATFORM.featured)[2]["ui"];
}) {
  const [matched, setMatched] = useState(false);

  return (
    <aside className="doeinsure-card doeinsure-offer__ui">
      <div className="doeinsure-card__kicker">
        <span>{ui.kicker}</span>
        <span>{matched ? "Matched" : "Clause"}</span>
      </div>
      <p className="doeinsure-scan__clause">{ui.clause}</p>
      <div className="doeinsure-scan__limits">
        <span>
          Current
          <b key={matched ? "matched" : "open"}>{matched ? ui.to : ui.from}</b>
        </span>
        <span>
          Required
          <b>{ui.to}</b>
        </span>
      </div>
      <div className="doeinsure-meter" aria-hidden="true">
        <i style={{ width: matched ? "100%" : "10%" }} />
      </div>
      <button
        type="button"
        className={`doeinsure-pill doeinsure-pill--btn${matched ? " is-on" : ""}`}
        onClick={() => setMatched((value) => !value)}
      >
        {matched ? "Limit matched" : ui.action}
      </button>
    </aside>
  );
}

function QuoteBoard() {
  const [klass, setKlass] = useState(0);
  const [volume, setVolume] = useState(1);
  const product = DOEINSURE_QUOTE.classes[klass];
  const book = DOEINSURE_QUOTE.volumes[volume];
  const premium = product.base + Math.round((book.users / 1000) * product.perThousand);
  const fill = Math.min(92, 14 + volume * 24);

  return (
    <div className="doeinsure-quote">
      <div className="doeinsure-quote__classes" role="tablist" aria-label="Product class">
        {DOEINSURE_QUOTE.classes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={klass === index}
            className={klass === index ? "is-on" : undefined}
            onClick={() => setKlass(index)}
          >
            <b>{item.name}</b>
            <span>{item.note}</span>
          </button>
        ))}
      </div>

      <div className="doeinsure-quote__board">
        <div className="doeinsure-quote__users">
          <span>{DOEINSURE_QUOTE.usersLabel}</span>
          <div>
            {DOEINSURE_QUOTE.volumes.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={volume === index ? "is-on" : undefined}
                aria-pressed={volume === index}
                onClick={() => setVolume(index)}
              >
                {item.label}
                <b>{item.users.toLocaleString("en-US")}</b>
              </button>
            ))}
          </div>
        </div>

        <p className="doeinsure-quote__premium" key={`${product.id}-${book.label}`}>
          ${premium.toLocaleString("en-US")}
          <span>{DOEINSURE_QUOTE.unit}</span>
        </p>
        <div className="doeinsure-meter" aria-hidden="true">
          <i style={{ width: `${fill}%` }} />
        </div>
        <p className="doeinsure-quote__limit">
          {DOEINSURE_QUOTE.limitLabel}
          <b>{product.limit}</b>
        </p>
      </div>
    </div>
  );
}

function CertificateBoard() {
  const [holder, setHolder] = useState(0);
  const [issued, setIssued] = useState(false);
  const hospital = DOEINSURE_CERTIFICATE.holders[holder];

  return (
    <div className="doeinsure-coi">
      <div className="doeinsure-coi__holders" role="tablist" aria-label="Certificate holder">
        {DOEINSURE_CERTIFICATE.holders.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={holder === index}
            className={holder === index ? "is-on" : undefined}
            onClick={() => {
              setHolder(index);
              setIssued(false);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="doeinsure-coi__paper" key={`${hospital.name}-${issued ? "on" : "off"}`}>
        <div className="doeinsure-card__kicker">
          <span>{DOEINSURE_CERTIFICATE.kicker}</span>
          <span>{issued ? DOEINSURE_CERTIFICATE.issued : DOEINSURE_CERTIFICATE.pending}</span>
        </div>
        <dl>
          <div>
            <dt>{DOEINSURE_CERTIFICATE.namedLabel}</dt>
            <dd>{DOEINSURE_CERTIFICATE.named}</dd>
          </div>
          <div>
            <dt>{DOEINSURE_CERTIFICATE.holderLabel}</dt>
            <dd>{hospital.name}</dd>
          </div>
          <div>
            <dt>{DOEINSURE_CERTIFICATE.extraLabel}</dt>
            <dd>{issued ? hospital.extra : "—"}</dd>
          </div>
          <div>
            <dt>{DOEINSURE_CERTIFICATE.waiverLabel}</dt>
            <dd>{issued ? hospital.waiver : "—"}</dd>
          </div>
        </dl>
        <p className="doeinsure-coi__need">{hospital.need}</p>
        <button
          type="button"
          className={`doeinsure-inline${issued ? " is-on" : ""}`}
          onClick={() => setIssued((value) => !value)}
        >
          {issued ? DOEINSURE_CERTIFICATE.issued : DOEINSURE_CERTIFICATE.issue}
        </button>
      </div>
    </div>
  );
}

export function DoeInsurePageContent() {
  const [email, setEmail] = useState("");
  const [stat, setStat] = useState(0);
  const [more, setMore] = useState(0);
  const [cover, setCover] = useState(0);
  const [stage, setStage] = useState(3);
  const [who, setWho] = useState(0);
  const [how, setHow] = useState(0);
  const [linked, setLinked] = useState<Record<string, boolean>>({ AWS: true, GitHub: true });
  const [compare, setCompare] = useState<"old" | "next">("next");
  const [next, setNext] = useState(0);
  const [limit, setLimit] = useState(1);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [faq, setFaq] = useState<number | null>(0);

  const activeStage = DOEINSURE_STAGES.items[stage];
  const activeCover = DOEINSURE_COVERAGE.items[cover];
  const activeLimit = DOEINSURE_LIMITS.items[limit];
  const linkedCount = DOEINSURE_CONNECT.items.filter((item) => linked[item.name]).length;

  return (
    <>
      <section className="doeinsure-wrap doeinsure-hero" id="top">
        <div>
          <h1 className="doeinsure-hero__title">
            {DOEINSURE_HERO.headline.map((line) => (
              <span key={line} className="doeinsure-hero__line">
                {line}
              </span>
            ))}
          </h1>
          <p className="doeinsure-hero__lede">{DOEINSURE_HERO.lede}</p>
          <DoeInsureHeroEmailForm email={email} onEmailChange={setEmail} />
          <a className="doeinsure-hero__secondary" href="#platform">
            {DOEINSURE_HERO.secondaryCta}
          </a>
        </div>
        <PolicyPreview />
      </section>

      <section className="doeinsure-stats" aria-label="Doe Insure at a glance">
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
      </section>

      <section className="doeinsure-section" id="platform">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_PLATFORM.title}</h2>
          <div className="doeinsure-offers">
            {DOEINSURE_PLATFORM.featured.map((offer) => (
              <article key={offer.id} className="doeinsure-offer">
                <div className="doeinsure-offer__copy">
                  <span className="doeinsure-offer__n">{offer.kicker}</span>
                  <h3>{offer.name}</h3>
                  <p>{offer.problem}</p>
                  <p>
                    <b>The new way.</b> {offer.way}
                  </p>
                  <p>
                    <b>Why it matters.</b> {offer.benefit}
                  </p>
                </div>
                {offer.id === "api" ? <LiveStackCard ui={offer.ui} /> : null}
                {offer.id === "scale" ? <ScaleCard ui={offer.ui} /> : null}
                {offer.id === "contract" ? <ContractCard ui={offer.ui} /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_PLATFORM.more.title}</h2>
          <div className="doeinsure-acc">
            {DOEINSURE_PLATFORM.more.items.map((item, index) => {
              const open = more === index;
              return (
                <div key={item.id} className={`doeinsure-acc__item${open ? " is-on" : ""}`}>
                  <button
                    type="button"
                    className="doeinsure-acc__btn"
                    aria-expanded={open}
                    onClick={() => setMore(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.name}</h3>
                    <i aria-hidden="true">{open ? "–" : "+"}</i>
                  </button>
                  <div className={`doeinsure-fold${open ? " is-on" : ""}`}>
                    <div>
                      <p>{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="doeinsure-section" id="coverage">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="stages">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_STAGES.title}</h2>
          <p className="doeinsure-hero__lede">{DOEINSURE_STAGES.lede}</p>
          <div className="doeinsure-stage-rail" role="tablist" aria-label="Company stages">
            {DOEINSURE_STAGES.items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={stage === index}
                className={stage === index ? "is-on" : undefined}
                onClick={() => setStage(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="doeinsure-meter" aria-hidden="true">
            <i style={{ width: `${((stage + 1) / DOEINSURE_STAGES.items.length) * 100}%` }} />
          </div>
          <div className="doeinsure-stage-pane" key={activeStage.id}>
            <span className="doeinsure-stages__n">{String(stage + 1).padStart(2, "0")}</span>
            <div>
              <h3>{activeStage.name}</h3>
              <p className="doeinsure-stages__moment">{activeStage.moment}</p>
            </div>
            <div className="doeinsure-stages__offer">
              <ul className="doeinsure-stages__policies">
                {activeStage.policies.map((policy) => (
                  <li key={policy}>{policy}</li>
                ))}
              </ul>
              <p>{activeStage.cover}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="doeinsure-section" id="who">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="how">
        <div className="doeinsure-wrap">
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
      </section>

      <section className="doeinsure-section" id="quote">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_QUOTE.title}</h2>
          <p className="doeinsure-hero__lede">{DOEINSURE_QUOTE.lede}</p>
          <QuoteBoard />
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="connect">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_CERTIFICATE.title}</h2>
          <p className="doeinsure-hero__lede">{DOEINSURE_CERTIFICATE.lede}</p>
          <CertificateBoard />
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section">
        <div className="doeinsure-wrap">
          <h2>{DOEINSURE_UNDERWRITE.title}</h2>
          <p className="doeinsure-connect__count">
            {Object.values(checks).filter(Boolean).length} of {DOEINSURE_UNDERWRITE.items.length} reviewed
          </p>
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
        </div>
      </section>

      <section className="doeinsure-section doeinsure-section--gray" id="faq">
        <div className="doeinsure-wrap">
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
        </div>
      </section>

      <section className="doeinsure-section" id="request">
        <div className="doeinsure-wrap doeinsure-cta-grid">
          <div>
            <h2>{DOEINSURE_CTA.title}</h2>
            <p className="doeinsure-hero__lede">{DOEINSURE_CTA.body}</p>
          </div>
          <DoeInsureIntakeForm email={email} onEmailChange={setEmail} />
        </div>
      </section>
    </>
  );
}
