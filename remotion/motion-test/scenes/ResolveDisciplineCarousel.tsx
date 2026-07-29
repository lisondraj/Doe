import { useMotionTestFrame } from "../motion-test-frame";

import { dmSans } from "@/remotion/fonts";

import { DisciplineCarouselIcon } from "../discipline-carousel-icons";
import {
  getMotionTestFinaleDisciplineCarouselItems,
  getMotionTestFinaleDisciplineCarouselMaskWidthPx,
} from "../finale-discipline-carousel-motion";
import { getMotionTestGradientTextVisualStyle } from "../gradient-text-style";

export function ResolveDisciplineCarousel({ fontSize }: { fontSize: number }) {
  const frame = useMotionTestFrame();
  const gradientTextStyle = getMotionTestGradientTextVisualStyle();
  const items = getMotionTestFinaleDisciplineCarouselItems(frame, fontSize);
  const maskWidthPx = getMotionTestFinaleDisciplineCarouselMaskWidthPx(fontSize);

  return (
    <span
      className={`motion-test-discipline-carousel ${dmSans.className}`}
      style={{ fontSize }}
    >
      <span
        className="motion-test-discipline-carousel__mask"
        style={{ width: maskWidthPx }}
      >
        {items.map((item) => (
          <span
            key={item.index}
            className={`motion-test-discipline-carousel__item${
              item.isActive ? " motion-test-discipline-carousel__item--active" : ""
            }`}
            style={{
              opacity: item.opacity,
              transform: `translateX(${item.translateXPx}px)`,
            }}
          >
            <span className="motion-test-discipline-carousel__icon">
              <DisciplineCarouselIcon icon={item.icon} />
            </span>
            <span
              className="motion-test-discipline-carousel__label motion-test-title__label--gradient"
              style={gradientTextStyle}
            >
              {item.label}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
