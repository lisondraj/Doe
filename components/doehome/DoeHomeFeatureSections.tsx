"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEHOME_FABRIC,
  DOEHOME_FLOAT,
  DOEHOME_GENOME,
  DOEHOME_PULSE,
} from "@/lib/doehome/doehome-copy";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";

function useSteppedReveal(revealed: boolean, count: number, stepMs: number) {
  const [lit, setLit] = useState(0);
  const [auto, setAuto] = useState(false);
  const complete = lit >= count;

  useEffect(() => {
    if (!revealed) return;
    setLit(0);
    setAuto(true);
  }, [revealed]);

  useEffect(() => {
    if (!auto || complete) return undefined;
    const id = window.setTimeout(() => setLit((current) => current + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [auto, complete, lit, stepMs]);

  return { lit, complete };
}

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 640 : 480;
  const clinicCount = DOEHOME_GENOME.clinics.length;
  const providerCount = DOEHOME_GENOME.providers.length;
  const subCount = DOEHOME_GENOME.submodels.length;
  const { lit, complete } = useSteppedReveal(
    revealed,
    1 + clinicCount + providerCount + subCount + 1,
    stepMs,
  );
  const clinicsLit = Math.max(0, lit - 1);
  const providersLit = Math.max(0, lit - 1 - clinicCount);
  const subsOn = Math.max(0, lit - 1 - clinicCount - providerCount);
  const trainOn = complete;
  const harborIndex = DOEHOME_GENOME.clinics.findIndex((item) => item.id === "harbor");
  const clinic = DOEHOME_GENOME.clinics[harborIndex] ?? DOEHOME_GENOME.clinics[0];
  const provider = DOEHOME_GENOME.providers[0];
  const harborOn = clinicsLit > harborIndex;
  const providerOn = providersLit > 0;

  return (
    <>
      <header className="doehome-genome__head">
        <p className="doehome-genome__kicker">Genome</p>
        <h2 className="doehome-genome__title">
          {DOEHOME_GENOME.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_GENOME.lede}</p>
      </header>

      <div className={`doehome-genome${complete ? " is-on" : ""}`}>
        <div className="doehome-genome__cols">
          <div className={`doehome-genome__col${lit >= 1 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.groupLabel}</span>
            <b>{DOEHOME_GENOME.group.name}</b>
            <em>{DOEHOME_GENOME.group.count}</em>
          </div>
          <div className={`doehome-genome__col${harborOn ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.clinicLabel}</span>
            <b>{clinic.name}</b>
            <em>
              {clinic.model} · {clinic.version}
            </em>
          </div>
          <div className={`doehome-genome__col${providerOn ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.providerLabel}</span>
            <b>{provider.name}</b>
            <em>{provider.note}</em>
          </div>
        </div>

        <ul className="doehome-genome__fleet">
          {DOEHOME_GENOME.clinics.map((item, index) => (
            <li
              key={item.id}
              className={`${index < clinicsLit ? "is-on" : ""}${item.id === clinic.id && harborOn ? " is-selected" : ""}`.trim()}
            >
              <b>{item.name}</b>
              <em>{item.version}</em>
            </li>
          ))}
        </ul>

        <ul className="doehome-genome__providers">
          {DOEHOME_GENOME.providers.map((item, index) => (
            <li key={item.id} className={index < providersLit ? "is-on" : undefined}>
              <span>{DOEHOME_GENOME.providerLabel}</span>
              <b>{item.name}</b>
              <em>{item.model}</em>
            </li>
          ))}
        </ul>

        <div className="doehome-genome__file">
          <header>
            <span>{DOEHOME_GENOME.modelLabel}</span>
            <b>
              {providerOn ? provider.model : clinic.model} · {clinic.version}
            </b>
          </header>
          <ul>
            {DOEHOME_GENOME.submodels.map((item, index) => (
              <li key={item.id} className={subsOn > index ? "is-on" : undefined}>
                {item.task}
              </li>
            ))}
          </ul>
          <aside className="doehome-genome__router">
            <p>
              <span>Clinic Genome</span>
              {DOEHOME_GENOME.router.clinic.map((task) => (
                <i key={task}>{task}</i>
              ))}
            </p>
            <p>
              <span>{DOEHOME_GENOME.frontierLabel}</span>
              {DOEHOME_GENOME.router.frontier.map((task) => (
                <i key={task}>{task}</i>
              ))}
            </p>
          </aside>
          <div className={`doehome-genome__train${trainOn ? " is-on" : ""}`}>
            <span>
              {DOEHOME_GENOME.trainLabel}
              <em>
                {DOEHOME_GENOME.trainWhen} · {DOEHOME_GENOME.trainSignals}
              </em>
            </span>
            <b>{DOEHOME_GENOME.trainCta}</b>
          </div>
        </div>
      </div>
    </>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 780 : 620;
  const { lit, complete } = useSteppedReveal(revealed, DOEHOME_PULSE.agents.length + DOEHOME_PULSE.call.turns.length, stepMs);
  const agentsLit = Math.min(DOEHOME_PULSE.agents.length, lit);
  const turnsLit = Math.max(0, lit - DOEHOME_PULSE.agents.length);

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

      <div className={`doehome-pulse${complete ? " is-on" : ""}`}>
        <ul className="doehome-pulse__floor">
          {DOEHOME_PULSE.agents.map((agent, index) => (
            <li key={agent.id} className={index < agentsLit ? "is-on" : undefined}>
              <b>{agent.name}</b>
              <span>
                {agent.voice} · {agent.language} · {agent.tone}
              </span>
              <em>{agent.state}</em>
              <i>{agent.time}</i>
            </li>
          ))}
        </ul>
        <article className="doehome-pulse__call">
          <header>
            <span>{DOEHOME_PULSE.call.line}</span>
            <b>{DOEHOME_PULSE.call.agent}</b>
          </header>
          {DOEHOME_PULSE.call.turns.map((turn, index) => (
            <p key={`${turn.who}-${index}`} className={index < turnsLit ? "is-on" : undefined}>
              <b>{turn.who}</b>
              <span>{turn.text}</span>
            </p>
          ))}
        </article>
        <ul className="doehome-pulse__nights">
          <li className="doehome-pulse__nights-label">{DOEHOME_PULSE.nights.label}</li>
          {DOEHOME_PULSE.nights.items.map((item, index) => (
            <li key={item.task} className={complete || index < turnsLit ? "is-on" : undefined}>
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
  const stepMs = variant === "phone" ? 700 : 540;
  const { lit, complete } = useSteppedReveal(revealed, DOEHOME_FABRIC.steps.length, stepMs);

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

      <div className={`doehome-fabric${complete ? " is-on" : ""}`}>
        <div className="doehome-fabric__canvas">
          <p className="doehome-fabric__prompt">{DOEHOME_FABRIC.prompt}</p>
          <ol>
            {DOEHOME_FABRIC.steps.map((step, index) => (
              <li key={step.id} className={index < lit ? "is-on" : undefined}>
                <span>{step.kicker}</span>
                <b>{step.label}</b>
              </li>
            ))}
          </ol>
        </div>
        <ul className="doehome-fabric__library">
          {DOEHOME_FABRIC.library.map((item, index) => (
            <li key={item.id} className={index < lit ? "is-on" : undefined}>
              <b>{item.title}</b>
              <span>{item.source}</span>
              <em>{item.uses}</em>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 680 : 520;
  const { lit, complete } = useSteppedReveal(revealed, DOEHOME_FLOAT.rates.length + DOEHOME_FLOAT.denials.length, stepMs);
  const ratesLit = Math.min(DOEHOME_FLOAT.rates.length, lit);
  const denialsLit = Math.max(0, lit - DOEHOME_FLOAT.rates.length);

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

      <div className={`doehome-float${complete ? " is-on" : ""}`}>
        <article className={`doehome-float__hold${lit > 0 ? " is-on" : ""}`}>
          <span>{DOEHOME_FLOAT.hold.status}</span>
          <b>{DOEHOME_FLOAT.hold.timer}</b>
          <em>
            {DOEHOME_FLOAT.hold.payer} · {DOEHOME_FLOAT.hold.task} · {DOEHOME_FLOAT.hold.ref}
          </em>
        </article>
        <ul className="doehome-float__rates">
          {DOEHOME_FLOAT.rates.map((row, index) => (
            <li
              key={row.name}
              className={index < ratesLit ? "is-on" : undefined}
              style={{ "--float-w": `${row.paid}%` } as CSSProperties}
            >
              <span>{row.name}</span>
              <i />
              <b>{row.delta}</b>
            </li>
          ))}
        </ul>
        <ul className="doehome-float__codes">
          {DOEHOME_FLOAT.codes.map((row, index) => (
            <li key={row.code} className={index < ratesLit ? "is-on" : undefined}>
              <b>{row.code}</b>
              <span>{row.label}</span>
              <em>{row.hint}</em>
            </li>
          ))}
        </ul>
        <ul className="doehome-float__denials">
          {DOEHOME_FLOAT.denials.map((item, index) => (
            <li key={item.payer} className={index < denialsLit ? "is-on" : undefined}>
              <b>{item.payer}</b>
              <span>{item.reason}</span>
              <em>{item.due}</em>
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
      <section className="doeinsure-section" id="genome">
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
    </>
  );
}
