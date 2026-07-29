import type { MotionTestFinaleDisciplineCarouselIcon } from "./constants";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function DesignIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.25" />
      <rect x="13" y="4" width="7" height="7" rx="1.25" />
      <rect x="4" y="13" width="7" height="7" rx="1.25" />
      <rect x="13" y="13" width="7" height="7" rx="1.25" />
    </svg>
  );
}

function EngineeringIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <polyline points="16 8 20 12 16 16" />
      <polyline points="8 8 4 12 8 16" />
      <line x1="11" y1="12" x2="13" y2="12" />
    </svg>
  );
}

function DistributionIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <circle cx="6" cy="12" r="2.25" />
      <circle cx="18" cy="6" r="2.25" />
      <circle cx="18" cy="18" r="2.25" />
      <path d="M8.1 11.2 15.2 7.2" />
      <path d="M8.1 12.8 15.2 16.8" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg {...iconProps} aria-hidden>
      <path d="M4 18h16" />
      <path d="M4 18V6" />
      <path d="M8 14l4-4 3 3 5-6" />
      <polyline points="16 7 21 7 21 12" />
    </svg>
  );
}

export function DisciplineCarouselIcon({
  icon,
}: {
  icon: MotionTestFinaleDisciplineCarouselIcon;
}) {
  switch (icon) {
    case "design":
      return <DesignIcon />;
    case "engineering":
      return <EngineeringIcon />;
    case "distribution":
      return <DistributionIcon />;
    case "growth":
      return <GrowthIcon />;
  }
}
