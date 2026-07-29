import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_FADE_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_VISIBLE_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_DOWN_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_START,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_UP_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE2,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_ALONE_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_MOTIONLESS_HOLD_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_HOLD_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FINAL_POST_TYPE_HOLD_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_SEQUENCE_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS,
  MOTION_TEST_FINALE_LAUNCH_CARD_SLASH,
  MOTION_TEST_FINALE_LAUNCH_CARD_SLASH_REVEAL_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME,
  MOTION_TEST_FINALE_LAUNCH_CARD_END_FRAME,
  MOTION_TEST_FINALE_LAUNCH_CARD_SWITCH_FRAMES,
  getMotionTestFinaleLaunchCardPathDeleteFrames,
  getMotionTestFinaleLaunchCardPathTypeFrames,
} from "./constants";
import { getMotionTestFinaleDoeLockupScale } from "./finale-doe-lockup-scale-motion";

const FADE_EASE = Easing.out(Easing.cubic);
const LINE1_SCALE_UP_EASE = Easing.out(Easing.cubic);
const SCALE_DOWN_EASE = Easing.in(Easing.cubic);

function getLaunchCardPulseScale(
  pulseLocalFrame: number,
  scaleStart: number,
  scaleUpFrames: number,
  scaleDownFrames: number,
  restScale = scaleStart,
): number {
  const scaleUpEnd = scaleUpFrames;
  const scaleDownEnd = scaleUpEnd + scaleDownFrames;

  if (pulseLocalFrame <= scaleUpEnd) {
    return interpolate(pulseLocalFrame, [0, scaleUpEnd], [scaleStart, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: LINE1_SCALE_UP_EASE,
    });
  }

  if (pulseLocalFrame <= scaleDownEnd) {
    return interpolate(
      pulseLocalFrame,
      [scaleUpEnd, scaleDownEnd],
      [1, restScale],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: SCALE_DOWN_EASE,
      },
    );
  }

  return restScale;
}

function getLaunchCardLine1Scale(localFrame: number): number {
  return getLaunchCardPulseScale(
    localFrame,
    MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_START,
    MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_UP_FRAMES,
    MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_DOWN_FRAMES,
  );
}

function getSlashRevealText(slashLocalFrame: number): string {
  return getTypewriterText(
    MOTION_TEST_FINALE_LAUNCH_CARD_SLASH,
    slashLocalFrame,
    MOTION_TEST_FINALE_LAUNCH_CARD_SLASH_REVEAL_FRAMES,
  );
}

function getTypewriterText(text: string, typeFrame: number, typeFrames: number): string {
  const letters = text.split("");
  const framesPerLetter = typeFrames / letters.length;
  const visibleCount = Math.min(
    letters.length,
    Math.max(0, Math.floor(typeFrame / framesPerLetter) + (typeFrame >= 0 ? 1 : 0)),
  );

  return letters.slice(0, visibleCount).join("");
}

function getDeleteText(text: string, deleteFrame: number, deleteFrames: number): string {
  const letters = text.split("");
  const framesPerLetter = deleteFrames / letters.length;
  const deletedCount = Math.min(
    letters.length,
    Math.max(0, Math.floor(deleteFrame / framesPerLetter) + (deleteFrame >= 0 ? 1 : 0)),
  );

  return letters.slice(0, letters.length - deletedCount).join("");
}

function getLaunchCardPathMotion(pathLocalFrame: number): {
  pathText: string;
  showPathCursor: boolean;
  pathCursorFrame: number;
} {
  let frame = pathLocalFrame;

  for (let index = 0; index < MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS.length; index++) {
    const word = MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS[index];
    const typeFrames = getMotionTestFinaleLaunchCardPathTypeFrames(word);
    const deleteFrames = getMotionTestFinaleLaunchCardPathDeleteFrames(word);
    const isLast = index === MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS.length - 1;

    if (frame < typeFrames) {
      return {
        pathText: getTypewriterText(word, frame, typeFrames),
        showPathCursor: true,
        pathCursorFrame: frame,
      };
    }
    frame -= typeFrames;

    const postTypeHoldFrames = isLast
      ? MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FINAL_POST_TYPE_HOLD_FRAMES
      : MOTION_TEST_FINALE_LAUNCH_CARD_PATH_HOLD_FRAMES;

    if (frame < postTypeHoldFrames) {
      return {
        pathText: word,
        showPathCursor: true,
        pathCursorFrame: frame,
      };
    }
    frame -= postTypeHoldFrames;

    if (!isLast) {
      if (frame < deleteFrames) {
        return {
          pathText: getDeleteText(word, frame, deleteFrames),
          showPathCursor: true,
          pathCursorFrame: frame,
        };
      }
      frame -= deleteFrames;
    }
  }

  const lastWord =
    MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS[
      MOTION_TEST_FINALE_LAUNCH_CARD_PATH_WORDS.length - 1
    ];

  return {
    pathText: lastWord,
    showPathCursor: false,
    pathCursorFrame: 0,
  };
}

