"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { money } from "@/lib/demo/demo-clinic";
import type { DemoMessage, DemoThreadId } from "@/lib/demo/demo-types";

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

export type ChatMode = "concierge" | "negotiate";
export type ChatItem = DemoMessage & { thread: DemoThreadId };
export type Chip = { text: string; thread: DemoThreadId };

const ORDER: DemoThreadId[] = ["concierge", "negotiate", "forms"];

/** Every thread on one timeline, oldest first. Messages written in the same instant keep their thread's order. */
export function mergeThreads(threads: Record<DemoThreadId, DemoMessage[]>): ChatItem[] {
  return ORDER.flatMap((thread, t) => threads[thread].map((m, i) => ({ m: { ...m, thread }, key: [Date.parse(m.at), t, i] as const })))
    .sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.key[2] - b.key[2])
    .map((x) => x.m);
}

const TAG: Record<DemoThreadId, string | null> = { concierge: null, negotiate: "Negotiation", forms: "Forms" };

/**
 * The conversation between the user's agent and the clinic, in one place: questions and price negotiation share a
 * timeline, and the composer's switch picks which the next message is. Offers the clinic makes sit in the timeline
 * with Accept and Decline.
 */
export function DemoChat({
  items,
  typing,
  mode,
  onMode,
  chips,
  negotiateBar,
  onSend,
  onOffer,
}: {
  items: ChatItem[];
  typing: boolean;
  mode: ChatMode;
  onMode: (m: ChatMode) => void;
  chips: Chip[];
  /** What's being negotiated, shown over the composer in Negotiate mode. */
  negotiateBar: ReactNode;
  onSend: (thread: DemoThreadId, text: string) => Promise<unknown> | void;
  onOffer: (messageId: string, accept: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items.length, typing]);

  const send = (thread: DemoThreadId, text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setDraft("");
    void onSend(thread, t);
  };

  return (
    <div className="grow min-h-0 flex flex-col">
      <div ref={list} className="grow min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-[14px] px-[16px] py-[12px] border-t border-solid border-[#2819100F]">
        {items.map((m, i) => {
          if (m.from === "system") {
            return (
              <p key={m.id} className="self-center max-w-[90%] text-center text-[12px] leading-[16px] text-[#28191080]">
                {m.text}
              </p>
            );
          }
          const mine = m.from === "agent";
          const prev = items[i - 1];
          const grouped = prev && prev.from === m.from && prev.thread === m.thread && prev.by === m.by && Date.parse(m.at) - Date.parse(prev.at) < 120_000;
          return (
            <div key={m.id} className={`flex flex-col max-w-[84%] gap-[4px] ${mine ? "self-end items-end" : "self-start items-start"} ${grouped ? "-mt-[8px]" : ""}`}>
              {!grouped && (
                <span className="px-[2px] text-[11.5px] leading-[14px] text-[#28191080]">
                  <span className="font-[600] text-[#281910B3]">{mine ? "You" : m.by === "staff" ? "Clinic Staff" : "Clinic Agent"}</span> · {time(m.at)}
                  {TAG[m.thread] && <span className="ml-[6px] px-[6px] py-[1px] rounded-[6px] bg-[#F4EEDF] text-[10.5px] font-[600] text-[#28191099]">{TAG[m.thread]}</span>}
                </span>
              )}
              <div className={`px-[14px] py-[9px] rounded-[18px] text-[14.5px] leading-[20px] ${mine ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}>{m.text}</div>
              {m.offer && <Offer offer={m.offer} onAnswer={m.offer.status === "open" ? (accept) => onOffer(m.id, accept) : undefined} />}
            </div>
          );
        })}
        {typing && (
          <div className="self-start flex gap-[4px] px-[14px] py-[12px] rounded-[18px] bg-[#F4EEDF]" aria-label="Clinic is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[6px] h-[6px] rounded-full bg-[#28191066] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-solid border-[#2819100F] pb-[max(8px,env(safe-area-inset-bottom))]">
        {mode === "negotiate" && negotiateBar}
        <div className="flex gap-[6px] overflow-x-auto px-[12px] pt-[10px] [scrollbar-width:none]">
          {chips.map((c) => (
            <button
              key={c.text}
              type="button"
              onClick={() => send(c.thread, c.text)}
              className="shrink-0 h-[32px] px-[12px] rounded-[999px] border border-solid border-[#2819101F] text-[12.5px] font-[500] text-[#281910] hover:bg-[#F4EEDF] transition-colors duration-150"
            >
              {c.text}
            </button>
          ))}
        </div>
        <form
          className="flex items-end gap-[8px] p-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            send(mode, draft);
          }}
        >
          <div className="grow min-w-0 flex flex-col rounded-[22px] bg-[#F4EEDF]">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={mode === "negotiate" ? "Propose a price or ask for a deal" : "Ask the clinic for your user"}
              aria-label="Message"
              className="h-[44px] px-[16px] bg-transparent text-[16px] md:text-[14px] text-[#281910] placeholder:text-[#2819106B] outline-none"
            />
            <div role="radiogroup" aria-label="Message type" className="flex gap-[2px] px-[6px] pb-[6px]">
              {(
                [
                  ["concierge", "Ask"],
                  ["negotiate", "Negotiate"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={mode === id}
                  onClick={() => onMode(id)}
                  className={`h-[28px] px-[12px] rounded-full text-[12.5px] font-[600] transition-colors duration-150 ${mode === id ? "bg-[#FFFCF1] text-[#281910] shadow-[0_1px_2px_rgba(58,37,22,0.08)]" : "text-[#28191099] hover:text-[#281910]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || typing}
            className="shrink-0 w-[44px] h-[44px] mb-[4px] flex items-center justify-center rounded-full bg-[#3A2516] disabled:bg-[#28191033] transition-colors duration-150"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function Offer({ offer, onAnswer }: { offer: NonNullable<DemoMessage["offer"]>; onAnswer?: (accept: boolean) => void }) {
  return (
    <div className="w-[270px] max-w-full p-[12px] rounded-[16px] border-[1.5px] border-solid border-[#3A2516]">
      <div className="text-[11.5px] leading-[14px] font-[600] text-[#28191099]">Offer From Clinic</div>
      <div className="mt-[4px] flex items-baseline justify-between gap-[8px]">
        <span className="text-[14px] leading-[18px] font-[600]">{offer.label}</span>
        <span className="text-[18px] leading-[22px] font-[700]">{money(offer.price)}</span>
      </div>
      {onAnswer ? (
        <div className="mt-[10px] flex gap-[6px]">
          <button type="button" onClick={() => onAnswer(true)} className="grow h-[34px] rounded-[999px] bg-[#3A2516] text-[#FFFCF1] text-[13px] font-[600]">
            Accept for user
          </button>
          <button type="button" onClick={() => onAnswer(false)} className="h-[34px] px-[14px] rounded-[999px] bg-[#F4EEDF] text-[13px] font-[600] text-[#281910]">
            Decline
          </button>
        </div>
      ) : (
        <div className={`mt-[8px] text-[12px] leading-[16px] font-[600] ${offer.status === "accepted" ? "text-[#4C7A4F]" : "text-[#28191080]"}`}>
          {offer.status === "accepted" ? "Accepted · locked for 48 hours" : offer.status === "declined" ? "Declined" : "Open"}
        </div>
      )}
    </div>
  );
}
