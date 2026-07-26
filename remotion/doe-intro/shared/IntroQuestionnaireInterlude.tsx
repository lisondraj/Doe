import { Easing, interpolate, useCurrentFrame } from "remotion";

import { dmSans, suisseIntl } from "@/remotion/fonts";

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

const FADE_IN_END = 12;
const PULL_DONE = 52;
const CARD_APPEAR = 68;
const CARD_REVEAL = 22;
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

/** Pre-visit questionnaire — Pulling → Pulled + metformin side-effects card. */
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

  const stepOpacity = interpolate(local, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
      ? interpolate(cardProgress, [0, 0.3, 1], [0, 0.88, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stepOpacity
      : 0;

  const cardY = interpolate(cardProgress, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const accessLabel = pullDone ? "Pulled pre-visit questionnaire" : "Pulling pre-visit questionnaire";
  const accessIcon: "spinner" | "check" = pullDone ? "check" : "spinner";
  const cardVisible = local >= CARD_APPEAR && cardOpacity > 0.01;

  return (
    <div className={`motion4-questionnaire-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-questionnaire-interlude__stage">
        <div
          className={`motion4-questionnaire-interlude__stack${
            cardVisible ? " motion4-questionnaire-interlude__stack--paired" : ""
          }`}
        >
          <div className="motion4-questionnaire-interlude__step" style={{ opacity: stepOpacity }}>
            <span className="motion4-questionnaire-interlude__label">{accessLabel}</span>
            <InterludeStepIcon state={accessIcon} spinDeg={spinDeg} />
          </div>

          {cardVisible ? (
            <div
              className="motion4-questionnaire-interlude__card"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
              }}
            >
              <div className="motion4-questionnaire-interlude__card-head">
                <p className={`motion4-questionnaire-interlude__card-eyebrow m-0 ${suisseIntl.className}`}>
                  Pre-visit · Metformin
                </p>
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
