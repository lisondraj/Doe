"use client";

import type { CSSProperties, ReactNode } from "react";

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
  DOEHOME_STACK,
} from "@/lib/doehome/doehome-copy";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function Window({
  title,
  children,
  className = "",
  live = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  live?: boolean;
}) {
  return (
    <div className={`doehome-win${live ? " is-live" : ""}${className ? ` ${className}` : ""}`}>
      <div className="doehome-win__bar">
        <span className="doehome-win__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <b>{title}</b>
      </div>
      <div className="doehome-win__body">{children}</div>
    </div>
  );
}

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 640 : 500);
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];

  return (
    <div className="doehome-core">
      <header className="doehome-genome__head">
        <h2 className="doehome-section-title doehome-genome__title">
          {DOEHOME_GENOME.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_GENOME.lede}</p>
      </header>

      <Window title={DOEHOME_GENOME.groupWindowTitle} className={`doehome-map${lit >= 1 ? " is-wired" : ""}`}>
        <div className="doehome-map__tree">
          <p className="doehome-map__hub">{DOEHOME_GENOME.group.name}</p>
          <svg className="doehome-map__wires" viewBox="0 0 400 72" preserveAspectRatio="none" aria-hidden="true">
            <path d="M200 4 L200 28" />
            <path d="M200 28 L50 68" />
            <path d="M200 28 L150 68" />
            <path d="M200 28 L250 68" />
            <path d="M200 28 L350 68" />
          </svg>
          <ul className="doehome-map__sites">
            {DOEHOME_GENOME.clinics.map((item) => (
              <li key={item.id} className={item.id === harbor.id && lit >= 2 ? "is-this" : undefined}>
                <b>{item.name}</b>
                <em className="doehome-ver">{item.version}</em>
              </li>
            ))}
          </ul>
        </div>

        <div className={`doehome-map__pane${lit >= 2 ? " is-open" : ""}`}>
          <div className="doehome-map__pane-head">
            <span>{harbor.model}</span>
            <em className="doehome-ver">{harbor.version}</em>
          </div>
          <ul className="doehome-map__mds">
            {DOEHOME_GENOME.providers.map((item, index) => (
              <li key={item.id} className={lit >= 3 && index === 0 ? "is-this" : undefined}>
                <i />
                <b>{item.name}</b>
                <span>{item.model}</span>
              </li>
            ))}
          </ul>
          <div className={`doehome-map__pipes${lit >= 4 ? " is-on" : ""}`}>
            <p className="doehome-map__pipe doehome-map__pipe--model">
              <i />
              <span>{DOEHOME_GENOME.clinicPathLabel}</span>
            </p>
            <p className="doehome-map__pipe">
              <i />
              <span>{DOEHOME_GENOME.frontierLabel}</span>
            </p>
          </div>
          <div className={`doehome-map__train${lit >= 5 ? " is-on" : ""}`}>
            <span>{DOEHOME_GENOME.trainCta}</span>
            <em>{DOEHOME_GENOME.trainMeta}</em>
            <i />
          </div>
        </div>
      </Window>
    </div>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 680 : 540);

  return (
    <>
      <header className="doehome-pulse__head">
        <h2 className="doehome-section-title doehome-pulse__title">
          {DOEHOME_PULSE.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-pulse__lede">{DOEHOME_PULSE.lede}</p>
      </header>

      <div className="doehome-pulse-ui">
        <div className={`doehome-handset${lit >= 1 ? " is-live" : ""}`}>
          <i className="doehome-handset__ear" />
          <div className="doehome-handset__screen">
            <header>
              <span>{DOEHOME_PULSE.number}</span>
              <b className="doehome-pill">{DOEHOME_PULSE.call.liveLabel}</b>
            </header>
            <span className="doehome-handset__wave" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <div className="doehome-handset__chat">
              {DOEHOME_PULSE.call.turns.map((turn, index) => (
                <p
                  key={`${turn.who}-${index}`}
                  className={`doehome-bubble${turn.who === DOEHOME_PULSE.call.agent ? " doehome-bubble--agent" : ""}${lit >= 2 + index ? " is-on" : ""}`}
                >
                  {turn.text}
                </p>
              ))}
            </div>
            <span className={`doehome-handset__take${lit >= 5 ? " is-on" : ""}`}>{DOEHOME_PULSE.human}</span>
          </div>
        </div>
        <ul className="doehome-handset__lines">
          {DOEHOME_PULSE.agents.map((agent) => (
            <li key={agent.id} className={lit >= 1 && agent.state === "Live" ? "is-on" : undefined}>
              <i />
              <div>
                <b>{agent.name}</b>
                <span>
                  {agent.voice}, {agent.hours}
                </span>
              </div>
              <em>{agent.time}</em>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 600 : 460);
  const start = DOEHOME_FABRIC.steps[0];
  const branch = DOEHOME_FABRIC.steps[1];
  const thenStep = DOEHOME_FABRIC.steps[2];
  const human = DOEHOME_FABRIC.steps[3];
  const phone = variant === "phone";

  return (
    <>
      <header className="doehome-fabric__head">
        <h2 className="doehome-section-title doehome-fabric__title">
          {DOEHOME_FABRIC.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-fabric__lede">{DOEHOME_FABRIC.lede}</p>
      </header>

      <Window title="Fabric" className={`doehome-canvas${lit >= 1 ? " is-on" : ""}`}>
        <div className="doehome-canvas__tools">
          {DOEHOME_FABRIC.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
          <em>{DOEHOME_FABRIC.runsOn}</em>
        </div>
        <div className="doehome-canvas__board">
          <svg className="doehome-canvas__wires" viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true">
            <path d="M100 28 V70" />
            <path d="M100 70 L40 128" />
            <path d="M100 70 L160 128" />
          </svg>
          <article className={`doehome-canvas__node${lit >= 2 ? " is-on" : ""}`} style={{ "--nx": "50%", "--ny": "6%" } as CSSProperties}>
            <i className="doehome-canvas__port doehome-canvas__port--out" />
            <span>{start.kicker}</span>
            <b>{start.label}</b>
          </article>
          <article className={`doehome-canvas__node${lit >= 3 ? " is-on" : ""}`} style={{ "--nx": "50%", "--ny": "38%" } as CSSProperties}>
            <i className="doehome-canvas__port doehome-canvas__port--in" />
            <span>{branch.kicker}</span>
            <b>{branch.label}</b>
            <i className="doehome-canvas__port doehome-canvas__port--out" />
          </article>
          <article
            className={`doehome-canvas__node${lit >= 4 ? " is-on" : ""}`}
            style={{ "--nx": phone ? "24%" : "18%", "--ny": "72%" } as CSSProperties}
          >
            <i className="doehome-canvas__port doehome-canvas__port--in" />
            <span>{thenStep.kicker}</span>
            <b>{thenStep.label}</b>
          </article>
          <article
            className={`doehome-canvas__node doehome-canvas__node--human${lit >= 5 ? " is-on" : ""}`}
            style={{ "--nx": phone ? "76%" : "82%", "--ny": "72%" } as CSSProperties}
          >
            <i className="doehome-canvas__port doehome-canvas__port--in" />
            <span>{human.kicker}</span>
            <b>{human.label}</b>
          </article>
        </div>
        <div className="doehome-canvas__lib">
          {DOEHOME_FABRIC.library.map((item, index) => (
            <article key={item.id} className={lit >= 2 + index ? "is-on" : undefined}>
              <b>{item.title}</b>
              <span>{item.source}</span>
            </article>
          ))}
        </div>
      </Window>
    </>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 600 : 480);

  return (
    <>
      <header className="doehome-float__head">
        <h2 className="doehome-section-title doehome-float__title">
          {DOEHOME_FLOAT.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-float__lede">{DOEHOME_FLOAT.lede}</p>
      </header>

      <Window title={DOEHOME_FLOAT.windowTitle} className="doehome-cut">
        <ul className="doehome-cut__ledger">
          {DOEHOME_FLOAT.claims.map((row, index) => (
            <li key={row.claim} className={lit >= 1 && index <= lit ? "is-on" : undefined}>
              <b>{row.payer}</b>
              <span>{row.claim}</span>
              <em>
                {row.paid} / {row.allowed}
              </em>
              <i style={{ "--cut": lit >= 1 ? `${row.cut}%` : "0%" } as CSSProperties} />
            </li>
          ))}
        </ul>
        <div className={`doehome-cut__stage${lit >= 2 ? " is-on" : ""}`}>
          <span>{DOEHOME_FLOAT.allowedLabel}</span>
          <i className="doehome-cut__full" />
          <span>{DOEHOME_FLOAT.paidAmtLabel}</span>
          <i
            className="doehome-cut__paid"
            style={{ "--cut": lit >= 3 ? `${DOEHOME_FLOAT.paid}%` : "0%" } as CSSProperties}
          />
        </div>
        <p className={`doehome-cut__sum${lit >= 3 ? " is-on" : ""}`}>
          <b>{DOEHOME_FLOAT.underpay}</b>
          <span>{DOEHOME_FLOAT.underpayNote}</span>
        </p>
        <div className={`doehome-cut__hold${lit >= 4 ? " is-on" : ""}`}>
          <i />
          <b>
            {DOEHOME_FLOAT.hold.status} {DOEHOME_FLOAT.hold.timer}
          </b>
          <span>{DOEHOME_FLOAT.hold.note}</span>
        </div>
      </Window>
    </>
  );
}

function ChartBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 580 : 460);

  return (
    <>
      <header className="doehome-extra__head">
        <h2 className="doehome-section-title doehome-extra__title">
          {DOEHOME_CHART.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_CHART.lede}</p>
      </header>
      <Window title={DOEHOME_CHART.windowTitle} className="doehome-ehr">
        <div className="doehome-ehr__inbox">
          <span>Inbox</span>
          {DOEHOME_CHART.inbox.map((name, index) => (
            <button key={name} type="button" className={index === 0 ? "is-this" : undefined}>
              {name}
            </button>
          ))}
        </div>
        <div className="doehome-ehr__who">
          <i />
          <div>
            <b>{DOEHOME_CHART.patient}</b>
            <span>{DOEHOME_CHART.patientMeta}</span>
          </div>
        </div>
        <nav className="doehome-ehr__tabs" aria-label="Chart tabs">
          {DOEHOME_CHART.tabs.map((tab, index) => (
            <span key={tab} className={index === 0 ? "is-on" : undefined}>
              {tab}
            </span>
          ))}
        </nav>
        <ul>
          {DOEHOME_CHART.fields.map((field, index) => (
            <li key={field.k} className={lit >= 1 + index ? "is-on" : undefined}>
              <span>{field.k}</span>
              <b>{field.v}</b>
              <i />
            </li>
          ))}
        </ul>
        <p className={`doehome-ehr__toast${lit >= 4 ? " is-on" : ""}`}>Wrote from {DOEHOME_CHART.sources[0]}</p>
      </Window>
    </>
  );
}

function HandoffBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 640 : 520);
  const lastTurn = DOEHOME_PULSE.call.turns[DOEHOME_PULSE.call.turns.length - 1];

  return (
    <>
      <header className="doehome-extra__head">
        <h2 className="doehome-section-title doehome-extra__title">
          {DOEHOME_HANDOFF.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_HANDOFF.lede}</p>
      </header>
      <div className={`doehome-xfer${lit >= 3 ? " is-taken" : ""}`}>
        <Window title={DOEHOME_HANDOFF.agent.role} className="doehome-xfer__from" live={lit >= 1 && lit < 3}>
          <b>{DOEHOME_HANDOFF.agent.name}</b>
          <span className="doehome-handset__wave" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <p className="doehome-xfer__line">{lastTurn.text}</p>
        </Window>
        <div className="doehome-xfer__rail">
          <ul>
            {DOEHOME_HANDOFF.context.map((item) => (
              <li key={item} className={lit >= 2 ? "is-on" : undefined}>
                {item}
              </li>
            ))}
          </ul>
          <span className={lit >= 2 ? "is-on" : undefined}>{DOEHOME_HANDOFF.cta}</span>
        </div>
        <Window title={DOEHOME_HANDOFF.human.role} className="doehome-xfer__to" live={lit >= 3}>
          <b>{DOEHOME_HANDOFF.human.name}</b>
          <em>Context held</em>
          <ul className={`doehome-xfer__held${lit >= 3 ? " is-on" : ""}`}>
            {DOEHOME_HANDOFF.context.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Window>
      </div>
    </>
  );
}

function ConnectBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 560 : 440);

  return (
    <>
      <header className="doehome-extra__head">
        <h2 className="doehome-section-title doehome-extra__title">
          {DOEHOME_CONNECT.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_CONNECT.lede}</p>
      </header>
      <div className={`doehome-jacks${lit >= 4 ? " is-on" : ""}`}>
        <ul>
          {DOEHOME_CONNECT.ports.map((port, index) => (
            <li key={port.name} className={index < lit ? "is-on" : undefined}>
              <Window title={port.kind}>
                <b>{port.name}</b>
                <i className="doehome-jacks__led" />
              </Window>
            </li>
          ))}
        </ul>
        <svg className="doehome-jacks__cables" viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 4 C50 40 150 8 150 60" />
          <path d="M150 4 C150 36 150 20 150 60" />
          <path d="M250 4 C250 40 150 8 150 60" />
        </svg>
        <p>
          <span>{DOEHOME_CONNECT.hub}</span>
          <em className="doehome-ver">{DOEHOME_CONNECT.hubVersion}</em>
        </p>
      </div>
    </>
  );
}

function OpenBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 620 : 500);

  return (
    <>
      <header className="doehome-extra__head">
        <h2 className="doehome-section-title doehome-extra__title">
          {DOEHOME_OPEN.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehome-genome__lede">{DOEHOME_OPEN.lede}</p>
      </header>
      <div className={`doehome-dawn${lit >= 2 ? " is-open" : ""}`}>
        <div className="doehome-dawn__shutter">
          <span>{DOEHOME_OPEN.closed}</span>
        </div>
        <div className="doehome-dawn__desk">
          <p>{DOEHOME_OPEN.opened}</p>
          <ul>
            {DOEHOME_OPEN.items.map((item, index) => (
              <li key={item.task} className={lit >= 3 || index === 0 ? "is-on" : undefined}>
                <i />
                <span>{item.at}</span>
                <b>{item.task}</b>
                <em>{item.done}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function RackUi({ name }: { name: string }) {
  if (name === "Genome") {
    return (
      <div className="doehome-mini doehome-mini--map" aria-hidden="true">
        <i />
        <i className="is-on" />
        <i />
        <i />
      </div>
    );
  }
  if (name === "Pulse") {
    return (
      <div className="doehome-mini doehome-mini--wave" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    );
  }
  if (name === "Fabric") {
    return (
      <div className="doehome-mini doehome-mini--flow" aria-hidden="true">
        <b />
        <span />
        <b />
        <span />
        <b />
      </div>
    );
  }
  return (
    <div className="doehome-mini doehome-mini--cut" aria-hidden="true">
      <i />
      <i />
    </div>
  );
}

export function DoeHomeStackRack() {
  return (
    <div className="doehome-rack">
      {DOEHOME_STACK.items.map((item) => (
        <Window key={item.name} title={item.name}>
          <RackUi name={item.name} />
          <p>{item.body}</p>
        </Window>
      ))}
    </div>
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
