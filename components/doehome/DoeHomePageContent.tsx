"use client";

import { FormEvent, useState, type CSSProperties } from "react";

import { DoeHomeFeatureSections } from "@/components/doehome/DoeHomeFeatureSections";
import {
  DoeHomeIphoneStatTagline,
  DoeHomeProductWordmark,
  DoeHomeStatProductLink,
  doeHomeProductWordmarkLabel,
} from "@/components/doehome/DoeHomeProductWordmark";
import { DoeHomeShaderFrame } from "@/components/doehome/DoeHomeShaderImage";
import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEHOME_CONTACT_EMAIL,
  DOEHOME_CTA,
  DOEHOME_FAQ,
  DOEHOME_HERO,
  DOEHOME_HERO_TAPE,
  DOEHOME_IPHONE_GENOME_TAGLINE,
  DOEHOME_IPHONE_STAT_ROW,
  DOEHOME_STATS,
} from "@/lib/doehome/doehome-copy";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function mailtoDoeHome(lines: string[], subjectName: string) {
  const subject = encodeURIComponent(`Doe: ${subjectName}`);
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

function HeroTape() {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(true, DOEHOME_HERO_TAPE.lines.length + 2, variant === "phone" ? 420 : 340);

  return (
    <div className="doehome-scene doehome-scene--card doehome-scene--mid" aria-hidden="true">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <b>{DOEHOME_HERO_TAPE.title}</b>
        <span>{DOEHOME_HERO_TAPE.clinic}</span>
      </header>
      <div className="doehome-table doehome-table--3">
        <div className={`doehome-table__head${lit >= 2 ? " is-on" : ""}`}>
          {DOEHOME_HERO_TAPE.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_HERO_TAPE.lines.map((line, index) => (
          <div
            key={line.text}
            className={`doehome-table__row${index === 2 ? " is-this" : ""}${index < lit - 2 ? " is-on" : ""}`}
            style={{ "--n": index } as CSSProperties}
          >
            <b>{line.text}</b>
            <span>{line.chart}</span>
            <span>{line.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DoeHomePageContent() {
  const { variant } = useDoeHomePageVariant();
  const [email, setEmail] = useState("");
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <>
      <section className="doeinsure-hero" id="top">
        <div className="doeinsure-hero__stage">
          <div className="doeinsure-wrap doeinsure-hero__grid">
            <div className="doeinsure-hero__copy">
              <h1 className="doeinsure-hero__title">
                <span className="doeinsure-hero__line">{DOEHOME_HERO.title}</span>
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
            <DoeHomeShaderFrame src={DOEHOME_SHADERS.hero} priority>
              <HeroTape />
            </DoeHomeShaderFrame>
          </div>
        </div>
        <div className="doeinsure-stats" aria-label="Doe at a glance">
          <div className="doeinsure-wrap doeinsure-stats__row">
            {variant === "phone" ? (
              <>
                <div className="doehome-stat--iphone-genome" aria-label="Genome">
                  <a
                    className="doehome-stat-iphone-genome-link"
                    href="#genome"
                    aria-label={`Genome — ${DOEHOME_IPHONE_GENOME_TAGLINE.join(" ")}`}
                  >
                    <DoeHomeProductWordmark product="genome" iphoneProductRow />
                    <DoeHomeIphoneStatTagline label={DOEHOME_IPHONE_GENOME_TAGLINE} />
                  </a>
                </div>
                <div
                  className="doehome-stat--iphone-row"
                  role="group"
                  aria-label="Fabric, Pulse, Float"
                >
                  {DOEHOME_IPHONE_STAT_ROW.map(({ product, tagline }) => (
                    <a
                      key={product}
                      className="doehome-stat-iphone-product"
                      href={`#${product}`}
                      aria-label={`${doeHomeProductWordmarkLabel(product)} — ${tagline}`}
                    >
                      <DoeHomeProductWordmark product={product} iphoneProductRow />
                      <DoeHomeIphoneStatTagline label={tagline} />
                    </a>
                  ))}
                </div>
              </>
            ) : (
              DOEHOME_STATS.map((item) => (
                <div key={item.value} className="doeinsure-stat doehome-stat">
                  <b>{item.value}</b>
                  <span className="doehome-stat-copy">
                    <span className="doehome-stat-copy__text">{item.label}</span>
                    {"productLink" in item && item.productLink ? (
                      <DoeHomeStatProductLink product={item.productLink} />
                    ) : null}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <DoeHomeFeatureSections />

      <section className="doeinsure-section doeinsure-section--gray" id="faq">
        <div className="doeinsure-wrap">
          <DoeInsureReveal>
            <h2 className="doehome-section-title">
              {DOEHOME_FAQ.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
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

      <section className="doeinsure-section doehome-cta-strip" id="request">
        <div className="doeinsure-wrap">
          <DoeInsureReveal className="doeinsure-cta-grid">
            <div>
              <h2 className="doehome-section-title">
                {DOEHOME_CTA.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
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
