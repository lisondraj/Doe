import { Easing, interpolate, useCurrentFrame } from "remotion";

import { Product2CallHistoryOpenTaskIcon } from "@/components/product2/Product2CallHistoryOpenTaskIcon";
import { Product2CallHistoryRecentLabs } from "@/components/product2/Product2CallHistoryRecentLabs";
import { Product2CallHistoryRecentVitals } from "@/components/product2/Product2CallHistoryRecentVitals";
import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { Product2ChartProfileBpTrend } from "@/components/product2/Product2ChartProfileBpTrend";
import {
  PRODUCT2_CALL_HISTORY_A1C_TREND,
  PRODUCT2_CALL_HISTORY_ALLERGIES,
  PRODUCT2_CALL_HISTORY_BP_TREND,
  PRODUCT2_CALL_HISTORY_CONDITIONS,
  PRODUCT2_CALL_HISTORY_MEDICATIONS,
  PRODUCT2_CALL_HISTORY_OPEN_TASKS,
  PRODUCT2_CALL_HISTORY_RECENT_VISITS,
} from "@/lib/product2/product2-copy";
import { dmSans, suisseIntl } from "@/remotion/fonts";

import {
  DOE_LAUNCH_WIDTH,
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_CALLER_TURN_HOLDS,
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

const FADE_IN_END = 12;
const ACCESS_DONE = 54;
const STRIP_APPEAR = 88;
const STRIP_REVEAL = 40;
const SCROLL_START = 136;
const FADE_OUT_PAD = 18;
const CHART_BLUR_MAX = 16;
/** Composition pixels — preview Player scale must not change relative tile size. */
const TILE_PLOT_HEIGHT = "148px";
const TILE_HEIGHT_PX = 312;
const TILE_GAP_PX = 18;
const VIEWPORT_INSET_PX = 72;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);
const SCROLL_EASE = Easing.bezier(0.22, 0.08, 0.18, 1);

/** Same-height row — different widths from Sarah call-history chart boxes. */
const CHART_TILES = [
  { id: "a1c", width: 460 },
  { id: "vitals", width: 360 },
  { id: "bp", width: 400 },
  { id: "labs", width: 340 },
  { id: "visits", width: 300 },
  { id: "tasks", width: 280 },
  { id: "meds", width: 250 },
  { id: "conditions", width: 230 },
  { id: "allergies", width: 210 },
] as const;

