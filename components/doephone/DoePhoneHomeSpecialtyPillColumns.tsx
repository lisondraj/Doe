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

const PHONE_ROW_COUNT = 8;
const DESKTOP_ROW_COUNT = 10;
const CHIP_TONE_COUNT = 6;

const MARQUEE_DURATIONS = [74, 92, 65, 84, 78, 97, 70, 86, 76, 95] as const;

function buildSpecialtyRows(rowCount: number): readonly (readonly string[])[] {
  const buckets = Array.from({ length: rowCount }, () => [] as string[]);
  ALL_SPECIALTIES.forEach((label, index) => {
    buckets[index % rowCount].push(label);
  });
  return buckets;
}

/** Infinite horizontal marquee rows — warm editorial chips on beige. */
export function DoePhoneHomeSpecialtyPillColumns({
  variant = "phone",
}: {
  variant?: "phone" | "desktop";
}) {
  const rowCount = variant === "desktop" ? DESKTOP_ROW_COUNT : PHONE_ROW_COUNT;
  const rows = buildSpecialtyRows(rowCount);

  return (
    <div
      className="home-feature-specialties__tapestry relative min-h-0 flex-1"
      data-specialty-rows={rowCount}
    >
      <div className="home-feature-specialties__rows">
        {rows.map((row, rowIndex) => {
          const sequence = [...row, ...row];
          const reverse = rowIndex % 2 === 1;

          return (
            <div key={`specialty-row-${rowIndex}`} className="home-feature-specialties__row">
              <div
                className={`home-feature-specialties__marquee${
                  reverse ? " home-feature-specialties__marquee--reverse" : ""
                }`}
                style={
                  {
                    "--specialty-marquee-duration": `${MARQUEE_DURATIONS[rowIndex % MARQUEE_DURATIONS.length]}s`,
                  } as CSSProperties
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
