"use client";

import type { CSSProperties, ReactNode } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DoeHomeShaderFrame } from "@/components/doehome/DoeHomeShaderImage";
import {
  DOEHOME_AUTH,
  DOEHOME_BOARD,
  DOEHOME_BOOK,
  DOEHOME_CHART,
  DOEHOME_CONNECT,
  DOEHOME_FABRIC,
  DOEHOME_FLOAT,
  DOEHOME_GENOME,
  DOEHOME_HANDOFF,
  DOEHOME_OPEN,
  DOEHOME_PULSE,
  DOEHOME_SCRIBE,
  DOEHOME_STACK,
} from "@/lib/doehome/doehome-copy";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function Sheet({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`doehome-sheet${className ? ` ${className}` : ""}`}>{children}</div>;
}

function FeatureHeading({ title, lede }: { title: readonly string[]; lede: string }) {
  return (
    <header className="doehome-extra__head">
      <h2 className="doehome-section-title">
        {title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <p className="doehome-genome__lede">{lede}</p>
    </header>
  );
}

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 640 : 500);
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];

  return (
    <>
    <Sheet className="doehome-roster">
      <p className="doehome-sheet__kicker">{DOEHOME_GENOME.group.name}</p>
      <ul>
        {DOEHOME_GENOME.clinics.map((clinic) => {
          const open = clinic.id === harbor.id && lit >= 2;
          return (
            <li key={clinic.id} className={open ? "is-this" : undefined} style={{ opacity: lit >= 1 ? 1 : 0.28 }}>
              <div>
                <b>{clinic.name}</b>
                <span>{clinic.version}</span>
              </div>
              {open ? (
                <ol>
                  {DOEHOME_GENOME.providers.map((provider, providerIndex) => (
                    <li key={provider.id} className={lit >= 3 && providerIndex === 0 ? "is-this" : undefined}>
                      {provider.name}
                      <em>{provider.note}</em>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className={`doehome-roster__train${lit >= 4 ? " is-on" : ""}`}>
        {DOEHOME_GENOME.trainCta}
        <span>{DOEHOME_GENOME.trainWhen}</span>
      </p>
    </Sheet>
    <Sheet className="doehome-foundation">
      <div className="doehome-foundation__apps">
        {DOEHOME_STACK.products.map((item) => (
          <article key={item.name}>
            <b>{item.name}</b>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="doehome-foundation__base">
        <b>{DOEHOME_STACK.foundation.name}</b>
        <p>{DOEHOME_STACK.foundation.body}</p>
      </div>
    </Sheet>
    </>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 680 : 540);

  return (
    <Sheet className="doehome-lines">
      <div className="doehome-lines__call">
        <p>
          {DOEHOME_PULSE.number}
          <span>{DOEHOME_PULSE.call.liveLabel}</span>
        </p>
        <dl>
          {DOEHOME_PULSE.call.turns.map((turn, index) => (
            <div key={`${turn.who}-${index}`} className={lit >= 2 + index ? "is-on" : undefined}>
              <dt>{turn.who}</dt>
              <dd>{turn.text}</dd>
            </div>
          ))}
        </dl>
        <span className={lit >= 5 ? "is-on" : undefined}>{DOEHOME_PULSE.human}</span>
      </div>
      <ul>
        {DOEHOME_PULSE.agents.map((agent) => (
          <li key={agent.id} className={lit >= 1 && agent.state === "Live" ? "is-on" : undefined}>
            <b>{agent.name}</b>
            <span>
              {agent.voice}, {agent.hours}
            </span>
            <em>{agent.time}</em>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 600 : 460);
  const [start, branch, thenStep, human] = DOEHOME_FABRIC.steps;

  return (
    <Sheet className="doehome-recipe">
      <p className="doehome-sheet__kicker">{DOEHOME_FABRIC.runsOn}</p>
      <ol>
        <li className={lit >= 1 ? "is-on" : undefined}>
          <b>1</b>
          <span>{start.label}</span>
        </li>
        <li className={lit >= 2 ? "is-on" : undefined}>
          <b>2</b>
          <span>{branch.label}</span>
        </li>
        <li className={`doehome-recipe__split${lit >= 3 ? " is-on" : ""}`}>
          <span>Yes</span>
          <em>{thenStep.label}</em>
        </li>
        <li className={`doehome-recipe__split${lit >= 4 ? " is-on" : ""}`}>
          <span>No</span>
          <em>{human.label}</em>
        </li>
      </ol>
    </Sheet>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 600 : 480);

  return (
    <Sheet className="doehome-eob">
      <p className="doehome-sheet__kicker">{DOEHOME_FLOAT.windowTitle}</p>
      <ul>
        {DOEHOME_FLOAT.claims.map((row, index) => (
          <li key={row.claim} className={index < lit ? "is-on" : undefined}>
            <b>{row.payer}</b>
            <span>{row.claim}</span>
            <em>
              {row.paid} of {row.allowed}
            </em>
          </li>
        ))}
      </ul>
      <p className={`doehome-eob__sum${lit >= 3 ? " is-on" : ""}`}>
        <b>{DOEHOME_FLOAT.underpay}</b>
        <span>{DOEHOME_FLOAT.underpayNote}</span>
      </p>
      <p className={`doehome-eob__hold${lit >= 4 ? " is-on" : ""}`}>
        {DOEHOME_FLOAT.hold.status} {DOEHOME_FLOAT.hold.timer}. {DOEHOME_FLOAT.hold.note}.
      </p>
    </Sheet>
  );
}

function ChartBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 580 : 460);

  return (
    <Sheet className="doehome-chart">
      <p className="doehome-sheet__kicker">{DOEHOME_CHART.clinic}</p>
      <p className="doehome-chart__who">
        <b>{DOEHOME_CHART.patient}</b>
        <span>{DOEHOME_CHART.patientMeta}</span>
      </p>
      <dl>
        {DOEHOME_CHART.fields.map((field, index) => (
          <div key={field.k} className={lit >= 1 + index ? "is-on" : undefined}>
            <dt>{field.k}</dt>
            <dd>{field.v}</dd>
          </div>
        ))}
      </dl>
    </Sheet>
  );
}

function HandoffBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 640 : 520);
  const lastTurn = DOEHOME_PULSE.call.turns[DOEHOME_PULSE.call.turns.length - 1];

  return (
    <Sheet className={`doehome-pass${lit >= 3 ? " is-taken" : ""}`}>
      <div className={lit >= 1 ? "is-on" : undefined}>
        <b>{DOEHOME_HANDOFF.agent.name}</b>
        <span>{DOEHOME_HANDOFF.agent.role}</span>
        <p>{lastTurn.text}</p>
      </div>
      <em className={lit >= 2 ? "is-on" : undefined}>{DOEHOME_HANDOFF.cta}</em>
      <div className={lit >= 3 ? "is-on" : undefined}>
        <b>{DOEHOME_HANDOFF.human.name}</b>
        <span>{DOEHOME_HANDOFF.human.role}</span>
        <ul>
          {DOEHOME_HANDOFF.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}

function ConnectBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 560 : 440);

  return (
    <Sheet className="doehome-ports">
      <ul>
        {DOEHOME_CONNECT.ports.map((port, index) => (
          <li key={port.name} className={index < lit ? "is-on" : undefined}>
            <b>{port.name}</b>
            <span>{port.kind}</span>
          </li>
        ))}
      </ul>
      <p className={lit >= 4 ? "is-on" : undefined}>
        <b>{DOEHOME_CONNECT.hub}</b>
        <span>{DOEHOME_CONNECT.hubVersion}</span>
      </p>
    </Sheet>
  );
}

function OpenBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 620 : 500);

  return (
    <Sheet className={`doehome-morning${lit >= 2 ? " is-open" : ""}`}>
      <div className="doehome-morning__shade" aria-hidden="true">
        <span>{DOEHOME_OPEN.closed}</span>
      </div>
      <p className="doehome-sheet__kicker">{DOEHOME_OPEN.opened}</p>
      <ul>
        {DOEHOME_OPEN.items.map((item, index) => (
          <li key={item.task} className={lit >= 3 || index === 0 ? "is-on" : undefined}>
            <span>{item.at}</span>
            <b>{item.task}</b>
            <em>{item.done}</em>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function BookBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 560 : 440);
  const held = DOEHOME_BOOK.held;

  return (
    <Sheet className={`doehome-diary${lit >= 1 ? " is-on" : ""}`}>
      <p className="doehome-sheet__kicker">{DOEHOME_BOOK.windowTitle}</p>
      <div className="doehome-diary__grid">
        <span />
        {DOEHOME_BOOK.days.map((day) => (
          <b key={day} className={day === held.day && lit >= 2 ? "is-this" : undefined}>
            {day}
          </b>
        ))}
        {DOEHOME_BOOK.hours.flatMap((hour) => [
          <em key={`${hour}-label`}>{hour}</em>,
          ...DOEHOME_BOOK.days.map((day) => {
            const isHeld = day === held.day && hour === held.hour;
            return (
              <span key={`${day}-${hour}`} className={isHeld && lit >= 3 ? "is-held" : undefined}>
                {isHeld && lit >= 3 ? (
                  <>
                    <b>{held.name}</b>
                    <i>{held.label}</i>
                  </>
                ) : null}
              </span>
            );
          }),
        ])}
      </div>
    </Sheet>
  );
}

function ScribeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 580 : 460);

  return (
    <Sheet className="doehome-exam">
      <p className="doehome-sheet__kicker">
        {DOEHOME_SCRIBE.room}, {DOEHOME_SCRIBE.provider}
      </p>
      <p className="doehome-exam__who">{DOEHOME_SCRIBE.patient}</p>
      <ul>
        {DOEHOME_SCRIBE.lines.map((line, index) => (
          <li key={line} className={lit >= 1 + index ? "is-on" : undefined}>
            {line}
          </li>
        ))}
      </ul>
      <p className={`doehome-exam__stamp${lit >= 4 ? " is-on" : ""}`}>{DOEHOME_SCRIBE.stamp}</p>
    </Sheet>
  );
}

function AuthBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 600 : 480);

  return (
    <div className={`doehome-pack${lit >= 4 ? " is-sent" : ""}`}>
      <div className="doehome-pack__stack">
        {DOEHOME_AUTH.pages.map((page, index) => (
          <article
            key={page.id}
            className={index < lit ? "is-on" : undefined}
            style={{ "--n": index } as CSSProperties}
          >
            <span>{DOEHOME_AUTH.payer}</span>
            <b>{page.label}</b>
            <em>{DOEHOME_AUTH.ref}</em>
          </article>
        ))}
      </div>
      <p className={lit >= 4 ? "is-on" : undefined}>{DOEHOME_AUTH.stamp}</p>
    </div>
  );
}

function BoardBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 560 : 440);

  return (
    <Sheet className="doehome-lanes">
      {DOEHOME_BOARD.columns.map((column, index) => (
        <section key={column.id} className={index < lit ? "is-on" : undefined}>
          <h3>{column.name}</h3>
          <ul>
            {column.cards.map((card) => (
              <li key={card.id}>
                <b>{card.title}</b>
                <span>{card.meta}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Sheet>
  );
}

function FeatureSection({
  id,
  title,
  lede,
  src,
  gray = false,
  priority = false,
  variant = "rise",
  children,
}: {
  id: string;
  title: readonly string[];
  lede: string;
  src: string;
  gray?: boolean;
  priority?: boolean;
  variant?: "rise" | "left" | "right";
  children: (revealed: boolean) => ReactNode;
}) {
  return (
    <section className={`doeinsure-section${gray ? " doeinsure-section--gray" : ""}`} id={id}>
      <div className="doeinsure-wrap doehome-feature">
        <DoeInsureReveal variant={variant}>
          {(revealed) => (
            <>
              <FeatureHeading title={title} lede={lede} />
              <DoeHomeShaderFrame src={src} priority={priority}>
                {children(revealed)}
              </DoeHomeShaderFrame>
            </>
          )}
        </DoeInsureReveal>
      </div>
    </section>
  );
}

export function DoeHomeFeatureSections() {
  return (
    <>
      <FeatureSection
        id={DOEHOME_GENOME.id}
        title={DOEHOME_GENOME.title}
        lede={DOEHOME_GENOME.lede}
        src={DOEHOME_SHADERS.genome}
        priority
        variant="rise"
      >
        {(revealed) => <GenomeBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_PULSE.id}
        title={DOEHOME_PULSE.title}
        lede={DOEHOME_PULSE.lede}
        src={DOEHOME_SHADERS.pulse}
        gray
        variant="left"
      >
        {(revealed) => <PulseBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_FABRIC.id}
        title={DOEHOME_FABRIC.title}
        lede={DOEHOME_FABRIC.lede}
        src={DOEHOME_SHADERS.fabric}
        variant="right"
      >
        {(revealed) => <FabricBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_FLOAT.id}
        title={DOEHOME_FLOAT.title}
        lede={DOEHOME_FLOAT.lede}
        src={DOEHOME_SHADERS.float}
        gray
        variant="rise"
      >
        {(revealed) => <FloatBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_CHART.id}
        title={DOEHOME_CHART.title}
        lede={DOEHOME_CHART.lede}
        src={DOEHOME_SHADERS.chart}
        variant="left"
      >
        {(revealed) => <ChartBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_HANDOFF.id}
        title={DOEHOME_HANDOFF.title}
        lede={DOEHOME_HANDOFF.lede}
        src={DOEHOME_SHADERS.handoff}
        gray
        variant="right"
      >
        {(revealed) => <HandoffBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_CONNECT.id}
        title={DOEHOME_CONNECT.title}
        lede={DOEHOME_CONNECT.lede}
        src={DOEHOME_SHADERS.connect}
        variant="rise"
      >
        {(revealed) => <ConnectBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_OPEN.id}
        title={DOEHOME_OPEN.title}
        lede={DOEHOME_OPEN.lede}
        src={DOEHOME_SHADERS.open}
        gray
        variant="left"
      >
        {(revealed) => <OpenBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_BOOK.id}
        title={DOEHOME_BOOK.title}
        lede={DOEHOME_BOOK.lede}
        src={DOEHOME_SHADERS.book}
        variant="rise"
      >
        {(revealed) => <BookBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_SCRIBE.id}
        title={DOEHOME_SCRIBE.title}
        lede={DOEHOME_SCRIBE.lede}
        src={DOEHOME_SHADERS.scribe}
        gray
        variant="left"
      >
        {(revealed) => <ScribeBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_AUTH.id}
        title={DOEHOME_AUTH.title}
        lede={DOEHOME_AUTH.lede}
        src={DOEHOME_SHADERS.auth}
        variant="right"
      >
        {(revealed) => <AuthBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_BOARD.id}
        title={DOEHOME_BOARD.title}
        lede={DOEHOME_BOARD.lede}
        src={DOEHOME_SHADERS.board}
        gray
        variant="rise"
      >
        {(revealed) => <BoardBody revealed={revealed} />}
      </FeatureSection>
    </>
  );
}
