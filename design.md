# Doe UI Design System — `/product` & `/story`

Use this document when designing or implementing UI for **Product** (`/product`) and **Story** (`/story`). Both surfaces share the brown-and-gold console language; new work should feel like one product, not two themes.

**Always specify viewport** when implementing or reviewing: changes for iPhone must not alter desktop, and vice versa.

---

## 1. Surfaces, scope & viewport detection

### Surface map

| Surface | Route | Root wrapper | Primary CSS |
|---------|-------|--------------|-------------|
| Product desktop | `/product` | `.product-brown-mock` + tab mode classes | `lib/product/product-brown-mock.css`, `product-landing.css` |
| Product iPhone | `/product` | `.product-mobile-root.product-brown-mock` | `lib/product/product-mobile.css` + above |
| Story desktop | `/story` | `.product-brown-mock.product-brown-story-mode` | `lib/story/story-page.css` |
| Story iPhone | `/story` | `.product-brown-story-mode--mobile` | `lib/story/story-page.css` (mobile block) |

Story reuses Product shell pieces: `product-landing-console-shell`, `product-landing-header`, `product-landing-header__title`, and `--pb-nav-*` / `--pl-*` tokens from the brown mock.

### How the app picks desktop vs iPhone

| Signal | Desktop | iPhone |
|--------|---------|--------|
| HTML attribute | `html[data-layout="desktop"]` | `html[data-doeforvc-always-phone="true"]` (no `data-layout="desktop"`) |
| Product page flag | `html[data-product-page="true"][data-layout="desktop"]` | `html[data-product-page="true"]:not([data-layout="desktop"])` |
| Story mobile class | absent | `.product-brown-story-mode--mobile` on shell |
| Viewport height | `100vh` / natural scroll | `100dvh`, `--app-vh` where set |

Bootstrap scripts set these before paint (`product-route-bootstrap-script.ts`, `useProductPageVariant`, `StoryMobileView` + `useDoePhoneLayoutViewport`).

### CSS scoping rules (mandatory)

| Viewport | Scope new rules under | Do not use alone |
|----------|----------------------|------------------|
| **Desktop Product** | `html[data-product-page="true"][data-layout="desktop"] .product-brown-mock …` | Bare `.product-brown-mock` if it affects mobile |
| **iPhone Product** | `html[data-product-page="true"]:not([data-layout="desktop"]) .product-mobile-root …` | Global `html` rules without `:not([data-layout="desktop"])` |
| **Desktop Story** | `.product-brown-mock.product-brown-story-mode:not(.product-brown-story-mode--mobile) …` or `.product-brown-story-mode …` without `--mobile` | — |
| **iPhone Story** | `.product-brown-story-mode.product-brown-story-mode--mobile …` or `html[data-doeforvc-always-phone] …` for modals | Bare `.product-brown-story-mode` for layout-breaking changes |
| **Story Meet Doe modal (iPhone only)** | `html[data-doeforvc-always-phone] .story-meet-doe-modal …` | — |

**Golden rule:** If a fix is iPhone-only, the selector must include `--mobile`, `:not([data-layout="desktop"])`, or `data-doeforvc-always-phone`. Never “fix mobile” by changing shared desktop rules.

---

## 2. Typography (all viewports)

### Font roles (do not swap)

| Role | Font | Use for |
|------|------|---------|
| **Brand wordmark** | Lora | “Doe” wordmarks only |
| **UI chrome** | Suisse Intl | Nav, tab headers, breadcrumbs, budget table, team cards, labels, buttons |
| **Content / stats** | DM Sans | Fundraise amounts, runway, goals hero, milestone stats, product-line accents |

### Shared rhythm

