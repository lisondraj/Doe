"use client";

import { useEffect, useRef, useState } from "react";

import "@/lib/doedtc/westfield-emr-chat.css";

const CHAT_WIDTH = 620;
const CHAT_HEIGHT = 1032;

export function WestfieldEmrChartChatCanvas() {
  return (
    <div
      className="[font-synthesis:none] wrap-anywhere flex flex-col rounded-3xl overflow-clip w-[620px] h-[1032px] bg-white antialiased"
      style={{
        backgroundImage:
          "linear-gradient(in oklab 225deg, oklab(92.4% -0.007 -0.030) 0%, oklab(97.2% -0.002 -0.013) 52%, oklab(100% 0 0) 100%)",
      }}
    >
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
        <div className="flex w-full justify-end shrink-0">
          <div className="w-[520px] shrink-0 py-4 px-5 rounded-[22px] bg-[#2563EB]">
            <div className="whitespace-pre-wrap font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[17px] leading-6">
              Elena is 8:20 diabetes follow-up. I have not seen her yet. Labs are already in. K 5.8 High, A1c 7.4.
              Walk the chart before she gets here.
              {"\n\n"}
              What changed since August, and do I hold the ACE this morning?
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[508px] shrink-0 gap-1.5">
          {["Reading Results", "Opened Progress note", "Pulled glucometer export"].map((label) => (
            <div key={label} className="flex items-center w-full gap-2.5 h-[22px] shrink-0">
              <div className="w-9 h-2 shrink-0" />
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
              <div className="flex flex-col w-0 grow">
                <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[13px] leading-[18px]">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full shrink-0 gap-2.5">
          <div className="whitespace-pre-wrap font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            K climbed 5.1 to 5.8 since April. The last note says home sugars are high, and lisinopril went up on 18 Aug.
            That plus eGFR 52 can push potassium.
            {"\n\n"}
            Two things to settle before she sits down.
          </div>
        </div>
        <div className="flex w-[520px] items-start h-fit">
          <div className="w-[22px] shrink-0 pt-px">
            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-base leading-6">
              1
            </div>
          </div>
          <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            Did the 18 Aug note actually start 20 mg, or is she still on 10?
          </div>
        </div>
        <div className="flex w-[520px] items-start shrink-0 h-fit">
          <div className="w-[22px] shrink-0 pt-px">
            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-base leading-6">
              2
            </div>
          </div>
          <div className="w-0 grow h-fit font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
            Any NoSalt or missed metformin on the home med rec?
          </div>
        </div>
        <div className="flex w-full justify-end shrink-0">
          <div className="w-[520px] shrink-0 py-4 px-5 rounded-[22px] bg-[#2563EB]">
            <div className="whitespace-pre-wrap font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[17px] leading-6">
              18 Aug note says they increased to 20 mg. Metformin 1000 BID. NoSalt is on the med rec. I will confirm
              both when she arrives.
              {"\n\n"}
              Hold the ACE this morning until I see her?
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[273px] shrink-0 gap-1.5">
          {[
            ["Calling endocrine on-call", "Ringing"],
            ["Fetching foot x-ray report", "Pulling"],
            ["Paging Dr. Roberts", "Sent"],
          ].map(([label, status]) => (
            <div key={label} className="flex items-center w-full gap-2.5 h-[22px] shrink-0">
              <div className="w-9 h-2 shrink-0" />
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
              <div className="flex flex-col w-0 grow">
                <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[13px] leading-[18px]">
                  {label}
                </div>
              </div>
              <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#2563EB] text-xs leading-4">
                {status}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[17px] leading-6">
          One moment. Still working through those last three.
        </div>
      </div>
      <div className="flex w-full shrink-0 pt-3 pb-4 flex-col px-4">
        <div
          className="flex flex-col w-full shrink-0 p-3 rounded-[22px] overflow-clip"
          style={{
            backgroundImage:
              "linear-gradient(in oklab 180deg, oklab(88% -0.009 -0.047) 0%, oklab(91.9% -0.009 -0.032) 55%, oklab(95.5% -0.005 -0.017) 100%)",
          }}
        >
          <div
            className="flex items-center w-full shrink-0 h-[60px] rounded-[20px] gap-3 pr-2.5 pl-5 [box-shadow:#2563EB1A_0px_8px_20px] bg-white bg-origin-border border border-solid border-[#FFFFFFEB]"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 180deg, oklab(100% 0 0) 0%, oklab(97.6% -.0001 -0.011) 100%)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" fill="none" stroke="#8E8E93" strokeWidth="1.75" />
              <path d="M16.5 16.5 L21 21" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#8E8E93] text-[15px] leading-5">
              Ask this chart
            </div>
            <div
              className="flex items-center justify-center shrink-0 rounded-[14px] size-12"
              style={{
                backgroundImage:
                  "linear-gradient(in oklab 180deg, oklab(62.3% -0.033 -0.185) 0%, oklab(54.6% -0.027 -0.214) 55%, oklab(48.8% -0.021 -0.216) 100%)",
              }}
            >
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
