import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_SEALS } from "@/lib/story/story-genome-visuals";

/** Wide Genome tile — each clinic’s own Genome, Harbor at v2.1. */
export function StoryGenomeClinicFleet() {
  return (
    <div className={`story-genome-stage story-genome-stage--seals ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-seals">
        {STORY_GENOME_SEALS.clinics.map((clinic) => (
          <div
            key={clinic.id}
            className={`story-genome-card story-genome-seal${clinic.selected ? " story-genome-seal--live" : ""}`}
          >
            <span className="story-genome-seal__mark">
              <em className={suisseIntl.className}>{clinic.initials}</em>
            </span>
            <span className="story-genome-seal__kicker">Genome</span>
            <p className={`story-genome-seal__name m-0 ${suisseIntl.className}`}>{clinic.name}</p>
            <span className={`story-genome-seal__specialty ${dmSans.className}`}>{clinic.version}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