const TRACK_WIDTH_PX =
  CHART_TILES.reduce((sum, tile) => sum + tile.width, 0) + TILE_GAP_PX * (CHART_TILES.length - 1);

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
          aria-label="Recent vitals"
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
            <Product2ChartProfileBpTrend readings={PRODUCT2_CALL_HISTORY_BP_TREND.readings} />
          </div>
        </div>
      );
    case "labs":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__labs-card product-landing-live-quote__chart-profile"
          aria-label="Recent labs"
        >
          <Product2CallHistoryRecentLabs />
        </div>
      );
    case "visits":
      return (
        <div
          className="motion4-chart-interlude__tile-card product-call-history-panel__visits-card product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
        >
          <div className="product-call-history-panel__visits-shell">
            <p className={`product-call-history-panel__visits-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
            </p>
            <ul className={`product-call-history-panel__visits-list m-0 ${dmSans.className}`}>
              {PRODUCT2_CALL_HISTORY_RECENT_VISITS.items.map((visit) => (
                <li key={visit.title} className="product-call-history-panel__visits-item">
                  <div className="product-call-history-panel__visits-date" aria-hidden>
                    <span className="product-call-history-panel__visits-date-month">{visit.month}</span>
                    <span className="product-call-history-panel__visits-date-day">{visit.day}</span>
                    <span className="product-call-history-panel__visits-date-weekday">{visit.weekday}</span>
                  </div>
                  <div className="product-call-history-panel__visits-item-copy">
                    <span className="product-call-history-panel__visits-item-title">{visit.title}</span>
                    {visit.when ? (
                      <span className="product-call-history-panel__visits-item-when">{visit.when}</span>
                    ) : null}
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
          aria-label={PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
        >
          <div className="product-call-history-panel__tasks-shell">
            <p className={`product-call-history-panel__tasks-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
            </p>
            <ul className={`product-call-history-panel__tasks-list m-0 ${dmSans.className}`}>
              {PRODUCT2_CALL_HISTORY_OPEN_TASKS.items.map((task) => (
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
          aria-label={PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
        >
          <div className="product-call-history-panel__meds-shell">
            <p className={`product-call-history-panel__meds-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
            </p>
            <ul className={`product-call-history-panel__meds-list m-0 ${dmSans.className}`}>
              {PRODUCT2_CALL_HISTORY_MEDICATIONS.items.map((medication) => (
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
          aria-label={PRODUCT2_CALL_HISTORY_CONDITIONS.label}
        >
          <div className="product-call-history-panel__conditions-shell">
            <p className={`product-call-history-panel__conditions-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_CONDITIONS.label}
            </p>
            <ul className={`product-call-history-panel__conditions-list m-0 ${dmSans.className}`}>
              {PRODUCT2_CALL_HISTORY_CONDITIONS.items.map((condition) => (
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
          aria-label={PRODUCT2_CALL_HISTORY_ALLERGIES.label}
        >
          <div className="product-call-history-panel__allergies-shell">
            <p className={`product-call-history-panel__allergies-label m-0 ${suisseIntl.className}`}>
              {PRODUCT2_CALL_HISTORY_ALLERGIES.label}
            </p>
            <ul className={`product-call-history-panel__allergies-list m-0 ${dmSans.className}`}>
              {PRODUCT2_CALL_HISTORY_ALLERGIES.items.map((allergy) => (
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
    DOE_SARAH_CALLER_TURN_HOLDS,
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
  const scrollEnd = Math.max(SCROLL_START + 1, windowFrames - FADE_OUT_PAD);

  const stepOpacity = interpolate(local, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const stripProgress =
    local >= STRIP_APPEAR
      ? interpolate(local, [STRIP_APPEAR, STRIP_APPEAR + STRIP_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const stripBlur = (1 - stripProgress) * CHART_BLUR_MAX;
  const stripOpacity =
    local >= STRIP_APPEAR
      ? interpolate(stripProgress, [0, 0.28, 1], [0, 0.84, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stepOpacity
      : 0;

  const viewportWidth = DOE_LAUNCH_WIDTH - VIEWPORT_INSET_PX * 2;
  const maxScroll = Math.max(0, TRACK_WIDTH_PX - viewportWidth);
  const scrollX =
    local >= SCROLL_START
      ? interpolate(local, [SCROLL_START, scrollEnd], [0, -maxScroll], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: SCROLL_EASE,
        })
      : 0;

  const accessLabel = accessDone ? "Accessed Sarah's chart" : "Accessing Sarah's chart";
  const accessIcon: "spinner" | "check" = accessDone ? "check" : "spinner";
  const stripVisible = local >= STRIP_APPEAR && stripOpacity > 0.01;

  return (
    <div className={`motion4-chart-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-chart-interlude__stage">
        <div
          className={`motion4-chart-interlude__stack motion4-chart-interlude__stack--strip${
            stripVisible ? " motion4-chart-interlude__stack--paired" : ""
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

          {stripVisible ? (
            <div
              className="motion4-chart-interlude__strip product-brown-mock product-brown-call-history-mode"
              style={{
                opacity: stripOpacity,
                filter: stripBlur > 0.35 ? `blur(${stripBlur}px)` : undefined,
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
                      style={{ width: tile.width, height: TILE_HEIGHT_PX, minHeight: TILE_HEIGHT_PX, maxHeight: TILE_HEIGHT_PX }}
                    >
                      <ChartAccessTile id={tile.id} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
