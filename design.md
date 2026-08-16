# Doe UI Design System — `/product` & `/story`

Use this document when designing or implementing UI for **Product** (`/product`) and **Story** (`/story`). Both surfaces share the brown-and-gold console language; new work should feel like one product, not two themes.

---

## 1. Surfaces & scope

| Surface | Route | Root wrapper | Primary CSS |
|---------|-------|--------------|-------------|
| Product desktop | `/product` (desktop) | `.product-brown-mock` + tab mode classes | `lib/product/product-brown-mock.css`, `product-landing.css` |
| Product iPhone | `/product` (phone) | `.product-mobile-root.product-brown-mock` | `lib/product/product-mobile.css` + above |
| Story desktop | `/story` (desktop) | `.product-brown-mock.product-brown-story-mode` | `lib/story/story-page.css` |
| Story iPhone | `/story` (phone) | `.product-brown-story-mode--mobile` | `lib/story/story-page.css` (mobile block) |

Story reuses Product shell pieces: `product-landing-console-shell`, `product-landing-header`, `product-landing-header__title`, and `--pb-nav-*` / `--pl-*` tokens from the brown mock.

---

## 2. Typography

### Font roles (do not swap arbitrarily)

| Role | Font | Use for |
|------|------|---------|
| **Brand wordmark** | Lora | “Doe” wordmarks only |
| **UI chrome** | Suisse Intl | Nav, tab headers, breadcrumbs, budget table, team cards, labels, buttons, section eyebrows |
| **Content / stats** | DM Sans | Fundraise amounts, runway, goals hero, milestone stats, product-line accents |

**Rules**

- Tab panel titles (`product-landing-header__title`): **Suisse Intl**, weight **400**, gold gradient on Story; cream/ink on Product landing headers inside brown panels.
- Large numbers and ask/runway copy: **DM Sans**, weight **500**, gold gradient.
- Tables and founder cards: **Suisse Intl** for structured data; credentials on team cards stay cream `#fff8f0`.

### Size & rhythm

- Horizontal gutter: **`--pl-gutter`** / **`clamp(1rem, 2vw, 1.35rem)`** — align Story tab padding to this, not ad-hoc values.
- Headline scale: use **`clamp(minRem, preferredVw, maxRem)`** — never fixed px for hero stats.
- Letter-spacing: display lines **`-0.025em` to `-0.055em`**; uppercase labels **`0.16em`** (team role labels).
- Line-height: display stats **`0.88–0.98`**; meta/subcopy **`1.05–1.1`**.

### Story tab reference (content panels)

| Tab | Key classes | Font | Alignment |
|-----|-------------|------|-----------|
| **Our Ask** | `story-fundraise-*`, `story-fundraise-budget*` | DM Sans (ask), Suisse Intl (budget) | Desktop: ask **left**, budget **right column**. iPhone: **stacked**, ask **centered** |
| **Goals at Seed** | `story-goals-*` | DM Sans | **Center** lockups; 3×3 grid desktop, 2-col iPhone |
| **Team** | `story-team-grid__*` | Suisse Intl (via `PitchShaderFillBox`) | Desktop: **overlapping** cards (James top-left, Matthew bottom-right). iPhone: **stacked** full-width |

---

## 3. Color

### Brown surfaces

| Token | Hex / value | Use |
|-------|-------------|-----|
| `--pb-nav-surface` | `#181410` / `#1b1713` | Nav, Story tab panel fill |
| `--pl-console-text` | `#f2e8da` | Primary cream on brown |
| Story / product muted cream | `rgba(245, 230, 208, 0.62)` | Meta labels (“Runway”, stat subtitles) |
| Story / product body cream | `rgba(245, 230, 208, 0.72)` | Budget table cells, secondary body |
| Borders | `rgba(212, 165, 116, 0.14–0.22)` | Grid lines, table rules, dividers |

### Gold

**Primary gradient text** (headlines, stats, table headers):

```css
--story-gold-text: var(
  --doehealth-gold-text-gradient,
  linear-gradient(180deg, #e8c08e 0%, #d4a574 52%, rgba(212, 165, 116, 0.72) 100%)
);
```

Product mobile uses a **4-stop** variant (`--product-mobile-gold-text`) with a brighter top `#f0d2a4`. Prefer **`--story-gold-text`** on Story; on Product mobile use **`--product-mobile-gold-text`**. Do not invent new gold hex values.

**Offset accent** (Goals product-line highlights): `--story-gold-offset-text` (`#f2ddb8 → #e8c08e → #d4a574`).

**Solid gold** (budget row labels, icons): `#e8c08e` / `--story-gold`.

**Gold text pattern** (required for gradient type):

```css
background: var(--story-gold-text);
background-clip: text;
-webkit-background-clip: text;
color: transparent;
-webkit-text-fill-color: transparent;
```

Muted meta that must **not** use gradient: set `background: none`, explicit `color` and `-webkit-text-fill-color`.

---

## 4. Text wrapping — full words, never clipped

Match Product’s split between **display chrome** (may truncate) and **content** (must not clip words).

### Always allow wrap / balance (Story content tabs)

Apply to: goal stat lines, product-line names, budget category labels, team credentials, hero labels.

```css
overflow-wrap: anywhere;  /* break long tokens if needed */
word-break: normal;         /* prefer word boundaries */
text-wrap: balance;         /* multi-line headlines */
white-space: normal;
```

- **Do not** use `overflow: hidden` on cells that contain prose or multi-word labels unless paired with scroll.
- **Do not** use `text-overflow: ellipsis` on fundraise/goals/team content panels.

