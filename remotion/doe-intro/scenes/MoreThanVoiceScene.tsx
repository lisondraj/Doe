import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { DoeHealthCallHistoryDiagram } from "@/components/doehealth/DoeHealthCallHistoryDiagram";

import { useCallTurnRevealMotion } from "../../motion-ui";
import { Motion3UiDrive } from "../../ui/Motion3UiDrive";
import {
  DOE_INTRO_FPS,
  DOE_OUTRO_SHADER_HANDOFF_FRAMES,
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_CALLER_TURN_HOLDS,
  DOE_SARAH_TURN_REPLY_HOLDS,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_FADE,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_AGENT_INTAKE_AUDIO_FROM,
  DOE_SARAH_AGENT_OPEN_CHART_AUDIO_FROM,
  DOE_SARAH_CALLER_OPEN_AUDIO_FROM,
  DOE_SARAH_CALLER_VERIFY_AUDIO_FROM,
  DOE_SARAH_CALL_HEADER_APPEAR_FRAME,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_HANDOFF_FRAMES,
  DOE_SARAH_INCOMING_CALL_AUDIO_SRC,
  DOE_SARAH_INCOMING_CALL_AUDIO_TRIM_FRAMES,
  DOE_SARAH_INCOMING_CALL_VOLUME,
  DOE_SARAH_INTRO_TURN_COUNT,
  DOE_SARAH_SETTLE_START_FRAMES,
  DOE_SARAH_VOICE_VOLUME,
} from "../constants";
import { handoffMotionStyle, useIntroDoeSarahHandoff, DOE_PREMIUM_EASE } from "../intro-transitions";
import { IntroChartAccessInterlude } from "../shared/IntroChartAccessInterlude";
import { IntroConfirmCodeInterlude } from "../shared/IntroConfirmCodeInterlude";
import { IntroUiHero } from "../shared/IntroUiHero";

const SETTLE_START_FRAME = DOE_SARAH_SETTLE_START_FRAMES;
const CONVO_START_FRAME = DOE_SARAH_CONVO_START_FRAMES;
const MORPH_STATUS_FRAMES = 24;
const MORPH_SUBLINE_DELAY = 4;
const MORPH_SUBLINE_FRAMES = 24;
const MORPH_EASE = Easing.bezier(0.42, 0, 0.18, 1);

