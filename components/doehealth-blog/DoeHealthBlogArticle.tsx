import dynamic from "next/dynamic";

import { DoeHealthBlogFilm } from "@/components/doehealth-blog/DoeHealthBlogFilm";
import { DoeHealthBlogListen } from "@/components/doehealth-blog/DoeHealthBlogListen";
import { DoeHealthBlogPlanMotion } from "@/components/doehealth-blog/DoeHealthBlogPlanMotion";
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

/** Copy written to follow a "Lead:" reads as its own sentence once it stands alone. */
function sentence(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** `[label](https://…)` in paragraph copy becomes a link in the sentence, so sources read as prose. */
function inlineLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^)\s]+\))/);
  return parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part);
    if (!match) return part;
    return (
      <a key={index} href={match[2]} target="_blank" rel="noreferrer">
        {match[1]}
      </a>
    );
  });
}

function ArticleBlock({ block, article }: { block: DoeHealthBlogBlock; article: Article }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="doehealth-blog-article__p">
          {inlineLinks(block.text)}
          {block.links?.length ? (
            <span>
              {" "}
              {block.links.map((link, index) => (
                <span key={link.href}>
                  {index ? " · " : ""}
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </span>
          ) : null}
        </p>
      );
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
    case "planmotion":
      return (
        <figure className="doehealth-blog-article__figure">
          <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doehealth-blog-article__figure-art">
            <DoeHealthBlogPlanMotion scene={block.scene} />
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "motion":
      return (
        <figure className="doehealth-blog-article__figure">
          <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doehealth-blog-article__figure-art">
            <DoeHealthBlogMotion scene={block.scene} />
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "investor":
      return (
        <aside className="doehealth-blog-article__brief" aria-label={block.title}>
          <h3 className={p22Mackinac.className}>{block.title}</h3>
          <dl className="doehealth-blog-article__brief-stats">
            {block.stats.map((stat) => (
              <div key={stat.label}>
                <dd className={p22Mackinac.className}>{stat.value}</dd>
                <dt>{sentence(stat.label)}</dt>
              </div>
            ))}
          </dl>
          {block.text ? <p className="doehealth-blog-article__brief-text">{block.text}</p> : null}
          {block.points ? (
            <div className="doehealth-blog-article__brief-points">
              {block.points.map((point) => (
                <div key={point.lead}>
                  <h4 className={p22Mackinac.className}>{point.lead}</h4>
                  <p>{sentence(point.text)}</p>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      );
    case "timeline":
      return (
        <figure className="doehealth-blog-article__figure doehealth-blog-article__plan">
          <ol>
            {block.steps.map((step) => (
              <li key={step.when} data-seed={step.seed ? "" : undefined}>
                <p className={`doehealth-blog-article__plan-when ${p22Mackinac.className}`}>{step.when}</p>
                <div className="doehealth-blog-article__plan-card">
                  <h4 className={p22Mackinac.className}>
                    {step.title}
                    {step.seed ? <span className="doehealth-blog-article__plan-seed">Seed</span> : null}
                  </h4>
                  <p className="doehealth-blog-article__plan-text">{step.text ?? sentence((step.items ?? []).join("; ")) + "."}</p>
                  <p className="doehealth-blog-article__plan-unlock">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {sentence(step.unlock)}
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
