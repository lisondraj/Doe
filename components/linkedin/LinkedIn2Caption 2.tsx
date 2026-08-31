import {
  LINKEDIN2_BYLINE,
  LINKEDIN2_DATE,
  LINKEDIN2_SUBTITLE_LINES,
  LINKEDIN2_TITLE,
} from "@/lib/linkedin/linkedin2-copy";
import { dmSans, inter, lora } from "@/lib/home/fonts";

/** /linkedin2 capture copy — Lora title, Inter subtitle, deep brown on off-white. */
export function LinkedIn2Caption() {
  return (
    <div className="linkedin2-caption">
      <h1 className={`linkedin2-caption__title ${lora.className}`}>{LINKEDIN2_TITLE}</h1>

      <p className={`linkedin2-caption__subtitle ${inter.className}`}>
        {LINKEDIN2_SUBTITLE_LINES.map((line) => (
          <span key={line} className="linkedin2-caption__subtitle-line">
            {line}
          </span>
        ))}
      </p>

      <p className={`linkedin2-caption__byline ${dmSans.className}`}>
        {LINKEDIN2_BYLINE}
        <span className="mx-[0.45em] text-[0.72em]" aria-hidden>
          ·
        </span>
        <span className="linkedin2-caption__date">{LINKEDIN2_DATE}</span>
      </p>
    </div>
  );
}
