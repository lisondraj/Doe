import {
  BLOG_ARTICLE_CATEGORY_TW,
  BLOG_LANDING_CARD_CATEGORY_TW,
} from "@/lib/blog/blog-landing-layout-styles";
import type { BlogPostCategory } from "@/lib/blog/blog-post-categories";

type BlogArticleCategoryProps = {
  category: BlogPostCategory;
  /** Centered label above article hero titles. */
  variant?: "hero" | "preview";
};

export function BlogArticleCategory({ category, variant = "hero" }: BlogArticleCategoryProps) {
  if (variant === "preview") {
    return <p className={BLOG_LANDING_CARD_CATEGORY_TW}>{category}</p>;
  }

  return <p className={BLOG_ARTICLE_CATEGORY_TW}>{category}</p>;
}