- Horizontal gutter: **`--pl-gutter`** = `clamp(1rem, 2vw, 1.35rem)` on desktop; **`--product-mobile-gutter-x`** (~`1.05rem`) on Product iPhone; Story iPhone uses **`--story-gutter`** (aliases `--pl-gutter`).
- Headline scale: **`clamp(minRem, preferredVw, maxRem)`** — no fixed px for hero stats.
- Letter-spacing: display **`-0.025em` to `-0.055em`**; uppercase labels **`0.16em`**.
- Line-height: display stats **`0.88–0.98`**; meta **`1.05–1.1`**.

---

## 3. Color (all viewports)

### Brown surfaces

| Token | Value | Use |
|-------|-------|-----|
| `--pb-nav-surface` | `#181410` / `#1b1713` | Nav, Story tab panel fill |
| `--pl-console-text` / `--story-cream-text` | `#f2e8da` | Primary cream on brown |
| `--story-cream-muted` | `rgba(245, 230, 208, 0.62)` | Meta (“Runway”, stat subtitles) |
| `--story-cream-body` | `rgba(245, 230, 208, 0.72)` | Budget cells, secondary body |
| Borders | `rgba(212, 165, 116, 0.14–0.22)` | Grid lines, table rules |

### Gold

**Desktop Story / marketing:** `--story-gold-text` → `--doehealth-gold-text-gradient` (3-stop: `#e8c08e → #d4a574 → fade`).

**Product iPhone:** `--product-mobile-gold-text` (4-stop, brighter top `#f0d2a4`).

**Offset accent (Goals):** `--story-gold-offset-text`.

**Gradient text pattern:**

```css
background: var(--story-gold-text); /* or --product-mobile-gold-text on Product iPhone */
background-clip: text;
-webkit-background-clip: text;
color: transparent;
-webkit-text-fill-color: transparent;
```

Muted meta: **no gradient** — explicit `color` + `-webkit-text-fill-color`.

---

## 4. Text wrapping (all viewports)

### Content panels — wrap, never clip words

```css
overflow-wrap: anywhere;
word-break: normal;
text-wrap: balance;
white-space: normal;
```

Apply to: goal stats, product-line names, budget labels, team credentials, hero labels.

### May stay single-line

- Short numeric tokens: `$200K`, `1.5M`, `18 months`
- Budget `%` / `$$$` columns: `white-space: nowrap`
- Nav / tab bar chrome (Product)

### Anti-clipping

- Flex/grid text children: **`min-width: 0`**
- **No `text-overflow: ellipsis`** on Story fundraise/goals/team content
- **No `overflow: hidden`** on prose cells without scroll

---

## 5. Desktop view rules

### Product desktop (`html[data-layout="desktop"]`)

| Area | Layout | Typography | Text behavior |
|------|--------|------------|---------------|
| **Shell** | Left nav (`--pb-nav-width: 264px`) + cream workspace; optional call-history rail | Suisse nav, DM Sans stats in panels | Nav labels may `nowrap` + ellipsis |
| **Today** | `--pl-gutter` padding; day summary 2-col grid | Greeting DM Sans; section labels Suisse | Display names may `nowrap` on desktop hero |
| **Call history** | Mosaic chart grid; hero **right-aligned** | Large gold gradient hero lines | Visit title **`white-space: nowrap`** (display type) |
| **Inbox / Schedule** | Label left, value/time **right** | Suisse structure, DM Sans emphasis | Subject `line-clamp: 2`; body `pre-wrap` |
| **Header** | `product-landing-header__title` taupe ink (`--pi-ink`) | Suisse 400 | Breadcrumb trail `nowrap` |

### Story desktop (`.product-brown-story-mode`, no `--mobile`)

| Area | Layout | Typography | Text behavior |
|------|--------|------------|---------------|
| **Shell** | Sidebar nav + tab panel (`--pb-nav-inset`); collapsible nav | Suisse wordmark + nav | — |
| **Tab header** | `product-landing-header__title` **gold gradient**, Suisse | `clamp(1.35rem … 1.75rem)` | Left-aligned |
| **Tab pager** | Fixed bottom-right inside workspace | — | — |
| **Panel body** | `overflow: hidden`; content centered or grid-fit | — | Container queries OK on Goals (`container-type: size`) |

