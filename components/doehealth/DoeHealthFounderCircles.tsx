import { DOEHEALTH_FOUNDERS } from "@/lib/doehealth/doehealth-founders";
import { inter, suisseIntl } from "@/lib/home/fonts";

export function DoeHealthFounderCircles() {
  return (
    <div className="doehealth-founder-circles" aria-label="Founders">
      {DOEHEALTH_FOUNDERS.map((founder) => (
        <div key={founder.name} className="doehealth-founder-circles__item">
          <div className="doehealth-founder-circles__orb" aria-hidden />
          <p className={`doehealth-founder-circles__name m-0 ${suisseIntl.className}`}>{founder.name}</p>
          <p className={`doehealth-founder-circles__role m-0 ${inter.className}`}>{founder.role}</p>
        </div>
      ))}
    </div>
  );
}
