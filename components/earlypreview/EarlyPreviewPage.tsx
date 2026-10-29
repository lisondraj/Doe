"use client";

import { type CSSProperties, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2Hero } from "@/components/doehealth-desk2/DoeHealthDesk2Hero";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { DoeHealthDesk2Workspace } from "@/components/doehealth-desk2/DoeHealthDesk2Workspace";
import { EarlyPreviewHeroGallery } from "@/components/earlypreview/EarlyPreviewGallery";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { EarlyPreviewComplianceSection } from "@/components/earlypreview/EarlyPreviewComplianceSection";
import { EarlyPreviewMarketSection } from "@/components/earlypreview/EarlyPreviewMarketSection";
import { EarlyPreviewProductSection } from "@/components/earlypreview/EarlyPreviewProductSection";
import { EarlyPreviewVideoOverlay } from "@/components/earlypreview/EarlyPreviewVideoOverlay";
import {
  EARLYPREVIEW_BAND_DEK,
  EARLYPREVIEW_BAND_FOUNDERS,
  EARLYPREVIEW_BAND_HEADLINE,
  EARLYPREVIEW_HERO_DEK,
  EARLYPREVIEW_HERO_HEADLINE,
} from "@/lib/earlypreview/earlypreview-hero-copy";
import { EARLYPREVIEW_MAIN_VIDEO } from "@/lib/earlypreview/earlypreview-videos";

/** A screenshot of the hero film at 0:04, its thumbnail. */
const EARLYPREVIEW_HERO_THUMBNAIL = "/earlypreview/thumbs/hero.jpg";
import { useEarlyPreviewFilm } from "@/lib/earlypreview/use-earlypreview-film";
import { EARLYPREVIEW_NAV_CTA } from "@/lib/earlypreview/earlypreview-nav-copy";
import { useDoeHealthDesk2FitTitles } from "@/lib/doehealthdesk2/use-doehealthdesk2-fit-titles";
import { useNavReveal } from "@/lib/earlypreview/use-nav-reveal";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import { useDoeHealthDesk2PhoneScreenHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-screen-height";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";

/** How long the page takes to fade to black around the playing hero film, and back. Matches earlypreview-films.css. */
const CINEMA_FADE_MS = 600;

/** The desk2 site: its logo and section anchors live here. */
const DESK2_PATH = "/doehealthdesk2";

/**
 * The beige band: the /product-nav beige with the nav in its beige state over it. It starts brown and fades to beige
 * when the nav reaches it, and its side dots, title, description and video come up in the reveal (see the
 * `earlypreview-beige-blank` rules). Used under the hero, and again under the enterprise section.
 */
function EarlyPreviewBeigeBand({
  sectionRef,
  minHeight,
  pad,
  titleSize,
  videos,
  headline = EARLYPREVIEW_BAND_HEADLINE,
  heroFilm,
}: {
  sectionRef?: RefObject<HTMLElement>;
  /** The hero block's height. Left out, the band is as tall as its content. */
  minHeight?: number;
  /** The hero's padding above and below its title. */
  pad?: { top: number; bottom: number };
  /** The hero title's font size. */
  titleSize?: string;
  /** Videos to show under the copy in place of the main video; the band grows to fit them. */
  videos?: ReactNode;
  /** The two title lines. The band under the hero keeps the default; the one under the enterprise section has its own. */
  headline?: { readonly line1: string; readonly line2: string; readonly phoneLines?: readonly string[] };
  /** The hero film, shown again when this band has no grid of its own. */
  heroFilm?: string;
}) {
  return (
    <section
      ref={sectionRef}
      className="doehealth-desk2-blank earlypreview-beige-blank doehealth-desk2-nav-wash-surface"
      data-nav-beige="1"
      data-headline-rows={headline === EARLYPREVIEW_BAND_HEADLINE ? undefined : "2"}
      style={{ minHeight, paddingTop: pad?.top, paddingBottom: 0 }}
    >
      {/* The side dot tides from the closing "1000+ clinics" scene, in the dark beige. Fully revealed (--s 1). */}
      <div className="doehealth-desk2-visible__tide" style={{ "--s": 1 } as CSSProperties}>
        <DoeHealthDesk2DotTide color="rgba(110, 92, 64, 0.45)" />
      </div>
      {/* The fixed nav bar's height, so the title is not hidden under the nav when this section is scrolled to the top. */}
      <div aria-hidden style={{ height: "calc(5.5rem + var(--desk2-banner-h, 2.85rem))", flexShrink: 0 }} />
      {/* The title and description copied from the hero. They are not the hero's reveal-animated elements, so they show here. */}
      <div className={`earlypreview-band__copy ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} style={{ paddingBottom: pad?.bottom }}>
        <h2 className={`earlypreview-band__headline ${p22Mackinac.className}`} style={{ fontSize: titleSize }}>
          <span className="earlypreview-band__line earlypreview-band__line--desk">{headline.line1}</span>
          <span className="earlypreview-band__line earlypreview-band__line--desk">{headline.line2}</span>
          {/* The iPhone view breaks the title in its own, even lines; the other widths show the two lines above. */}
          {headline.phoneLines?.map((line, index) => (
            <span
              key={line}
              className="earlypreview-band__line earlypreview-band__line--phone"
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              {line}
            </span>
          ))}
        </h2>
        <p className={`earlypreview-band__dek ${inter.className}`}>
          {EARLYPREVIEW_BAND_DEK.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        {/* The band under the hero: the founders, one row of two columns, each a name over the same two lines. */}
        {headline === EARLYPREVIEW_BAND_HEADLINE ? (
          <ul className="earlypreview-band__founders" aria-label="Founders">
            {EARLYPREVIEW_BAND_FOUNDERS.map((founder) => (
              <li key={founder.name} className="earlypreview-band__founder">
                <span className={`earlypreview-band__founder-name ${p22Mackinac.className}`}>{founder.name}</span>
                {founder.lines.map((line) => (
                  <span key={line} className={`earlypreview-band__founder-line ${inter.className}`}>
                    {line}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {/* The same empty space as the hero's dot-wave box, so the video sits at the same height as in the hero. */}
      <div className="earlypreview-hero-wave" aria-hidden />
      {videos ? (
        <div className={`earlypreview-band__videos ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>{videos}</div>
      ) : (
        /* The same video as the hero, under the copy. */
        <DoeHealthDesk2Workspace
          film={heroFilm}
          filmLabel={EARLYPREVIEW_MAIN_VIDEO.title.join(" ")}
          overlay={<EarlyPreviewVideoOverlay video={EARLYPREVIEW_MAIN_VIDEO} />}
          thumbnail={EARLYPREVIEW_HERO_THUMBNAIL}
        />
      )}
    </section>
  );
}

