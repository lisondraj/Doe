import { Easing, interpolate, useCurrentFrame } from "remotion";

import { Product2CallHistoryOpenTaskIcon } from "@/components/product2/Product2CallHistoryOpenTaskIcon";
import { Product2CallHistoryRecentLabs } from "@/components/product2/Product2CallHistoryRecentLabs";
import { Product2CallHistoryRecentVitals } from "@/components/product2/Product2CallHistoryRecentVitals";
import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { Product2ChartProfileBpTrend } from "@/components/product2/Product2ChartProfileBpTrend";
import {
  PRODUCT2_CALL_HISTORY_A1C_TREND,
  PRODUCT2_CALL_HISTORY_BP_TREND,
  PRODUCT2_CALL_HISTORY_RECENT_LABS,
  PRODUCT2_CALL_HISTORY_RECENT_VITALS,
} from "@/lib/product2/product2-copy";
import { dmSans, suisseIntl } from "@/remotion/fonts";

import {
  DOE_LAUNCH_WIDTH,
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_TURN_HOLDS_AFTER,
  DOE_SARAH_TURN_REPLY_HOLDS,
  DOE_SARAH_CHART_ACCESS_INTERLUDE_BEFORE_TURN,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_INTRO_TURN_COUNT,
} from "../constants";
import { buildCallTurnRevealTiming, findCallInterludeWindow } from "../../motion-ui";

import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

/** Scale Sarah chart strip tiles — large enough to bleed off frame edges. */
export const CHART_STRIP_SCALE = 1.65;
export const CHART_STRIP_BLEED_Y_PX = 80;
const BASE_TILE_HEIGHT_PX = 300;
const BASE_TILE_GAP_PX = 16;
const BASE_TILE_PLOT_HEIGHT_PX = 210;
export const CHART_STRIP_TILE_HEIGHT_PX = Math.round(BASE_TILE_HEIGHT_PX * CHART_STRIP_SCALE);
const TILE_HEIGHT_PX = CHART_STRIP_TILE_HEIGHT_PX;
const TILE_GAP_PX = Math.round(BASE_TILE_GAP_PX * CHART_STRIP_SCALE);
const TILE_PLOT_HEIGHT = `${Math.round(BASE_TILE_PLOT_HEIGHT_PX * CHART_STRIP_SCALE)}px`;
const TILE_LIFT_PX = Math.round(32 * CHART_STRIP_SCALE);

const ACCESS_DONE = 48;
/** Mount + start scrolling before fade-in so there is no post-appear hold. */
const SCROLL_START = 52;
const STRIP_APPEAR = 64;
const STRIP_REVEAL = 28;
/** Fraction of strip width to pan — stop before meds/conditions/allergies. */
const CHART_SCROLL_MAX_RATIO = 0.4;
/** Keep scrolling through close — modal fade starts earlier in motion-ui. */
const SCROLL_END_PAD = 2;
const CHART_BLUR_MAX = 16;
/** Stagger each tile’s unblur/lift across the strip reveal. */
const TILE_STAGGER = 0.055;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);
const SCROLL_EASE = Easing.bezier(0.16, 0.12, 0.22, 1);

/** Densified strip copy — fills same-height boxes without sparse blank regions. */
const STRIP_COPY = {
  visits: {
    label: "Recent Visits",
    items: [
      { title: "Annual Physical", when: "Jan 14 · Dr. Chen", month: "Jan", day: 14, weekday: "Tue" },
      { title: "Diabetes Follow-up", when: "Apr 9 · Clinic", month: "Apr", day: 9, weekday: "Wed" },
      { title: "Virtual Check-in", when: "Jun 24 · Video", month: "Jun", day: 24, weekday: "Tue" },
      { title: "Lab Review", when: "Jul 8 · Nurse", month: "Jul", day: 8, weekday: "Tue" },
    ],
  },
  tasks: {
    label: "Open Tasks",
    items: [
      { title: "Metformin refill", when: "Due today", tone: "due" as const, icon: "rx" as const },
      { title: "Diabetic eye exam", when: "Overdue 2 wk", tone: "overdue" as const, icon: "eye" as const },
      { title: "A1C lab recheck", when: "Due Fri", tone: "due" as const, icon: "rx" as const },
      { title: "Foot exam", when: "Due Mon", tone: "due" as const, icon: "eye" as const },
    ],
  },
  meds: {
    label: "Medications",
    items: [
      "Metformin XR 500mg",
      "Atorvastatin 20mg",
      "Lisinopril 10mg",
      "Empagliflozin 10mg",
      "Aspirin 81mg",
      "Vitamin D 2000 IU",
    ],
  },
  conditions: {
    label: "Conditions",
    items: ["Type 2 Diabetes", "Hypertension", "Hyperlipidemia", "Obesity (BMI 32)", "Sleep apnea"],
  },
  allergies: {
    label: "Allergies",
    items: ["Penicillin — rash", "Sulfa drugs", "Shellfish", "Latex", "Ibuprofen — mild"],
  },
} as const;

