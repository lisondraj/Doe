"use client";

import { useEffect, useState } from "react";

import { JOIN_APPLY_SECTION_ID } from "@/lib/join/join-layout";

/** True once the applicant card section has entered the viewport. */
export function useJoinApplySectionInView() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = document.getElementById(JOIN_APPLY_SECTION_ID);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return inView;
}
