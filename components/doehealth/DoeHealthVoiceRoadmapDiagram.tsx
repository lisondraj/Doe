import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";
import { suisseIntl } from "@/lib/home/fonts";

/** /doehealth — voice-first roadmap on the Built by doctors shader band. */
export function DoeHealthVoiceRoadmapDiagram({ className = "" }: { className?: string }) {
  const { focus, nextRows } = DOEHEALTH_VOICE_ROADMAP;

  return (
    <div
      className={`doehealth-voice-roadmap ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      aria-hidden
    >
      <div className="doehealth-voice-roadmap__focus-wrap">
        <div className="doehealth-voice-roadmap__focus">{focus}</div>
        <div className="doehealth-voice-roadmap__focus-stem" />
      </div>

      <div className="doehealth-voice-roadmap__rows">
        {nextRows.map((row, rowIndex) => (
          <div key={row.join("-")} className="doehealth-voice-roadmap__row">
            {rowIndex > 0 ? <div className="doehealth-voice-roadmap__row-link" /> : null}
            <div className="doehealth-voice-roadmap__row-bar" />
            <ul className="doehealth-voice-roadmap__next">
              {row.map((label) => (
                <li key={label} className="doehealth-voice-roadmap__next-item">
                  <span className="doehealth-voice-roadmap__next-drop" />
                  <span className="doehealth-voice-roadmap__next-label">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
