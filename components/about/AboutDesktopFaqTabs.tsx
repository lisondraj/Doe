"use client";

import { useState } from "react";

import {
  ABOUT_DESKTOP_FAQ_ANSWER_BODY_TW,
  ABOUT_DESKTOP_FAQ_ANSWER_TW,
  ABOUT_DESKTOP_FAQ_ITEM_TW,
  ABOUT_DESKTOP_FAQ_LIST_TW,
  ABOUT_DESKTOP_FAQ_PANEL_TW,
} from "@/lib/about/about-layout-styles";
import { ABOUT_DESKTOP_FAQ_ITEMS } from "@/lib/about/about-desktop-faq";

/** Desktop /about section four — expandable FAQ tabs beside the beige panel. */
export function AboutDesktopFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={`about-desktop-faq-panel ${ABOUT_DESKTOP_FAQ_PANEL_TW} min-h-0`}>
      <div className={ABOUT_DESKTOP_FAQ_LIST_TW}>
        {ABOUT_DESKTOP_FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className={`flex min-h-0 basis-0 flex-col overflow-hidden border-t transition-[flex-grow,border-color] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grow-[1.85]" : "grow"
              } ${
                isOpen ? "border-[#1E343A]" : index > 0 ? "border-[#DDD9D2]" : "border-transparent"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(index)}
                className={`w-full text-left transition-[color,font-weight] duration-300 ease-out ${
                  isOpen
                    ? "shrink-0 pt-4 font-medium text-[#1E343A] md:pt-5"
                    : "flex min-h-0 flex-1 items-center font-normal text-[#9A8F82] hover:text-[#1E343A]/80"
                } ${ABOUT_DESKTOP_FAQ_ITEM_TW}`}
              >
                {item.question}
              </button>

              <div
                className={`grid min-h-0 transition-[grid-template-rows,opacity,flex-grow] duration-300 ease-out motion-reduce:transition-none ${
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
