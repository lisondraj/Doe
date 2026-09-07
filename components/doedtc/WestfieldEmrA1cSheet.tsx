"use client";

/** Paper artboard: Westfield EMR — A1c (38K-0), sheet node 3GN-0 */
export function WestfieldEmrA1cSheet() {
  return (
    <div
      className="[font-synthesis:none] wrap-anywhere flex flex-col w-[620px] h-[1032px] rounded-3xl overflow-clip bg-white antialiased text-xs leading-[16px]"
      style={{
        backgroundImage:
          "linear-gradient(in oklab 225deg, oklab(91.9% -0.009 -0.032) 0%, oklab(96.6% -0.002 -0.016) 52%, oklab(100% 0 0) 100%)",
      }}
    >
      <div className="flex items-center w-full shrink-0 pr-[20px] pl-[28px] py-[14px] border-b border-b-solid border-b-[#E5E5EA]">
        <div className="flex flex-col w-0 grow gap-[3px]">
          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-lg leading-[22px]">
            A1c
          </div>
        </div>
        <div className="shrink-0 pr-[14px]">
          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1D4ED8] text-base leading-[20px]">
            Graph
          </div>
        </div>
        <div className="shrink-0 pr-[14px]">
          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1D4ED8] text-base leading-[20px]">
            Note
          </div>
        </div>
        <div className="shrink-0 flex justify-center items-center font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] size-[28px] text-xl leading-[20px]">
          ×
        </div>
      </div>

      <div className="flex items-end w-full shrink-0 pt-[20px] pr-[28px] pl-[39px] gap-[12px] justify-between">
        <div className="tracking-[-0.055em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[88px] leading-[80px]">
          7.4
        </div>
        <div className="pb-[6px]">
          <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[22px] leading-[28px]">
            %
          </div>
        </div>
        <div className="flex w-0 grow justify-end pb-[4px] gap-[24px]">
          <div className="flex flex-col shrink-0 items-end gap-[2px]">
            <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
              +0.5
            </div>
            <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              since Feb
            </div>
          </div>
          <div className="flex flex-col shrink-0 items-end gap-[2px]">
            <div className="tracking-[-0.03em] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[26px] leading-[30px]">
              166
            </div>
            <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              eAG
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 pt-[8px] pr-[28px] pl-[39px] gap-[10px] items-baseline">
        <div className="shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1D4ED8] text-[22px] leading-[28px]">
          Above target
        </div>
      </div>

      <div className="flex w-full min-h-0 pt-[8px] gap-[20px] flex-col px-[28px] grow">
        <div className="flex flex-col w-full min-h-0 pt-[10px] overflow-clip">
          <div className="flex items-center w-full shrink-0 pb-[10px] border-b border-b-solid border-b-[#E5E5EA]">
            <div className="w-[120px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              Date
            </div>
            <div className="w-[80px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              A1c
            </div>
            <div className="w-[100px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              Change
            </div>
            <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
              Note
            </div>
          </div>
          <HistoryRow date="5 Sep" value="7.4" change="+0.2" note="Today" highlighted />
          <HistoryRow date="18 Aug" value="7.2" change="+0.1" note="Follow-up" />
          <HistoryRow date="12 May" value="7.1" change="+0.1" note="Office" />
          <HistoryRow date="2 Apr" value="7.0" change="0.0" note="Office" />
          <HistoryRow date="10 Mar" value="7.0" change="+0.1" note="Labs" />
          <HistoryRow date="18 Feb" value="6.9" change="0.0" note="Baseline" />
          <div className="w-full shrink-0 pb-[8px]">
            <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[15px] leading-[20px]">
              History
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full min-h-0 overflow-clip shrink-0">
          <div className="flex flex-col w-full min-h-0 pt-[12px] pb-[10px] rounded-[14px] shrink-0 px-[14px] bg-[#E4EEFB]">
            <div className="pb-[8px]">
              <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-[15px] leading-[20px]">
                Same draw
              </div>
            </div>
            <SameDrawRow label="Potassium" value="5.8" status="High" statusTone="alert" />
            <SameDrawRow label="Glucose" value="142" status="High" statusTone="alert" />
            <SameDrawRow label="Creatinine" value="1.2" status="High" statusTone="alert" />
            <SameDrawRow label="eGFR" value="52" status="Low" statusTone="alert" />
            <SameDrawRow label="LDL" value="98" status="Goal" statusTone="muted" />
            <SameDrawRow label="BP" value="138/84" status="Office" statusTone="muted" />
            <SameDrawRow label="Home" value="High" valueTone="alert" status="Libre 3" statusTone="muted" />
            <SameDrawRow label="Meds" value="Metformin Jardiance" wideValue />
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 pt-[18px] pr-[28px] pl-[39px] gap-[20px] border-t border-t-solid border-t-[#E5E5EA]">
        <FactCell value="6.5" label="Goal" />
        <FactCell value="4.0–5.6" label="Range" />
        <FactCell value="HPLC" label="Method" />
      </div>
      <div className="flex w-full shrink-0 pr-[28px] pl-[37px] gap-[20px] py-[10px]">
        <FactCell value="Roberts" label="Ordered" />
        <FactCell value="08:04" label="Drawn" />
        <FactCell value="Dec" label="Next" />
      </div>
      <div className="flex w-full shrink-0 pr-[28px] pb-[24px] pl-[38px] gap-[20px]">
        <FactCell value="A48219" label="Accession" />
        <FactCell value="Venous" label="Specimen" />
        <FactCell value="Fasting" label="Prep" />
      </div>
    </div>
  );
}

