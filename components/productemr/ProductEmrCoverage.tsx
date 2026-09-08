"use client";

/** Paper: Westfield EMR - Coverage stage (statement + Aetna poster) */

const LEDGER = [
  { date: "5 Sep", type: "This visit", amount: "148", status: "Unsent", current: true },
  { date: "18 Aug", type: "Follow-up", amount: "142", status: "Paid" },
  { date: "3 Jul", type: "Phone", amount: "48", status: "Paid" },
  { date: "12 May", type: "Office", amount: "142", status: "Paid" },
  { date: "2 Apr", type: "Imaging", amount: "86", status: "Paid" },
  { date: "10 Mar", type: "Labs", amount: "64", status: "Paid" },
  { date: "15 Jan", type: "Annual", amount: "165", status: "Paid" },
];

export function ProductEmrCoverage() {
  return (
    <div className="flex w-full h-full min-h-0 rounded-[20px] overflow-clip bg-white">
      <div className="flex flex-col w-0 grow h-full min-w-0 py-6 px-10 gap-4 overflow-auto">
        <div
          className="flex flex-col w-full shrink-0 rounded-[18px] gap-2 p-6"
          style={{
            backgroundImage:
              "linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(71.4% -0.038 -0.138) 100%)",
          }}
        >
          <div className="[letter-spacing:-0.05em] font-medium text-white text-7xl leading-[68px]">$148</div>
          <div className="font-medium text-white text-lg">8:20 | Diabetes Follow-up</div>
        </div>

        <div
          className="flex flex-col w-full shrink-0 rounded-[18px] pt-5 pb-4 px-6"
          style={{
            backgroundImage:
              "linear-gradient(in oklab 180deg, oklab(91.9% -0.009 -0.032) 0%, oklab(100% 0 0) 100%)",
          }}
        >
          <div className="font-medium text-[#1C1C1E] text-[22px] leading-[26px] pb-2.5">Review</div>
          <div className="flex w-full shrink-0 gap-6 pt-2 pb-4">
            {[
              ["Sign", "Note still open"],
              ["Hold", "Libre 3 criteria"],
              ["Clear", "Potassium Monday"],
            ].map(([title, meta]) => (
              <div key={title} className="flex flex-col w-0 grow gap-0.5">
                <div className="font-medium text-[#1C1C1E] text-[22px] leading-[26px]">{title}</div>
                <div className="font-medium text-[#636366] text-sm">{meta}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center w-full h-10 border-b border-[#C5D9F2]">
            <div className="w-0 grow font-medium text-[#1C1C1E] text-base">Jardiance 10</div>
            <div className="w-[72px] shrink-0 font-medium text-[#1C1C1E] text-base">Ok</div>
          </div>
          <div className="flex items-center w-full h-10">
            <div className="w-0 grow font-medium text-[#1C1C1E] text-base">This claim</div>
            <div className="w-[72px] shrink-0 font-medium text-[#1D4ED8] text-base">Send</div>
          </div>
        </div>

        <div className="flex flex-col w-full grow min-h-0">
          {LEDGER.map((row) => (
            <div
              key={row.date}
              className="flex items-center w-full min-h-[82px] gap-4 border-b border-[#E5E5EA]"
            >
              <div className={`w-[72px] shrink-0 text-[15px] ${row.current ? "text-[#1C1C1E] font-medium" : "text-[#8E8E93]"}`}>
                {row.date}
              </div>
              <div className={`w-0 grow text-[15px] ${row.current ? "text-[#1C1C1E] font-medium" : "text-[#1C1C1E]"}`}>
                {row.type}
              </div>
              <div className="w-14 shrink-0 text-right text-[#8E8E93] text-[15px]">{row.amount}</div>
              <div className="w-[72px] shrink-0 text-right text-[#8E8E93] text-[15px]">{row.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col w-[420px] shrink-0 h-full overflow-clip px-8 relative"
        style={{
          backgroundImage:
            "linear-gradient(in oklab 180deg, oklab(48.8% -0.021 -0.216) 0%, oklab(71.4% -0.038 -0.138) 100%)",
        }}
      >
        <div className="flex items-center justify-between pt-7">
          <div className="tracking-[-0.03em] font-medium text-white text-[27px] leading-8">Aetna PPO</div>
          <div className="flex items-center gap-2">
            <div className="size-[9px] rounded-[5px] bg-white" />
            <div className="font-medium text-white text-[15px]">Active</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-[278px] h-[278px] mx-auto mt-12 rounded-full bg-white">
          <div className="tracking-[-0.07em] font-medium text-[#1D4ED8] text-[92px] leading-[88px]">$0</div>
          <div className="font-medium text-[#1D4ED8] text-lg">patient balance</div>
        </div>
        <div className="flex items-center justify-center w-full mt-10 gap-0">
          <div className="flex flex-col items-center justify-center w-[126px] h-[126px] rounded-full">
            <div className="tracking-[-0.04em] font-medium text-white text-[31px]">$30</div>
            <div className="font-medium text-white text-sm">copay</div>
          </div>
          <div className="flex flex-col items-center justify-center w-[142px] h-[142px] rounded-full bg-white -ml-2.5">
            <div className="tracking-[-0.04em] font-medium text-[#1D4ED8] text-[33px]">$148</div>
            <div className="font-medium text-[#1D4ED8] text-sm">visit</div>
          </div>
          <div className="flex flex-col items-center justify-center w-[118px] h-[118px] rounded-full -ml-5">
            <div className="tracking-[-0.04em] font-medium text-white text-[27px]">$647</div>
            <div className="font-medium text-white text-sm">year</div>
          </div>
        </div>
        <div className="flex w-full mt-10 gap-3.5">
          <div className="flex flex-col justify-center w-0 grow h-[158px] pl-[18px] overflow-hidden relative">
            <div className="tracking-[-0.04em] font-medium text-white text-[38px] leading-10">420</div>
            <div className="font-medium text-white text-[17px]">of 850</div>
            <div className="absolute -right-2 -bottom-6 font-medium text-[#FFFFFF24] text-[118px] leading-none">D</div>
          </div>
          <div className="flex flex-col justify-center w-0 grow h-[158px] pl-[18px] overflow-hidden relative bg-white">
            <div className="tracking-[-0.04em] font-medium text-[#1D4ED8] text-[38px] leading-10">180</div>
            <div className="font-medium text-[#1D4ED8] text-[17px]">of 4,500</div>
            <div className="absolute -right-3 -bottom-6 font-medium text-[#1D4ED81A] text-[118px] leading-none">O</div>
          </div>
        </div>
        <div className="flex items-start justify-between w-full mt-10 pb-8">
          {[
            { glyph: "H", label: "Libre 3" },
            { glyph: "✓", label: "Jardiance", white: true },
            { glyph: "8 SEP", label: "Lab only", date: true },
          ].map(({ glyph, label, white, date }) => (
            <div key={label} className="flex flex-col items-center w-[94px] gap-[7px] shrink-0">
              <div
                className={`flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full ${white ? "bg-white text-[#1D4ED8]" : ""}`}
              >
                {date ? (
                  <>
                    <div className="font-medium text-white text-[19px]">{glyph.split(" ")[0]}</div>
                    <div className="font-medium text-white text-xs">SEP</div>
                  </>
                ) : (
                  <div className={`font-medium text-[22px] ${white ? "text-[#1D4ED8]" : "text-white"}`}>{glyph}</div>
                )}
              </div>
              <div className="font-medium text-white text-sm text-center">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
