"use client";

import { AboutMobileBeigePanel } from "@/components/about/AboutMobileBeigePanel";
import { AboutMobileFaqTabs } from "@/components/about/AboutMobileFaqTabs";
import { ArticlePieChart } from "@/components/blog/ArticlePieChart";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import {
  ABOUT_MOBILE_BODY_TW,
  ABOUT_MOBILE_CONTENT_GAP,
  ABOUT_MOBILE_LIST_GAP,
  ABOUT_MOBILE_SECTION_GAP,
} from "@/lib/about/about-layout-styles";
import {
  ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS,
  ABOUT_DESKTOP_SECTION_2_BULLETS,
  ABOUT_DESKTOP_SECTION_2_INTRO,
  ABOUT_SECTION_2_PIE_CHART,
} from "@/lib/about/about-page-article";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone /about — section two copy, beige graphics, FAQ, and founder bios. */
export function AboutMobileView() {
  useDoePhoneStableViewport();

  const [foundersOne, foundersTwo] = ABOUT_DESKTOP_FOUNDERS_PARAGRAPHS;

  return (
    <BlogMobileShell
      showJoinCta={false}
      ctaLayout="main-home"
      logoLink
      showMenu={false}
      footerLinksDisabled
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <main className={`w-full ${BLOG_CONTENT_PT} ${ABOUT_MOBILE_SECTION_GAP}`}>
        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={ABOUT_MOBILE_BODY_TW}>{ABOUT_DESKTOP_SECTION_2_INTRO}</p>
          <ul className={`${ABOUT_MOBILE_LIST_GAP} list-none pl-0`}>
            {ABOUT_DESKTOP_SECTION_2_BULLETS.map((item) => (
              <li key={item} className={`flex items-start gap-3 ${ABOUT_MOBILE_BODY_TW}`}>
                <span
                  className="mt-[0.35em] h-[0.45em] w-[0.45em] shrink-0 rounded-full bg-[#9A8F82]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ArticlePieChart
          title={ABOUT_SECTION_2_PIE_CHART.title}
          caption={ABOUT_SECTION_2_PIE_CHART.caption}
          citation={ABOUT_SECTION_2_PIE_CHART.citation}
          slices={ABOUT_SECTION_2_PIE_CHART.slices}
          layout="mobile"
        />

        <AboutMobileBeigePanel graphic={0} />

        <AboutMobileFaqTabs />

        <div className={ABOUT_MOBILE_CONTENT_GAP}>
          <p className={ABOUT_MOBILE_BODY_TW}>{foundersOne}</p>
          <p className={ABOUT_MOBILE_BODY_TW}>{foundersTwo}</p>
        </div>

        <AboutMobileBeigePanel graphic={1} />
      </main>
    </BlogMobileShell>
  );
}
