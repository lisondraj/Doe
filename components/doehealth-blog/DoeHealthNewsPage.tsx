"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CareersFilterDropdown, type CareersDropdownSection } from "@/components/doehealth-careers/CareersFilterDropdown";
import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  type DoeHealthBlogArticle as Article,
  type DoeHealthBlogPlaceholderTone,
  doehealthBlogArticlePath,
} from "@/lib/doehealth/doehealth-blog-articles";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its nav links, logo, and section anchors all live here. */
const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";

/** This article takes a full-width row directly under the first pair of cards. */
const WIDE_ROW_SLUG = "health-intelligence-for-one-price";

/** The featured and wide cards keep their info inside the box, with a lower dot wave to leave room for it. */
const FEATURED_WAVE_TOP = 0.7;

/** One box's colours: the box fill, its dot wave, and the copy ink (a dark shade of the same hue, as R G B). */
type NewsBoxColors = { bg: string; dot: string; ink: string };

/**
 * Box colours on /news only. Each fill is a light hue that sits clearly off the cream page, and each ink is a dark
 * shade of that same hue, so the copy reads on the box. The article page keeps the shared palette.
 */
const NEWS_CARD_PALETTE: Record<DoeHealthBlogPlaceholderTone, NewsBoxColors> = {
  sand: { bg: "#EDD59C", dot: "#BE9552", ink: "92 69 32" },
  panel: { bg: "#DCE3D0", dot: "#8E9A7E", ink: "63 74 54" },
  cream: { bg: "#F0D2CA", dot: "#CC8E88", ink: "107 58 63" },
  gold: { bg: "#F3E08E", dot: "#B8922A", ink: "94 74 14" },
  clay: { bg: "#F2BEA3", dot: "#D27E5C", ink: "107 52 24" },
  umber: { bg: "#E0CDB4", dot: "#94785C", ink: "75 56 38" },
};

/** The copy inside a box takes the box's ink, through the same variable the card copy already reads. */
function boxInkStyle(tone: DoeHealthBlogPlaceholderTone): CSSProperties {
  return { "--feature-ink-rgb": NEWS_CARD_PALETTE[tone].ink } as CSSProperties;
}

/** Desktop small boxes: the wave starts below the description so the dots never sit behind the copy. */
const BOXED_WAVE_TOP = 0.8;