/**
 * The hero: the title and description, the dot wave, the hero film and the gallery of films under it. Shared with
 * /services.
 */
export function EarlyPreviewHeroStack({ heroFilm }: { heroFilm?: string }) {
  return (
    <>
      {/* A brown surface for the nav over its whole height, including the empty space under the video on the phone. */}
      <div className="doehealth-desk2-hero-stack doehealth-desk2-nav-wash-surface">
        <DoeHealthDesk2Hero centered headline={EARLYPREVIEW_HERO_HEADLINE} dek={EARLYPREVIEW_HERO_DEK} className="doehealth-desk2-nav-wash-surface" />
        {/* The dot wave in the space between the small description and the video. */}
        {/* Also a brown surface for the nav, so the nav stays brown while the page scrolls past the space between the hero text and the video. */}
        <div className="earlypreview-hero-wave doehealth-desk2-nav-wash-surface" aria-hidden>
          <div className="earlypreview-hero-wave__fade">
            <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={0.42} amp={60} fade={0.5} />
          </div>
        </div>
        <DoeHealthDesk2Workspace
          film={heroFilm}
          filmLabel={EARLYPREVIEW_MAIN_VIDEO.title.join(" ")}
          overlay={<EarlyPreviewVideoOverlay video={EARLYPREVIEW_MAIN_VIDEO} />}
          thumbnail={EARLYPREVIEW_HERO_THUMBNAIL}
          className="doehealth-desk2-nav-wash-surface"
        />
        {/* The hospital, dentist, derm and concierge videos, attached under the hero video with equal gaps. */}
        <EarlyPreviewHeroGallery />
      </div>
    </>
  );
}

/**
 * /earlypreview: the regular /doehealthdesk look, brown sections on the light beige page. The nav keeps only the mark
 * and the CTA (no page links), and the sections are the /doehealthdesk2 ones with their regular theme.
 */