function HistoryRow({
  date,
  value,
  change,
  note,
  highlighted = false,
}: {
  date: string;
  value: string;
  change: string;
  note: string;
  highlighted?: boolean;
}) {
  const valueClass = highlighted ? "text-[#1C1C1E]" : "text-[#636366]";
  const changeClass = highlighted && change.startsWith("+") ? "text-[#1D4ED8]" : valueClass;

  return (
    <div
      className={`flex items-center w-full h-[40px] min-h-[40px] shrink-0${highlighted ? " bg-[#D6E6FB]" : " border-b border-b-solid border-b-[#E5E5EA]"}`}
    >
      <div className={`w-[120px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${valueClass}`}>
        {date}
      </div>
      <div className={`w-[80px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${valueClass}`}>
        {value}
      </div>
      <div className={`w-[100px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${changeClass}`}>
        {change}
      </div>
      <div className={`w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${valueClass}`}>
        {note}
      </div>
    </div>
  );
}

function SameDrawRow({
  label,
  value,
  status,
  statusTone = "muted",
  valueTone = "default",
  wideValue = false,
}: {
  label: string;
  value: string;
  status?: string;
  statusTone?: "alert" | "muted";
  valueTone?: "default" | "alert";
  wideValue?: boolean;
}) {
  const statusClass =
    statusTone === "alert"
      ? "text-[#1D4ED8]"
      : "text-[#636366]";
  const valueClass = valueTone === "alert" ? "text-[#1D4ED8]" : "text-[#1C1C1E]";

  return (
    <div className="flex items-center w-full min-h-[40px] h-[40px] shrink-0 border-b border-b-solid border-b-[#C5D9F2] last:border-b-0">
      <div className="w-[180px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[20px]">
        {label}
      </div>
      {wideValue ? (
        <div className="w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-base leading-[20px]">
          {value}
        </div>
      ) : (
        <>
          <div className={`w-[120px] shrink-0 font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${valueClass}`}>
            {value}
          </div>
          {status ? (
            <div className={`w-0 grow font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-base leading-[20px] ${statusClass}`}>
              {status}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function FactCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col w-0 grow gap-[4px]">
      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#1C1C1E] text-xl leading-[24px]">
        {value}
      </div>
      <div className="font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-medium text-[#636366] text-sm leading-[18px]">
        {label}
      </div>
    </div>
  );
}
