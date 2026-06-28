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
          <div key={item.question} className="min-w-0">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(index)}
              className={`block w-full border-t text-left transition-colors ${
                isOpen
                  ? "border-[#1E343A] pt-5 md:pt-6"
                  : "border-[#DDD9D2] pt-4 md:pt-5 hover:text-[#1E343A]/80"
              } ${ABOUT_DESKTOP_FAQ_ITEM_TW} ${isOpen ? "font-medium text-[#1E343A]" : "font-normal text-[#9A8F82]"}`}
            >
              {item.question}
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
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
      <div className="border-t border-[#DDD9D2]" aria-hidden />
    </div>
  );
}