/** The whole card is one link to the post: image, info, title, and excerpt. */
function NewsCard({
  article,
  featured = false,
  wide = false,
  boxed = false,
}: {
  article: Article;
  featured?: boolean;
  wide?: boolean;
  /** Desktop small cards: the info sits centred inside the box, like the featured card. */
  boxed?: boolean;
}) {
  const modifier = featured ? " doehealth-news__item--featured" : wide ? " doehealth-news__item--wide" : "";
  if (boxed && !featured && !wide) {
    return (
      <li className={`doehealth-news__item${modifier}`}>
        <Link href={doehealthBlogArticlePath(article.slug)} className="doehealth-blog-card doehealth-news-card doehealth-news-card--boxed">
          <DoeHealthBlogPlaceholder
            tone={article.heroTone}
            className="doehealth-blog-card__art doehealth-news-card__art"
            pattern
            wave={{ ...article.wave, top: BOXED_WAVE_TOP }}
            palette={NEWS_CARD_PALETTE}
          >
            <div className="doehealth-news-feature__copy doehealth-news-card__copy" style={boxInkStyle(article.heroTone)}>
              <h2 className={`doehealth-blog-card__title ${p22Mackinac.className}`}>
                {article.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="doehealth-blog-card__meta">
                <span>{article.date}</span>
                <span aria-hidden>·</span>
                <span>{article.author}</span>
              </p>
              <p className="doehealth-blog-card__excerpt">{article.excerpt}</p>
            </div>
          </DoeHealthBlogPlaceholder>
        </Link>
      </li>
    );
  }
  if (featured || wide) {
    return (
      <li className={`doehealth-news__item${modifier}`}>
        <Link href={doehealthBlogArticlePath(article.slug)} className="doehealth-blog-card doehealth-news-card doehealth-news-card--feature">
          <DoeHealthBlogPlaceholder
            tone={article.heroTone}
            className="doehealth-blog-card__art doehealth-news-feature__art"
            pattern
            wave={{ ...article.wave, top: FEATURED_WAVE_TOP }}
            palette={NEWS_CARD_PALETTE}
          >
            <div className="doehealth-news-feature__copy" style={boxInkStyle(article.heroTone)}>
              <h2 className={`doehealth-blog-card__title ${p22Mackinac.className}`}>
                {article.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="doehealth-blog-card__meta">
                <span>{article.date}</span>
                <span aria-hidden>·</span>
                <span>{article.author}</span>
              </p>
              <p className="doehealth-blog-card__excerpt">{article.excerpt}</p>
            </div>
          </DoeHealthBlogPlaceholder>
        </Link>
      </li>
    );
  }
  return (
    <li className={`doehealth-news__item${modifier}`}>
      <Link href={doehealthBlogArticlePath(article.slug)} className="doehealth-blog-card doehealth-news-card">
        <h2 className={`doehealth-blog-card__title ${p22Mackinac.className}`}>
          {article.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="doehealth-blog-card__meta">
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.author}</span>
        </p>
        <p className="doehealth-blog-card__excerpt">{article.excerpt}</p>
        <DoeHealthBlogPlaceholder
          tone={article.heroTone}
          className="doehealth-blog-card__art"
          pattern
          wave={article.wave}
          palette={NEWS_CARD_PALETTE}
        />
      </Link>
    </li>
  );
}

/** Phone: each run of side-by-side cards becomes one swipe row; the wide card stays full width on its own. */
function groupForPhone(cards: readonly Article[]): Article[][] {
  const groups: Article[][] = [];
  for (const article of cards) {
    const last = groups[groups.length - 1];
    if (article.slug === WIDE_ROW_SLUG || !last || last[0].slug === WIDE_ROW_SLUG) {
      groups.push([article]);
    } else {
      last.push(article);
    }
  }
  return groups;
}

function CarouselArrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Phone: two cards in a horizontal swipe row with < > buttons, styled like the carousel at the bottom of an article. */
function NewsRow({ articles }: { articles: readonly Article[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const max = scroll.scrollWidth - scroll.clientWidth;
    setCanPrev(scroll.scrollLeft > 2);
    // Within the trailing padding of the last card counts as the end.
    setCanNext(scroll.scrollLeft < max - 24);
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return undefined;
    sync();
    scroll.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(scroll);
    return () => {
      scroll.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const scroll = scrollRef.current;
    const slide = scroll?.querySelector<HTMLElement>(".doehealth-news-carousel__track > .doehealth-news__item");
    if (!scroll || !slide) return;
    const gap = Number.parseFloat(getComputedStyle(slide.parentElement!).columnGap) || 0;
    scroll.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <li className="doehealth-news__row">
      <div className="doehealth-news-carousel__head">
        <div className="desk-agent-carousel__nav">
          <button type="button" aria-label="Previous article" disabled={!canPrev} onClick={() => step(-1)}>
            <CarouselArrow flip />
          </button>
          <button type="button" aria-label="Next article" disabled={!canNext} onClick={() => step(1)}>
            <CarouselArrow />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="doehealth-news-carousel__scroll">
        <ul className="doehealth-news-carousel__track">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </ul>
      </div>
    </li>
  );
}

const ALL = "all";
type SortOrder = "newest" | "oldest";

const SORT_SECTIONS: readonly CareersDropdownSection[] = [
  {
    options: [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
    ],
  },
];

/** The distinct values of one article field, in first-seen order, for the filter menus. */
function uniqueValues(articles: readonly Article[], pick: (article: Article) => string): string[] {
  return Array.from(new Set(articles.map(pick)));
}

/** /news — the index of every article: the featured one large, the rest side by side, on the desk2 chrome. */
export function DoeHealthNewsPage({
  articles,
  initialVariant,
}: {
  articles: readonly Article[];
  initialVariant: DoeHealthDesk2Variant;
}) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  const [category, setCategory] = useState<string>(ALL);
  const [author, setAuthor] = useState<string>(ALL);
  const [sort, setSort] = useState<SortOrder>("newest");

  const categorySections = useMemo<readonly CareersDropdownSection[]>(
    () => [
      {
        options: [
          { value: ALL, label: "All categories" },
          ...uniqueValues(articles, (article) => article.eyebrow).map((name) => ({ value: name, label: name })),
        ],
      },
    ],
    [articles],
  );
  const authorSections = useMemo<readonly CareersDropdownSection[]>(
    () => [
      {
        options: [
          { value: ALL, label: "All authors" },
          ...uniqueValues(articles, (article) => article.author).map((name) => ({ value: name, label: name })),
        ],
      },
    ],
    [articles],
  );

  /** The filtered, sorted list. The first article is always the featured one. */
  const visible = useMemo(() => {
    const matching = articles.filter(
      (article) => (category === ALL || article.eyebrow === category) && (author === ALL || article.author === author),
    );
    const time = (article: Article) => Date.parse(article.date);
    return [...matching].sort((a, b) => (sort === "newest" ? time(b) - time(a) : time(a) - time(b)));
  }, [articles, category, author, sort]);

  const [featured, ...rest] = visible;
  const wideArticle = rest.find((article) => article.slug === WIDE_ROW_SLUG);
  const pairs = rest.filter((article) => article !== wideArticle);
  const cards = wideArticle ? [...pairs.slice(0, 2), wideArticle, ...pairs.slice(2)] : pairs;

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-blog-page doehealth-news-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="News">
        <section className={`doehealth-news ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <header className="doehealth-news__head">
            <h1 className={`doehealth-news__title ${p22Mackinac.className}`}>News</h1>
          </header>

          <div className="doehealth-news__filters">
            <div className="doehealth-careers__bar doehealth-news__bar">
              <div className="doehealth-careers__filter">
                <CareersFilterDropdown
                  label="Category"
                  value={category}
                  sections={categorySections}
                  onChange={setCategory}
                  hideSelected
                />
              </div>
              <div className="doehealth-careers__filter">
                <CareersFilterDropdown label="Author" value={author} sections={authorSections} onChange={setAuthor} hideSelected />
              </div>
              <div className="doehealth-careers__filter">
                <CareersFilterDropdown
                  label="Sort"
                  value={sort}
                  sections={SORT_SECTIONS}
                  onChange={(next) => setSort(next as SortOrder)}
                  hideSelected
                />
              </div>
            </div>
          </div>

          {featured ? null : <p className="doehealth-news__empty">No articles match these filters.</p>}

          <ul className="doehealth-news__grid">
            {featured ? <NewsCard article={featured} featured /> : null}
            {variant === "phone"
              ? groupForPhone(cards).map((group) =>
                  group[0].slug === WIDE_ROW_SLUG ? (
                    <NewsCard key={group[0].slug} article={group[0]} wide />
                  ) : (
                    <NewsRow key={group[0].slug} articles={group} />
                  ),
                )
              : cards.map((article) => (
                  <NewsCard key={article.slug} article={article} wide={article.slug === WIDE_ROW_SLUG} boxed />
                ))}
          </ul>
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
