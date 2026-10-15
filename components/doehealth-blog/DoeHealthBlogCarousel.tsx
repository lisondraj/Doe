"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { DoeHealthBlogPlaceholder } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  doehealthBlogArticlePath,
  doehealthBlogOtherArticles,
} from "@/lib/doehealth/doehealth-blog-articles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Swipe carousel of the other posts — desk card language, prev/next on the header row. */
export function DoeHealthBlogCarousel({ currentSlug }: { currentSlug: string }) {
  const posts = doehealthBlogOtherArticles(currentSlug);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const max = scroll.scrollWidth - scroll.clientWidth;
    setCanPrev(scroll.scrollLeft > 2);
    setCanNext(scroll.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return undefined;
    sync();
    scroll.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(scroll);
    return () => {
      scroll.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const scroll = scrollRef.current;
    const slide = scroll?.querySelector<HTMLElement>(".doehealth-blog-carousel__slide");
    if (!scroll || !slide) return;
    const gap = Number.parseFloat(getComputedStyle(slide.parentElement!).columnGap) || 0;
    scroll.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section className={`doehealth-blog-carousel ${inter.className}`} aria-label="More from the blog">
      <header className={`doehealth-blog-carousel__head ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <h2 className={p22Mackinac.className}>More from Doe</h2>
        <div className="desk-agent-carousel__nav">
          <button type="button" aria-label="Previous post" disabled={!canPrev} onClick={() => step(-1)}>
            <Arrow flip />
          </button>
          <button type="button" aria-label="Next post" disabled={!canNext} onClick={() => step(1)}>
            <Arrow />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="doehealth-blog-carousel__scroll">
        <ul className="doehealth-blog-carousel__track">
          {posts.map((post) => (
            <li key={post.slug} className="doehealth-blog-carousel__slide">
              <Link href={doehealthBlogArticlePath(post.slug)} className="doehealth-blog-card">
                {/* Static — the preview carousel never animates, even for a hero that does on its own page. */}
                <DoeHealthBlogPlaceholder tone={post.heroTone} className="doehealth-blog-card__art" pattern />
                <p className="doehealth-blog-card__eyebrow">{post.eyebrow}</p>
                <h3 className={`doehealth-blog-card__title ${p22Mackinac.className}`}>
                  {post.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="doehealth-blog-card__meta">
                  <span>{post.date}</span>
                  <span aria-hidden>·</span>
                  <span>{post.author}</span>
                </p>
                <p className="doehealth-blog-card__excerpt">{post.excerpt}</p>
                <span className="doehealth-blog-card__more">
                  Read more
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
