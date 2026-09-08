"use client";

/** Paper artboard: Westfield EMR - Notes (17V-0) */

type NoteRow = {
  date: string;
  type: string;
  author: string;
};

const CLOSED_NOTE_ROWS: NoteRow[] = [
  { date: "18 Aug", type: "Progress", author: "Roberts" },
  { date: "3 Jul", type: "Phone", author: "Patel" },
  { date: "12 May", type: "Progress", author: "Roberts" },
  { date: "2 Apr", type: "Referral", author: "Endo" },
  { date: "15 Jan", type: "Progress", author: "Roberts" },
  { date: "8 Nov", type: "Phone", author: "Patel" },
  { date: "22 Sep", type: "Annual", author: "Roberts" },
  { date: "6 Aug", type: "Progress", author: "Roberts" },
  { date: "14 Jun", type: "Referral", author: "Endo" },
  { date: "3 May", type: "Phone", author: "Patel" },
  { date: "19 Mar", type: "Progress", author: "Roberts" },
  { date: "7 Feb", type: "Progress", author: "Roberts" },
  { date: "11 Dec", type: "Phone", author: "Patel" },
  { date: "28 Oct", type: "Annual", author: "Roberts" },
  { date: "9 Sep", type: "Progress", author: "Roberts" },
  { date: "16 Jul", type: "Referral", author: "Endo" },
  { date: "4 Jun", type: "Progress", author: "Roberts" },
  { date: "21 Apr", type: "Phone", author: "Patel" },
  { date: "8 Mar", type: "Progress", author: "Roberts" },
  { date: "19 Jan", type: "Progress", author: "Roberts" },
  { date: "2 Dec", type: "Phone", author: "Patel" },
  { date: "14 Oct", type: "Referral", author: "Endo" },
  { date: "27 Aug", type: "Progress", author: "Roberts" },
  { date: "11 Jul", type: "Annual", author: "Roberts" },
  { date: "29 May", type: "Phone", author: "Patel" },
  { date: "6 Apr", type: "Progress", author: "Roberts" },
  { date: "18 Feb", type: "Progress", author: "Roberts" },
  { date: "9 Jan", type: "Referral", author: "Endo" },
  { date: "3 Nov", type: "Phone", author: "Patel" },
  { date: "16 Sep", type: "Progress", author: "Roberts" },
  { date: "1 Aug", type: "Progress", author: "Roberts" },
  { date: "20 Jun", type: "Annual", author: "Roberts" },
  { date: "5 May", type: "Phone", author: "Patel" },
  { date: "22 Mar", type: "Progress", author: "Roberts" },
  { date: "10 Feb", type: "Referral", author: "Endo" },
];

function NoteRowItem({
  row,
  lead = false,
}: {
  row: NoteRow;
  lead?: boolean;
}) {
  return (
    <div
      className={`landing-emr-notes-row flex items-center w-full h-11 shrink-0 pr-3.5 pl-2.5 rounded-[10px] gap-2.5 bg-[#FFFFFF2E]${
        lead ? " landing-emr-notes-row--lead" : ""
      }`}
    >
      <div
        className={`landing-emr-notes-row__indicator w-[3px] h-[18px] shrink-0 ${
          lead ? "rounded-[999px] bg-white" : "rounded-xs"
        }`}
      />
      <div className="landing-emr-notes-row__date w-[72px] shrink-0 font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFC4] text-[15px] leading-[18px]">
        {row.date}
      </div>
      <div className="w-0 grow font-['Inter-Regular','Inter',system-ui,sans-serif] text-white text-[15px] leading-[18px]">
        {row.type}
      </div>
      <div className="landing-emr-notes-row__author shrink-0 font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB8] text-[13px] leading-[16px]">
        {row.author}
      </div>
    </div>
  );
}

