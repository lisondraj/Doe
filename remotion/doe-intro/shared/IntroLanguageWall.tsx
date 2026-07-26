import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/remotion/fonts";

const LANGUAGES = [
  "English",
  "Spanish",
  "Mandarin",
  "Vietnamese",
  "Korean",
  "Tagalog",
  "Arabic",
  "French",
  "Hindi",
  "Portuguese",
  "Russian",
  "German",
  "Japanese",
  "Italian",
  "Polish",
  "Urdu",
  "Bengali",
  "Cantonese",
  "Haitian Creole",
  "Farsi",
  "Punjabi",
  "Gujarati",
  "Somali",
  "Amharic",
  "Nepali",
  "Thai",
  "Greek",
  "Hebrew",
  "Dutch",
  "Swahili",
  "Romanian",
  "Turkish",
  "Ukrainian",
  "Tamil",
  "Telugu",
  "Malay",
  "Indonesian",
  "Czech",
  "+ more",
] as const;

export function IntroLanguageWall({ delay = 6 }: { delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 88 } });
  const drift = interpolate(Math.sin(frame / 36), [-1, 1], [-8, 8]);

  return (
    <div
      className={`motion4-lang-wall ${suisseIntl.className}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20 + drift * 0.25}px)`,
      }}
    >
      <p className="motion4-lang-wall__eyebrow">Every patient</p>
      <div className="motion4-lang-wall__grid" aria-label="Supported languages">
        {LANGUAGES.map((lang, index) => {
          const itemEnter = spring({
            frame: frame - delay - 4 - index * 1.2,
            fps,
            config: { damping: 200, stiffness: 130 },
          });
          const highlight = index % 7 === 0 || lang === "+ more";
          const pulse = highlight ? interpolate(Math.sin((frame + index * 8) / 18), [-1, 1], [0.92, 1.06]) : 1;

          return (
            <span
              key={lang}
              className={`motion4-lang-wall__chip${highlight ? " motion4-lang-wall__chip--gold" : ""}`}
              style={{
                opacity: itemEnter,
                transform: `scale(${interpolate(itemEnter, [0, 1], [0.88, 1]) * pulse})`,
              }}
            >
              {lang}
            </span>
          );
        })}
      </div>
    </div>
  );
}
