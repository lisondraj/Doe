"use client";

import { useEffect, useId, useState } from "react";

import { DOEINSURE_NAV, DOEINSURE_NAV_LINKS } from "@/lib/doeinsure/doeinsure-copy";

const SECTION_IDS = DOEINSURE_NAV_LINKS.map((link) => link.href.slice(1));

const PROMO_STEP_MS = 5200;

export function DoeInsureNav() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#stages");
  const [promoIndex, setPromoIndex] = useState(0);
  const promos = DOEINSURE_NAV.promos;

  useEffect(() => {
    const id = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, PROMO_STEP_MS);
    return () => window.clearInterval(id);
  }, [promos.length]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href: string) => {
    setActive(href);
    setOpen(false);
  };

  return (
    <header className={`doeinsure-nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="doeinsure-nav__promo">
        <a className="doeinsure-nav__promo-link" href="#request" onClick={() => go("#request")}>
          <span className="doeinsure-nav__promo-track" aria-live="polite">
            {promos.map((promo, index) => (
              <span key={promo} className={promoIndex === index ? "is-on" : undefined}>
                {promo}
              </span>
            ))}
          </span>
          <span className="doeinsure-nav__promo-cta">
            {DOEINSURE_NAV.promoCta}
            <svg className="doeinsure-nav__promo-arrow" viewBox="0 0 20 12" aria-hidden="true">
              <path
                d="M0 6h14M10 2l5 4-5 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>

      <div className="doeinsure-nav__bar">
        <a className="doeinsure-nav__mark" href="#top" onClick={() => go("#top")}>
          <span className="doeinsure-nav__mark-line">{DOEINSURE_NAV.mark}</span>
          <span className="doeinsure-nav__mark-line doeinsure-nav__mark-accent">{DOEINSURE_NAV.markAccent}</span>
        </a>

        <nav className="doeinsure-nav__links" aria-label="Doe Insure">
          {DOEINSURE_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href ? "is-on" : undefined}
              aria-current={active === link.href ? "true" : undefined}
              onClick={() => go(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="doeinsure-nav__end">
          <a className="doeinsure-btn doeinsure-nav__cta" href="#request" onClick={() => go("#request")}>
            <span className="doeinsure-nav__cta-full">{DOEINSURE_NAV.cta}</span>
            <span className="doeinsure-nav__cta-short">{DOEINSURE_NAV.ctaShort}</span>
          </a>
          <button
            type="button"
            className="doeinsure-nav__menu"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? DOEINSURE_NAV.menuClose : DOEINSURE_NAV.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>

      <div
        className={`doeinsure-nav__panel${open ? " is-open" : ""}`}
        id={panelId}
        aria-hidden={!open}
      >
        <nav aria-label="Doe Insure menu">
          {DOEINSURE_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href ? "is-on" : undefined}
              aria-current={active === link.href ? "true" : undefined}
              onClick={() => go(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a className="doeinsure-btn doeinsure-btn--block" href="#request" onClick={() => go("#request")}>
          {DOEINSURE_NAV.cta}
        </a>
      </div>
    </header>
  );
}
