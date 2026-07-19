"use client";

import type { CSSProperties } from "react";

import { inter } from "@/lib/home/fonts";

const ALL_SPECIALTIES = [
  "Primary Care",
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Urgent Care",
  "Emergency Medicine",
  "Geriatrics",
  "Hospital Medicine",
  "Infectious Disease",
  "Nephrology",
  "Pulmonology",
  "Rheumatology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Hematology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Psychiatry",
  "Radiology",
  "Sleep Medicine",
  "Urology",
  "Obstetrics",
  "Gynecology",
  "Orthopedics",
  "ENT",
  "Pain Medicine",
  "Physical Therapy",
  "Plastic Surgery",
  "Podiatry",
  "Sports Medicine",
  "Surgery",
  "Vascular Care",
  "Behavioral Health",
] as const;

/** Desktop grid — extra labels; trimmed to avoid overflow on the wrap row. */
const DESKTOP_EXTRA_SPECIALTIES = [
  "Anesthesiology",
  "Bariatric Surgery",
  "Critical Care",
  "Gastroenterology",
] as const;

const PHONE_ROW_COUNT = 8;
const PLASTIC_SURGERY_INDEX = ALL_SPECIALTIES.indexOf("Plastic Surgery");
const DESKTOP_GRID_COLS = 4;
/** Former 5th column (right of Ophthalmology column) — chips move to the wrap row. */
const DESKTOP_LEGACY_COLS = 5;
const DESKTOP_OVERFLOW_DROP = new Set([
  "Allergy & Immunology",
  "Genetics",
  "Neonatology",
  "Interventional Radiology",
  "Medical Oncology",
  "Hepatology",
  "Neurosurgery",
]);
const DESKTOP_SPECIALTIES = [
  ...ALL_SPECIALTIES.slice(0, PLASTIC_SURGERY_INDEX),
  ...DESKTOP_EXTRA_SPECIALTIES,
] as const;
const CHIP_TONE_COUNT = 6;

const MARQUEE_DURATIONS = [74, 92, 65, 84, 78, 97, 70, 86, 76, 95] as const;

function buildSpecialtyRows(rowCount: number, labels: readonly string[]): readonly (readonly string[])[] {
  const buckets = Array.from({ length: rowCount }, () => [] as string[]);
  labels.forEach((label, index) => {
    buckets[index % rowCount].push(label);
  });
  return buckets;
}

function buildDesktopSpecialtyRows(
  labels: readonly string[],
  colCount: number,
): readonly (readonly string[])[] {
  const rowCount = Math.ceil(labels.length / colCount);
  const rows = Array.from({ length: rowCount }, () => [] as string[]);
  labels.forEach((label, index) => {
    rows[Math.floor(index / colCount)].push(label);
  });
  return rows;
}

/** Desktop — 4-column grid; former 5th column wraps to a row beneath. */
function buildDesktopSpecialtyLayout(labels: readonly string[]): {
  mainRows: readonly (readonly string[])[];
  overflowRow: readonly string[];
} {
  const mainLabels: string[] = [];
  const overflowLabels: string[] = [];

  labels.forEach((label, index) => {
    if (index % DESKTOP_LEGACY_COLS === DESKTOP_LEGACY_COLS - 1) {
      overflowLabels.push(label);
    } else {
      mainLabels.push(label);
    }
  });

  return {
    mainRows: buildDesktopSpecialtyRows(mainLabels, DESKTOP_GRID_COLS),
    overflowRow: overflowLabels.filter((label) => !DESKTOP_OVERFLOW_DROP.has(label)).slice(0, 4),
  };
}

function SpecialtyChip({
  label,
  rowIndex,
  chipIndex,
}: {
  label: string;
  rowIndex: number;
  chipIndex: number;
}) {
  const toneIndex = (rowIndex + chipIndex) % CHIP_TONE_COUNT;

  return (
    <span
      className={`home-feature-specialties__chip home-feature-specialties__chip--tone-${toneIndex} ${inter.className}`}
    >
      <span className="home-feature-specialties__chip-label">{label}</span>
    </span>
  );
}

/** Infinite horizontal marquee rows — warm editorial chips on beige. */
export function DoePhoneHomeSpecialtyPillColumns({
  variant = "phone",
  freezeMarquee = false,
}: {
  variant?: "phone" | "desktop";
  freezeMarquee?: boolean;
}) {
  const isDesktop = variant === "desktop";
  const staticMarquee = isDesktop || freezeMarquee;
  const desktopLayout = isDesktop ? buildDesktopSpecialtyLayout(DESKTOP_SPECIALTIES) : null;
  const rows = isDesktop
    ? [
        ...(desktopLayout?.mainRows ?? []),
        ...(desktopLayout?.overflowRow.length ? [desktopLayout.overflowRow] : []),
      ]
    : buildSpecialtyRows(PHONE_ROW_COUNT, ALL_SPECIALTIES);
  const rowCount = rows.length;

  return (
    <div
      className="home-feature-specialties__tapestry relative min-h-0 flex-1"
      data-specialty-rows={rowCount}
      data-specialty-cols={isDesktop ? DESKTOP_GRID_COLS : undefined}
    >
      <div className="home-feature-specialties__rows">
        {rows.map((row, rowIndex) => {
          const sequence = staticMarquee ? row : [...row, ...row];
          const reverse = !staticMarquee && rowIndex % 2 === 1;

          return (
            <div key={`specialty-row-${rowIndex}`} className="home-feature-specialties__row">
              <div
                className={`home-feature-specialties__marquee${
                  staticMarquee
                    ? " home-feature-specialties__marquee--static"
                    : reverse
                      ? " home-feature-specialties__marquee--reverse"
                      : ""
                }`}
                style={
                  staticMarquee
                    ? undefined
                    : ({
                        "--specialty-marquee-duration": `${MARQUEE_DURATIONS[rowIndex % MARQUEE_DURATIONS.length]}s`,
                      } as CSSProperties)
                }
              >
                {sequence.map((label, chipIndex) => (
                  <SpecialtyChip
                    key={`${rowIndex}-${chipIndex}-${label}`}
                    label={label}
                    rowIndex={rowIndex}
                    chipIndex={chipIndex}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
