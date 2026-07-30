import { useMotionTestFrame } from "../motion-test-frame";

import { sfPro } from "@/remotion/fonts";

import { DisciplineCarouselIcon } from "../discipline-carousel-icons";
import {
  getMotionTestFinaleDisciplineCarouselItems,
  getMotionTestFinaleDisciplineCarouselMaskImage,
  getMotionTestFinaleDisciplineCarouselMaskWidthPx,
} from "../finale-discipline-carousel-motion";
import { MOTION_TEST_GRADIENT_TEXT_DISCIPLINE_CAROUSEL_CLASS } from "../gradient-text-style";

export function ResolveDisciplineCarousel({ fontSize }: { fontSize: number }) {
  const frame = useMotionTestFrame();
  const items = getMotionTestFinaleDisciplineCarouselItems(frame, fontSize);
  const maskWidthPx = getMotionTestFinaleDisciplineCarouselMaskWidthPx(fontSize);
  const maskImage = getMotionTestFinaleDisciplineCarouselMaskImage();

  return (
    <span className={`motion-test-discipline-carousel ${sfPro.className}`} style={{ fontSize }}>
      <span
        className="motion-test-discipline-carousel__mask"
        style={{
          width: maskWidthPx,
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        {items.map((item) => (
          <span
            key={item.index}
            className={`motion-test-discipline-carousel__item${
              item.isActive ? " motion-test-discipline-carousel__item--active" : ""
            }`}
            style={{
              transform: `translateX(${item.translateXPx}px)`,
            }}
            aria-hidden={!item.isActive}
          >
            <span
              className="motion-test-discipline-carousel__icon motion-test-discipline-carousel__icon--offset"
              style={{ opacity: item.iconOpacity }}
            >
              <DisciplineCarouselIcon icon={item.icon} />
            </span>
            <span
              className={`motion-test-discipline-carousel__label ${MOTION_TEST_GRADIENT_TEXT_DISCIPLINE_CAROUSEL_CLASS}`}
              style={{ opacity: item.labelOpacity }}
            >
              {item.label}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
