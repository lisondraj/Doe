"use client";

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

const SPECIALTY_PILL_FILLS = [
  { bg: "#F5EBD0", border: "#E8DCC8" },
  { bg: "#F2E0D6", border: "#E5D0C6" },
  { bg: "#F0E4CE", border: "#E2D4BE" },
  { bg: "#EDD8CC", border: "#DFC8BC" },
  { bg: "#F8ECD8", border: "#E8DCC4" },
  { bg: "#EDD4C8", border: "#DFC4B8" },
  { bg: "#F0E0D0", border: "#E2D0C0" },
] as const;

function specialtyPillStyle(index: number) {
  const fill = SPECIALTY_PILL_FILLS[index % SPECIALTY_PILL_FILLS.length];
  return {
    backgroundColor: fill.bg,
    borderColor: fill.border,
    color: "#1A1208",
  };
}

/** Three-column infinite-scrolling specialty pills — hero orb colors. */
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
                {sequence.map((label, pillIndex) => (
                  <div
                    key={`${label}-${pillIndex}`}
                    className="home-feature-specialties__pill"
                    style={specialtyPillStyle(columnIndex + pillIndex)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