#### Our Ask — desktop

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Grid | 2 columns, **88% scale** (`--story-our-ask-scale: 0.88`) | Ask **left**, budget **right** | — |
| Pre-Seed / amount / runway | Left column | **Left** | Round `clamp(2.85–4.05rem)`, amount `clamp(6.75–13rem)`, runway `clamp(4.5–8rem)` |
| Budget table | Right column, embedded | Category **left**, `%`/`$$$` **right** | Col width **7.5rem** for numerics |

#### Goals at Seed — desktop

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Grid | **3×3** with fade grid lines (`::before`/`::after`) | All cells **center** | Hero amount up to **13rem** |
| Hero | Top center lockup | **Center** | Label `text-wrap: balance`, max **24ch** |
| Middle row (products) | Rows 4–6 | **Center** | Product names **`text-wrap: balance`**, wrap allowed |
| Container queries | `@container goals-panel (max-height: 700px/580px)` | — | Scales type down in short panels |

#### Team — desktop

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Cards | **Absolute overlap** — James top-left, Matthew bottom-right | Internal placements per pitch deck | Min **30×22rem**, container-query sized |
| Name | Gold gradient | James bottom-right, Matthew top-left | Up to **7.5rem** (cqb) |
| Role label | Uppercase, `--story-gold-muted` | Corner placement | `letter-spacing: 0.16em` |
| Credentials | `#fff8f0` | Opposite corner | `max-width: min(22ch, 88%)`, wrap OK |

#### Roadmap — desktop

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Hero | Top center lockup | **Center** | Headline `clamp(2.35–3.85rem)` gold |
| Columns | **2-col** — Product left, GTM right | Top-aligned sections | Max width **56rem** |
| Focus card | “Live today” + **Voice** | **Left** in product column | Focus value up to **2.65rem** |
| Agent grid | **3×2** rollout labels | **Center** in cells | Suisse labels, wrap/balance |
| GTM list | Bulleted points | **Left** | DM Sans headline, Suisse body |

---

## 6. iPhone view rules

### Product iPhone (`:not([data-layout="desktop"])`)

| Area | Layout | Typography | Text behavior |
|------|--------|------------|---------------|
| **Shell** | Column: topbar → main → floating pill tab bar | Lora wordmark, Suisse chrome | `100dvh`, scroll lock on html/body |
| **Chrome** | `#1a1208` background; `--product-mobile-gutter-x/y` | Gold via **`--product-mobile-gold-text`** | Safe-area on topbar + tab bar |
| **Tab clearance** | `--product-mobile-tabbar-clearance` | — | Main scrollers leave room above tab bar |
| **Today** | Stacked: day summary → orbit → live-thread preview | Same font split | Natural wrap in previews |
| **Calls** | **50/50** split: transcript top, chart bottom | — | Hero lines **`white-space: normal; overflow-wrap: anywhere`** |
| **Schedule** | Time column + day column; week scrolls horizontally | Gold event fills | Event titles may truncate in compact mode |
| **Touch** | `touch-action: pan-y` on body; `-webkit-overflow-scrolling: touch` on scroll regions | — | — |

### Story iPhone (`.product-brown-story-mode--mobile`)

| Area | Layout | Typography | Text behavior |
|------|--------|------------|---------------|
| **Shell** | Full-screen tab; slide-over nav drawer | Same font split as desktop Story | Solid `#1b1713` fill including overscroll |
| **Tab header** | Safe-area top padding; hamburger opens drawer | Title `clamp(1.2–1.45rem)` gold | Left-aligned + menu button |
| **Tab body** | `overflow-y: auto`; bottom pad **`max(5.5rem, safe-area + 4.75rem)`** | — | Scrollable for Our Ask / Goals / Team / Roadmap |
| **Tab pager** | Fixed bottom-right, safe-area inset | — | z-index above content |
| **Meet Doe modal** | Scoped `html[data-doeforvc-always-phone]` | — | Narrower card, taller backdrop; one shader at a time |

