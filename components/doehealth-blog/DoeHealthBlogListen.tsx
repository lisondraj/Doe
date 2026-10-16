/**
 * The box under the article hero for listening to the article as audio and picking a language.
 * Visual only for now: the play and language controls are not wired up yet.
 */
export function DoeHealthBlogListen() {
  return (
    <section className="doehealth-blog-listen" aria-label="Listen to this article">
      <div className="doehealth-blog-listen__audio">
        <button type="button" className="doehealth-blog-listen__play" aria-label="Play audio">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M5 3.5v9l7-4.5-7-4.5z" />
          </svg>
        </button>
        <span className="doehealth-blog-listen__copy">
          <span className="doehealth-blog-listen__label">Listen to this article</span>
          <span className="doehealth-blog-listen__sub">Audio version</span>
        </span>
      </div>

      <button type="button" className="doehealth-blog-listen__lang" aria-label="Change language">
        <span className="doehealth-blog-listen__lang-value">English</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
