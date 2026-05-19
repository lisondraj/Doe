/**
 * Full-viewport placeholder shown only on desktop (md and up). Phone/tablet routes render below
 * but are visually covered. Server component — no client hooks.
 */
export function DesktopComingSoon({ loraClassName }: { loraClassName: string }) {
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
      <div
        className="mt-10 max-w-[44rem] font-medium tracking-tight text-neutral-700"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "clamp(1.05rem, 1.6vw, 1.5rem)",
          lineHeight: 1.4,
        }}
      >
        <p>We&apos;re still building our desktop site.</p>
        <p>Head to your phone to learn more about Doe.</p>
      </div>
    </div>
  );
}
