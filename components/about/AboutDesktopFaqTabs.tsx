"use client";

import { useState } from "react";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_FAQ_ANSWER_TW,
  ABOUT_DESKTOP_FAQ_ITEM_TW,
  ABOUT_DESKTOP_FAQ_LIST_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_DESKTOP_FAQ_ITEMS } from "@/lib/about/about-desktop-faq";

/** Desktop /about section three — expandable FAQ tabs beside the beige panel. */
export function AboutDesktopFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={ABOUT_DESKTOP_FAQ_LIST_TW}>
      {ABOUT_DESKTOP_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`flex min-h-0 flex-col ${
              isOpen ? "border-t-2 border-[#1E343A]" : index > 0 ? "border-t border-[#DDD9D2]" : ""
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(index)}
              className={`flex w-full min-h-0 flex-1 items-center text-left transition-colors ${
                isOpen ? "font-medium text-[#1E343A]" : "font-normal text-[#9A8F82] hover:text-[#1E343A]/80"
              } ${ABOUT_DESKTOP_FAQ_ITEM_TW}`}
            >
              {item.question}
            </button>

            <div
              className={`grid min-h-0 transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className={`${ABOUT_DESKTOP_FAQ_ANSWER_TW} ${ABOUT_DESKTOP_ARTICLE_BODY_TW}`}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
