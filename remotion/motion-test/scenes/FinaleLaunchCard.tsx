import { AbsoluteFill } from "remotion";

import { sfPro } from "@/remotion/fonts";

import {
  MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_FONT_SIZE,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_FONT_SIZE,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_CURSOR_HEIGHT_EM,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_CURSOR_WIDTH_EM,
  MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FONT_SIZE,
  MOTION_TEST_FINALE_TYPE_COLOR,
  MOTION_TEST_GOLD_GRADIENT,
  MOTION_TEST_TITLE_GRADIENT,
} from "../constants";
import { getMotionTestFinaleLaunchCardMotion } from "../finale-launch-card-motion";
import { getMotionTestGradientY } from "../gradient-motion";
import {
  MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS,
  MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS,
} from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleLaunchCard() {
  const frame = useMotionTestFrame();
  const {
    visible,
    launchingText,
    slashText,
    pathText,
    opacity,
    titleScale,
    showDoeCare,
    showPathCursor,
    pathCursorVisible,
    useInvertedColors,
  } = getMotionTestFinaleLaunchCardMotion(frame);
  const { gradientY, layerHeight } = getMotionTestGradientY(frame);
  const invertedTextClass = useInvertedColors
    ? MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS
    : MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS;

  const pathCursorStyle = useInvertedColors
    ? {
        color: MOTION_TEST_FINALE_TYPE_COLOR,
        backgroundColor: MOTION_TEST_FINALE_TYPE_COLOR,
      }
    : {
        color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
        backgroundColor: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
      };

  if (!visible || opacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill
      className="motion-test-finale-launch-card"
      style={{ pointerEvents: "none" }}
    >
      {useInvertedColors ? (
        <AbsoluteFill
          className="motion-test-finale-launch-card__white-fill"
          style={{ background: MOTION_TEST_GOLD_GRADIENT }}
        />
      ) : (
        <AbsoluteFill className="motion-test-title__gradient-wrap">
          <div
            className="motion-test-title__gradient motion-test-intelligence-flipped-portal__gradient"
            style={{
              height: layerHeight,
              background: MOTION_TEST_TITLE_GRADIENT,
              transform: `translateY(${gradientY}px)`,
            }}
          />
        </AbsoluteFill>
      )}

      <div
        className="motion-test-finale-launch-card__title-row"
        style={{
          opacity,
          transform: `translate(-50%, -50%) scale(${titleScale})`,
        }}
      >
        {showDoeCare ? (
          <>
            <span
              className={`motion-test-finale-launch-card__doe ${invertedTextClass} ${sfPro.className}`}
              style={{
                fontSize: MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_FONT_SIZE,
              }}
            >
              {launchingText}
            </span>
            {slashText || pathText || showPathCursor ? (
              <span
                className="motion-test-finale-launch-card__suffix"
                style={{ fontSize: MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FONT_SIZE }}
              >
                {slashText ? (
                  <span
                    className={`motion-test-finale-launch-card__path ${invertedTextClass} ${sfPro.className}`}
                  >
                    {slashText}
                  </span>
                ) : null}
                {pathText ? (
                  <span
                    className={`motion-test-finale-launch-card__path ${invertedTextClass} ${sfPro.className}`}
                  >
                    {pathText}
                  </span>
                ) : null}
                {showPathCursor ? (
                  <span
                    className={`motion-test-finale-launch-card__cursor${
                      pathCursorVisible ? "" : " motion-test-finale-launch-card__cursor--ghost"
                    }`}
                    style={{
                      ...pathCursorStyle,
                      width:
                        MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FONT_SIZE *
                        MOTION_TEST_FINALE_LAUNCH_CARD_PATH_CURSOR_WIDTH_EM,
                      height:
                        MOTION_TEST_FINALE_LAUNCH_CARD_PATH_FONT_SIZE *
                        MOTION_TEST_FINALE_LAUNCH_CARD_PATH_CURSOR_HEIGHT_EM,
                    }}
                    aria-hidden
                  />
                ) : null}
              </span>
            ) : null}
          </>
        ) : (
          <span
            className={`motion-test-finale-launch-card__launching ${invertedTextClass} ${sfPro.className}`}
            style={{
              fontSize: MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_FONT_SIZE,
            }}
          >
            {launchingText}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
}
