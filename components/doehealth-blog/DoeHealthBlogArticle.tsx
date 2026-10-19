import { DoeHealthBlogListen } from "@/components/doehealth-blog/DoeHealthBlogListen";
import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DoeHealthBlogUiFigure } from "@/components/doehealth-blog/DoeHealthBlogUiFigure";
import { DoeHealthBlogVideo } from "@/components/doehealth-blog/DoeHealthBlogVideo";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import type { DoeHealthBlogArticle as Article, DoeHealthBlogBlock } from "@/lib/doehealth/doehealth-blog-articles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

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
            wave={article.wave}
            className="doehealth-blog-article__figure-art"
            pattern
          />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "ui":
      return (
        <figure className="doehealth-blog-article__figure">
          <DoeHealthBlogUiFigure scene={block.scene} dots={block.dots} tone={block.tone} />
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
      <DoeHealthBlogVideo
        className="doehealth-blog-article__hero"
        src={article.heroImage?.src}
        alt={article.heroImage?.alt}
      />

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
