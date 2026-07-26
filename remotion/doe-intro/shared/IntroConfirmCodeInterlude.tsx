import { Easing, interpolate, useCurrentFrame } from "remotion";

import { dmSans } from "@/remotion/fonts";

import {
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_TURN_HOLDS_AFTER,
  DOE_SARAH_TURN_REPLY_HOLDS,
  DOE_SARAH_CONFIRM_CODE_INTERLUDE_BEFORE_TURN,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_FADE,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_INTRO_TURN_COUNT,
} from "../constants";
import { buildCallTurnRevealTiming, findCallInterludeWindow } from "../../motion-ui";

const ROW_GAP = 0.35;
const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

/** Fade in generating row — backdrop fade lives in motion-ui (DOE_SARAH_INTERLUDE_FADE_IN_FRAMES). */
const GENERATING_DONE = 54;
/** Sending row appears (~1.3s hold on Generated solo). */
const SENDING_APPEAR = 94;
const SENDING_DONE = 138;

function InterludeStepIcon({ state, spinDeg }: { state: "spinner" | "check"; spinDeg: number }) {
  if (state === "check") {
    return (
      <svg className="motion4-confirm-interlude__icon motion4-confirm-interlude__check" viewBox="0 0 12 12" fill="none" aria-hidden>
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
      className="motion4-confirm-interlude__spinner motion4-confirm-interlude__icon"
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

function InterludeStepRow({
  label,
  iconState,
  spinDeg,
  opacity,
}: {
  label: string;
  iconState: "spinner" | "check" | "none";
  spinDeg: number;
  opacity: number;
}) {
  if (opacity <= 0.01) {
    return null;
  }

  return (
    <div className="motion4-confirm-interlude__row" style={{ opacity }}>
      <div className="motion4-confirm-interlude__step">
        <span className="motion4-confirm-interlude__label">{label}</span>
        {iconState !== "none" ? <InterludeStepIcon state={iconState} spinDeg={spinDeg} /> : null}
      </div>
    </div>
  );
}

/** Fixed stack — generating hold → sending hold → both together. */
export function IntroConfirmCodeInterlude() {
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
  const window = findCallInterludeWindow(timing, DOE_SARAH_CONFIRM_CODE_INTERLUDE_BEFORE_TURN);

  if (!window || t < window.start || t >= window.end) {
    return null;
  }

  const local = t - window.start;
  const spinDeg = local * 4;

  const generatingOpacity = 1;

  const sendingOpacity =
    local >= SENDING_APPEAR
      ? interpolate(local, [SENDING_APPEAR, SENDING_APPEAR + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 0;

  const generatingDone = local >= GENERATING_DONE;
  const sendingDone = local >= SENDING_DONE;

  const generatingLabel = generatingDone ? "Generated confirmation code" : "Generating confirmation code";
  const sendingLabel = sendingDone ? "Sent to Sarah's phone" : "Sending to Sarah's phone";

  const generatingIcon: "spinner" | "check" = generatingDone ? "check" : "spinner";
  const sendingIcon: "spinner" | "check" | "none" =
    local < SENDING_APPEAR ? "none" : sendingDone ? "check" : "spinner";

  return (
    <div className={`motion4-confirm-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-confirm-interlude__stack" style={{ gap: `${ROW_GAP}rem` }}>
        <InterludeStepRow
          label={generatingLabel}
          iconState={generatingIcon}
          spinDeg={spinDeg}
          opacity={generatingOpacity}
        />
        <InterludeStepRow
          label={sendingLabel}
          iconState={sendingIcon}
          spinDeg={spinDeg}
          opacity={sendingOpacity}
        />
      </div>
    </div>
  );
}
