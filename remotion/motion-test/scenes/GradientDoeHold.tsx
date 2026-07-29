import { AbsoluteFill } from "remotion";

type GradientDoeHoldProps = {
  fontSize: number;
  transform: string;
};

export function GradientDoeHold({ fontSize, transform }: GradientDoeHoldProps) {
  return (
    <AbsoluteFill className="motion-test-doe-stack">
      <div className="motion-test-doe-stack__motion" style={{ transform }}>
        <span
          className="motion-test-title__label motion-test-title__label--doe motion-test-doe-stack__layer"
          style={{
            fontSize,
            opacity: 1,
            transform: "translate(-50%, -50%)",
            color: "#ffffff",
          }}
        >
          Doe
        </span>
      </div>
    </AbsoluteFill>
  );
}
