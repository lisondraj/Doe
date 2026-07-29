import { AbsoluteFill, useCurrentFrame } from "remotion";

import {
  MOTION_TEST_FINALE_BUILDING_TYPE_FRAMES,
  MOTION_TEST_FINALE_BUILDING_VISIBLE_SUFFIX,
  MOTION_TEST_FINALE_BUILDING_WORD,
  MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES,
  MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME,
  MOTION_TEST_FINALE_FULL_PHRASE_BEFORE_INTELLIGENCE,
  MOTION_TEST_FINALE_FULL_PHRASE_AFTER_INTELLIGENCE,
  MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_TYPE_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD,
  MOTION_TEST_FINALE_INTELLIGENCE_WORD,
  MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
  MOTION_TEST_TITLE_GRADIENT,
  MOTION_TEST_FINALE_SECOND_LINE_COLOR_SWITCH_FRAME,
  MOTION_TEST_FINALE_SECOND_LINE_WORD,
  MOTION_TEST_FINALE_TWO_LINE_LEADING,
  MOTION_TEST_FINALE_TYPE_FONT_SIZE,
  MOTION_TEST_FINALE_TYPE_LINE_HEIGHT,
  MOTION_TEST_FINALE_TYPE_START_FRAME,
} from "../constants";
import {
  getMotionTestFinaleIntelligenceStackEchoDrift,
  getMotionTestFinaleIntelligenceStackEchoOffsets,
  getMotionTestFinaleIntelligenceStackLayerOpacity,
  getMotionTestFinaleIntelligenceStackPanY,
  getMotionTestFinaleIntelligenceFlippedStackEchoDrift,
  getMotionTestFinaleIntelligenceFlippedStackPanY,
} from "../finale-intelligence-stack-motion";
import {
  getMotionTestFinaleIntelligenceFlippedPhase,
  getMotionTestFinaleIntelligenceFlippedZoom,
} from "../finale-intelligence-flipped-zoom-motion";
import { getMotionTestGradientY } from "../gradient-motion";
import {
  getMotionTestFinaleIntelligenceFlippedMotion,
  getMotionTestFinaleIntelligenceIsolateMotion,
  getMotionTestFinalePhraseMotion,
} from "../finale-phrase-motion";
import { getMotionTestFinaleTypewriterScale } from "../finale-typewriter-motion";
import { getMotionTestGradientTextStyle, getMotionTestGradientTextVisualStyle } from "../gradient-text-style";

function FinalePhraseDualColorText({
  showInverted,
  children,
}: {
  showInverted: boolean;
  children: React.ReactNode;
}) {
  const layerBaseClass =
    "motion-test-finale-type__full-phrase-text motion-test-finale-type__full-phrase-layer";

  return (
    <span className="motion-test-finale-type__full-phrase-stack">
      <span
        className="motion-test-finale-type__full-phrase-text motion-test-finale-type__full-phrase-sizer"
        aria-hidden
      >
        {children}
      </span>
      <span
        className={`${layerBaseClass} motion-test-finale-type__full-phrase-layer--gradient`}
        style={{
          ...getMotionTestGradientTextVisualStyle(),
          opacity: showInverted ? 0 : 1,
        }}
        aria-hidden={showInverted}
      >
        {children}
      </span>
      <span
        className={layerBaseClass}
        style={{
          color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
          WebkitTextFillColor: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
          opacity: showInverted ? 1 : 0,
        }}
        aria-hidden={!showInverted}
      >
        {children}
      </span>
    </span>
  );
}

function FinalePhraseLine1Words() {
  return (
    <>
      {MOTION_TEST_FINALE_FULL_PHRASE_BEFORE_INTELLIGENCE}
      <span className="motion-test-finale-type__intelligence-into-run">
        {MOTION_TEST_FINALE_INTELLIGENCE_WORD}
        {MOTION_TEST_FINALE_FULL_PHRASE_AFTER_INTELLIGENCE}
      </span>
    </>
  );
}

type TypewriterRowProps = {
  text: string;
  typeFrame: number;
  typeFrames: number;
  fontSize?: number;
  scale: number;
};

function TypewriterGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const gradientTextStyle = getMotionTestGradientTextStyle();

  return (
    <span className={className} style={gradientTextStyle}>
      {children}
    </span>
  );
}

