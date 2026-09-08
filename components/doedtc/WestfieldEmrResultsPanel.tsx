"use client";

import { Fragment } from "react";

/** Paper artboard: Westfield EMR — Results (1L7-0), table node 2SF-0 */

const LAB_ROWS = [
  { label: "Potassium", unit: "mEq/L", key: "potassium" as const },
  { label: "A1c", unit: "%", key: "a1c" as const },
  { label: "Glucose", unit: "mg/dL", key: "glucose" as const },
  { label: "Creatinine", unit: "mg/dL", key: "creatinine" as const },
  { label: "eGFR", unit: "mL/min", key: "egfr" as const },
  { label: "LDL", unit: "mg/dL", key: "ldl" as const },
] as const;

const IMAGING_ROWS = [
  { label: "Chest X-ray", key: "chestXray" as const },
  { label: "Foot X-ray", key: "footXray" as const },
] as const;

const MICRO_ROWS = [
  { label: "Urine culture", key: "urineCulture" as const },
  { label: "Wound culture", key: "woundCulture" as const },
] as const;

type ResultsColumn = {
  date: string;
  potassium?: string;
  a1c?: string;
  glucose?: string;
  creatinine?: string;
  egfr?: string;
  ldl?: string;
  chestXray?: boolean;
  footXray?: boolean;
  urineCulture?: boolean;
  woundCulture?: boolean;
};

const DATES: ResultsColumn[] = [
  { date: "18 Feb", potassium: "4.9", a1c: "6.9", glucose: "122", creatinine: "1.0", egfr: "57", ldl: "108" },
  { date: "10 Mar", potassium: "5.0", a1c: "7.0", glucose: "125", creatinine: "1.1", egfr: "56", ldl: "106" },
  { date: "2 Apr", potassium: "5.1", a1c: "7.0", glucose: "128", creatinine: "1.1", egfr: "55", ldl: "104", chestXray: true },
  { date: "12 May", potassium: "5.3", a1c: "7.1", glucose: "134", creatinine: "1.1", egfr: "54", ldl: "102", urineCulture: true },
  { date: "3 Jul", potassium: "5.4", glucose: "138", creatinine: "1.2", egfr: "53" },
  { date: "18 Aug", potassium: "5.6", a1c: "7.2", glucose: "140", creatinine: "1.2", egfr: "53", ldl: "100", footXray: true, woundCulture: true },
  { date: "5 Sep", potassium: "5.8", a1c: "7.4", glucose: "142", creatinine: "1.2", egfr: "52", ldl: "98" },
];

