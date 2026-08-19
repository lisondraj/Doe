/** Inline link arrow — matches doe.care main home hero read-more (`DoePhoneHeroSection`). */
export function DoeLinkArrow({
  className,
  width,
  height,
  stroke = "currentColor",
}: {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 6h7M6.75 3.25 9.5 6 6.75 8.75"
        stroke={stroke}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
