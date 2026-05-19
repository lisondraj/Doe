/**
 * Full-viewport placeholder shown only on desktop (md and up). Phone/tablet routes render below
 * but are visually covered. Server component — no client hooks.
 */
export function DesktopComingSoon({
  loraClassName,
  interClassName,
}: {
  loraClassName: string;
  interClassName: string;
}) {
  return (
    <div
      className="hidden md:flex fixed inset-0 z-[1000] flex-col items-center justify-center bg-[#F7F6F3] px-10 text-center"
    >
      <p
        className={`${loraClassName} font-normal leading-none tracking-tight text-neutral-900`}
        style={{ fontSize: "clamp(7rem, 18vw, 14rem)" }}
      >
        Doe
      </p>
      <p
        className={`mt-10 flex max-w-[44rem] flex-col items-center gap-0.5 text-[clamp(1.05rem,1.6vw,1.5rem)] font-medium leading-[1.22] tracking-tight text-neutral-700 ${interClassName}`}
      >
        <span className="block">We&apos;re still building our desktop site.</span>
        <span className="block">Head to your phone to learn more about Doe.</span>
      </p>
    </div>
  );
}
