import {
  LINKEDIN2_MODEL_HOVERED,
  LINKEDIN2_MODEL_MENU_OPTIONS,
  LINKEDIN2_MODEL_TRIGGER_LABEL,
} from "@/lib/linkedin/linkedin2-copy";
import { dmSans } from "@/lib/home/fonts";

function DropdownChevron() {
  return (
    <svg className="linkedin2-model-dropdown__chevron" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.75 4.25 6 7.5l3.25-3.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Proto-style static model picker — trigger above, open menu below, Dr. Simon's at bottom. */
export function LinkedIn2ModelDropdown() {
  return (
    <div className={`linkedin2-model-dropdown ${dmSans.className}`} aria-hidden>
      <div className="linkedin2-model-dropdown__trigger">
        <span className="linkedin2-model-dropdown__trigger-label">{LINKEDIN2_MODEL_TRIGGER_LABEL}</span>
        <DropdownChevron />
      </div>

      <ul className="linkedin2-model-dropdown__menu" role="list">
        {LINKEDIN2_MODEL_MENU_OPTIONS.map((label) => (
          <li
            key={label}
            className={`linkedin2-model-dropdown__option${
              label === LINKEDIN2_MODEL_HOVERED ? " linkedin2-model-dropdown__option--hover" : ""
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
