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
export const CHART_STRIP_SCALE = 2.5;
export const CHART_STRIP_BLEED_Y_PX = 100;
/** Gap between Accessed row and chart strip. */
const STACK_PAIR_GAP_PX = 10;
const BASE_TILE_HEIGHT_PX = 300;
const BASE_TILE_GAP_PX = 16;
const BASE_TILE_PLOT_HEIGHT_PX = 210;
export const CHART_STRIP_TILE_HEIGHT_PX = Math.round(BASE_TILE_HEIGHT_PX * CHART_STRIP_SCALE);
const TILE_HEIGHT_PX = CHART_STRIP_TILE_HEIGHT_PX;
const TILE_GAP_PX = Math.round(BASE_TILE_GAP_PX * CHART_STRIP_SCALE);
const TILE_PLOT_HEIGHT = `${Math.round(BASE_TILE_PLOT_HEIGHT_PX * CHART_STRIP_SCALE)}px`;
const TILE_LIFT_PX = Math.round(32 * CHART_STRIP_SCALE);

const ACCESS_DONE = 48;
const ACCESS_LABEL_SWIPE = 16;
/** Label row height — matches .motion4-chart-interlude__label-slot (68px × 1.15). */
const ACCESS_LABEL_LINE_PX = 78;
/** Mount + start scrolling before fade-in so there is no post-appear hold. */
const SCROLL_START = 52;
const STRIP_APPEAR = 64;
const STRIP_REVEAL = 28;
/** Fraction of strip width to pan — stop before meds/conditions/allergies. */
const CHART_SCROLL_MAX_RATIO = 0.4;
/** Strip scroll ends → boxes fade as pull loader starts. */
const STRIP_EXIT_START = 210;
const STRIP_EXIT_DURATION = 36;
const PULL_START = STRIP_EXIT_START;
const PULL_LABEL_SWIPE = 16;
/** Hold Pulling spinner before Pulled checkmark. */
const PULL_DONE = PULL_START + 132;
const CARD_APPEAR = PULL_DONE + 8;
const CARD_REVEAL = 28;
const CHART_BLUR_MAX = 16;
/** Stagger each tile’s unblur/lift across the strip reveal. */
const TILE_STAGGER = 0.055;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);
const SCROLL_EASE = Easing.bezier(0.16, 0.12, 0.22, 1);

const METFORMIN_DOSE = "Metformin XR 500mg";

const METFORMIN_SIDE_EFFECTS = [
  "Nausea",
  "Stomach upset",
  "Diarrhea",
  "Gas & bloating",
  "Loss of appetite",
  "Metallic taste",
  "Weight loss",
  "Low B12 risk",
  "Abdominal pain",
] as const;

/** Landscape side-effects panel — wide rectangle, scaled up in CSS. */
const SIDE_EFFECTS_CARD_SCALE = 1.48;

