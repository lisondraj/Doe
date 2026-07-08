"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOE_DESKTOP_NAV_LOGO_TW } from "@/lib/doephone/doe-desktop-layout-styles";
import {
  DOE_HOME_DUSK_INK,
  DOE_HOME_DUSK_SURFACE_RAISED,
} from "@/lib/home/doe-page-colors";
import { lora } from "@/lib/home/fonts";

/** Hero / home CTAs — keep this chrome through the punch morph (no mid-scroll snap). */
const HOME_CTA = {
  bg: "#1A1208",
  fg: DOE_HOME_DUSK_SURFACE_RAISED,
  shadow: "0 2px 6px rgba(26, 18, 8, 0.18)",
  divider: "rgba(245, 230, 208, 0.24)",
} as const;

/** About always-punched — sand pills on dusk capsule. */
const ABOUT_PUNCHED_CTA = {
  bg: DOE_HOME_DUSK_SURFACE_RAISED,
  fg: DOE_HOME_DUSK_INK,
  shadow: "none",
  divider: "rgba(26, 18, 8, 0.14)",
} as const;

/** Start punch morph after this × viewport height (prior navSolid threshold). */
const HERO_PUNCH_THRESHOLD = 0.72;
/** Longer scroll distance → smoother capsule morph. */
const HERO_PUNCH_MORPH_PX = 220;
/** Ease toward target progress each frame (scroll can jump). */
const PUNCH_LERP = 0.14;
const PUNCH_SNAP_EPS = 0.002;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Desktop home + about — floating dusk capsule nav matching iPhone punched chrome.
 *  Home: transparent hero chrome → punched beyond hero. About: always punched.
 */
export function DesktopPunchedSiteNav({
  logoLink = true,
  navActionLinksEnabled = true,
  className = "",
  ariaLabel = "Primary",
  alwaysPunched = false,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
  className?: string;
  ariaLabel?: string;
  /** About (and similar) — stay punched; home morphs after hero. */
  alwaysPunched?: boolean;
} = {}) {
  const [punchProgress, setPunchProgress] = useState(alwaysPunched ? 1 : 0);
  const targetRef = useRef(alwaysPunched ? 1 : 0);
  const displayRef = useRef(alwaysPunched ? 1 : 0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (alwaysPunched) {
      targetRef.current = 1;
      displayRef.current = 1;
      setPunchProgress(1);
      return;
    }

    const readTarget = () => {
      const threshold = window.innerHeight * HERO_PUNCH_THRESHOLD;
      const raw = Math.min(
        1,
        Math.max(0, (window.scrollY - threshold + HERO_PUNCH_MORPH_PX) / HERO_PUNCH_MORPH_PX),
      );
      targetRef.current = easeInOutCubic(raw);
    };

    const tick = () => {
      const target = targetRef.current;
      const current = displayRef.current;
      const next =
        Math.abs(target - current) < PUNCH_SNAP_EPS
          ? target
          : current + (target - current) * PUNCH_LERP;

      displayRef.current = next;
      setPunchProgress((prev) => (Math.abs(prev - next) < PUNCH_SNAP_EPS ? prev : next));

      if (Math.abs(target - next) >= PUNCH_SNAP_EPS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    const schedule = () => {
      readTarget();
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    readTarget();
    displayRef.current = targetRef.current;
    setPunchProgress(targetRef.current);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [alwaysPunched]);

  const shellProgress = punchProgress * punchProgress;
  const scrolled = punchProgress > 0.02;
  const cta = alwaysPunched ? ABOUT_PUNCHED_CTA : HOME_CTA;

  const navStyle = {
    ["--proto-nav-frost-progress" as string]: punchProgress,
    ["--proto-nav-frost-shell-progress" as string]: shellProgress,
  } as CSSProperties;

  return (
    <nav
      className={`desktop-punched-nav desktop-home-nav fixed top-0 left-0 right-0 z-[50] proto-nav-scroll-frost proto-nav--motion-ready ${
        alwaysPunched ? "proto-nav-always-punched desktop-punched-nav--punched " : ""
      }${scrolled ? "proto-nav--scrolled " : ""}${className}`.trim()}
      style={navStyle}
      aria-label={ariaLabel}
    >
      <div className="proto-nav-frost-shell">
        <div className="desktop-punched-nav__strip flex items-center justify-between">
          {logoLink ? (
            <Link
              href="/"
              className={`proto-nav-chrome-logo ${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}
            >
              Doe
            </Link>
          ) : (
            <span className={`proto-nav-chrome-logo ${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}>
              Doe
            </span>
          )}

          <div className="proto-nav-chrome-actions">
            <DesktopNavActionRow
              {...cta}
              punched={alwaysPunched}
              linksEnabled={navActionLinksEnabled}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
