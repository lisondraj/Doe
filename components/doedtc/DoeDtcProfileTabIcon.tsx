import type { DoeDtcProfileTabIcon } from "@/lib/doedtc/doedtc-profile-tabs";

type Props = {
  icon: DoeDtcProfileTabIcon;
  className?: string;
};

export function DoeDtcProfileTabIconGlyph({ icon, className }: Props) {
  const shared = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    "aria-hidden": true as const,
    className,
  };

  switch (icon) {
    case "dashboard":
      return (
        <svg {...shared}>
          <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...shared}>
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 8.5h14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "results":
      return (
        <svg {...shared}>
          <path d="M4 15V9M10 15V5M16 15v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "conditions":
      return (
        <svg {...shared}>
          <path
            d="M10 3.5c-2.2 0-4 1.6-4 3.8 0 2.8 4 7.2 4 7.2s4-4.4 4-7.2c0-2.2-1.8-3.8-4-3.8Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="7.2" r="1.2" fill="currentColor" />
        </svg>
      );
    case "family":
      return (
        <svg {...shared}>
          <circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.5 16c.8-2 2.4-3 3.5-3s2.7 1 3.5 3M11 16c.6-1.6 1.8-2.5 3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "locker":
      return (
        <svg {...shared}>
          <rect x="4" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    case "trackers":
      return (
        <svg {...shared}>
          <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "guides":
      return (
        <svg {...shared}>
          <path d="M5 4.5h10v11H5z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5V16M12 4.5V16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "feedback":
      return (
        <svg {...shared}>
          <path
            d="M4.5 5.5h11a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 2.5V13.5h-1A1.5 1.5 0 0 1 3 12V7a1.5 1.5 0 0 1 1.5-1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
