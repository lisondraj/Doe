import { Easing, interpolate, useCurrentFrame } from "remotion";

import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { PRODUCT2_CALL_HISTORY_A1C_TREND } from "@/lib/product2/product2-copy";
import { dmSans } from "@/remotion/fonts";

import {
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_CALLER_TURN_HOLDS,
  DOE_SARAH_TURN_REPLY_HOLDS,
  DOE_SARAH_CHART_ACCESS_INTERLUDE_BEFORE_TURN,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_FADE,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_INTRO_TURN_COUNT,
} from "../constants";
import { buildCallTurnRevealTiming, findCallInterludeWindow } from "../../motion-ui";

const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

const FADE_IN_END = 12;
const ACCESS_DONE = 54;
const GRAPH_APPEAR = 92;
const GRAPH_REVEAL = 48;
const CHART_BLUR_MAX = 18;
const CHART_PLOT_HEIGHT = "26rem";
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);

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

/** Chart access — header stays tight above A1C as the chart unblurs in. */
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
  const spinDeg = local * 4;
  const accessDone = local >= ACCESS_DONE;

  const stepOpacity = interpolate(local, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const stackProgress =
    local >= GRAPH_APPEAR
      ? interpolate(local, [GRAPH_APPEAR, GRAPH_APPEAR + GRAPH_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const chartBlur = (1 - stackProgress) * CHART_BLUR_MAX;
  const chartOpacity =
    local >= GRAPH_APPEAR
      ? interpolate(stackProgress, [0, 0.28, 1], [0, 0.82, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stepOpacity
      : 0;

  const accessLabel = accessDone ? "Accessed Sarah's chart" : "Accessing Sarah's chart";
  const accessIcon: "spinner" | "check" = accessDone ? "check" : "spinner";
  const chartVisible = local >= GRAPH_APPEAR && chartOpacity > 0.01;

  return (
    <div className={`motion4-chart-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-chart-interlude__stage">
        <div
          className={`motion4-chart-interlude__stack ${chartVisible ? "motion4-chart-interlude__stack--paired" : ""}`}
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
          {chartVisible ? (
            <div
              className="motion4-chart-interlude__chart product-landing-live-quote__chart-profile"
              style={{
                opacity: chartOpacity,
                filter: chartBlur > 0.35 ? `blur(${chartBlur}px)` : undefined,
                transform: "scale(var(--m4-chart-interlude-scale, 1.18))",
                ["--pb-chart-height" as string]: CHART_PLOT_HEIGHT,
              }}
              aria-label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
            >
              <Product2ChartProfileA1cTrend
                label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
                readings={PRODUCT2_CALL_HISTORY_A1C_TREND.readings}
                doseChanges={PRODUCT2_CALL_HISTORY_A1C_TREND.doseChanges}
                labelPosition="top"
                plotCanvasHeight={CHART_PLOT_HEIGHT}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