export function MoreThanVoiceScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const handoff = useIntroDoeSarahHandoff("enter", DOE_SARAH_HANDOFF_FRAMES);
  const uiMotion = useCallTurnRevealMotion(
    CONVO_START_FRAME + DOE_SARAH_CONVO_UI_OFFSET,
    DOE_SARAH_INTRO_TURN_COUNT,
    DOE_SARAH_CONVO_TURN_STEP,
    DOE_SARAH_CONVO_TURN_FADE,
    DOE_SARAH_CONVO_TURN_START,
    DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
    DOE_SARAH_CALL_INTERLUDES,
    DOE_SARAH_CALLER_TURN_HOLDS,
    DOE_SARAH_TURN_REPLY_HOLDS,
  );

  const headerSettle = interpolate(frame, [SETTLE_START_FRAME, CONVO_START_FRAME], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.18, 1),
  });

  const headerMorphStatus = interpolate(
    frame,
    [CONVO_START_FRAME, CONVO_START_FRAME + MORPH_STATUS_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: MORPH_EASE,
    },
  );

  const headerMorphSubline = interpolate(
    frame,
    [CONVO_START_FRAME + MORPH_SUBLINE_DELAY, CONVO_START_FRAME + MORPH_SUBLINE_DELAY + MORPH_SUBLINE_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: MORPH_EASE,
    },
  );

  /** Incoming hold: nudge to viewport center. Settle: release as zone collapses to top. */
  const heroZoneY = interpolate(headerSettle, [0, 1], [96, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.18, 1),
  });

  const callHistoryOpacity = interpolate(frame, [CONVO_START_FRAME, CONVO_START_FRAME + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const elapsedSeconds =
    frame >= CONVO_START_FRAME ? Math.max(0, Math.floor((frame - CONVO_START_FRAME) / DOE_INTRO_FPS)) : 0;
  const durationLabel = `${elapsedSeconds}s`;

  const handoffStyle = handoff.active ? handoffMotionStyle(handoff) : undefined;

  const outroExit = interpolate(
    frame,
    [
      durationInFrames - DOE_OUTRO_SHADER_HANDOFF_FRAMES,
      durationInFrames - Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.55),
      durationInFrames,
    ],
    [1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: DOE_PREMIUM_EASE,
    },
  );

  const outroY = interpolate(
    frame,
    [durationInFrames - DOE_OUTRO_SHADER_HANDOFF_FRAMES, durationInFrames],
    [0, -14],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  const outroBlur = interpolate(
    frame,
    [
      durationInFrames - Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.5),
      durationInFrames,
    ],
    [0, 8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const headerVars = {
    "--m4-call-settle": headerSettle,
    "--m4-call-morph": headerMorphStatus,
    "--m4-call-morph-status": headerMorphStatus,
    "--m4-call-morph-subline": headerMorphSubline,
    "--m4-call-hero-y": `${heroZoneY}px`,
    "--m4-call-history-o": callHistoryOpacity,
    ...uiMotion,
  } as CSSProperties;

  const interludeBlur = uiMotion["--m4-interlude-blur"] as number | undefined;

  return (
    <AbsoluteFill
      className="motion4-scene motion4-scene--call-center"
      style={{
        opacity: outroExit,
        "--m4-confirm-interlude-o": uiMotion["--m4-confirm-interlude-o"] ?? 0,
        "--m4-chart-interlude-o": uiMotion["--m4-chart-interlude-o"] ?? 0,
      } as CSSProperties}
    >
      <IntroUiHero
        delay={0}
        skipEnter
        skipSceneCrossfade
        skipSceneExit
        heroScale={1.68}
        className="motion4-ui-hero--call motion4-call-center-hero"
        style={headerVars}
      >
        <div
          className="motion4-ui-reveal motion4-ui-reveal--call-enter"
          style={{
            opacity: handoff.active ? undefined : 1,
            transform: outroY !== 0 ? `translateY(${outroY}px)` : undefined,
            ...handoffStyle,
            filter:
              outroBlur > 0.05
                ? `blur(${outroBlur}px)`
                : interludeBlur && interludeBlur > 0.05
                  ? `blur(${interludeBlur}px)`
                  : undefined,
            ...headerVars,
          }}
        >
          <Motion3UiDrive variant="call" className="motion3-ui-drive--call-reveal" style={headerVars}>
            <DoeHealthCallHistoryDiagram
              width="default"
              showConditions={false}
              showCallHistory
              bare
              callHistoryMode="reveal"
              headerSettle={headerSettle}
              headerMorph={headerMorphStatus}
              headerMorphSubline={headerMorphSubline}
              headerHeroY={`${heroZoneY}px`}
              callHistoryOpacity={callHistoryOpacity}
              durationLabel={durationLabel}
            />
          </Motion3UiDrive>
        </div>
      </IntroUiHero>
      <IntroConfirmCodeInterlude />
      <IntroChartAccessInterlude />
      <Sequence from={DOE_SARAH_CALL_HEADER_APPEAR_FRAME} premountFor={DOE_INTRO_FPS}>
        <Audio
          src={staticFile(DOE_SARAH_INCOMING_CALL_AUDIO_SRC)}
          volume={DOE_SARAH_INCOMING_CALL_VOLUME}
          trimAfter={DOE_SARAH_INCOMING_CALL_AUDIO_TRIM_FRAMES}
        />
      </Sequence>
      <Sequence from={DOE_SARAH_CALLER_OPEN_AUDIO_FROM} premountFor={DOE_INTRO_FPS}>
        <Audio src={staticFile("motion/sarah-caller-open.mp3")} volume={DOE_SARAH_VOICE_VOLUME} />
      </Sequence>
      <Sequence from={DOE_SARAH_AGENT_INTAKE_AUDIO_FROM} premountFor={DOE_INTRO_FPS}>
        <Audio src={staticFile("motion/sarah-agent-intake.mp3")} volume={DOE_SARAH_VOICE_VOLUME} />
      </Sequence>
      <Sequence from={DOE_SARAH_CALLER_VERIFY_AUDIO_FROM} premountFor={DOE_INTRO_FPS}>
        <Audio src={staticFile("motion/sarah-caller-verify.mp3")} volume={DOE_SARAH_VOICE_VOLUME} />
      </Sequence>
      <Sequence from={DOE_SARAH_AGENT_OPEN_CHART_AUDIO_FROM} premountFor={DOE_INTRO_FPS}>
        <Audio src={staticFile("motion/sarah-agent-open-chart.mp3")} volume={DOE_SARAH_VOICE_VOLUME} />
      </Sequence>
    </AbsoluteFill>
  );
}
