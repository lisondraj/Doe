import {
  DOE_LAUNCH_BROWN_BG,
  DOE_LAUNCH_CREAM_BG,
  DOE_LAUNCH_GOLD_GRADIENT,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
} from "../constants";
import { buildCallTurnRevealTiming } from "../motion-ui";

export {
  DOE_LAUNCH_BROWN_BG,
  DOE_LAUNCH_CREAM_BG,
  DOE_LAUNCH_GOLD_GRADIENT,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
};

export const DOE_INTRO_FPS = DOE_LAUNCH_FPS;
export const DOE_INTRO_TRANSITION_FRAMES = 20;
/** Doe → Sarah overlap — connection pulse (see IntroHandoffBridge). */
export const DOE_SARAH_HANDOFF_FRAMES = 36;

/** Doe logo slit reveal length (local frames). */
export const DOE_TYPE_REVEAL_FRAMES = 42;
/** Hold full Doe logo before Sarah handoff — 1s @ 30fps. */
export const DOE_LOGO_HOLD_FRAMES = DOE_INTRO_FPS;
export const DOE_TYPEWRITER_DURATION_FRAMES =
  DOE_TYPE_REVEAL_FRAMES + DOE_LOGO_HOLD_FRAMES + DOE_SARAH_HANDOFF_FRAMES;

/** Sarah call convo — cadence inside MoreThanVoiceScene. */
export const DOE_SARAH_CONVO_TURN_STEP = 84;
export const DOE_SARAH_CONVO_TURN_FADE = 14;
export const DOE_SARAH_CONVO_TURN_START = 10;
/** Hold after Sarah’s thank-you before dissolve into the final Doe screen. */
export const DOE_SARAH_CONVO_END_HOLD = 96;
/** Extra pause after each agent reply — 4× base post-fade hold (2× previous). */
export const DOE_SARAH_CONVO_REPLY_HOLD_EXTRA = 2 * (DOE_SARAH_CONVO_TURN_STEP - DOE_SARAH_CONVO_TURN_FADE);
export const DOE_SARAH_CONVO_REPLY_COUNT = 2;
/** Agent intake — “Before we begin, please state…” */
export const DOE_SARAH_AGENT_INTAKE_TURN = 1;
export const DOE_SARAH_AGENT_INTAKE_AUDIO_SEC = 5.093875;
export const DOE_SARAH_AGENT_INTAKE_REPLY_HOLD =
  Math.ceil(DOE_SARAH_AGENT_INTAKE_AUDIO_SEC * DOE_INTRO_FPS) - DOE_SARAH_CONVO_TURN_STEP + 8;
/** Sarah voice clips — synced to convo turn reveals (see public/motion/sarah-*.mp3). */
export const DOE_SARAH_CALLER_OPEN_TURN = 0;
export const DOE_SARAH_CALLER_OPEN_AUDIO_SEC = 3.47425;
export const DOE_SARAH_CALLER_OPEN_HOLD_EXTRA =
  Math.ceil(DOE_SARAH_CALLER_OPEN_AUDIO_SEC * DOE_INTRO_FPS) - DOE_SARAH_CONVO_TURN_STEP + 8;
/** Hold on Sarah’s DOB reply before agent opens chart. */
export const DOE_SARAH_CALLER_VERIFY_TURN = 2;
export const DOE_SARAH_CALLER_VERIFY_AUDIO_SEC = 6.112625;
/** Brief beat after DOB reply before open-chart line + 4.mp3 (~100ms @ 30fps). */
export const DOE_SARAH_AGENT_OPEN_CHART_PRE_APPEAR_HOLD_FRAMES = 3;
export const DOE_SARAH_CALLER_VERIFY_HOLD_EXTRA =
  Math.ceil(DOE_SARAH_CALLER_VERIFY_AUDIO_SEC * DOE_INTRO_FPS) -
  DOE_SARAH_CONVO_TURN_STEP +
  8 +
  DOE_SARAH_AGENT_OPEN_CHART_PRE_APPEAR_HOLD_FRAMES;
