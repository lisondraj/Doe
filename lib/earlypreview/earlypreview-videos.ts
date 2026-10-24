import { doehealthBlogArticlePath } from "@/lib/doehealth/doehealth-blog-articles";

/** The hover card on each /earlypreview video: the film's title, and an optional link under it. */
export type EarlyPreviewVideo = {
  /** The title, one entry per line. */
  title: readonly string[];
  link?: { label: string; href: string };
};

/** The link under the title on the videos that don't have their own article: the news index. */
const EARLYPREVIEW_NEWS_LINK = { label: "See Article", href: "/news" };

export const EARLYPREVIEW_MAIN_VIDEO: EarlyPreviewVideo = {
  title: ["Healthcare in the", "Era of Personal Agents"],
  link: {
    label: "See Article",
    href: doehealthBlogArticlePath("healthcare-in-the-era-of-personal-agents"),
  },
};

export const EARLYPREVIEW_HOSPITALS_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Hospitals", "& Health Systems"],
  link: EARLYPREVIEW_NEWS_LINK,
};

export const EARLYPREVIEW_BEYOND_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Dentists", "& Home Care"],
  link: EARLYPREVIEW_NEWS_LINK,
};

export const EARLYPREVIEW_AESTHETICS_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for Derm", "& Plastic Surgery"],
  link: EARLYPREVIEW_NEWS_LINK,
};

export const EARLYPREVIEW_CONCIERGE_VIDEO: EarlyPreviewVideo = {
  title: ["Doe for", "Concierge Medicine"],
  link: EARLYPREVIEW_NEWS_LINK,
};