export function EarlyPreviewPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  const heroFilm = useEarlyPreviewFilm("hero");
  const rootRef = useRef<HTMLDivElement>(null);
  const beigeBandRef = useRef<HTMLElement>(null);
  // The band under the hero matches the whole hero block: its height, and the hero's top and bottom padding, so the
  // title and the video sit at the same offsets as in the hero. Measured from the hero's computed styles.
  const [bandHeight, setBandHeight] = useState<number | undefined>(undefined);
  const [bandPad, setBandPad] = useState<{ top: number; bottom: number } | undefined>(undefined);
  // The band's title takes the hero title's font size, which the hero's own fit sets.
  const [bandTitleSize, setBandTitleSize] = useState<string | undefined>(undefined);
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".earlypreview-page .doehealth-desk2-hero");
    const heroTitle = hero?.querySelector<HTMLElement>(".doehealth-desk2-hero__headline");
    const wave = document.querySelector<HTMLElement>(".earlypreview-page .earlypreview-hero-wave");
    const video = document.querySelector<HTMLElement>(".earlypreview-page .doehealth-desk2-hero-stack > .desk2-workspace");
    if (!hero || !video) return undefined;
    const update = () => {
      setBandHeight(video.getBoundingClientRect().bottom - hero.getBoundingClientRect().top);
      const style = getComputedStyle(hero);
      const top = parseFloat(style.paddingTop);
      const bottom = parseFloat(style.paddingBottom);
      setBandPad((prev) => (prev && prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
      if (heroTitle) {
        const size = getComputedStyle(heroTitle).fontSize;
        setBandTitleSize((prev) => (prev === size ? prev : size));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(hero);
    observer.observe(video);
    if (wave) observer.observe(wave);
    return () => observer.disconnect();
  }, []);

  // Cinema: while the hero film plays and is at least half on screen, the rest of the page (the nav included) fades to
  // black and is then hidden, so the browser stops drawing it: the nav's backdrop blur, the drifting fade at the foot
  // of the screen and the sections around the film all stop competing with the video for frames. Pausing, the film
  // ending or scrolling it off screen brings the page back.
  useEffect(() => {
    const root = rootRef.current;
    const video = root?.querySelector<HTMLVideoElement>(".doehealth-desk2-hero-stack > .desk2-workspace video");
    if (!root || !video) return undefined;
    let playing = !video.paused && !video.ended;
    let visible = false;
    let leaving = 0;
    const update = () => {
      const on = playing && visible;
      if (on === root.hasAttribute("data-cinema")) return;
      window.clearTimeout(leaving);
      root.removeAttribute("data-cinema-leaving");
      if (on) {
        root.setAttribute("data-cinema", "");
        return;
      }
      // The page fades back in for as long as the fade out took (see earlypreview-films.css).
      root.removeAttribute("data-cinema");
      root.setAttribute("data-cinema-leaving", "");
      leaving = window.setTimeout(() => root.removeAttribute("data-cinema-leaving"), CINEMA_FADE_MS);
    };
    const onPlay = () => {
      playing = true;
      update();
    };
    const onStop = () => {
      playing = false;
      update();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(video);
    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onStop);
    video.addEventListener("ended", onStop);
    video.addEventListener("emptied", onStop);
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onStop);
      video.removeEventListener("ended", onStop);
      video.removeEventListener("emptied", onStop);
      window.clearTimeout(leaving);
      root.removeAttribute("data-cinema");
      root.removeAttribute("data-cinema-leaving");
    };
  }, []);

  // The band under the hero fades from brown to beige the first time it reaches the nav bar.
  // It starts as the band scrolls into view, so it is not a blank section until it reaches the nav.
  useNavReveal(beigeBandRef, { early: true });
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");
  useDoePhoneStableViewport(variant === "phone");
  useDoeHealthDesk2PhoneScreenHeight(variant === "phone");
  useDoeHealthDesk2FitTitles(rootRef);

  return (
    <div
      ref={rootRef}
      className={`doehealth-desk2-page earlypreview-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          centerLinks={false}
          primaryCta={EARLYPREVIEW_NAV_CTA}
        />
      ) : (
        <DoeHealthDesk2PhoneNavBar
          logoHref={DESK2_PATH}
          sectionHrefBase={DESK2_PATH}
          primaryCta={EARLYPREVIEW_NAV_CTA}
          menuMailTo="james@doe.care"
        />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk2-main min-h-[100dvh]" aria-label="Early preview">
        <EarlyPreviewHeroStack heroFilm={heroFilm} />
        {/* The market, the page's second section: scroll-locked, it releases on the go-to-market screen. */}
        <EarlyPreviewMarketSection />
        {/* The blank band under the hero: the /product-nav beige, with the nav in its beige state over it. */}
        <EarlyPreviewBeigeBand
          sectionRef={beigeBandRef}
          minHeight={bandHeight}
          pad={bandPad}
          titleSize={bandTitleSize}
          heroFilm={heroFilm}
        />
        {/* The product, a scroll-locked beige section: the title lifts, a big rectangle opens, and its boxes pan by. */}
        <EarlyPreviewProductSection />
        {/* Compliance and security through Seed, for the U.S. and Canada: four screens in the market section's style. */}
        <EarlyPreviewComplianceSection />
        <div className="earlypreview-invite-band">
          <DoeHealthDesk2InviteSection />
        </div>
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