export const DOE_SARAH_CALLER_TURN_HOLDS = [
  { turnIndex: DOE_SARAH_CALLER_OPEN_TURN, frames: DOE_SARAH_CALLER_OPEN_HOLD_EXTRA },
  { turnIndex: DOE_SARAH_CALLER_VERIFY_TURN, frames: DOE_SARAH_CALLER_VERIFY_HOLD_EXTRA },
] as const;
/** agent-open-chart — “Thank you, let me open your chart” */
export const DOE_SARAH_AGENT_OPEN_CHART_TURN = 3;
export const DOE_SARAH_AGENT_OPEN_CHART_AUDIO_SEC = 1.671812;
export const DOE_SARAH_AGENT_OPEN_CHART_PRE_INTERLUDE_HOLD = Math.max(
  8,
  Math.ceil(DOE_SARAH_AGENT_OPEN_CHART_AUDIO_SEC * DOE_INTRO_FPS) - DOE_SARAH_CONVO_TURN_STEP + 8,
);
/** agent-side-effects — hold the ask before the questionnaire interlude. */
export const DOE_SARAH_AGENT_SIDE_EFFECTS_TURN = 4;
export const DOE_SARAH_AGENT_SIDE_EFFECTS_HOLD = 48;
/** agent-prefer-time — “Which day and time would you prefer?” — extra beat after reply. */
export const DOE_SARAH_AGENT_PREFER_TIME_TURN = 6;
export const DOE_SARAH_AGENT_PREFER_TIME_HOLD = DOE_SARAH_CONVO_REPLY_HOLD_EXTRA + 90;
/** caller-prefer-time — brief hold on the date/time tags before booking modal. */
export const DOE_SARAH_CALLER_PREFER_TIME_TURN = 7;
export const DOE_SARAH_CALLER_PREFER_TIME_HOLD = 54;
export const DOE_SARAH_TURN_REPLY_HOLDS = [
  { turnIndex: DOE_SARAH_AGENT_INTAKE_TURN, frames: DOE_SARAH_AGENT_INTAKE_REPLY_HOLD },
  { turnIndex: DOE_SARAH_AGENT_OPEN_CHART_TURN, frames: DOE_SARAH_AGENT_OPEN_CHART_PRE_INTERLUDE_HOLD },
  { turnIndex: 5, frames: DOE_SARAH_CONVO_REPLY_HOLD_EXTRA + 36 },
  { turnIndex: DOE_SARAH_CALLER_PREFER_TIME_TURN, frames: DOE_SARAH_CALLER_PREFER_TIME_HOLD },
] as const;
/** Full-screen confirmation-code beat before Sarah’s DOB reply — ~7s @ 30fps. */
export const DOE_SARAH_CONFIRM_CODE_INTERLUDE_FRAMES = 210;
/** Turn index for caller-verify (“Sure, my date of birth…”) — interlude plays before this turn. */
export const DOE_SARAH_CONFIRM_CODE_INTERLUDE_BEFORE_TURN = 2;
/** Chart access + scrolling Sarah chart boxes after “Thank you, let me open your chart” — ~15s @ 30fps. */
export const DOE_SARAH_CHART_ACCESS_INTERLUDE_FRAMES = 450;
/** Chart modal begins closing this many frames before the interlude ends (while strip still scrolls). */
export const DOE_SARAH_CHART_ACCESS_FADE_OUT_FRAMES = 28;
/** Turn index for agent-side-effects — chart interlude plays before this turn. */
export const DOE_SARAH_CHART_ACCESS_INTERLUDE_BEFORE_TURN = 4;
/** Pre-visit questionnaire + metformin side-effects card after the side-effects ask — ~9s @ 30fps. */
export const DOE_SARAH_QUESTIONNAIRE_INTERLUDE_FRAMES = 270;
export const DOE_SARAH_QUESTIONNAIRE_FADE_OUT_FRAMES = 24;
/** Turn index for caller-side-effects — questionnaire interlude plays before this turn. */
export const DOE_SARAH_QUESTIONNAIRE_INTERLUDE_BEFORE_TURN = 5;
/** Booking appointment + calendar card after Sarah picks a slot — ~8s @ 30fps. */
export const DOE_SARAH_BOOKING_INTERLUDE_FRAMES = 240;
export const DOE_SARAH_BOOKING_FADE_OUT_FRAMES = 22;
/** Turn index for caller-thanks — booking interlude plays before this turn. */
export const DOE_SARAH_BOOKING_INTERLUDE_BEFORE_TURN = 8;
export const DOE_SARAH_CALL_INTERLUDES = [
  {
    beforeTurn: DOE_SARAH_CONFIRM_CODE_INTERLUDE_BEFORE_TURN,
    frames: DOE_SARAH_CONFIRM_CODE_INTERLUDE_FRAMES,
  },
  {
    beforeTurn: DOE_SARAH_CHART_ACCESS_INTERLUDE_BEFORE_TURN,
    frames: DOE_SARAH_CHART_ACCESS_INTERLUDE_FRAMES,
    fadeOutFrames: DOE_SARAH_CHART_ACCESS_FADE_OUT_FRAMES,
  },
  {
    beforeTurn: DOE_SARAH_QUESTIONNAIRE_INTERLUDE_BEFORE_TURN,
    frames: DOE_SARAH_QUESTIONNAIRE_INTERLUDE_FRAMES,
    fadeOutFrames: DOE_SARAH_QUESTIONNAIRE_FADE_OUT_FRAMES,
  },
  {
    beforeTurn: DOE_SARAH_BOOKING_INTERLUDE_BEFORE_TURN,
    frames: DOE_SARAH_BOOKING_INTERLUDE_FRAMES,
    fadeOutFrames: DOE_SARAH_BOOKING_FADE_OUT_FRAMES,
  },
] as const;
export const DOE_SARAH_HERO_HOLD_FRAMES = 46;
export const DOE_SARAH_HEADER_SETTLE_FRAMES = 34;
/** Incoming call SFX — “Sarah Westfield / Calling from” when handoff completes. */
export const DOE_SARAH_CALL_HEADER_APPEAR_FRAME = DOE_SARAH_HANDOFF_FRAMES;
export const DOE_SARAH_INCOMING_CALL_AUDIO_SEC = 2.5;
export const DOE_SARAH_INCOMING_CALL_AUDIO_TRIM_FRAMES = Math.ceil(
  DOE_SARAH_INCOMING_CALL_AUDIO_SEC * DOE_INTRO_FPS,
);
export const DOE_SARAH_INCOMING_CALL_AUDIO_SRC = "motion/sarah-incoming-call.wav";
export const DOE_SARAH_INCOMING_CALL_VOLUME = 26;
export const DOE_SARAH_INTRO_TURN_COUNT = 9;
export const DOE_SARAH_CONVO_UI_OFFSET = 4;

