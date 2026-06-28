import { getBlogArticle } from "@/lib/blog/articles";

export const ABOUT_PAGE_ARTICLE_SLUG = "ambient-documentation-at-the-bedside";

export const ABOUT_PAGE_ARTICLE =
  getBlogArticle(ABOUT_PAGE_ARTICLE_SLUG) ??
  (() => {
    throw new Error("Missing about page article");
  })();