function TypewriterRow({ text, typeFrame, typeFrames, fontSize, scale }: TypewriterRowProps) {
  const letters = text.split("");
  const framesPerLetter = typeFrames / letters.length;
  const visibleCount = Math.min(
    letters.length,
    Math.max(0, Math.floor(typeFrame / framesPerLetter) + (typeFrame >= 0 ? 1 : 0)),
  );
  const visibleText = letters.slice(0, visibleCount).join("");
  const cursorOn = Math.floor(typeFrame / MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES) % 2 === 0;

  return (
    <div
      className="motion-test-finale-type__typewriter-scale"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        className="motion-test-finale-type__row motion-test-finale-type__row--very-big"
        style={{
          fontSize: fontSize ?? MOTION_TEST_FINALE_TYPE_FONT_SIZE,
          lineHeight: MOTION_TEST_FINALE_TYPE_LINE_HEIGHT,
        }}
        aria-hidden
      >
        <TypewriterGradientText className="motion-test-finale-type__gradient-text motion-test-title__label--gradient">
          {visibleText}
        </TypewriterGradientText>
        <span
          className={`motion-test-finale-type__cursor motion-test-finale-type__cursor--gradient${cursorOn ? "" : " motion-test-finale-type__cursor--ghost"}`}
          style={getMotionTestGradientTextStyle()}
          aria-hidden
        >
          |
        </span>
      </div>
    </div>
  );
}

function TypewriterWhiteText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={className} style={{ color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR }}>
      {children}
    </span>
  );
}

function IntelligenceTypewriterRow({
  typeFrame,
  typeFrames,
  fontSize,
  scale,
}: {
  typeFrame: number;
  typeFrames: number;
  fontSize: number;
  scale: number;
}) {
  const letters = MOTION_TEST_FINALE_INTELLIGENCE_WORD.split("");
  const framesPerLetter = typeFrames / letters.length;
  const visibleCount = Math.min(
    letters.length,
    Math.max(0, Math.floor(typeFrame / framesPerLetter) + (typeFrame >= 0 ? 1 : 0)),
  );
  const visibleText = letters.slice(0, visibleCount).join("");
  const cursorOn = Math.floor(typeFrame / MOTION_TEST_FINALE_CURSOR_BLINK_FRAMES) % 2 === 0;

  return (
    <div
      className="motion-test-finale-type__typewriter-scale"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        className="motion-test-finale-type__row motion-test-finale-type__row--very-big"
        style={{
          fontSize,
          lineHeight: MOTION_TEST_FINALE_TYPE_LINE_HEIGHT,
        }}
        aria-hidden
      >
        <span className="motion-test-finale-type__intelligence-type-wrap">
          <TypewriterWhiteText className="motion-test-finale-type__building-prefix">
            {MOTION_TEST_FINALE_BUILDING_VISIBLE_SUFFIX}
          </TypewriterWhiteText>
          <TypewriterWhiteText className="motion-test-finale-type__gradient-text">
            {visibleText}
          </TypewriterWhiteText>
          <span
            className={`motion-test-finale-type__cursor${cursorOn ? "" : " motion-test-finale-type__cursor--ghost"}`}
            style={{ color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR }}
            aria-hidden
          >
            |
          </span>
        </span>
      </div>
    </div>
  );
}

function FullPhraseBlock() {
  const frame = useCurrentFrame();
  const { scale, line1TranslateY, line2TranslateY, line2Opacity, fontSize } =
    getMotionTestFinalePhraseMotion(frame);
  const useInvertedColors = frame >= MOTION_TEST_FINALE_SECOND_LINE_COLOR_SWITCH_FRAME;
  const rowClassName =
    "motion-test-finale-type__row motion-test-finale-type__row--full-phrase";

  return (
    <div
      className="motion-test-finale-type__stack"
      style={{
        transform: `scale(${scale})`,
      }}
    >
      <div className="motion-test-finale-type__lines">
        <div
          className={rowClassName}
          style={{
            fontSize,
            transform: `translate(-50%, calc(-50% + ${line1TranslateY}px))`,
          }}
        >
          <FinalePhraseDualColorText showInverted={useInvertedColors}>
            <FinalePhraseLine1Words />
          </FinalePhraseDualColorText>
        </div>
        <div
          className={`${rowClassName} motion-test-finale-type__row--second`}
          style={{
            fontSize,
            opacity: line2Opacity,
            transform: `translate(-50%, calc(-50% + ${line2TranslateY}px))`,
          }}
        >
          <FinalePhraseDualColorText showInverted={useInvertedColors}>
            {MOTION_TEST_FINALE_SECOND_LINE_WORD}
          </FinalePhraseDualColorText>
        </div>
      </div>
    </div>
  );
}

