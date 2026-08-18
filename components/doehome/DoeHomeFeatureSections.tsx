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

const BOOK_BUSY = new Set(["Mon-9:00", "Tue-10:20", "Wed-9:00", "Wed-11:40", "Thu-10:20"]);

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 640 : 500);
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];

  return (
    <Sheet className="doehome-map">
      <div className="doehome-map__bar">
        <b>{DOEHOME_GENOME.group.name}</b>
        <span>{DOEHOME_GENOME.group.count}</span>
      </div>
      <ul className="doehome-map__sites">
        {DOEHOME_GENOME.clinics.map((clinic) => {
          const open = clinic.id === harbor.id && lit >= 2;
          return (
            <li
              key={clinic.id}
              className={open ? "is-this" : undefined}
              style={{ opacity: lit >= 1 ? 1 : 0.32 }}
            >
              <b>{clinic.name}</b>
              <span>{clinic.version}</span>
              {open ? (
                <ol>
                  {DOEHOME_GENOME.providers.map((provider, providerIndex) => (
                    <li key={provider.id} className={lit >= 3 && providerIndex === 0 ? "is-this" : undefined}>
                      <b>{provider.name}</b>
                      <em>{provider.note}</em>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="doehome-map__stack">
        <div className="doehome-map__apps">
          {DOEHOME_STACK.products.map((item, index) => (
            <article key={item.name} className={lit >= 3 ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
              <b>{item.name}</b>
              <span>{item.body}</span>
            </article>
          ))}
        </div>
        <div className={`doehome-map__base${lit >= 4 ? " is-on" : ""}`}>
          <b>{DOEHOME_STACK.foundation.name}</b>
          <span>{harbor.model}</span>
          <em>{harbor.version}</em>
        </div>
      </div>
      <p className={`doehome-map__train${lit >= 4 ? " is-on" : ""}`}>
        {DOEHOME_GENOME.trainCta}
        <span>{DOEHOME_GENOME.trainWhen}</span>
      </p>
    </Sheet>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 680 : 520);

  return (
    <Sheet className="doehome-switch">
      <div className="doehome-switch__live">
        <header>
          <div>
            <b>{DOEHOME_PULSE.number}</b>
            <span>{DOEHOME_PULSE.call.liveLabel}</span>
          </div>
          <i className={`doehome-wave${lit >= 1 ? " is-on" : ""}`} aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => (
              <em key={index} style={{ "--n": index } as CSSProperties} />
            ))}
          </i>
        </header>
        <ol>
          {DOEHOME_PULSE.call.turns.map((turn, index) => (
            <li
              key={`${turn.who}-${index}`}
              className={`${turn.who === "Maya" ? "is-agent" : "is-patient"}${lit >= 2 + index ? " is-on" : ""}`}
            >
              <span>{turn.who}</span>
              <p>{turn.text}</p>
            </li>
          ))}
        </ol>
        <em className={lit >= 5 ? "is-on" : undefined}>{DOEHOME_PULSE.human}</em>
      </div>
      <ul className="doehome-switch__agents">
        {DOEHOME_PULSE.agents.map((agent, index) => (
          <li key={agent.id} className={lit >= 1 && index === 0 ? "is-on" : undefined}>
            <i className={agent.state === "Live" ? "is-live" : undefined} aria-hidden="true" />
            <b>{agent.name}</b>
            <span>{agent.voice}</span>
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
    <Sheet className="doehome-flow">
      <p>{DOEHOME_FABRIC.runsOn}</p>
      <div className={`doehome-flow__node${lit >= 1 ? " is-on" : ""}`}>
        <span>{start.kicker}</span>
        <b>{start.label}</b>
      </div>
      <i className={`doehome-flow__wire${lit >= 2 ? " is-on" : ""}`} aria-hidden="true" />
      <div className={`doehome-flow__node is-if${lit >= 2 ? " is-on" : ""}`}>
        <span>{branch.kicker}</span>
        <b>{branch.label}</b>
      </div>
      <div className={`doehome-flow__fork${lit >= 3 ? " is-on" : ""}`} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="doehome-flow__ends">
        <div className={`doehome-flow__node is-yes${lit >= 3 ? " is-on" : ""}`}>
          <span>Yes</span>
          <b>{thenStep.label}</b>
        </div>
        <div className={`doehome-flow__node is-no${lit >= 4 ? " is-on" : ""}`}>
          <span>No</span>
          <b>{human.label}</b>
        </div>
      </div>
    </Sheet>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 600 : 480);

  return (
    <Sheet className="doehome-pay">
      <header>
        <b>{DOEHOME_FLOAT.windowTitle}</b>
        <span>{DOEHOME_FLOAT.hold.ref}</span>
      </header>
      <ul>
        {DOEHOME_FLOAT.claims.map((row, index) => (
          <li key={row.claim} className={index < lit ? "is-on" : undefined}>
            <div>
              <b>{row.payer}</b>
              <span>
                {row.paid} of {row.allowed}
              </span>
            </div>
            <div className="doehome-pay__track" aria-hidden="true">
              <em style={{ width: `${row.cut}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className={`doehome-pay__gap${lit >= 3 ? " is-on" : ""}`}>
        <b>{DOEHOME_FLOAT.underpay}</b>
        <span>{DOEHOME_FLOAT.underpayNote}</span>
      </p>
      <div className={`doehome-pay__hold${lit >= 4 ? " is-on" : ""}`}>
        <span>
          {DOEHOME_FLOAT.hold.status}
          <b>{DOEHOME_FLOAT.hold.timer}</b>
        </span>
        <em>{DOEHOME_FLOAT.hold.note}</em>
        <i aria-hidden="true" />
      </div>
    </Sheet>
  );
}

function ChartBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 580 : 460);

  return (
    <Sheet className="doehome-record">
      <aside>
        {DOEHOME_CHART.inbox.map((name, index) => (
          <span key={name} className={index === 0 && lit >= 1 ? "is-on" : undefined}>
            {name}
          </span>
        ))}
      </aside>
      <div className="doehome-record__file">
        <header>
          <div>
            <b>{DOEHOME_CHART.patient}</b>
            <span>{DOEHOME_CHART.mrn}</span>
          </div>
          <nav>
            {DOEHOME_CHART.tabs.map((tab, index) => (
              <span key={tab} className={index === 0 ? "is-on" : undefined}>
                {tab}
              </span>
            ))}
          </nav>
        </header>
        <ul>
          {DOEHOME_CHART.fields.map((field, index) => (
            <li key={field.k} className={lit >= 1 + index ? "is-on" : undefined}>
              <span>{field.k}</span>
              <b>{field.v}</b>
              <em>{DOEHOME_CHART.sources[index]}</em>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}

function HandoffBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 640 : 520);
  const lastTurn = DOEHOME_PULSE.call.turns[DOEHOME_PULSE.call.turns.length - 1];

  return (
    <Sheet className={`doehome-take${lit >= 3 ? " is-taken" : ""}`}>
      <article className={lit >= 1 ? "is-on" : undefined}>
        <span>{DOEHOME_HANDOFF.agent.role}</span>
        <b>{DOEHOME_HANDOFF.agent.name}</b>
        <p>{lastTurn.text}</p>
      </article>
      <em className={lit >= 2 ? "is-on" : undefined}>{DOEHOME_HANDOFF.cta}</em>
      <article className={lit >= 3 ? "is-on" : undefined}>
        <span>{DOEHOME_HANDOFF.human.role}</span>
        <b>{DOEHOME_HANDOFF.human.name}</b>
        <ul>
          {DOEHOME_HANDOFF.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </Sheet>
  );
}

function ConnectBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 4, variant === "phone" ? 560 : 440);

  return (
    <Sheet className="doehome-hub">
      <div className={`doehome-hub__core${lit >= 1 ? " is-on" : ""}`}>
        <b>{DOEHOME_CONNECT.hub}</b>
        <span>{DOEHOME_CONNECT.hubVersion}</span>
      </div>
      <div className={`doehome-hub__wires${lit >= 2 ? " is-on" : ""}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <ul>
        {DOEHOME_CONNECT.ports.map((port, index) => (
          <li key={port.name} className={index < Math.max(0, lit - 1) ? "is-on" : undefined}>
            <b>{port.name}</b>
            <span>{port.kind}</span>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function OpenBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 620 : 500);

  return (
    <Sheet className={`doehome-dawn${lit >= 2 ? " is-open" : ""}`}>
      <div className="doehome-dawn__shade" aria-hidden="true">
        <span>{DOEHOME_OPEN.closed}</span>
      </div>
      <header>
        <b>{DOEHOME_OPEN.opened}</b>
        <span>Harbor Ortho</span>
      </header>
      <ol>
        {DOEHOME_OPEN.items.map((item, index) => (
          <li key={item.task} className={lit >= 3 || index === 0 ? "is-on" : undefined}>
            <span>{item.at}</span>
            <div>
              <b>{item.task}</b>
              <em>{item.done}</em>
            </div>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function BookBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 560 : 440);
  const held = DOEHOME_BOOK.held;

  return (
    <Sheet className={`doehome-diary${lit >= 1 ? " is-on" : ""}`}>
      <header>
        <b>{DOEHOME_BOOK.windowTitle}</b>
        <span>{held.label}</span>
      </header>
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
            const busy = BOOK_BUSY.has(`${day}-${hour}`);
            return (
              <span
                key={`${day}-${hour}`}
                className={`${busy ? "is-busy" : ""}${isHeld && lit >= 3 ? " is-held" : ""}`.trim() || undefined}
              >
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
    <Sheet className="doehome-note">
      <div className={`doehome-note__live${lit >= 1 ? " is-on" : ""}`}>
        <span>
          {DOEHOME_SCRIBE.room}
          <b>{DOEHOME_SCRIBE.provider}</b>
        </span>
        <i className="doehome-wave is-on" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <em key={index} style={{ "--n": index } as CSSProperties} />
          ))}
        </i>
      </div>
      <div className="doehome-note__page">
        <p>{DOEHOME_SCRIBE.patient}</p>
        <ul>
          {DOEHOME_SCRIBE.lines.map((line, index) => (
            <li key={line} className={lit >= 1 + index ? "is-on" : undefined}>
              {line}
            </li>
          ))}
        </ul>
        <em className={lit >= 4 ? "is-on" : undefined}>{DOEHOME_SCRIBE.stamp}</em>
      </div>
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
            <header>
              <span>{DOEHOME_AUTH.payer}</span>
              <em>
                {index + 1} of {DOEHOME_AUTH.pages.length}
              </em>
            </header>
            <b>{page.label}</b>
            <i className="doehome-pack__rules" aria-hidden="true" />
            <span>{DOEHOME_AUTH.ref}</span>
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
    <Sheet className="doehome-kanban">
      {DOEHOME_BOARD.columns.map((column, index) => (
        <section key={column.id} className={index < lit ? "is-on" : undefined}>
          <h3>
            {column.name}
            <span>{column.cards.length}</span>
          </h3>
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
