"use client";

import { useState } from "react";

import {
  PROTO_INVEST_FAQ_ANSWER_BODY_TW,
  PROTO_INVEST_FAQ_ANSWER_TW,
  PROTO_INVEST_FAQ_ITEM_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";
import { PROTO_INVEST_FAQ_ITEMS } from "@/lib/proto-invest/proto-invest-content";

/** /proto-invest — FAQ accordion with proto dark styling. */
export function ProtoInvestMobileFaqTabs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex w-full flex-col">
      {PROTO_INVEST_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`flex flex-col border-t transition-[border-color] duration-300 ease-out motion-reduce:transition-none ${
              isOpen ? "border-[#2A3538]" : index > 0 ? "border-[#2A3538]/60" : "border-transparent"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(index)}
              className={`w-full py-4 text-left transition-colors duration-300 ease-out iphone-page:py-5 ${
                isOpen ? "font-medium text-white" : "font-normal text-white/45 active:text-white/70"
              } ${PROTO_INVEST_FAQ_ITEM_TW}`}
            >
              {item.question}
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className={`${PROTO_INVEST_FAQ_ANSWER_TW} ${PROTO_INVEST_FAQ_ANSWER_BODY_TW}`}>
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
