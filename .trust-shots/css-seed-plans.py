import pathlib

p = pathlib.Path("lib/earlypreview/earlypreview-market.css")
s = p.read_text()


def between(start, end, replacement, after=0):
    global s
    a = s.index(start, after)
    b = s.index(end, a)
    s = s[:a] + replacement + s[b:]


SEED_PLANS = '''/* ------------------------------------------------------------ target at Seed */

/* The title starts at the dead center of the screen and rises to its place as --lift goes 0 to 1. */
.earlypreview-market__seed-title {
  flex-shrink: 0;
  transform: translateY(calc((1 - var(--lift, 0)) * var(--to-center, 0) * 1px));
}

.earlypreview-market__scene--center .earlypreview-market__title {
  text-align: center;
}

.earlypreview-market__scene--center .earlypreview-market__title > span {
  margin-inline: auto;
}

/* One metric a line, centered, the figures set in salmon. */
.earlypreview-market__seed-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.3rem, 1.15vh, 0.75rem);
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;
}

.earlypreview-market__seed-lines > li {
  font-family: var(--m-display);
  font-size: clamp(1.4rem, min(2.5vw, 4.1vh), 2.6rem);
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: rgb(255 252 241 / 0.78);
  opacity: var(--e, 0);
  transform: translateY(calc((1 - var(--e, 0)) * 0.8rem));
}

.earlypreview-market__seed-lines strong {
  font-weight: 400;
  font-variant-numeric: lining-nums;
  color: var(--m-salmon);
}

/* ------------------------------------------------------------ plans */

.earlypreview-market__plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Each plan a quiet card; Advanced is edged in salmon. */
.earlypreview-market__plan {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(1.25rem, 2.2vw, 2rem);
  border: 1px solid rgb(255 252 241 / 0.14);
  border-radius: 20px;
  background: rgb(255 252 241 / 0.03);
  opacity: var(--e, 0);
  transform: translateY(calc((1 - var(--e, 0)) * 1.1rem));
  transition: opacity 200ms ease, border-color 200ms ease;
}

.earlypreview-market__plan.is-advanced {
  border-color: rgb(252 207 184 / 0.55);
  background: rgb(252 207 184 / 0.06);
}

.earlypreview-market__plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.earlypreview-market__plan-name {
  font-family: var(--m-display);
  font-size: clamp(1.6rem, min(2.4vw, 4.2vh), 2.4rem);
  line-height: 1;
  letter-spacing: -0.035em;
}

.earlypreview-market__plan-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  background: var(--m-salmon);
  color: #2a1a12;
}

.earlypreview-market__plan-tagline {
  margin-top: 0.5rem;
  font-size: clamp(1rem, 1.15vw, 1.15rem);
  color: var(--m-dim);
}

.earlypreview-market__plan-price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 0.65rem;
  margin-top: clamp(1rem, 3vh, 1.75rem);
}

.earlypreview-market__plan-value {
  font-family: var(--m-display);
  font-size: clamp(3.4rem, min(6.4vw, 11vh), 7rem);
  line-height: 0.86;
  letter-spacing: -0.06em;
  white-space: nowrap;
}

.earlypreview-market__plan:not(.is-free) .earlypreview-market__plan-value {
  color: var(--m-salmon);
}

.earlypreview-market__plan-unit {
  font-size: clamp(0.95rem, 1.05vw, 1.05rem);
  color: var(--m-dim);
}

.earlypreview-market__plan-after {
  margin-top: 0.55rem;
  font-size: clamp(1rem, 1.15vw, 1.15rem);
  color: var(--m-dim);
}

.earlypreview-market__plan-after strong {
  font-weight: 500;
  color: var(--m-cream);
}

.earlypreview-market__plan-features {
  display: flex;
  flex-direction: column;
  gap: clamp(0.45rem, 1.2vh, 0.75rem);
  margin: clamp(1.1rem, 3vh, 1.75rem) 0 0;
  padding: clamp(1rem, 2.6vh, 1.4rem) 0 0;
  border-top: 1px solid rgb(255 252 241 / 0.12);
  list-style: none;
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.3;
}

.earlypreview-market__plan-features > li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.earlypreview-market__plan-features svg {
  flex-shrink: 0;
  margin-top: 0.2em;
  color: var(--m-salmon);
}

/* "Everything in …" reads as the carry-over, quieter than what the plan adds. */
.earlypreview-market__plan:not(.is-free) .earlypreview-market__plan-features > li:first-child {
  color: var(--m-dim);
}

.earlypreview-market__plan:not(.is-free) .earlypreview-market__plan-features > li:first-child svg {
  color: var(--m-quiet);
}

/* The founding offer, once, centered under the cards. */
.earlypreview-market__plan-founding {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.35rem 0.8rem;
  margin: clamp(1.25rem, 3.5vh, 2.25rem) 0 0;
  font-size: clamp(1rem, 1.15vw, 1.15rem);
  color: var(--m-dim);
  opacity: var(--e, 0);
}

.earlypreview-market__plan-founding strong {
  font-weight: 500;
  color: var(--m-salmon);
}

'''

