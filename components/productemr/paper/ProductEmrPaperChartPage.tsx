"use client";

import {
  ProductEmrInnerStage,
  PRODUCT_EMR_PREP_MOSAIC_HEIGHT,
  PRODUCT_EMR_PREP_MOSAIC_WIDTH,
} from "@/components/productemr/ProductEmrInnerStage";

export function ProductEmrPaperChartPage() {
  return (
    <div className="productemr-paper-chart-page" style={{ alignItems: 'flex-start', backgroundColor: '#F8F9FA', borderRadius: '28px', boxShadow: '#0F172A14 0px 12px 40px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', fontSize: '12px', fontSynthesis: 'none', gap: '16px', height: '100%', lineHeight: '16px', MozOsxFontSmoothing: 'grayscale', overflow: 'clip', overflowWrap: 'anywhere', paddingInline: '16px', paddingTop: '16px', WebkitFontSmoothing: 'antialiased', width: '100%' }}>
          <div className="productemr-paper-chart-sidebar" style={{ backgroundColor: '#2563EB', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)', backgroundOrigin: 'border-box', borderColor: '#FFFFFF24', borderRadius: '24px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#0F172A2E 0px 1px 0px inset, #FFFFFF6B 0px -1px 0px inset, #2563EB47 0px 6px 18px, #2563EB24 0px 2px 8px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '1020px', justifyContent: 'space-between', paddingBottom: '18px', paddingInline: '20px', paddingTop: '22px', position: 'relative', width: '520px' }}>
            <div className="productemr-chart-contact-icons" style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '14px', height: '22px', justifyContent: 'end', position: 'absolute', right: '20px', top: '22px', zIndex: 2 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0', filter: 'drop-shadow(#0F172A4D 0px 1px 1px) drop-shadow(#FFFFFF2E 0px -1px 0px)' }}>
                <path d="M7.2 3.8H9.6L11 8.2L9.1 9.3C9.7 10.6 10.8 11.8 12.2 12.6L13.4 10.8L17.8 12.2V14.6C17.8 15.4 17.1 16.1 16.2 16.2C10.8 16.8 5.8 11.9 6.4 6.6C6.5 5.7 7.2 5 8 5" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0', filter: 'drop-shadow(#0F172A4D 0px 1px 1px) drop-shadow(#FFFFFF2E 0px -1px 0px)' }}>
                <path d="M4 7.2C4 6.3 4.7 5.6 5.6 5.6H18.4C19.3 5.6 20 6.3 20 7.2V16.8C20 17.7 19.3 18.4 18.4 18.4H5.6C4.7 18.4 4 17.7 4 16.8V7.2Z" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M5 7.4L12 12.4L19 7.4" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="productemr-chart-chat-hit" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0', filter: 'drop-shadow(#0F172A4D 0px 1px 1px) drop-shadow(#FFFFFF2E 0px -1px 0px)', cursor: 'pointer' }}>
                <path d="M5.2 6.2H14.8C15.8 6.2 16.6 7 16.6 8V13.2C16.6 14.2 15.8 15 14.8 15H10.2L7 17.6V15H5.2C4.2 15 3.4 14.2 3.4 13.2V8C3.4 7 4.2 6.2 5.2 6.2Z" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M7.4 9.6H12.8M7.4 12H11.2" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="productemr-paper-chart-summary" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: 10, minHeight: '0px', position: 'relative', width: '100%' }}>
              <div style={{ alignContent: 'center', boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Light", "Inter", system-ui, sans-serif', fontSize: '100px', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: '88px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                Elena Vasquez
              </div>
              <div style={{ alignItems: 'end', boxSizing: 'border-box', display: 'flex', flexShrink: '0', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', gap: '8px' }}>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '40px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '40px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    48
                  </div>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFFB3', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    F
                  </div>
                </div>
                <div style={{ alignItems: 'end', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 500, lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    482-193
                  </div>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFFA6', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '14px' }}>
                    12 Mar 1978
                  </div>
                </div>
              </div>
              <div className="productemr-paper-chart-summary-body" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', flexShrink: '1', gap: 40, height: '504px', minHeight: '0px', paddingTop: '46px', width: '100%' }}>
                <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '6px', height: '132px', width: '100%' }}>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                    TODAY
                  </div>
                  <div style={{ alignItems: 'end', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '64px', letterSpacing: '-0.05em', lineHeight: '58px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                      8:20
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, lineHeight: '26px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                      Rm 3
                    </div>
                  </div>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '24px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    Diabetes Follow-up
                  </div>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFFB3', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    Dr. Roberts
                  </div>
                </div>
                <div style={{ borderTopColor: '#FFFFFF38', borderTopStyle: 'solid', borderTopWidth: '1px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '12px', paddingTop: '49px', width: '100%' }}>
                  <div style={{ boxSizing: 'border-box', display: 'flex', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '4px', height: '82px', paddingRight: '16px', width: '239px' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                        POTASSIUM
                      </div>
                      <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', gap: '8px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '48px', letterSpacing: '-0.04em', lineHeight: '44px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          5.8
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFD0CC', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 600, lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          High
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFFBF', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '13px', lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Consider holding lisinopril
                      </div>
                    </div>
                    <div style={{ alignSelf: 'stretch', backgroundColor: '#FFFFFF38', boxSizing: 'border-box', flexShrink: '0', width: '1px' }} />
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                        A1C
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '48px', letterSpacing: '-0.04em', lineHeight: '44px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        7.4
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFFBF', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '13px', lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Above goal of 6.5
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTopColor: '#FFFFFF38', borderTopStyle: 'solid', borderTopWidth: '1px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '8px', paddingTop: '16px', width: '100%' }}>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '32px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    Home sugars running high
                  </div>
                  <div style={{ boxSizing: 'border-box', color: '#FFFFFFB3', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                    Review the glucometer log today
                  </div>
                </div>
              </div>
            </div>
            <div className="productemr-chart-tabs" style={{ backgroundColor: '#FFFFFF1F', borderColor: '#FFFFFF38', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '16px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#FFFFFF29 0px 1px 0px inset', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '214px', marginTop: '-28px', overflow: 'clip', padding: '6px', position: 'relative', width: '100%' }}>
              <div className="productemr-chart-tab" data-tab="prep" style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '40px', paddingLeft: '10px', paddingRight: '14px' }}>
                <div className="productemr-chart-tab__indicator" style={{ backgroundColor: '#FFFFFF', borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', width: '3px' }} />
                <div className="productemr-chart-tab__label" style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                  Prep
                </div>
              </div>
              <div className="productemr-chart-tab" data-tab="snapshot" style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '40px', paddingLeft: '10px', paddingRight: '14px' }}>
                <div className="productemr-chart-tab__indicator" style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                <div className="productemr-chart-tab__label" style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                  Snapshot
                </div>
              </div>
              <div className="productemr-chart-tab" data-tab="notes" style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '40px', paddingLeft: '10px', paddingRight: '14px' }}>
                <div className="productemr-chart-tab__indicator" style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                <div className="productemr-chart-tab__label" style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                  Notes
                </div>
              </div>
              <div className="productemr-chart-tab" data-tab="results" style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '40px', paddingLeft: '10px', paddingRight: '14px' }}>
                <div className="productemr-chart-tab__indicator" style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                <div className="productemr-chart-tab__label" style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                  Results
                </div>
              </div>
              <div className="productemr-chart-tab" data-tab="billing" style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '40px', paddingLeft: '10px', paddingRight: '14px' }}>
                <div className="productemr-chart-tab__indicator" style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                <div className="productemr-chart-tab__label" style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                  Billing
                </div>
              </div>
            </div>
          </div>
          <div className="productemr-paper-chart-mosaic">
            <ProductEmrInnerStage
              width={PRODUCT_EMR_PREP_MOSAIC_WIDTH}
              height={PRODUCT_EMR_PREP_MOSAIC_HEIGHT}
            >
            <div className="productemr-paper-chart-mosaic-board" style={{ backgroundColor: '#F8F9FA', borderRadius: '20px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', height: '1036px', overflow: 'clip', width: '1330px' }}>
              <div className="productemr-paper-chart-mosaic-body" style={{ boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '20px', height: '1020px', overflow: 'clip', paddingRight: '36px', width: '1302px' }}>
              <div className="productemr-paper-chart-mosaic-col" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', minHeight: '0px', width: '831px' }}>
                <div style={{ boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '16px', height: '0px', minHeight: '0px', width: '100%' }}>
                  <div style={{ backgroundColor: '#2563EB', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)', backgroundOrigin: 'border-box', borderColor: '#FFFFFF24', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', height: '100%', justifyContent: 'space-between', minHeight: '0px', padding: '24px', width: '0px' }}>
                    <div style={{ alignItems: 'end', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', width: '249px' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '28px', fontWeight: 500, height: '64px', letterSpacing: '-0.03em', lineHeight: '32px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '248px' }}>
                        Recommendations from last visit
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '100%' }}>
                        August 18th
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '24px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Continue metformin
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '24px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Review home glucose log
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '24px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Repeat A1c in 3 months
                      </div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(91.9% -0.009 -0.032) 0%, oklab(96.6% -0.002 -0.016) 46%, oklab(100% 0 0) 100%)', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', height: '100%', justifyContent: 'space-between', minHeight: '0px', padding: '24px', width: '0px' }}>
                    <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', flexShrink: '0', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 500, lineHeight: '16px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                        5 Sep
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '10px', height: '210px', marginTop: '-266px', paddingTop: '6px', width: '100%' }}>
                      <div style={{ alignItems: 'flex-end', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', paddingInline: '2px', width: '100%' }}>
                        <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', gap: '4px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: '100%', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            7.4
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, lineHeight: '100%' }}>
                            %
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#60A5FA1F', borderRadius: '999px', boxSizing: 'border-box', display: 'inline-block', paddingBlock: '2px', paddingInline: '8px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#3B82F6', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, lineHeight: '100%' }}>
                            ↑ from 7.0 · 18 mo
                          </div>
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '10px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '118px', justifyContent: 'space-between', paddingBottom: '18px', paddingTop: '4px', width: '40px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            8.0
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            7.4
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            6.8
                          </div>
                        </div>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', height: '118px', minWidth: '0px' }}>
                          <svg viewBox="0 0 300 96" preserveAspectRatio="none" width="300" height="96" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(#FFFFFF66 0px 1px 0px) drop-shadow(#0F172A12 0px -1px 0px)' }}>
                            <defs><linearGradient id="_opghlx0" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0"><stop offset="0%" stopColor="#93C5FD"/><stop offset="50%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#2563EB"/></linearGradient><linearGradient id="_opghlx1" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="92"><stop offset="0%" stopColor="rgba(147,197,253,0.32)"/><stop offset="60%" stopColor="rgba(96,165,250,0.08)"/><stop offset="100%" stopColor="rgba(96,165,250,0)"/></linearGradient><clipPath id="_opghlx2"><path d="M 0 78 C 10 76, 22 68, 50 42 C 78 16, 88 10, 100 8 C 112 6, 128 18, 150 38 C 172 58, 182 68, 200 76 C 218 84, 232 82, 250 78 C 268 74, 284 58, 298 46 L 298 92 L 0 92 Z"/></clipPath></defs>
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
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '10px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', flexShrink: '0', width: '40px' }} />
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexGrow: '1', height: '14px', minWidth: '0px', position: 'relative' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, left: '0%', lineHeight: '100%', position: 'absolute', width: 'max-content' }}>
                            7/24
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, left: '33.3%', lineHeight: '100%', position: 'absolute', translate: '-50%', width: 'max-content' }}>
                            1/25
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, left: '66.6%', lineHeight: '100%', position: 'absolute', translate: '-50%', width: 'max-content' }}>
                            7/25
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, left: '100%', lineHeight: '100%', position: 'absolute', translate: '-100%', width: 'max-content' }}>
                            5/26
                          </div>
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'inline-block', paddingLeft: '50px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', lineHeight: '100%' }}>
                          A1C TREND
                        </div>
                      </div>
                    </div>
                    <div style={{ borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', marginTop: '-266px', overflow: 'visible', width: '100%' }}>
                      <div style={{ borderBottomColor: '#E5E5EA', borderBottomStyle: 'solid', borderBottomWidth: '1px', boxShadow: '#0F172A1A 0px -1px 0px inset, #FFFFFFB8 0px 1px 0px', boxSizing: 'border-box', display: 'flex', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBottom: '12px', paddingLeft: '14px', paddingRight: '16px', paddingTop: '14px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            K
                          </div>
                          <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', gap: '8px' }}>
                            <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                              5.8
                            </div>
                            <div style={{ boxSizing: 'border-box', color: '#5A5A5A', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 600, lineHeight: '16px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                              High
                            </div>
                          </div>
                        </div>
                        <div style={{ alignSelf: 'stretch', backgroundColor: '#E5E5EA', boxShadow: '#0F172A1A 0px -1px 0px inset, #FFFFFFB8 0px 1px 0px', boxSizing: 'border-box', flexShrink: '0', width: '1px' }} />
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '14px', paddingTop: '14px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            A1C
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            7.4
                          </div>
                        </div>
                      </div>
                      <div style={{ borderBottomColor: '#E5E5EA', borderBottomStyle: 'solid', borderBottomWidth: '1px', boxShadow: '#0F172A1A 0px -1px 0px inset, #FFFFFFB8 0px 1px 0px', boxSizing: 'border-box', display: 'flex', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBlock: '12px', paddingLeft: '14px', paddingRight: '16px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            EGFR
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            52
                          </div>
                        </div>
                        <div style={{ alignSelf: 'stretch', backgroundColor: '#E5E5EA', boxShadow: '#0F172A1A 0px -1px 0px inset, #FFFFFFB8 0px 1px 0px', boxSizing: 'border-box', flexShrink: '0', width: '1px' }} />
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBlock: '12px', paddingLeft: '16px', paddingRight: '14px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            CR
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            1.2
                          </div>
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBottom: '14px', paddingLeft: '14px', paddingRight: '16px', paddingTop: '12px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            LDL
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            98
                          </div>
                        </div>
                        <div style={{ alignSelf: 'stretch', backgroundColor: '#E5E5EA', boxShadow: '#0F172A1A 0px -1px 0px inset, #FFFFFFB8 0px 1px 0px', boxSizing: 'border-box', flexShrink: '0', width: '1px' }} />
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '4px', paddingBottom: '14px', paddingLeft: '16px', paddingRight: '14px', paddingTop: '12px', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                            GLUCOSE
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            142
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '16px', height: '0px', minHeight: '0px', width: '100%' }}>
                  <div style={{ backgroundColor: '#FFFFFF', backgroundImage: 'linear-gradient(in oklab 90deg, oklab(93% -0.006 -0.029) 0%, oklab(97.5% -0.001 -0.011) 55%, oklab(100% 0 0) 100%)', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', height: '100%', justifyContent: 'space-between', minHeight: '0px', padding: '24px', width: '0px' }}>
                    <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                          HR
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, lineHeight: '26px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                          76
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                          TEMP
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, lineHeight: '26px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                          98.2
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', lineHeight: '14px' }}>
                          WT
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, lineHeight: '26px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                          182
                        </div>
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '10px', justifyContent: 'center', minHeight: '0px', paddingBottom: '4px', paddingTop: '8px', width: '100%' }}>
                      <div style={{ alignItems: 'flex-end', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', paddingInline: '2px', width: '100%' }}>
                        <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', gap: '6px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: '100%', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                            182
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, lineHeight: '100%' }}>
                            lb
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#60A5FA1F', borderRadius: '999px', boxSizing: 'border-box', display: 'inline-block', paddingBlock: '2px', paddingInline: '8px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#3B82F6', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, lineHeight: '100%' }}>
                            ↓ 14 lb · 6 mo
                          </div>
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '10px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '118px', justifyContent: 'space-between', paddingBottom: '18px', paddingTop: '4px', width: '40px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            200
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            190
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%', textAlign: 'right' }}>
                            180
                          </div>
                        </div>
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', height: '118px', minWidth: '0px' }}>
                          <svg viewBox="0 0 300 96" preserveAspectRatio="none" width="300" height="96" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(#FFFFFF66 0px 1px 0px) drop-shadow(#0F172A12 0px -1px 0px)' }}>
                            <defs><linearGradient id="_okgtco0" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0"><stop offset="0%" stopColor="#93C5FD"/><stop offset="50%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#2563EB"/></linearGradient><linearGradient id="_okgtco1" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="92"><stop offset="0%" stopColor="rgba(147,197,253,0.32)"/><stop offset="60%" stopColor="rgba(96,165,250,0.08)"/><stop offset="100%" stopColor="rgba(96,165,250,0)"/></linearGradient><clipPath id="_okgtco2"><path d="M 0 12 C 14 14, 28 24, 75 30 C 122 36, 145 42, 150 46 C 155 50, 178 58, 225 68 C 272 78, 286 82, 298 84 L 298 92 L 0 92 Z"/></clipPath></defs>
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
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '10px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', flexShrink: '0', width: '40px' }} />
                        <div style={{ boxSizing: 'border-box', display: 'flex', flexGrow: '1', justifyContent: 'space-between', minWidth: '0px', paddingTop: '2px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%' }}>
                            Jan
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%' }}>
                            Mar
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%' }}>
                            May
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#8E8E93', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%' }}>
                            Jul
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#1C1C1E', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, lineHeight: '100%' }}>
                            Sep
                          </div>
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'inline-block', paddingLeft: '50px' }}>
                        <div style={{ boxSizing: 'border-box', color: '#AEAEB2', display: 'inline-block', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', lineHeight: '100%' }}>
                          WEIGHT TREND
                        </div>
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#1C1C1E', flexShrink: '0', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '72px', height: '83px', letterSpacing: '-0.05em', lineHeight: '64px', marginTop: 'auto', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      138/84
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                      BLOOD PRESSURE
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#2563EB', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)', backgroundOrigin: 'border-box', borderColor: '#FFFFFF24', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '12px', height: '100%', minHeight: '0px', overflow: 'clip', padding: '24px', width: '0px' }}>
                    <div style={{ alignItems: 'start', boxSizing: 'border-box', display: 'flex', flexShrink: '0', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                        PRIOR AUTH
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 600, lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Approved
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '4px', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '26px', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '30px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Empagliflozin 10 mg
                      </div>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFFB8', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                        Aetna. Completed 18 Aug.
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', minHeight: '0px', position: 'relative', width: '358px' }}>
                      <div style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '14px', minHeight: '0px', width: '100%' }}>
                        <div style={{ alignItems: 'center', alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '20px', justifyContent: 'center', width: '20px' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div style={{ alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '2px', height: '38px', justifyContent: 'center', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '15px', fontWeight: 600, lineHeight: '20px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                            Chart pulled
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFFAD', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                            A1c and meds attached
                          </div>
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '14px', minHeight: '0px', width: '100%' }}>
                        <div style={{ alignItems: 'center', alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '20px', justifyContent: 'center', width: '20px' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div style={{ alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '2px', height: '38px', justifyContent: 'center', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '15px', fontWeight: 600, lineHeight: '20px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                            Form filled
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFFAD', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                            Diagnosis and dose confirmed
                          </div>
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '14px', minHeight: '0px', width: '100%' }}>
                        <div style={{ alignItems: 'center', alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '20px', justifyContent: 'center', width: '20px' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div style={{ alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '2px', height: '38px', justifyContent: 'center', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '15px', fontWeight: 600, lineHeight: '20px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                            Sent to Aetna
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFFAD', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                            Submitted 18 Aug
                          </div>
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '14px', minHeight: '0px', width: '100%' }}>
                        <div style={{ alignItems: 'center', alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', height: '20px', justifyContent: 'center', width: '20px' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                            <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
                            <path d="M5.4 10.5L8.4 13.4L14.6 6.8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div style={{ alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '2px', height: '38px', justifyContent: 'center', width: '0px' }}>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '15px', fontWeight: 600, lineHeight: '20px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                            Approved
                          </div>
                          <div style={{ boxSizing: 'border-box', color: '#FFFFFFAD', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                            Coverage active
                          </div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#FFFFFF59', boxSizing: 'border-box', height: '268px', left: '10px', position: 'absolute', top: '45px', width: '2px' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="productemr-paper-chart-end-col" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: '0px', width: '400px' }}>
                <div style={{ backgroundColor: '#FFFFFF', backgroundImage: 'linear-gradient(in oklab 0deg, oklab(92.3% -0.008 -0.031) 0%, oklab(96.9% -0.001 -0.014) 50%, oklab(100% 0 0) 100%)', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '14px', paddingBlock: '20px', paddingInline: '18px', width: '100%' }}>
                  <div style={{ boxSizing: 'border-box', color: '#8E8E93', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                    APPOINTMENTS
                  </div>
                  <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '18px', fontWeight: 600, lineHeight: '22px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      18 Aug
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#5A5A5A', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      Diabetes visit
                    </div>
                  </div>
                  <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '18px', fontWeight: 600, lineHeight: '22px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      3 Jul
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#5A5A5A', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      CKD and BP
                    </div>
                  </div>
                  <div style={{ alignItems: 'baseline', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#1C1C1E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '18px', fontWeight: 600, lineHeight: '22px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      12 May
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#5A5A5A', fontFamily: '"Inter-Regular", "Inter", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textShadow: '#FFFFFF85 0px 1px 0px, #0F172A12 0px -1px 0px' }}>
                      Annual physical
                    </div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#2563EB', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(54.6% -0.027 -0.214) 28%, oklab(62.3% -0.033 -0.185) 62%, oklab(71.4% -0.038 -0.138) 100%)', backgroundOrigin: 'border-box', borderColor: '#FFFFFF24', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '22px', minHeight: '0px', paddingBottom: '18px', paddingInline: '20px', paddingTop: '22px', width: '100%' }}>
                  <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '8px', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '36px', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: '40px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                      Type 2 Diabetes
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '36px', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: '40px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '100%' }}>
                      Hypertension
                    </div>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '36px', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: '40px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '100%' }}>
                      CKD Stage 3a
                    </div>
                    <div style={{ boxSizing: 'border-box', paddingTop: '10px', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', color: '#FFFFFF8C', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                        ALLERGIES
                      </div>
                    </div>
                    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '16px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '0px' }}>
                          Penicillin
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '0px' }}>
                          Sulfa
                        </div>
                      </div>
                      <div style={{ boxSizing: 'border-box', display: 'flex', gap: '16px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '0px' }}>
                          Latex
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', width: '0px' }}>
                          Codeine
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '8px', minHeight: '0px', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                      MEDICATIONS
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF1F', borderColor: '#FFFFFF38', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '16px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#FFFFFF29 0px 1px 0px inset', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexGrow: '1', minHeight: '0px', overflow: 'clip', padding: '6px', width: '100%' }}>
                      <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF2E', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', flexShrink: '0', gap: '10px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Metformin
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFCC', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px', width: 'max-content' }}>
                          1000 mg
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', flexShrink: '0', gap: '10px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Lisinopril
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFA6', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px', width: 'max-content' }}>
                          10 mg
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', flexShrink: '0', gap: '10px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Atorvastatin
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFA6', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px', width: 'max-content' }}>
                          20 mg
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', flexShrink: '0', gap: '10px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Aspirin
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFA6', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px', width: 'max-content' }}>
                          81 mg
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', flexShrink: '0', gap: '10px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Empagliflozin
                        </div>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFA6', flexShrink: '0', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '12px', fontWeight: 500, lineHeight: '16px', width: 'max-content' }}>
                          10 mg
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderTopColor: '#FFFFFF38', borderTopStyle: 'solid', borderTopWidth: '1px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', height: '40px', paddingLeft: '282px', paddingRight: '12px', width: '100%' }}>
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFBF', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '13px', fontWeight: 500, lineHeight: '16px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          See more
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: '0', gap: '8px', minHeight: '0px', width: '100%' }}>
                    <div style={{ boxSizing: 'border-box', color: '#FFFFFF9E', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', lineHeight: '14px' }}>
                      CARE
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF1F', borderColor: '#FFFFFF38', borderImageOutset: '0', borderImageRepeat: 'stretch', borderImageSlice: '100%', borderImageSource: 'none', borderImageWidth: '1', borderRadius: '16px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#FFFFFF29 0px 1px 0px inset', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', minHeight: '0px', overflow: 'clip', padding: '6px', width: '100%' }}>
                      <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF2E', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '44px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexGrow: '1', fontFamily: '"Inter-Regular_SemiBold", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Eye exam
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '44px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Pneumococcal
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '44px', minHeight: '44px', paddingLeft: '10px', paddingRight: '12px' }}>
                        <div style={{ borderRadius: '999px', boxSizing: 'border-box', flexShrink: '0', height: '18px', opacity: '0', width: '3px' }} />
                        <div style={{ boxSizing: 'border-box', color: '#FFFFFFC7', flexGrow: '1', fontFamily: '"Inter-Regular_Medium", "Inter", system-ui, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px' }}>
                          Foot exam
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
            </ProductEmrInnerStage>
          </div>
        </div>
  );
}
