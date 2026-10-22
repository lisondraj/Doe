/**
 * /doehealthproduct home — exported from Paper artboard "Pulse 04 Integrations — Selected"
 * (file "Tender mountain", page "Doe App v2"). Markup is kept exactly as exported;
 * the artboard is scaled to the window height and widened to fill the window width.
 */
"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import {
  DoeHealthProductProvidersHeader,
  DoeHealthProductProvidersLayers,
} from "@/components/doehealth-product/DoeHealthProductProviders";
import { DoeHealthProductServicesPage } from "@/components/doehealth-product/DoeHealthProductServices";
import { DoeHealthProductVoicePage } from "@/components/doehealth-product/DoeHealthProductVoice";
import { DoeHealthProductSchedulePage } from "@/components/doehealth-product/DoeHealthProductSchedule";
import { DoeHealthProductCalendarPage } from "@/components/doehealth-product/DoeHealthProductCalendar";
import { DoeHealthProductPaymentsPage } from "@/components/doehealth-product/DoeHealthProductPayments";
import { DoeHealthProductPermissionsPage } from "@/components/doehealth-product/DoeHealthProductPermissions";
import { DoeHealthProductReferralsPage } from "@/components/doehealth-product/DoeHealthProductReferrals";
import { DoeHealthProductFormsPage } from "@/components/doehealth-product/DoeHealthProductForms";
import { DoeHealthProductSearchPage } from "@/components/doehealth-product/DoeHealthProductSearch";
import { DoeHealthProductCallPage } from "@/components/doehealth-product/DoeHealthProductCall";
import { DoeHealthProductIndex } from "@/components/doehealth-product/DoeHealthProductIndex";
import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";

/** "call" is opened from the Voice tab's Handled list and has no rail icon of its own. */
type TabId = "schedule" | "calendar" | "voice" | "call" | "services" | "providers" | "referrals" | "payments" | "permissions" | "search" | "forms" | "integrations";

/** Pages that live in the Index dropdown in the rail. */
const INDEX_CHILDREN: TabId[] = ["services", "providers", "permissions", "search", "forms"];

/** Cross-fade duration for the inner shell when switching nav tabs. */
const FADE_MS = 200;

