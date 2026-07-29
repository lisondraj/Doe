import { useMotionTestFrame } from "../motion-test-frame";

import {
  MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD,
  MOTION_TEST_FINALE_INTELLIGENCE_RESOLVE_PHRASE,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT,
  MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
  MOTION_TEST_FINALE_RESOLVE_LINE1_WORDS,
  MOTION_TEST_FINALE_RESOLVE_LINE2_WORDS,
} from "../constants";
import {
  getMotionTestFinaleIntelligenceFlippedStackPanY,
} from "../finale-intelligence-stack-motion";
import { getMotionTestFinaleIntelligenceFlippedMotion } from "../finale-phrase-motion";
import { getMotionTestFinaleIntelligenceFlippedZoom } from "../finale-intelligence-flipped-zoom-motion";
import { getMotionTestFinaleResolveSegmentState } from "../finale-resolve-segment-motion";
import {
  getMotionTestFinaleResolveThreeLinePanMotion,
  isMotionTestFinaleResolveColorSwitched,
  isMotionTestFinaleResolvePanPhase,
} from "../finale-resolve-three-line-motion";
import { getMotionTestFinaleAgentBuilderMotion } from "../finale-agent-builder-motion";
import {
  getMotionTestGradientTextVisualStyle,
} from "../gradient-text-style";
import { ResolveDisciplineCarousel } from "./ResolveDisciplineCarousel";

const centerWordClassName =
  "motion-test-intelligence-stack__center motion-test-finale-type__phrase-word motion-test-finale-type__phrase-word--isolate motion-test-finale-type__phrase-word--flipped";

const resolveLine2Phrase = MOTION_TEST_FINALE_RESOLVE_LINE2_WORDS.join(" ");

function ResolveDualColorText({
  text,
  showInverted,
}: {
  text: string;
  showInverted: boolean;
}) {
  const layerBaseClass =
    "motion-test-finale-type__full-phrase-text motion-test-finale-type__full-phrase-layer";

  return (
    <span className="motion-test-finale-type__full-phrase-stack">
      <span
        className="motion-test-finale-type__full-phrase-text motion-test-finale-type__full-phrase-sizer"
        aria-hidden
      >
        {MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD}
      </span>
      <span
        className={`${layerBaseClass} motion-test-finale-type__full-phrase-layer--gradient`}
        style={{
          ...getMotionTestGradientTextVisualStyle(),
          opacity: showInverted ? 0 : 1,
        }}
        aria-hidden={showInverted}
      >
        {text}
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
        {text}
      </span>
    </span>
  );
}

function ResolveWords({
  words,
  visibleWordCount,
}: {
  words: readonly string[];
  visibleWordCount: number;
}) {
  return (
    <>
      {words.map((word, index) => {
        if (index >= visibleWordCount) {
          return null;
        }

        return (
          <span key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <span className="motion-test-intelligence-flipped-resolve__word">{word}</span>
          </span>
        );
      })}
    </>
  );
}

function ResolveStackRow({
  yPx,
  textOffsetX,
  fontSize,
  children,
  opacity = 1,
}: {
  yPx: number;
  textOffsetX: number;
  fontSize: number;
  children: React.ReactNode;
  opacity?: number;
}) {
  return (
    <div
      className="motion-test-intelligence-flipped-stack__row"
      style={{
        fontSize,
        opacity,
        transform: `translate(calc(-50% + ${textOffsetX}px), calc(-50% + ${yPx}px))`,
      }}
    >
      <span className="motion-test-intelligence-stack-anchor">
        <span
          className={centerWordClassName}
          style={{
            color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
            fontSize,
          }}
        >
          <span className="motion-test-intelligence-flipped-resolve__stack">
            <span className="motion-test-intelligence-flipped-resolve__sizer" aria-hidden>
              {MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD}
            </span>
            <span className="motion-test-intelligence-flipped-resolve__layer">{children}</span>
          </span>
        </span>
      </span>
    </div>
  );
}

export function IntelligenceResolveBlock() {
  const frame = useMotionTestFrame();
  const { fontSize: baseFontSize } = getMotionTestFinaleIntelligenceFlippedMotion();
  const resolveLayoutFrame = MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME - 1;
  const { textOffsetX, textFontSize } = getMotionTestFinaleIntelligenceFlippedZoom(
    resolveLayoutFrame,
    baseFontSize,
  );
  const resolveStackPanY =
    getMotionTestFinaleIntelligenceFlippedStackPanY(resolveLayoutFrame);
  const lineStep = textFontSize * MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT;
  const isPanPhase = isMotionTestFinaleResolvePanPhase(frame);
  const useInvertedColors = isMotionTestFinaleResolveColorSwitched(frame);
  const { resolveTranslateXPx, resolveVisible } = getMotionTestFinaleAgentBuilderMotion(frame);

  if (isPanPhase) {
    const { line1Y, line2Y, line3Y, line3Opacity } =
      getMotionTestFinaleResolveThreeLinePanMotion(frame, resolveStackPanY, lineStep);

    if (!resolveVisible) {
      return null;
    }

    return (
      <div
        className="motion-test-finale-type__stack"
        style={{ transform: `translateX(${resolveTranslateXPx}px)` }}
      >
        <div className="motion-test-finale-type__lines">
          <ResolveStackRow
            yPx={line1Y}
            textOffsetX={textOffsetX}
            fontSize={textFontSize}
          >
            <ResolveDualColorText
              text={MOTION_TEST_FINALE_INTELLIGENCE_RESOLVE_PHRASE}
              showInverted={useInvertedColors}
            />
          </ResolveStackRow>
          <ResolveStackRow
            yPx={line2Y}
            textOffsetX={textOffsetX}
            fontSize={textFontSize}
          >
            <ResolveDualColorText
              text={resolveLine2Phrase}
              showInverted={useInvertedColors}
            />
          </ResolveStackRow>
          <ResolveStackRow
            yPx={line3Y}
            textOffsetX={textOffsetX}
            fontSize={textFontSize}
            opacity={line3Opacity}
          >
            <ResolveDisciplineCarousel fontSize={textFontSize} />
          </ResolveStackRow>
        </div>
      </div>
    );
  }

  const line1Y = resolveStackPanY;
  const line2Y = resolveStackPanY + lineStep;
  const { line1WordCount, line2WordCount } =
    getMotionTestFinaleResolveSegmentState(frame);

  return (
    <div className="motion-test-finale-type__stack">
      <div className="motion-test-finale-type__lines">
        <ResolveStackRow
          yPx={line1Y}
          textOffsetX={textOffsetX}
          fontSize={textFontSize}
        >
          <ResolveWords
            words={MOTION_TEST_FINALE_RESOLVE_LINE1_WORDS}
            visibleWordCount={line1WordCount}
          />
        </ResolveStackRow>
        {line2WordCount > 0 ? (
          <ResolveStackRow
            yPx={line2Y}
            textOffsetX={textOffsetX}
            fontSize={textFontSize}
          >
            <ResolveWords
              words={MOTION_TEST_FINALE_RESOLVE_LINE2_WORDS}
              visibleWordCount={line2WordCount}
            />
          </ResolveStackRow>
        ) : null}
      </div>
    </div>
  );
}
