import { doehealthBlogArticlePath } from "@/lib/doehealth/doehealth-blog-articles";

/** The hover card on each /earlypreview video: the film's title, and an optional link under it. */
export type EarlyPreviewVideo = {
  /** The title, one entry per line. */
  title: readonly string[];
  link?: { label: string; href: string };
};

export const EARLYPREVIEW_MAIN_VIDEO: EarlyPreviewVideo = {
  title: ["Healthcare in the", "Era of Personal Agents"],
  link: {
    label: "See Article",
    href: doehealthBlogArticlePath("healthcare-in-the-era-of-personal-agents"),
  },
};

export const EARLYPREVIEW_HOSPITALS_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Hospitals", "& Health Systems"],
  link: { label: "See Article", href: doehealthBlogArticlePath("the-health-system-mapped-for-agents") },
};

export const EARLYPREVIEW_BEYOND_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Dentists"],
  link: { label: "See Article", href: doehealthBlogArticlePath("beyond-find-me-a-doctor") },
};

export const EARLYPREVIEW_AESTHETICS_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Derm", "& Plastic Surgery"],
  link: { label: "See Article", href: doehealthBlogArticlePath("the-new-front-door-for-aesthetic-care") },
};

export const EARLYPREVIEW_CONCIERGE_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for", "Concierge Medicine"],
  link: { label: "See Article", href: doehealthBlogArticlePath("membership-medicine-extended-by-agents") },
};
