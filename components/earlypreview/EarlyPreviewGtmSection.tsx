"use client";

import { type ReactNode, useRef } from "react";

import { SkipButton, TracedOutline } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  cssVars as vars,
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  scrollRamp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_GTM_AGENTS,
  EARLYPREVIEW_GTM_MILESTONES,
  EARLYPREVIEW_GTM_PRICING,
  EARLYPREVIEW_GTM_SCREENS,
  type EarlyPreviewGtmLine,
} from "@/lib/earlypreview/earlypreview-gtm-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/**
 * Every motion is a ramp over scroll progress, as in the /doehealthdesk2 story section. Each screen gets SPAN units
 * on its own clock `t`, starting at 0 when it begins to come in; the first is already in place when the lock starts.
 */
const SPAN = 2;
/** Each screen: fade in, title sweep, then its drawing builds; it fades as the next one comes in. */
const SCENE = { in: [0, 0.2], title: [0, 0.6], out: [SPAN - 0.2, SPAN] } as const;
/** The last screen holds once it has built, then the lock releases. */
const END = (EARLYPREVIEW_GTM_SCREENS - 1) * SPAN + 1.5;

const ramp = (t: number, from: number, to: number) => scrollRamp(t, [from, to]);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Fade in and rise a little, set by `--e` (0 to 1). */
const rise = (e: number) => vars({ "--e": e });
const draw = (d: number) => vars({ "--draw": d });

function screenOpacity(t: number, index: number) {
  const fadeIn = index === 0 ? 1 : ramp(t, ...SCENE.in);
  const fadeOut = index === EARLYPREVIEW_GTM_SCREENS - 1 ? 0 : ramp(t, ...SCENE.out);
  return fadeIn * (1 - fadeOut);
}

