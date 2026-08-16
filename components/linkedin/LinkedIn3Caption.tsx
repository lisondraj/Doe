import {
  LINKEDIN3_BYLINE,
  LINKEDIN3_DATE,
  LINKEDIN3_SUBTITLE_LINES,
  LINKEDIN3_TITLE,
} from "@/lib/linkedin/linkedin3-copy";
import { dmSans, inter, lora } from "@/lib/home/fonts";

/** /linkedin3 capture copy — Lora title, Inter subtitle, deep brown on off-white. */
export function LinkedIn3Caption() {
  return (
    <div className="linkedin2-caption">
      <h1 className={`linkedin2-caption__title ${lora.className}`}>{LINKEDIN3_TITLE}</h1>

      <p className={`linkedin2-caption__subtitle ${inter.className}`}>
        {LINKEDIN3_SUBTITLE_LINES.map((line) => (
          <span key={line} className="linkedin2-caption__subtitle-line">
            {line}
          </span>
        ))}
      </p>

      <p className={`linkedin2-caption__byline ${dmSans.className}`}>
        {LINKEDIN3_BYLINE}
        <span className="mx-[0.45em] text-[0.72em]" aria-hidden>
          ·
        </span>
        <span className="linkedin2-caption__date">{LINKEDIN3_DATE}</span>
      </p>
    </div>
  );
}
