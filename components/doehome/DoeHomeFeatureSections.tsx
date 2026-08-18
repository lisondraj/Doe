"use client";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  DOEHOME_FABRIC,
  DOEHOME_FLOAT,
  DOEHOME_GENOME,
  DOEHOME_PULSE,
} from "@/lib/doehome/doehome-copy";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 700 : 540;
  const { lit, complete } = useDoeHomeStep(revealed, 7, stepMs);
  const clinicsOn = lit >= 2;
  const harborOn = lit >= 3;
  const providersOn = lit >= 4;
  const chenOn = lit >= 5;
  const pathsOn = lit >= 6;
  const trainOn = complete;
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];

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

      <div className={`doehome-nest${complete ? " is-on" : ""}`} aria-hidden="true">
        <div className="doehome-nest__compare">
          <p className={lit >= 1 ? "is-on" : undefined}>
            <b>{DOEHOME_GENOME.genericLabel}</b>
            <span>{DOEHOME_GENOME.genericNote}</span>
          </p>
          <p className={harborOn ? "is-on is-yours" : undefined}>
            <b>{DOEHOME_GENOME.yoursLabel}</b>
            <span>{DOEHOME_GENOME.yoursNote}</span>
          </p>
        </div>

        <div className={`doehome-nest__group${lit >= 1 ? " is-on" : ""}`}>
          <header>
            <span>{DOEHOME_GENOME.groupLabel}</span>
            <b>{DOEHOME_GENOME.group.name}</b>
            <em>{DOEHOME_GENOME.group.count}</em>
          </header>

          <ul className="doehome-nest__sites">
            {DOEHOME_GENOME.clinics.map((item) => {
              const selected = item.id === harbor.id && harborOn;
              return (
                <li
                  key={item.id}
                  className={`${clinicsOn ? "is-on" : ""}${selected ? " is-selected" : ""}`.trim()}
                >
                  <b>{item.name}</b>
                  <em>{item.version}</em>
                </li>
              );
            })}
          </ul>

          <div className={`doehome-nest__clinic${harborOn ? " is-on" : ""}`}>
            <header>
              <span>{DOEHOME_GENOME.clinicLabel}</span>
              <b>
                {harbor.model} · {harbor.version}
              </b>
            </header>

            <ul className="doehome-nest__mds">
              {DOEHOME_GENOME.providers.map((item, index) => (
                <li
                  key={item.id}
                  className={`${providersOn ? "is-on" : ""}${index === 0 && chenOn ? " is-focus" : ""}`.trim()}
                >
                  <span>{DOEHOME_GENOME.providerLabel}</span>
                  <b>{item.name}</b>
                  <em>{item.note}</em>
                </li>
              ))}
            </ul>

            <ul className="doehome-nest__dna">
              {DOEHOME_GENOME.submodels.map((item, index) => (
                <li key={item.id} className={chenOn && index <= 2 ? "is-on" : undefined}>
                  {item.task}
                </li>
              ))}
            </ul>

            <div className={`doehome-nest__paths${pathsOn ? " is-on" : ""}`}>
              <p className="doehome-nest__path doehome-nest__path--clinic">
                <span>{DOEHOME_GENOME.clinicPathLabel}</span>
                <b>{DOEHOME_GENOME.router.clinic.join(" · ")}</b>
              </p>
              <p className="doehome-nest__path doehome-nest__path--frontier">
                <span>{DOEHOME_GENOME.frontierLabel}</span>
                <b>{DOEHOME_GENOME.router.frontier.join(" · ")}</b>
              </p>
            </div>
          </div>

          <div className={`doehome-nest__train${trainOn ? " is-on" : ""}`}>
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
    </div>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 760 : 600;
  const { lit, complete } = useDoeHomeStep(
    revealed,
    DOEHOME_PULSE.agents.length + DOEHOME_PULSE.call.turns.length,
    stepMs,
  );
  const linesLit = Math.min(DOEHOME_PULSE.agents.length, lit);
  const turnsLit = Math.max(0, lit - DOEHOME_PULSE.agents.length);
  const liveId = DOEHOME_PULSE.agents[0]?.id;

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

      <div className={`doehome-board${complete ? " is-on" : ""}`}>
        <div className="doehome-board__switch">
          <header>
            <span>{DOEHOME_PULSE.call.line}</span>
            <b>{DOEHOME_PULSE.number}</b>
          </header>
          <ul>
            {DOEHOME_PULSE.agents.map((agent, index) => {
              const on = index < linesLit;
              const live = agent.id === liveId && on;
              return (
                <li key={agent.id} className={`${on ? "is-on" : ""}${live ? " is-live" : ""}`.trim()}>
                  <i aria-hidden="true" />
                  <div>
                    <b>{agent.name}</b>
                    <span>
                      {agent.voice} · {agent.language} · {agent.hours}
                    </span>
                  </div>
                  <em>{live ? DOEHOME_PULSE.live : agent.state}</em>
                  <strong>{agent.time}</strong>
                  {live ? (
                    <div className="doehome-board__live">
                      <span className="doehome-board__wave" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      {DOEHOME_PULSE.call.turns.map((turn, turnIndex) => (
                        <p key={`${turn.who}-${turnIndex}`} className={turnIndex < turnsLit ? "is-on" : undefined}>
                          <b>{turn.who}</b>
                          {turn.text}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <ol className="doehome-board__night">
          <li className="doehome-board__night-head">{DOEHOME_PULSE.nights.label}</li>
          <li className="doehome-board__spine" aria-hidden="true">
            <span>6p</span>
            <span>12a</span>
            <span>8a</span>
          </li>
          {DOEHOME_PULSE.nights.items.map((item, index) => (
            <li key={item.task} className={complete || index < turnsLit ? "is-on" : undefined}>
              <b>{item.task}</b>
              <span>{item.at}</span>
              <em>back {item.done}</em>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 680 : 520;
  const { lit, complete } = useDoeHomeStep(revealed, 4, stepMs);
  const start = DOEHOME_FABRIC.steps[0];
  const branch = DOEHOME_FABRIC.steps[1];
  const thenStep = DOEHOME_FABRIC.steps[2];
  const human = DOEHOME_FABRIC.steps[3];

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

      <div className={`doehome-flow${complete ? " is-on" : ""}`}>
        <p className="doehome-flow__runs">{DOEHOME_FABRIC.runsOn}</p>
        <ol>
          <li className={lit >= 1 ? "is-on" : undefined}>
            <span>{start.kicker}</span>
            <b>{start.label}</b>
          </li>
          <li className={lit >= 2 ? "is-on" : undefined}>
            <span>{branch.kicker}</span>
            <b>{branch.label}</b>
          </li>
          <li className={`doehome-flow__split${lit >= 3 ? " is-on" : ""}`}>
            <div className={lit >= 3 ? "is-on" : undefined}>
              <span>{thenStep.kicker}</span>
              <b>{thenStep.label}</b>
            </div>
            <div className={lit >= 4 ? "is-on doehome-flow__human" : "doehome-flow__human"}>
              <span>{human.kicker}</span>
              <b>{human.label}</b>
            </div>
          </li>
        </ol>
      </div>
    </>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const stepMs = variant === "phone" ? 640 : 500;
  const { lit, complete } = useDoeHomeStep(revealed, 4, stepMs);
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

      <div className={`doehome-gap${complete ? " is-on" : ""}`}>
        <div className={`doehome-gap__sum${lit >= 1 ? " is-on" : ""}`}>
          <b>{DOEHOME_FLOAT.underpay}</b>
          <span>{DOEHOME_FLOAT.underpayNote}</span>
        </div>
        <div className={`doehome-gap__bars${lit >= 2 ? " is-on" : ""}`}>
          <p>
            <span>{DOEHOME_FLOAT.contractLabel}</span>
            <i style={{ width: `${DOEHOME_FLOAT.contract}%` }} />
          </p>
          <p>
            <span>{DOEHOME_FLOAT.paidLabel}</span>
            <i className="doehome-gap__paid" style={{ width: `${DOEHOME_FLOAT.paid}%` }} />
          </p>
        </div>
        <div className={`doehome-gap__hold${lit >= 3 ? " is-on" : ""}`}>
          <em />
          <b>
            {DOEHOME_FLOAT.hold.status} {DOEHOME_FLOAT.hold.timer}
          </b>
          <span>
            {DOEHOME_FLOAT.hold.payer} · {DOEHOME_FLOAT.hold.task}
          </span>
          <small>{DOEHOME_FLOAT.hold.note}</small>
        </div>
        {denial ? (
          <p className={`doehome-gap__due${lit >= 4 ? " is-on" : ""}`}>
            <span>{denial.due}</span>
            <b>
              {denial.payer} · {denial.reason}
            </b>
          </p>
        ) : null}
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
    </>
  );
}
