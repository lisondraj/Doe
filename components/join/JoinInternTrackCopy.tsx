"use client";

import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";

type JoinInternTrackCopyProps = {
  title: string;
  description: readonly string[];
  titleClass: string;
  descClass: string;
  variant: "mobile" | "desktop";
};

/** Scroll-triggered unblur + rise for intern track title and description (not hero). */
export function JoinInternTrackCopy({
  title,
  description,
  titleClass,
  descClass,
  variant,
}: JoinInternTrackCopyProps) {
  return (
    <JoinInternTrackReveal variant={variant} className={variant === "mobile" ? "shrink-0" : ""}>
      <h3 className={titleClass}>{title}</h3>
      <p className={descClass}>
        {description.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </JoinInternTrackReveal>
  );
}