export function WestfieldEmrResultsPanel({ onA1cClick }: { onA1cClick?: () => void }) {
  return (
    <div className="landing-emr-results-panel landing-emr-raised [font-synthesis:none] wrap-anywhere flex flex-col h-full min-h-0 rounded-[20px] p-[28px] overflow-clip antialiased">
      <div
        className="landing-emr-results-grid w-full grow min-h-0 h-full"
        style={{
          gridTemplateColumns: `220px repeat(${DATES.length}, minmax(0, 1fr))`,
          gridTemplateRows: "52px 44px repeat(6, minmax(0, 1fr)) 44px repeat(2, minmax(0, 1fr)) 44px repeat(2, minmax(0, 1fr))",
        }}
      >
        <div className="border-b border-b-solid border-b-[#E5E5EA]" />
        {DATES.map((column) => (
          <div
            key={`${column.date}-date`}
            className="flex justify-center items-center border-l border-l-solid border-l-[#E5E5EA] border-b border-b-solid border-b-[#E5E5EA]"
          >
            <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#8E8E93] text-[13px] leading-[16px]">
              {column.date}
            </div>
          </div>
        ))}

        <ResultsSectionCell>Labs</ResultsSectionCell>
        {DATES.map((column) => (
          <ResultsDateSectionCell key={`${column.date}-labs-head`} />
        ))}

        {LAB_ROWS.map((row) => (
          <Fragment key={row.key}>
            <ResultsNameCell label={row.label} unit={row.unit} />
            {DATES.map((column) => (
              <ResultsValueCell
                key={`${column.date}-${row.key}`}
                value={column[row.key]}
                clickable={row.key === "a1c" && column.a1c === "7.4"}
                onClick={row.key === "a1c" && column.a1c === "7.4" ? onA1cClick : undefined}
              />
            ))}
          </Fragment>
        ))}

        <ResultsSectionCell>Imaging</ResultsSectionCell>
        {DATES.map((column) => (
          <ResultsDateSectionCell key={`${column.date}-imaging-head`} />
        ))}

        {IMAGING_ROWS.map((row) => (
          <Fragment key={row.key}>
            <ResultsNameSingleCell label={row.label} />
            {DATES.map((column) => (
              <ResultsMarkerCell key={`${column.date}-${row.key}`} active={column[row.key]} />
            ))}
          </Fragment>
        ))}

        <ResultsSectionCell>Microbiology</ResultsSectionCell>
        {DATES.map((column) => (
          <ResultsDateSectionCell key={`${column.date}-micro-head`} />
        ))}

        {MICRO_ROWS.map((row) => (
          <Fragment key={row.key}>
            <ResultsNameSingleCell label={row.label} />
            {DATES.map((column) => (
              <ResultsMarkerCell key={`${column.date}-${row.key}`} active={column[row.key]} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ResultsSectionCell({ children }: { children: string }) {
  return (
    <div className="flex items-center pl-[4px] bg-[#E8F1FC] border-t-2 border-t-solid border-t-[#C5D4EA] border-b border-b-solid border-b-[#E5E5EA]">
      <div className="font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-[#1C1C1E] text-sm leading-[18px]">
        {children}
      </div>
    </div>
  );
}

function ResultsDateSectionCell() {
  return (
    <div className="bg-white border-t-2 border-t-solid border-t-[#C5D4EA] border-l border-l-solid border-l-[#E5E5EA] border-b border-b-solid border-b-[#E5E5EA]" />
  );
}

function ResultsNameCell({ label, unit }: { label: string; unit: string }) {
  return (
    <div className="flex flex-col justify-center gap-[2px] pr-[16px] pl-[4px] border-b border-b-solid border-b-[#E5E5EA]">
      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[15px] leading-[20px]">
        {label}
      </div>
      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#8E8E93] text-[11px] leading-[14px]">
        {unit}
      </div>
    </div>
  );
}

function ResultsNameSingleCell({ label }: { label: string }) {
  return (
    <div className="flex items-center pr-[16px] pl-[4px] border-b border-b-solid border-b-[#E5E5EA]">
      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[15px] leading-[20px]">
        {label}
      </div>
    </div>
  );
}

function ResultsValueCell({
  value,
  clickable,
  onClick,
}: {
  value?: string;
  clickable?: boolean;
  onClick?: () => void;
}) {
  if (!value) {
    return <div className="border-l border-l-solid border-l-[#E5E5EA] border-b border-b-solid border-b-[#E5E5EA]" />;
  }

  const className = `flex justify-center items-center border-l border-l-solid border-l-[#E5E5EA] border-b border-b-solid border-b-[#E5E5EA]${clickable ? " productemr-a1c-hit" : ""}`;
  const valueEl = (
    <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-sm leading-[18px]">
      {value}
    </div>
  );

  if (clickable && onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {valueEl}
      </button>
    );
  }

  return <div className={className}>{valueEl}</div>;
}

function ResultsMarkerCell({ active }: { active?: boolean }) {
  return (
    <div className="flex justify-center items-center border-l border-l-solid border-l-[#E5E5EA] border-b border-b-solid border-b-[#E5E5EA]">
      {active ? <div className="shrink-0 rounded-[999px] bg-[#2563EB] size-[14px]" /> : null}
    </div>
  );
}
