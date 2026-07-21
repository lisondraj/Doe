"use client";

import type { ReactNode } from "react";

import { PitchBoxCenterLines } from "@/components/pitch/PitchBoxCenterLines";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import {
  PITCH_ASK,
  PITCH_CLOSING,
  PITCH_COMPETITION,
  PITCH_MARKET,
  PITCH_PROBLEM,
  PITCH_PRODUCT_ROADMAP,
  PITCH_PRODUCT_VOICE,
  PITCH_SOLUTION,
  PITCH_TEAM,
} from "@/lib/pitch/pitch-deck-copy";
import type { PitchSlideId } from "@/lib/pitch/pitch-slides";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";
import {
  doeHomeDuskShaderBandSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { ProtoGrainGradientSurface } from "@/lib/proto/proto-grain-gradient";

type PitchTone = "dark" | "light";

function slideFrameClassName(tone: PitchTone) {
  return `pitch-slide-content relative z-[10] flex h-full w-full flex-col justify-center px-[clamp(2.25rem,4.5vw,4.75rem)] py-[clamp(2rem,3.5vh,3rem)] pb-[clamp(4.75rem,7vh,5.75rem)]${
    tone === "light" ? " pitch-slide-content--light" : ""
  }`;
}

function Eyebrow({ children, tone }: { children: string; tone: PitchTone }) {
  return (
    <p
      className={`pitch-slide-content__eyebrow m-0 text-[0.72rem] font-medium uppercase leading-none tracking-[0.16em] ${
        tone === "light" ? "text-[rgba(61,46,31,0.52)]" : "text-[rgba(245,230,208,0.52)]"
      } ${suisseIntl.className}`}
    >
      {children}
    </p>
  );
}

function Headline({
  lines,
  tone,
  centered = false,
}: {
  lines: readonly string[];
  tone: PitchTone;
  centered?: boolean;
}) {
  return (
    <h2
      className={`pitch-slide-content__headline m-0 mt-[clamp(0.85rem,1.2vw,1rem)] max-w-[18ch] text-[clamp(2.15rem,1.15rem+2.8vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.032em] ${
        tone === "light" ? "text-[#1a1208]" : "text-[#f5e6d0]"
      } ${centered ? "mx-auto text-center" : "text-left"} ${suisseIntl.className}`}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

function Body({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: PitchTone;
  className?: string;
}) {
  return (
    <p
      className={`pitch-slide-content__body m-0 text-[clamp(0.98rem,0.86rem+0.38vw,1.12rem)] font-normal leading-[1.48] tracking-[-0.012em] ${
        tone === "light" ? "text-[rgba(61,46,31,0.78)]" : "text-[rgba(245,230,208,0.74)]"
      } ${inter.className} ${className}`}
    >
      {children}
    </p>
  );
}

function BulletList({
  items,
  tone,
}: {
  items: readonly string[];
  tone: PitchTone;
}) {
  return (
    <ul
      className={`pitch-slide-content__list m-0 mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[42rem] list-none space-y-[0.62rem] p-0 ${inter.className}`}
    >
      {items.map((item) => (
        <li
          key={item}
          className={`relative pl-[1.05rem] text-[clamp(0.92rem,0.84rem+0.28vw,1.02rem)] leading-[1.42] tracking-[-0.01em] before:absolute before:left-0 before:top-[0.58em] before:h-[0.28rem] before:w-[0.28rem] before:rounded-full ${
            tone === "light"
              ? "text-[rgba(61,46,31,0.76)] before:bg-[rgba(61,46,31,0.34)]"
              : "text-[rgba(245,230,208,0.72)] before:bg-[rgba(245,230,208,0.42)]"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: PitchTone;
}) {
  return (
    <div
      className={`rounded-[0.65rem] border px-[1rem] py-[0.85rem] ${
        tone === "light"
          ? "border-[rgba(26,18,8,0.1)] bg-[rgba(255,255,255,0.55)]"
          : "border-[rgba(245,230,208,0.12)] bg-[rgba(245,230,208,0.05)]"
      }`}
    >
      <p
        className={`m-0 text-[0.72rem] uppercase tracking-[0.12em] ${
          tone === "light" ? "text-[rgba(61,46,31,0.52)]" : "text-[rgba(245,230,208,0.52)]"
        } ${suisseIntl.className}`}
      >
        {label}
      </p>
      <p
        className={`m-0 mt-[0.35rem] text-[clamp(1.65rem,1rem+1.5vw,2.35rem)] font-normal leading-none tracking-[-0.03em] ${
          tone === "light" ? "text-[#1a1208]" : "text-[#f5e6d0]"
        } ${suisseIntl.className}`}
      >
        {value}
      </p>
    </div>
  );
}

const customizeAgentsShader = doeHomeDuskShaderBandSurface("front-desk");
const priorAuthShader = doeHomeDuskShaderBandSurface("inbox");
const problemShader = doeHomeDuskShaderBandSurface("ambient");
const problemBoxInsetClassName = "p-[clamp(0.85rem,1.15vw,1.1rem)]";

function ProblemSlide() {
  return (
    <div className="pitch-slide-content relative z-[10] flex h-full w-full flex-col p-[clamp(1.35rem,2.5vw,2.65rem)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[clamp(1.1rem,1.6vw,1.85rem)]">
        {problemShader ? (
          <ProtoGrainGradient
            variant={problemShader.variant}
            colors={problemShader.colors}
            colorBack={problemShader.colorBack}
            static
          />
        ) : null}
        <div
          className={`pointer-events-none absolute inset-0 z-[2] flex items-start justify-start ${problemBoxInsetClassName}`}
        >
          <p
            className={`pitch-slide-content__headline m-0 text-left text-[clamp(3.35rem,1.55rem+4.8vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.036em] text-[#FFF8F0] ${suisseIntl.className}`}
          >
            {PITCH_PROBLEM.headline.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function SolutionSlide() {
  return (
    <div className="pitch-slide-content relative z-[10] flex h-full w-full flex-col items-end justify-end px-[clamp(2.25rem,4.5vw,4.75rem)] pb-[clamp(4.75rem,7vh,5.75rem)] pt-[clamp(2rem,3.5vh,3rem)]">
      <h2
        className={`pitch-slide-content__headline m-0 text-right text-[clamp(3.35rem,1.55rem+4.8vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.036em] text-[#FFF8F0] ${suisseIntl.className}`}
      >
        {PITCH_SOLUTION.headline.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

const pitchSlideTitleClassName = `pitch-slide-content__headline m-0 text-[clamp(3.35rem,1.55rem+4.8vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.036em] ${suisseIntl.className}`;
const pitchClosingPillClassName = `rounded-full border border-[rgba(245,230,208,0.16)] bg-[rgba(245,230,208,0.06)] px-[0.75rem] py-[0.38rem] text-[0.72rem] leading-none tracking-[0.04em] text-[rgba(245,230,208,0.72)] ${suisseIntl.className}`;
const pitchBoxTagPillClassName = `rounded-full border border-[rgba(245,230,208,0.28)] bg-[rgba(245,230,208,0.12)] px-[clamp(0.88rem,0.72rem+0.4vw,1.05rem)] py-[clamp(0.46rem,0.38rem+0.22vw,0.54rem)] text-[clamp(0.82rem,0.68rem+0.38vw,0.94rem)] leading-none tracking-[0.04em] text-[rgba(245,230,208,0.88)] ${suisseIntl.className}`;

function PitchShaderFillBox({
  surface,
  label,
  className = "",
  nameLines,
  namePlacement = "top-left",
  roleLabel,
  roleLabelPlacement = "below-name",
  credentials,
  credentialsPlacement = "bottom-right",
  tags,
  tagsPlacement = "bottom-left",
}: {
  surface: ProtoGrainGradientSurface;
  label: string;
  className?: string;
  nameLines?: readonly [string, string];
  namePlacement?: "top-left" | "bottom-right";
  roleLabel?: string;
  roleLabelPlacement?: "above-name" | "below-name";
  credentials?: readonly string[];
  credentialsPlacement?: "top-left" | "bottom-right";
  tags?: readonly string[];
  tagsPlacement?: "bottom-left" | "top-right";
}) {
  const boxLabelClassName = `${suisseIntl.className} font-normal leading-[0.98] tracking-[-0.036em] text-[#FFF8F0]`;
  const nameClassName = `pointer-events-none absolute z-[2] m-0 p-[clamp(1rem,1.4vw,1.35rem)] text-[clamp(2.85rem,1.25rem+3.6vw,4.75rem)] ${boxLabelClassName}`;
  const credentialsClassName = `pointer-events-none absolute z-[2] m-0 max-w-[min(22ch,88%)] p-[clamp(1rem,1.4vw,1.35rem)] text-[clamp(1.05rem,0.62rem+1.15vw,1.85rem)] font-normal leading-[1.06] tracking-[-0.034em] text-[#FFF8F0] ${suisseIntl.className}`;
  const roleLabelClassName =
    "mt-[0.28em] block text-[clamp(0.72rem,0.56rem+0.38vw,0.92rem)] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(255,248,240,0.76)]";

  return (
    <div
      className={`relative overflow-hidden rounded-[clamp(1.1rem,1.6vw,1.85rem)] ${className}`.trim()}
      aria-label={label}
    >
      <ProtoGrainGradient
        variant={surface.variant}
        colors={surface.colors}
        colorBack={surface.colorBack}
        static
      />
      <PitchBoxCenterLines />
      {nameLines ? (
        <p
          className={`${nameClassName} ${
            namePlacement === "top-left" ? "left-0 top-0 text-left" : "bottom-0 right-0 text-right"
          }`}
        >
          {roleLabel && roleLabelPlacement === "above-name" ? (
            <span className={`${roleLabelClassName} mb-[0.28em] mt-0`}>{roleLabel}</span>
          ) : null}
          <span className="block">{nameLines[0]}</span>
          <span className="block">{nameLines[1]}</span>
          {roleLabel && roleLabelPlacement === "below-name" ? (
            <span className={roleLabelClassName}>{roleLabel}</span>
          ) : null}
        </p>
      ) : null}
      {credentials ? (
        <p
          className={`${credentialsClassName} ${
            credentialsPlacement === "top-left"
              ? "left-0 top-0 text-left"
              : "bottom-0 right-0 text-right"
          }`}
        >
          {credentials.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : null}
      {tags ? (
        <div
          className={`pointer-events-none absolute z-[2] flex flex-col gap-[0.45rem] p-[clamp(1rem,1.4vw,1.35rem)] ${
            tagsPlacement === "top-right"
              ? "right-0 top-0 items-end"
              : "bottom-0 left-0 items-start"
          }`}
        >
          {tags.map((tag) => (
            <span key={tag} className={pitchBoxTagPillClassName}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TeamSlide() {
  return (
    <div className="pitch-slide-content relative z-[10] flex h-full w-full flex-col px-[clamp(2.25rem,4.5vw,4.75rem)] pt-[clamp(2.25rem,4vh,3.25rem)] pb-[clamp(4.75rem,7vh,5.75rem)]">
      <div className="flex min-h-0 flex-1 w-full items-center justify-start py-[clamp(0.5rem,1.2vh,1rem)]">
        <div className="grid w-full min-w-0 max-w-full grid-cols-2 gap-[clamp(1rem,2vw,1.75rem)]">
          {customizeAgentsShader ? (
            <PitchShaderFillBox
              surface={customizeAgentsShader}
              label="Customize agents to fit your needs"
              className="aspect-square w-full min-w-0"
              nameLines={PITCH_TEAM.founders[0].lines}
              namePlacement={PITCH_TEAM.founders[0].placement}
              roleLabel={PITCH_TEAM.founders[0].roleLabel}
              roleLabelPlacement={PITCH_TEAM.founders[0].roleLabelPlacement}
              credentials={PITCH_TEAM.founders[0].credentials}
              credentialsPlacement={PITCH_TEAM.founders[0].credentialsPlacement}
              tags={PITCH_TEAM.founders[0].tags}
              tagsPlacement={PITCH_TEAM.founders[0].tagsPlacement}
            />
          ) : null}
          {priorAuthShader ? (
            <PitchShaderFillBox
              surface={priorAuthShader}
              label="Prior auth ships from the chart"
              className="aspect-square w-full min-w-0"
              nameLines={PITCH_TEAM.founders[1].lines}
              namePlacement={PITCH_TEAM.founders[1].placement}
              roleLabel={PITCH_TEAM.founders[1].roleLabel}
              roleLabelPlacement={PITCH_TEAM.founders[1].roleLabelPlacement}
              credentials={PITCH_TEAM.founders[1].credentials}
              credentialsPlacement={PITCH_TEAM.founders[1].credentialsPlacement}
              tags={PITCH_TEAM.founders[1].tags}
              tagsPlacement={PITCH_TEAM.founders[1].tagsPlacement}
            />
          ) : null}
        </div>
      </div>
      <h2
        className={`${pitchSlideTitleClassName} mt-[clamp(1.25rem,2.2vh,2rem)] shrink-0 whitespace-nowrap text-left text-[#1a1208]`}
      >
        {PITCH_TEAM.headline}
      </h2>
    </div>
  );
}

function MarketSlide() {
  const maxBar = Math.max(...PITCH_MARKET.bars.map((bar) => bar.value));

  return (
    <div className={`${slideFrameClassName("dark")} lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-[clamp(1.5rem,3vw,2.5rem)]`}>
      <div className="min-w-0">
        <Eyebrow tone="dark">{PITCH_MARKET.eyebrow}</Eyebrow>
        <Headline lines={PITCH_MARKET.headline} tone="dark" />
        <div className="mt-[clamp(1rem,1.35vw,1.2rem)] rounded-[0.75rem] border border-[rgba(245,230,208,0.16)] bg-[rgba(245,230,208,0.06)] px-[1.1rem] py-[1rem]">
          <p className={`m-0 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(245,230,208,0.52)] ${suisseIntl.className}`}>
            {PITCH_MARKET.tamLabel}
          </p>
          <p className={`m-0 mt-[0.35rem] text-[clamp(2rem,1.2rem+2vw,2.85rem)] leading-none tracking-[-0.03em] text-[#f5e6d0] ${suisseIntl.className}`}>
            {PITCH_MARKET.tamValue}
          </p>
          <p className={`m-0 mt-[0.45rem] text-[0.88rem] leading-[1.35] text-[rgba(245,230,208,0.68)] ${inter.className}`}>
            {PITCH_MARKET.tamHeadline}
          </p>
        </div>
        <Body tone="dark" className="mt-[0.85rem] max-w-[34rem]">
          {PITCH_MARKET.gtm}
        </Body>
      </div>
      <div className="mt-[clamp(1.25rem,2vw,1.5rem)] space-y-[0.55rem] lg:mt-0">
        {PITCH_MARKET.bars.map((bar) => (
          <div key={bar.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[0.65rem]">
            <div className="min-w-0">
              <div className="h-[0.42rem] overflow-hidden rounded-full bg-[rgba(245,230,208,0.08)]">
                <div
                  className="h-full rounded-full bg-[#E8A060]"
                  style={{ width: `${(bar.value / maxBar) * 100}%` }}
                />
              </div>
              <p className={`m-0 mt-[0.28rem] truncate text-[0.72rem] leading-none text-[rgba(245,230,208,0.62)] ${inter.className}`}>
                {bar.label}
              </p>
            </div>
            <span className={`shrink-0 text-[0.78rem] leading-none text-[#f5e6d0] ${suisseIntl.className}`}>
              {bar.value}
              {bar.suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductVoiceSlide() {
  return (
    <div className={`${slideFrameClassName("light")} lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-[clamp(1.5rem,3vw,2.5rem)]`}>
      <div className="min-w-0">
        <Eyebrow tone="light">{PITCH_PRODUCT_VOICE.eyebrow}</Eyebrow>
        <Headline lines={PITCH_PRODUCT_VOICE.headline} tone="light" />
        <Body tone="light" className="mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[34rem]">
          {PITCH_PRODUCT_VOICE.lead}
        </Body>
        <div className="mt-[clamp(1rem,1.35vw,1.2rem)] grid grid-cols-3 gap-[0.55rem]">
          <StatCard tone="light" label="Calls / 24h" value={PITCH_PRODUCT_VOICE.stats.calls} />
          <StatCard tone="light" label="Resolved" value={PITCH_PRODUCT_VOICE.stats.resolved} />
          <StatCard tone="light" label="Overnight" value={PITCH_PRODUCT_VOICE.stats.overnight} />
        </div>
      </div>
      <div className="mt-[clamp(1.25rem,2vw,1.5rem)] lg:mt-0">
        <div className="grid gap-[0.45rem] sm:grid-cols-2">
          {PITCH_PRODUCT_VOICE.features.map((feature) => (
            <div
              key={feature.label}
              className="rounded-[0.55rem] border border-[rgba(26,18,8,0.1)] bg-[rgba(255,255,255,0.45)] px-[0.85rem] py-[0.7rem]"
            >
              <p className={`m-0 text-[0.82rem] leading-none tracking-[-0.012em] text-[#1a1208] ${suisseIntl.className}`}>
                {feature.label}
              </p>
              <p className={`m-0 mt-[0.3rem] text-[0.76rem] leading-[1.35] text-[rgba(61,46,31,0.68)] ${inter.className}`}>
                {feature.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductRoadmapSlide() {
  return (
    <div className={slideFrameClassName("dark")}>
      <Eyebrow tone="dark">{PITCH_PRODUCT_ROADMAP.eyebrow}</Eyebrow>
      <Headline lines={PITCH_PRODUCT_ROADMAP.headline} tone="dark" />
      <Body tone="dark" className="mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[40rem]">
        {PITCH_PRODUCT_ROADMAP.body}
      </Body>
      <div className="mt-[clamp(1.35rem,2vw,1.65rem)] max-w-[36rem]">
        <div className="rounded-[0.75rem] border border-[rgba(245,230,208,0.18)] bg-[rgba(245,230,208,0.06)] px-[1rem] py-[0.85rem]">
          <p className={`m-0 text-[0.72rem] uppercase tracking-[0.12em] text-[rgba(245,230,208,0.52)] ${suisseIntl.className}`}>
            Live today
          </p>
          <p className={`m-0 mt-[0.35rem] text-[1.15rem] leading-none text-[#f5e6d0] ${suisseIntl.className}`}>
            {PITCH_PRODUCT_ROADMAP.focus}
          </p>
        </div>
        <div className="mt-[0.65rem] grid gap-[0.45rem]">
          {PITCH_PRODUCT_ROADMAP.rows.map((row) => (
            <div key={row.join("-")} className="grid grid-cols-3 gap-[0.45rem]">
              {row.map((label) => (
                <div
                  key={label}
                  className="rounded-[0.55rem] border border-[rgba(245,230,208,0.12)] bg-[rgba(245,230,208,0.04)] px-[0.75rem] py-[0.62rem] text-center"
                >
                  <span className={`text-[0.82rem] leading-none text-[rgba(245,230,208,0.78)] ${suisseIntl.className}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductBlankSlide() {
  return <div className={slideFrameClassName("light")} aria-label="Blank product slide" />;
}

function CompetitionSlide() {
  return (
    <div className={slideFrameClassName("dark")}>
      <Eyebrow tone="dark">{PITCH_COMPETITION.eyebrow}</Eyebrow>
      <Headline lines={PITCH_COMPETITION.headline} tone="dark" />
      <Body tone="dark" className="mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[40rem]">
        {PITCH_COMPETITION.intro}
      </Body>
      <BulletList items={PITCH_COMPETITION.bullets} tone="dark" />
      <Body tone="dark" className="mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[38rem] italic">
        {PITCH_COMPETITION.integrate}
      </Body>
    </div>
  );
}

function AskSlide() {
  return (
    <div className={slideFrameClassName("dark")}>
      <Eyebrow tone="dark">{PITCH_ASK.eyebrow}</Eyebrow>
      <Headline lines={PITCH_ASK.headline} tone="dark" />
      <Body tone="dark" className="mt-[clamp(1rem,1.35vw,1.2rem)] max-w-[40rem]">
        {PITCH_ASK.body}
      </Body>
      <BulletList items={PITCH_ASK.points} tone="dark" />
    </div>
  );
}

function ClosingSlide() {
  return (
    <div className={`${slideFrameClassName("dark")} items-center text-center`}>
      <Eyebrow tone="dark">{PITCH_CLOSING.eyebrow}</Eyebrow>
      <p
        className={`m-0 mt-[clamp(0.85rem,1.2vw,1rem)] text-[clamp(4rem,2.5rem+5vw,7rem)] font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
      >
        {PITCH_CLOSING.wordmark}
      </p>
      <Headline lines={PITCH_CLOSING.headline} tone="dark" centered />
      <div className="mt-[clamp(1.25rem,2vw,1.65rem)] flex max-w-[40rem] flex-wrap justify-center gap-[0.45rem]">
        {PITCH_CLOSING.pills.map((pill) => (
          <span
            key={pill}
            className={pitchClosingPillClassName}
          >
            {pill}
          </span>
        ))}
      </div>
      <p className={`m-0 mt-[clamp(1.35rem,2vw,1.75rem)] text-[clamp(1rem,0.88rem+0.35vw,1.12rem)] leading-none text-[rgba(245,230,208,0.72)] ${inter.className}`}>
        {PITCH_CLOSING.contact}
      </p>
    </div>
  );
}

const SLIDE_RENDERERS: Record<Exclude<PitchSlideId, "welcome">, () => ReactNode> = {
  problem: ProblemSlide,
  solution: SolutionSlide,
  competition: CompetitionSlide,
  "product-voice": ProductVoiceSlide,
  "product-roadmap": ProductRoadmapSlide,
  "product-blank": ProductBlankSlide,
  team: TeamSlide,
  market: MarketSlide,
  ask: AskSlide,
  closing: ClosingSlide,
};

export function PitchSlideContent({ slideId }: { slideId: PitchSlideId }) {
  if (slideId === "welcome") {
    return null;
  }

  const Renderer = SLIDE_RENDERERS[slideId];
  return <Renderer />;
}
