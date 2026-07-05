import { WORKFLOW_CAROUSEL_GRAIN_STYLE } from "@/lib/workflow-carousel-design-backdrops";
import {
  MAIN_PAGE_BEIGE,
  PATIENT_CARE_GREY_GRID_STYLE,
  TESTIMONIAL_MEDALLION_GRADIENT,
} from "@/lib/main-page-design-backdrop";

function TestimonialMedallionCircle() {
  return (
    <div
      className="pointer-events-none absolute z-[2] shrink-0 overflow-hidden rounded-full shadow-[0_20px_56px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06]"
      style={{
        width: "min(118vmin, 56rem)",
        height: "min(118vmin, 56rem)",
        right: "max(-18vmin, -9rem)",
        top: "50%",
        transform: "translateY(-50%)",
        background: TESTIMONIAL_MEDALLION_GRADIENT,
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={WORKFLOW_CAROUSEL_GRAIN_STYLE}
      />
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{
          marginTop: "-4%",
          width: "118%",
          height: "118%",
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {Array.from({ length: 8 }, (_, j) => {
          const angle = j * 45;
          const radius = 500;
          return (
            <path
              key={`testimonial-rad-${j}`}
              d={`M 500 500 L ${500 + Math.cos((angle * Math.PI) / 180) * radius} ${500 + Math.sin((angle * Math.PI) / 180) * radius}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="0.85"
            />
          );
        })}
        {Array.from({ length: 6 }, (_, j) => {
          const r = (j + 1) * 150;
          return (
            <circle
              key={`testimonial-ring-${j}`}
              cx="500"
              cy="500"
              r={r}
              fill="none"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="0.85"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function MainPageDesignBackdrop({
  showTestimonialMedallion = false,
}: {
  showTestimonialMedallion?: boolean;
}) {
  return (
    <main
      className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden"
      style={{ backgroundColor: MAIN_PAGE_BEIGE }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={PATIENT_CARE_GREY_GRID_STYLE}
        aria-hidden
      />
      {showTestimonialMedallion ? <TestimonialMedallionCircle /> : null}
    </main>
  );
}
