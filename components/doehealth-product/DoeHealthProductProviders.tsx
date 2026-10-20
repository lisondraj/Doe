/**
 * Families tab — "Providers" screen, exported from Paper artboard "Pulse 03a General Info"
 * (file "Tender mountain", page "Doe App v2"). Markup is kept as exported.
 *
 * The dot-wave backdrop and carousel are positioned against the inner shell (as in Paper),
 * so they are rendered as shell-level layers; the header lives in the content panel.
 */
import { SlowDotWave } from "@/components/doehealth-product/DoeHealthProductHalftone";

/** Header row for the Providers panel. */
export function DoeHealthProductProvidersHeader() {
  return (
    <div className="flex items-center justify-between [width:100%] shrink-0 pr-[444px]">
      <div className="flex items-baseline gap-[14px]">
        <div className="text-[46px] leading-[50px] tracking-[-0.025em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
          Providers
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <div className="w-[38px] h-[38px] flex items-center justify-center shrink-0 rounded-[50%] bg-[#EEEADF]">
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="#281910" strokeWidth="2" />
            <path d="M16 16l4 4" fill="#000000" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-center h-[38px] shrink-0 pr-[16px] pl-[12px] rounded-[999px] gap-[6px] bg-ink">
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
            <path d="M7 2.5v9M2.5 7h9" fill="#000000" stroke="#FFFCF1" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div className="text-[14px] leading-[18px] w-max font-['DM_Sans',system-ui,sans-serif] font-[500] [color:#FFFCF1]">
            Add provider
          </div>
        </div>
      </div>
    </div>
  );
}

