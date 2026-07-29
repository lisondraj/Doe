import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

import {
  MOTION_TEST_FINALE_INTELLIGENCE_BORDER_COLOR,
  MOTION_TEST_FINALE_INTELLIGENCE_BORDER_DRAW_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_ISOLATE_START_FRAME,
} from "../constants";

/** Thin light-grey stroke around “intelligence”. */
const BORDER_STROKE_EM = 0.022;

/** Equal clearance between glyph box and border on all sides. */
const BORDER_PAD_EM = 0.18;

type BoxSize = {
  width: number;
  height: number;
};

function buildIntelligenceBorderGeometry(
  width: number,
  height: number,
  fontSize: number,
): string {
  const stroke = fontSize * BORDER_STROKE_EM;
  const inset = stroke / 2;
  const radius = Math.min(fontSize * 0.14, width * 0.14, height * 0.34);

  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;
  const topCenterX = width / 2;
  const cornerX = right - radius;

  return [
    `M ${topCenterX} ${top}`,
    `L ${cornerX} ${top}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
    `L ${right} ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${cornerX} ${bottom}`,
    `L ${left + radius} ${bottom}`,
    `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
    `L ${left} ${top + radius}`,
    `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
    `L ${topCenterX} ${top}`,
    "Z",
  ].join(" ");
}

export function getMotionTestIntelligenceBorderProgress(frame: number): number {
  const borderFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_ISOLATE_START_FRAME;

  return interpolate(
    borderFrame,
    [0, MOTION_TEST_FINALE_INTELLIGENCE_BORDER_DRAW_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
}

type IntelligenceBorderProps = {
  fontSize: number;
};

export function IntelligenceBorder({ fontSize }: IntelligenceBorderProps) {
  const frame = useCurrentFrame();
  const progress = getMotionTestIntelligenceBorderProgress(frame);
  const strokeWidth = fontSize * BORDER_STROKE_EM;
  const pad = fontSize * BORDER_PAD_EM;
  const svgRef = useRef<SVGSVGElement>(null);
  const [textSize, setTextSize] = useState<BoxSize>(() => ({
    width: fontSize * 5.8,
    height: fontSize * 1.38,
  }));

  useLayoutEffect(() => {
    const wrap = svgRef.current?.parentElement;

    if (!wrap) return;

    const updateSize = () => {
      const word = wrap.querySelector(".motion-test-finale-type__phrase-word");

      if (word) {
        const rect = word.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTextSize({ width: rect.width, height: rect.height });
          return;
        }
      }

      if (wrap.clientWidth > 0 && wrap.clientHeight > 0) {
        setTextSize({ width: wrap.clientWidth, height: wrap.clientHeight });
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(wrap);
    const word = wrap.querySelector(".motion-test-finale-type__phrase-word");
    if (word) observer.observe(word);

    return () => observer.disconnect();
  }, [fontSize]);

  const boxSize = useMemo(
    () => ({
      width: textSize.width + pad * 2,
      height: textSize.height + pad * 2,
    }),
    [pad, textSize.height, textSize.width],
  );

  const path = useMemo(
    () => buildIntelligenceBorderGeometry(boxSize.width, boxSize.height, fontSize),
    [boxSize, fontSize],
  );

  const drawComplete = progress >= 1;

  return (
    <svg
      ref={svgRef}
      className="motion-test-intelligence-border"
      viewBox={`0 0 ${boxSize.width} ${boxSize.height}`}
      style={{
        left: -pad,
        top: -pad,
        width: boxSize.width,
        height: boxSize.height,
      }}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={MOTION_TEST_FINALE_INTELLIGENCE_BORDER_COLOR}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={drawComplete ? undefined : 1}
        strokeDashoffset={drawComplete ? undefined : 1 - progress}
      />
    </svg>
  );
}
