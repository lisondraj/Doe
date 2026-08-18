"use client";

import type { CSSProperties, ReactNode } from "react";

import { DoeInsureReveal } from "@/components/doeinsure/DoeInsureReveal";
import { DoeHomeShaderFrame } from "@/components/doehome/DoeHomeShaderImage";
import {
  DOEHOME_GENOME,
  DOEHOME_LINE,
  DOEHOME_PACKET,
  DOEHOME_RECORD,
  DOEHOME_SLOT,
  DOEHOME_STACK,
  DOEHOME_WIRE,
} from "@/lib/doehome/doehome-copy";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import { useDoeHomeStep } from "@/lib/doehome/use-doehome-step";

function Scene({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`doehome-scene${className ? ` ${className}` : ""}`} aria-hidden="true">
      {children}
    </div>
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

const SLOT_BUSY = new Set(["Wed-9:00", "Thu-10:20", "Thu-11:40"]);

function GenomeBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 5, variant === "phone" ? 420 : 340);
  const harbor = DOEHOME_GENOME.clinics.find((item) => item.id === "harbor") ?? DOEHOME_GENOME.clinics[0];
  const others = DOEHOME_GENOME.clinics.filter((item) => item.id !== "harbor");

  return (
    <Scene className="doehome-orbit">
      <article className={`doehome-orbit__core${lit >= 1 ? " is-on" : ""}`}>
        <span>{DOEHOME_GENOME.group.name}</span>
        <b>{harbor.model}</b>
        <em>{harbor.version}</em>
      </article>
      <ul>
        {others.map((clinic, index) => (
          <li
            key={clinic.id}
            className={lit >= 2 + index ? "is-on" : undefined}
            style={{ "--n": index } as CSSProperties}
          >
            <b>{clinic.name}</b>
            <span>{clinic.version}</span>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

function PlatformBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 2, variant === "phone" ? 360 : 280);

  return (
    <Scene className="doehome-suite">
      <ul>
        {DOEHOME_STACK.products.map((product, index) => (
          <li key={product.id} className={lit >= 1 ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
            <b>{product.mark}</b>
            <strong>{product.name}</strong>
            <span>{product.body}</span>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

function LineBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 480 : 380);

  return (
    <Scene className="doehome-live">
      <div className={`doehome-live__wave${lit >= 1 ? " is-on" : ""}`} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <em key={index} style={{ "--n": index, "--h": 28 + ((index * 37) % 72) } as CSSProperties} />
        ))}
      </div>
      <article className={lit >= 2 ? "is-on" : undefined}>
        <em>{DOEHOME_LINE.status}</em>
        <b>
          {DOEHOME_LINE.agent} · {DOEHOME_LINE.role}
        </b>
        <span>{DOEHOME_LINE.number}</span>
        <p>{DOEHOME_LINE.hold}</p>
      </article>
    </Scene>
  );
}

function WireBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 2, variant === "phone" ? 360 : 280);

  return (
    <Scene className="doehome-tiles">
      <ul>
        {DOEHOME_WIRE.tiles.map((tile, index) => (
          <li key={tile.name} className={lit >= 1 ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
            <b>{tile.mark}</b>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

function PacketBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_PACKET.files.length + 2, variant === "phone" ? 480 : 380);

  return (
    <Scene className="doehome-packet">
      <article className={lit >= 1 ? "is-on" : undefined}>
        <header>
          <em>{DOEHOME_PACKET.badge}</em>
          <div>
            <b>{DOEHOME_PACKET.cardTitle}</b>
            <span>
              {DOEHOME_PACKET.payer} · {DOEHOME_PACKET.ref}
            </span>
          </div>
        </header>
        <ul>
          {DOEHOME_PACKET.files.map((file, index) => (
            <li key={file.name} className={lit >= 2 + index ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
              <i className="doehome-file" aria-hidden="true" />
              <div>
                <b>{file.name}</b>
                <span>{file.meta}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>
      <span className={`doehome-packet__cta${lit >= DOEHOME_PACKET.files.length + 2 ? " is-on" : ""}`}>
        {DOEHOME_PACKET.action}
      </span>
    </Scene>
  );
}

function SlotBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, 3, variant === "phone" ? 440 : 340);
  const held = DOEHOME_SLOT.held;

  return (
    <Scene className={`doehome-slot${lit >= 3 ? " is-pinned" : ""}`}>
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>{held.label}</span>
        <b>{DOEHOME_SLOT.windowTitle}</b>
      </header>
      <div className="doehome-slot__grid">
        <span />
        {DOEHOME_SLOT.days.map((day) => (
          <b key={day} className={day === held.day && lit >= 2 ? "is-this" : undefined}>
            {day}
          </b>
        ))}
        {DOEHOME_SLOT.hours.flatMap((hour) => [
          <em key={`${hour}-label`}>{hour}</em>,
          ...DOEHOME_SLOT.days.map((day) => {
            const isHeld = day === held.day && hour === held.hour;
            const busy = SLOT_BUSY.has(`${day}-${hour}`);
            return (
              <span
                key={`${day}-${hour}`}
                className={`${busy ? "is-busy" : ""}${isHeld && lit >= 3 ? " is-held" : ""}`.trim() || undefined}
              >
                {isHeld && lit >= 3 ? held.name : null}
              </span>
            );
          }),
        ])}
      </div>
    </Scene>
  );
}

function RecordBody({ revealed }: { revealed: boolean }) {
  const { variant } = useDoeHomePageVariant();
  const { lit } = useDoeHomeStep(revealed, DOEHOME_RECORD.fields.length + 2, variant === "phone" ? 460 : 360);

  return (
    <Scene className="doehome-filecard">
      <header className={lit >= 1 ? "is-on" : undefined}>
        <span>
          {DOEHOME_RECORD.clinic} · {DOEHOME_RECORD.mrn}
        </span>
        <b>{DOEHOME_RECORD.patient}</b>
      </header>
      <dl>
        {DOEHOME_RECORD.fields.map((field, index) => (
          <div key={field.k} className={lit >= 2 + index ? "is-on" : undefined} style={{ "--n": index } as CSSProperties}>
            <dt>{field.k}</dt>
            <dd>{field.v}</dd>
          </div>
        ))}
      </dl>
      <em className={lit >= DOEHOME_RECORD.fields.length + 2 ? "is-on" : undefined}>{DOEHOME_RECORD.stamp}</em>
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
  mesh?: "dots" | "arches";
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
        id={DOEHOME_STACK.id}
        title={DOEHOME_STACK.title}
        lede={DOEHOME_STACK.lede}
        src={DOEHOME_SHADERS.stack}
        gray
        variant="left"
      >
        {(revealed) => <PlatformBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_LINE.id}
        title={DOEHOME_LINE.title}
        lede={DOEHOME_LINE.lede}
        src={DOEHOME_SHADERS.pulse}
        mesh="arches"
        variant="right"
      >
        {(revealed) => <LineBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_WIRE.id}
        title={DOEHOME_WIRE.title}
        lede={DOEHOME_WIRE.lede}
        src={DOEHOME_SHADERS.connect}
        gray
        variant="rise"
      >
        {(revealed) => <WireBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_PACKET.id}
        title={DOEHOME_PACKET.title}
        lede={DOEHOME_PACKET.lede}
        src={DOEHOME_SHADERS.auth}
        mesh="dots"
        variant="left"
      >
        {(revealed) => <PacketBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_SLOT.id}
        title={DOEHOME_SLOT.title}
        lede={DOEHOME_SLOT.lede}
        src={DOEHOME_SHADERS.book}
        gray
        variant="right"
      >
        {(revealed) => <SlotBody revealed={revealed} />}
      </FeatureSection>
      <FeatureSection
        id={DOEHOME_RECORD.id}
        title={DOEHOME_RECORD.title}
        lede={DOEHOME_RECORD.lede}
        src={DOEHOME_SHADERS.chart}
        mesh="arches"
        variant="rise"
      >
        {(revealed) => <RecordBody revealed={revealed} />}
      </FeatureSection>
    </>
  );
}