function IntelligenceStackBlock() {
  const frame = useCurrentFrame();
  const { scale } = getMotionTestFinalePhraseMotion(frame);
  const { line1TranslateY, fontSize } = getMotionTestFinaleIntelligenceIsolateMotion();
  const gradientTextStyle = getMotionTestGradientTextVisualStyle();
  const lineStep = fontSize * MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT;
  const echoOffsets = getMotionTestFinaleIntelligenceStackEchoOffsets(lineStep, scale);
  const stackPanY = getMotionTestFinaleIntelligenceStackPanY(frame);

  return (
    <div
      className="motion-test-finale-type__stack"
      style={{
        transform: `scale(${scale})`,
      }}
    >
      <div className="motion-test-finale-type__lines">
        <div
          className="motion-test-finale-type__row motion-test-finale-type__row--full-phrase"
          style={{
            fontSize,
            transform: `translate(-50%, calc(-50% + ${line1TranslateY + stackPanY}px))`,
          }}
        >
          <span className="motion-test-finale-type__phrase-ghost" aria-hidden>
            {MOTION_TEST_FINALE_FULL_PHRASE_BEFORE_INTELLIGENCE}
          </span>
          <span className="motion-test-intelligence-stack-anchor">
            {echoOffsets.map((offset) => (
              <span
                key={offset}
                className="motion-test-intelligence-stack__layer motion-test-finale-type__phrase-word--isolate motion-test-title__label--gradient"
                style={{
                  opacity: getMotionTestFinaleIntelligenceStackLayerOpacity(offset),
                  transform: `translate(-50%, calc(-50% + ${offset * lineStep + getMotionTestFinaleIntelligenceStackEchoDrift(frame, lineStep, offset)}px))`,
                  ...gradientTextStyle,
                }}
                aria-hidden
              >
                {MOTION_TEST_FINALE_INTELLIGENCE_WORD}
              </span>
            ))}
            <span
              className="motion-test-intelligence-stack__center motion-test-finale-type__phrase-word motion-test-finale-type__phrase-word--isolate motion-test-title__label--gradient"
              style={gradientTextStyle}
            >
              {MOTION_TEST_FINALE_INTELLIGENCE_WORD}
            </span>
          </span>
          <span className="motion-test-finale-type__phrase-ghost" aria-hidden>
            {MOTION_TEST_FINALE_FULL_PHRASE_AFTER_INTELLIGENCE}
          </span>
        </div>
      </div>
    </div>
  );
}

