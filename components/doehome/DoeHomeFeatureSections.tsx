"use client";

import type { CSSProperties, ReactNode } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import {
  doeHomeProductWordmarkLabel,
  type DoeHomeProductWordmarkId,
} from "@/components/doehome/DoeHomeProductWordmark";
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

function FeatureHeading({
  title,
  lede,
  productLink,
}: {
  title: readonly string[];
  lede: string;
  productLink?: DoeHomeProductWordmarkId;
}) {
  const productWord = productLink ? doeHomeProductWordmarkLabel(productLink) : null;
  const ledeStartsWithProduct = productWord && lede.startsWith(productWord);

  return (
    <header className="doehome-extra__head">
      <h2 className="doehome-section-title">
        {title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <p className="doehome-feature__lede">
        {ledeStartsWithProduct ? (
          <>
            <a className="doehome-feature__lede-link" href={`#${productLink}`}>
              {productWord}
            </a>
            {lede.slice(productWord.length)}
          </>
        ) : (
          lede
        )}
      </p>
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
  const live = DOEHOME_PULSE.agents[0];
  const caller = DOEHOME_PULSE.call.turns[0];
  const { lit } = useDoeHomeStep(revealed, DOEHOME_PULSE.agents.length + 1, variant === "phone" ? 480 : 360);

  return (
    <Scene className="doehome-scene--call">
      <article
        className={`doehome-call doehome-iphone-glass-card${lit >= 1 ? " is-on" : ""}`}
        style={{ "--n": 0 } as CSSProperties}
      >
        <header>
          <em>{DOEHOME_PULSE.live}</em>
          <span>{live.time}</span>
        </header>
        <div className="doehome-call__who">
          <b>{caller.who}</b>
          <span>
            {DOEHOME_PULSE.call.agent} · {live.name}
          </span>
          <span>{DOEHOME_PULSE.number}</span>
        </div>
        <Wave on={lit >= 1} count={11} />
        <p>{caller.text}</p>
        <strong>{DOEHOME_PULSE.human}</strong>
      </article>
      <ul className="doehome-call__lines">
        {DOEHOME_PULSE.agents.map((agent, index) => (
          <li
            key={agent.id}
            className={`doehome-iphone-glass-card${index === 0 ? " is-this" : ""}${
              lit >= 2 + index ? " is-on" : ""
            }`}
            style={{ "--n": index + 1 } as CSSProperties}
          >
            <b>{agent.name}</b>
            <span>
              {agent.voice} · {agent.time}
            </span>
            <em>{agent.state}</em>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

function FabricBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_FABRIC.steps.length, variant === "phone" ? 460 : 360);

  return (
    <Scene className="doehome-scene--stack doehome-scene--mid">
      {DOEHOME_FABRIC.steps.map((step, index) => (
        <div
          key={step.id}
          className={`doehome-pill doehome-iphone-glass-card${index < lit ? " is-on" : ""}`}
          style={{ "--n": index } as CSSProperties}
        >
          <span>{step.kicker}</span>
          <b>{step.label}</b>
        </div>
      ))}
    </Scene>
  );
}

function FloatBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const floatSteps = DOEHOME_FLOAT.claims.length + 3;
  const { lit } = useDoeHomeStep(revealed, floatSteps, variant === "phone" ? 520 : 400);

  return (
    <Scene className="doehome-scene--grid doehome-scene--crop-tl">
      <div
        className={`doehome-float__lead${lit >= 1 ? " is-on" : ""}`}
        style={{ "--n": 0 } as CSSProperties}
      >
        <b className="doehome-float__underpay">{DOEHOME_FLOAT.underpay}</b>
        <p className="doehome-float__note">
          {DOEHOME_FLOAT.underpayNote.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <div className="doehome-grid doehome-grid--pay">
        <div
          className={`doehome-grid__head${lit >= 2 ? " is-on" : ""}`}
          style={{ "--n": 1 } as CSSProperties}
        >
          {DOEHOME_FLOAT.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DOEHOME_FLOAT.claims.map((row, index) => (
          <div
            key={row.claim}
            className={`doehome-grid__row${index === 0 ? " is-this" : ""}${lit >= 3 + index ? " is-on" : ""}`}
            style={{ "--n": index + 2 } as CSSProperties}
          >
            <b>{row.payer}</b>
            <span>{row.claim}</span>
            <span>{row.allowed}</span>
            <span>{row.paid}</span>
          </div>
        ))}
      </div>
      <div
        className={`doehome-float__meta${lit >= floatSteps ? " is-on" : ""}`}
        style={{ "--n": DOEHOME_FLOAT.claims.length + 2 } as CSSProperties}
      >
        <span>{DOEHOME_FLOAT.hold.ref}</span>
        <strong>{DOEHOME_FLOAT.tableTitle}</strong>
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
  const jobs = [
    {
      job: `${DOEHOME_HANDOFF.agent.name} on the line`,
      chart: `${DOEHOME_HANDOFF.context[0]} · call`,
      source: "Pulse",
    },
    {
      job: "Prior auth hold",
      chart: `${DOEHOME_AUTH.ref} · auth`,
      source: "Float",
    },
    {
      job: DOEHOME_HANDOFF.context[2],
      chart: `${DOEHOME_SCRIBE.patient} · visit`,
      source: "Human",
    },
  ] as const;
  const { lit } = useDoeHomeStep(revealed, jobs.length + 2, variant === "phone" ? 420 : 340);

  return (
    <Scene className="doehome-scene--card doehome-scene--mid">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <b>{DOEHOME_HANDOFF.cardTitle}</b>
        <span>{DOEHOME_HANDOFF.badge}</span>
      </header>
      <div className="doehome-table doehome-table--3">
        <div className={`doehome-table__head${lit >= 2 ? " is-on" : ""}`}>
          <span>Job</span>
          <span>Chart</span>
          <span>From</span>
        </div>
        {jobs.map((row, index) => (
          <div
            key={row.job}
            className={`doehome-table__row${index === 0 ? " is-this" : ""}${index < lit - 2 ? " is-on" : ""}`}
            style={{ "--n": index } as CSSProperties}
          >
            <b>{row.job}</b>
            <span>{row.chart}</span>
            <span>{row.source}</span>
          </div>
        ))}
      </div>
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
            className={`doehome-iphone-glass-card${lit >= 1 ? " is-on" : ""}`}
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
  const { lit } = useDoeHomeStep(revealed, DOEHOME_OPEN.items.length, variant === "phone" ? 460 : 360);

  return (
    <Scene className="doehome-scene--door">
      <ol>
        {DOEHOME_OPEN.items.map((item, index) => (
          <li
            key={item.task}
            className={`doehome-door__job doehome-iphone-glass-card${index === 0 ? " is-this" : ""}${
              index < lit ? " is-on" : ""
            }`}
            style={{ "--n": index } as CSSProperties}
          >
            <span>{item.at}</span>
            <b>{item.task}</b>
            <em>{item.done}</em>
          </li>
        ))}
      </ol>
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
        <span className="doehome-week__corner" />
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
  const { lit } = useDoeHomeStep(revealed, DOEHOME_SCRIBE.lines.length + 2, variant === "phone" ? 500 : 380);

  return (
    <Scene className="doehome-scene--note">
      <article
        className={`doehome-note doehome-iphone-glass-card${lit >= 1 ? " is-on" : ""}`}
        style={{ "--n": 0 } as CSSProperties}
      >
        <header>
          <div>
            <b>{DOEHOME_SCRIBE.patient}</b>
            <span>
              {DOEHOME_SCRIBE.room} · {DOEHOME_SCRIBE.provider}
            </span>
          </div>
          <Wave on={lit >= 1} count={9} />
        </header>
        <ul>
          {DOEHOME_SCRIBE.lines.map((line, index) => (
            <li
              key={line}
              className={lit >= 2 + index ? "is-on" : undefined}
              style={{ "--n": index + 1 } as CSSProperties}
            >
              {line}
            </li>
          ))}
        </ul>
        <strong className={lit >= DOEHOME_SCRIBE.lines.length + 2 ? "is-on" : undefined}>
          {DOEHOME_SCRIBE.stamp}
        </strong>
      </article>
    </Scene>
  );
}

function AuthBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_AUTH.pages.length + 1, variant === "phone" ? 480 : 360);

  return (
    <Scene className="doehome-scene--pack">
      <div className={`doehome-pack${lit >= DOEHOME_AUTH.pages.length + 1 ? " is-sent" : ""}`}>
        <div className="doehome-pack__stack">
          {DOEHOME_AUTH.pages.map((page, index) => (
            <article
              key={page.id}
              className={`doehome-iphone-glass-card${index < lit ? " is-on" : ""}`}
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
        <p className={lit >= DOEHOME_AUTH.pages.length + 1 ? "is-on" : undefined}>{DOEHOME_AUTH.stamp}</p>
      </div>
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
  productLink,
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
  productLink?: DoeHomeProductWordmarkId;
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
              <FeatureHeading title={title} lede={lede} productLink={productLink} />
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
        productLink="genome"
      >
        {(revealed) => <GenomeBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_PULSE.id}
        title={DOEHOME_PULSE.title}
        lede={DOEHOME_PULSE.lede}
        src={DOEHOME_SHADERS.pulse}
        gray
        mesh="arches"
        variant="left"
        productLink="pulse"
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