/** Sarah call ends the intro — opening → Doe → thank-you → final Doe screen. */
export const DOE_SARAH_SETTLE_START_FRAMES = DOE_SARAH_HANDOFF_FRAMES + DOE_SARAH_HERO_HOLD_FRAMES;
export const DOE_SARAH_CONVO_START_FRAMES = DOE_SARAH_SETTLE_START_FRAMES + DOE_SARAH_HEADER_SETTLE_FRAMES;
/** Per-turn holds after a turn (caller audio + side-effects/prefer-time beats). */
export const DOE_SARAH_TURN_HOLDS_AFTER = [
  ...DOE_SARAH_CALLER_TURN_HOLDS,
  { turnIndex: DOE_SARAH_AGENT_SIDE_EFFECTS_TURN, frames: DOE_SARAH_AGENT_SIDE_EFFECTS_HOLD },
  { turnIndex: DOE_SARAH_AGENT_PREFER_TIME_TURN, frames: DOE_SARAH_AGENT_PREFER_TIME_HOLD },
] as const;
const DOE_SARAH_CONVO_TIMING = buildCallTurnRevealTiming(
  DOE_SARAH_INTRO_TURN_COUNT,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_TURN_HOLDS_AFTER,
  DOE_SARAH_TURN_REPLY_HOLDS,
);
export const DOE_SARAH_CALLER_OPEN_AUDIO_FROM =
  DOE_SARAH_CONVO_START_FRAMES +
  DOE_SARAH_CONVO_UI_OFFSET +
  DOE_SARAH_CONVO_TIMING.turnStarts[DOE_SARAH_CALLER_OPEN_TURN]!;
export const DOE_SARAH_AGENT_INTAKE_AUDIO_FROM =
  DOE_SARAH_CONVO_START_FRAMES +
  DOE_SARAH_CONVO_UI_OFFSET +
  DOE_SARAH_CONVO_TIMING.turnStarts[DOE_SARAH_AGENT_INTAKE_TURN]!;
export const DOE_SARAH_CALLER_VERIFY_AUDIO_FROM =
  DOE_SARAH_CONVO_START_FRAMES +
  DOE_SARAH_CONVO_UI_OFFSET +
  DOE_SARAH_CONVO_TIMING.turnStarts[DOE_SARAH_CALLER_VERIFY_TURN]!;
export const DOE_SARAH_AGENT_OPEN_CHART_AUDIO_FROM =
  DOE_SARAH_CONVO_START_FRAMES +
  DOE_SARAH_CONVO_UI_OFFSET +
  DOE_SARAH_CONVO_TIMING.turnStarts[DOE_SARAH_AGENT_OPEN_CHART_TURN]!;
/** Background music ducks when Sarah’s opening line appears (scene-local frame). */
export const DOE_INTRO_MUSIC_DUCK_FADE_FRAMES = 18;
export const DOE_INTRO_MUSIC_DUCK_LEVEL = 0.22;
/** Sarah / agent voice clips — boosted above default so they sit above ducked bed. */
export const DOE_SARAH_VOICE_VOLUME = 4.5;
/** Remotion Player shared `<Audio />` pool — bg + 6 voice/SFX tags. */
export const DOE_INTRO_SHARED_AUDIO_TAGS = 8;
export const DOE_SARAH_CONVO_LAST_TURN_END =
  DOE_SARAH_CONVO_UI_OFFSET +
  DOE_SARAH_CONVO_TIMING.turnStarts[DOE_SARAH_INTRO_TURN_COUNT - 1]! +
  DOE_SARAH_CONVO_TURN_FADE +
  42;
