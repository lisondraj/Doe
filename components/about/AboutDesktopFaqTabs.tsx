"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  ABOUT_DESKTOP_FAQ_ANSWER_BODY_TW,
  ABOUT_DESKTOP_FAQ_ANSWER_TW,
  ABOUT_DESKTOP_FAQ_ITEM_TW,
  ABOUT_DESKTOP_FAQ_LIST_TW,
  ABOUT_DESKTOP_FAQ_PANEL_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_DESKTOP_FAQ_ITEMS } from "@/lib/about/about-desktop-faq";

const FAQ_RULE_TRANSITION_MS = 300;

/** Desktop /about section four — expandable FAQ tabs beside the beige panel. */
export function AboutDesktopFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeRuleTop, setActiveRuleTop] = useState(0);
  const [ruleTransitionEnabled, setRuleTransitionEnabled] = useState(false);

  const measureActiveRule = useCallback(() => {
    const row = rowRefs.current[openIndex];
    if (!row) return;
    setActiveRuleTop(row.offsetTop);
  }, [openIndex]);

  useLayoutEffect(() => {
    setRuleTransitionEnabled(true);
    measureActiveRule();

    const timeoutId = window.setTimeout(() => {
      setRuleTransitionEnabled(false);
    }, FAQ_RULE_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [openIndex, measureActiveRule]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    measureActiveRule();

    const observer = new ResizeObserver(measureActiveRule);
    observer.observe(list);
    rowRefs.current.forEach((row) => {
      if (row) observer.observe(row);
    });

    return () => observer.disconnect();
  }, [measureActiveRule]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === list || rowRefs.current.some((row) => row === event.target)) {
        measureActiveRule();
      }
    };

    list.addEventListener("transitionend", onTransitionEnd);
    return () => list.removeEventListener("transitionend", onTransitionEnd);
  }, [measureActiveRule]);

  return (
    <div className={`${ABOUT_DESKTOP_FAQ_PANEL_TW} min-h-0`}>
      <div ref={listRef} className={ABOUT_DESKTOP_FAQ_LIST_TW}>
        <div
          className={`pointer-events-none absolute left-0 right-0 top-0 z-10 h-0.5 bg-[#1E343A] motion-reduce:transition-none ${
            ruleTransitionEnabled ? "transition-transform duration-300 ease-out" : ""
          }`}
          style={{ transform: `translateY(${activeRuleTop}px)` }}
          aria-hidden
        />

        {ABOUT_DESKTOP_FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className={`flex min-h-0 flex-col ${index > 0 ? "border-t border-[#DDD9D2]" : ""}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(index)}
                className={`w-full text-left transition-colors ${
                  isOpen
                    ? "shrink-0 pt-4 font-medium text-[#1E343A] md:pt-5"
                    : "flex min-h-0 flex-1 items-center font-normal text-[#9A8F82] hover:text-[#1E343A]/80"
                } ${ABOUT_DESKTOP_FAQ_ITEM_TW}`}
              >
                {item.question}
              </button>

              <div
                className={`grid min-h-0 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] flex-1 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className={`${ABOUT_DESKTOP_FAQ_ANSWER_TW} ${ABOUT_DESKTOP_FAQ_ANSWER_BODY_TW}`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
