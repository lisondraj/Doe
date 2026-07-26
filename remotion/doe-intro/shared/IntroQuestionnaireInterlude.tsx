import { Easing, interpolate, useCurrentFrame } from "remotion";

import { dmSans } from "@/remotion/fonts";

import {
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_TURN_HOLDS_AFTER,
  DOE_SARAH_TURN_REPLY_HOLDS,
  DOE_SARAH_QUESTIONNAIRE_INTERLUDE_BEFORE_TURN,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_INTRO_TURN_COUNT,
} from "../constants";
import { buildCallTurnRevealTiming, findCallInterludeWindow } from "../../motion-ui";
import { IntroSarahChartStripSnapshot, CHART_STRIP_TILE_HEIGHT_PX } from "./IntroChartAccessInterlude";

const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

const PULL_UNDER_START = 0;
const PULL_UNDER_REVEAL = 18;
/** Hold Pulling under the chart UI, then mark Pulled and rise. */
const PULL_DONE = 78;
const STRIP_EXIT_START = 78;
const STRIP_EXIT_END = 108;
const CARD_APPEAR = 96;
const CARD_REVEAL = 28;
const STRIP_HEIGHT_PX = CHART_STRIP_TILE_HEIGHT_PX;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);

const METFORMIN_SIDE_EFFECTS = [
  { label: "Nausea", detail: "Mild · after morning dose" },
  { label: "Stomach upset", detail: "Common · with food" },
  { label: "Diarrhea", detail: "Monitor · log if worsens" },
  { label: "Low B12 risk", detail: "Long-term · annual check" },
] as const;

function InterludeStepIcon({ state, spinDeg }: { state: "spinner" | "check"; spinDeg: number }) {
  if (state === "check") {
    return (
      <svg className="motion4-questionnaire-interlude__icon motion4-questionnaire-interlude__check" viewBox="0 0 12 12" fill="none" aria-hidden>
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
      className="motion4-questionnaire-interlude__spinner motion4-questionnaire-interlude__icon"
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

/**
 * Accessed chart + boxes → Pulling under the strip → Pulled rises as boxes exit
 * and the side-effects card lands in place → close.
 */
export function IntroQuestionnaireInterlude() {
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
  const window = findCallInterludeWindow(timing, DOE_SARAH_QUESTIONNAIRE_INTERLUDE_BEFORE_TURN);

  if (!window || t < window.start || t >= window.end) {
    return null;
  }

  const local = t - window.start;
  const spinDeg = local * 4;
  const pullDone = local >= PULL_DONE;

  const stageOpacity = 1;

  const pullUnderProgress =
    local >= PULL_UNDER_START
      ? interpolate(local, [PULL_UNDER_START, PULL_UNDER_START + PULL_UNDER_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const pullOpacity =
    interpolate(pullUnderProgress, [0, 0.3, 1], [0, 0.9, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: REVEAL_EASE,
    }) * stageOpacity;

  const stripExit =
    local <= STRIP_EXIT_START
      ? 0
      : interpolate(local, [STRIP_EXIT_START, STRIP_EXIT_END], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        });

  const stripOpacity = (1 - stripExit) * stageOpacity;
  const stripY = interpolate(stripExit, [0, 1], [0, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });
  const stripMaxHeight = interpolate(stripExit, [0, 1], [STRIP_HEIGHT_PX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });
  const stripGap = interpolate(stripExit, [0, 1], [28, 0], {
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

  const cardOpacity =
    local >= CARD_APPEAR
      ? interpolate(cardProgress, [0, 0.28, 1], [0, 0.9, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stageOpacity
      : 0;

  const cardY = interpolate(cardProgress, [0, 1], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const pullLabel = pullDone ? "Pulled pre-visit questionnaire" : "Pulling pre-visit questionnaire";
  const pullIcon: "spinner" | "check" = pullDone ? "check" : "spinner";
  const pullVisible = pullOpacity > 0.01;
  const cardVisible = local >= CARD_APPEAR && cardOpacity > 0.01;
  const stripVisible = stripOpacity > 0.01 || stripMaxHeight > 1;

  return (
    <div className={`motion4-questionnaire-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-questionnaire-interlude__stage">
        <div
          className={`motion4-questionnaire-interlude__stack${
            stripVisible || cardVisible || pullVisible ? " motion4-questionnaire-interlude__stack--paired" : ""
          }`}
        >
          <div className="motion4-questionnaire-interlude__step" style={{ opacity: stageOpacity }}>
            <span className="motion4-questionnaire-interlude__label">Accessed Sarah&apos;s chart</span>
            <InterludeStepIcon state="check" spinDeg={0} />
          </div>

          {/* Chart UI — Pulling sits underneath; collapses so Pulled rises into place. */}
          {stripVisible ? (
            <div
              className="motion4-questionnaire-interlude__strip-slot"
              style={{
                opacity: stripOpacity,
                maxHeight: stripMaxHeight,
                marginBottom: stripGap,
                transform: `translateY(${stripY}px)`,
              }}
            >
              <IntroSarahChartStripSnapshot opacity={1} translateY={0} />
            </div>
          ) : null}

          {pullVisible ? (
            <div
              className="motion4-questionnaire-interlude__step motion4-questionnaire-interlude__step--pull"
              style={{ opacity: pullOpacity }}
            >
              <span className="motion4-questionnaire-interlude__label">{pullLabel}</span>
              <InterludeStepIcon state={pullIcon} spinDeg={spinDeg} />
            </div>
          ) : null}

          {cardVisible ? (
            <div
              className="motion4-questionnaire-interlude__card"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
              }}
            >
              <div className="motion4-questionnaire-interlude__card-head">
                <p className={`motion4-questionnaire-interlude__card-title m-0 ${dmSans.className}`}>
                  Common side effects
                </p>
              </div>
              <ul className={`motion4-questionnaire-interlude__list m-0 ${dmSans.className}`}>
                {METFORMIN_SIDE_EFFECTS.map((item) => (
                  <li key={item.label} className="motion4-questionnaire-interlude__item">
                    <span className="motion4-questionnaire-interlude__item-label">{item.label}</span>
                    <span className="motion4-questionnaire-interlude__item-detail">{item.detail}</span>
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
