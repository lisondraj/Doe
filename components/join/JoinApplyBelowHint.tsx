import { inter } from "@/lib/home/fonts";

function JoinApplyBelowChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-[0.72em] w-[0.72em] shrink-0"}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JoinApplyBelowHint({ variant }: { variant: "mobile" | "desktop" }) {
  const sizeClass =
    variant === "mobile"
      ? "mt-[clamp(0.65rem,0.5rem+0.55vmin,0.95rem)] text-[clamp(0.78rem,0.68rem+0.42vmin,0.92rem)] iphone-page:text-[clamp(0.82rem,0.72rem+0.45vmin,0.98rem)]"
      : "mt-3 text-[0.875rem]";

  return (
    <p
      className={`${sizeClass} flex items-center justify-center gap-[0.35em] font-medium tracking-[0.04em] text-white/88 [text-shadow:0_1px_10px_rgba(0,0,0,0.18)] ${inter.className}`}
    >
      <JoinApplyBelowChevron />
      <span>Apply Below</span>
      <JoinApplyBelowChevron />
    </p>
  );
}
