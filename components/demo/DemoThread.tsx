"use client";

import { useEffect, useRef, useState } from "react";

import { money } from "@/lib/demo/demo-clinic";
import type { DemoMessage } from "@/lib/demo/demo-types";

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

/**
 * One conversation between the user's agent and the clinic's agent: messages, any price the clinic puts on the
 * table, suggested asks, and a composer. Used inline on the page and inside the agent inbox.
 */
export function DemoThread({
  messages,
  typing,
  chips,
  placeholder,
  onSend,
  onOffer,
  className = "",
}: {
  messages: DemoMessage[];
  typing: boolean;
  chips: string[];
  placeholder: string;
  onSend: (text: string) => Promise<unknown> | void;
  onOffer?: (messageId: string, accept: boolean) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState("");
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setDraft("");
    void onSend(t);
  };

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div ref={list} className="grow min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-[10px] p-[14px]">
        {messages.map((m) =>
          m.from === "system" ? (
            <p key={m.id} className="self-center max-w-[90%] text-center text-[12px] leading-[16px] font-[500] text-[#28191080] px-[10px] py-[4px] rounded-[999px] bg-[#2819100A]">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className={`flex flex-col max-w-[86%] gap-[4px] ${m.from === "agent" ? "self-end items-end" : "self-start items-start"}`}>
              <span className="px-[4px] text-[11px] leading-[14px] font-[600] text-[#28191073]">
                {m.from === "agent" ? "You" : m.by === "staff" ? "Brooks clinic · staff" : "Brooks clinic agent"} · {time(m.at)}
              </span>
              <div
                className={`px-[14px] py-[10px] rounded-[18px] text-[14px] leading-[20px] ${
                  m.from === "agent" ? "bg-[#140C04] text-[#FFFCF1] rounded-br-[6px]" : "bg-[#FFFCF1] text-[#281910] rounded-bl-[6px] border border-solid border-[#2819101A]"
                }`}
              >
                {m.text}
              </div>
              {m.offer && (
                <div className="w-[260px] max-w-full p-[12px] rounded-[16px] bg-[#FCCFB8]/60 border border-solid border-[#28191014]">
                  <div className="text-[11px] leading-[14px] font-[600] uppercase tracking-[0.06em] text-[#2819108C]">Offer from clinic</div>
                  <div className="mt-[4px] flex items-baseline justify-between gap-[8px]">
                    <span className="text-[14px] leading-[18px] font-[600]">{m.offer.label}</span>
                    <span className="text-[18px] leading-[22px] font-[700]">{money(m.offer.price)}</span>
                  </div>
                  {m.offer.status === "open" && onOffer ? (
                    <div className="mt-[10px] flex gap-[6px]">
                      <button
                        type="button"
                        onClick={() => onOffer(m.id, true)}
                        className="grow h-[34px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600]"
                      >
                        Accept for user
                      </button>
                      <button
                        type="button"
                        onClick={() => onOffer(m.id, false)}
                        className="h-[34px] px-[14px] rounded-[999px] bg-[#FFFCF1] text-[13px] font-[600] text-[#281910]"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="mt-[8px] text-[12px] leading-[16px] font-[600] text-[#281910B3]">
                      {m.offer.status === "accepted" ? "Accepted · locked for 48 hours" : m.offer.status === "declined" ? "Declined" : "Open"}
                    </div>
                  )}
                </div>
              )}
            </div>
          ),
        )}
        {typing && (
          <div className="self-start flex gap-[4px] px-[14px] py-[12px] rounded-[18px] rounded-bl-[6px] bg-[#FFFCF1] border border-solid border-[#2819101A]" aria-label="Clinic agent is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[6px] h-[6px] rounded-full bg-[#28191066] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 flex gap-[6px] overflow-x-auto px-[14px] pb-[8px] [scrollbar-width:none]">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => send(c)}
            className="shrink-0 h-[32px] px-[12px] rounded-[999px] bg-[#FFFCF1] border border-solid border-[#2819101F] text-[12.5px] leading-[16px] font-[500] text-[#281910] hover:bg-[#EEE6D6] transition-colors duration-150"
          >
            {c}
          </button>
        ))}
      </div>
      <form
        className="shrink-0 flex items-center gap-[8px] p-[10px] pt-[2px]"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="grow min-w-0 h-[44px] px-[16px] rounded-[999px] bg-[#FFFCF1] border border-solid border-[#2819101F] text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819106B] outline-none focus:border-[#28191059]"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!draft.trim()}
          className="shrink-0 w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[#140C04] disabled:bg-[#28191033] transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
