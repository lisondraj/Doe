"use client";

import { useEffect, useRef, useState } from "react";

import { Product2ActiveAgentsOrbit } from "@/components/product2/Product2ActiveAgentsOrbit";
import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/product2/product2-landing.css";
import { suisseIntl } from "@/lib/home/fonts";

/** Active agents orbit — no outer console shell, sits directly on the brown band. */
export function DoeHealthActiveAgentsCard({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [orbitPaused, setOrbitPaused] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const sync = () => {
      const rect = node.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      setOrbitPaused(!inView || document.visibilityState !== "visible");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOrbitPaused(!entry.isIntersecting || document.visibilityState !== "visible");
      },
      { rootMargin: "12% 0px", threshold: 0 },
    );
    observer.observe(node);
    sync();
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`doehealth-active-agents${className ? ` ${className}` : ""}${
        orbitPaused ? " doehealth-active-agents--orbit-paused" : ""
      } ${suisseIntl.className}`}
      aria-label="Seven active agents"
    >
      <div className="doehealth-active-agents__stage">
        <Product2ActiveAgentsOrbit
          showEditButton={false}
          showAgentIcons
          variant="brown-console"
          className="doehealth-active-agents__orbit"
        />
      </div>
    </div>
  );
}
