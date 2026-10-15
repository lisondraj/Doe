"use client";

import Link from "next/link";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import {
  type DoeHealthBlogArticle as Article,
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

/** The whole card is one link to the post: image, info, title, and excerpt. */
function NewsCard({
  article,
  featured = false,
  wide = false,
}: {
  article: Article;
  featured?: boolean;
  wide?: boolean;
}) {
  const modifier = featured ? " doehealth-news__item--featured" : wide ? " doehealth-news__item--wide" : "";
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
        <DoeHealthBlogPlaceholder tone={article.heroTone} className="doehealth-blog-card__art" pattern wave={article.wave} />
      </Link>
    </li>
  );
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
  const [featured, ...rest] = articles;
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

          <ul className="doehealth-news__grid">
            {featured ? <NewsCard article={featured} featured /> : null}
            {cards.map((article) => (
              <NewsCard key={article.slug} article={article} wide={article.slug === WIDE_ROW_SLUG} />
            ))}
          </ul>
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
