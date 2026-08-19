import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_SUNDAY } from "@/lib/story/story-genome-visuals";

const SUNDAY_MARKS = [
  { x: 16, y: 58 },
  { x: 32, y: 38 },
  { x: 52, y: 24 },
  { x: 80, y: 18 },
  { x: 108, y: 24 },
  { x: 128, y: 38 },
  { x: 144, y: 58 },
] as const;

/** Square Genome tile — Sunday trains the next Genome from last week’s work. */
export function StoryGenomeWeeklyTrain() {
  return (
    <div className={`story-genome-stage story-genome-stage--sunday ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-sunday">
        <div className="story-genome-sunday__when">
          <span className={`story-genome-sunday__day ${suisseIntl.className}`}>{STORY_GENOME_SUNDAY.day}</span>
          <span className={`story-genome-sunday__time ${dmSans.className}`}>{STORY_GENOME_SUNDAY.time}</span>
        </div>

        <svg className="story-genome-sunday__arc" viewBox="0 0 160 78" aria-hidden="true">
          <defs>
            <linearGradient id="story-genome-sunday-stroke" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#bf593d" />
              <stop offset="48%" stopColor="#e8c08e" />
              <stop offset="100%" stopColor="#f0d4a2" />
            </linearGradient>
            <linearGradient id="story-genome-sunday-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0d4a2" />
              <stop offset="100%" stopColor="#bf593d" />
            </linearGradient>
            <linearGradient id="story-genome-sunday-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8c08e" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#bf593d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M16 58 C 32 18, 52 6, 80 6 C 108 6, 128 18, 144 58 L 144 78 L 16 78 Z"
            fill="url(#story-genome-sunday-wash)"
          />
          <path
            d="M16 58 C 32 18, 52 6, 80 6 C 108 6, 128 18, 144 58"
            fill="none"
            stroke="url(#story-genome-sunday-stroke)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {SUNDAY_MARKS.map((mark, index) => {
            const close = index === SUNDAY_MARKS.length - 1;
            const radius = close ? 8.2 : 2.2 + index * 0.45;
            return (
              <circle
                key={STORY_GENOME_SUNDAY.marks[index].id}
                cx={mark.x}
                cy={mark.y}
                r={radius}
                fill="url(#story-genome-sunday-fill)"
                opacity={close ? 1 : 0.42 + index * 0.08}
              />
            );
          })}
        </svg>

        <p className={`story-genome-sunday__count m-0 ${dmSans.className}`}>{STORY_GENOME_SUNDAY.count}</p>
        <span className={`story-genome-sunday__from ${dmSans.className}`}>from {STORY_GENOME_SUNDAY.from}</span>
        <span className="story-genome-sunday__label">{STORY_GENOME_SUNDAY.countLabel}</span>
      </div>
    </div>
  );
}
