"use client";

import { useEffect, useRef, useState } from "react";

import { DoeHealthActiveAgentsCard } from "@/components/doehealth/DoeHealthActiveAgentsCard";
import { DoeHealthDaySummaryCard } from "@/components/doehealth/DoeHealthDaySummaryCard";
import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";
import { DOEHEALTH_CALL_HISTORY_INTRO_TURNS } from "@/lib/doehealth/doehealth-call-history-tree";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";
import { MOTION2_DURATION } from "@/lib/motion2/motion2-timeline";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

export function DoeLaunchVideo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-motion2-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-motion2-page");
      html.removeAttribute("data-layout");
    };
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const updateScale = () => {
      const { width, height } = node.getBoundingClientRect();
      setScale(Math.min(width / CANVAS_W, height / CANVAS_H, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div ref={viewportRef} className="motion2-viewport motion2-root">
      <div
        className="motion2-canvas product-brown-mock"
        style={{
          transform: `scale(${scale})`,
          ["--motion2-duration" as string]: `${MOTION2_DURATION}s`,
        }}
        aria-label="Doe launch video"
        role="img"
      >
        {/* S1 · Logo zoom 0–4s */}
        <div className="motion2-scene motion2-scene--s1">
          <div className={`motion2-logo motion2-logo--animate ${lora.className}`}>Doe</div>
        </div>

        {/* S2 · Day summary 4–8.5s */}
        <div className="motion2-scene motion2-scene--s2">
          <div className="motion2-scene-stack motion2-scene-stack--animate">
            <div className="motion2-scene-panel motion2-scene-panel--summary">
              <DoeHealthDaySummaryCard className="motion2-day-summary" />
            </div>
            <h2 className={`motion2-section-title ${suisseIntl.className}`}>
              <span>Your Clinic</span>
              <span>At a Glance</span>
            </h2>
          </div>
        </div>

        {/* S3 · Live call 8.5–13s */}
        <div className="motion2-scene motion2-scene--s3">
          <div className="motion2-scene-stack motion2-scene-stack--animate">
            <div
              className={`motion2-scene-panel motion2-scene-panel--call doehealth-initiatives doehealth-initiatives--wide motion2-call-card ${suisseIntl.className}`}
            >
              <div className="doehealth-initiatives__card">
                <Product2LandingLiveThread
                  showOutcome={false}
                  showActions={false}
                  showAgentSteps={false}
                  showChartProfile={false}
                  turns={DOEHEALTH_CALL_HISTORY_INTRO_TURNS.slice(0, 2)}
                />
              </div>
            </div>
            <h2 className={`motion2-section-title ${suisseIntl.className}`}>
              <span>Automate Your</span>
              <span>Front Desk</span>
            </h2>
          </div>
        </div>

        {/* S4 · Agents 13–17s */}
        <div className="motion2-scene motion2-scene--s4">
          <div className="motion2-scene-stack motion2-scene-stack--animate">
            <div className="motion2-scene-panel motion2-scene-panel--agents">
              <DoeHealthActiveAgentsCard className="motion2-agents" />
            </div>
            <h2 className={`motion2-section-title ${suisseIntl.className}`}>
              <span>Agents for</span>
              <span>every workflow</span>
            </h2>
          </div>
        </div>

        {/* S5 · Outro 17–20s */}
        <div className="motion2-scene motion2-scene--s5 motion2-scene--cream">
          <div className="motion2-outro motion2-outro--animate">
            <div className={`motion2-outro__logo ${lora.className}`}>Doe</div>
            <h2 className={`motion2-outro__headline doehealth-hero-headline ${suisseIntl.className}`}>
              <span>{DOEHEALTH_HERO_HEADLINE.line1}</span>
              <span>{DOEHEALTH_HERO_HEADLINE.line2}</span>
            </h2>
            <p className={`motion2-outro__url ${inter.className}`}>doehealth.care</p>
          </div>
        </div>
      </div>
    </div>
  );
}
