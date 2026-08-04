"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";

import {
  DoeHealthPhoneBandCluster,
  DoeHealthPhoneReveal,
} from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";

const DOE_INTRO_VIDEO_SRC = "/motion/doe-intro.mp4";

function SectionTitleArrow({ gradientId }: { gradientId: string }) {
  return (
    <svg
      className="doehealth-intro-band__section-title-arrow"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="14" y1="2" x2="14" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8c08e" />
          <stop offset="52%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#d4a574" stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <path
        d="M5.5 14h15.5M15.25 8.25 21.5 14l-6.25 5.75"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Exported Doe intro — idle preview at ~50%, first play starts at 0s. */
export function DoeHealthIntroVideoBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.introVideoSectionTitle;
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasStartedRef = useRef(false);
  const arrowGradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    const showPreviewFrame = () => {
      if (hasStartedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.currentTime = video.duration * 0.5;
    };

    const onPlay = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;
      video.pause();
      video.currentTime = 0;
      void video.play();
    };

    video.addEventListener("loadedmetadata", showPreviewFrame);
    video.addEventListener("play", onPlay);

    if (video.readyState >= 1) {
      showPreviewFrame();
    }

    return () => {
      video.removeEventListener("loadedmetadata", showPreviewFrame);
      video.removeEventListener("play", onPlay);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const sync = () => {
      const rect = section.getBoundingClientRect();
      const nearViewport = rect.bottom > -window.innerHeight * 0.35 && rect.top < window.innerHeight * 1.35;

      if (nearViewport) {
        if (video.preload === "none") {
          video.preload = "metadata";
        }
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === "none") {
            video.preload = "metadata";
          }
          return;
        }
        video.pause();
      },
      { rootMargin: "35% 0px", threshold: 0 },
    );
    observer.observe(section);
    sync();
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--intro-video relative z-10 flex w-full shrink-0 flex-col ${suisseIntl.className} ${inter.className} ${lora.className}`}
      aria-label={`${line1} ${line2}, Doe intro video`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <DoeHealthPhoneBandCluster>
          <DoeHealthPhoneReveal segment="title">
            <div className="doehealth-intro-stage">
              <div className="doehealth-intro-video-sequence">
                <div className="doehealth-intro-video-sequence__stage">
                  <div className="doehealth-intro-video__player-wrap">
                    <video
                      ref={videoRef}
                      className="doehealth-intro-video__video"
                      src={DOE_INTRO_VIDEO_SRC}
                      controls
                      playsInline
                      loop
                      preload="none"
                      aria-label={`${line1} ${line2}, Doe intro video`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DoeHealthPhoneReveal>

          <DoeHealthPhoneReveal segment="carousel">
            <h2
              className={`doehealth-intro-band__section-title doehealth-intro-band__section-title--about-link ${suisseIntl.className}`}
              aria-label={`${line1} ${line2}`}
            >
              <Link href="/about" className="doehealth-intro-band__section-title-link">
                <span className="doehealth-intro-band__section-title-line">{line1}</span>
                <span className="doehealth-intro-band__section-title-line doehealth-intro-band__section-title-line--with-arrow">
                  <span className="doehealth-intro-band__section-title-line-text">{line2}</span>
                  <SectionTitleArrow gradientId={`doehealth-intro-title-arrow-${arrowGradientId}`} />
                </span>
              </Link>
            </h2>
          </DoeHealthPhoneReveal>
        </DoeHealthPhoneBandCluster>
      </div>
    </section>
  );
}
