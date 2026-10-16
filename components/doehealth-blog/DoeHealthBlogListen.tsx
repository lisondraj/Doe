/** Heights (%) of the static audio lines. They only decorate the bar until audio is wired up. */
const AUDIO_LINE_HEIGHTS = [35, 60, 45, 80, 55, 30, 70, 90, 50, 65, 40, 75, 55, 85, 45, 60, 30, 70, 50, 40, 65, 35];

/**
 * The listen bar under the article hero: a play button, audio lines, and a language pill.
 * Built from the same pill bar and pills as the news picker. Visual only for now: nothing is wired up yet.
 */
export function DoeHealthBlogListen() {
  return (
    <section className="doehealth-blog-listen" aria-label="Listen to this article">
      <button type="button" className="doehealth-blog-listen__play" aria-label="Play audio">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M5 3.5v9l7-4.5-7-4.5z" />
        </svg>
      </button>

      <span className="doehealth-blog-listen__lines" aria-hidden>
        {AUDIO_LINE_HEIGHTS.map((height, index) => (
          <span key={`line-${index}`} style={{ height: `${height}%` }} />
        ))}
      </span>

      <button type="button" className="doehealth-blog-listen__lang" aria-label="Change language">
        <span>English</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
