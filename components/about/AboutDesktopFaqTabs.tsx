"use client";

import { useState } from "react";

import {
  ABOUT_DESKTOP_ARTICLE_BODY_TW,
  ABOUT_DESKTOP_FAQ_ANSWER_TW,
  ABOUT_DESKTOP_FAQ_ITEM_TW,
  ABOUT_DESKTOP_FAQ_LIST_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_DESKTOP_FAQ_ITEMS } from "@/lib/about/about-desktop-faq";

/** Desktop /about section four — expandable FAQ tabs beside the beige panel. */
export function AboutDesktopFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);
  const lastIndex = ABOUT_DESKTOP_FAQ_ITEMS.length - 1;

  return (
    <div className={ABOUT_DESKTOP_FAQ_LIST_TW}>
      {ABOUT_DESKTOP_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const isLast = index === lastIndex;
        const showTopRule = index > 0 || isOpen;

        return (
          <div
            key={item.question}
            className={`flex min-h-0 flex-col ${
              showTopRule ? (isOpen ? "border-t-2 border-[#1E343A]" : "border-t border-[#DDD9D2]") : ""
            }`}
          >
            {isOpen ? (
              <>
                <button
                  type="button"
                  aria-expanded
                  onClick={() => setOpenIndex(index)}
                  className={`w-full shrink-0 pt-5 text-left transition-colors md:pt-6 ${
                    isLast ? "pb-0" : "pb-0"
                  } font-medium text-[#1E343A] ${ABOUT_DESKTOP_FAQ_ITEM_TW}`}
                >
                  {item.question}
                </button>

                <div className={`min-h-0 ${isLast ? "flex flex-1 flex-col justify-end" : ""}`}>
                  <p className={`${ABOUT_DESKTOP_FAQ_ANSWER_TW} ${ABOUT_DESKTOP_ARTICLE_BODY_TW}`}>{item.answer}</p>
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 items-center">
                <button
                  type="button"
                  aria-expanded={false}
                  onClick={() => setOpenIndex(index)}
                  className={`w-full py-2 text-left transition-colors font-normal text-[#9A8F82] hover:text-[#1E343A]/80 ${ABOUT_DESKTOP_FAQ_ITEM_TW}`}
                >
                  {item.question}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
