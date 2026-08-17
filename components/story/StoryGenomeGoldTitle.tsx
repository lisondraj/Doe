import { plusJakartaSans } from "@/lib/home/fonts";

/** Gold display title — top-left on Genome / Pulse / Fabric / Float tiles. */
export function StoryGenomeGoldTitle({
  label,
  placement,
}: {
  label: string | readonly string[];
  placement?: string;
}) {
  const lines = typeof label === "string" ? [label] : label;

  return (
    <p
      className={`story-genome-gold-title${placement ? ` story-genome-gold-title--${placement}` : ""} ${plusJakartaSans.className}`}
      aria-hidden="true"
    >
      {lines.map((line) => (
        <span key={line} className="story-genome-gold-title__line">
          {line}
        </span>
      ))}
    </p>
  );
}