/** Same-height row — right tiles widened so denser copy fills without crush. */
const CHART_TILES = [
  { id: "a1c", width: Math.round(440 * CHART_STRIP_SCALE) },
  { id: "vitals", width: Math.round(340 * CHART_STRIP_SCALE) },
  { id: "bp", width: Math.round(380 * CHART_STRIP_SCALE) },
  { id: "labs", width: Math.round(320 * CHART_STRIP_SCALE) },
  { id: "visits", width: Math.round(320 * CHART_STRIP_SCALE) },
  { id: "tasks", width: Math.round(318 * CHART_STRIP_SCALE) },
  { id: "meds", width: Math.round(300 * CHART_STRIP_SCALE) },
  { id: "conditions", width: Math.round(280 * CHART_STRIP_SCALE) },
  { id: "allergies", width: Math.round(270 * CHART_STRIP_SCALE) },
] as const;

const VIEWPORT_INSET_PX = 0;
const TRACK_WIDTH_PX =
  CHART_TILES.reduce((sum, tile) => sum + tile.width, 0) + TILE_GAP_PX * (CHART_TILES.length - 1);
const CHART_STRIP_VIEWPORT_WIDTH_PX = DOE_LAUNCH_WIDTH - VIEWPORT_INSET_PX * 2;
const CHART_STRIP_MAX_SCROLL_PX = Math.max(0, TRACK_WIDTH_PX - CHART_STRIP_VIEWPORT_WIDTH_PX);
const CHART_STRIP_SCROLL_TARGET_PX = Math.round(CHART_STRIP_MAX_SCROLL_PX * CHART_SCROLL_MAX_RATIO);
export const CHART_STRIP_SNAPSHOT_SCROLL_X = -CHART_STRIP_SCROLL_TARGET_PX;

