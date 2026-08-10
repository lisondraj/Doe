/** Shared SVG icons for bottom floating chrome (blog nav + TOC + audio). */

export function ListenIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="10" cy="10" r="6.65" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M8.3 7.05c0-.54.62-.26.98-.05l3.97 2.27c.36.21.36.73 0 .94l-3.97 2.27c-.36.21-.98-.08-.98-.62V7.05Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BlogNavIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="3.25" y="4.25" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="11.65" y="4.25" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="3.25" y="11.65" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
      <rect x="11.65" y="11.65" width="5.1" height="5.1" rx="1.05" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export function TocIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6.75 6.25h9.5M6.75 10h9.5M6.75 13.75H13"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <circle cx="4.65" cy="6.25" r="0.85" fill="currentColor" />
      <circle cx="4.65" cy="10" r="0.85" fill="currentColor" />
      <circle cx="4.65" cy="13.75" r="0.85" fill="currentColor" />
    </svg>
  );
}

export function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="block shrink-0"
    >
      <path d="M9.75 7.5 22.75 16 9.75 24.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="block shrink-0"
    >
      <rect x="9.75" y="7.5" width="4" height="17" rx="0.85" fill="currentColor" />
      <rect x="18.25" y="7.5" width="4" height="17" rx="0.85" fill="currentColor" />
    </svg>
  );
}

export function SkipBack10Icon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
      <path
        d="M11.5 5.2 6.8 9.9l4.7 4.7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.8 9.9h7.9a4.2 4.2 0 1 1 0 8.4H12.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SkipForward10Icon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
      <path
        d="M10.5 5.2 15.2 9.9l-4.7 4.7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 9.9H7.3a4.2 4.2 0 1 0 0 8.4h2.3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
