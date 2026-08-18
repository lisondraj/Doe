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
} from "@/lib/doehome/doehome-copy";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function Scene({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`doehome-scene${className ? ` ${className}` : ""}`} aria-hidden="true">
      {children}
    </div>
  );
}

function FileMark() {
  return <i className="doehome-file" aria-hidden="true" />;
}

function Wave({ count = 8, on = true }: { count?: number; on?: boolean }) {
  return (
    <i className={`doehome-wave${on ? " is-on" : ""}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <em key={index} style={{ "--n": index } as CSSProperties} />
      ))}
    </i>
  );
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
  const { lit } = useDoeHomeStep(revealed, DOEHOME_GENOME.clinics.length + 1, variant === "phone" ? 520 : 420);

  return (
    <Scene className="doehome-scene--grid doehome-scene--crop-br">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>{DOEHOME_GENOME.group.name}</span>
        <b>{DOEHOME_GENOME.tableTitle}</b>
      </header>
      <div className="doehome-grid doehome-grid--genome">
        <div className="doehome-grid__head">
          <span />
          {DOEHOME_GENOME.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_GENOME.clinics.map((clinic, index) => (
          <div
            key={clinic.id}
            className={`doehome-grid__row${clinic.id === "harbor" ? " is-this" : ""}${
              index < lit - 1 ? " is-on" : ""
            }`}
            style={{ "--n": index } as CSSProperties}
          >
            <em>{index + 1}</em>
            <b>
              <FileMark />
              {clinic.name}
            </b>
            <span>{clinic.model}</span>
            <span>{clinic.version}</span>
            <span>{clinic.state}</span>
          </div>
        ))}
        <div className="doehome-grid__row doehome-grid__row--ghost" aria-hidden="true">
          <em>5</em>
          <b>
            <FileMark />
            Dr. Chen
          </b>
          <span>Chen model</span>
          <span>Visit prep…</span>
          <span>Idle</span>
        </div>
      </div>
    </Scene>
  );
}

function PulseBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_PULSE.call.turns.length + 2, variant === "phone" ? 560 : 440);

  return (
    <Scene className="doehome-scene--focus doehome-scene--crop-tr">
      <article className={lit >= 1 ? "is-on" : undefined}>
        <header>
          <em>Live</em>
          <div>
            <b>
              {DOEHOME_PULSE.call.agent} · {DOEHOME_PULSE.agents[0].name}
            </b>
            <span>{DOEHOME_PULSE.number}</span>
          </div>
          <Wave on={lit >= 1} />
        </header>
        <ol>
          {DOEHOME_PULSE.call.turns.map((turn, index) => (
            <li
              key={`${turn.who}-${index}`}
              className={`${turn.who === "Maya" ? "is-agent" : "is-patient"}${lit >= 2 + index ? " is-on" : ""}`}
              style={{ "--n": index } as CSSProperties}
            >
              <span>{turn.who}</span>
              <p>{turn.text}</p>
            </li>
          ))}
        </ol>
      </article>
      <p className={`doehome-scene__action${lit >= DOEHOME_PULSE.call.turns.length + 2 ? " is-on" : ""}`}>
        {DOEHOME_PULSE.human}
      </p>
    </Scene>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_FABRIC.steps.length, variant === "phone" ? 460 : 360);

  return (
    <Scene className="doehome-scene--stack doehome-scene--mid">
      {DOEHOME_FABRIC.steps.map((step, index) => (
        <div key={step.id} className={`doehome-pill${index < lit ? " is-on" : ""}`} style={{ "--n": index } as CSSProperties}>
          <span>{step.kicker}</span>
          <b>{step.label}</b>
        </div>
      ))}
    </Scene>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_FLOAT.claims.length + 1, variant === "phone" ? 520 : 400);

  return (
    <Scene className="doehome-scene--grid doehome-scene--crop-tl">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>{DOEHOME_FLOAT.hold.ref}</span>
        <b>{DOEHOME_FLOAT.tableTitle}</b>
      </header>
      <div className="doehome-grid doehome-grid--pay">
        <div className="doehome-grid__head">
          <span />
          {DOEHOME_FLOAT.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_FLOAT.claims.map((row, index) => (
          <div
            key={row.claim}
            className={`doehome-grid__row${index === 0 ? " is-this" : ""}${index < lit - 1 ? " is-on" : ""}`}
            style={{ "--n": index } as CSSProperties}
          >
            <em>{index + 1}</em>
            <b>
              <FileMark />
              {row.payer}
            </b>
            <span>{row.claim}</span>
            <span>{row.allowed}</span>
            <span>{row.paid}</span>
          </div>
        ))}
        <div className={`doehome-grid__foot${lit >= DOEHOME_FLOAT.claims.length ? " is-on" : ""}`}>
          <b>{DOEHOME_FLOAT.underpay}</b>
          <span>{DOEHOME_FLOAT.underpayNote}</span>
        </div>
      </div>
    </Scene>
  );
}

function ChartBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_CHART.fields.length + 1, variant === "phone" ? 500 : 380);

  return (
    <Scene className="doehome-scene--grid doehome-scene--crop-br">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>
          {DOEHOME_CHART.patient} · {DOEHOME_CHART.mrn}
        </span>
        <b>{DOEHOME_CHART.tableTitle}</b>
      </header>
      <div className="doehome-grid doehome-grid--chart">
        <div className="doehome-grid__head">
          <span />
          {DOEHOME_CHART.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_CHART.fields.map((field, index) => (
          <div
            key={field.k}
            className={`doehome-grid__row${index === 0 ? " is-this" : ""}${index < lit - 1 ? " is-on" : ""}`}
            style={{ "--n": index } as CSSProperties}
          >
            <em>{index + 1}</em>
            <b>
              <FileMark />
              {field.k}
            </b>
            <span>{field.v}</span>
            <span>{DOEHOME_CHART.sources[index]}</span>
          </div>
        ))}
        <div className="doehome-grid__row doehome-grid__row--ghost">
          <em>4</em>
          <b>
            <FileMark />
            Referral
          </b>
          <span>Imaging packet…</span>
          <span>Fabric</span>
        </div>
      </div>
    </Scene>
  );
}

function HandoffBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_HANDOFF.context.length + 2, variant === "phone" ? 540 : 420);
  const lastTurn = DOEHOME_PULSE.call.turns[DOEHOME_PULSE.call.turns.length - 1];

  return (
    <Scene className="doehome-scene--focus doehome-scene--crop-bl">
      <article className={lit >= 1 ? "is-on" : undefined}>
        <header>
          <em>{DOEHOME_HANDOFF.badge}</em>
          <div>
            <b>{DOEHOME_HANDOFF.cardTitle}</b>
            <span>
              {DOEHOME_HANDOFF.agent.name} · {DOEHOME_HANDOFF.agent.role}
            </span>
          </div>
        </header>
        <p>{lastTurn.text}</p>
        <ul>
          {DOEHOME_HANDOFF.context.map((item, index) => (
            <li key={item} className={lit >= 2 + index ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
              <FileMark />
              <b>{item}</b>
            </li>
          ))}
        </ul>
      </article>
      <p className={`doehome-scene__action${lit >= DOEHOME_HANDOFF.context.length + 2 ? " is-on" : ""}`}>
        {DOEHOME_HANDOFF.cta}
      </p>
    </Scene>
  );
}

function ConnectBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 460 : 360);

  return (
    <Scene className="doehome-scene--tiles doehome-scene--crop-center">
      <ul className={lit >= 1 ? "is-on" : undefined}>
        {DOEHOME_CONNECT.tiles.map((tile, index) => (
          <li
            key={tile.name}
            className={lit >= 1 ? "is-on" : undefined}
            style={{ "--n": index } as CSSProperties}
          >
            <b>{tile.mark}</b>
            <span>{tile.name}</span>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

function OpenBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_OPEN.items.length + 1, variant === "phone" ? 520 : 400);

  return (
    <Scene className="doehome-scene--grid doehome-scene--crop-tl">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>{DOEHOME_OPEN.opened}</span>
        <b>{DOEHOME_OPEN.tableTitle}</b>
      </header>
      <div className="doehome-grid doehome-grid--open">
        <div className="doehome-grid__head">
          <span />
          {DOEHOME_OPEN.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_OPEN.items.map((item, index) => (
          <div
            key={item.task}
            className={`doehome-grid__row${index === 0 ? " is-this" : ""}${index < lit - 1 ? " is-on" : ""}`}
            style={{ "--n": index } as CSSProperties}
          >
            <em>{index + 1}</em>
            <b>
              <FileMark />
              {item.at}
            </b>
            <span>{item.task}</span>
            <span>{item.done}</span>
          </div>
        ))}
        <div className="doehome-grid__row doehome-grid__row--ghost">
          <em>4</em>
          <b>
            <FileMark />
            6:41am
          </b>
          <span>Referral file…</span>
          <span>On the chart</span>
        </div>
      </div>
    </Scene>
  );
}

function BookBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 500 : 380);
  const held = DOEHOME_BOOK.held;

  return (
    <Scene className={`doehome-scene--week doehome-scene--crop-br${lit >= 3 ? " is-pinned" : ""}`}>
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span className={lit >= 2 ? "is-on" : undefined}>{held.label}</span>
        <b>{DOEHOME_BOOK.windowTitle}</b>
      </header>
      <div className="doehome-week">
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
                className={`${busy ? "is-busy" : ""}${isHeld ? " is-target" : ""}${
                  isHeld && lit >= 3 ? " is-held" : ""
                }`.trim() || undefined}
              >
                {isHeld ? (
                  <>
                    <b>{held.name}</b>
                    <em>{held.label}</em>
                  </>
                ) : null}
              </span>
            );
          }),
        ])}
      </div>
    </Scene>
  );
}

function ScribeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_SCRIBE.lines.length + 2, variant === "phone" ? 520 : 400);

  return (
    <Scene className="doehome-scene--focus doehome-scene--crop-tr">
      <article className={lit >= 1 ? "is-on" : undefined}>
        <header>
          <em>{DOEHOME_SCRIBE.badge}</em>
          <div>
            <b>{DOEHOME_SCRIBE.cardTitle}</b>
            <span>
              {DOEHOME_SCRIBE.room} · {DOEHOME_SCRIBE.provider}
            </span>
          </div>
          <Wave on={lit >= 1} count={10} />
        </header>
        <p>{DOEHOME_SCRIBE.patient}</p>
        <ul>
          {DOEHOME_SCRIBE.lines.map((line, index) => (
            <li key={line} className={lit >= 2 + index ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
              {line}
            </li>
          ))}
        </ul>
      </article>
      <p className={`doehome-scene__action${lit >= DOEHOME_SCRIBE.lines.length + 2 ? " is-on" : ""}`}>
        {DOEHOME_SCRIBE.stamp}
      </p>
    </Scene>
  );
}

function AuthBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_AUTH.files.length + 2, variant === "phone" ? 520 : 400);

  return (
    <Scene className="doehome-scene--focus doehome-scene--crop-bl">
      <article className={lit >= 1 ? "is-on" : undefined}>
        <header>
          <em>{DOEHOME_AUTH.badge}</em>
          <div>
            <b>{DOEHOME_AUTH.cardTitle}</b>
            <span>
              {DOEHOME_AUTH.payer} · {DOEHOME_AUTH.ref}
            </span>
          </div>
        </header>
        <ul>
          {DOEHOME_AUTH.files.map((file, index) => (
            <li key={file.name} className={lit >= 2 + index ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
              <FileMark />
              <div>
                <b>{file.name}</b>
                <span>{file.meta}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>
      <p className={`doehome-scene__action${lit >= DOEHOME_AUTH.files.length + 2 ? " is-on" : ""}`}>
        {DOEHOME_AUTH.action}
      </p>
    </Scene>
  );
}

function BoardBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_BOARD.columns.length + 1, variant === "phone" ? 500 : 380);

  return (
    <Scene className="doehome-scene--board doehome-scene--crop-br">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>{DOEHOME_BOARD.windowTitle}</span>
        <b>{DOEHOME_BOARD.boardTitle}</b>
      </header>
      <div className="doehome-board">
        {DOEHOME_BOARD.columns.map((column, index) => (
          <section
            key={column.id}
            className={index < lit - 1 ? "is-on" : undefined}
            style={{ "--n": index } as CSSProperties}
          >
            <h3>
              {column.name}
              <span>{column.cards.length}</span>
            </h3>
            <ul>
              {column.cards.map((card) => (
                <li key={card.id} className={column.id === "live" ? "is-live" : undefined}>
                  {column.id === "live" ? <Wave count={6} /> : null}
                  <b>{card.title}</b>
                  <span>{card.meta}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Scene>
  );
}

function FeatureSection({
  id,
  title,
  lede,
  src,
  gray = false,
  mesh,
  priority = false,
  variant = "rise",
  children,
}: {
  id: string;
  title: readonly string[];
  lede: string;
  src: string;
  gray?: boolean;
  mesh?: "dots" | "arches" | "waves";
  priority?: boolean;
  variant?: "rise" | "left" | "right";
  children: (revealed: boolean) => ReactNode;
}) {
  return (
    <section
      className={`doeinsure-section${gray ? " doeinsure-section--gray" : ""}${mesh ? ` doehome-section--mesh-${mesh}` : ""}`}
      id={id}
    >
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
        mesh="dots"
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
        mesh="arches"
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
        mesh="waves"
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
        mesh="dots"
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
        mesh="arches"
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
        mesh="waves"
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