### May stay single-line (short tokens only)

- Currency shorthand: `$200K`, `1.5M`, `18 months`
- Budget **numeric columns** (`%`, `$$$`): `white-space: nowrap`
- Nav items, tab bar labels (Product chrome)

### Product precedent (iPhone)

Call history hero lines use explicit wrap so names are never cut off:

```css
white-space: normal;
overflow-wrap: anywhere;
```

Story iPhone tabs must follow the same rule for stat meta and product names.

### Layout anti-clipping

- Every flex/grid child that holds text: **`min-width: 0`**
- Scrollable tab bodies on iPhone: **`overflow-y: auto`**, not `hidden`, for Our Ask / Goals / Team
- Avoid **`container-type: size`** with **`height: auto`** on iPhone (causes zero-height containment and invisible content)

---

## 5. Alignment

### Panel headers

- Story: `product-landing-header` — title **left**, gold gradient, Suisse Intl
- Same header component as Product; Story overrides color to gold, not taupe ink

### Our Ask

| Element | Desktop | iPhone |
|---------|---------|--------|
| Pre-Seed / amount / runway | Left in left column | Center in stack |
| Budget table | Right column, full height | Below ask, full width |
| Table `%` / `$$$` | Right-aligned | Right-aligned (narrower columns ~4.35rem) |

### Goals at Seed

- Hero lockup: **center**
- Grid cells: **center** text; lockups use `align-items: center`
- Grid decorative lines: desktop only; **removed on iPhone**

### Team

- James: name **bottom-right**, credentials **top-left**, tags per pitch deck
- Matthew: mirrored placements
- iPhone: cards **stack vertically**, same internal placements, **100% width**

### Cross-element alignment

- When stacking on iPhone, **center** hero amounts; **left-align** table text columns; **right-align** numeric columns — same as Product inbox/schedule rows (label left, value right).

---

## 6. Spacing & layout

| Pattern | Value |
|---------|--------|
| Story tab body iPhone bottom pad | `max(5.5rem, env(safe-area-inset-bottom) + 4.75rem)` — clears tab pager |
| Story content iPhone horizontal pad | `clamp(0.85rem, 3.25vw, 1.15rem)` — close to `--pl-gutter` |
| Fundraise grid desktop scale | `--story-our-ask-scale: 0.88` (centered transform) |
| Fundraise iPhone | No scale transform; vertical stack gap `clamp(1.35rem, 4.5vw, 2rem)` |
| Goals row gap iPhone | `clamp(1.15rem, 4vw, 1.75rem)` |

---

## 7. Component checklist (new Story or Product panels)

Before shipping, verify:

1. **Font**: Suisse for chrome/structure, DM Sans for stats and marketing numbers, Lora only for Doe wordmark.
2. **Gold**: Gradient via `--story-gold-text` or `--product-mobile-gold-text`; borders `rgba(212, 165, 116, 0.14+)`.
3. **Muted copy**: `rgba(245, 230, 208, 0.62)` — not gradient, not pure white.
4. **Words**: Content labels wrap with `overflow-wrap: anywhere`; no mid-word clipping on iPhone.
5. **Alignment**: Numeric columns right; prose left or center per tab convention above.
6. **iPhone**: Scoped under `.product-brown-story-mode--mobile` or `html[data-product-page]:not([data-layout="desktop"])` — **never change desktop when fixing phone**.
7. **Gutter**: Use `--pl-gutter` / existing clamp gutters; don’t introduce unrelated horizontal padding.
8. **Safe area**: Headers and tab pager respect `env(safe-area-inset-*)`.

---

## 8. Prompt template for future design work

Copy into agent prompts when adding UI:

```
Follow design.md in the repo root.

Context: [Product | Story] / [Desktop | iPhone] / [Tab name]

Requirements:
- Typography: Suisse Intl (chrome), DM Sans (stats/content), Lora (wordmark only)
- Colors: brown surface #1b1713, cream text #f2e8da, gold gradient --story-gold-text
- Text: full words visible — overflow-wrap anywhere on content; nowrap only for short numeric tokens
- Alignment: [describe left/center/right per element]
- Scope CSS to [product-brown-story-mode--mobile | desktop-only selector]
- Match /product spacing (--pl-gutter) and gold/muted cream hierarchy
- Do not add new font families or gold hex values outside design.md
```

---

## 9. File map

| Concern | Files |
|---------|--------|
| Story tokens & tabs | `lib/story/story-page.css` |
| Story components | `components/story/Story*Panel.tsx`, `StoryBlankPanel.tsx` |
| Product brown shell | `lib/product/product-brown-mock.css` |
| Product Today / landing | `lib/product/product-landing.css` |
| Product iPhone | `lib/product/product-mobile.css` |
| Shared gold token | `lib/doehealth/doehealth-landing.css` (`--doehealth-gold-text-gradient`) |
| Fonts | `lib/home/fonts.ts` (`suisseIntl`, `dmSans`, `lora`) |

---

## 10. Known differences (intentional)

| Aspect | Product | Story |
|--------|---------|-------|
| Panel background | Cream workspace + brown nav | Brown fill on tab panel only |
| Header title color | Taupe ink (landing) / cream (console) | Gold gradient |
| Primary use | Operational UI (calls, schedule, inbox) | Fundraise / pitch content |
| Desktop Goals layout | N/A | 3×3 grid with fade grid lines |

Keep these differences; unify **typography, gold, wrapping, and alignment rules** — not the overall information architecture.