/** One screen: the two-line title top left, the visual filling the space under it. */
function Screen({
  index,
  title,
  t,
  className,
  children,
}: {
  index: number;
  title: EarlyPreviewGtmLine[] | readonly EarlyPreviewGtmLine[];
  t: number;
  className: string;
  children: ReactNode;
}) {
  const o = screenOpacity(t, index);
  const s = ramp(t, ...SCENE.title);
  const closing = index === EARLYPREVIEW_GTM_SCREENS - 1;
  return (
    <div
      className={`earlypreview-gtm__scene${closing ? " earlypreview-gtm__scene--closing" : ""}`}
      style={vars({ "--o": o })}
      aria-hidden={o < 0.5}
    >
      <div className={`earlypreview-gtm__frame ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <h2 className="earlypreview-gtm__title">
          {title.map((parts) => (
            <span key={parts[0].text} className={`desk2-genome-swipe desk2-genome-swipe--${parts[0].tone}`} style={vars({ "--s": s })}>
              {parts.map((part) => part.text).join("")}
            </span>
          ))}
        </h2>
        <div className={`earlypreview-gtm__body ${className} ${inter.className}`}>{children}</div>
      </div>
    </div>
  );
}

const toCount = (value: string) => Math.round(Number(value.replace(/[^\d]/g, "")));

/** Agent products on one side, the systems clinics run on the other, every line passing through Doe Connect. */
function AgentFlow({ t, layout }: { t: number; layout: "wide" | "tall" }) {
  const c = EARLYPREVIEW_GTM_AGENTS;
  const wide = layout === "wide";
  // The tall (iPhone) layout keeps the same left-to-right reading, squeezed around a narrow hub.
  const g = wide
    ? { W: 1000, H: 420, hub: { x: 370, y: 162, w: 260, h: 96 }, srcX: 200, srcY: 84, srcStep: 86, railX: 800, railY: 30, railStep: 51.5, pad: 16, lift: 6, reach: 120, ease: 90 }
    : { W: 360, H: 300, hub: { x: 139, y: 110, w: 82, h: 80 }, srcX: 104, srcY: 46, srcStep: 70, railX: 256, railY: 18, railStep: 38, pad: 7, lift: 4.5, reach: 24, ease: 20 };
  const { hub } = g;
  const hubIn = { x: hub.x, y: hub.y + hub.h / 2 };
  const hubOut = { x: hub.x + hub.w, y: hub.y + hub.h / 2 };

  const sources = c.sources.map((name, i) => ({ name, x: g.srcX, y: g.srcY + i * g.srcStep }));
  const rails = c.rails.map((name, i) => ({ name, x: g.railX, y: g.railY + i * g.railStep }));

  const inPath = (s: { x: number; y: number }) =>
    `M${s.x + g.pad} ${s.y - g.lift}C${s.x + g.reach} ${s.y - g.lift} ${hubIn.x - g.ease} ${hubIn.y} ${hubIn.x} ${hubIn.y}`;
  const outPath = (r: { x: number; y: number }) =>
    `M${hubOut.x} ${hubOut.y}C${hubOut.x + g.ease} ${hubOut.y} ${r.x - g.reach} ${r.y - g.lift} ${r.x - g.pad} ${r.y - g.lift}`;

  const hubDraw = ramp(t, 0.55, 0.8);
  return (
    <svg className={`earlypreview-gtm__flow earlypreview-gtm__flow--${layout}`} viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
      {sources.map((s, i) => {
        const d = ramp(t, 0.3 + i * 0.05, 0.6 + i * 0.05);
        return (
          <g key={s.name}>
            <path d={inPath(s)} pathLength={1} className="is-draw is-soft" style={draw(d)} />
            <text x={s.x} y={s.y} textAnchor="end" className="is-label" style={{ opacity: clamp01(d * 3) }}>
              {s.name}
            </text>
          </g>
        );
      })}
      <rect x={hub.x} y={hub.y} width={hub.w} height={hub.h} rx={11} pathLength={1} className="is-draw is-hub" style={draw(hubDraw)} />
      {wide ? (
        <>
          <text x={hub.x + hub.w / 2} y={hub.y + hub.h / 2 - 1} textAnchor="middle" className={`is-hub-name ${p22Mackinac.className}`} style={{ opacity: clamp01((hubDraw - 0.4) * 2.5) }}>
            {c.hub.name}
          </text>
          <text x={hub.x + hub.w / 2} y={hub.y + hub.h / 2 + 25} textAnchor="middle" className="is-hub-detail" style={{ opacity: clamp01((hubDraw - 0.6) * 2.5) }}>
            {c.hub.detail}
          </text>
        </>
      ) : (
        <text textAnchor="middle" className={`is-hub-name ${p22Mackinac.className}`} style={{ opacity: clamp01((hubDraw - 0.4) * 2.5) }}>
          {c.hub.name.split(" ").map((word, i) => (
            <tspan key={word} x={hub.x + hub.w / 2} y={hub.y + hub.h / 2 + (i === 0 ? -4 : 17)}>
              {word}
            </tspan>
          ))}
        </text>
      )}
      {rails.map((r, i) => {
        const d = ramp(t, 0.75 + i * 0.035, 1.0 + i * 0.035);
        return (
          <g key={r.name}>
            <path d={outPath(r)} pathLength={1} className="is-draw is-soft" style={draw(d)} />
            <text x={r.x} y={r.y} className="is-label" style={{ opacity: clamp01((d - 0.6) * 2.5) }}>
              {r.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AgentsScreen({ t }: { t: number }) {
  const c = EARLYPREVIEW_GTM_AGENTS;
  return (
    <Screen index={0} title={c.title} t={t} className="earlypreview-gtm__agents">
      <div className="earlypreview-gtm__flow-box">
        <AgentFlow t={t} layout="wide" />
        <AgentFlow t={t} layout="tall" />
      </div>
      <dl className="earlypreview-gtm__facts">
        {c.facts.map((fact, i) => (
          <div key={fact.label} style={rise(ramp(t, 1.05 + i * 0.1, 1.35 + i * 0.1))}>
            <dt className={p22Mackinac.className}>{fact.value}</dt>
            <dd>{fact.label}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}

/** The demand report a free clinic gets, traced in, beside the three prices. */
function PricingScreen({ t }: { t: number }) {
  const c = EARLYPREVIEW_GTM_PRICING;
  const reportRef = useRef<HTMLDivElement>(null);
  const report = ramp(t, 0.3, 0.65);
  return (
    <Screen index={1} title={c.title} t={t} className="earlypreview-gtm__pricing">
      <div ref={reportRef} className="earlypreview-gtm__report" style={rise(report)}>
        <TracedOutline draw={report} box={reportRef} className="earlypreview-gtm__report-line" />
        <p className="earlypreview-gtm__report-from">{c.report.from}</p>
        <p className={`earlypreview-gtm__report-text desk2-genome-swipe desk2-genome-swipe--cream ${p22Mackinac.className}`} style={vars({ "--s": ramp(t, 0.5, 0.95) })}>
          {c.report.text}
        </p>
      </div>
      <div className="earlypreview-gtm__prices">
        <ul>
          {c.plans.map((plan, i) => (
            <li key={plan.name} style={rise(ramp(t, 0.85 + i * 0.14, 1.15 + i * 0.14))}>
              <span className={`earlypreview-gtm__price ${p22Mackinac.className}`}>{plan.price}</span>
              <span className="earlypreview-gtm__price-name">{plan.name}</span>
              <span className="earlypreview-gtm__price-detail">{plan.detail}</span>
            </li>
          ))}
        </ul>
        <p className="earlypreview-gtm__note" style={rise(ramp(t, 1.3, 1.55))}>
          {c.note}
        </p>
      </div>
    </Screen>
  );
}

/** "$500K" at e = 0.5 reads "$250K": the digits count up, the prefix and suffix stay put. */
function countUp(value: string, e: number) {
  const m = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return value;
  return `${m[1]}${Math.round(toCount(m[2]) * e).toLocaleString("en-US")}${m[3]}`;
}

function MilestonesScreen({ t }: { t: number }) {
  const c = EARLYPREVIEW_GTM_MILESTONES;
  return (
    <Screen index={2} title={c.title} t={t} className="earlypreview-gtm__milestones">
      <ol className="earlypreview-gtm__quarters">
        {c.quarters.map((q, i) => {
          const e = ramp(t, 0.35 + i * 0.16, 0.65 + i * 0.16);
          const count = ramp(t, 0.35 + i * 0.16, 0.95 + i * 0.16);
          return (
            <li key={q.when} style={rise(e)}>
              <span className={`earlypreview-gtm__figure ${p22Mackinac.className}`} aria-label={q.value}>
                {/* The final value, unseen, holds the column's width while the digits count up. */}
                <span aria-hidden className="is-final">
                  {q.value}
                </span>
                <span aria-hidden>{countUp(q.value, count)}</span>
              </span>
              <span className="earlypreview-gtm__quarter-label">{q.label}</span>
              <span className="earlypreview-gtm__when">{q.when}</span>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}

const SCREENS = [AgentsScreen, PricingScreen, MilestonesScreen] as const;

/**
 * /earlypreview: Doe's go-to-market as a scroll-locked brown section. When it reaches the top of the screen the page
 * holds still and scrolling steps through three screens: how agents integrate, pricing, and the next twelve months. The last screen stays once it has built.
 */
export function EarlyPreviewGtmSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  const clock = (i: number) => p - i * SPAN;
  const last = EARLYPREVIEW_GTM_SCREENS - 1;
  /** A screen is mounted only around its own stretch of the scroll. */
  const shown = (i: number) => (i === 0 || clock(i) > -0.02) && (i === last || clock(i) < SPAN + 0.02);

  // The corner counter follows whichever screen is most visible.
  const opacities = SCREENS.map((_, i) => screenOpacity(clock(i), i));
  const current = opacities.reduce((best, o, i) => (o > opacities[best] ? i : best), 0);

  return (
    <div className="doehealth-desk2-visible-track earlypreview-gtm-track" style={vars({ "--desk2-visible-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section
        ref={sectionRef}
        className={`doehealth-desk2-visible earlypreview-gtm doehealth-desk2-nav-wash-surface ${p22Mackinac.className}`}
        aria-label="How Doe goes to market"
      >
        {SCREENS.map((Scene, i) => (shown(i) ? <Scene key={i} t={clock(i)} /> : null))}

        <p className={`earlypreview-gtm__counter ${inter.className}`} style={vars({ "--o": opacities[current] })} aria-hidden>
          {current + 1} / {EARLYPREVIEW_GTM_SCREENS}
        </p>

        <SkipButton shown={p > 0 && p < END} label="Skip to the twelve-month plan" onClick={skip} />
      </section>
    </div>
  );
}
