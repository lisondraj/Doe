export function PitchBoxCenterLines() {
  const lineClassName = "absolute bg-[rgba(255,248,240,0.07)]";

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      <div className={`${lineClassName} left-1/4 top-0 h-full w-px -translate-x-1/2`} />
      <div className={`${lineClassName} left-3/4 top-0 h-full w-px -translate-x-1/2`} />
      <div className={`${lineClassName} left-0 top-1/4 h-px w-full -translate-y-1/2`} />
      <div className={`${lineClassName} left-0 top-3/4 h-px w-full -translate-y-1/2`} />
    </div>
  );
}
