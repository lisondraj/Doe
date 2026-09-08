"use client";

import { useEffect, useRef, useState } from "react";

import "@/lib/doedtc/westfield-emr-chart.css";
import "@/lib/doedtc/westfield-emr-chat.css";

const CHAT_WIDTH = 620;
const CHAT_HEIGHT = 1032;

function AgentCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M3.2 8.1L6.4 11.2L12.8 4.6"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AgentSteps({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-col w-[508px] shrink-0 gap-1.5">
      {labels.map((label) => (
        <div key={label} className="flex items-center w-full gap-2.5 h-[22px] shrink-0">
          <div className="w-9 h-2 shrink-0" />
          <AgentCheckIcon />
          <div className="flex flex-col w-0 grow">
            <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[13px] leading-[18px]">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserBubble({ children }: { children: string }) {
  return (
    <div className="flex w-full justify-end shrink-0">
      <div className="landing-emr-glass-blue w-[520px] shrink-0 py-4 px-5 rounded-[22px]">
        <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[17px] leading-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function WestfieldEmrChartChatCanvas() {
  return (
    <div className="landing-emr-raised [font-synthesis:none] wrap-anywhere flex flex-col rounded-3xl overflow-clip w-[620px] h-[1032px] antialiased">
      <div className="flex items-center w-full shrink-0 pr-4 pl-5 py-3.5 border-b border-b-solid border-b-[#EBEBF0]">
        <div className="flex flex-col w-0 grow gap-[3px]">
          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-sm leading-5">
            Elena Vasquez
          </div>
        </div>
        <div className="shrink-0 text-center content-center font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium flex justify-center flex-wrap text-black size-7 text-xl leading-5">
          ×
        </div>
      </div>
      <div className="flex flex-col w-[598px] h-0 grow min-h-0 pt-5 pr-5 pb-2 pl-[39px] overflow-clip gap-4 justify-end">
        <div className="w-full h-0 grow shrink-0" />
        <div className="flex items-center w-full shrink-0 gap-3 pt-1 pb-0.5">
          <div className="w-0 grow h-px bg-[#E5E5EA]" />
          <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#8E8E93] text-xs leading-4">
            5 Sep 7:42
          </div>
          <div className="w-0 grow h-px bg-[#E5E5EA]" />
        </div>
        <UserBubble>
          I have Elena Vasquez&apos;s diabetes follow-up at 8:20 this morning. I haven&apos;t seen her yet. Her labs
          are already back. Can you walk me through the chart and tell me what&apos;s changed since her visit in August?
        </UserBubble>
        <AgentSteps
          labels={["Reading Results", "Opened Progress note", "Pulled glucometer export"]}
        />
        <div className="flex flex-col w-full shrink-0 gap-2.5">
          <div className="whitespace-pre-wrap font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            I pulled her recent results and the August progress note. Her potassium has gone from 5.1 to 5.8 since April,
            and her A1c came back at 7.4. The last note mentions high home glucose readings and a lisinopril dose change
            on August 18th.
            {"\n\n"}
            A couple of things are worth confirming before she arrives:
          </div>
        </div>
        <div className="flex w-[520px] items-start h-fit">
          <div className="w-[22px] shrink-0 pt-px">
            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-base leading-6">
              1
            </div>
          </div>
          <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            Did the August note actually start her on 20 mg of lisinopril, or is she still on 10 mg?
          </div>
        </div>
        <div className="flex w-[520px] items-start shrink-0 h-fit">
          <div className="w-[22px] shrink-0 pt-px">
            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-base leading-6">
              2
            </div>
          </div>
          <div className="w-0 grow h-fit font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            Is NoSalt on her home medication list, and is metformin documented correctly?
          </div>
        </div>
        <UserBubble>
          The August note shows they increased her to 20 mg. She&apos;s on metformin 1000 mg twice daily, and NoSalt is
          listed on her home med rec. I&apos;ll double-check both with her when she comes in.
          {"\n\n"}
          Is there anything else I should have ready before she walks in?
        </UserBubble>
        <AgentSteps
          labels={[
            "Checking endocrine consult notes",
            "Pulling foot x-ray report from July",
            "Reviewing prior authorization status",
          ]}
        />
      </div>
      <div className="flex w-full shrink-0 pt-3 pb-4 flex-col px-4">
        <div className="landing-emr-raised flex flex-col w-full shrink-0 p-3 rounded-[22px] overflow-clip">
          <div className="landing-emr-raised flex items-center w-full shrink-0 h-[60px] rounded-[20px] gap-3 pr-2.5 pl-5">
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" fill="none" stroke="#8E8E93" strokeWidth="1.75" />
              <path d="M16.5 16.5 L21 21" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#8E8E93] text-[15px] leading-5">
              Ask this chart
            </div>
            <div className="landing-emr-glass-blue flex items-center justify-center shrink-0 rounded-[14px] size-12">
              <div className="flex font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[13px] leading-4">
                &gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WestfieldEmrChartChatPreview() {
  const scalerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = scalerRef.current;
    if (!node) return;
    const sync = () => {
      setScale(node.clientWidth / CHAT_WIDTH);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div ref={scalerRef} className="landing-emr-chat-scaler">
      <div
        className="landing-emr-chat-stage pointer-events-none select-none"
        style={{
          height: CHAT_HEIGHT * scale,
        }}
        aria-hidden
      >
        <div className="landing-emr-chat-canvas" style={{ transform: `scale(${scale})` }}>
          <WestfieldEmrChartChatCanvas />
        </div>
      </div>
    </div>
  );
}