export const DOE_SARAH_MORE_THAN_VOICE_FRAMES =
  DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_LAST_TURN_END + DOE_SARAH_CONVO_END_HOLD;

/** Outro — dissolve from Sarah into dusk shader + Doe logo. */
export const DOE_OUTRO_SHADER_HANDOFF_FRAMES = 38;
/** “Doe” logo spring — matches OutroDoeShaderScene logoEnter start. */
export const DOE_OUTRO_DOE_LOGO_APPEAR_FRAME = Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.52);
export const DOE_OUTRO_DOE_AUDIO_SEC = 2.08975;
export const DOE_OUTRO_DOE_AUDIO_FRAMES = Math.ceil(DOE_OUTRO_DOE_AUDIO_SEC * DOE_INTRO_FPS);
export const DOE_OUTRO_DOE_AUDIO_SRC = "motion/doe-outro-logo.mp3";
export const DOE_OUTRO_DOE_VOLUME = 7.5;
/** Hold on “Doe” before URL swap. */
export const DOE_OUTRO_DOE_HOLD_FRAMES = 36 + 2 * DOE_INTRO_FPS;
/** Hard cut Doe → doehealth.care (same frame as brown bg). */
export const DOE_OUTRO_URL_CROSSFADE_FRAMES = 0;
/** Hold on URL at end. */
export const DOE_OUTRO_URL_HOLD_FRAMES = 48 + 2 * DOE_INTRO_FPS;
export const DOE_OUTRO_SHADER_HOLD_FRAMES =
  DOE_OUTRO_DOE_HOLD_FRAMES + DOE_OUTRO_URL_CROSSFADE_FRAMES + DOE_OUTRO_URL_HOLD_FRAMES;
export const DOE_OUTRO_SHADER_DURATION_FRAMES =
  DOE_OUTRO_SHADER_HANDOFF_FRAMES + DOE_OUTRO_SHADER_HOLD_FRAMES;

export const DOE_INTRO_SCENES = {
  opening: { from: 0, duration: 178 },
  /** Gold Doe center reveal, then handoff to Sarah. */
  doeTypewriter: { from: 164, duration: DOE_TYPEWRITER_DURATION_FRAMES },
  moreThanVoice: {
    from: 164 + DOE_TYPEWRITER_DURATION_FRAMES - DOE_SARAH_HANDOFF_FRAMES,
    duration: DOE_SARAH_MORE_THAN_VOICE_FRAMES,
  },
  outroShader: {
    from:
      164 +
      DOE_TYPEWRITER_DURATION_FRAMES -
      DOE_SARAH_HANDOFF_FRAMES +
      DOE_SARAH_MORE_THAN_VOICE_FRAMES -
      DOE_OUTRO_SHADER_HANDOFF_FRAMES,
    duration: DOE_OUTRO_SHADER_DURATION_FRAMES,
  },
} as const;

export const DOE_INTRO_DURATION_FRAMES =
  DOE_INTRO_SCENES.outroShader.from + DOE_INTRO_SCENES.outroShader.duration;
/** Duck background music leading into incoming call SFX (6.wav) — not Sarah’s first reply. */
export const DOE_INTRO_MUSIC_DUCK_FROM =
  DOE_INTRO_SCENES.moreThanVoice.from +
  Math.max(0, DOE_SARAH_CALL_HEADER_APPEAR_FRAME - DOE_INTRO_MUSIC_DUCK_FADE_FRAMES);
/** Restore full music volume after outro “Doe” clip (5.mp3) finishes. */
export const DOE_INTRO_MUSIC_RESTORE_FROM =
  DOE_INTRO_SCENES.outroShader.from +
  DOE_OUTRO_DOE_LOGO_APPEAR_FRAME +
  DOE_OUTRO_DOE_AUDIO_FRAMES;
export const DOE_INTRO_DURATION_SEC = DOE_INTRO_DURATION_FRAMES / DOE_INTRO_FPS;
/** Background bed — first `newbg.mp3` segment through full intro length. */
export const DOE_INTRO_BG_MUSIC_SRC = "motion/newbg.mp3";
export const DOE_INTRO_AUDIO_DURATION_FRAMES = DOE_INTRO_DURATION_FRAMES;
export const DOE_INTRO_AUDIO_DURATION_SEC = DOE_INTRO_DURATION_SEC;