function IntelligenceFlippedBlock() {
  const frame = useCurrentFrame();
  const { fontSize: baseFontSize } = getMotionTestFinaleIntelligenceFlippedMotion();
  const { circleRadius, textOffsetX, textFontSize, phase } =
    getMotionTestFinaleIntelligenceFlippedZoom(frame, baseFontSize);
  const lineStep = textFontSize * MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT;
  const echoOffsets = getMotionTestFinaleIntelligenceStackEchoOffsets(lineStep, 1);
  const stackPanY = getMotionTestFinaleIntelligenceFlippedStackPanY(frame);
  const circleClip = `circle(${circleRadius}px at 0px 50%)`;

  const stackRow = (
    <div
      className="motion-test-intelligence-flipped-stack__row"
      style={{
        fontSize: textFontSize,
        transform: `translate(calc(-50% + ${textOffsetX}px), calc(-50% + ${stackPanY}px))`,
      }}
    >
      <span className="motion-test-intelligence-stack-anchor">
        {echoOffsets.map((offset) => (
          <span
            key={offset}
            className="motion-test-intelligence-stack__layer motion-test-finale-type__phrase-word--isolate motion-test-finale-type__phrase-word--flipped"
            style={{
              opacity: getMotionTestFinaleIntelligenceStackLayerOpacity(offset),
              transform: `translate(-50%, calc(-50% + ${offset * lineStep + getMotionTestFinaleIntelligenceFlippedStackEchoDrift(frame, lineStep, offset)}px))`,
              color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
              fontSize: textFontSize,
            }}
            aria-hidden
          >
            {MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD}
          </span>
        ))}
        <span
          className="motion-test-intelligence-stack__center motion-test-finale-type__phrase-word motion-test-finale-type__phrase-word--isolate motion-test-finale-type__phrase-word--flipped"
          style={{
            color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
            fontSize: textFontSize,
          }}
        >
          {MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD}
        </span>
      </span>
    </div>
  );

  if (phase === "hold") {
    return (
      <AbsoluteFill className="motion-test-intelligence-flipped-portal motion-test-intelligence-flipped-portal--hold motion-test-finale-type--stack-clip">
        <div className="motion-test-finale-type__stack">
          <div className="motion-test-finale-type__lines">{stackRow}</div>
        </div>
      </AbsoluteFill>
    );
  }

  const { gradientY, layerHeight } = getMotionTestGradientY(frame);

  return (
    <AbsoluteFill className="motion-test-intelligence-flipped-portal">
      <AbsoluteFill
        className="motion-test-intelligence-flipped-portal__gradient-clip"
        style={{ clipPath: circleClip }}
      >
        <div
          className="motion-test-title__gradient motion-test-intelligence-flipped-portal__gradient"
          style={{
            height: layerHeight,
            background: MOTION_TEST_TITLE_GRADIENT,
            transform: `translateY(${gradientY}px)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        className="motion-test-intelligence-flipped-portal__text"
        style={{ clipPath: circleClip }}
      >
        <div className="motion-test-finale-type__stack">
          <div className="motion-test-finale-type__lines">{stackRow}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function getFinaleDisplayPhase(
  frame: number,
):
  | "typewriter"
  | "full-phrase"
  | "intelligence-stack"
  | "intelligence-flipped" {
  if (frame >= MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME) {
    return "intelligence-flipped";
  }

  if (frame >= MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME) {
    return "intelligence-stack";
  }

  if (frame >= MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME) {
    return "full-phrase";
  }

  return "typewriter";
}

export function VeryBigTypewriter() {
  const frame = useCurrentFrame();
  const displayPhase = getFinaleDisplayPhase(frame);

  if (displayPhase === "intelligence-flipped") {
    const phase = getMotionTestFinaleIntelligenceFlippedPhase(frame);

    return (
      <AbsoluteFill
        className={`motion-test-finale-type${phase === "hold" ? "" : " motion-test-finale-type--portal-zoom"}`}
      >
        <IntelligenceFlippedBlock />
      </AbsoluteFill>
    );
  }

  if (displayPhase === "intelligence-stack") {
    return (
      <AbsoluteFill className="motion-test-finale-type motion-test-finale-type--stack-clip">
        <IntelligenceStackBlock />
      </AbsoluteFill>
    );
  }

  if (displayPhase === "full-phrase") {
    return (
      <AbsoluteFill className="motion-test-finale-type">
        <FullPhraseBlock />
      </AbsoluteFill>
    );
  }

  if (frame >= MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME) {
    return (
      <AbsoluteFill className="motion-test-finale-type">
        <IntelligenceTypewriterRow
          typeFrame={frame - MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME}
          typeFrames={MOTION_TEST_FINALE_INTELLIGENCE_TYPE_FRAMES}
          fontSize={MOTION_TEST_FINALE_TYPE_FONT_SIZE}
          scale={getMotionTestFinaleTypewriterScale(
            frame,
            MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME,
            MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME,
          )}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="motion-test-finale-type">
      <TypewriterRow
        text={MOTION_TEST_FINALE_BUILDING_WORD}
        typeFrame={frame - MOTION_TEST_FINALE_TYPE_START_FRAME}
        typeFrames={MOTION_TEST_FINALE_BUILDING_TYPE_FRAMES}
        fontSize={MOTION_TEST_FINALE_TYPE_FONT_SIZE}
        scale={getMotionTestFinaleTypewriterScale(
          frame,
          MOTION_TEST_FINALE_TYPE_START_FRAME,
          MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME,
        )}
      />
    </AbsoluteFill>
  );
}
