"use client";

import type { CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEHOME_CHART,
  DOEHOME_CONNECT,
  DOEHOME_FABRIC,
  DOEHOME_FLOAT,
  DOEHOME_GENOME,
  DOEHOME_HANDOFF,
  DOEHOME_OPEN,
  DOEHOME_PULSE,
} from "@/lib/doehome/doehome-copy";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 5, variant === "phone" ? 680 : 520);
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];
  const provider = DOEHOME_GENOME.providers[0];

  return (
    <div className="doehome-core">
      <header className="doehome-genome__head">
        <p className="doehome-genome__kicker">Genome</p>
        <h2 className="doehome-genome__title">
          {DOEHOME_GENOME.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_GENOME.lede}</p>
      </header>

      <div className={`doehome-strata${complete ? " is-on" : ""}`} aria-hidden="true">
        <p className={`doehome-strata__ghost${lit >= 1 ? " is-on" : ""}`}>
          <s>{DOEHOME_GENOME.genericLabel}</s>
          <span>{DOEHOME_GENOME.genericNote}</span>
        </p>

        <ol>
          <li className={`doehome-strata__layer${lit >= 1 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.groupLabel}</span>
            <b>{DOEHOME_GENOME.group.name}</b>
            <em>{DOEHOME_GENOME.group.count}</em>
          </li>
          <li className={`doehome-strata__layer doehome-strata__layer--clinic${lit >= 2 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.clinicLabel}</span>
            <b>{harbor.model}</b>
            <em>
              {harbor.name} · {harbor.version}
            </em>
            <ul>
              {DOEHOME_GENOME.clinics.map((item) => (
                <li key={item.id} className={item.id === harbor.id ? "is-this" : undefined}>
                  {item.name}
                </li>
              ))}
            </ul>
          </li>
          <li className={`doehome-strata__layer${lit >= 3 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.providerLabel}</span>
            <b>{provider.model}</b>
            <em>{provider.note}</em>
          </li>
          <li className={`doehome-strata__layer${lit >= 4 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.clinicPathLabel}</span>
            <b>{DOEHOME_GENOME.router.clinic.join(" · ")}</b>
            <em>
              {DOEHOME_GENOME.frontierLabel}: {DOEHOME_GENOME.router.frontier.join(" · ")}
            </em>
          </li>
          <li className={`doehome-strata__layer doehome-strata__layer--train${lit >= 5 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.trainLabel}</span>
            <b>{DOEHOME_GENOME.trainCta}</b>
            <em>
              {DOEHOME_GENOME.trainWhen} · {DOEHOME_GENOME.trainSignals}
            </em>
          </li>
        </ol>
      </div>
    </div>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 6, variant === "phone" ? 720 : 560);
  const caller = DOEHOME_PULSE.call.turns.filter((turn) => turn.who !== DOEHOME_PULSE.call.agent);
  const agent = DOEHOME_PULSE.call.turns.filter((turn) => turn.who === DOEHOME_PULSE.call.agent);

  return (
    <>
      <header className="doehome-pulse__head">
        <p className="doehome-pulse__kicker">Pulse</p>
        <h2 className="doehome-pulse__title">
          {DOEHOME_PULSE.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-pulse__lede">{DOEHOME_PULSE.lede}</p>
      </header>

      <div className={`doehome-script${complete ? " is-on" : ""}`}>
        <p className={`doehome-script__line${lit >= 1 ? " is-on" : ""}`}>
          <span>{DOEHOME_PULSE.number}</span>
          <b>
            {DOEHOME_PULSE.call.agent} · {DOEHOME_PULSE.live}
          </b>
        </p>
        <div className="doehome-script__cols">
          <ol>
            {caller.map((turn, index) => (
              <li key={`c-${index}`} className={lit >= 2 + index ? "is-on" : undefined}>
                <span>{turn.who}</span>
                {turn.text}
              </li>
            ))}
          </ol>
          <ol className="doehome-script__agent">
            {agent.map((turn, index) => (
              <li key={`a-${index}`} className={lit >= 3 + index ? "is-on" : undefined}>
                <span>{turn.who}</span>
                {turn.text}
              </li>
            ))}
          </ol>
        </div>
        <ul className="doehome-script__nights">
          {DOEHOME_PULSE.nights.items.map((item) => (
            <li key={item.task} className={lit >= 5 ? "is-on" : undefined}>
              <span>{item.at}</span>
              <b>{item.task}</b>
              <em>{item.done}</em>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, DOEHOME_FABRIC.steps.length, variant === "phone" ? 640 : 480);

  return (
    <>
      <header className="doehome-fabric__head">
        <p className="doehome-fabric__kicker">Fabric</p>
        <h2 className="doehome-fabric__title">
          {DOEHOME_FABRIC.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-fabric__lede">{DOEHOME_FABRIC.lede}</p>
      </header>

      <div className={`doehome-deck${complete ? " is-on" : ""}`}>
        <p className="doehome-deck__runs">{DOEHOME_FABRIC.runsOn}</p>
        <div className="doehome-deck__stack">
          {DOEHOME_FABRIC.steps.map((step, index) => (
            <article
              key={step.id}
              className={`${index < lit ? "is-on" : ""}${step.id === "human" ? " is-human" : ""}`.trim()}
              style={{ "--deck-i": index } as CSSProperties}
            >
              <span>{step.kicker}</span>
              <b>{step.label}</b>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 4, variant === "phone" ? 620 : 480);
  const denial = DOEHOME_FLOAT.denials[0];

  return (
    <>
      <header className="doehome-float__head">
        <p className="doehome-float__kicker">Float</p>
        <h2 className="doehome-float__title">
          {DOEHOME_FLOAT.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-float__lede">{DOEHOME_FLOAT.lede}</p>
      </header>

      <div className={`doehome-eob${complete ? " is-on" : ""}`}>
        <header className={lit >= 1 ? "is-on" : undefined}>
          <span>{DOEHOME_FLOAT.hold.payer}</span>
          <b>Remittance · Harbor</b>
        </header>
        <dl>
          <div className={lit >= 2 ? "is-on" : undefined}>
            <dt>{DOEHOME_FLOAT.allowedLabel}</dt>
            <dd>{DOEHOME_FLOAT.allowed}</dd>
          </div>
          <div className={lit >= 2 ? "is-on" : undefined}>
            <dt>{DOEHOME_FLOAT.paidAmtLabel}</dt>
            <dd>{DOEHOME_FLOAT.paidAmt}</dd>
          </div>
          <div className={`doehome-eob__keep${lit >= 3 ? " is-on" : ""}`}>
            <dt>{DOEHOME_FLOAT.underLabel}</dt>
            <dd>{DOEHOME_FLOAT.underpay}</dd>
          </div>
        </dl>
        <p className={`doehome-eob__note${lit >= 3 ? " is-on" : ""}`}>{DOEHOME_FLOAT.underpayNote}</p>
        <p className={`doehome-eob__hold${lit >= 4 ? " is-on" : ""}`}>
          <b>
            {DOEHOME_FLOAT.hold.status} {DOEHOME_FLOAT.hold.timer}
          </b>
          <span>{DOEHOME_FLOAT.hold.note}</span>
        </p>
        {denial ? (
          <p className={`doehome-eob__due${lit >= 4 ? " is-on" : ""}`}>
            {denial.payer} · {denial.reason} · {denial.due}
          </p>
        ) : null}
      </div>
    </>
  );
}

function ChartBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 4, variant === "phone" ? 640 : 500);

  return (
    <>
      <header className="doehome-extra__head">
        <p className="doehome-genome__kicker">{DOEHOME_CHART.kicker}</p>
        <h2 className="doehome-extra__title">
          {DOEHOME_CHART.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_CHART.lede}</p>
      </header>
      <div className={`doehome-sheet${complete ? " is-on" : ""}`}>
        <header className={lit >= 1 ? "is-on" : undefined}>
          <span>{DOEHOME_CHART.clinic}</span>
          <b>{DOEHOME_CHART.patient}</b>
        </header>
        <ul>
          {DOEHOME_CHART.fields.map((field, index) => (
            <li key={field.k} className={lit >= 2 + index ? "is-on" : undefined}>
              <span>{field.k}</span>
              <b>{field.v}</b>
            </li>
          ))}
        </ul>
        <p className={lit >= 4 ? "is-on" : undefined}>{DOEHOME_CHART.sources.join(" · ")}</p>
      </div>
    </>
  );
}

function HandoffBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 4, variant === "phone" ? 660 : 520);

  return (
    <>
      <header className="doehome-extra__head">
        <p className="doehome-genome__kicker">{DOEHOME_HANDOFF.kicker}</p>
        <h2 className="doehome-extra__title">
          {DOEHOME_HANDOFF.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_HANDOFF.lede}</p>
      </header>
      <div className={`doehome-pass${complete ? " is-on" : ""}`}>
        <article className={lit >= 1 ? "is-on" : undefined}>
          <span>{DOEHOME_HANDOFF.agent.role}</span>
          <b>{DOEHOME_HANDOFF.agent.name}</b>
        </article>
        <div className={`doehome-pass__mid${lit >= 2 ? " is-on" : ""}`}>
          <ul>
            {DOEHOME_HANDOFF.context.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <em className={lit >= 3 ? "is-on" : undefined}>{DOEHOME_HANDOFF.cta}</em>
        </div>
        <article className={`doehome-pass__human${lit >= 4 ? " is-on" : ""}`}>
          <span>{DOEHOME_HANDOFF.human.role}</span>
          <b>{DOEHOME_HANDOFF.human.name}</b>
        </article>
      </div>
    </>
  );
}

function ConnectBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 4, variant === "phone" ? 620 : 480);

  return (
    <>
      <header className="doehome-extra__head">
        <p className="doehome-genome__kicker">{DOEHOME_CONNECT.kicker}</p>
        <h2 className="doehome-extra__title">
          {DOEHOME_CONNECT.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_CONNECT.lede}</p>
      </header>
      <div className={`doehome-ports${complete ? " is-on" : ""}`}>
        <ul>
          {DOEHOME_CONNECT.ports.map((port, index) => (
            <li key={port.name} className={index < lit ? "is-on" : undefined}>
              <span>{port.kind}</span>
              <b>{port.name}</b>
              <i />
            </li>
          ))}
        </ul>
        <p className={lit >= 4 ? "is-on" : undefined}>{DOEHOME_CONNECT.hub}</p>
      </div>
    </>
  );
}

function OpenBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit, complete } = useDoeHomeStep(revealed, 4, variant === "phone" ? 640 : 500);

  return (
    <>
      <header className="doehome-extra__head">
        <p className="doehome-genome__kicker">{DOEHOME_OPEN.kicker}</p>
        <h2 className="doehome-extra__title">
          {DOEHOME_OPEN.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_OPEN.lede}</p>
      </header>
      <div className={`doehome-door${complete ? " is-on" : ""}`}>
        <p className={`doehome-door__sign${lit >= 1 ? " is-on" : ""}`}>
          <s className={lit >= 2 ? "is-off" : undefined}>{DOEHOME_OPEN.closed}</s>
          <b className={lit >= 2 ? "is-on" : undefined}>{DOEHOME_OPEN.opened}</b>
        </p>
        <ul>
          {DOEHOME_OPEN.items.map((item, index) => (
            <li key={item.task} className={lit >= 3 + Math.min(index, 1) ? "is-on" : undefined}>
              <span>{item.at}</span>
              <b>{item.task}</b>
              <em>{item.done}</em>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function DoeHomeFeatureSections() {
  return (
    <>
      <section className="doeinsure-section doehome-feature doehome-feature--core" id="genome">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <GenomeBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="pulse">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="left">{(revealed) => <PulseBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="fabric">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="right">{(revealed) => <FabricBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="float">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <FloatBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="chart">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="left">{(revealed) => <ChartBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="handoff">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="right">{(revealed) => <HandoffBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section" id="connect">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="rise">{(revealed) => <ConnectBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
      <section className="doeinsure-section doeinsure-section--gray" id="open">
        <div className="doeinsure-wrap">
          <DoeInsureReveal variant="left">{(revealed) => <OpenBody revealed={revealed} />}</DoeInsureReveal>
        </div>
      </section>
    </>
  );
}
