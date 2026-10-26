"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), its providers or locations, the specialty
 * (picked from the set or typed), then the four tiers side by side, and where to send the setup. Tiers stay out of
 * sight until the comparison. A brown bar along the bottom holds Back, a step counter and Continue. The last step is
 * checkout: a summary, the buyer's details, one payment or a payment link per provider, and the card, then thanks.
 *
 * The practice is a team: locations, each with named providers who have their own specialty and plan. Free is in the
 * comparison but can't be chosen. On the comparison a toolbar for locations, providers, the team and the price
 * follows you down the page, and a panel on the right (a sheet on iPhone) holds the team to edit and the price, line
 * by line. Surfaces follow /news: beige outside, white inside, no borders.
 */
import { Fragment, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  ANNUAL_FACTOR,
  type Bracket,
  bracketFor,
  bracketLabel,
  FEATURE_GROUPS,
  LOCATION_BRACKETS,
  mixedPrice,
  type PlanId,
  PLAN_ORDER,
  PLANS,
  PRACTICE_SHAPES,
  type PracticeShape,
  type PriceRow,
  PROVIDER_BRACKETS,
  SPECIALTIES,
  SPECIALTY_FEATURES,
  SPECIALTY_FROM,
  type SpecialtyId,
} from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { taxForZip, taxOn } from "@/lib/doehealthdesk2/doehealthdesk2-tax";
import { p22Mackinac } from "@/lib/home/fonts";

const DISPLAY = p22Mackinac.className;
const SUB = "text-[rgba(20,12,4,0.56)]";
const HAIR = "border-[rgba(20,12,4,0.07)]";
/** Doe's boxes, as on /news: a beige box outside, white pieces inside it, no borders. */
const OUTER = "bg-[#F4EEDF]";
const INNER = "bg-white";
/** What's picked: a soft peach fill, no border, rather than a heavy dark fill. */
const SELECTED = "bg-[#FBE7DA] text-[#281910]";
/** A field in focus: white, with a soft peach ring rather than a dark one. */
const FOCUS = "focus:bg-white focus:shadow-[inset_0_0_0_1.5px_#EDBB9C]";
/** A field still to complete, once Continue is tapped too soon: a red ring, kept while it's focused. */
const BAD = "shadow-[inset_0_0_0_1.5px_#D9482B] focus:shadow-[inset_0_0_0_1.5px_#D9482B]";
/** The same red ring for a control that isn't a text field (a chip, a picker), drawn outside it. */
const BAD_RING = "rounded-[999px] shadow-[0_0_0_1.5px_#D9482B]";
/** A beige box pinned over the page as it scrolls, lifted off it by a soft shadow (the cream behind it stops at its edge, so the shadow lands on the rows, not on a white haze). */
const PINNED = "bg-[#F4EEDF] shadow-[0_12px_28px_-14px_rgba(40,25,16,0.45)]";

/** Plans a practice can be on: every tier but Free, which stays in the comparison. */
const PAID = PLANS.filter((p) => p.id !== "free");
/** What paying yearly takes off, as a whole percentage. */
const YEARLY_OFF = Math.round((1 - ANNUAL_FACTOR) * 100);

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
/** Dollars and cents, for tax and anything with it added. */
const cents = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
/** Every price before checkout is before tax; this says so, wherever a price stands. */
const TAX_NOTE = "Taxes calculated before payment";
/** A year at a monthly price: the month as shown, in whole dollars, times twelve, so the sum on screen adds up. */
const yearly = (perMonth: number) => Math.round(perMonth) * 12;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const includes = (plan: PlanId, from: PlanId) => PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(from);
const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;

type Specialty = SpecialtyId | "other";
/** A provider; a null specialty or plan follows the practice's. `other` is the specialty they typed, when theirs is Other. */
type Provider = { id: string; name: string; specialty: Specialty | null; other: string; plan: PlanId | null };
type Site = { id: string; name: string; providers: Provider[] };

type Answers = {
  shape: PracticeShape | null;
  team: Site[];
  plan: PlanId | null;
  annual: boolean;
  contact: { name: string; email: string; practice: string };
  /** The provider who is the buyer, if the buyer is one of them. */
  me: string | null;
  /** The buyer isn't a provider and is buying for the practice. */
  onBehalf: boolean;
  /** One payment for everyone, or a payment link sent to each provider. */
  payMode: "one" | "split";
  /** Where each provider's payment link goes, by provider id. */
  emails: Record<string, string>;
  card: { number: string; expiry: string; cvc: string; zip: string };
};

let seq = 0;
const nextId = (prefix: string) => `${prefix}${++seq}`;
/** A new provider, taking the specialty of the one it's added after, if any. */
const newProvider = (from?: Provider): Provider => ({ id: nextId("p"), name: "", specialty: from?.specialty ?? null, other: from?.other ?? "", plan: null });
const newSite = (name: string, count: number, from?: Provider): Site => ({ id: nextId("s"), name, providers: Array.from({ length: count }, () => newProvider(from)) });

const START: Answers = {
  shape: null,
  team: [newSite("Clinic 1", 1)],
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
  me: null,
  onBehalf: false,
  payMode: "one",
  emails: {},
  card: { number: "", expiry: "", cvc: "", zip: "" },
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
/** Card details in the shapes they're typed: a 13–19 digit number, MM/YY, a 3–4 digit code, and a ZIP. */
const cardOk = (c: Answers["card"]) =>
  /^\d{13,19}$/.test(c.number.replace(/\s/g, "")) && /^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry) && /^\d{3,4}$/.test(c.cvc) && c.zip.trim().length >= 3;
const groupCard = (v: string) => v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
const groupExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** A site with its provider list grown or trimmed to `n`, keeping the providers it already has; new ones copy the last one's specialty. */
const resize = (site: Site, n: number): Site => ({
  ...site,
  providers:
    n > site.providers.length
      ? [...site.providers, ...Array.from({ length: n - site.providers.length }, () => newProvider(site.providers[site.providers.length - 1]))]
      : site.providers.slice(0, Math.max(1, n)),
});

const shapeOf = (team: Site[]): PracticeShape => (team.length > 1 ? "group" : team[0]!.providers.length > 1 ? "clinic" : "solo");

function initials(name: string, n: number) {
  const words = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).filter(Boolean);
  return words.length ? words.map((w) => w[0]).join("").slice(0, 2).toUpperCase() : `P${n}`;
}

/**
 * The shape of each kind of practice, drawn in lines a shade off its beige well: buildings as outlines, providers as
 * small rings. On the chosen card the lines go a soft peach.
 */
function ShapeMark({ shape, on, scale = 1 }: { shape: PracticeShape; on: boolean; scale?: number }) {
  const line = on ? "#E2A988" : "#D6C5A6";
  const building = (x: number, w: number, dots: number, key: string) => (
    <g key={key}>
      <rect x={x} y="10" width={w} height="34" rx="8" fill="none" stroke={line} strokeWidth="1.6" />
      {Array.from({ length: dots }, (_, i) => {
        const cols = Math.min(dots, 2);
        const gap = w / (cols + 1);
        return <circle key={i} cx={x + gap * ((i % cols) + 1)} cy={22 + Math.floor(i / cols) * 11} r="3.2" fill="none" stroke={line} strokeWidth="1.6" />;
      })}
    </g>
  );
  return (
    <svg width={88 * scale} height={52 * scale} viewBox="0 0 88 52" aria-hidden="true" style={{ display: "block" }}>
      {shape === "solo" && building(28, 32, 1, "a")}
      {shape === "clinic" && building(22, 44, 4, "a")}
      {shape === "group" && [building(4, 24, 2, "a"), building(32, 24, 3, "b"), building(60, 24, 2, "c")]}
    </svg>
  );
}

