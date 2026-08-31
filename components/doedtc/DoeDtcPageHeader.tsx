"use client";

type DoeDtcPageHeaderProps = {
  title: string;
  onBack?: () => void;
  backLabel?: string;
};

export function DoeDtcPageHeader({ title, onBack, backLabel = "Back" }: DoeDtcPageHeaderProps) {
  return (
    <header className={`doedtc-page-header${onBack ? " doedtc-page-header--with-back" : ""}`}>
      {onBack ? (
        <button
          className="doedtc-page-header__back"
          type="button"
          aria-label={backLabel}
          onClick={onBack}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5L8 12l7 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
      <div className="doedtc-page-header__box">
        <h2 className="doedtc-page-header__title">{title}</h2>
      </div>
    </header>
  );
}
