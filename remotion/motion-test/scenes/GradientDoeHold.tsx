import { AbsoluteFill } from "remotion";

import { MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS } from "../gradient-text-style";

type GradientDoeHoldProps = {
  fontSize: number;
  transform: string;
};

export function GradientDoeHold({ fontSize, transform }: GradientDoeHoldProps) {
  return (
    <AbsoluteFill className="motion-test-doe-stack">
      <div className="motion-test-doe-stack__motion" style={{ transform }}>
        <span
          className={`motion-test-title__label motion-test-title__label--doe motion-test-doe-stack__layer ${MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS}`}
          style={{
            fontSize,
            opacity: 1,
            transform: "translate(-50%, -50%)",
          }}
        >
          Doe
        </span>
      </div>
    </AbsoluteFill>
  );
}
