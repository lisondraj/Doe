"use client";

import { useState } from "react";

import {
  ABOUT_MOBILE_FAQ_ANSWER_BODY_TW,
  ABOUT_MOBILE_FAQ_ANSWER_TW,
  ABOUT_MOBILE_FAQ_ITEM_TW,
  ABOUT_MOBILE_FAQ_LIST_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_DESKTOP_FAQ_ITEMS } from "@/lib/about/about-desktop-faq";

/** iPhone /about — single-column FAQ accordion within page margins. */
export function AboutMobileFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={ABOUT_MOBILE_FAQ_LIST_TW}>
      {ABOUT_DESKTOP_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`flex flex-col border-t transition-[border-color] duration-300 ease-out motion-reduce:transition-none ${
              isOpen ? "border-[#1E343A]" : index > 0 ? "border-[#DDD9D2]" : "border-transparent"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(index)}
              className={`w-full py-4 text-left transition-colors duration-300 ease-out iphone-page:py-5 ${
                isOpen
                  ? "font-medium text-[#1E343A]"
                  : "font-normal text-[#9A8F82] active:text-[#1E343A]/80"
              } ${ABOUT_MOBILE_FAQ_ITEM_TW}`}
            >
              {item.question}
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className={`${ABOUT_MOBILE_FAQ_ANSWER_TW} ${ABOUT_MOBILE_FAQ_ANSWER_BODY_TW}`}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
