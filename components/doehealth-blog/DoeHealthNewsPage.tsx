"use client";

import Link from "next/link";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDeskNavWash } from "@/components/doehealth-desk/DoeHealthDeskNavWash";
import { DoeHealthDeskInviteSection } from "@/components/doehealth-desk/DoeHealthDeskStorySections";
import { LegacyHomeDesktopNavBar } from "@/components/home/LegacyHomeDesktopNavBar";
import { LegacyHomePhoneNavBar } from "@/components/home/LegacyHomePhoneNavBar";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  doehealthBlogArticlePath,
  type DoeHealthBlogArticle as Article,
} from "@/lib/doehealth/doehealth-blog-articles";
import { DOEHEALTH_DESK_PAGE_BACKGROUND } from "@/lib/doehealth/doehealth-desk-colors";
import { useDoeHealthDeskPhoneOverflowChrome } from "@/lib/doehealth/use-doehealth-desk-phone-overflow-chrome";
import {
  type DoeHealthDeskVariant,
  useDoeHealthDeskVariant,
} from "@/lib/doehealth/use-doehealth-desk-variant";
import { inter, p22Mackinac } from "@/lib/home/fonts";

const DESK_PATH = "/doehealthdesk";
const LOGO_HREF = "/doehealthdesk2";

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <li className={`doehealth-news__item${featured ? " doehealth-news__item--featured" : ""}`}>
      <Link href={doehealthBlogArticlePath(article.slug)} className="doehealth-blog-card doehealth-news-card">
        <DoeHealthBlogPlaceholder tone={article.heroTone} className="doehealth-blog-card__art" pattern />
        <p className="doehealth-blog-card__eyebrow">{article.eyebrow}</p>
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
        <span className="doehealth-blog-card__more">
          Read more
          <Arrow />
        </span>
      </Link>
    </li>
  );
}

/** /news — the index of every article: the featured one large, the rest side by side, on the desk chrome. */
export function DoeHealthNewsPage({
  articles,
  initialVariant,
}: {
  articles: readonly Article[];
  initialVariant: DoeHealthDeskVariant;
}) {
  const variant = useDoeHealthDeskVariant(initialVariant);
  useDoeHealthDeskPhoneOverflowChrome(variant === "phone");
  const [featured, ...rest] = articles;

  return (
    <div
      className={`doehealth-desk-page doehealth-blog-page doehealth-news-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <LegacyHomeDesktopNavBar homeHref={LOGO_HREF} sectionHrefBase={DESK_PATH} />
      ) : (
        <LegacyHomePhoneNavBar homeHref={LOGO_HREF} sectionHrefBase={DESK_PATH} />
      )}
      <DoeHealthDeskNavWash />
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="News">
        <section className={`doehealth-news ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <header className="doehealth-news__head">
            <p className="doehealth-news__eyebrow">News</p>
            <h1 className={`doehealth-news__title ${p22Mackinac.className}`}>Notes from Doe</h1>
            <p className="doehealth-news__dek">Writing from the founders on healthcare, personal agents, and building Doe.</p>
          </header>

          <ul className="doehealth-news__grid">
            {featured ? <NewsCard article={featured} featured /> : null}
            {rest.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </ul>
        </section>

        <DoeHealthDeskInviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