/** Densified strip copy — fills same-height boxes without sparse blank regions. */
const STRIP_COPY = {
  visits: {
    label: "Recent Visits",
    items: [
      { title: "Annual Physical", when: "Jan 14 · Dr. Chen", month: "Jan", day: 14, weekday: "Tue" },
      { title: "Diabetes Follow-up", when: "Apr 9 · Clinic", month: "Apr", day: 9, weekday: "Wed" },
      { title: "Virtual Check-in", when: "Jun 24 · Video", month: "Jun", day: 24, weekday: "Tue" },
      { title: "Lab Review", when: "Jul 8 · Nurse", month: "Jul", day: 8, weekday: "Tue" },
      { title: "Medication Sync", when: "Aug 19 · Dr. Chen", month: "Aug", day: 19, weekday: "Wed" },
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
  { id: "bp", width: Math.round(440 * CHART_STRIP_SCALE) },
  { id: "vitals", width: Math.round(340 * CHART_STRIP_SCALE) },
  { id: "a1c", width: Math.round(380 * CHART_STRIP_SCALE) },
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

function chartStripRootStyle(options: { opacity: number; translateY?: number; liftY?: number }) {
  const bleedY = (options.translateY ?? 0) + CHART_STRIP_BLEED_Y_PX + (options.liftY ?? 0);
  return {
    opacity: options.opacity,
    transform: `translateY(${bleedY}px)`,
    ["--m4-chart-strip-scale" as string]: String(CHART_STRIP_SCALE),
    ["--m4-chart-tile-height" as string]: `${TILE_HEIGHT_PX}px`,
    ["--pb-chart-axis-width" as string]: `${Math.round(36 * CHART_STRIP_SCALE)}px`,
    ["--pb-chart-axis-gap" as string]: `${Math.round(8 * CHART_STRIP_SCALE)}px`,
  };
}

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

function AccessedStatusRow() {
  return (
    <div className="motion4-chart-interlude__step">
      <span className="motion4-chart-interlude__label">Accessed Sarah&apos;s chart</span>
      <InterludeStepIcon state="check" spinDeg={0} />
    </div>
  );
}

function ChartAccessStatusRow({ local, spinDeg }: { local: number; spinDeg: number }) {
  const labelSwipe = interpolate(local, [ACCESS_DONE, ACCESS_DONE + ACCESS_LABEL_SWIPE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });
  const iconSwap = interpolate(local, [ACCESS_DONE, ACCESS_DONE + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  return (
    <div className="motion4-chart-interlude__step">
      <div className="motion4-chart-interlude__label-slot" aria-live="polite">
        <div
          className="motion4-chart-interlude__label-track"
          style={{ transform: `translateY(${-labelSwipe * ACCESS_LABEL_LINE_PX}px)` }}
        >
          <span className="motion4-chart-interlude__label">Accessing Sarah&apos;s chart</span>
          <span className="motion4-chart-interlude__label">Accessed Sarah&apos;s chart</span>
        </div>
      </div>
      <div className="motion4-chart-interlude__icon-slot" aria-hidden>
        <span className="motion4-chart-interlude__icon-layer" style={{ opacity: 1 - iconSwap }}>
          <InterludeStepIcon state="spinner" spinDeg={spinDeg} />
        </span>
        <span className="motion4-chart-interlude__icon-layer" style={{ opacity: iconSwap }}>
          <InterludeStepIcon state="check" spinDeg={0} />
        </span>
      </div>
    </div>
  );
}

function PullStatusRow({
  local,
  pullSpinDeg,
  enterY,
}: {
  local: number;
  pullSpinDeg: number;
  enterY: number;
}) {
  const pullLabelSwipe = interpolate(local, [PULL_DONE, PULL_DONE + PULL_LABEL_SWIPE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });
  const iconSwap = interpolate(local, [PULL_DONE, PULL_DONE + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  return (
    <div
      className="motion4-chart-interlude__step motion4-chart-interlude__step--pull"
      style={{ transform: `translateY(${enterY}px)` }}
    >
      <div className="motion4-chart-interlude__label-slot" aria-live="polite">
        <div
          className="motion4-chart-interlude__label-track"
          style={{ transform: `translateY(${-pullLabelSwipe * ACCESS_LABEL_LINE_PX}px)` }}
        >
          <span className="motion4-chart-interlude__label">Pulling pre-visit questionnaire</span>
          <span className="motion4-chart-interlude__label">Pulled pre-visit questionnaire</span>
        </div>
      </div>
      <div className="motion4-chart-interlude__icon-slot" aria-hidden>
        <span className="motion4-chart-interlude__icon-layer" style={{ opacity: 1 - iconSwap }}>
          <InterludeStepIcon state="spinner" spinDeg={pullSpinDeg} />
        </span>
        <span className="motion4-chart-interlude__icon-layer" style={{ opacity: iconSwap }}>
          <InterludeStepIcon state="check" spinDeg={0} />
        </span>
      </div>
    </div>
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
          <Product2ChartProfileBpTrend
            label={PRODUCT2_CALL_HISTORY_BP_TREND.label}
            readings={PRODUCT2_CALL_HISTORY_BP_TREND.readings.slice(-5)}
            labelPosition="top"
            plotCanvasHeight={TILE_PLOT_HEIGHT}
          />
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
      style={chartStripRootStyle({ opacity, translateY })}
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
  const spinDeg = local * 4;
  const stripExitStart = STRIP_EXIT_START;
  const stripExitEnd = STRIP_EXIT_START + STRIP_EXIT_DURATION;
  const scrollEnd = Math.max(SCROLL_START + 1, stripExitStart);
  const accessLocked = local >= ACCESS_DONE + ACCESS_LABEL_SWIPE;
  const pullSpinDeg = Math.max(0, local - PULL_START) * 4;

  const stripProgress =
    local >= STRIP_APPEAR
      ? interpolate(local, [STRIP_APPEAR, STRIP_APPEAR + STRIP_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const stripExit =
    local <= stripExitStart
      ? 0
      : interpolate(local, [stripExitStart, stripExitEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        });

  const stripOpacity =
    local >= STRIP_APPEAR
      ? interpolate(stripProgress, [0, 0.2, 1], [0, 0.9, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * (1 - stripExit)
      : 0;

  const stripLiftY = interpolate(stripExit, [0, 1], [0, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const stripSlotHeightPx = TILE_HEIGHT_PX + STACK_PAIR_GAP_PX;
  const stripSlotMaxHeight = interpolate(stripExit, [0, 1], [stripSlotHeightPx, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });
  const stripSlotMargin =
    stripExit > 0
      ? interpolate(stripExit, [0, 1], [STACK_PAIR_GAP_PX, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
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

  const showStripSlot = local >= SCROLL_START && stripExit < 1;
  const showPullRow = local >= PULL_START;
  const pullEnterY = interpolate(stripExit, [0, 1], [ACCESS_LABEL_LINE_PX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const cardProgress =
    local >= CARD_APPEAR
      ? interpolate(local, [CARD_APPEAR, CARD_APPEAR + CARD_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const cardOpacity = interpolate(cardProgress, [0, 0.28, 1], [0, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const cardY = interpolate(cardProgress, [0, 1], [52, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const cardVisible = local >= CARD_APPEAR && cardOpacity > 0.01;
  const stackPaired = showStripSlot || showPullRow || cardVisible;
  const stackCenteredTrio = accessLocked && showPullRow && cardVisible && !showStripSlot;
  const stackY =
    stackCenteredTrio
      ? 0
      : showStripSlot && stripExit <= 0
        ? -6
        : stripExit > 0 && stripExit < 1
          ? interpolate(stripExit, [0, 1], [-6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: REVEAL_EASE,
            })
          : 0;

  return (
    <div className={`motion4-chart-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-chart-interlude__stage">
        <div
          className={`motion4-chart-interlude__stack motion4-chart-interlude__stack--strip${
            stackPaired ? " motion4-chart-interlude__stack--paired" : ""
          }${stackCenteredTrio ? " motion4-chart-interlude__stack--trio" : ""}`}
          style={{ transform: `translateY(${stackY}px)` }}
        >
          {accessLocked ? (
            <AccessedStatusRow />
          ) : (
            <ChartAccessStatusRow local={local} spinDeg={spinDeg} />
          )}

          {showStripSlot ? (
            <div
              className="motion4-chart-interlude__strip-slot"
              style={{
                maxHeight: stripExit > 0 ? stripSlotMaxHeight : undefined,
                marginBottom: stripSlotMargin,
                opacity: 1 - stripExit * 0.85,
                overflow: stripExit > 0 ? "hidden" : "visible",
              }}
            >
              <div
                className="motion4-chart-interlude__strip product-brown-mock product-brown-call-history-mode"
                style={chartStripRootStyle({ opacity: stripOpacity, liftY: stripLiftY })}
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
                            opacity: tileOpacity * (1 - stripExit),
                            transform: `translateY(${tileY - stripExit * 24}px)`,
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
            </div>
          ) : null}

          {showPullRow ? <PullStatusRow local={local} pullSpinDeg={pullSpinDeg} enterY={pullEnterY} /> : null}

          {cardVisible ? (
            <div
              className="motion4-chart-interlude__card motion4-chart-interlude__card--side-effects"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${SIDE_EFFECTS_CARD_SCALE})`,
                ["--m4-side-effects-scale" as string]: String(SIDE_EFFECTS_CARD_SCALE),
              }}
            >
              <div className="motion4-chart-interlude__card-head">
                <p className={`motion4-chart-interlude__card-title m-0 ${suisseIntl.className}`}>
                  Side effects
                </p>
                <p className={`motion4-chart-interlude__card-subtitle m-0 ${dmSans.className}`}>
                  {METFORMIN_DOSE}
                </p>
              </div>
              <ul className={`motion4-chart-interlude__effect-grid m-0 ${dmSans.className}`}>
                {METFORMIN_SIDE_EFFECTS.map((label) => (
                  <li key={label} className="motion4-chart-interlude__effect">
                    <span className="motion4-chart-interlude__effect-label">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
