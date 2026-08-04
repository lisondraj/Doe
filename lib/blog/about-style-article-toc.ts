import type { AboutStyleArticleContentBlock } from "@/lib/blog/about-style-article-content-blocks";
import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE,
} from "@/lib/blog/broader-doe-vision-article";

export type AboutStyleArticleTocItem = {
  id: string;
  label: string;
};

export const ABOUT_STYLE_ARTICLE_TOC_LABEL = "Contents" as const;

export const ABOUT_STYLE_ARTICLE_AUDIO = {
  label: "Listen to the voice recording of the article",
  navLines: ["Listen to the voice", "recording of the article"] as const,
  /** Wire when the recording is hosted under /public. */
  src: undefined as string | undefined,
} as const;

export const ABOUT_STYLE_ARTICLE_SECTION_ANCHOR = "about-style-article-section-anchor";

export const ABOUT_STYLE_ARTICLE_TOC_IDS = {
  intro: "article-intro",
  proposal: "article-proposal",
  features: "article-features",
  thesis: "article-thesis",
  contact: "article-contact",
} as const;

export const BROADER_DOE_VISION_TOC_ITEMS: readonly AboutStyleArticleTocItem[] = [
  { id: ABOUT_STYLE_ARTICLE_TOC_IDS.intro, label: "Introduction" },
  { id: ABOUT_STYLE_ARTICLE_TOC_IDS.proposal, label: "Our proposal" },
  { id: tocIdFromLabel(BROADER_DOE_VISION_THESIS_SECTION_HEADLINE), label: BROADER_DOE_VISION_THESIS_SECTION_HEADLINE },
  { id: ABOUT_STYLE_ARTICLE_TOC_IDS.contact, label: "Contact" },
];

export function tocIdFromLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tocItemsFromContentBlocks(blocks: readonly AboutStyleArticleContentBlock[]) {
  const items: AboutStyleArticleTocItem[] = [{ id: ABOUT_STYLE_ARTICLE_TOC_IDS.intro, label: "Introduction" }];

  for (const block of blocks) {
    if (block.type === "subheading") {
      items.push({ id: tocIdFromLabel(block.text), label: block.text });
    }
  }

  items.push({ id: ABOUT_STYLE_ARTICLE_TOC_IDS.contact, label: "Contact" });
  return items;
}

/** Build TOC entries for longform blog articles. */
export function buildAboutStyleArticleTocItems(article: AboutStyleLongformArticle): AboutStyleArticleTocItem[] {
  if (article.contentBlocks?.length) {
    return tocItemsFromContentBlocks(article.contentBlocks);
  }

  const items: AboutStyleArticleTocItem[] = [{ id: ABOUT_STYLE_ARTICLE_TOC_IDS.intro, label: "Introduction" }];

  if (article.featureCards?.length) {
    items.push({ id: ABOUT_STYLE_ARTICLE_TOC_IDS.features, label: "Product highlights" });
  }

  if (article.thesisSectionHeadline) {
    items.push({
      id: ABOUT_STYLE_ARTICLE_TOC_IDS.thesis,
      label: article.thesisSectionHeadline,
    });
  }

  items.push({ id: ABOUT_STYLE_ARTICLE_TOC_IDS.contact, label: "Contact" });
  return items;
}
