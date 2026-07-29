import { AbsoluteFill } from "remotion";

import { dmSans } from "@/remotion/fonts";

import { getMotionTestFinaleAudienceCarouselRowTiltDeg } from "../finale-audience-carousel-arc";
import {
  getMotionTestFinaleAudienceCarouselClipPath,
  getMotionTestFinaleAudienceCarouselLayout,
  getMotionTestFinaleAudienceCarouselWords,
} from "../finale-audience-carousel-motion";
import { getMotionTestGradientTextStyle } from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

function CarouselWord({
  word,
  fontSize,
  xPx,
  yPx,
  scale,
  opacity,
  circleRadius,
  circleCenterY,
}: {
  word: string;
  fontSize: number;
  xPx: number;
  yPx: number;
  scale: number;
  opacity: number;
  circleRadius: number;
  circleCenterY: number;
}) {
  const gradientTextStyle = getMotionTestGradientTextStyle();
  const rowTiltDeg = getMotionTestFinaleAudienceCarouselRowTiltDeg(
    yPx,
    circleRadius,
    circleCenterY,
  );

  return (
    <span
      className={`motion-test-audience-carousel__word motion-test-finale-type__phrase-word--isolate motion-test-title__label--gradient ${dmSans.className}`}
      style={{
        ...gradientTextStyle,
        fontSize,
        left: xPx,
        top: yPx,
        opacity,
        transform: `translateY(-50%) scale(${scale}) rotate(${rowTiltDeg}deg)`,
      }}
    >
      {word}
    </span>
  );
}

export function IntelligenceAudienceCarousel() {
  const frame = useMotionTestFrame();
  const words = getMotionTestFinaleAudienceCarouselWords(frame);

  if (!words) {
    return null;
  }

  const layout = getMotionTestFinaleAudienceCarouselLayout(frame);
  const clipPath = getMotionTestFinaleAudienceCarouselClipPath(frame);

  return (
    <AbsoluteFill
      className="motion-test-audience-carousel"
      style={{ clipPath }}
      aria-hidden
    >
      {words.map((entry) => (
        <CarouselWord
          key={entry.index}
          word={entry.word}
          fontSize={layout.fontSize}
          xPx={entry.xPx}
          yPx={entry.yPx}
          scale={entry.scale}
          opacity={entry.opacity}
          circleRadius={layout.circleRadius}
          circleCenterY={layout.circleCenterY}
        />
      ))}
    </AbsoluteFill>
  );
}
