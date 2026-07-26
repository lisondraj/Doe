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

const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

/** Pull row fades in under the Accessed line — no chart UI in this beat. */
const PULL_APPEAR = 12;
const PULL_REVEAL = 18;
/** Hold Pulling spinner before Pulled checkmark. */
const PULL_DONE = 132;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);

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
 * Accessed chart (check) + Pulling/Pulled pre-visit loader — vertically centered pair, no chart boxes.
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

  const pullProgress =
    local >= PULL_APPEAR
      ? interpolate(local, [PULL_APPEAR, PULL_APPEAR + PULL_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const pullOpacity = interpolate(pullProgress, [0, 0.3, 1], [0, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const pullLabel = pullDone ? "Pulled pre-visit questionnaire" : "Pulling pre-visit questionnaire";
  const pullIcon: "spinner" | "check" = pullDone ? "check" : "spinner";
  const pullVisible = pullOpacity > 0.01;

  return (
    <div className={`motion4-questionnaire-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-questionnaire-interlude__stage">
        <div className="motion4-questionnaire-interlude__stack motion4-questionnaire-interlude__stack--paired">
          <div className="motion4-questionnaire-interlude__step">
            <span className="motion4-questionnaire-interlude__label">Accessed Sarah&apos;s chart</span>
            <InterludeStepIcon state="check" spinDeg={0} />
          </div>

          {pullVisible ? (
            <div
              className="motion4-questionnaire-interlude__step motion4-questionnaire-interlude__step--pull"
              style={{ opacity: pullOpacity }}
            >
              <span className="motion4-questionnaire-interlude__label">{pullLabel}</span>
              <InterludeStepIcon state={pullIcon} spinDeg={spinDeg} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
