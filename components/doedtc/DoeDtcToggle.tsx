"use client";

type DoeDtcToggleProps = {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
  className?: string;
};

export function DoeDtcToggle({
  id,
  checked,
  disabled = false,
  label,
  onChange,
  className,
}: DoeDtcToggleProps) {
  return (
    <label className={`doedtc-switch${className ? ` ${className}` : ""}`}>
      {label ? <span className="doedtc-switch__label">{label}</span> : null}
      <input
        id={id}
        className="doedtc-switch__input"
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="doedtc-switch__track" aria-hidden />
    </label>
  );
}
