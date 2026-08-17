import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_FLEET } from "@/lib/story/story-genome-visuals";

/** Multi-clinic Genome — clinic rail with one location’s workflow submodels. */
export function StoryGenomeClinicFleet() {
  return (
    <div className={`story-genome-stage story-genome-stage--fleet ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-fleet">
        <div className="story-genome-fleet__head">
          <p className={`story-genome-fleet__group m-0 ${suisseIntl.className}`}>{STORY_GENOME_FLEET.group}</p>
          <span className={`story-genome-fleet__meta ${dmSans.className}`}>{STORY_GENOME_FLEET.clinicCount}</span>
        </div>

        <ul className="story-genome-fleet__clinics m-0 list-none p-0">
          {STORY_GENOME_FLEET.clinics.map((clinic) => (
            <li
              key={clinic.id}
              className={`story-genome-fleet__clinic${clinic.selected ? " story-genome-fleet__clinic--selected" : ""}`}
            >
              {clinic.name}
            </li>
          ))}
        </ul>

        <div className="story-genome-fleet__selected">
          <span className="story-genome-fleet__selected-name">
            <i />
            {STORY_GENOME_FLEET.selected.name}
          </span>
          <span className={`story-genome-fleet__selected-model ${dmSans.className}`}>
            {STORY_GENOME_FLEET.selected.model} {STORY_GENOME_FLEET.selected.version}
          </span>
        </div>

        <ul className="story-genome-fleet__submodels m-0 list-none p-0">
          {STORY_GENOME_FLEET.selected.submodels.map((submodel) => (
            <li key={submodel.id} className="story-genome-fleet__submodel">
              <span className="story-genome-fleet__submodel-kicker">Ready</span>
              <span className={`story-genome-fleet__submodel-task ${suisseIntl.className}`}>{submodel.task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