function InterludeStepIcon({ state, spinDeg }: { state: "spinner" | "check"; spinDeg: number }) {
  if (state === "check") {
    return (
      <svg className="motion4-chart-interlude__icon motion4-chart-interlude__check" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2.25 6.1 4.65 8.5 9.75 3.4"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="motion4-chart-interlude__spinner motion4-chart-interlude__icon"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ transform: `rotate(${spinDeg}deg)` }}
    >
      <circle cx="8" cy="8" r="6.25" stroke="rgba(242, 232, 218, 0.18)" strokeWidth="1.75" />
      <path d="M14.25 8a6.25 6.25 0 0 0-6.25-6.25" stroke="#d4a574" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChartAccessTile({ id }: { id: (typeof CHART_TILES)[number]["id"] }) {
  switch (id) {
    case "a1c":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__a1c-card product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
        >
          <Product2ChartProfileA1cTrend
            label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
            readings={PRODUCT2_CALL_HISTORY_A1C_TREND.readings}
            doseChanges={PRODUCT2_CALL_HISTORY_A1C_TREND.doseChanges}
            labelPosition="top"
            plotCanvasHeight={TILE_PLOT_HEIGHT}
          />
        </div>
      );
    case "vitals":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__vitals-card product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_RECENT_VITALS.label}
        >
          <Product2CallHistoryRecentVitals />
        </div>
      );
    case "bp":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__a1c-card product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_BP_TREND.label}
        >
          <div className="motion4-chart-interlude__bp-shell">
            <p className={`motion4-chart-interlude__bp-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_BP_TREND.label}
            </p>
            <div className="motion4-chart-interlude__bp-plot">
              <Product2ChartProfileBpTrend readings={PRODUCT2_CALL_HISTORY_BP_TREND.readings} />
            </div>
          </div>
        </div>
      );
    case "labs":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__labs-card product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_RECENT_LABS.label}
        >
          <Product2CallHistoryRecentLabs />
        </div>
      );
    case "visits":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__visits-card product-landing-live-quote__chart-profile"
          aria-label={STRIP_COPY.visits.label}
        >
          <div className="product-call-history-panel__visits-shell">
            <p className={`product-call-history-panel__visits-label m-0 ${suisseIntl.className}`}>
              {STRIP_COPY.visits.label}
            </p>
            <ul className={`product-call-history-panel__visits-list m-0 ${dmSans.className}`}>
              {STRIP_COPY.visits.items.map((visit) => (
                <li key={visit.title} className="product-call-history-panel__visits-item">
                  <div className="product-call-history-panel__visits-date" aria-hidden>
                    <span className="product-call-history-panel__visits-date-month">{visit.month}</span>
                    <span className="product-call-history-panel__visits-date-day">{visit.day}</span>
                    <span className="product-call-history-panel__visits-date-weekday">{visit.weekday}</span>
                  </div>
                  <div className="product-call-history-panel__visits-item-copy">
                    <span className="product-call-history-panel__visits-item-title">{visit.title}</span>
                    <span className="product-call-history-panel__visits-item-when">{visit.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "tasks":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__tasks-card product-landing-live-quote__chart-profile"
          aria-label={STRIP_COPY.tasks.label}
        >
          <div className="product-call-history-panel__tasks-shell">
            <p className={`product-call-history-panel__tasks-label m-0 ${suisseIntl.className}`}>
              {STRIP_COPY.tasks.label}
            </p>
            <ul className={`product-call-history-panel__tasks-list m-0 ${dmSans.className}`}>
              {STRIP_COPY.tasks.items.map((task) => (
                <li
                  key={task.title}
                  className={`product-call-history-panel__tasks-item product-call-history-panel__tasks-item--${task.tone}`}
                >
                  <span className="product-call-history-panel__tasks-item-icon" aria-hidden>
                    <Product2CallHistoryOpenTaskIcon kind={task.icon} />
                  </span>
                  <div className="product-call-history-panel__tasks-item-copy">
                    <span className="product-call-history-panel__tasks-item-title">{task.title}</span>
                    <span className="product-call-history-panel__tasks-item-badge">{task.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "meds":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__meds-card product-landing-live-quote__chart-profile"
          aria-label={STRIP_COPY.meds.label}
        >
          <div className="product-call-history-panel__meds-shell">
            <p className={`product-call-history-panel__meds-label m-0 ${suisseIntl.className}`}>
              {STRIP_COPY.meds.label}
            </p>
            <ul className={`product-call-history-panel__meds-list m-0 ${dmSans.className}`}>
              {STRIP_COPY.meds.items.map((medication) => (
                <li key={medication} className="product-call-history-panel__meds-item">
                  {medication}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "conditions":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__conditions-card product-landing-live-quote__chart-profile"
          aria-label={STRIP_COPY.conditions.label}
        >
          <div className="product-call-history-panel__conditions-shell">
            <p className={`product-call-history-panel__conditions-label m-0 ${suisseIntl.className}`}>
              {STRIP_COPY.conditions.label}
            </p>
            <ul className={`product-call-history-panel__conditions-list m-0 ${dmSans.className}`}>
              {STRIP_COPY.conditions.items.map((condition) => (
                <li key={condition} className="product-call-history-panel__conditions-item">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "allergies":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__allergies-card product-landing-live-quote__chart-profile"
          aria-label={STRIP_COPY.allergies.label}
        >
          <div className="product-call-history-panel__allergies-shell">
            <p className={`product-call-history-panel__allergies-label m-0 ${suisseIntl.className}`}>
              {STRIP_COPY.allergies.label}
            </p>
            <ul className={`product-call-history-panel__allergies-list m-0 ${dmSans.className}`}>
              {STRIP_COPY.allergies.items.map((allergy) => (
                <li key={allergy} className="product-call-history-panel__allergies-item">
                  {allergy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    default:
      return null;
  }
}

/** Mid-scroll strip snapshot — questionnaire beat fades these boxes out before the card. */
export function IntroSarahChartStripSnapshot({
  opacity,
  translateY = 0,
  scrollX = CHART_STRIP_SNAPSHOT_SCROLL_X,
}: {
  opacity: number;
  translateY?: number;
  scrollX?: number;
}) {
  if (opacity < 0.01) {
    return null;
  }

  return (
    <div
      className="motion4-chart-interlude__strip product-brown-mock product-brown-call-history-mode"
      style={{
        opacity,
        transform: `translateY(${translateY + CHART_STRIP_BLEED_Y_PX}px)`,
        ["--m4-chart-tile-height" as string]: `${TILE_HEIGHT_PX}px`,
      }}
    >
      <div className="motion4-chart-interlude__strip-viewport">
        <div
          className="motion4-chart-interlude__strip-track"
          style={{
            width: TRACK_WIDTH_PX,
            gap: TILE_GAP_PX,
            transform: `translateX(${scrollX}px)`,
            ["--pb-chart-height" as string]: TILE_PLOT_HEIGHT,
          }}
        >
          {CHART_TILES.map((tile) => (
            <div
              key={tile.id}
              className={`motion4-chart-interlude__tile motion4-chart-interlude__tile--${tile.id}`}
              style={{
                width: tile.width,
                height: TILE_HEIGHT_PX,
                minHeight: TILE_HEIGHT_PX,
                maxHeight: TILE_HEIGHT_PX,
              }}
            >
              <ChartAccessTile id={tile.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Chart access — Accessed label + same-height Sarah chart boxes scrolling left. */
export function IntroChartAccessInterlude() {
  const frame = useCurrentFrame();
  const t = frame - CONVO_UI_OFFSET;

  const timing = buildCallTurnRevealTiming(
    DOE_SARAH_INTRO_TURN_COUNT,
    DOE_SARAH_CONVO_TURN_START,
    DOE_SARAH_CONVO_TURN_STEP,
    DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
    DOE_SARAH_CALL_INTERLUDES,
    DOE_SARAH_TURN_HOLDS_AFTER,
    DOE_SARAH_TURN_REPLY_HOLDS,
  );
  const window = findCallInterludeWindow(timing, DOE_SARAH_CHART_ACCESS_INTERLUDE_BEFORE_TURN);

  if (!window || t < window.start || t >= window.end) {
    return null;
  }

  const local = t - window.start;
  const windowFrames = window.end - window.start;
  const spinDeg = local * 4;
  const accessDone = local >= ACCESS_DONE;
  const scrollEnd = Math.max(SCROLL_START + 1, windowFrames - SCROLL_END_PAD);

  const stepOpacity = 1;

  const stripProgress =
    local >= STRIP_APPEAR
      ? interpolate(local, [STRIP_APPEAR, STRIP_APPEAR + STRIP_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const stripOpacity =
    local >= STRIP_APPEAR
      ? interpolate(stripProgress, [0, 0.2, 1], [0, 0.9, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stepOpacity
      : 0;

  const scrollTarget = CHART_STRIP_SCROLL_TARGET_PX;
  /** Partial pan — enough to read chart boxes, then hand off to pre-visit beat. */
  const scrollX =
    local >= SCROLL_START
      ? interpolate(local, [SCROLL_START, scrollEnd], [0, -scrollTarget], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: SCROLL_EASE,
        })
      : 0;

  const accessLabel = accessDone ? "Accessed Sarah's chart" : "Accessing Sarah's chart";
  const accessIcon: "spinner" | "check" = accessDone ? "check" : "spinner";
  const stripMounted = local >= SCROLL_START;

  return (
    <div className={`motion4-chart-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-chart-interlude__stage">
        <div
          className={`motion4-chart-interlude__stack motion4-chart-interlude__stack--strip${
            stripMounted ? " motion4-chart-interlude__stack--paired" : ""
          }`}
        >
          <div
            className="motion4-chart-interlude__step"
            style={{
              opacity: stepOpacity,
            }}
          >
            <span className="motion4-chart-interlude__label">{accessLabel}</span>
            <InterludeStepIcon state={accessIcon} spinDeg={spinDeg} />
          </div>

          {stripMounted ? (
            <div
              className="motion4-chart-interlude__strip product-brown-mock product-brown-call-history-mode"
              style={{
                opacity: stripOpacity,
                transform: `translateY(${CHART_STRIP_BLEED_Y_PX}px)`,
                ["--m4-chart-tile-height" as string]: `${TILE_HEIGHT_PX}px`,
              }}
            >
              <div className="motion4-chart-interlude__strip-viewport">
                <div
                  className="motion4-chart-interlude__strip-track"
                  style={{
                    width: TRACK_WIDTH_PX,
                    gap: TILE_GAP_PX,
                    transform: `translateX(${scrollX}px)`,
                    ["--pb-chart-height" as string]: TILE_PLOT_HEIGHT,
                  }}
                >
                  {CHART_TILES.map((tile, index) => {
                    const tileStart = index * TILE_STAGGER;
                    const tileEnd = Math.min(1, tileStart + 0.42);
                    const tileProgress =
                      stripProgress <= 0
                        ? 0
                        : interpolate(stripProgress, [tileStart, tileEnd], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: REVEAL_EASE,
                          });
                    const tileBlur = (1 - tileProgress) * CHART_BLUR_MAX;
                    const tileY = (1 - tileProgress) * TILE_LIFT_PX;
                    const tileOpacity = interpolate(tileProgress, [0, 0.35, 1], [0, 0.86, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: REVEAL_EASE,
                    });

                    return (
                      <div
                        key={tile.id}
                        className={`motion4-chart-interlude__tile motion4-chart-interlude__tile--${tile.id}`}
                        style={{
                          width: tile.width,
                          height: TILE_HEIGHT_PX,
                          minHeight: TILE_HEIGHT_PX,
                          maxHeight: TILE_HEIGHT_PX,
                          opacity: tileOpacity,
                          transform: `translateY(${tileY}px)`,
                          filter: tileBlur > 0.35 ? `blur(${tileBlur}px)` : undefined,
                        }}
                      >
                        <ChartAccessTile id={tile.id} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
