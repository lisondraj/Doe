"use client";

import { useEffect, useRef, useState } from "react";

import { WestfieldEmrChartChatCanvas } from "@/components/doedtc/WestfieldEmrChartChatPreview";
import { WestfieldEmrA1cSheet } from "@/components/doedtc/WestfieldEmrA1cSheet";
import { WestfieldEmrResultsPanel } from "@/components/doedtc/WestfieldEmrResultsPanel";
import { lora } from "@/lib/home/fonts";
import "@/lib/doedtc/westfield-emr-chart.css";

const CHART_TABS = ["Summary", "Timeline", "Notes", "Orders", "Results", "Meds"] as const;

function ChartSidebarTabs() {
  return (
    <div className="flex flex-col w-full shrink-0 [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[6px] rounded-2xl overflow-clip relative -mt-7 [box-shadow:#FFFFFF29_0px_1px_0px_inset] bg-[#FFFFFF1F] border border-solid border-[#FFFFFF38]">
      {CHART_TABS.map((label) => {
        const isResults = label === "Results";
        const isSummary = label === "Summary";
        const tabClass = isResults
          ? "landing-emr-chart-tab landing-emr-chart-tab--results"
          : isSummary
            ? "landing-emr-chart-tab landing-emr-chart-tab--summary"
            : "landing-emr-chart-tab";
        const labelClass = isResults || isSummary
          ? "landing-emr-chart-tab__label"
          : "font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-sm leading-[18px]";

        return (
          <div
            key={label}
            className={`flex items-center h-[40px] shrink-0 pr-[14px] pl-[10px] rounded-[10px] gap-[10px] ${tabClass}`}
          >
            <div className="landing-emr-chart-tab__indicator w-[3px] h-[18px] shrink-0 rounded-[999px]" />
            <div className={labelClass}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function WestfieldEmrPatientChartCanvas() {
  return (
    <div className="landing-emr-chart-base [font-synthesis:none] wrap-anywhere flex overflow-clip w-[1920px] h-[1080px] bg-[#2563EB] antialiased text-xs leading-[16px]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)' }}>
      <div className="flex flex-col w-[72px] h-[1080px] justify-center items-center shrink-0 overflow-visible relative px-[12px]">
        <div className="flex flex-col items-center shrink-0 gap-[32px] overflow-visible">
          <div className="flex items-center justify-center shrink-0 size-[40px]">
            <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <path d="M4 10.4L12 3.6L20 10.4V20.2H14.6V13.8H9.4V20.2H4V10.4Z" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center justify-center shrink-0 size-[40px]">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <circle cx="9" cy="8" r="2.8" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
              <path d="M4.2 18.4C4.4 15.6 6.5 14 9 14s4.6 1.6 4.8 4.4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="16.4" cy="8.3" r="2.3" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
              <path d="M14.6 14.1C16.2 13.7 18.8 14.7 19.2 17.6" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-center shrink-0 size-[40px]">
            <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.2" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" />
              <path d="M3.6 9.6H20.4M8 3.6V6.8M16 3.6V6.8" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-center shrink-0 size-[40px]">
            <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <path d="M4.2 6.4C4.2 5.3 5.1 4.4 6.2 4.4H17.8C18.9 4.4 19.8 5.3 19.8 6.4V14.6C19.8 15.7 18.9 16.6 17.8 16.6H9.1L4.2 20.2V6.4Z" fill="none" stroke="#FFFFFF99" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 pt-[14px] gap-[18px] absolute bottom-[24px] left-[50%] border-t border-t-solid border-t-[#FFFFFF1F]" style={{ translate: '-50%' }}>
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <circle cx="5" cy="5" r="1.35" fill="#FFFFFF" />
              <circle cx="11" cy="5" r="1.35" fill="#FFFFFF" />
              <circle cx="5" cy="11" r="1.35" fill="#FFFFFF" />
              <circle cx="11" cy="11" r="1.35" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <circle cx="8" cy="8" r="2.1" fill="none" stroke="#FFFFFF" strokeWidth="1.35" />
              <path d="M8 1.8V3.4M8 12.6V14.2M1.8 8H3.4M12.6 8H14.2M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M12.7 3.3L11.6 4.4M4.4 11.6L3.3 12.7" fill="none" stroke="#FFFFFF" strokeWidth="1.35" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center shrink-0 absolute top-[28px] left-[50%] size-[40px]" style={{ translate: '-50%' }}>
          <div className="tracking-[-0.02em] font-['Lora-Regular','Lora',system-ui,sans-serif] text-white text-[28px] leading-[28px]">
            D
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[1080px] pr-[14px] pl-[4px] grow py-[14px]">
        <div className="flex w-[1831px] rounded-[28px] overflow-clip gap-[16px] h-full grow pt-[16px] px-[16px] [box-shadow:#0F172A14_0px_12px_40px] bg-[#F8F9FA]">
          <div className="flex flex-col w-[520px] h-[1020px] justify-between pt-[22px] pb-[18px] rounded-3xl relative shrink-0 px-[20px] [box-shadow:#0F172A2E_0px_1px_0px_inset,#FFFFFF6B_0px_-1px_0px_inset,#2563EB47_0px_6px_18px,#2563EB24_0px_2px_8px] bg-[#2563EB] bg-origin-border border border-solid border-[#FFFFFF24]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)' }}>
            <div className="flex items-center shrink-0 h-[22px] gap-[14px] absolute top-[22px] right-[20px] justify-end">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M7.2 3.8H9.6L11 8.2L9.1 9.3C9.7 10.6 10.8 11.8 12.2 12.6L13.4 10.8L17.8 12.2V14.6C17.8 15.4 17.1 16.1 16.2 16.2C10.8 16.8 5.8 11.9 6.4 6.6C6.5 5.7 7.2 5 8 5" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M4 7.2C4 6.3 4.7 5.6 5.6 5.6H18.4C19.3 5.6 20 6.3 20 7.2V16.8C20 17.7 19.3 18.4 18.4 18.4H5.6C4.7 18.4 4 17.7 4 16.8V7.2Z" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M5 7.4L12 12.4L19 7.4" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M5.2 6.2H14.8C15.8 6.2 16.6 7 16.6 8V13.2C16.6 14.2 15.8 15 14.8 15H10.2L7 17.6V15H5.2C4.2 15 3.4 14.2 3.4 13.2V8C3.4 7 4.2 6.2 5.2 6.2Z" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M7.4 9.6H12.8M7.4 12H11.2" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col w-full gap-[10px] grow relative">
              <div className="tracking-[-0.03em] content-center font-['Inter-Regular_Light','Inter',system-ui,sans-serif] font-light text-white text-[100px] leading-[88px]">
                Elena Vasquez
              </div>
              <div className="flex items-end justify-between w-full shrink-0">
                <div className="flex items-baseline gap-[8px]">
                  <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[40px] leading-[40px]">
                    48
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB3] text-sm leading-[18px]">
                    F
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[2px]">
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[13px] leading-[16px]">
                    482-193
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFA6] text-xs leading-[14px]">
                    12 Mar 1978
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full min-h-[0px] pt-[46px] gap-[40px] h-[504px] shrink-0">
                <div className="flex flex-col w-full gap-[6px] h-[132px] shrink-0">
                  <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                    TODAY
                  </div>
                  <div className="flex items-end justify-between w-full">
                    <div className="[letter-spacing:-0.05em] font-['Inter-Regular','Inter',system-ui,sans-serif] text-white text-[64px] leading-[58px]">
                      8:20
                    </div>
                    <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[22px] leading-[26px]">
                      Rm 3
                    </div>
                  </div>
                  <div className="tracking-[-0.02em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-xl leading-[24px]">
                    Diabetes Follow-up
                  </div>
                  <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB3] text-sm leading-[18px]">
                    Dr. Roberts
                  </div>
                </div>
                <div className="flex flex-col w-full shrink-0 pt-[49px] gap-[12px] border-t border-t-solid border-t-[#FFFFFF38]">
                  <div className="flex w-full">
                    <div className="flex flex-col w-[239px] pr-[16px] gap-[4px] h-[82px] shrink-0">
                      <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                        POTASSIUM
                      </div>
                      <div className="flex items-baseline gap-[8px]">
                        <div className="tracking-[-0.04em] font-['Inter-Regular','Inter',system-ui,sans-serif] text-white text-5xl leading-[44px]">
                          5.8
                        </div>
                        <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFD0CC] text-[13px] leading-[16px]">
                          High
                        </div>
                      </div>
                      <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFBF] text-[13px] leading-[16px]">
                        Consider holding lisinopril
                      </div>
                    </div>
                    <div className="w-px self-stretch shrink-0 bg-[#FFFFFF38]" />
                    <div
                      className="landing-emr-chart-a1c-box flex flex-col pl-[16px] gap-[4px] rounded-[12px]"
                    >
                      <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                        A1C
                      </div>
                      <div className="tracking-[-0.04em] font-['Inter-Regular','Inter',system-ui,sans-serif] text-white text-5xl leading-[44px]">
                        7.4
                      </div>
                      <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFBF] text-[13px] leading-[16px]">
                        Above goal of 6.5
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full shrink-0 pt-[16px] gap-[8px] border-t border-t-solid border-t-[#FFFFFF38]">
                  <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[28px] leading-[32px]">
                    Home sugars running high
                  </div>
                  <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB3] text-sm leading-[18px]">
                    Review the glucometer log today
                  </div>
                </div>
              </div>
            </div>
            <ChartSidebarTabs />
          </div>
          <div className="relative w-[1330px] h-[1036px] shrink-0">
            <div className="landing-emr-chart-summary-layer absolute inset-0">
              <div className="flex h-[1036px] gap-[20px] rounded-[20px] overflow-clip w-full bg-[#F8F9FA]">
            <div className="flex pr-[36px] gap-[20px] h-[1020px] overflow-clip w-[1302px] shrink-0">
              <div className="flex flex-col gap-[20px] h-full w-[831px] grow min-h-[0px]">
                <div className="flex w-full gap-[16px] grow min-h-[0px] h-[0px]">
                  <div className="flex flex-col justify-between w-[0px] grow min-h-[0px] h-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[24px] rounded-[20px] bg-[#2563EB] bg-origin-border border border-solid border-[#FFFFFF24]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)' }}>
                    <div className="flex items-end w-[249px] flex-col gap-[4px]">
                      <div className="tracking-[-0.03em] w-[248px] h-[64px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[28px] leading-[32px]">
                        Recommendations from last visit
                      </div>
                      <div className="w-full font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-sm leading-[18px]">
                        August 18th
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-[14px]">
                      <div className="tracking-[-0.02em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-xl leading-[24px]">
                        Continue metformin
                      </div>
                      <div className="tracking-[-0.02em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-xl leading-[24px]">
                        Review home glucose log
                      </div>
                      <div className="tracking-[-0.02em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-xl leading-[24px]">
                        Repeat A1c in 3 months
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-[0px] grow min-h-[0px] h-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[24px] rounded-[20px] bg-white" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(91.9% -0.009 -0.032) 0%, oklab(96.6% -0.002 -0.016) 46%, oklab(100% 0 0) 100%)' }}>
                    <div className="flex items-baseline justify-between w-full shrink-0">
                      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#8E8E93] text-[13px] leading-[16px]">
                        5 Sep
                      </div>
                    </div>
                    <div className="flex flex-col w-full shrink-0 h-[210px] pt-[6px] gap-[10px] -mt-66.5">
                      <div className="flex w-full items-baseline justify-between px-[2px]">
                        <div className="flex items-baseline gap-[4px]">
                          <div className="text-[22px] leading-[100%] tracking-[-0.03em] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E]">
                            7.4
                          </div>
                          <div className="text-[11px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            %
                          </div>
                        </div>
                        <div className="inline-block py-[2px] px-[8px] rounded-[999px] bg-[#60A5FA1F]">
                          <div className="inline-block text-[11px] leading-[100%] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#3B82F6]">
                            ↑ from 7.0 · 18 mo
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-[10px]">
                        <div className="flex flex-col justify-between h-[118px] w-[40px] shrink-0 pt-[4px] pb-[18px]">
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            8.0
                          </div>
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            7.4
                          </div>
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            6.8
                          </div>
                        </div>
                        <div className="flex flex-col grow min-w-[0px] h-[118px]">
                          <svg viewBox="0 0 300 96" preserveAspectRatio="none" width="300" height="96" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs><linearGradient id="_opghlx0" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0"><stop offset="0%" stop-color="#93C5FD"/><stop offset="50%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#2563EB"/></linearGradient><linearGradient id="_opghlx1" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="92"><stop offset="0%" stop-color="rgba(147,197,253,0.32)"/><stop offset="60%" stop-color="rgba(96,165,250,0.08)"/><stop offset="100%" stop-color="rgba(96,165,250,0)"/></linearGradient><clipPath id="_opghlx2"><path d="M 0 78 C 10 76, 22 68, 50 42 C 78 16, 88 10, 100 8 C 112 6, 128 18, 150 38 C 172 58, 182 68, 200 76 C 218 84, 232 82, 250 78 C 268 74, 284 58, 298 46 L 298 92 L 0 92 Z"/></clipPath></defs>
                            <line x1="0" y1="4" x2="0" y2="92" stroke="rgb(96 165 250 / 28%)" />
                            <line x1="0" y1="92" x2="298" y2="92" stroke="rgb(96 165 250 / 28%)" />
                            <g clipPath="url(#_opghlx2)">
                              <line x1="0" y1="24" x2="298" y2="24" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                              <line x1="0" y1="46" x2="298" y2="46" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                              <line x1="0" y1="68" x2="298" y2="68" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                            </g>
                            <path d="M 0 78 C 10 76, 22 68, 50 42 C 78 16, 88 10, 100 8 C 112 6, 128 18, 150 38 C 172 58, 182 68, 200 76 C 218 84, 232 82, 250 78 C 268 74, 284 58, 298 46 L 298 92 L 0 92 Z" fill="url(#_opghlx1)" />
                            <path d="M 0 78 C 10 76, 22 68, 50 42 C 78 16, 88 10, 100 8 C 112 6, 128 18, 150 38 C 172 58, 182 68, 200 76 C 218 84, 232 82, 250 78 C 268 74, 284 58, 298 46" fill="none" stroke="url(#_opghlx0)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="0" cy="78" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="50" cy="42" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="100" cy="8" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                            <circle cx="150" cy="38" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="200" cy="76" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="250" cy="78" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="298" cy="46" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex w-full gap-[10px]">
                        <div className="w-[40px] shrink-0" />
                        <div className="flex grow min-w-[0px] h-[14px] relative">
                          <div className="absolute left-[0%] text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            7/24
                          </div>
                          <div className="absolute left-[33.3%] text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]" style={{ translate: '-50%' }}>
                            1/25
                          </div>
                          <div className="absolute left-[66.6%] text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]" style={{ translate: '-50%' }}>
                            7/25
                          </div>
                          <div className="absolute left-full text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E]" style={{ translate: '-100%' }}>
                            5/26
                          </div>
                        </div>
                      </div>
                      <div className="inline-block pl-[50px]">
                        <div className="inline-block text-[10px] tracking-widest leading-[100%] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                          A1C TREND
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full shrink-0 [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] overflow-visible -mt-66.5">
                      <div className="flex w-full border-b border-b-solid border-b-[#E5E5EA]">
                        <div className="flex flex-col w-[0px] grow pt-[14px] pr-[16px] pb-[12px] pl-[14px] gap-[4px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            K
                          </div>
                          <div className="flex items-baseline gap-[8px]">
                            <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                              5.8
                            </div>
                            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#5A5A5A] text-[13px] leading-[16px]">
                              High
                            </div>
                          </div>
                        </div>
                        <div className="w-px self-stretch shrink-0 bg-[#E5E5EA]" />
                        <div className="flex flex-col w-[0px] grow pt-[14px] pr-[14px] pb-[12px] pl-[16px] gap-[4px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            A1C
                          </div>
                          <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                            7.4
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full border-b border-b-solid border-b-[#E5E5EA]">
                        <div className="flex flex-col w-[0px] grow pr-[16px] pl-[14px] gap-[4px] py-[12px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            EGFR
                          </div>
                          <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                            52
                          </div>
                        </div>
                        <div className="w-px self-stretch shrink-0 bg-[#E5E5EA]" />
                        <div className="flex flex-col w-[0px] grow pr-[14px] pl-[16px] gap-[4px] py-[12px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            CR
                          </div>
                          <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                            1.2
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full">
                        <div className="flex flex-col w-[0px] grow pt-[12px] pr-[16px] pb-[14px] pl-[14px] gap-[4px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            LDL
                          </div>
                          <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                            98
                          </div>
                        </div>
                        <div className="w-px self-stretch shrink-0 bg-[#E5E5EA]" />
                        <div className="flex flex-col w-[0px] grow pt-[12px] pr-[14px] pb-[14px] pl-[16px] gap-[4px]">
                          <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                            GLUCOSE
                          </div>
                          <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
                            142
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-[16px] grow min-h-[0px] h-[0px]">
                  <div className="flex flex-col justify-between w-[0px] grow min-h-[0px] h-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[24px] rounded-[20px] bg-white" style={{ backgroundImage: 'linear-gradient(in oklab 90deg, oklab(93% -0.006 -0.029) 0%, oklab(97.5% -0.001 -0.011) 55%, oklab(100% 0 0) 100%)' }}>
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col gap-[2px]">
                        <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                          HR
                        </div>
                        <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-[22px] leading-[26px]">
                          76
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                          TEMP
                        </div>
                        <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-[22px] leading-[26px]">
                          98.2
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <div className="tracking-[0.06em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                          WT
                        </div>
                        <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-[22px] leading-[26px]">
                          182
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full grow min-h-[0px] justify-center pt-[8px] pb-[4px] gap-[10px]">
                      <div className="flex w-full items-baseline justify-between px-[2px]">
                        <div className="flex items-baseline gap-[6px]">
                          <div className="text-[22px] leading-[100%] tracking-[-0.03em] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E]">
                            182
                          </div>
                          <div className="text-[11px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            lb
                          </div>
                        </div>
                        <div className="inline-block py-[2px] px-[8px] rounded-[999px] bg-[#60A5FA1F]">
                          <div className="inline-block text-[11px] leading-[100%] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#3B82F6]">
                            ↓ 14 lb · 6 mo
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-[10px]">
                        <div className="flex flex-col justify-between h-[118px] w-[40px] shrink-0 pt-[4px] pb-[18px]">
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            200
                          </div>
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            190
                          </div>
                          <div className="text-[10px] text-right leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                            180
                          </div>
                        </div>
                        <div className="flex flex-col grow min-w-[0px] h-[118px]">
                          <svg viewBox="0 0 300 96" preserveAspectRatio="none" width="300" height="96" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs><linearGradient id="_okgtco0" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0"><stop offset="0%" stop-color="#93C5FD"/><stop offset="50%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#2563EB"/></linearGradient><linearGradient id="_okgtco1" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="92"><stop offset="0%" stop-color="rgba(147,197,253,0.32)"/><stop offset="60%" stop-color="rgba(96,165,250,0.08)"/><stop offset="100%" stop-color="rgba(96,165,250,0)"/></linearGradient><clipPath id="_okgtco2"><path d="M 0 12 C 14 14, 28 24, 75 30 C 122 36, 145 42, 150 46 C 155 50, 178 58, 225 68 C 272 78, 286 82, 298 84 L 298 92 L 0 92 Z"/></clipPath></defs>
                            <line x1="0" y1="4" x2="0" y2="92" stroke="rgb(96 165 250 / 28%)" />
                            <line x1="0" y1="92" x2="298" y2="92" stroke="rgb(96 165 250 / 28%)" />
                            <g clipPath="url(#_okgtco2)">
                              <line x1="0" y1="30" x2="298" y2="30" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                              <line x1="0" y1="46" x2="298" y2="46" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                              <line x1="0" y1="62" x2="298" y2="62" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                              <line x1="0" y1="78" x2="298" y2="78" stroke="rgb(96 165 250 / 12%)" strokeDasharray="2 5" />
                            </g>
                            <path d="M 0 12 C 14 14, 28 24, 75 30 C 122 36, 145 42, 150 46 C 155 50, 178 58, 225 68 C 272 78, 286 82, 298 84 L 298 92 L 0 92 Z" fill="url(#_okgtco1)" />
                            <path d="M 0 12 C 14 14, 28 24, 75 30 C 122 36, 145 42, 150 46 C 155 50, 178 58, 225 68 C 272 78, 286 82, 298 84" fill="none" stroke="url(#_okgtco0)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="0" cy="12" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                            <circle cx="75" cy="30" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="150" cy="46" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="225" cy="68" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                            <circle cx="298" cy="84" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex w-full gap-[10px]">
                        <div className="w-[40px] shrink-0" />
                        <div className="flex justify-between grow min-w-[0px] pt-[2px]">
                          <div className="text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            Jan
                          </div>
                          <div className="text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            Mar
                          </div>
                          <div className="text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            May
                          </div>
                          <div className="text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93]">
                            Jul
                          </div>
                          <div className="text-[10px] leading-[100%] inline-block font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E]">
                            Sep
                          </div>
                        </div>
                      </div>
                      <div className="inline-block pl-[50px]">
                        <div className="inline-block text-[10px] tracking-widest leading-[100%] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#AEAEB2]">
                          WEIGHT TREND
                        </div>
                      </div>
                    </div>
                    <div className="[letter-spacing:-0.05em] mt-auto h-[83px] shrink-0 font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#1C1C1E] text-7xl leading-[64px]">
                      138/84
                    </div>
                    <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                      BLOOD PRESSURE
                    </div>
                  </div>
                  <div className="flex flex-col w-[0px] grow min-h-[0px] h-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] rounded-[20px] gap-[12px] overflow-clip p-[24px] bg-[#2563EB] bg-origin-border border border-solid border-[#FFFFFF24]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)' }}>
                    <div className="flex items-start justify-between w-full shrink-0">
                      <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                        PRIOR AUTH
                      </div>
                      <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[13px] leading-[16px]">
                        Approved
                      </div>
                    </div>
                    <div className="flex flex-col w-full shrink-0 gap-[4px]">
                      <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[26px] leading-[30px]">
                        Empagliflozin 10 mg
                      </div>
                      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-sm leading-[18px]">
                        Aetna. Completed 18 Aug.
                      </div>
                    </div>
                    <div className="flex flex-col w-[358px] grow min-h-[0px] relative">
                      <div className="flex w-full grow min-h-[0px] gap-[14px] items-center">
                        <div className="flex flex-col items-center shrink-0 self-center justify-center size-[20px]">
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center w-[0px] grow gap-[2px] h-[38px] self-center">
                          <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[15px] leading-[20px]">
                            Chart pulled
                          </div>
                          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFAD] text-xs leading-[16px]">
                            A1c and meds attached
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full grow min-h-[0px] gap-[14px] items-center">
                        <div className="flex flex-col items-center shrink-0 self-center justify-center size-[20px]">
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center w-[0px] grow gap-[2px] h-[38px] self-center">
                          <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[15px] leading-[20px]">
                            Form filled
                          </div>
                          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFAD] text-xs leading-[16px]">
                            Diagnosis and dose confirmed
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full grow min-h-[0px] gap-[14px] items-center">
                        <div className="flex flex-col items-center shrink-0 self-center justify-center size-[20px]">
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center w-[0px] grow gap-[2px] h-[38px] self-center">
                          <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[15px] leading-[20px]">
                            Sent to Aetna
                          </div>
                          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFAD] text-xs leading-[16px]">
                            Submitted 18 Aug
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full grow min-h-[0px] gap-[14px] items-center">
                        <div className="flex flex-col items-center shrink-0 self-center justify-center size-[20px]">
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center w-[0px] grow gap-[2px] h-[38px] self-center">
                          <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[15px] leading-[20px]">
                            Approved
                          </div>
                          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFAD] text-xs leading-[16px]">
                            Coverage active
                          </div>
                        </div>
                      </div>
                      <div className="absolute left-[10px] top-[45px] w-[2px] h-[268px] bg-[#FFFFFF59]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-[400px] shrink-0 gap-[16px] h-full min-h-[0px] grow">
                <div className="flex flex-col w-full shrink-0 [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] py-[20px] px-[18px] rounded-[20px] gap-[14px] bg-white" style={{ backgroundImage: 'linear-gradient(in oklab 0deg, oklab(92.3% -0.008 -0.031) 0%, oklab(96.9% -0.001 -0.014) 50%, oklab(100% 0 0) 100%)' }}>
                  <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[11px] leading-[14px]">
                    APPOINTMENTS
                  </div>
                  <div className="flex items-baseline justify-between w-full">
                    <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-lg leading-[22px]">
                      18 Aug
                    </div>
                    <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#5A5A5A] text-sm leading-[18px]">
                      Diabetes visit
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between w-full">
                    <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-lg leading-[22px]">
                      3 Jul
                    </div>
                    <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#5A5A5A] text-sm leading-[18px]">
                      CKD and BP
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between w-full">
                    <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-lg leading-[22px]">
                      12 May
                    </div>
                    <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#5A5A5A] text-sm leading-[18px]">
                      Annual physical
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full grow min-h-[0px] [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] rounded-[20px] gap-[22px] pt-[22px] pb-[18px] px-[20px] bg-[#2563EB] bg-origin-border border border-solid border-[#FFFFFF24]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)' }}>
                  <div className="flex flex-col w-full shrink-0 gap-[8px]">
                    <div className="tracking-[-0.04em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-4xl leading-[40px]">
                      Type 2 Diabetes
                    </div>
                    <div className="w-full tracking-[-0.04em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-4xl leading-[40px]">
                      Hypertension
                    </div>
                    <div className="w-full tracking-[-0.04em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-4xl leading-[40px]">
                      CKD Stage 3a
                    </div>
                    <div className="w-full pt-[10px]">
                      <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF8C] text-[11px] leading-[14px]">
                        ALLERGIES
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-[6px]">
                      <div className="flex w-full gap-[16px]">
                        <div className="w-[0px] grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-sm leading-[18px]">
                          Penicillin
                        </div>
                        <div className="w-[0px] grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-sm leading-[18px]">
                          Sulfa
                        </div>
                      </div>
                      <div className="flex w-full gap-[16px]">
                        <div className="w-[0px] grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-sm leading-[18px]">
                          Latex
                        </div>
                        <div className="w-[0px] grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-sm leading-[18px]">
                          Codeine
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-[8px] grow min-h-[0px]">
                    <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                      MEDICATIONS
                    </div>
                    <div className="flex flex-col w-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[6px] rounded-2xl overflow-clip grow min-h-[0px] [box-shadow:#FFFFFF29_0px_1px_0px_inset] bg-[#FFFFFF1F] border border-solid border-[#FFFFFF38]">
                      <div className="flex items-center shrink-0 pr-[12px] pl-[10px] rounded-[10px] gap-[10px] grow min-h-[44px] bg-[#FFFFFF2E]">
                        <div className="w-[3px] h-[18px] shrink-0 rounded-[999px] bg-white" />
                        <div className="grow font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-sm leading-[18px]">
                          Metformin
                        </div>
                        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFCC] text-xs leading-[16px]">
                          1000 mg
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 pr-[12px] pl-[10px] rounded-[10px] gap-[10px] grow min-h-[44px]">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Lisinopril
                        </div>
                        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFA6] text-xs leading-[16px]">
                          10 mg
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 pr-[12px] pl-[10px] rounded-[10px] gap-[10px] grow min-h-[44px]">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Atorvastatin
                        </div>
                        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFA6] text-xs leading-[16px]">
                          20 mg
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 pr-[12px] pl-[10px] rounded-[10px] gap-[10px] grow min-h-[44px]">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Aspirin
                        </div>
                        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFA6] text-xs leading-[16px]">
                          81 mg
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 pr-[12px] pl-[10px] rounded-[10px] gap-[10px] grow min-h-[44px]">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Empagliflozin
                        </div>
                        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFA6] text-xs leading-[16px]">
                          10 mg
                        </div>
                      </div>
                      <div className="flex items-center w-full shrink-0 h-[40px] pr-[12px] pl-[282px] border-t border-t-solid border-t-[#FFFFFF38]">
                        <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFBF] text-[13px] leading-[16px]">
                          See more
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full min-h-[0px] gap-[8px] shrink-0">
                    <div className="tracking-[0.08em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#FFFFFF9E] text-[11px] leading-[14px]">
                      CARE
                    </div>
                    <div className="flex flex-col w-full min-h-[0px] [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] p-[6px] rounded-2xl overflow-clip [box-shadow:#FFFFFF29_0px_1px_0px_inset] bg-[#FFFFFF1F] border border-solid border-[#FFFFFF38]">
                      <div className="flex items-center min-h-[44px] pr-[12px] pl-[10px] rounded-[10px] gap-[10px] h-[44px] shrink-0 bg-[#FFFFFF2E]">
                        <div className="w-[3px] h-[18px] shrink-0 rounded-[999px] bg-white" />
                        <div className="grow font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-sm leading-[18px]">
                          Eye exam
                        </div>
                      </div>
                      <div className="flex items-center min-h-[44px] pr-[12px] pl-[10px] rounded-[10px] gap-[10px] h-[44px] shrink-0">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Pneumococcal
                        </div>
                      </div>
                      <div className="flex items-center min-h-[44px] pr-[12px] pl-[10px] rounded-[10px] gap-[10px] h-[44px] shrink-0">
                        <div className="w-[3px] h-[18px] shrink-0 opacity-[0] rounded-[999px]" />
                        <div className="grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFC7] text-sm leading-[18px]">
                          Foot exam
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
            <div className="landing-emr-chart-results-layer absolute inset-0">
              <WestfieldEmrResultsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CHART_RADIUS = 28;

function AiSparkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 13.4 9.6 19.5 11 13.4 12.4 12 18.5 10.6 12.4 4.5 11 10.6 9.6 12 3.5Z"
        fill="currentColor"
      />
      <path
        d="M18.5 4.5 19.1 6.9 21.5 7.5 19.1 8.1 18.5 10.5 17.9 8.1 15.5 7.5 17.9 6.9 18.5 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WestfieldEmrPatientChartPreview() {
  const scalerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = scalerRef.current;
    if (!node) return;
    const sync = () => {
      const width = node.clientWidth;
      setScale(width / 1920);
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
    <div
      ref={scalerRef}
      className="landing-emr-chart-scaler"
    >
      <div
        className="landing-emr-chart-stage select-none"
        style={{
          height: 1080 * scale,
          borderRadius: CHART_RADIUS * scale,
        }}
      >
        <div className={`landing-emr-chart-canvas ${lora.variable}`} style={{ transform: `scale(${scale})` }}>
          <WestfieldEmrPatientChartCanvas />
          <div className="landing-emr-chart-dim" aria-hidden />
          <div className="landing-emr-chart-chat-slot">
            <WestfieldEmrChartChatCanvas />
          </div>
          <div className="landing-emr-chart-a1c-slot">
            <WestfieldEmrA1cSheet />
          </div>
          <div className="landing-emr-chart-ai-fab" aria-label="Chart assistant">
            <AiSparkIcon />
            <span className="landing-emr-chart-ai-fab__ripple" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