#### Our Ask — iPhone

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Grid | **Vertical stack**, no scale transform | Ask **centered**, table full width | Gap `clamp(1.35–2rem)` |
| Pre-Seed / amount / runway | Stacked above budget | **Center** | Amount `clamp(4.35–7.25rem)`, runway `clamp(2.85–4.75rem)` |
| Budget table | Below ask | Category **left**, numerics **right** | Col width **4.35rem**; smaller body type |

#### Goals at Seed — iPhone

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|----------------|
| Grid | **2 columns**, no decorative grid lines | **Center** lockups | Gap `clamp(0.65–1rem)` |
| Container | **`container-type: normal`** (not `size`) | — | Prevents zero-height collapse |
| Callout | `height: auto`, `overflow: visible`, scroll-friendly | **Center** | Hero amount `clamp(4.5–7.5rem)` |
| Product names | All rows | **Center** | **`white-space: normal`**, `overflow-wrap: anywhere` |

#### Team — iPhone

| Element | Layout | Alignment | Sizes (approx) |
|---------|--------|-----------|---------------|
| Cards | **Stacked column**, full width | Same internal corner placements | `aspect-ratio: 1.28/1`, min-height `clamp(15.5–21rem)` |
| Name | Gold gradient | Per card layout | `clamp(2.65–4.25rem)` |
| Credentials | Cream body text | Wrap allowed | `clamp(1.05–1.55rem)` |

---

## 7. Desktop vs iPhone — quick comparison

### Story content tabs

| Tab | Desktop | iPhone |
|-----|---------|--------|
| **Our Ask** | 2-col scaled grid; ask left | Stacked; ask centered; budget below |
| **Goals** | 3×3 grid + fade lines; container queries | 2-col; no grid lines; block scroll body |
| **Team** | Overlapping absolute cards | Stacked full-width cards |
| **Roadmap** | 2-col product + GTM | Stacked; 2-col agent grid |
| **Body overflow** | `hidden` (fit viewport) | `overflow-y: auto` |
| **Content padding** | Stage-centered, scale transform | `--story-gutter` + safe areas |

### Product vs Story (iPhone)

| Aspect | Product iPhone | Story iPhone |
|--------|----------------|--------------|
| Navigation | Bottom tab bar (4 tabs) | Header menu + prev/next pager |
| Gold token | `--product-mobile-gold-text` | `--story-gold-text` |
| Panel fill | Tab-specific (cream/taupe/brown mix) | Uniform brown `#1b1713` |
| Hero names | Wrap (`overflow-wrap: anywhere`) | Same rule on all content tabs |
| Primary goal | Operational density | Pitch readability + scroll |

### Text wrapping by viewport

| Content type | Desktop | iPhone |
|--------------|---------|--------|
| Story goal / product labels | `text-wrap: balance`, wrap OK | Same + `overflow-wrap: anywhere` |
| Story budget categories | Wrap OK | Wrap OK |
| Product call-history hero | Often `nowrap` | **Must wrap** |
| Short amounts (`1.5M`, `$200K`) | `nowrap` | `nowrap` |
| Nav / tab labels | `nowrap` / ellipsis OK | `nowrap` on tab bar |

---

## 8. Spacing reference

| Token / pattern | Desktop | iPhone |
|-----------------|---------|--------|
| `--pl-gutter` | `clamp(1rem, 2vw, 1.35rem)` | `~1.05rem` (Product mobile) |
| Story content pad | `--story-gutter` (= `--pl-gutter`) | `clamp(0.85rem, 3.25vw, 1.15rem)` |
| Story tab body bottom | — | `max(5.5rem, safe-area + 4.75rem)` |
| Our Ask grid scale | `0.88` transform | none (100% width stack) |
| Fundraise stack gap | — | `clamp(1.35rem, 4.5vw, 2rem)` |
| Goals row gap | `clamp(2rem, 5cqb, 4rem)` | `clamp(1.15rem, 4vw, 1.75rem)` |
| Meet Doe card height | aspect ~2.35:1 (desktop modal) | `clamp(26rem, 78vh, 34rem)` |

