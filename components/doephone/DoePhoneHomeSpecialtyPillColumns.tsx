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

/** Desktop grid — extra labels before Occupational Therapy. */
const DESKTOP_EXTRA_SPECIALTIES = [
  "Allergy & Immunology",
  "Anesthesiology",
  "Bariatric Surgery",
  "Critical Care",
  "Gastroenterology",
  "Genetics",
  "Hepatology",
  "Interventional Radiology",
  "Medical Oncology",
  "Neonatology",
  "Neurosurgery",
] as const;

const PHONE_ROW_COUNT = 8;
const PLASTIC_SURGERY_INDEX = ALL_SPECIALTIES.indexOf("Plastic Surgery");
const DESKTOP_GRID_COLS = 5;
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

/** Desktop — fill fixed-width rows so the tapestry reads as a centered rectangle. */
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

/** Infinite horizontal marquee rows — warm editorial chips on beige. */
export function DoePhoneHomeSpecialtyPillColumns({
  variant = "phone",
}: {
  variant?: "phone" | "desktop";
}) {
  const isDesktop = variant === "desktop";
  const rows = isDesktop
    ? buildDesktopSpecialtyRows(DESKTOP_SPECIALTIES, DESKTOP_GRID_COLS)
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
          const sequence = isDesktop ? row : [...row, ...row];
          const reverse = !isDesktop && rowIndex % 2 === 1;

          return (
            <div key={`specialty-row-${rowIndex}`} className="home-feature-specialties__row">
              <div
                className={`home-feature-specialties__marquee${
                  isDesktop
                    ? " home-feature-specialties__marquee--static"
                    : reverse
                      ? " home-feature-specialties__marquee--reverse"
                      : ""
                }`}
                style={
                  isDesktop
                    ? undefined
                    : ({
                        "--specialty-marquee-duration": `${MARQUEE_DURATIONS[rowIndex % MARQUEE_DURATIONS.length]}s`,
                      } as CSSProperties)
                }
              >
                {sequence.map((label, chipIndex) => {
                  const toneIndex = (rowIndex + chipIndex) % CHIP_TONE_COUNT;

                  return (
                    <span
                      key={`${rowIndex}-${chipIndex}-${label}`}
                      className={`home-feature-specialties__chip home-feature-specialties__chip--tone-${toneIndex} ${inter.className}`}
                    >
                      <span className="home-feature-specialties__chip-label">{label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