PHONE_SEED = '''.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__seed-lines {
  gap: 0.35rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__seed-lines > li {
  font-size: 1.05rem;
  text-wrap: balance;
}

'''

PHONE_PLANS = '''/* On the iPhone the plans stack as compact cards: name and price on one line, the features wrapped under them. */
.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plans {
  grid-template-columns: minmax(0, 1fr);
  gap: 0.6rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border-radius: 14px;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-head {
  justify-content: flex-start;
  gap: 0.5rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-name {
  font-size: 1.3rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-badge {
  padding: 0.15rem 0.5rem;
  font-size: 0.68rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-tagline {
  grid-column: 1;
  margin-top: 0.2rem;
  font-size: 0.78rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-price {
  grid-column: 2;
  grid-row: 1;
  justify-content: flex-end;
  margin-top: 0;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-value {
  font-size: 2rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-unit {
  display: none;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-after {
  grid-column: 2;
  grid-row: 2;
  margin-top: 0.2rem;
  font-size: 0.72rem;
  text-align: right;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-features {
  grid-column: 1 / -1;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2rem 0.75rem;
  margin-top: 0.55rem;
  padding-top: 0.55rem;
  font-size: 0.75rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-features > li {
  gap: 0.3rem;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-features svg {
  width: 11px;
  height: 11px;
  margin-top: 0.1em;
}

.doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__plan-founding {
  gap: 0.2rem 0.5rem;
  margin-top: 0.9rem;
  font-size: 0.8rem;
}
'''

between("/* ------------------------------------------------------------ target at Seed */", "/* ------------------------------------------------------------ cities */", SEED_PLANS)

s = s.replace(
    ".earlypreview-market__step,\n.earlypreview-market__seed-stage,\n.earlypreview-market__seed-metric,\n.earlypreview-market__plan {\n  opacity: var(--e, 0);",
    ".earlypreview-market__step {\n  opacity: var(--e, 0);",
)
s = s.replace(
    "  .earlypreview-market__step,\n  .earlypreview-market__seed-stage,\n  .earlypreview-market__seed-metric,\n  .earlypreview-market__plan {\n    transform: none;",
    "  .earlypreview-market__step,\n  .earlypreview-market__seed-title,\n  .earlypreview-market__seed-lines > li,\n  .earlypreview-market__plan {\n    transform: none;",
)
old_hover = """  .earlypreview-market__tier.is-hovered .earlypreview-market__tier-value,
  .earlypreview-market__seed-stage.is-hovered .earlypreview-market__seed-num,
  .earlypreview-market__seed-metric.is-hovered .earlypreview-market__seed-metric-value,
  .earlypreview-market__plan.is-hovered .earlypreview-market__plan-value {
    color: var(--m-salmon);
  }

  .earlypreview-market__seed-stage.is-paid.is-hovered .earlypreview-market__seed-num,
  .earlypreview-market__plan.is-advanced.is-hovered .earlypreview-market__plan-value {
    color: var(--m-cream);
  }"""
assert old_hover in s
s = s.replace(old_hover, """  .earlypreview-market__tier.is-hovered .earlypreview-market__tier-value {
    color: var(--m-salmon);
  }

  .earlypreview-market__plan.is-hovered {
    border-color: rgb(252 207 184 / 0.7);
  }""")

between(".doehealth-desk2-page:has(.doephone-mobile-root) .earlypreview-market__seed-funnel,", "/* iPhone go-to-market:", PHONE_SEED)

a = s.index("/* On the iPhone the plans stack:")
b = s.index("\n}\n", s.index(".earlypreview-market__plan-features {", a)) + 3
s = s[:a] + PHONE_PLANS + s[b:]

p.write_text(s)
print("ok")
