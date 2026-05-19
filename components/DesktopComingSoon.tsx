/**
 * Full-viewport placeholder on wide-desktop only (1280px+ with fine pointer).
 * Phone routes render below but are visually covered on real desktops. Server component.
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
      className="hidden wide-desktop:flex fixed inset-0 z-[1000] flex-col items-center justify-center bg-[#F7F6F3] px-10 text-center"
    >
      <p
        className={`${loraClassName} font-normal leading-none tracking-tight text-neutral-900`}
        style={{ fontSize: "clamp(7rem, 18vw, 14rem)" }}
      >
        Doe
      </p>
      <p
        className={`mt-10 flex max-w-[52rem] flex-col items-center gap-1 text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium leading-[1.22] tracking-tight text-neutral-700 ${interClassName}`}
      >
        <span className="block">We&apos;re still building our desktop site.</span>
        <span className="block">Head to your phone to learn more about Doe.</span>
      </p>
    </div>
  );
}
