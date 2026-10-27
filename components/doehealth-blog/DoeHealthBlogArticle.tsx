import dynamic from "next/dynamic";

import { DoeHealthBlogFilm } from "@/components/doehealth-blog/DoeHealthBlogFilm";
import { DoeHealthBlogListen } from "@/components/doehealth-blog/DoeHealthBlogListen";
import { DoeHealthBlogMotion } from "@/components/doehealth-blog/DoeHealthBlogMotion";
import { DoeHealthBlogPlaceholder, articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthBlogVideo } from "@/components/doehealth-blog/DoeHealthBlogVideo";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import type { DoeHealthBlogArticle as Article, DoeHealthBlogBlock } from "@/lib/doehealth/doehealth-blog-articles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The films and the live product pages load on the client only, after the article text. */
const DoeHealthBlogProductView = dynamic(
  () => import("@/components/doehealth-blog/DoeHealthBlogProductView").then((mod) => mod.DoeHealthBlogProductView),
  { ssr: false },
);

/** The animated explainer figures, also client only. */
const DoeHealthBlogDiagram = dynamic(
  () => import("@/components/doehealth-blog/diagrams").then((mod) => mod.DoeHealthBlogDiagram),
  { ssr: false },
);

function ArticleBlock({ block, article }: { block: DoeHealthBlogBlock; article: Article }) {
  switch (block.type) {
    case "paragraph":
      return <p className="doehealth-blog-article__p">{block.text}</p>;
    case "heading":
      return <h2 className={`doehealth-blog-article__h2 ${p22Mackinac.className}`}>{block.text}</h2>;
    case "figure":
      return (
        <figure className="doehealth-blog-article__figure">
          {/* Static — motion stays reserved for the hero above. Same dot design as this article's card art. */}
          <DoeHealthBlogPlaceholder
            tone={article.heroTone}
            colors={articleBoxColors(article.heroTone)}
            wave={article.wave}
            className="doehealth-blog-article__figure-art"
            pattern
          />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "view":
      return (
        <figure className="doehealth-blog-article__figure">
          {/* Plain box behind the view while it loads; the film draws its own beige, the product pages their tone. */}
          <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doehealth-blog-article__figure-art" style={{ background: "#F4EEDF" }}>
            <DoeHealthBlogProductView view={block.view} />
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "diagram":
      return (
        <figure className="doehealth-blog-article__figure">
          <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doehealth-blog-article__figure-art" style={{ background: articleBoxColors(block.diagram.tone).bg }}>
            <DoeHealthBlogDiagram diagram={block.diagram.id} tone={block.diagram.tone} dots={block.diagram.dots} />
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "motion":
      return (
        <figure className="doehealth-blog-article__figure doehealth-blog-article__motion">
          {/* Drawn in the article, not in the product shell: a plan has no screen to show. */}
          <DoeHealthBlogMotion scene={block.scene} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "investor":
      return (
        <aside className="doehealth-blog-article__investor" aria-label="For investors">
          <p className="doehealth-blog-article__investor-eyebrow">For investors</p>
          <h3 className={p22Mackinac.className}>{block.title}</h3>
          <dl className="doehealth-blog-article__investor-stats">
            {block.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd className={p22Mackinac.className}>{stat.value}</dd>
              </div>
            ))}
          </dl>
          {block.text ? <p>{block.text}</p> : null}
          {block.points ? (
            <ul>
              {block.points.map((point) => (
                <li key={point.lead}>
                  <strong>{point.lead}:</strong> {point.text}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      );
    case "timeline":
      return (
        <figure className="doehealth-blog-article__figure doehealth-blog-article__timeline">
          <ol>
            {block.steps.map((step) => (
              <li key={step.when} data-seed={step.seed ? "" : undefined}>
                <span className="doehealth-blog-article__timeline-when">{step.when}</span>
                <div>
                  <h4 className={p22Mackinac.className}>{step.title}</h4>
                  <ul>
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p>
                    <span>Unlocks</span> {step.unlock}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "quote":
      return (
        <blockquote className={`doehealth-blog-article__quote ${p22Mackinac.className}`}>
          <p>{block.text}</p>
        </blockquote>
      );
    case "list":
      return (
        <ul className="doehealth-blog-article__list">
          {block.items.map((item) => (
            <li key={item.lead}>
              <strong>{item.lead}:</strong> {item.text}
            </li>
          ))}
        </ul>
      );
  }
}

/** Eyebrow, two-line P22 title, byline, hero art, and long-form body. */
export function DoeHealthBlogArticle({ article }: { article: Article }) {
  return (
    <article className={`doehealth-blog-article ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}>
      <header className="doehealth-blog-article__head">
        <p className="doehealth-blog-article__eyebrow">{article.eyebrow}</p>
        <h1 className={`doehealth-blog-article__title ${p22Mackinac.className}`}>
          {article.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="doehealth-blog-article__meta">
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.author}</span>
        </p>
      </header>

      {/* The hero box is the desktop video screen (the lounge photo with the founders and the play button). */}
      {article.heroDiagram ? (
        <div
          className="doehealth-blog-article__hero doehealth-blog-diagram-hero doehealth-blog-placeholder doehealth-blog-placeholder--pattern"
          style={{ background: articleBoxColors(article.heroDiagram.tone).bg }}
        >
          <DoeHealthBlogDiagram diagram={article.heroDiagram.id} tone={article.heroDiagram.tone} dots={article.heroDiagram.dots} />
        </div>
      ) : article.film ? (
        <DoeHealthBlogFilm
          className="doehealth-blog-article__hero"
          film={article.film.id}
          thumbnail={article.film.thumbnail}
          label={article.film.label}
        />
      ) : (
        <DoeHealthBlogVideo
          className="doehealth-blog-article__hero"
          src={article.heroImage?.src}
          alt={article.heroImage?.alt}
        />
      )}

      <DoeHealthBlogListen />

      <div className="doehealth-blog-article__body">
        <p className="doehealth-blog-article__lede">{article.lede}</p>
        {article.blocks.map((block, index) => (
          <ArticleBlock key={`${block.type}-${index}`} block={block} article={article} />
        ))}
      </div>
    </article>
  );
}
