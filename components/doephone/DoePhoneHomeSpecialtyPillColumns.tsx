"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK } = CAROUSEL_MENU_UI;

const SPECIALTY_COLUMNS = [
  [
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
  ],
  [
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
  ],
  [
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
  ],
] as const;

const ALL_SPECIALTIES = SPECIALTY_COLUMNS.flat();

const DESKTOP_SPECIALTY_COLUMN_COUNT = 4;
const PILL_HUE_COUNT = 6;

function buildSpecialtyColumns(columnCount: number): readonly (readonly string[])[] {
  const buckets = Array.from({ length: columnCount }, () => [] as string[]);
  ALL_SPECIALTIES.forEach((label, index) => {
    buckets[index % columnCount].push(label);
  });
  return buckets;
}

/** Infinite-scrolling specialty pills — three columns on phone, four on desktop. */
export function DoePhoneHomeSpecialtyPillColumns({
  variant = "phone",
}: {
  variant?: "phone" | "desktop";
}) {
  const columns =
    variant === "desktop"
      ? buildSpecialtyColumns(DESKTOP_SPECIALTY_COLUMN_COUNT)
      : SPECIALTY_COLUMNS;

  return (
    <div className="home-feature-specialties__pill-stage relative min-h-0 flex-1 overflow-hidden">
      <div className="home-feature-specialties__fade home-feature-specialties__fade--top" />
      <div className="home-feature-specialties__fade home-feature-specialties__fade--bottom" />
      <div className="home-feature-specialties__columns h-full">
        {columns.map((column, columnIndex) => {
          const sequence = [...column, ...column];
          const directionClass =
            columnIndex % 2 === 1
              ? "home-feature-specialties__track--down"
              : "home-feature-specialties__track--up";

          return (
            <div key={`specialty-column-${columnIndex}`} className="home-feature-specialties__column">
              <div className={`home-feature-specialties__track ${directionClass}`}>
                {sequence.map((label, pillIndex) => {
                  const hueIndex = (columnIndex + pillIndex) % PILL_HUE_COUNT;

                  return (
                    <div
                      key={`${columnIndex}-${pillIndex}`}
                      className={`home-feature-specialties__pill home-feature-specialties__pill--hue-${hueIndex} ${suisseIntl.className}`}
                      style={{ color: INK }}
                    >
                      <span className="home-feature-specialties__pill-label">{label}</span>
                    </div>
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