export function isMotionTestFinaleLaunchCardVisible(frame: number): boolean {
  return (
    frame >= MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME &&
    frame < MOTION_TEST_FINALE_LAUNCH_CARD_END_FRAME
  );
}

export function getMotionTestFinaleLaunchCardMotion(frame: number): {
  visible: boolean;
  launchingText: string;
  slashText: string;
  pathText: string;
  opacity: number;
  titleScale: number;
  showDoeCare: boolean;
  showPathCursor: boolean;
  pathCursorVisible: boolean;
  useInvertedColors: boolean;
} {
  const empty = {
    visible: false,
    launchingText: MOTION_TEST_FINALE_LAUNCH_CARD_LINE1,
    slashText: "",
    pathText: "",
    opacity: 0,
    titleScale: MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_SCALE_START,
    showDoeCare: false,
    showPathCursor: false,
    pathCursorVisible: false,
    useInvertedColors: false,
  };

  if (frame < MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME) {
    return empty;
  }

  const localFrame = frame - MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME;
  const line1End = MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_VISIBLE_FRAMES;
  const switchEnd = line1End + MOTION_TEST_FINALE_LAUNCH_CARD_SWITCH_FRAMES;
  const doeCareAloneEnd = switchEnd + MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_ALONE_FRAMES;
  const pathSequenceEnd = doeCareAloneEnd + MOTION_TEST_FINALE_LAUNCH_CARD_PATH_SEQUENCE_FRAMES;
  const doeCareMotionlessEnd =
    switchEnd + MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_MOTIONLESS_HOLD_FRAMES;

  if (localFrame < MOTION_TEST_FINALE_LAUNCH_CARD_FADE_FRAMES) {
    return {
      visible: true,
      launchingText: MOTION_TEST_FINALE_LAUNCH_CARD_LINE1,
      slashText: "",
      pathText: "",
      opacity: interpolate(
        localFrame,
        [0, MOTION_TEST_FINALE_LAUNCH_CARD_FADE_FRAMES],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: FADE_EASE,
        },
      ),
      titleScale: getLaunchCardLine1Scale(localFrame),
      showDoeCare: false,
      showPathCursor: false,
      pathCursorVisible: false,
      useInvertedColors: false,
    };
  }

  if (localFrame < switchEnd) {
    const showDoeCare = localFrame >= line1End;

    return {
      visible: true,
      launchingText: showDoeCare ? MOTION_TEST_FINALE_LAUNCH_CARD_LINE2 : MOTION_TEST_FINALE_LAUNCH_CARD_LINE1,
      slashText: "",
      pathText: "",
      opacity: 1,
      titleScale: showDoeCare
        ? getMotionTestFinaleDoeLockupScale(frame)
        : getLaunchCardLine1Scale(localFrame),
      showDoeCare,
      showPathCursor: false,
      pathCursorVisible: false,
      useInvertedColors: showDoeCare,
    };
  }

  if (localFrame < doeCareAloneEnd) {
    const isSlashPhase = localFrame >= doeCareMotionlessEnd;
    const slashLocalFrame = localFrame - doeCareMotionlessEnd;
    const cursorOn =
      Math.floor(slashLocalFrame / MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES) % 2 === 0;

    return {
      visible: true,
      launchingText: MOTION_TEST_FINALE_LAUNCH_CARD_LINE2,
      slashText: isSlashPhase ? getSlashRevealText(slashLocalFrame) : "",
      pathText: "",
      opacity: 1,
      titleScale: getMotionTestFinaleDoeLockupScale(frame),
      showDoeCare: true,
      showPathCursor: isSlashPhase,
      pathCursorVisible: isSlashPhase && cursorOn,
      useInvertedColors: true,
    };
  }

  const pathLocalFrame = localFrame - doeCareAloneEnd;
  const { pathText, showPathCursor: pathCursorInMotion, pathCursorFrame } =
    getLaunchCardPathMotion(pathLocalFrame);
  const cursorOn =
    Math.floor(pathCursorFrame / MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES) % 2 === 0;
  const isPathSequenceActive = localFrame < pathSequenceEnd;

  return {
    visible: true,
    launchingText: MOTION_TEST_FINALE_LAUNCH_CARD_LINE2,
    slashText: MOTION_TEST_FINALE_LAUNCH_CARD_SLASH,
    pathText,
    opacity: 1,
    titleScale: getMotionTestFinaleDoeLockupScale(frame),
    showDoeCare: true,
    showPathCursor: isPathSequenceActive,
    pathCursorVisible: isPathSequenceActive && pathCursorInMotion && cursorOn,
    useInvertedColors: true,
  };
}