function OpenedProgressNote() {
  return (
    <div className="landing-emr-notes-nested-note flex flex-col w-full min-h-0 h-full [border-image-source:none] [border-image-slice:100%] [border-image-width:1] [border-image-outset:0] [border-image-repeat:stretch] rounded-2xl pt-8 pb-5 px-6 bg-white">
      <div className="flex w-full min-h-0 gap-[43px] grow">
        <div className="landing-emr-glass-blue flex flex-col w-0 grow h-full min-h-0 justify-between p-[22px] rounded-2xl overflow-clip gap-7 bg-origin-border">
          <div className="flex flex-col w-full shrink-0 gap-3">
            <div className="flex flex-col w-full shrink-0 gap-0.5">
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-[13px] leading-[16px]">
                Dr. Claire Roberts
              </div>
              <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB8] text-[13px] leading-[16px]">
                5 Sep, Diabetes Follow-up
              </div>
            </div>
            <div className="tracking-[-0.04em] w-[287px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-white text-[32px] leading-[36px]">
              Today&apos;s diabetes follow-up showed A1c at 7.4 and potassium at 5.8. Lisinopril was held and we reviewed the glucometer log in the room.
            </div>
            <div className="flex w-full shrink-0 pt-1 gap-6">
              <div className="flex flex-col w-0 grow gap-0.5">
                <div className="tracking-[-0.03em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[28px] leading-[32px]">
                  5.8
                </div>
                <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB8] text-[13px] leading-[16px]">
                  Potassium
                </div>
              </div>
              <div className="flex flex-col w-0 grow gap-0.5">
                <div className="tracking-[-0.03em] font-['Inter-Regular_SemiBold','Inter',system-ui,sans-serif] font-semibold text-white text-[28px] leading-[32px]">
                  7.4
                </div>
                <div className="font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFB8] text-[13px] leading-[16px]">
                  A1c
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full min-h-0 gap-2.5">
            <div className="flex items-start w-full shrink-0 gap-2.5">
              <div className="w-4 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-[15px] leading-[22px]">
                1
              </div>
              <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[15px] leading-[22px]">
                Reviewed glucometer log together in the room
              </div>
            </div>
            <div className="flex items-start w-full shrink-0 gap-2.5">
              <div className="w-4 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-[15px] leading-[22px]">
                2
              </div>
              <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[15px] leading-[22px]">
                Continue metformin 1000 mg twice daily
              </div>
            </div>
            <div className="flex items-start w-full shrink-0 gap-2.5">
              <div className="w-4 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-[15px] leading-[22px]">
                3
              </div>
              <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[15px] leading-[22px]">
                Hold lisinopril until potassium improves
              </div>
            </div>
            <div className="flex items-start w-full shrink-0 pt-1 gap-2.5">
              <div className="w-4 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#FFFFFFB8] text-[15px] leading-[22px]">
                4
              </div>
              <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-white text-[15px] leading-[22px]">
                Recheck potassium Monday and repeat A1c in 3 months
              </div>
            </div>
            <div className="pt-3.5 font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFFFFA3] text-[13px] leading-[18px]">
              Signed 8:47 AM
            </div>
          </div>
        </div>
        <div className="flex w-0 min-h-0 flex-col grow-[2] overflow-clip gap-[18px] pt-12 relative">
          <div className="flex w-full pb-6 gap-4 h-fit">
            <div className="w-7 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[28px] leading-[32px]">
              S
            </div>
            <div className="flex flex-col w-0 grow gap-2">
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[22px]">
                The patient reports evening glucose readings between 180 and 220 for the past two weeks, with readings worse after dinner. She missed her evening metformin dose twice last week. She denies chest pain, palpitations, orthopnea, cough, and leg swelling. Numbness in both feet is unchanged since July.
              </div>
            </div>
          </div>
          <div className="flex w-full shrink-0 pt-5 pb-6 gap-4 border-t border-t-solid border-t-[#D1D1D6]">
            <div className="w-7 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[28px] leading-[32px]">
              O
            </div>
            <div className="flex flex-col w-0 grow gap-3">
              <div className="flex w-full gap-5">
                <div className="flex flex-col w-0 grow gap-0.5">
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[22px] leading-[26px]">
                    138/84
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[13px] leading-[16px]">
                    BP
                  </div>
                </div>
                <div className="flex flex-col w-0 grow gap-0.5">
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[22px] leading-[26px]">
                    5.8
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[13px] leading-[16px]">
                    K High
                  </div>
                </div>
                <div className="flex flex-col w-0 grow gap-0.5">
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[22px] leading-[26px]">
                    7.4
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[13px] leading-[16px]">
                    A1c
                  </div>
                </div>
                <div className="flex flex-col w-0 grow gap-0.5">
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[22px] leading-[26px]">
                    52
                  </div>
                  <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-[13px] leading-[16px]">
                    eGFR
                  </div>
                </div>
              </div>
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[15px] leading-[20px]">
                Heart rate is 76, temperature is 98.2, and weight is 182 lb. Fingerstick glucose is 142. Foot exam shows diminished sensation bilaterally. The heart is regular, lungs are clear, and ankles are dry without ulceration.
              </div>
            </div>
          </div>
          <div className="flex w-full shrink-0 pt-5 pb-6 gap-4 border-t border-t-solid border-t-[#D1D1D6]">
            <div className="w-7 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[28px] leading-[32px]">
              A
            </div>
            <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[22px]">
              Type 2 diabetes mellitus with A1c above goal at 7.4 on metformin monotherapy. Hyperkalemia is likely related to lisinopril in the setting of CKD stage 3a, which appears stable. No foot ulcer was identified today.
            </div>
          </div>
          <div className="flex w-full grow pt-5 overflow-clip gap-4 h-56 border-t border-t-solid border-t-[#D1D1D6]">
            <div className="w-7 shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[28px] leading-[32px]">
              P
            </div>
            <div className="flex flex-col w-0 grow overflow-clip gap-2.5">
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[15px] leading-[22px]">
                1. Review the glucometer log with the patient in the room.
              </div>
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[15px] leading-[22px]">
                2. Continue metformin 1000 mg twice daily.
              </div>
              <div className="opacity-[0.38] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[22px]">
                3. Hold lisinopril until potassium improves.
              </div>
              <div className="opacity-[0.16] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[22px]">
                4. Recheck potassium on Monday and repeat A1c in three months.
              </div>
              <div className="opacity-[0.07] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[22px]">
                5. Obtain a home blood pressure log for the next two weeks.
              </div>
            </div>
          </div>
          <div
            className="absolute left-0 -bottom-[54px] w-full h-[162px]"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 78%, #ffffff 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function WestfieldEmrNotesPanel() {
  return (
    <div className="landing-emr-notes-panel landing-emr-glass-blue [font-synthesis:none] wrap-anywhere flex flex-col h-full min-h-0 w-full rounded-[24px] pt-[22px] pb-[18px] px-[20px] overflow-clip antialiased bg-origin-border">
      <div className="landing-emr-notes-tray flex flex-col w-full grow min-h-0 gap-[6px] overflow-clip rounded-2xl p-[6px] [box-shadow:#FFFFFF29_0px_1px_0px_inset] bg-[#FFFFFF1F] border border-solid border-[#FFFFFF38]">
        <div className="landing-emr-notes-opened flex flex-col w-full min-h-0">
          <NoteRowItem row={{ date: "5 Sep", type: "Progress", author: "Today" }} lead />
          <div className="landing-emr-notes-nested">
            <OpenedProgressNote />
          </div>
        </div>
        {CLOSED_NOTE_ROWS.map((row) => (
          <NoteRowItem key={`${row.date}-${row.type}-${row.author}`} row={row} />
        ))}
      </div>
    </div>
  );
}
