import type { BlogLandingPost } from "@/lib/blog/blog-landing-posts";
import { BLOG_LANDING_POSTS } from "@/lib/blog/blog-landing-posts";
import { sanitizePremedCopy } from "@/lib/premed/premed-copy-sanitize";

/** /premed — full blog carousel copy with voice-specific wording removed. */
export function withPremedBlogPreviewCopy(post: BlogLandingPost): BlogLandingPost {
  return {
    ...post,
    excerpt: sanitizePremedCopy(post.excerpt),
    subheading: sanitizePremedCopy(post.subheading),
    previewSubheading: sanitizePremedCopy(post.previewSubheading ?? post.subheading),
  };
}

export function premedBlogPanelDescription(slug: string): string {
  const post = BLOG_LANDING_POSTS.find((item) => item.slug === slug);
  if (!post) return "Early writing from Doe.";
  return sanitizePremedCopy(post.excerpt);
}
