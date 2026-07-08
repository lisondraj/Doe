"use client";

import type { ReactNode } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

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
    "Gastroenterology",
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

const SPECIALTY_ICON_KINDS = [
  "care",
  "heart",
  "brain",
  "bone",
  "eye",
  "labs",
  "lungs",
  "surgery",
] as const;

type SpecialtyIconKind = (typeof SPECIALTY_ICON_KINDS)[number];

function SpecialtyIcon({ kind }: { kind: SpecialtyIconKind }) {
  const sw = 1.25;
  const cap = "round" as const;
  const join = "round" as const;
  const stroke = DOE_ORANGE;

  const icons: Record<SpecialtyIconKind, ReactNode> = {
    care: (
      <>
        <path d="M10 4.5v11M4.5 10h11" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} />
        <circle cx="10" cy="10" r="6.25" stroke={stroke} strokeWidth={sw} />
      </>
    ),
    heart: (
      <path
        d="M10 15.5s-5-3.2-5-7.2c0-2.2 1.8-3.5 3.5-3.5 1.2 0 2.2.6 2.8 1.5.6-.9 1.6-1.5 2.8-1.5 1.7 0 3.5 1.3 3.5 3.5 0 4-5 7.2-5 7.2z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin={join}
      />
    ),
    brain: (
      <>
        <path
          d="M8 5.5c-2 0-3.5 1.5-3.5 3.5 0 1.2.6 2.2 1.5 2.8-.4.8-.6 1.7-.6 2.7 0 2.2 1.8 3.5 3.6 3.5h.5c.8 1.2 2.2 2 3.8 2s3-0.8 3.8-2h.5c1.8 0 3.6-1.3 3.6-3.5 0-1-.2-1.9-.6-2.7.9-.6 1.5-1.6 1.5-2.8 0-2-1.5-3.5-3.5-3.5-.9 0-1.7.3-2.3.8-.6-.5-1.4-.8-2.3-.8z"
          stroke={stroke}
          strokeWidth={sw * 0.95}
          strokeLinejoin={join}
        />
      </>
    ),
    bone: (
      <>
        <path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} />
        <circle cx="6.5" cy="6.5" r="2" stroke={stroke} strokeWidth={sw * 0.95} />
        <circle cx="13.5" cy="13.5" r="2" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
    eye: (
      <>
        <path d="M3.5 10s2.8-4.5 6.5-4.5S16.5 10 16.5 10s-2.8 4.5-6.5 4.5S3.5 10 3.5 10z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <circle cx="10" cy="10" r="2" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
    labs: (
      <>
        <path d="M8 2.5h4" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} />
        <path
          d="M7.5 4.5h5l-1.2 11c0 .9-.8 1.5-1.8 1.5h-0.4c-1 0-1.8-.6-1.8-1.5L7.5 4.5z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin={join}
        />
      </>
    ),
    lungs: (
      <>
        <path d="M10 4v12" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
        <path
          d="M10 7.5C7.5 7.5 5.5 9.5 5.5 12s2 4.5 4.5 4.5M10 7.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5"
          stroke={stroke}
          strokeWidth={sw * 0.95}
          strokeLinecap={cap}
        />
      </>
    ),
    surgery: (
      <>
        <path d="M5 15l3-9 4 4 3-4" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} strokeLinejoin={join} />
        <circle cx="15.5" cy="5.5" r="1.8" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-feature-specialties__pill-icon shrink-0">
      {icons[kind]}
    </svg>
  );
}

/** Three-column infinite-scrolling specialty pills — white integration-style tiles. */
export function DoePhoneHomeSpecialtyPillColumns() {
  return (
    <div className="home-feature-specialties__pill-stage relative min-h-0 flex-1 overflow-hidden">
      <div className="home-feature-specialties__fade home-feature-specialties__fade--top" />
      <div className="home-feature-specialties__fade home-feature-specialties__fade--bottom" />
      <div className="home-feature-specialties__columns h-full">
        {SPECIALTY_COLUMNS.map((column, columnIndex) => {
          const sequence = [...column, ...column];
          const directionClass =
            columnIndex === 1
              ? "home-feature-specialties__track--down"
              : "home-feature-specialties__track--up";

          return (
            <div key={`specialty-column-${columnIndex}`} className="home-feature-specialties__column">
              <div className={`home-feature-specialties__track ${directionClass}`}>
                {sequence.map((label, pillIndex) => {
                  const iconKind = SPECIALTY_ICON_KINDS[pillIndex % SPECIALTY_ICON_KINDS.length];

                  return (
                    <div
                      key={`${columnIndex}-${pillIndex}`}
                      className={`home-feature-specialties__pill ${suisseIntl.className}`}
                      style={{ color: INK }}
                    >
                      <SpecialtyIcon kind={iconKind} />
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