function Count({ value, onChange, min = 1, max = 100, big = false }: { value: number; onChange: (v: number) => void; min?: number; max?: number; big?: boolean }) {
  const size = big ? "w-[52px] h-[52px] text-[24px]" : "w-[32px] h-[32px] text-[17px]";
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-white hover:bg-[#FFFCF1] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35`;
  return (
    <span className="inline-flex items-center gap-[2px] p-[3px] rounded-[999px] bg-[#F4EEDF]">
      <button type="button" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        −
      </button>
      <span className={`${big ? "w-[76px] text-[40px] leading-[44px]" : "w-[34px] text-[19px] leading-[24px]"} text-center ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

/**
 * A small pill-shaped dropdown, light or dark, with the careers page's menu: a cream rounded list under the pill, the
 * choice in bold with a check, rows lit in sand on hover. Arrow keys, Home/End, Enter, Escape and a click outside all
 * work. The list is put on the page's top layer, so the side panel and sheets never clip it; it opens upward when
 * there's no room below.
 */
function Pick<T extends string>({
  value,
  options,
  onChange,
  label,
  dark = false,
  big = false,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
  big?: boolean;
}) {
  const [place, setPlace] = useState<{ left: number; top?: number; bottom?: number; minWidth: number; maxHeight: number } | null>(null);
  const open = !!place;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const current = options.find((o) => o.id === value);
  // A blank choice is the pill's prompt ("Choose specialty"), not something to pick.
  const choices = options.filter((o) => o.id !== "");

  const openMenu = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const up = below < 240 && above > below;
    setPlace({
      left: Math.max(8, Math.min(r.left, window.innerWidth - 248)),
      ...(up ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
      minWidth: Math.max(r.width, 200),
      maxHeight: Math.min(340, up ? above : below) - 6,
    });
  };
  const close = (refocus: boolean) => {
    setPlace(null);
    if (refocus) triggerRef.current?.focus();
  };
  const choose = (id: T) => {
    onChange(id);
    close(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    // The current choice takes focus, so the keyboard can move from it straight away.
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    (items.find((el) => el.getAttribute("aria-selected") === "true") ?? items[0])?.focus({ preventScroll: true });
    items.find((el) => el.getAttribute("aria-selected") === "true")?.scrollIntoView({ block: "nearest" });
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!listRef.current?.contains(t) && !triggerRef.current?.contains(t)) close(false);
    };
    // The list follows its pill as the page scrolls or the iPhone's toolbar resizes the screen, and closes once the
    // pill has left the screen.
    const follow = (e?: Event) => {
      if (e && listRef.current?.contains(e.target as Node)) return;
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) close(false);
      else openMenu();
    };
    const onScroll = (e: Event) => follow(e);
    const onResize = () => follow();
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // Only when the menu opens or closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onListKey = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") close(false);
  };

  return (
    <span className="relative flex items-center shrink-0 min-w-[0px]">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${current?.label ?? ""}`}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu();
          }
        }}
        className={`flex items-center gap-[8px] min-w-[0px] max-w-full rounded-[999px] font-[500] outline-none cursor-pointer whitespace-nowrap focus-visible:outline-[2px] focus-visible:outline-offset-[2px] focus-visible:outline-[rgba(40,25,16,0.22)] transition-colors duration-150 ${big ? "h-[44px] pl-[16px] pr-[13px] text-[15px] leading-[20px]" : "h-[34px] pl-[12px] pr-[10px] text-[13px] leading-[16px]"} ${dark ? "bg-[#281910] hover:bg-[#3A2920] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910]"}`}
      >
        <span className="truncate">{current?.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ display: "block" }}>
          <path d="M6 9l6 6 6-6" fill="none" stroke={dark ? "#FCCFB8" : "#281910"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {place &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            onKeyDown={onListKey}
            style={{ left: place.left, top: place.top, bottom: place.bottom, minWidth: place.minWidth, maxHeight: place.maxHeight }}
            className="doe-pricing-menu fixed z-[80] m-0 p-[6px] list-none rounded-[18px] bg-[#FFFCF1] shadow-[0_10px_28px_rgba(40,25,16,0.12),0_0_0_1px_rgba(40,25,16,0.05)] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {choices.map((o) => {
              const on = o.id === value;
              return (
                <li
                  key={o.id}
                  role="option"
                  aria-selected={on}
                  tabIndex={-1}
                  onClick={() => choose(o.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      choose(o.id);
                    }
                  }}
                  className={`flex items-center justify-between gap-[16px] px-[14px] py-[10px] rounded-[12px] text-[15px] leading-[20px] tracking-[-0.015em] text-[#281910] whitespace-nowrap cursor-pointer outline-none transition-colors duration-[140ms] hover:bg-[#F4EEDF] focus:bg-[#F4EEDF] ${on ? "font-[600]" : "font-[400]"}`}
                >
                  {o.label}
                  {on && (
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </span>
  );
}

function Mark({ on, dark = false }: { on: boolean; dark?: boolean }) {
  return on ? (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Included" style={{ display: "block" }}>
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={dark ? "#FCCFB8" : "#281910"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <span aria-label="Not included" className={`block w-[12px] h-[1.5px] rounded-[2px] ${dark ? "bg-[rgba(255,252,241,0.3)]" : "bg-[rgba(20,12,4,0.2)]"}`} />
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0, transform: open ? "rotate(90deg)" : undefined, transition: "transform 200ms ease" }}>
      <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Close({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] text-[#281910] hover:bg-[#F4EEDF] transition-colors duration-150">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * A name you can rename in place: the text at full strength (a blank name shows its default the same way), sized to
 * itself, with a small pencil after it. Hover tints it, focus rings it, and the pencil steps back while typing.
 */
function NameField({
  value,
  placeholder,
  label,
  onChange,
  text,
  large = false,
}: {
  value: string;
  placeholder: string;
  label: string;
  onChange: (v: string) => void;
  /** Type classes, shared by the field and its sizing copy; under 16px on iPhone the site bumps fields to 16px. */
  text: string;
  /** Set above 16px, so the site's iPhone minimum leaves it alone. */
  large?: boolean;
}) {
  return (
    <label className="group/name inline-flex items-center gap-[7px] min-w-[0px] max-w-full h-[36px] -ml-[8px] px-[8px] rounded-[10px] cursor-text [@media(hover:hover)]:hover:bg-[rgba(20,12,4,0.05)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1.5px_#EDBB9C] transition-[background-color,box-shadow] duration-150">
      {/* The hidden copy sizes the field to its text, so the pencil sits right after the name. */}
      <span className="inline-grid min-w-[0px] max-w-full">
        <span aria-hidden="true" className={`invisible col-start-1 row-start-1 whitespace-pre overflow-hidden ${text}`}>
          {value || placeholder}
        </span>
        <input
          value={value}
          placeholder={placeholder}
          aria-label={label}
          // One character wide on its own, so the hidden copy, not the browser's default width, sets the size.
          size={1}
          data-large-field={large ? "" : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`col-start-1 row-start-1 w-full min-w-[0px] p-0 bg-transparent outline-none placeholder:text-inherit placeholder:opacity-100 ${text}`}
        />
      </span>
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-[rgba(20,12,4,0.38)] group-hover/name:text-[#281910] group-focus-within/name:opacity-0 transition-[color,opacity] duration-150" style={{ display: "block" }}>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

function TeamIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** One discount ladder, with the step the practice is on filled in. */
function Ladder({ title, brackets, n }: { title: string; brackets: Bracket[]; n: number }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className={`text-[13px] leading-[16px] font-[500] ${SUB}`}>{title}</span>
      <div className="grid grid-cols-4 gap-[4px]">
        {brackets.map((b) => {
          const on = n >= b.min && n <= b.max;
          return (
            <span key={b.min} className={`flex flex-col gap-[1px] px-[10px] py-[8px] rounded-[14px] transition-colors duration-200 ${on ? SELECTED : "bg-[#F4EEDF] text-[#281910]"}`}>
              <span className={`text-[16px] leading-[20px] ${DISPLAY}`}>{b.off ? `−${Math.round(b.off * 100)}%` : "0%"}</span>
              <span className={`text-[11px] leading-[14px] ${SUB}`}>{bracketLabel(b)}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  bad = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "email" | "text";
  autoComplete?: string;
  /** Still to complete, once Continue has been tapped: ringed in red. */
  bad?: boolean;
}) {
  return (
    <label className="flex flex-col gap-[8px] min-w-[0px]">
      <span className={`px-[4px] text-[14px] leading-[18px] font-[500] ${SUB}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={bad || undefined}
        data-pricing-warn={bad ? "" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[56px] px-[20px] rounded-[18px] bg-white outline-none ${FOCUS} ${bad ? BAD : ""} text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.32)] transition-[background-color,box-shadow] duration-150`}
      />
    </label>
  );
}

type Question = {
  id: string;
  /** The step's name in the row of steps. */
  step: string;
  /** The title, as the lines it's set on (two, but one where a single word says it). */
  title: [string, string] | [string];
  /** The comparison needs more room than a question. */
  wide?: boolean;
  ready: boolean;
  body: ReactNode;
};

type PanelTab = "team" | "price";

export function DoeHealthPricingBuilder({ phone }: { phone: boolean }) {
  const [a, setA] = useState<Answers>(START);
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(false);
  const [panel, setPanel] = useState<PanelTab | null>(null);
  const [openSpecialty, setOpenSpecialty] = useState<SpecialtyId | null>(null);
  /** The tier shown on iPhone, where tiers are compared one at a time; null follows the team's plan. */
  const [view, setView] = useState<PlanId | null>(null);
  /** Ids past this were added on the comparison and not yet confirmed; zero until the comparison is reached. */
  const [planEntry, setPlanEntry] = useState(0);
  /** The modal that asks to confirm locations and providers added on the comparison, before checkout. */
  const [confirming, setConfirming] = useState(false);
  /** The step (or "additions", the confirm sheet) where Continue was tapped before it was ready; its fields show what to fix. */
  const [tried, setTried] = useState<string | null>(null);
  const [warnCount, setWarnCount] = useState(0);
  const flag = (id: string) => {
    setTried(id);
    setWarnCount((n) => n + 1);
  };
  // Brings the first field to complete into view, each time Continue is tapped too soon.
  useEffect(() => {
    if (!warnCount) return;
    const id = requestAnimationFrame(() => document.querySelector("[data-pricing-warn]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    return () => cancelAnimationFrame(id);
  }, [warnCount]);
  /**
   * Where the pinned bar sits once it reaches the top of the screen, or null while it stays in place: the toolbar on
   * desktop (with a strip of tier names once the table's header has scrolled away), the tier switcher on iPhone.
   */
  const [pinned, setPinned] = useState<{ left: number; width: number; height: number; strip: boolean; cover: number } | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  /** Desktop checkout: the summary, and whether it has scrolled away so a copy follows on the right. */
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryFollows, setSummaryFollows] = useState(false);
  const moved = useRef(false);
  const pinTop = phone ? 118 : 112;
  /** Ids past this were added since the current step or panel came into view: they grow in rather than appear. */
  const baseline = useRef(0);
  const viewKey = useRef("");
  if (viewKey.current !== `${at}-${done}-${panel}`) {
    viewKey.current = `${at}-${done}-${panel}`;
    baseline.current = seq;
  }
  const fresh = (id: string) => Number(id.slice(1)) > baseline.current;

  const set = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }));
  const setTeam = (team: Site[]) => set({ team, shape: shapeOf(team) });
  const editSite = (id: string, patch: Partial<Site>) => setTeam(a.team.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const editProvider = (id: string, patch: Partial<Provider>) => set({ team: a.team.map((s) => ({ ...s, providers: s.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)) })) });

  const plan = planById(a.plan ?? "advanced");
  const factor = a.annual ? ANNUAL_FACTOR : 1;
  const providers = a.team.flatMap((s) => s.providers);
  const providerCount = providers.length;
  const locationCount = a.team.length;
  const planOf = (p: Provider) => planById(p.plan ?? plan.id);
  const mixed = providers.some((p) => planOf(p).id !== plan.id);
  const specialtyOf = (p: Provider): Specialty | null => p.specialty;
  /** A specialty's name, or what was typed for Other. */
  const specialtyName = (sp: Specialty, typed: string) => (sp === "other" ? typed.trim() || "Other" : SPECIALTIES.find((x) => x.id === sp)?.label ?? "");
  /** Every provider has a specialty, and anyone on Other has typed theirs. */
  const specialtiesSet = providers.every((p) => p.specialty && (p.specialty !== "other" || p.other.trim()));
  /** A provider still without a specialty, or on Other without one typed. */
  const specialtyGap = (p: Provider) => !p.specialty || (p.specialty === "other" && !p.other.trim());
  /** A location's name, or its default when left blank. */
  const siteName = (site: Site) => site.name.trim() || `Clinic ${a.team.indexOf(site) + 1}`;
  const providerName = (p: Provider) => p.name.trim() || `Provider ${providers.indexOf(p) + 1}`;

  /** The team as price rows: each location's providers grouped by plan, the location charged at its highest plan. */
  const rowsFor = (override?: PlanId): PriceRow[] =>
    a.team.flatMap((site) => {
      const groups = PLAN_ORDER.slice()
        .reverse()
        .map((id) => ({ id, n: site.providers.filter((p) => (override ?? planOf(p).id) === id).length }))
        .filter((g) => g.n > 0);
      return groups.map((g, i) => ({ id: `${site.id}-${g.id}`, name: siteName(site), providers: g.n, plan: planById(g.id), location: i === 0 }));
    });
  const priced = mixedPrice(rowsFor());
  const total = priced.total * factor;
  /** Each tier's price with the whole team on it, for the comparison. */
  const priceOf = (id: PlanId) => mixedPrice(rowsFor(id)).total * factor;
  /** Each provider's share of the monthly price, weighted by their tier's own price, for individual payments. */
  const weightOf = (p: Provider) => planOf(p).base;
  const weights = providers.reduce((n, p) => n + weightOf(p), 0);
  const shareOf = (p: Provider) => (weights ? (total * weightOf(p)) / weights : total / Math.max(1, providerCount));
  const meProvider = a.onBehalf ? undefined : providers.find((p) => p.id === a.me);
  /** What the buyer pays today: everything, or with individual payments only their own share (nothing if not a provider). */
  const monthlyDue = a.payMode === "one" ? total : meProvider ? shareOf(meProvider) : 0;
  const dueToday = Math.round(monthlyDue) * (a.annual ? 12 : 1);
  /** Tax on what's paid today, by the state of the card's ZIP; null until the ZIP reads as one. */
  const tax = taxForZip(a.card.zip);
  const taxDue = tax ? taxOn(dueToday, tax.rate) : 0;
  /** The tax's region and rate, as it's shown once the ZIP reads as one ("CA 7.25%"). */
  const taxLabel = tax ? `${tax.state} ${+(tax.rate * 100).toFixed(3)}%` : "";
  /** What the practice is billed each month or year, and the tax on it once known: the summary's total. */
  const billed = a.annual ? yearly(total) : total;
  const billedTax = tax ? taxOn(billed, tax.rate) : 0;
  /** Providers who get a payment link of their own. */
  const linkRecipients = a.payMode === "split" ? providers.filter((p) => p.id !== meProvider?.id) : [];
  /** Buying on behalf of providers and paying as one, every provider still gets an invite to Doe by email. */
  const inviteRecipients = a.onBehalf && a.payMode === "one" ? providers : [];
  /** Everyone who needs an email: a payment link, or an invite. */
  const emailRecipients = linkRecipients.length ? linkRecipients : inviteRecipients;
  const sendNote = linkRecipients.length
    ? `${plural(linkRecipients.length, "payment link")} will go out when you finish.`
    : inviteRecipients.length
      ? `${plural(inviteRecipients.length, "invite")} to Doe will go out when you finish.`
      : null;

  /** Picking a practice shape reshapes the team, keeping what it can. */
  const pickShape = (shape: PracticeShape) => {
    const first = a.team[0]!;
    const team =
      shape === "solo"
        ? [resize({ ...first, name: first.name }, 1)]
        : shape === "clinic"
          ? [resize(first, Math.max(first.providers.length, 2))]
          : a.team.length > 1
            ? a.team
            : [first, newSite("Clinic 2", 1, first.providers[0])];
    set({ shape, team });
  };

  /** Locations from the toolbar: more turns the practice multi-clinic, fewer drops the last ones. */
  const setLocations = (n: number) => {
    if (n > a.team.length) setTeam([...a.team, ...Array.from({ length: n - a.team.length }, (_, i) => newSite(`Clinic ${a.team.length + i + 1}`, 1, providers[0]))]);
    else setTeam(a.team.slice(0, Math.max(1, n)));
  };
  /** Providers from the toolbar: added to or taken from the last location. */
  const setProviderTotal = (n: number) => {
    const last = a.team[a.team.length - 1]!;
    const others = providerCount - last.providers.length;
    setTeam(a.team.map((s) => (s.id === last.id ? resize(s, Math.max(1, n - others)) : s)));
  };

  /** The practice's plan, for every provider without one of their own (set in the team panel). */
  const choose = (id: PlanId) => set({ plan: id });
  const onTier = (id: PlanId) => providers.filter((p) => planOf(p).id === id).length;

  /** A tier is lit while anyone on the team is on it. */
  const lit = (id: PlanId) => !!a.plan && onTier(id) > 0;
  const cols = "grid-cols-[minmax(170px,1.4fr)_repeat(4,minmax(116px,1fr))]";
  /** Doe One's column is always brown; a tier the team uses gets a soft tint. */
  const dark = (id: PlanId) => id === "one";
  const cell = (id: PlanId) => `flex justify-center self-stretch items-center ${dark(id) ? "bg-[#281910]" : lit(id) ? "bg-[rgba(244,232,210,0.7)]" : ""}`;
  const sizeLine = `${plural(providerCount, "provider")}, ${plural(locationCount, "location")}`;

  const badge = (id: PlanId) =>
    id === "advanced" ? (
      <span className="h-[22px] px-[9px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#140C04] whitespace-nowrap">Most chosen</span>
    ) : id === "one" ? (
      <span className="h-[22px] px-[9px] flex items-center rounded-[999px] border-[1.5px] border-solid border-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#FCCFB8] whitespace-nowrap">Complete</span>
    ) : null;

  /** On a tier the team uses, how many are on it; on any other paid tier, a button to choose it. Free has neither. */
  const tierAction = (id: PlanId, full = false) => {
    const size = full ? "h-[48px] text-[15px] leading-[20px]" : "h-[36px] text-[13px] leading-[16px]";
    if (lit(id))
      return (
        <span
          className={`w-full flex items-center justify-center gap-[6px] rounded-[999px] font-[600] whitespace-nowrap ${size} ${dark(id) ? "bg-[rgba(255,252,241,0.1)] text-[#FCCFB8]" : "bg-[rgba(20,12,4,0.07)] text-[#281910]"}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {mixed ? plural(onTier(id), "provider") : "Your plan"}
        </span>
      );
    if (id === "free") return null;
    return (
      <button
        type="button"
        onClick={() => choose(id)}
        className={`w-full flex items-center justify-center rounded-[999px] font-[600] whitespace-nowrap transition-colors duration-150 ${size} ${dark(id) ? "bg-[#FCCFB8] hover:bg-[#FFDCCB] text-[#140C04]" : "bg-[#281910] hover:bg-[#3A2920] text-[#FFFCF1]"}`}
      >
        Choose{full ? ` ${planById(id).name}` : ""}
      </button>
    );
  };

  const groupRows = (title: string, from: PlanId, items: string[], key = title) => (
    <Fragment key={key}>
      <span className={`px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>{title}</span>
      {PLAN_ORDER.map((id) => (
        <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
      ))}
      {items.map((item) => (
        <Fragment key={item}>
          <span className={`px-[20px] py-[7px] text-[14px] leading-[19px] ${SUB}`}>{item}</span>
          {PLAN_ORDER.map((id) => (
            <span key={id} className={cell(id)}>
              <Mark on={includes(id, from)} dark={dark(id)} />
            </span>
          ))}
        </Fragment>
      ))}
    </Fragment>
  );

  /** A specialty and its feature set, opened from its name; the same on both layouts. */
  const specialtyToggle = (sp: (typeof SPECIALTIES)[number], extra = "") => {
    const open = openSpecialty === sp.id;
    return (
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpenSpecialty(open ? null : sp.id)}
        className={`flex items-center gap-[8px] text-left font-[500] text-[#281910] hover:bg-[rgba(20,12,4,0.03)] transition-colors duration-150 ${extra}`}
      >
        <Chevron open={open} />
        {sp.label}
      </button>
    );
  };

  /** Desktop: every tier side by side, price and a choose button up top, then each feature group, then the specialties. */
  const table = (
    <div className={`p-[6px] rounded-[30px] ${OUTER}`}>
    <div className={`grid ${cols} rounded-[24px] overflow-clip ${INNER}`}>
      <div ref={headRef} aria-hidden="true" />
      {PLANS.map((p) => {
        const special = dark(p.id);
        return (
          <div
            key={p.id}
            className={`flex flex-col items-center text-center gap-[16px] px-[12px] pt-[20px] pb-[22px] transition-colors duration-200 ${special ? "bg-[#281910] text-[#FFFCF1]" : lit(p.id) ? "bg-[rgba(244,232,210,0.7)] text-[#281910]" : "text-[#281910]"}`}
          >
            <span className="flex flex-col items-center gap-[4px] w-full">
              <span className="flex h-[22px] mb-[4px]">{badge(p.id)}</span>
              <span className={`text-[24px] leading-[28px] tracking-[-0.02em] whitespace-nowrap ${DISPLAY}`}>{p.name}</span>
              <span className={`text-[13px] leading-[17px] [text-wrap:balance] ${special ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{p.line}</span>
            </span>
            {/* Prices and buttons line up along the bottom, however the lines above wrap. */}
            <span className="mt-auto flex flex-col items-center gap-[14px] w-full">
              <span className="flex items-baseline gap-[3px] whitespace-nowrap">
                <span className={`text-[34px] leading-[36px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${special ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(p.id))}</span>
                <span className={`text-[13px] ${special ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
              </span>
              <span className="flex w-full max-w-[150px] h-[36px]">{tierAction(p.id)}</span>
            </span>
          </div>
        );
      })}
      {FEATURE_GROUPS.slice(0, -2).map((g) => groupRows(g.title, g.from, g.items))}

      <span className={`px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>Specialty features</span>
      {PLAN_ORDER.map((id) => (
        <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
      ))}
      {SPECIALTIES.map((sp) => (
        <Fragment key={sp.id}>
          {specialtyToggle(sp, "px-[20px] py-[8px] text-[14px] leading-[19px]")}
          {PLAN_ORDER.map((id) => (
            <span key={id} className={cell(id)}>
              <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
            </span>
          ))}
          {openSpecialty === sp.id &&
            SPECIALTY_FEATURES[sp.id].map((item) => (
              <Fragment key={item}>
                <span className={`pl-[40px] pr-[20px] py-[6px] text-[13px] leading-[18px] ${SUB}`}>{item}</span>
                {PLAN_ORDER.map((id) => (
                  <span key={id} className={cell(id)}>
                    <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
                  </span>
                ))}
              </Fragment>
            ))}
        </Fragment>
      ))}

      {FEATURE_GROUPS.slice(-2).map((g) => groupRows(g.title, g.from, g.items))}
      <span className="h-[16px]" />
      {PLAN_ORDER.map((id) => (
        <span key={id} className={cell(id)} />
      ))}
    </div>
    </div>
  );

  /** Desktop: the tier names and prices, lined up with the table's columns, under the pinned toolbar once its header scrolls away. */
  const strip = (
    <div className={`mt-[6px] p-[6px] rounded-[24px] ${PINNED}`}>
    <div className={`grid ${cols} rounded-[18px] overflow-clip ${INNER}`}>
      <span aria-hidden="true" />
      {PLANS.map((p) => (
        <span key={p.id} className={`flex flex-col items-center justify-center py-[8px] ${dark(p.id) ? "bg-[#281910] text-[#FFFCF1]" : lit(p.id) ? "bg-[rgba(244,232,210,0.7)] text-[#281910]" : "text-[#281910]"}`}>
          <span className={`text-[16px] leading-[20px] whitespace-nowrap ${DISPLAY}`}>{p.name}</span>
          <span className={`text-[13px] leading-[17px] [font-variant-numeric:tabular-nums] ${dark(p.id) ? "text-[#FCCFB8]" : SUB}`}>{money(priceOf(p.id))}/mo</span>
        </span>
      ))}
    </div>
    </div>
  );

  /** iPhone: the four tiers as a switcher, the one shown picked out in peach. */
  const shown = view ?? plan.id;
  const switcher = (
    <div role="tablist" aria-label="Plans" className={`grid grid-cols-4 gap-[4px] p-[4px] rounded-[22px] ${PINNED}`}>
      {PLANS.map((p) => {
        const on = shown === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setView(p.id)}
            className={`flex flex-col items-center gap-[1px] pt-[9px] pb-[8px] rounded-[18px] transition-colors duration-200 ${on ? SELECTED : `${INNER} text-[#281910]`}`}
          >
            <span className="flex items-center gap-[4px] text-[12px] leading-[16px] font-[600] whitespace-nowrap">
              {p.name}
            </span>
            <span className={`text-[18px] leading-[22px] tracking-[-0.02em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(priceOf(p.id))}</span>
          </button>
        );
      })}
    </div>
  );

  /** iPhone: the shown tier, then every feature with whether it has it, the ones it lacks faded. */
  const featureRow = (item: string, on: boolean, indent = false) => (
    <span key={item} className={`flex items-start justify-between gap-[14px] py-[7px] ${indent ? "pl-[20px]" : ""}`}>
      <span className={`text-[15px] leading-[20px] ${on ? "text-[rgba(20,12,4,0.74)]" : "text-[rgba(20,12,4,0.34)]"}`}>{item}</span>
      <span className="h-[20px] w-[16px] shrink-0 flex items-center justify-center">
        <Mark on={on} />
      </span>
    </span>
  );
  const featureGroup = (title: string, children: ReactNode) => (
    <div key={title} className={`flex flex-col px-[18px] pt-[16px] pb-[10px] border-t border-solid ${HAIR} first:border-t-0`}>
      <span className="pb-[4px] text-[16px] leading-[21px] font-[600] text-[#140C04]">{title}</span>
      {children}
    </div>
  );
  const shownPlan = planById(shown);
  const shownAction = tierAction(shown, true);
  const tierView = (
    <div className={`flex flex-col gap-[6px] p-[6px] rounded-[30px] ${OUTER}`}>
      <div key={shown} className={`doe-pricing-rise flex flex-col gap-[14px] p-[20px] rounded-[24px] ${dark(shown) ? "bg-[#281910] text-[#FFFCF1]" : `${INNER} text-[#281910]`}`}>
        <span className="flex items-start justify-between gap-[12px]">
          <span className="flex flex-col gap-[2px] min-w-[0px]">
            <span className={`text-[28px] leading-[32px] tracking-[-0.025em] ${DISPLAY}`}>{shownPlan.name}</span>
            <span className={`text-[14px] leading-[19px] ${dark(shown) ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{shownPlan.line}</span>
          </span>
          <span className="flex shrink-0">{badge(shown)}</span>
        </span>
        <span className="flex flex-col gap-[2px]">
          <span className="flex items-baseline gap-[4px]">
            <span className={`text-[40px] leading-[42px] tracking-[-0.04em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${dark(shown) ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(shown))}</span>
            <span className={`text-[14px] ${dark(shown) ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
          </span>
          <span className={`text-[13px] leading-[17px] ${dark(shown) ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>{sizeLine}</span>
          {a.annual && (
            <span className={`text-[13px] leading-[17px] font-[600] [font-variant-numeric:tabular-nums] ${dark(shown) ? "text-[#FCCFB8]" : "text-[#281910]"}`}>
              {money(yearly(priceOf(shown)))} billed yearly
            </span>
          )}
        </span>
        {shownAction && <span className="flex">{shownAction}</span>}
      </div>

      <div className={`flex flex-col rounded-[24px] py-[4px] ${INNER}`}>
        {FEATURE_GROUPS.slice(0, -2).map((g) => featureGroup(g.title, g.items.map((item) => featureRow(item, includes(shown, g.from)))))}
        {featureGroup(
          "Specialty features",
          SPECIALTIES.map((sp) => (
            <Fragment key={sp.id}>
              <span className="flex items-center justify-between gap-[14px]">
                {specialtyToggle(sp, `grow -ml-[8px] pl-[8px] py-[8px] rounded-[12px] text-[15px] leading-[20px] ${includes(shown, SPECIALTY_FROM) ? "" : "opacity-50"}`)}
                <span className="w-[16px] shrink-0 flex items-center justify-center">
                  <Mark on={includes(shown, SPECIALTY_FROM)} />
                </span>
              </span>
              {openSpecialty === sp.id && SPECIALTY_FEATURES[sp.id].map((item) => featureRow(item, includes(shown, SPECIALTY_FROM), true))}
            </Fragment>
          )),
        )}
        {FEATURE_GROUPS.slice(-2).map((g) => featureGroup(g.title, g.items.map((item) => featureRow(item, includes(shown, g.from)))))}
      </div>
    </div>
  );

  /** Monthly or yearly, with what yearly takes off. */
  const billing = (
    <div role="radiogroup" aria-label="Billing" className={`flex p-[4px] gap-[2px] rounded-[999px] ${OUTER} ${phone ? "w-full" : ""}`}>
      {(["monthly", "annual"] as const).map((b) => {
        const on = (b === "annual") === a.annual;
        return (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set({ annual: b === "annual" })}
            className={`flex items-center justify-center gap-[8px] h-[40px] px-[18px] rounded-[999px] text-[14px] leading-[18px] font-[600] whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${phone ? "grow basis-0" : ""} ${on ? "bg-white text-[#140C04]" : `${SUB} hover:text-[#281910]`}`}
          >
            {b === "annual" ? "Yearly" : "Monthly"}
            {b === "annual" && <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[600] text-[#140C04]">{YEARLY_OFF}% off</span>}
          </button>
        );
      })}
    </div>
  );

  /** Desktop: billing as its own white box in the toolbar, the chosen side picked out in peach. */
  const billingBox = (
    <div role="radiogroup" aria-label="Billing" className={`flex items-center gap-[4px] h-[48px] p-[4px] rounded-[18px] ${INNER}`}>
      {(["monthly", "annual"] as const).map((b) => {
        const on = (b === "annual") === a.annual;
        return (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set({ annual: b === "annual" })}
            className={`flex items-center justify-center gap-[8px] h-full px-[16px] rounded-[14px] text-[14px] leading-[18px] font-[600] whitespace-nowrap transition-colors duration-200 ${on ? SELECTED : `${SUB} hover:text-[#281910] hover:bg-[#FFFCF1]`}`}
          >
            {b === "annual" ? "Yearly" : "Monthly"}
            {b === "annual" && <span className={`h-[22px] px-[8px] flex items-center rounded-[999px] text-[12px] leading-[14px] font-[600] text-[#140C04] ${on ? "bg-white" : "bg-[#FBE7DA]"}`}>{YEARLY_OFF}% off</span>}
          </button>
        );
      })}
    </div>
  );

  const avatars = (
    <span className="flex items-center">
      {providers.slice(0, 4).map((p, i) => (
        <span key={p.id} className={`w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[9px] leading-[10px] font-[700] text-[#281910] border-[2px] border-solid border-white ${i ? "-ml-[7px]" : ""}`}>
          {initials(p.name, providers.indexOf(p) + 1)}
        </span>
      ))}
      {providerCount > 4 && <span className={`ml-[4px] text-[12px] leading-[16px] font-[600] ${SUB}`}>+{providerCount - 4}</span>}
    </span>
  );

  /** iPhone: the team's faces, opening the team sheet to edit providers, their specialties and plans; first on the comparison. */
  const teamButton = (
    <button
      type="button"
      onClick={() => setPanel("team")}
      className={`flex items-center gap-[10px] h-[52px] w-full pl-[12px] pr-[16px] rounded-[20px] ${OUTER} text-[15px] leading-[20px] font-[600] text-[#281910] transition-colors duration-150 whitespace-nowrap`}
    >
      {avatars}
      <span className="grow text-left">Edit providers and plans</span>
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );

  const counter = (label: string, control: ReactNode) => (
    <span className={`flex items-center justify-between gap-[14px] ${phone ? "py-[8px]" : "pl-[14px] pr-[6px]"}`}>
      <span className="text-[14px] leading-[18px] font-[600] text-[#281910] whitespace-nowrap">{label}</span>
      {control}
    </span>
  );
  const locationsControl = counter("Locations", <Count value={locationCount} max={30} onChange={setLocations} />);
  const providersControl = counter("Providers", <Count value={providerCount} min={locationCount} max={200} onChange={setProviderTotal} />);

  /** Desktop: one toolbar for the practice's size, the team and the price, pinned as the table scrolls. */
  /** Desktop: the team's faces and a pencil, opening the team panel to edit providers, their specialties and plans. */
  const editTeam = (
    <button
      type="button"
      onClick={() => setPanel("team")}
      className={`flex items-center gap-[10px] h-[48px] pl-[10px] pr-[16px] rounded-[18px] ${INNER} hover:bg-[#FFFCF1] text-[14px] leading-[18px] font-[600] text-[#281910] transition-colors duration-150 whitespace-nowrap`}
    >
      {avatars}
      Edit providers
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );

  /** Desktop: one toolbar, pinned as the table scrolls: the practice's size and its providers on the left, billing on the right. */
  const toolbar = (
    <div className={`flex items-center gap-[6px] p-[6px] rounded-[24px] ${pinned ? PINNED : OUTER}`}>
      <span className={`flex items-center h-[48px] rounded-[18px] ${INNER}`}>{locationsControl}</span>
      <span className={`flex items-center h-[48px] rounded-[18px] ${INNER}`}>{providersControl}</span>
      {/* The panel shows the team itself while it's open, which leaves room for billing. */}
      {!panel && editTeam}
      <span className="grow" />
      {billingBox}
    </div>
  );

  /** iPhone: the team first, then the practice's size and billing, above the switcher; they stay in place as the page scrolls. */
  const phoneControls = (
    <div className="flex flex-col gap-[8px]">
      {teamButton}
      <div className={`flex flex-col gap-[4px] p-[4px] rounded-[24px] ${OUTER}`}>
        <span className={`px-[14px] rounded-[20px] ${INNER}`}>{locationsControl}</span>
        <span className={`px-[14px] rounded-[20px] ${INNER}`}>{providersControl}</span>
      </div>
      {billing}
    </div>
  );

  /**
   * What follows the comparison down the page, pinned under the nav once it reaches it: the toolbar (and the strip of
   * tier names) on desktop, the tier switcher on iPhone.
   */
  const pinnedBar = (
    <div ref={barSlot} style={{ height: pinned?.height }}>
      {/* Once pinned, the page's cream fills in behind the bar so rows scroll out of sight under it. */}
      {pinned && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[29] pointer-events-none bg-[#FFFCF1]"
          style={{ height: pinned.cover }}
        />
      )}
      <div className={pinned ? "fixed z-30" : ""} style={pinned ? { top: pinTop, left: pinned.left, width: pinned.width } : undefined}>
        {phone ? switcher : toolbar}
        {!phone && pinned?.strip && strip}
      </div>
    </div>
  );

  const specialtyChoices: { id: Specialty; label: string }[] = [...SPECIALTIES.map((x) => ({ id: x.id as Specialty, label: x.label })), { id: "other", label: "Other" }];
  const planOptions = PAID.map((x) => ({ id: x.id, label: x.name }));

  /** A specialty dropdown; Other opens a field beside it to type the specialty in. */
  const specialtyField = (o: { label: string; value: Specialty | null; typed: string; typing: boolean; onPick: (v: Specialty) => void; onType: (v: string) => void; big?: boolean; bad?: boolean }) => (
    <span className="flex items-center gap-[6px] min-w-[0px] grow sm:grow-0">
      {/* Ringed in red until picked, once Continue has been tapped. */}
      <span className={`flex min-w-[0px] ${o.bad && !o.value ? BAD_RING : ""}`} data-pricing-warn={o.bad && !o.value ? "" : undefined}>
      <Pick<Specialty | "">
        big={o.big}
        label={o.label}
        value={o.value ?? ""}
        options={o.value ? specialtyChoices : [{ id: "", label: "Choose specialty" }, ...specialtyChoices]}
        onChange={(v) => v && o.onPick(v)}
      />
      </span>
      {o.typing && (
        <input
          value={o.typed}
          placeholder="Type specialty"
          aria-label={`${o.label}, typed`}
          aria-invalid={(o.bad && !o.typed.trim()) || undefined}
          data-pricing-warn={o.bad && !o.typed.trim() ? "" : undefined}
          onChange={(e) => o.onType(e.target.value)}
          className={`grow min-w-[0px] px-[14px] rounded-[999px] bg-[#F4EEDF] outline-none ${FOCUS} ${o.bad && !o.typed.trim() ? BAD : ""} text-[#140C04] placeholder:text-[rgba(20,12,4,0.38)] ${o.big ? "h-[44px] w-[180px] text-[15px]" : "h-[34px] w-[140px] text-[13px]"}`}
        />
      )}
    </span>
  );

  /**
   * The team, location by location: rename a location, set how many providers it has, name each provider and give them
   * a specialty, and add or remove locations and providers; anything added grows into place. On the comparison each
   * provider also gets a plan.
   */
  /** Marks a provider as the buyer: "That's me" on everyone until someone is picked, then "Me" on them alone. */
  const meToggle = (p: Provider, bad = false) => {
    if (a.onBehalf) return null;
    const isMe = a.me === p.id && !!meProvider;
    if (meProvider && !isMe) return null;
    return (
      <button
        type="button"
        aria-pressed={isMe}
        aria-label={isMe ? "Me, tap to remove" : undefined}
        data-pricing-warn={bad ? "" : undefined}
        onClick={() => set({ me: isMe ? null : p.id })}
        className={`h-[30px] px-[12px] shrink-0 flex items-center gap-[6px] rounded-[999px] text-[13px] leading-[16px] font-[600] whitespace-nowrap transition-colors duration-150 ${isMe ? `${SELECTED} pr-[9px]` : `bg-[#F4EEDF] ${SUB} hover:text-[#281910]`} ${bad ? BAD : ""}`}
      >
        {isMe && (
          <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isMe ? "Me" : "That's me"}
        {/* An X on "Me", so it reads as removable. */}
        {isMe && (
          <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" className="ml-[2px] opacity-70" style={{ display: "block" }}>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </button>
    );
  };

  const teamEditor = (withPlans: boolean) => {
    const warnTeam = tried === "team" && !withPlans;
    // Who's buying isn't set: the switch and each "That's me" are ringed.
    const needBuyer = warnTeam && !a.onBehalf && !meProvider;
    const surface = OUTER;
    const row = INNER;
    return (
      <div className="flex flex-col gap-[10px]">
        {/* Who's buying: one of the providers (marked "Me" below), or someone buying for the practice. */}
        <div className={`p-[6px] rounded-[24px] ${surface}`}>
          <button
            type="button"
            role="switch"
            aria-checked={a.onBehalf}
            aria-invalid={needBuyer || undefined}
            data-pricing-warn={needBuyer ? "" : undefined}
            onClick={() => set({ onBehalf: !a.onBehalf, me: a.onBehalf ? a.me : null })}
            className={`w-full flex items-center justify-between gap-[14px] p-[12px] pl-[16px] rounded-[18px] text-left ${row} ${needBuyer ? BAD : ""}`}
          >
            <span className="flex flex-col min-w-[0px]">
              <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">Purchasing on Behalf of Providers</span>
            </span>
            <span className={`relative w-[44px] h-[26px] shrink-0 rounded-[999px] transition-colors duration-200 ${a.onBehalf ? "bg-[#E2A988]" : "bg-[#E6DCC8]"}`} aria-hidden="true">
              <span className={`absolute top-[3px] w-[20px] h-[20px] rounded-[999px] bg-white transition-[left] duration-200 ${a.onBehalf ? "left-[21px]" : "left-[3px]"}`} />
            </span>
          </button>
        </div>
        {a.team.map((site, si) => (
          <div key={site.id} className={fresh(site.id) ? "doe-pricing-grow" : ""}>
          {/* The grow animates this padding-free box, so the location opens from nothing. */}
          <div>
          <div className={`flex flex-col gap-[6px] p-[8px] rounded-[22px] ${surface}`}>
            <span className="flex items-center gap-[8px] pl-[10px]">
              <NameField
                value={site.name}
                placeholder={`Clinic ${si + 1}`}
                label={`Location ${si + 1} name`}
                onChange={(v) => editSite(site.id, { name: v })}
                text={`text-[19px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}
                large
              />
              <span className="grow" />
              <Count value={site.providers.length} max={100} onChange={(v) => setTeam(a.team.map((x) => (x.id === site.id ? resize(x, v) : x)))} />
              {a.team.length > 1 && <Close label={`Remove ${siteName(site)}`} onClick={() => setTeam(a.team.filter((x) => x.id !== site.id))} />}
            </span>
            {site.providers.map((p) => {
              const n = providers.indexOf(p) + 1;
              return (
                <div key={p.id} className={fresh(p.id) ? "doe-pricing-grow" : ""}>
                <div>
                <div className={`flex flex-col gap-[8px] p-[10px] rounded-[18px] ${row} ${withPlans || phone ? "" : "sm:flex-row sm:items-center"}`}>
                  <span className="flex items-center gap-[10px] grow min-w-[0px]">
                    <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                    <NameField
                      value={p.name}
                      placeholder={`Provider ${n}`}
                      label={`Provider ${n} name`}
                      onChange={(v) => editProvider(p.id, { name: v })}
                      text={`${phone ? "text-[16px] leading-[21px]" : "text-[15px] leading-[20px]"} font-[500] text-[#140C04]`}
                    />
                    <span className="grow" />
                    {meToggle(p, needBuyer)}
                    {(withPlans || phone) && site.providers.length > 1 && (
                      <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? { ...x, providers: x.providers.filter((y) => y.id !== p.id) } : x)))} />
                    )}
                  </span>
                  <span className={`flex items-center gap-[6px] flex-wrap ${withPlans || phone ? "pl-[42px]" : ""}`}>
                    {specialtyField({
                      label: `${providerName(p)} specialty`,
                      value: specialtyOf(p),
                      typed: p.other,
                      typing: p.specialty === "other",
                      bad: warnTeam && specialtyGap(p),
                      // The first specialty picked also fills in everyone still without one.
                      onPick: (v) =>
                        set({ team: a.team.map((x) => ({ ...x, providers: x.providers.map((y) => (y.id === p.id || (!y.specialty && v !== "other") ? { ...y, specialty: v } : y)) })) }),
                      onType: (v) => editProvider(p.id, { other: v }),
                    })}
                    {withPlans && <Pick dark label={`${providerName(p)} plan`} value={planOf(p).id} options={planOptions} onChange={(v) => editProvider(p.id, { plan: v === plan.id ? null : v })} />}
                  </span>

                  {!withPlans && !phone && site.providers.length > 1 && (
                    <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? { ...x, providers: x.providers.filter((y) => y.id !== p.id) } : x)))} />
                  )}
                </div>
                </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? resize(x, x.providers.length + 1) : x)))}
              className="self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[600] text-[#281910] hover:bg-white transition-colors duration-150"
            >
              <span className="text-[17px] leading-[17px]">+</span>
              Add provider
            </button>
          </div>
          </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTeam([...a.team, newSite(`Clinic ${a.team.length + 1}`, 1, providers[0])])}
          className={`flex items-center justify-center gap-[8px] h-[52px] rounded-[22px] ${OUTER} hover:bg-[#EDE5D2] text-[15px] leading-[20px] font-[600] text-[#281910] transition-colors duration-150`}
        >
          <span className="text-[18px] leading-[18px]">+</span>
          Add location
        </button>
      </div>
    );
  };

  /** What more providers or locations take off: the discount now, a bar per step, and how many more reach the next. */
  const discountHint = (title: string, brackets: Bracket[], n: number, unit: string) => {
    const reached = brackets.indexOf(bracketFor(brackets, n));
    const now = brackets[reached]!;
    const next = brackets[reached + 1];
    const pct = (b: Bracket) => `${Math.round(b.off * 100)}%`;
    const more = next ? next.min - n : 0;
    return (
      <div key={title} className="flex flex-col gap-[10px] min-w-[0px]">
        <span className="flex items-baseline justify-between gap-[12px]">
          <span className="text-[14px] leading-[18px] font-[600] text-[#140C04]">{title}</span>
          <span className={`text-[14px] leading-[18px] font-[600] [font-variant-numeric:tabular-nums] transition-colors duration-300 ${now.off ? "text-[#140C04]" : SUB}`}>
            {now.off ? `${pct(now)} off` : "0%"}
          </span>
        </span>
        <span className="grid grid-cols-3 gap-[4px]" aria-hidden="true">
          {brackets.slice(1).map((b, i) => (
            <span key={b.min} className={`h-[4px] rounded-[99px] transition-colors duration-300 ${i < reached ? "bg-[#281910]" : "bg-[#F4EEDF]"}`} />
          ))}
        </span>
        <span className={`text-[13px] leading-[17px] ${SUB}`}>
          {next ? `${plural(more, `more ${unit}`, `more ${unit}s`)} ${more === 1 ? "unlocks" : "unlock"} ${pct(next)} off` : "Highest discount reached"}
        </span>
      </div>
    );
  };
  const discountHints = (
    <div className={`p-[6px] rounded-[26px] ${OUTER}`}>
      <div className={`grid p-[18px] rounded-[20px] ${INNER} ${phone ? "grid-cols-1 gap-[18px]" : "grid-cols-2 gap-[40px] px-[22px]"}`}>
        {discountHint("Multi-provider Discount", PROVIDER_BRACKETS, providerCount, "provider")}
        {discountHint("Multi-clinic Discount", LOCATION_BRACKETS, locationCount, "location")}
      </div>
    </div>
  );

  const planLabel = mixed ? "Mixed plans" : plan.name;
  /** Under the comparison: the prices above are before tax. */
  const taxCaption = <span className={`px-[12px] text-center text-[13px] leading-[18px] ${SUB}`}>Prices shown before tax. {TAX_NOTE}, from your card&apos;s ZIP.</span>;

  const subtotal = priced.total;
  const yearlyOff = a.annual ? subtotal * (1 - ANNUAL_FACTOR) : 0;
  const saved = priced.providerDiscount + priced.locationDiscount + yearlyOff;

  /**
   * Each location's providers on each tier, for the price tab. The top tier's base covers its first provider and
   * location, so the first line on that tier carries the base in place of one provider; any other location's fee rides
   * on its first line, so the breakdown shows only tiers and providers.
   */
  const baseRow = priced.rowGross.find((g) => g.row.plan.id === priced.top.id)?.row.id;
  const baseLocation = priced.rowGross.find((g) => g.row.location && g.row.plan.id === priced.top.id)?.row.id;
  const lineGroups = a.team.map((site) => ({
    site,
    rows: priced.rowGross
      .filter((g) => g.row.id.startsWith(`${site.id}-`))
      .map((g) => ({
        row: g.row,
        amount: g.providers + (g.row.id === baseRow ? priced.top.base - priced.top.perProvider : 0) + (g.row.id === baseLocation ? 0 : g.location),
      })),
  }));
  /** The price by tier for the checkout receipt: each tier's providers across locations, and where they are. */
  const tierLines = PAID.map((t) => {
    const rows = lineGroups.flatMap(({ site, rows }) => rows.filter((g) => g.row.plan.id === t.id).map((g) => ({ ...g, site })));
    return {
      tier: t,
      providers: rows.reduce((n, g) => n + g.row.providers, 0),
      amount: rows.reduce((n, g) => n + g.amount, 0),
      sites: rows.map((g) => siteName(g.site)),
    };
  }).filter((x) => x.providers > 0);
  const discountLines = [
    ...(priced.providerDiscount ? [["Multi-provider Discount", priced.providerDiscount] as const] : []),
    ...(priced.locationDiscount ? [["Multi-clinic Discount", priced.locationDiscount] as const] : []),
    ...(yearlyOff ? [[`Yearly Discount, ${YEARLY_OFF}% off`, yearlyOff] as const] : []),
  ];

  /** A checkout box: a beige box with a numbered title, its content in white inside. */
  const section = (n: number, title: string, children: ReactNode, aside?: ReactNode) => (
    <section className={`flex flex-col gap-[6px] p-[6px] rounded-[28px] ${OUTER}`}>
      <span className="flex items-center justify-between gap-[12px] px-[12px] pt-[8px] pb-[4px]">
        <span className="flex items-center gap-[10px]">
          <span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-white text-[12px] leading-[14px] font-[700] text-[#281910]">{n}</span>
          <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">{title}</span>
        </span>
        {aside}
      </span>
      {children}
    </section>
  );
  const line = (label: string, value: ReactNode, strong = false) => (
    <span key={label} className={`flex items-baseline justify-between gap-[16px] py-[10px] border-t border-solid ${HAIR} first:border-t-0`}>
      <span className={`text-[14px] leading-[19px] ${SUB}`}>{label}</span>
      <span className={`text-right text-[15px] leading-[20px] ${strong ? "font-[600] text-[#140C04]" : "text-[#281910]"} [font-variant-numeric:tabular-nums]`}>{value}</span>
    </span>
  );
  const tierCounts = PAID.filter((x) => onTier(x.id) > 0).map((x) => `${x.name} × ${onTier(x.id)}`).join(", ");
  const buyerLine = a.onBehalf ? "You, on behalf of the practice" : meProvider ? `You, ${providerName(meProvider)}` : null;
  const editLink = (
    <button type="button" onClick={() => setAt(1)} className="h-[30px] px-[12px] rounded-[999px] text-[13px] leading-[16px] font-[600] text-[#281910] hover:bg-white transition-colors duration-150">
      Edit
    </button>
  );
  /** What the buyer pays up front each way: everything, or their own share (nothing if they aren't a provider). */
  const upfront = (perMonth: number) => `${money(Math.round(perMonth) * (a.annual ? 12 : 1))}${a.annual ? "/yr" : "/mo"}`;
  const payIcon = (mode: Answers["payMode"]) => (
    <svg width="26" height="22" viewBox="0 0 30 24" aria-hidden="true" style={{ display: "block" }}>
      {mode === "one" ? (
        <>
          <rect x="2" y="4" width="26" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M2 9.5h26M7 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="1.5" y="9" width="15" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M1.5 10l7.5 5 7.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="13.5" y="3" width="15" height="11" rx="2.5" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 4l7.5 5 7.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
  /**
   * One way to pay, as a tile: an icon in its well, the name, what the buyer pays up front, and a check once picked.
   * Picked, Individual payments also says each provider's payment link and Doe invite go to the same email.
   */
  const payOption = (mode: Answers["payMode"], title: string, figure: string) => {
    const on = a.payMode === mode;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => set({ payMode: mode })}
        className={`relative flex flex-col items-start gap-[14px] p-[16px] rounded-[20px] text-left transition-colors duration-200 ${on ? INNER : "bg-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.8)]"}`}
      >
        <span className="w-full flex items-start justify-between gap-[12px]">
          <span className={`w-[48px] h-[48px] flex items-center justify-center rounded-[15px] transition-colors duration-200 ${on ? "bg-[#FBE7DA] text-[#A0522D]" : "bg-[#F4EEDF] text-[#8A6A3F]"}`}>{payIcon(mode)}</span>
          <span
            aria-hidden="true"
            className={`w-[24px] h-[24px] flex items-center justify-center rounded-[999px] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "shadow-[inset_0_0_0_1.5px_rgba(20,12,4,0.16)] text-transparent"}`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" style={{ display: "block" }}>
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        <span className="flex flex-col gap-[3px]">
          <span className={`text-[20px] leading-[24px] tracking-[-0.015em] ${DISPLAY} text-[#281910]`}>{title}</span>
          <span className={`text-[14px] leading-[19px] ${SUB} [font-variant-numeric:tabular-nums]`}>{figure}</span>
        </span>
        {mode === "split" && on && (
          <span className="doe-pricing-rise w-full flex items-start gap-[8px] px-[12px] py-[10px] rounded-[14px] bg-[#FBE7DA] text-[13px] leading-[18px] font-[500] text-[#7A3E1F]">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0, marginTop: 2 }}>
              <path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Each provider&apos;s payment link and their invite to Doe go to the email you add for them.
          </span>
        )}
      </button>
    );
  };
  /** A small beige chip of detail, used in the summary. */
  const chip = (text: string) => (
    <span key={text} className={`h-[28px] px-[11px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[13px] leading-[16px] font-[500] text-[#281910] whitespace-nowrap`}>
      {text}
    </span>
  );
  /** One card field in the grouped card block: a quiet label over the input, hairlines between them. */
  /** A card field like the others on the page: a quiet label above a beige field, with an optional mark inside it. */
  /** Which card details are not yet in the shape they're typed. */
  const cardBad: Record<keyof Answers["card"], boolean> = {
    number: !/^\d{13,19}$/.test(a.card.number.replace(/\s/g, "")),
    expiry: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(a.card.expiry),
    cvc: !/^\d{3,4}$/.test(a.card.cvc),
    zip: a.card.zip.trim().length < 3,
  };
  const warnCheckout = tried === "checkout";
  /** Card details are ringed in red once Continue is tapped with the card incomplete. */
  const cardWarn = warnCheckout && dueToday > 0;
  const cardField = (label: string, key: keyof Answers["card"], placeholder: string, format: (v: string) => string, autoComplete: string, mark?: ReactNode) => (
    <label className="flex flex-col gap-[6px] min-w-[0px]">
      <span className={`px-[4px] text-[13px] leading-[17px] font-[500] ${SUB}`}>{label}</span>
      <span className="relative flex items-center">
        <input
          value={a.card[key]}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete={autoComplete}
          aria-invalid={(cardWarn && cardBad[key]) || undefined}
          data-pricing-warn={cardWarn && cardBad[key] ? "" : undefined}
          onChange={(e) => set({ card: { ...a.card, [key]: format(e.target.value) } })}
          className={`w-full min-w-[0px] h-[52px] px-[16px] ${mark ? "pr-[56px]" : ""} rounded-[14px] bg-[#F4EEDF] outline-none ${FOCUS} ${cardWarn && cardBad[key] ? BAD : ""} text-[16px] leading-[21px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.35)] [font-variant-numeric:tabular-nums] transition-[background-color,box-shadow] duration-150`}
        />
        {mark && <span className="pointer-events-none absolute right-[16px]">{mark}</span>}
      </span>
    </label>
  );
  /** Providers by location, as in the team editor, so it's clear whose email goes where; each with their plan and specialty. */
  const recipientList = (
    <div key={a.payMode} className="doe-pricing-rise flex flex-col gap-[6px]">
      {a.payMode === "one" && <span className={`px-[12px] pt-[4px] text-[13px] leading-[18px] ${SUB}`}>You&apos;re paying for everyone. Each provider gets an invite to Doe.</span>}
      {a.team.map((site, si) => (
        <div key={site.id} className={`flex flex-col rounded-[22px] ${INNER}`}>
          <span className={`flex items-baseline justify-between gap-[12px] px-[18px] pt-[14px] pb-[4px]`}>
            <span className={`text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}>{siteName(site)}</span>
            <span className={`text-[13px] leading-[17px] ${SUB}`}>{plural(site.providers.length, "provider")}</span>
          </span>
          {site.providers.map((p) => {
            const mine = p.id === meProvider?.id;
            const n = providers.indexOf(p) + 1;
            const sp = specialtyOf(p);
            return (
              <div key={p.id} className={`flex flex-col gap-[10px] px-[18px] py-[14px] border-t border-solid ${HAIR} first-of-type:border-t-0`}>
                <span className="flex items-start gap-[10px]">
                  <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                  <span className="flex flex-col gap-[4px] grow min-w-[0px] pt-[6px]">
                    <span className="truncate text-[15px] leading-[20px] font-[600] text-[#140C04]">{providerName(p)}</span>
                    <span className="flex flex-wrap gap-[4px]">
                      <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[500] text-[#281910]">{planOf(p).name}</span>
                      {sp && <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[500] text-[#281910]">{specialtyName(sp, p.other)}</span>}
                      {mine && <span className={`h-[22px] px-[8px] flex items-center rounded-[999px] text-[12px] leading-[14px] font-[600] ${SELECTED}`}>You, pay below</span>}
                    </span>
                  </span>
                  {a.payMode === "split" && <span className="shrink-0 pt-[6px] text-[15px] leading-[20px] font-[600] text-[#281910] [font-variant-numeric:tabular-nums]">{money(shareOf(p))}<span className={`font-[400] text-[13px] ${SUB}`}>/mo</span></span>}
                </span>
                {!mine && (
                  <input
                    type="email"
                    inputMode="email"
                    value={a.emails[p.id] ?? ""}
                    placeholder={a.payMode === "split" ? "Email for their payment link and invite" : "Email for their invite"}
                    aria-label={`${providerName(p)} email`}
                    onChange={(e) => set({ emails: { ...a.emails, [p.id]: e.target.value } })}
                    className={`h-[48px] px-[16px] rounded-[14px] bg-[#F4EEDF] outline-none ${FOCUS} text-[16px] leading-[21px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.4)] transition-[background-color,box-shadow] duration-150`}
                  />
                )}
              </div>
            );
          })}
          {/* What goes out on finishing, at the foot of the last location's box. */}
          {sendNote && si === a.team.length - 1 && (
            <span className={`flex items-center gap-[8px] px-[18px] py-[14px] border-t border-solid ${HAIR} text-[13px] leading-[18px] text-[#7A3E1F]`}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
                <path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              {sendNote}
            </span>
          )}
        </div>
      ))}
    </div>
  );
  /** Each paid tier's colour in the summary: sand for Basic, peach for Advanced, Doe One's brown. */
  const tone = (id: PlanId) => (id === "one" ? "#281910" : id === "advanced" ? "#F2B596" : "#E3D3B3");
  /**
   * The summary as a ticket: the practice on top, each tier's share of the month as one bar with a legend under it,
   * the discounts as chips, then a torn edge and the bill on the stub.
   */
  const summary = (
    <div className={`flex flex-col rounded-[22px] overflow-hidden ${INNER}`}>
      <div className="flex items-start justify-between gap-[12px] px-[20px] pt-[18px] pb-[16px]">
        <span className="flex flex-col gap-[3px] min-w-[0px]">
          <span className={`truncate text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-[#281910]`}>
            {a.contact.practice.trim() || PRACTICE_SHAPES.find((x) => x.id === a.shape)?.title}
          </span>
          <span className={`text-[13px] leading-[17px] ${SUB}`}>{sizeLine}</span>
        </span>
        {buyerLine && (
          <span className="shrink-0 h-[26px] px-[10px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[600] text-[#281910] whitespace-nowrap">
            {a.onBehalf ? "On behalf of providers" : buyerLine}
          </span>
        )}
      </div>
      <div className="px-[20px]">
        <span className="flex gap-[3px] h-[10px]" aria-hidden="true">
          {tierLines.map((t) => (
            <span key={t.tier.id} className="basis-0 min-w-[10px] rounded-[99px] transition-[flex-grow] duration-300" style={{ flexGrow: t.amount || 1, background: tone(t.tier.id) }} />
          ))}
        </span>
      </div>
      <div className="flex flex-col px-[20px] pt-[8px] pb-[10px]">
        {tierLines.map((t) => (
          <span key={t.tier.id} className="flex items-center gap-[12px] py-[9px]">
            <span className="w-[10px] h-[10px] shrink-0 rounded-[3px]" style={{ background: tone(t.tier.id) }} aria-hidden="true" />
            <span className="flex flex-col grow min-w-[0px]">
              <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">{t.tier.name}</span>
              <span className={`truncate text-[13px] leading-[17px] ${SUB}`}>
                {plural(t.providers, "provider")}
                {locationCount > 1 ? ` at ${Array.from(new Set(t.sites)).join(", ")}` : ""}
              </span>
            </span>
            <span className="shrink-0 text-[15px] leading-[20px] text-[#281910] [font-variant-numeric:tabular-nums]">
              {money(t.amount)}
              <span className={`text-[13px] ${SUB}`}>/mo</span>
            </span>
          </span>
        ))}
        {discountLines.length > 0 && (
          <span className="flex flex-wrap gap-[6px] pt-[6px]">
            {discountLines.map(([label, value]) => (
              <span key={label} className="h-[28px] px-[11px] flex items-center gap-[6px] rounded-[999px] bg-[#FBE7DA] text-[13px] leading-[16px] font-[500] text-[#7A3E1F] whitespace-nowrap [font-variant-numeric:tabular-nums]">
                {label}
                <span className="font-[600]">−{money(value)}</span>
              </span>
            ))}
          </span>
        )}
      </div>
      {/* Taxes: to be calculated at payment, from the card's ZIP; then the region, rate and amount. */}
      <div className={`flex items-center gap-[12px] mx-[20px] py-[12px] border-t border-solid ${HAIR}`}>
        <span className="flex flex-col grow min-w-[0px]">
          <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">Taxes</span>
          <span className={`text-[13px] leading-[17px] ${SUB}`}>{tax ? taxLabel : "From your card's billing ZIP"}</span>
        </span>
        <span className={`shrink-0 text-[15px] leading-[20px] [font-variant-numeric:tabular-nums] ${tax ? "text-[#281910]" : SUB}`}>{tax ? cents(billedTax) : "Calculated at payment"}</span>
      </div>
      {/* The torn edge: a notch each side, cut in the beige box's colour, and a dashed line between them. */}
      <div className="relative h-[22px]" aria-hidden="true">
        <span className="absolute top-0 -left-[11px] w-[22px] h-[22px] rounded-[999px] bg-[#F4EEDF]" />
        <span className="absolute top-0 -right-[11px] w-[22px] h-[22px] rounded-[999px] bg-[#F4EEDF]" />
        <span className="absolute left-[20px] right-[20px] top-[10px] border-t-[1.5px] border-dashed border-[rgba(20,12,4,0.16)]" />
      </div>
      <div className="flex items-end justify-between gap-[16px] px-[20px] pt-[8px] pb-[20px]">
        <span className="flex flex-col gap-[2px]">
          <span className="text-[14px] leading-[18px] font-[600] text-[#140C04]">{a.annual ? "Billed yearly" : "Billed monthly"}</span>
          <span className={`text-[13px] leading-[17px] ${SUB} [font-variant-numeric:tabular-nums]`}>{a.annual ? `${money(total)}/mo × 12 months` : "Charged each month"}, {tax ? "with tax" : "plus tax"}</span>
        </span>
        <span className="flex items-baseline gap-[3px]">
          <span className={`text-[36px] leading-[38px] tracking-[-0.035em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{tax ? cents(billed + billedTax) : money(billed)}</span>
          <span className={`text-[13px] ${SUB}`}>{a.annual ? "/yr" : "/mo"}</span>
        </span>
      </div>
    </div>
  );
  /** Checkout is ready once the buyer, every email asked for and (when anything is due today) the card are in. */
  const checkoutReady =
    !!(a.contact.name.trim() && isEmail(a.contact.email) && a.contact.practice.trim()) &&
    emailRecipients.every((p) => isEmail(a.emails[p.id] ?? "")) &&
    (dueToday === 0 || cardOk(a.card));
  const checkout = (
    <div className="flex flex-col gap-[14px]">
      {section(
        1,
        "Summary",
        <div ref={summaryRef}>{summary}</div>,
        editLink,
      )}
      {section(
        2,
        "Your information",
        <div className={`grid gap-[12px] p-[14px] rounded-[22px] ${INNER} ${phone ? "grid-cols-1" : "grid-cols-2"} [&_input]:bg-[#F4EEDF]`}>
          <TextField label="Your name" value={a.contact.name} onChange={(v) => set({ contact: { ...a.contact, name: v } })} placeholder="Jane Smith" autoComplete="name" bad={warnCheckout && !a.contact.name.trim()} />
          <TextField label="Practice name" value={a.contact.practice} onChange={(v) => set({ contact: { ...a.contact, practice: v } })} placeholder="Northside Family Medicine" autoComplete="organization" bad={warnCheckout && !a.contact.practice.trim()} />
          <div className={phone ? "" : "col-span-2"}>
            <TextField label="Work email, where your access link goes" type="email" inputMode="email" value={a.contact.email} onChange={(v) => set({ contact: { ...a.contact, email: v } })} placeholder="jane@yourclinic.com" autoComplete="email" bad={warnCheckout && !isEmail(a.contact.email)} />
          </div>
        </div>,
      )}
      {section(
        3,
        "How you'll pay",
        <div className="flex flex-col gap-[6px]">
          <div role="radiogroup" aria-label="How you'll pay" className={`grid items-start gap-[6px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
            {payOption("one", "Pay as one", `You pay ${upfront(total)} for everyone`)}
            {payOption("split", "Individual payments", meProvider ? `You pay your share, ${upfront(shareOf(meProvider))}` : "Each provider pays their own share")}
          </div>
          {(a.payMode === "split" || inviteRecipients.length > 0) && recipientList}
        </div>,
      )}
      {section(
        4,
        "Payment",
        <div className={`flex flex-col gap-[16px] p-[18px] rounded-[22px] ${INNER}`}>
          <span className="flex items-end justify-between gap-[12px]">
            <span className="flex flex-col gap-[2px]">
              <span className={`text-[13px] leading-[17px] font-[500] ${SUB}`}>{tax ? "Due today, with tax" : "Due today"}</span>
              <span className={`text-[13px] leading-[17px] ${SUB}`}>
                {dueToday === 0
                  ? "Each provider pays from their link"
                  : `${a.annual ? "One year" : "One month"}${a.payMode === "split" ? ", your share" : `, ${plural(providerCount, "provider")}`}`}
              </span>
            </span>
            <span className={`text-[36px] leading-[38px] tracking-[-0.035em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{tax ? cents(dueToday + taxDue) : money(dueToday)}</span>
          </span>
          {/* Subtotal and tax, the tax filled in once the card's ZIP is in. */}
          {dueToday > 0 && (
            <span className="flex flex-col px-[16px] py-[2px] rounded-[16px] bg-[#FAF6EC]">
              {line("Subtotal", cents(dueToday))}
              {line(tax ? `Taxes, ${tax.state} ${+(tax.rate * 100).toFixed(3)}%` : "Taxes", tax ? cents(taxDue) : <span className={SUB}>Calculated from your ZIP</span>)}
            </span>
          )}
          {dueToday > 0 ? (
            <div className="grid grid-cols-3 gap-[10px]">
              <div className="col-span-3">
                {cardField(
                  "Card number",
                  "number",
                  "1234 1234 1234 1234",
                  groupCard,
                  "cc-number",
                  <svg width="26" height="18" viewBox="0 0 30 22" aria-hidden="true" style={{ display: "block" }}>
                    <rect x="0.75" y="0.75" width="28.5" height="20.5" rx="4" fill="none" stroke="#C9B48F" strokeWidth="1.5" />
                    <path d="M1 7h28" stroke="#C9B48F" strokeWidth="2.5" />
                  </svg>,
                )}
              </div>
              {cardField("Expiry", "expiry", "MM/YY", groupExpiry, "cc-exp")}
              {cardField("CVC", "cvc", "123", (v) => v.replace(/\D/g, "").slice(0, 4), "cc-csc")}
              {cardField("Billing ZIP", "zip", "94107", (v) => v.slice(0, 10), "postal-code")}
            </div>
          ) : null}
        </div>,
      )}
      {/* The very end: the tax, once the ZIP has set it, and Finish. Until everything is in, Finish rings what's missing. */}
      <div className="flex flex-col gap-[10px] pt-[4px]">
        {tax && dueToday > 0 && (
          <span className={`flex items-baseline justify-between gap-[12px] px-[8px] text-[13px] leading-[18px] ${SUB} [font-variant-numeric:tabular-nums]`}>
            <span>Taxes calculated, {taxLabel}</span>
            <span className="font-[600] text-[#281910]">{cents(taxDue)}</span>
          </span>
        )}
        <button
          type="button"
          aria-disabled={!checkoutReady || undefined}
          onClick={() => (checkoutReady ? setDone(true) : flag("checkout"))}
          className={`flex items-center justify-between gap-[12px] h-[60px] pl-[24px] pr-[20px] rounded-[999px] text-[16px] leading-[20px] font-[600] transition-colors duration-200 ${checkoutReady ? "bg-[#281910] hover:bg-[#3A2920] text-[#FFFCF1]" : "bg-[rgba(20,12,4,0.1)] text-[rgba(20,12,4,0.38)]"}`}
        >
          <span>Finish</span>
          <span className="flex items-center gap-[10px] [font-variant-numeric:tabular-nums]">
            {dueToday > 0 && <span className="font-[500] opacity-80">{tax ? cents(dueToday + taxDue) : money(dueToday)}</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
              <path d="M5 12h14m-6-6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );

  const questions: Question[] = [
    {
      id: "shape",
      step: "Practice",
      title: ["How is your", "practice set up?"],
      ready: !!a.shape,
      body: (
        <div className={`grid gap-[6px] p-[6px] rounded-[32px] ${OUTER} ${phone ? "grid-cols-1" : "grid-cols-3 min-h-[400px]"}`}>
          {PRACTICE_SHAPES.map((s) => {
            const on = a.shape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => pickShape(s.id)}
                className={`flex ${phone ? "flex-row items-center gap-[18px] p-[16px] min-h-[132px]" : "flex-col items-stretch justify-between gap-[28px] p-[22px] pb-[28px]"} rounded-[26px] text-left transition-colors duration-200 ${on ? SELECTED : `${INNER} text-[#281910] [@media(hover:hover)]:hover:bg-[#FFFCF1]`}`}
              >
                <span className={`shrink-0 flex items-center justify-center rounded-[18px] ${phone ? "w-[108px] h-[100px]" : "w-full grow min-h-[200px]"} ${on ? "bg-[rgba(255,255,255,0.6)]" : "bg-[#F4EEDF]"}`}>
                  <ShapeMark shape={s.id} on={on} scale={phone ? 1 : 1.6} />
                </span>
                <span className="flex flex-col items-start gap-[4px]">
                  <span className={`[text-wrap:balance] tracking-[-0.02em] ${phone ? "text-[21px] leading-[25px]" : "text-[24px] leading-[28px]"} ${DISPLAY}`}>{s.title}</span>
                  {s.note && <span className={`text-[15px] leading-[20px] ${SUB}`}>{s.note}</span>}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "team",
      step: "Team",
      title: ["Who’s on", "your team?"],
      ready: specialtiesSet && (a.onBehalf || !!meProvider),
      body: (
        <div className="flex flex-col gap-[14px]">
          {discountHints}
          {teamEditor(false)}
        </div>
      ),
    },
    {
      id: "plan",
      step: "Plan",
      title: ["Compare"],
      wide: true,
      ready: !!a.plan,
      body: phone ? (
        <div className="flex flex-col gap-[10px]">
          {phoneControls}
          {pinnedBar}
          {tierView}
          {taxCaption}
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {pinnedBar}
          {table}
          {taxCaption}
        </div>
      ),
    },
    {
      id: "checkout",
      step: "Checkout",
      title: ["Review and", "check out"],
      ready: checkoutReady,
      body: checkout,
    },
  ];

  const index = Math.min(at, questions.length - 1);
  const q = questions[index]!;
  const last = index === questions.length - 1;
  const onPlan = !done && q.id === "plan";
  const wide = !done && q.wide;

  // A step's warnings clear when you move to another.
  useEffect(() => setTried(null), [q.id]);

  const forward = () => {
    if (!q.ready) return;
    if (last) setDone(true);
    else setAt(index + 1);
  };

  /** Locations and providers added on the comparison since it was reached (or since they were last confirmed). */
  const isAdded = (id: string) => planEntry > 0 && Number(id.slice(1)) > planEntry;
  const addedSites = a.team.filter((s) => isAdded(s.id));
  const addedProviders = providers.filter((p) => isAdded(p.id));
  const additions = onPlan && addedSites.length + addedProviders.length > 0;
  const addedLine = `${[addedSites.length ? plural(addedSites.length, "location") : "", addedProviders.length ? plural(addedProviders.length, "provider") : ""].filter(Boolean).join(" and ")} added`;
  /** Leaving the comparison with additions asks to confirm them first. */
  const proceed = () => (additions ? setConfirming(true) : forward());

  // Checkout starts with the buyer's name filled in from their provider, if they marked themselves and named them.
  useEffect(() => {
    if (q.id === "checkout" && !a.contact.name.trim() && meProvider?.name.trim()) set({ contact: { ...a.contact, name: meProvider.name.trim() } });
    // Only when arriving at checkout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  // The comparison starts with the team on Advanced; the panel waits for a button, and closes when you leave.
  useEffect(() => {
    if (onPlan && !a.plan) set({ plan: "advanced" });
    if (onPlan) setPlanEntry(seq);
    if (!onPlan) {
      setPanel(null);
      setConfirming(false);
    }
    // Only when entering or leaving the comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPlan]);

  // Desktop checkout: once the summary has scrolled up out of view, it follows along in the free space to the right of
  // the page, until the checkout itself has scrolled away.
  useEffect(() => {
    if (phone || done || q.id !== "checkout") {
      setSummaryFollows(false);
      return undefined;
    }
    let raf = 0;
    const check = () => {
      raf = 0;
      const sum = summaryRef.current?.getBoundingClientRect();
      const card = cardRef.current?.getBoundingClientRect();
      setSummaryFollows(!!sum && !!card && sum.bottom < pinTop && card.bottom > pinTop + 520);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [phone, done, q.id, pinTop]);

  // Keep the question in view as it changes, without jumping on first load.
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const offset = phone ? 150 : 230;
    if (top < offset - 20 || top > window.innerHeight * 0.55) window.scrollTo({ top: window.scrollY + top - offset, behavior: "smooth" });
  }, [index, done, phone]);

  // The pinned bar follows the comparison down the page. Sticky can't do it here, so pin it once it reaches the top.
  useEffect(() => {
    if (!onPlan) {
      setPinned(null);
      return;
    }
    const update = () => {
      const slot = barSlot.current;
      const body = slot?.parentElement;
      if (!slot || !body) return;
      const r = slot.getBoundingClientRect();
      const end = body.getBoundingClientRect().bottom;
      // The bar itself, not the strip that joins it once pinned.
      const bar = slot.lastElementChild as HTMLElement | null;
      const height = (bar?.firstElementChild as HTMLElement | null)?.offsetHeight ?? r.height;
      const head = headRef.current?.getBoundingClientRect().bottom;
      // How far down the page the cream behind the bar reaches: the bar and its strip.
      const cover = pinTop + (bar?.offsetHeight ?? height);
      const next =
        r.top < pinTop && end > pinTop + height + 40 ? { left: r.left, width: r.width, height, strip: head !== undefined && head < pinTop + height, cover } : null;
      setPinned((prev) =>
        prev && next && prev.left === next.left && prev.width === next.width && prev.height === next.height && prev.strip === next.strip && prev.cover === next.cover
          ? prev
          : next,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [onPlan, pinTop, panel]);



  const priceTab = (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[6px] p-[20px] rounded-[24px] bg-[#281910] text-[#FFFCF1]">
        <span className="text-[13px] leading-[16px] text-[rgba(255,252,241,0.6)]">{planLabel}</span>
        <span className="flex items-baseline gap-[6px]">
          <span className={`text-[48px] leading-[50px] tracking-[-0.04em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
          <span className="text-[14px] text-[rgba(255,252,241,0.6)]">/ month</span>
        </span>
        <span className="flex items-center justify-between gap-[10px] flex-wrap">
          <span className="text-[13px] leading-[18px] text-[rgba(255,252,241,0.6)]">{a.annual ? `${money(yearly(total))} billed yearly` : "Billed monthly"}, plus tax</span>
          {saved > 0 && <span className="h-[24px] px-[10px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04]">Saving {money(saved)}/mo</span>}
        </span>
      </div>

      <div className="flex flex-col rounded-[22px] bg-[#FAF6EC] px-[16px] py-[6px]">
        {lineGroups.map(({ site, rows }, i) => (
          <span key={site.id} className={`flex flex-col gap-[6px] py-[10px] text-[14px] leading-[19px] text-[#281910] ${i ? `border-t border-solid ${HAIR}` : ""}`}>
            {locationCount > 1 && <span className="font-[600]">{siteName(site)}</span>}
            {rows.map((g) => (
              <span key={g.row.id} className="flex justify-between gap-[12px]">
                <span>
                  {g.row.plan.name} × {plural(g.row.providers, "provider")}
                </span>
                <span className="shrink-0 [font-variant-numeric:tabular-nums]">{money(g.amount)}</span>
              </span>
            ))}
          </span>
        ))}
        {[
          ...(priced.providerDiscount ? [[`Multi-provider Discount, ${bracketLabel(priced.providerBracket)} providers`, priced.providerDiscount] as const] : []),
          ...(priced.locationDiscount ? [[`Multi-clinic Discount, ${bracketLabel(priced.locationBracket)} locations`, priced.locationDiscount] as const] : []),
          ...(yearlyOff ? [["Yearly Discount", yearlyOff] as const] : []),
        ].map(([label, value]) => (
          <span key={label} className={`flex justify-between gap-[12px] py-[10px] border-t border-solid ${HAIR} text-[14px] leading-[19px] text-[#A0522D]`}>
            <span>{label}</span>
            <span className="shrink-0 [font-variant-numeric:tabular-nums]">−{money(value)}</span>
          </span>
        ))}
        <span className={`flex justify-between gap-[12px] py-[12px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>
          <span>Per month</span>
          <span className="[font-variant-numeric:tabular-nums]">{money(total)}</span>
        </span>
        <span className={`pb-[10px] text-[13px] leading-[18px] ${SUB}`}>{TAX_NOTE}</span>
      </div>

      <div className="flex flex-col gap-[14px] px-[2px]">
        <Ladder title="Multi-provider Discount" brackets={PROVIDER_BRACKETS} n={providerCount} />
        <Ladder title="Multi-clinic Discount" brackets={LOCATION_BRACKETS} n={locationCount} />
      </div>
    </div>
  );

  /** The team and the price, in a panel over the right of the page on desktop or a sheet on iPhone. */
  const sidePanel =
    onPlan && panel ? (
      <>
        {phone && <button type="button" aria-label="Close" onClick={() => setPanel(null)} className="fixed inset-0 z-[49] bg-[rgba(20,12,4,0.28)]" />}
        <aside
          aria-label={panel === "team" ? "Your team" : "Price breakdown"}
          className={`z-50 flex flex-col bg-[#FFFCF1] ${phone ? "doe-pricing-sheet fixed left-0 right-0 bottom-0 max-h-[86vh] rounded-t-[30px]" : "doe-pricing-slide fixed right-[20px] top-[120px] bottom-[20px] w-[400px] rounded-[32px] shadow-[0_24px_60px_-30px_rgba(40,25,16,0.45)]"}`}
        >
          <div className="flex items-center justify-between gap-[12px] p-[16px] pb-[12px]">
            <span className={`pl-[6px] text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-[#281910]`}>{panel === "team" ? "Your team" : "Your price"}</span>
            <Close label="Close panel" onClick={() => setPanel(null)} />
          </div>
          <div className="flex flex-col grow min-h-[0px] px-[16px] pb-[16px] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{panel === "team" ? teamEditor(true) : priceTab}</div>
          <div className={`flex items-center gap-[12px] p-[16px] pt-[12px] border-t border-solid ${HAIR} ${phone ? "pb-[max(16px,env(safe-area-inset-bottom))]" : ""}`}>
            <span className="grow min-w-[0px] flex flex-col">
              <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{`${money(total)}/mo`}</span>
              <span className={`text-[12px] leading-[15px] ${SUB}`}>Before tax</span>
            </span>
            {/* The price confirms the plan and moves on to checkout; the team just closes. */}
            <button
              type="button"
              disabled={!a.plan}
              onClick={() => {
                setPanel(null);
                if (panel === "price") proceed();
              }}
              className="h-[48px] px-[22px] shrink-0 rounded-[999px] bg-[#281910] hover:bg-[#3A2920] disabled:bg-[rgba(20,12,4,0.1)] disabled:text-[rgba(20,12,4,0.38)] text-[15px] leading-[20px] font-[600] text-[#FFFCF1] transition-colors duration-150"
            >
              {panel === "price" ? "Confirm" : "Done"}
            </button>
          </div>
        </aside>
      </>
    ) : null;

  /**
   * Confirms what was added on the comparison before checkout, against the whole team: every location and every
   * provider, the new ones to name (with their specialty and plan) and marked New, the rest shown as they are.
   */
  const addedSpecialtiesSet = addedProviders.every((p) => p.specialty && (p.specialty !== "other" || p.other.trim()));
  const additionsModal =
    confirming && additions ? (
      <div className={`fixed inset-0 z-[60] flex ${phone ? "items-end" : "items-center justify-center p-[24px]"}`}>
        <button type="button" aria-label="Close" onClick={() => setConfirming(false)} className="absolute inset-0 bg-[rgba(20,12,4,0.32)]" />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doe-pricing-additions"
          className={`relative flex flex-col w-full bg-[#FFFCF1] ${phone ? "doe-pricing-sheet max-h-[86vh] rounded-t-[30px]" : "doe-pricing-rise max-w-[560px] max-h-[82vh] rounded-[32px] shadow-[0_24px_60px_-30px_rgba(40,25,16,0.45)]"}`}
        >
          <div className="flex items-start justify-between gap-[12px] p-[16px] pb-[12px]">
            <span className="flex flex-col gap-[2px] pl-[6px] pt-[4px]">
              <span id="doe-pricing-additions" className={`text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-[#281910]`}>
                Confirm new additions
              </span>
              <span className={`text-[14px] leading-[19px] ${SUB}`}>{addedLine}</span>
            </span>
            <Close label="Close" onClick={() => setConfirming(false)} />
          </div>
          <div className="flex flex-col gap-[10px] grow min-h-[0px] px-[16px] pb-[16px] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {a.team.map((site) => {
                const si = a.team.indexOf(site);
                return (
                  <div key={site.id} className={`flex flex-col gap-[6px] p-[8px] rounded-[22px] ${OUTER}`}>
                    <span className="flex items-center gap-[8px] min-h-[40px] pl-[10px] pr-[4px]">
                      {isAdded(site.id) ? (
                        <NameField
                          value={site.name}
                          placeholder={`Clinic ${si + 1}`}
                          label={`Location ${si + 1} name`}
                          onChange={(v) => editSite(site.id, { name: v })}
                          text={`text-[19px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}
                          large
                        />
                      ) : (
                        <span className={`text-[19px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}>{siteName(site)}</span>
                      )}
                      <span className="grow" />
                      {isAdded(site.id) && <span className={`h-[24px] px-[9px] shrink-0 flex items-center rounded-[999px] text-[12px] leading-[14px] font-[600] whitespace-nowrap ${SELECTED}`}>New location</span>}
                    </span>
                    {site.providers.map((p) => {
                        const n = providers.indexOf(p) + 1;
                        if (!isAdded(p.id)) {
                          const sp = specialtyOf(p);
                          return (
                            <div key={p.id} className={`flex items-center gap-[10px] p-[10px] rounded-[18px] ${INNER}`}>
                              <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                              <span className="grow min-w-[0px] truncate text-[15px] leading-[20px] font-[500] text-[#140C04]">{providerName(p)}</span>
                              <span className="flex flex-wrap justify-end gap-[4px] shrink-0">
                                <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[500] text-[#281910]">{planOf(p).name}</span>
                                {sp && <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[500] text-[#281910]">{specialtyName(sp, p.other)}</span>}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={p.id} className={`flex flex-col gap-[8px] p-[10px] rounded-[18px] ${INNER}`}>
                            <span className="flex items-center gap-[10px] min-w-[0px]">
                              <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                              <NameField
                                value={p.name}
                                placeholder={`Provider ${n}`}
                                label={`Provider ${n} name`}
                                onChange={(v) => editProvider(p.id, { name: v })}
                                text={`${phone ? "text-[16px] leading-[21px]" : "text-[15px] leading-[20px]"} font-[500] text-[#140C04]`}
                              />
                              <span className="grow" />
                              <span className={`h-[22px] px-[8px] shrink-0 flex items-center rounded-[999px] text-[12px] leading-[14px] font-[600] whitespace-nowrap ${SELECTED}`}>New</span>
                            </span>
                            <span className="flex items-center gap-[6px] flex-wrap pl-[42px]">
                              {specialtyField({
                                label: `${providerName(p)} specialty`,
                                value: specialtyOf(p),
                                typed: p.other,
                                typing: p.specialty === "other",
                                bad: tried === "additions" && specialtyGap(p),
                                onPick: (v) => editProvider(p.id, { specialty: v }),
                                onType: (v) => editProvider(p.id, { other: v }),
                              })}
                              <Pick dark label={`${providerName(p)} plan`} value={planOf(p).id} options={planOptions} onChange={(v) => editProvider(p.id, { plan: v === plan.id ? null : v })} />
                            </span>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
          <div className={`flex items-center gap-[10px] p-[16px] pt-[12px] border-t border-solid ${HAIR} ${phone ? "pb-[max(16px,env(safe-area-inset-bottom))]" : ""}`}>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`h-[48px] px-[20px] shrink-0 rounded-[999px] ${OUTER} hover:bg-[#EDE5D2] text-[15px] leading-[20px] font-[600] text-[#281910] transition-colors duration-150`}
            >
              Back
            </button>
            <span className="grow" />
            <button
              type="button"
              aria-disabled={!addedSpecialtiesSet || undefined}
              onClick={() => {
                if (!addedSpecialtiesSet) return flag("additions");
                setPlanEntry(seq);
                setConfirming(false);
                // The additions are confirmed; the price breakdown is next.
                setPanel("price");
              }}
              className={`h-[48px] px-[22px] shrink-0 rounded-[999px] text-[15px] leading-[20px] font-[600] transition-colors duration-150 ${addedSpecialtiesSet ? "bg-[#281910] hover:bg-[#3A2920] text-[#FFFCF1]" : "bg-[rgba(20,12,4,0.1)] text-[rgba(20,12,4,0.38)]"}`}
            >
              Confirm and continue
            </button>
          </div>
        </div>
      </div>
    ) : null;

  /** A question's title, line by line. */
  const heading = (lines: string[]) => (
    <h2 className={`m-0 flex flex-col ${phone ? "text-[34px] leading-[37px]" : "text-[48px] leading-[51px]"} tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );

  const panelOpenDesktop = !!sidePanel && !phone;
  const goLabel = last ? "Finish" : q.id === "plan" && a.plan && !phone ? "Finalize" : "Continue";
  /**
   * Continue (Finalize on desktop) on the comparison confirms anything added there first, then opens the price
   * breakdown to confirm; the breakdown's Confirm moves on to checkout.
   */
  const go = () => (onPlan ? (additions ? setConfirming(true) : setPanel("price")) : proceed());
  const back = () => setAt(index - 1);
  const arrow = (dir: "back" | "next", size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={dir === "back" ? "M19 12H5m6-6l-6 6 6 6" : "M5 12h14m-6-6l6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  /**
   * The brown bar along the bottom: Back, the price (big, once there is one), then where you are beside Continue. It
   * fades in once a practice type is picked.
   */
  const dock =
    !done && a.shape && q.id !== "checkout" ? (
      <div className={`fixed left-0 bottom-[max(10px,env(safe-area-inset-bottom))] z-40 flex justify-center pointer-events-none ${phone ? "right-0 px-[10px]" : panelOpenDesktop ? "right-[420px] px-[24px]" : "right-0 px-[24px]"}`}>
        <div className={`doe-pricing-rise pointer-events-auto flex items-center gap-[8px] p-[8px] rounded-[26px] bg-[#281910] text-[#FFFCF1] shadow-[0_18px_40px_-20px_rgba(40,25,16,0.6)] ${phone ? "w-full" : "w-[560px] max-w-full"}`}>
          <button
            type="button"
            aria-label="Back"
            disabled={index === 0}
            onClick={back}
            className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[999px] bg-[rgba(255,252,241,0.12)] hover:bg-[rgba(255,252,241,0.2)] disabled:opacity-30 disabled:hover:bg-[rgba(255,252,241,0.12)] transition-[background-color,opacity] duration-200"
          >
            {arrow("back", 18)}
          </button>
          {/* The price, big, on the left once there is one; on the comparison it opens the breakdown. */}
          <span className="grow min-w-[0px] flex items-center pl-[8px]">
            {a.plan && (
              <button type="button" disabled={!onPlan} onClick={() => setPanel("price")} aria-label={onPlan ? "See price breakdown" : undefined} className="flex flex-col items-start whitespace-nowrap text-left disabled:cursor-default">
                <span className="flex items-baseline gap-[3px]">
                  <span className={`${phone ? "text-[24px] leading-[26px]" : "text-[28px] leading-[30px]"} tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
                  <span className="text-[14px] text-[rgba(255,252,241,0.6)]">/mo</span>
                </span>
                {/* The price is the whole team's, not one provider's. */}
                <span className="text-[12px] leading-[15px] font-[500] text-[rgba(255,252,241,0.6)]">Total for {plural(providerCount, "provider")}, before tax</span>
              </button>
            )}
          </span>
          {/* Where you are, right beside Continue. */}
          <span className="shrink-0 flex items-center gap-[8px] pr-[4px]" role="img" aria-label={`Step ${index + 1} of ${questions.length}: ${q.step}`}>
            {!phone && (
              <span className="flex items-center gap-[4px]">
                {questions.map((x, i) => (
                  <span
                    key={x.id}
                    className={`h-[6px] rounded-[99px] transition-[width,background-color] duration-300 ${i === index ? "w-[18px] bg-[#FCCFB8]" : i < index ? "w-[6px] bg-[rgba(255,252,241,0.7)]" : "w-[6px] bg-[rgba(255,252,241,0.22)]"}`}
                  />
                ))}
              </span>
            )}
            <span className="text-[13px] leading-[16px] font-[600] text-[rgba(255,252,241,0.6)] [font-variant-numeric:tabular-nums]">
              {index + 1}/{questions.length}
            </span>
          </span>
          <button
            type="button"
            aria-disabled={!q.ready || undefined}
            onClick={() => (q.ready ? go() : flag(q.id))}
            className={`flex items-center gap-[8px] h-[48px] pl-[20px] pr-[16px] shrink-0 rounded-[999px] text-[15px] leading-[20px] font-[600] transition-colors duration-200 ${q.ready ? "bg-[#FCCFB8] hover:bg-[#FFDCCB] text-[#140C04]" : "bg-[rgba(255,252,241,0.12)] text-[rgba(255,252,241,0.4)]"}`}
          >
            {goLabel}
            {arrow("next")}
          </button>
        </div>
      </div>
    ) : null;

  const firstName = a.contact.name.trim().replace(/^Dr\.?\s+/i, "").split(/\s+/)[0];
  /** What happens next, after the thank-you. */
  const nextSteps = [
    ["Open the link in your email", "It signs you in to Doe"],
    ...(linkRecipients.length ? [[linkRecipients.length === 1 ? "1 provider pays from their link" : `${linkRecipients.length} providers pay from their links`, "Their access starts once they pay"]] : []),
    ...(inviteRecipients.length ? [[inviteRecipients.length === 1 ? "Your provider gets their invite" : `${inviteRecipients.length} providers get their invites`, "They sign in from their email"]] : []),
    ["Teach agents about your clinic", "Services, providers, hours and more"],
  ];
  const card = done ? (
    <div className="doe-pricing-rise flex flex-col gap-[14px]">
      <div className={`p-[6px] rounded-[30px] ${OUTER}`}>
        <div className={`flex flex-col items-start gap-[18px] rounded-[24px] ${INNER} ${phone ? "p-[22px]" : "p-[36px]"}`}>
          <span className="w-[52px] h-[52px] flex items-center justify-center rounded-[999px] bg-[#FBE7DA]">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#A0522D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {heading(["Thank you,", `${firstName}.`])}
          <p className={`m-0 max-w-[46ch] text-[17px] leading-[25px] ${SUB}`}>We&apos;ve emailed you a link to access Doe.</p>
          <span className="inline-flex items-center gap-[10px] max-w-full h-[44px] px-[16px] rounded-[999px] bg-[#F4EEDF] text-[15px] leading-[20px] font-[500] text-[#281910]">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
              <path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="truncate">{a.contact.email}</span>
          </span>
        </div>
      </div>
      <div className={`grid items-start gap-[14px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
        <div className={`flex flex-col gap-[6px] p-[6px] rounded-[28px] ${OUTER}`}>
          <span className="px-[12px] pt-[8px] pb-[4px] text-[15px] leading-[20px] font-[600] text-[#140C04]">Your order</span>
          <div className={`flex flex-col px-[16px] py-[4px] rounded-[22px] ${INNER}`}>
            {line("Plan", tierCounts || planLabel)}
            {line("Price", `${money(total)}/mo`)}
            {dueToday > 0 && taxDue > 0 && line("Taxes", cents(taxDue))}
            {dueToday > 0 && line("Paid today", cents(dueToday + taxDue), true)}
            {buyerLine && line("Buyer", a.onBehalf ? "On behalf of providers" : buyerLine)}
          </div>
        </div>
        <div className={`flex flex-col gap-[6px] p-[6px] rounded-[28px] ${OUTER}`}>
          <span className="px-[12px] pt-[8px] pb-[4px] text-[15px] leading-[20px] font-[600] text-[#140C04]">What&apos;s next</span>
          <ol className="m-0 p-0 list-none flex flex-col gap-[6px]">
            {nextSteps.map(([t, d], i) => (
              <li key={t} className={`flex items-center gap-[12px] p-[14px] rounded-[20px] ${INNER}`}>
                <span className="w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#F4EEDF] text-[12px] leading-[14px] font-[700] text-[#281910]">{i + 1}</span>
                <span className="flex flex-col">
                  <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">{t}</span>
                  <span className={`text-[13px] leading-[18px] ${SUB}`}>{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  ) : (
    <div key={q.id} className={`doe-pricing-rise flex flex-col ${phone ? "gap-[22px]" : "gap-[28px]"}`}>
      {/* Checkout has no bar along the bottom, so its way back sits at the very top. */}
      {q.id === "checkout" && (
        <button
          type="button"
          onClick={back}
          className={`self-start flex items-center gap-[8px] h-[36px] -mb-[8px] pl-[10px] pr-[14px] rounded-[999px] text-[14px] leading-[18px] font-[600] text-[#281910] [@media(hover:hover)]:hover:bg-[#F4EEDF] transition-colors duration-150`}
        >
          {arrow("back", 16)}
          Back to Compare
        </button>
      )}
      <div className={`flex items-end justify-between gap-[16px] flex-wrap ${OUTER} ${phone ? "p-[20px] rounded-[26px] [&_h2]:text-[32px] [&_h2]:leading-[35px]" : "px-[32px] py-[28px] rounded-[32px]"}`}>
        {heading(q.title)}
      </div>
      {q.body}
    </div>
  );

  return (
    <div className="relative">
      <div
        className={`relative flex flex-col transition-[max-width,margin] duration-500 ${phone ? `mx-auto gap-[28px] ${done || q.id === "checkout" ? "pb-[24px]" : "pb-[110px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[760px]"} gap-[44px] ${done || q.id === "checkout" ? "pb-[40px]" : "pb-[120px]"} ${panelOpenDesktop ? "ml-0 mr-[380px]" : "mx-auto"}`}`}
      >
        <div
          ref={cardRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !done && (e.target as HTMLElement).tagName === "INPUT" && (e.target as HTMLInputElement).type !== "range") forward();
          }}
        >
          {card}
        </div>
      </div>
      {/* Desktop checkout: the summary, in the free space right of the page, once the one at the top has scrolled away.
          Only where there's room beside the checkout column. */}
      {summaryFollows && !phone && (
        <aside
          aria-label="Summary"
          className="doe-pricing-rise hidden min-[1400px]:block fixed z-30 p-[6px] rounded-[28px] bg-[#F4EEDF]"
          // The free space right of the 760px column, with an even gap each side.
          style={{ top: pinTop + 12, left: "calc(50% + 380px + 24px)", width: "min(340px, calc(50vw - 380px - 48px))" }}
        >
          <span className="flex items-center justify-between px-[12px] pt-[8px] pb-[10px]">
            <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">Summary</span>
            {editLink}
          </span>
          {summary}
        </aside>
      )}
      {dock}
      {sidePanel}
      {additionsModal}
    </div>
  );
}