---

## 9. Component checklist

### All viewports

1. Font: Suisse (chrome), DM Sans (stats), Lora (wordmark only).
2. Gold: existing tokens only; borders `rgba(212, 165, 116, 0.14+)`.
3. Muted copy: `--story-cream-muted`, not gradient.
4. Content text wraps; no clipped words.
5. Numeric columns right-aligned; prose alignment per tab table above.

### Desktop only

6. Story Goals may use `container-type: size` and `@container` queries.
7. Story Our Ask may use scale transform for grid fit.
8. Team cards may use absolute overlap layout.
9. Product call-history display type may use `nowrap` where specified.

### iPhone only

10. Scope CSS with `--mobile`, `:not([data-layout="desktop"])`, or `data-doeforvc-always-phone`.
11. Tab bodies scroll vertically; no zero-height size containers.
12. Safe-area on header, pager, tab bar, modals.
13. Product hero names and Story content labels: **`overflow-wrap: anywhere`**.
14. Do not change desktop rules when fixing iPhone.

---

## 10. Prompt templates

### Desktop

```
Follow design.md (repo root), Desktop view section.

Context: [Product | Story] / Desktop / [Tab or panel name]

Requirements:
- Scope CSS to desktop selectors only (data-layout="desktop" or :not(.product-brown-story-mode--mobile))
- Typography: Suisse Intl (chrome), DM Sans (stats), Lora (wordmark only)
- Colors: --story-gold-text or product brown/cream tokens; muted --story-cream-muted
- Layout: per design.md desktop tables for Our Ask / Goals / Team
- Text: balance wrap on content; nowrap OK for short numeric tokens and product call-history display hero
- Do not add iPhone/mobile rules in this change
```

### iPhone

```
Follow design.md (repo root), iPhone view section.

Context: [Product | Story] / iPhone / [Tab or panel name]

Requirements:
- Scope CSS to iPhone selectors only (--mobile, :not([data-layout="desktop"]), or data-doeforvc-always-phone)
- Typography: same font roles as desktop; use --product-mobile-gold-text on Product iPhone
- Text: full words visible — overflow-wrap anywhere on all content labels; nowrap only for amounts and numeric columns
- Layout: stacked/scrolling per design.md iPhone tables; safe-area insets; tab bar/pager clearance
- Do not change desktop layout, scale transforms, or container-type: size rules
```

---

## 11. File map

| Concern | Files |
|---------|--------|
| Story tokens & tabs | `lib/story/story-page.css` |
| Story components | `components/story/Story*Panel.tsx`, `StoryBlankPanel.tsx`, `StoryRoadmapPanel.tsx` |
| Story roadmap copy | `lib/story/story-roadmap-gtm.ts` |
| Product brown shell | `lib/product/product-brown-mock.css` |
| Product Today / landing | `lib/product/product-landing.css` |
| Product iPhone | `lib/product/product-mobile.css` |
| Shared gold token | `lib/doehealth/doehealth-landing.css` |
| Viewport hooks | `lib/product/use-product-page-variant.ts`, `lib/doephone/use-doe-phone-layout-viewport.ts` |
| Fonts | `lib/home/fonts.ts` |

---

## 12. Intentional differences (keep these)

| Aspect | Product | Story |
|--------|---------|-------|
| Panel background | Cream workspace + brown nav | Brown fill on tab panel only |
| Header title | Taupe/cream (Product) | Gold gradient (Story) |
| Primary use | Operational UI | Fundraise / pitch |
| Desktop Goals | N/A | 3×3 grid with fade lines |
| iPhone nav | Bottom tab bar | Drawer + pager |

Unify **typography, gold hierarchy, wrapping, and alignment** — not information architecture or nav patterns.