function NavButton({
  label,
  active,
  onSelect,
  children,
  open,
  expanded,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
  /** Set on menu triggers; drives aria-expanded and the open highlight. */
  open?: boolean;
  /** Set on dropdown parents; drives aria-expanded and the chevron, without the open highlight. */
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-expanded={open ?? expanded}
      data-open={open ? "true" : undefined}
      onClick={onSelect}
      className="doe-nav-item w-full h-[40px] shrink-0 flex items-center rounded-[10px] whitespace-nowrap"
    >
      <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", flexShrink: "0" }}>
          {children}
        </svg>
      </span>
      <span className="doe-nav-label pr-[12px] text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500]">
        {label}
      </span>
      {expanded !== undefined && (
        <span className="doe-nav-label ml-auto mr-[12px] flex">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ display: "block", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
          >
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

/** Account menu opened from the rail: who is signed in, which clinic is active, and log out. */
function AccountMenu({
  clinicId,
  onSelectClinic,
  signedIn,
}: {
  clinicId: string;
  onSelectClinic: (id: string) => void;
  signedIn: boolean;
}) {
  return (
    <div role="menu" className="doe-menu-in w-[320px] flex flex-col p-[6px] rounded-[22px] [background-color:#FFFCF1] border border-solid border-[#2819101F]">
      <div className="relative overflow-hidden flex flex-col justify-end gap-[14px] px-[16px] pt-[16px] pb-[16px] min-h-[294px] rounded-[17px] bg-sand">
        <HalftoneDisc
          size={190}
          step={7}
          color={signedIn ? "#E8A585" : "#C2A987"}
          opacity={signedIn ? 0.55 : 0.4}
          className="absolute right-[-58px] top-[-64px]"
        />
        <div className="relative flex items-center gap-[12px]">
          <span className="flex flex-col min-w-[0px] gap-[2px]">
            <span className="text-[20px] leading-[24px] tracking-[-0.01em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
              {signedIn ? DOCTOR.name : "Signed out"}
            </span>
            <span className="text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] text-sub">
              {signedIn ? DOCTOR.email : DOCTOR.name}
            </span>
          </span>
        </div>
      </div>

      {signedIn && (
        <div className="flex flex-col pt-[8px] gap-[2px]">
          {CLINICS.map((clinic) => {
            const selected = clinic.id === clinicId;
            return (
              <button
                key={clinic.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => onSelectClinic(clinic.id)}
                className={`flex items-center gap-[12px] w-full h-[56px] px-[8px] rounded-[14px] text-left cursor-pointer transition-colors duration-150 ${selected ? "bg-sand" : "hover:bg-[#F4EEDF99]"}`}
              >
                <HalftoneDisc size={40} step={4.4} maxDot={1.9} color={clinic.dot} />
                <span className="flex flex-col grow min-w-[0px] gap-[1px]">
                  <span className="text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">{clinic.name}</span>
                  <span className="text-[12px] leading-[16px] font-['DM_Sans',system-ui,sans-serif] text-sub">{clinic.location}</span>
                </span>
                <span
                  className={`w-[20px] h-[20px] shrink-0 flex items-center justify-center rounded-[999px] ${selected ? "bg-ink" : "border-[1.5px] border-solid border-[#28191033]"}`}
                >
                  {selected && (
                    <svg width="11" height="11" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}

/** Paper artboard height; the design scales by height so its proportions stay intact. */
const ARTBOARD_HEIGHT = 900;
/** Narrowest logical width the layout is designed for (the original artboard). */
const MIN_LOGICAL_WIDTH = 1440;
/** Widest logical width before the artboard stops widening and letterboxes instead. */
const MAX_LOGICAL_WIDTH = 2560;
/** Rail widths: the icon-only rail, and the expanded rail that shows labels over the content. */
const RAIL_COLLAPSED_WIDTH = 64;
const RAIL_EXPANDED_WIDTH = 240;
/** Length of the fade, measured back from where the shell meets the brown frame when the rail is expanded. */
const SHELL_FADE_WIDTH = 240;
/** The brown frame kept at the window's right edge, the same gutter the shell has when collapsed. */
const FRAME_GUTTER = 12;

/** Number of gradient stops used to approximate the eased fade. */
const SHELL_FADE_STEPS = 24;

/**
 * Builds an eased fade (smoothstep) instead of a straight linear ramp. A linear ramp has a hard
 * change in slope where it starts, which reads as a visible band; smoothstep starts and ends flat.
 */
function smoothFadeImage(): string {
  const stops: string[] = [];
  for (let i = 0; i <= SHELL_FADE_STEPS; i++) {
    const t = i / SHELL_FADE_STEPS;
    const eased = t * t * (3 - 2 * t);
    const alpha = Math.round((1 - eased) * 1000) / 1000;
    const offset = Math.round((1 - t) * SHELL_FADE_WIDTH * 100) / 100;
    stops.push(`rgba(0,0,0,${alpha}) calc(100% - ${offset}px)`);
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

/**
 * Masks the shell's own pixels so the page dissolves into the brown frame beneath it. Nothing is
 * painted over the page. The mask stops at the frame gutter, so the shell appears to slide under
 * the brown edge instead of being cut off. Collapsed, the mask is sized far past the shell, so it
 * has no effect.
 */
function shellFadeMask(expanded: boolean): CSSProperties {
  const shift = RAIL_EXPANDED_WIDTH - RAIL_COLLAPSED_WIDTH;
  const image = smoothFadeImage();
  const size = expanded ? `calc(100% - ${shift + FRAME_GUTTER}px) 100%` : `calc(100% + 2000px) 100%`;
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: size,
    WebkitMaskSize: size,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "0 0",
    WebkitMaskPosition: "0 0",
  };
}

/** Clinics the signed-in doctor can switch between. */
const CLINICS = [
  { id: "roberts", name: "Roberts Family Medicine", initials: "RF", location: "Brookline, MA", dot: "#E8A585" },
  { id: "northgate", name: "Northgate Pediatrics", initials: "NP", location: "Newton, MA", dot: "#8DAA7C" },
  { id: "oak", name: "Oak Street Clinic", initials: "OS", location: "Cambridge, MA", dot: "#C2A987" },
];
/** The doctor currently signed in on this device. */
const DOCTOR = { name: "Dr. Robert Roberts", email: "robert@robertsfamily.com", initials: "RR" };

type FitState = { scale: number; logicalWidth: number; left: number; top: number };

export type DoeHealthProductTab = TabId;

export function DoeHealthProductHome() {
  const [fit, setFit] = useState<FitState | null>(null);

  useEffect(() => {
    const update = () => {
      const { innerWidth, innerHeight } = window;
      /** Fit height; if that would squeeze below the minimum width, fit width instead. */
      const scale = Math.min(innerHeight / ARTBOARD_HEIGHT, innerWidth / MIN_LOGICAL_WIDTH);
      /** Widen the logical canvas to fill the window, clamped to the supported range. */
      const logicalWidth = Math.min(
        MAX_LOGICAL_WIDTH,
        Math.max(MIN_LOGICAL_WIDTH, innerWidth / scale),
      );
      setFit({
        scale,
        logicalWidth,
        left: (innerWidth - logicalWidth * scale) / 2,
        top: (innerHeight - ARTBOARD_HEIGHT * scale) / 2,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="doehealth-product-page relative h-[100dvh] w-full overflow-hidden bg-[#140C04]">
      <div
        className="absolute"
        style={{
          width: fit?.logicalWidth ?? MIN_LOGICAL_WIDTH,
          height: ARTBOARD_HEIGHT,
          left: fit?.left ?? 0,
          top: fit?.top ?? 0,
          transform: `scale(${fit?.scale ?? 1})`,
          transformOrigin: "top left",
          visibility: fit ? "visible" : "hidden",
        }}
      >
        <DoeHealthProductArtboard />
      </div>
    </div>
  );
}

/**
 * The app itself at the artboard's 900px height: the rail and the shell with every tab. It fills its parent's width,
 * which must sit inside `.doehealth-product-page` for the Paper tokens.
 */
export function DoeHealthProductArtboard({
  initialTab = "integrations",
  initialAccountMenuOpen = false,
  mountAll = true,
}: {
  initialTab?: TabId;
  initialAccountMenuOpen?: boolean;
  /** false mounts only the tab on show, for static previews of one page. */
  mountAll?: boolean;
} = {}) {
  const [navExpanded, setNavExpanded] = useState(false);
  const [clinicId, setClinicId] = useState(CLINICS[0].id);
  const [accountMenuOpen, setAccountMenuOpen] = useState(initialAccountMenuOpen);
  const [signedIn, setSignedIn] = useState(true);
  const activeClinic = CLINICS.find((c) => c.id === clinicId) ?? CLINICS[0];
  const accountLabel = `${signedIn ? DOCTOR.name : "Signed out"} · ${activeClinic.name}`;

  /** Escape closes the account menu. */
  useEffect(() => {
    if (!accountMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountMenuOpen]);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [shownTab, setShownTab] = useState<TabId>(initialTab);
  const [contentVisible, setContentVisible] = useState(true);
  const [indexOpen, setIndexOpen] = useState(INDEX_CHILDREN.includes(initialTab));
  const switchTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (switchTimer.current) window.clearTimeout(switchTimer.current);
    };
  }, []);

  /** Shell-level layers are always mounted; only the active tab's layer is visible and clickable. */
  const tabLayerStyle = (tab: TabId): CSSProperties => {
    const visible = shownTab === tab && contentVisible;
    return {
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transition: `opacity ${FADE_MS}ms ease`,
    };
  };

  /** Fade the inner shell out, swap the tab's content, then fade back in. */
  const switchTab = (tab: TabId) => {
    if (INDEX_CHILDREN.includes(tab)) setIndexOpen(true);
    if (tab === activeTab) return;
    setActiveTab(tab);
    setContentVisible(false);
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(() => {
      setShownTab(tab);
      setContentVisible(true);
      switchTimer.current = null;
    }, FADE_MS);
  };

  /** A full-shell tab layer: always mounted, or only while on show when `mountAll` is off. */
  const layer = (tab: TabId, page: ReactNode) =>
    mountAll || shownTab === tab ? (
      <div className="absolute inset-0" style={tabLayerStyle(tab)}>
        {page}
      </div>
    ) : null;

  return (
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] flex relative overflow-clip w-full h-[900px] bg-ink antialiased">
      {/* Expanding the rail slides the shell right instead of resizing it, so Paper layouts keep their widths. */}
      <div
        className="doe-rail group/rail absolute left-0 top-0 h-full z-20 flex flex-col overflow-hidden bg-ink pt-[26px] pb-[24px] px-[12px]"
        data-expanded={navExpanded}
        style={{ width: navExpanded ? RAIL_EXPANDED_WIDTH : RAIL_COLLAPSED_WIDTH, transition: "width 200ms ease" }}
      >
        <div className="w-[40px] flex justify-center text-[28px] leading-[28px] font-['Lora-Regular_SemiBold','Lora',system-ui,sans-serif] font-[600] [color:var(--color-paper)]">
          D
        </div>
        <div className="flex flex-col gap-[10px] mt-[110px]">
          {/* Index is the default page; its sub-pages open in a dropdown beneath it. */}
          <div className="flex flex-col">
            <NavButton
              label="Index"
              active={activeTab === "integrations"}
              expanded={indexOpen}
              onSelect={() => {
                if (activeTab === "integrations") setIndexOpen((v) => !v);
                else {
                  setIndexOpen(true);
                  switchTab("integrations");
                }
              }}
            >
              <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <ellipse cx="12" cy="12" rx="3.6" ry="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3.5 12h17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </NavButton>
            <div className="grid" style={{ gridTemplateRows: indexOpen ? "1fr" : "0fr", transition: "grid-template-rows 220ms ease" }}>
              <div className="min-h-0 overflow-hidden" aria-hidden={!indexOpen}>
                <div
                  className="flex flex-col gap-[6px] mt-[8px] rounded-[12px] bg-[#FFFCF10A] group-data-[expanded=true]/rail:pl-[10px]"
                  style={{
                    opacity: indexOpen ? 1 : 0,
                    visibility: indexOpen ? "visible" : "hidden",
                    transition: `opacity 180ms ease, padding 200ms ease, visibility 0ms linear ${indexOpen ? "0ms" : "220ms"}`,
                  }}
                >
                <NavButton label="Services" active={activeTab === "services"} onSelect={() => switchTab("services")}>
                  <path d="M9 7h10M9 12h10M9 17h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <circle cx="5" cy="7" r="1.2" fill="currentColor" />
                  <circle cx="5" cy="12" r="1.2" fill="currentColor" />
                  <circle cx="5" cy="17" r="1.2" fill="currentColor" />
                </NavButton>
                <NavButton label="Providers" active={activeTab === "providers"} onSelect={() => switchTab("providers")}>
                  <circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </NavButton>
                <NavButton label="Agent permissions" active={activeTab === "permissions"} onSelect={() => switchTab("permissions")}>
                  <path d="M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M9.2 12.2l2 2 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </NavButton>
                <NavButton label="Integrations" active={activeTab === "search"} onSelect={() => switchTab("search")}>
                  <path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3.5a5.5 5.5 0 0 1-11 0z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16.5v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </NavButton>
                <NavButton label="Forms" active={activeTab === "forms"} onSelect={() => switchTab("forms")}>
                  <rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </NavButton>
                </div>
              </div>
            </div>
          </div>
          <NavButton label="Schedule" active={activeTab === "schedule"} onSelect={() => switchTab("schedule")}>
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <rect x="3.5" y="13" width="17" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          </NavButton>
          <NavButton label="Calendar" active={activeTab === "calendar"} onSelect={() => switchTab("calendar")}>
            <rect x="3.5" y="4.5" width="17" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="8.5" cy="11" r="1.1" fill="currentColor" />
            <circle cx="12" cy="11" r="1.1" fill="currentColor" />
            <circle cx="15.5" cy="11" r="1.1" fill="currentColor" />
            <circle cx="8.5" cy="15.2" r="1.1" fill="currentColor" />
            <circle cx="12" cy="15.2" r="1.1" fill="currentColor" />
          </NavButton>
          <NavButton label="Voice" active={activeTab === "voice" || activeTab === "call"} onSelect={() => switchTab("voice")}>
            <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </NavButton>
          <NavButton label="Referrals" active={activeTab === "referrals"} onSelect={() => switchTab("referrals")}>
            <circle cx="6.5" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="17.5" cy="6.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="17.5" cy="17.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9 10.8l6-3.2M9 13.2l6 3.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </NavButton>
          <NavButton label="Payments" active={activeTab === "payments"} onSelect={() => switchTab("payments")}>
            <rect x="3.5" y="6" width="17" height="12.5" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M3.5 10.5h17M7.5 14.8h3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </NavButton>
        </div>
        <div className="flex flex-col gap-[10px] mt-auto">
          <NavButton
            label={navExpanded ? "Collapse" : "Expand"}
            active={false}
            onSelect={() => setNavExpanded((v) => !v)}
          >
            <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9.5 4.5v15" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path
              d={navExpanded ? "M16 9.5l-2.5 2.5 2.5 2.5" : "M13.5 9.5l2.5 2.5-2.5 2.5"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </NavButton>
          {/* Account: the signed-in doctor and active clinic; opens the clinic switcher. */}
          <button
            type="button"
            aria-label={accountLabel}
            title={accountLabel}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            data-open={accountMenuOpen ? "true" : undefined}
            onClick={() => setAccountMenuOpen((v) => !v)}
            className="doe-nav-item w-full h-[48px] shrink-0 flex items-center rounded-[12px] whitespace-nowrap text-left"
          >
            <span className="w-[40px] h-[48px] shrink-0 flex items-center justify-center">
              <HalftoneDisc size={32} step={4.4} maxDot={1.7} color={signedIn ? "#E8A585" : "#C2A987"} opacity={signedIn ? 1 : 0.5} />
            </span>
            <span className="doe-nav-label flex flex-col grow min-w-[0px] pl-[2px]">
              <span className="block overflow-hidden text-ellipsis text-[14px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[600] [color:#FFFCF1]">
                {signedIn ? DOCTOR.name : "Signed out"}
              </span>
              <span className="block overflow-hidden text-ellipsis text-[12px] leading-[16px] font-['Inter-Regular','Inter',system-ui,sans-serif] [color:#FFFCF199]">
                {activeClinic.name}
              </span>
            </span>
            <span className="doe-nav-label shrink-0 pr-[10px] pl-[4px]">
              <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", flexShrink: "0" }}>
                <path d="M8 9l4-4 4 4M8 15l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          {/* Sign in / log out sits under the account button, as its own rail item. */}
          <NavButton label={signedIn ? "Log out" : "Sign in"} active={false} onSelect={() => setSignedIn((v) => !v)}>
            <path
              d={signedIn ? "M14 4h3.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 8l-4 4 4 4M6 12h9" : "M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10M14 8l4 4-4 4M18 12H9"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </NavButton>
        </div>
      </div>
      {accountMenuOpen && (
        <>
          {/* Clicking anywhere outside the menu closes it. */}
          <div className="absolute inset-0 z-[25]" onClick={() => setAccountMenuOpen(false)} />
          <div
            className="absolute z-[30] bottom-[24px]"
            style={{
              left: (navExpanded ? RAIL_EXPANDED_WIDTH : RAIL_COLLAPSED_WIDTH) + 8,
              transition: "left 200ms ease",
            }}
          >
            <AccountMenu
              clinicId={clinicId}
              onSelectClinic={(id) => {
                setClinicId(id);
                setAccountMenuOpen(false);
              }}
              signedIn={signedIn}
            />
          </div>
        </>
      )}
      <div
        className="grow h-full flex pl-[64px] pr-[12px] py-[12px] relative"
        style={{
          transform: navExpanded ? `translateX(${RAIL_EXPANDED_WIDTH - RAIL_COLLAPSED_WIDTH}px)` : "none",
          transition: `transform 200ms ease, mask-size 200ms ease, -webkit-mask-size 200ms ease`,
          ...shellFadeMask(navExpanded),
        }}
      >
        {/* Dims the shell and makes it inactive while the rail or the clinic menu is open. Clicking it collapses the rail; the clinic menu's own overlay closes the menu. */}
        <div
          className="absolute left-[64px] right-[12px] top-[12px] bottom-[12px] rounded-[24px] z-[15]"
          aria-hidden="true"
          data-shell-dim
          onClick={() => setNavExpanded(false)}
          style={{
            backgroundColor: "rgba(20, 12, 4, 0.18)",
            opacity: navExpanded || accountMenuOpen ? 1 : 0,
            pointerEvents: navExpanded || accountMenuOpen ? "auto" : "none",
            transition: "opacity 200ms ease",
          }}
        />
        <div className="grow h-full flex p-[12px] rounded-[24px] overflow-clip gap-[12px] relative [background-color:#FFFCF1]">
          {/* Full-shell tab layers sit beneath the content panel, as in Paper. */}
          {layer("schedule", <DoeHealthProductSchedulePage />)}
          {layer("calendar", <DoeHealthProductCalendarPage />)}
          {layer("voice", <DoeHealthProductVoicePage onOpenCall={() => switchTab("call")} />)}
          {layer("call", <DoeHealthProductCallPage onBack={() => switchTab("voice")} />)}
          {layer("services", <DoeHealthProductServicesPage />)}
          {layer("providers", <DoeHealthProductProvidersLayers />)}
          {layer("referrals", <DoeHealthProductReferralsPage />)}
          {layer("forms", <DoeHealthProductFormsPage />)}
          {layer("search", <DoeHealthProductSearchPage />)}
          {layer("payments", <DoeHealthProductPaymentsPage />)}
          {layer("permissions", <DoeHealthProductPermissionsPage />)}
          <div
            className="grow min-w-[0px] h-full flex flex-col p-[28px] gap-[24px] relative"
            style={{
              opacity: contentVisible ? 1 : 0,
              /** The panel only has content for these tabs; elsewhere let clicks reach the layers. */
              pointerEvents: shownTab === "integrations" || shownTab === "providers" ? "auto" : "none",
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          >
          {shownTab === "integrations" && <DoeHealthProductIndex clinic={activeClinic} onNavigate={switchTab} />}
          {shownTab === "providers" && <DoeHealthProductProvidersHeader />}
          </div>
        </div>
      </div>
    </div>
  );
}