/** Helix backdrop and provider carousel, positioned against the shell. */
export function DoeHealthProductProvidersLayers() {
  return (
    <>
      <SlowDotWave
        className="absolute left-[720px] top-[-240px] pointer-events-none"
        width={644}
        height={1116}
        top={0.05}
        amp={50}
        vertical
        fade={0.45}
        color="#C2A987"
        style={{ opacity: 0.55 }}
      />
      <div className="absolute left-[40px] top-[0px] w-[840px] h-[876px]">
        <div className="absolute left-[0px] top-[186px] w-[840px] h-[64px] flex items-center px-[22px] rounded-[20px] opacity-70 bg-[#FAF6EC]">
          <div className="grow basis-[0%] flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#E9DCC7]" />
            <div className="flex flex-col grow basis-[0%] gap-[2px]">
              <div className="text-[28px] leading-[32px] tracking-[-0.015em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                Dr. Daniel Reyes
              </div>
            </div>
            <div className="flex items-center justify-center h-[24px] shrink-0 px-[9px] rounded-[999px] bg-sand">
              <div className="text-[12px] leading-[16px] w-max font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                MD
              </div>
            </div>
            <div className="flex items-center h-[24px] px-[9px] rounded-[999px] gap-[4px] bg-sand">
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                Pediatric ENT
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[606px] w-[840px] h-[64px] flex items-center px-[22px] rounded-[20px] opacity-70 bg-[#FAF6EC]">
          <div className="grow basis-[0%] flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#F7DCCB]" />
            <div className="flex flex-col grow basis-[0%] gap-[2px]">
              <div className="text-[28px] leading-[32px] tracking-[-0.015em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                Dr. Sofia Alvarez
              </div>
            </div>
            <div className="flex items-center justify-center h-[24px] shrink-0 px-[9px] rounded-[999px] bg-sand">
              <div className="text-[12px] leading-[16px] w-max font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                DO
              </div>
            </div>
            <div className="flex items-center h-[24px] px-[9px] rounded-[999px] gap-[4px] bg-sand">
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                Allergy & immunology
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[114px] w-[840px] h-[64px] flex items-center px-[22px] rounded-[20px] opacity-35 bg-[#F6F0E2]">
          <div className="grow basis-[0%] flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#E9DCC7]" />
            <div className="flex flex-col grow basis-[0%] gap-[2px]">
              <div className="text-[28px] leading-[32px] tracking-[-0.015em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                Priya Raman
              </div>
            </div>
            <div className="flex items-center justify-center h-[24px] shrink-0 px-[9px] rounded-[999px] bg-sand">
              <div className="text-[12px] leading-[16px] w-max font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                AuD
              </div>
            </div>
            <div className="flex items-center h-[24px] px-[9px] rounded-[999px] gap-[4px] bg-sand">
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                Audiology
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[678px] w-[840px] h-[64px] flex items-center px-[22px] rounded-[20px] opacity-40 bg-[#F6F0E2]">
          <div className="grow basis-[0%] flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#F7DCCB]" />
            <div className="flex flex-col grow basis-[0%] gap-[2px]">
              <div className="text-[28px] leading-[32px] tracking-[-0.015em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                Dr. Jun Lee
              </div>
            </div>
            <div className="flex items-center justify-center h-[24px] shrink-0 px-[9px] rounded-[999px] bg-sand">
              <div className="text-[12px] leading-[16px] w-max font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                MD
              </div>
            </div>
            <div className="flex items-center h-[24px] px-[9px] rounded-[999px] gap-[4px] bg-sand">
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                Head & neck surgery
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[750px] w-[840px] h-[64px] flex items-center px-[22px] rounded-[20px] opacity-20 bg-[#F6F0E2]">
          <div className="grow basis-[0%] flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[12px] bg-[#F7DCCB]" />
            <div className="flex flex-col grow basis-[0%] gap-[2px]">
              <div className="text-[28px] leading-[32px] tracking-[-0.015em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                Dr. Ruth Chen
              </div>
            </div>
            <div className="flex items-center justify-center h-[24px] shrink-0 px-[9px] rounded-[999px] bg-sand">
              <div className="text-[12px] leading-[16px] w-max font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                MD
              </div>
            </div>
            <div className="flex items-center h-[24px] px-[9px] rounded-[999px] gap-[4px] bg-sand">
              <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                Laryngology
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[258px] w-[840px] h-[340px] flex pr-[22px] pl-gutter rounded-[24px] gap-[28px] py-gutter bg-sand">
          <div className="w-[260px] h-[298px] shrink-0 flex flex-col justify-between p-[16px] rounded-[16px] bg-salmon" />
          <div className="grow basis-[0%] min-w-[0px] flex flex-col justify-between pt-[8px] pb-[6px]">
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="text-[40px] leading-[44px] tracking-[-0.02em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
                  Dr. Maya Okafor, MD
                </div>
                <div className="flex items-center justify-center w-[32px] h-[32px] shrink-0 rounded-[50%] bg-[#28191014]">
                  <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                    <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="#281910" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M13.5 6.5l4 4" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="flex items-center h-[30px] px-[14px] rounded-[999px] border border-solid border-[#28191033]">
                  <div className="text-[14px] leading-[18px] w-max font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                    Staff Physician
                  </div>
                </div>
                <div className="flex items-center h-[30px] px-[14px] rounded-[999px] border border-solid border-[#28191033]">
                  <div className="text-[14px] leading-[18px] w-max font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                    Otolaryngology
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap py-[16px] px-[18px] rounded-[16px] gap-y-[16px] [background-color:#FFFCF1]">
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  Specialty
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  Otolaryngology
                </div>
              </div>
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  Clinic
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  Mission
                </div>
              </div>
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  In practice
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  12 years
                </div>
              </div>
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  Speaks
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  English +2
                </div>
              </div>
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  Plans
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  9 accepted
                </div>
              </div>
              <div className="w-[150px] flex flex-col gap-[3px] shrink-0">
                <div className="text-[12px] leading-[16px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#28191080]">
                  NPI
                </div>
                <div className="text-[15px] leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  1487220391
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[0px] top-[824px] w-[160px] h-[38px] flex items-center p-[4px] rounded-[999px] gap-[2px] [background-color:#FFFCF1] border border-solid border-[#28191017]">
          <div className="flex items-center h-[30px] shrink-0 pr-[13px] pl-[10px] rounded-[999px] gap-[6px] bg-ink">
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="none" stroke="#FFFCF1" strokeWidth="1.5" />
              <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" fill="none" stroke="#FFFCF1" strokeWidth="1.5" />
              <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" fill="none" stroke="#FFFCF1" strokeWidth="1.5" />
              <rect x="8" y="8" width="4.5" height="4.5" rx="1" fill="none" stroke="#FFFCF1" strokeWidth="1.5" />
            </svg>
            <div className="text-label leading-[16px] w-max font-['DM_Sans',system-ui,sans-serif] font-[500] [color:#FFFCF1]">
              Cards
            </div>
          </div>
          <div className="flex items-center h-[30px] shrink-0 pr-[13px] pl-[10px] rounded-[999px] gap-[6px]">
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="#2819109E" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="text-label leading-[16px] w-max font-['DM_Sans',system-ui,sans-serif] font-[500] text-[#2819109E]">
              List
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
