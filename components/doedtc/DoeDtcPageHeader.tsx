"use client";

type DoeDtcPageHeaderProps = {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  backLabel?: string;
  closeLabel?: string;
};

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M11 4 6 9l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4 4 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function DoeDtcPageHeader({
  title,
  onBack,
  onClose,
  backLabel = "Back",
  closeLabel = "Close",
}: DoeDtcPageHeaderProps) {
  return (
    <header className="doedtc-page-header">
      <div className="doedtc-page-header__side">
        {onBack ? (
          <button type="button" className="doedtc-page-header__icon" aria-label={backLabel} onClick={onBack}>
            <BackIcon />
          </button>
        ) : (
          <span className="doedtc-page-header__spacer" aria-hidden />
        )}
      </div>
      <h2 className="doedtc-page-header__title">{title}</h2>
      <div className="doedtc-page-header__side doedtc-page-header__side--end">
        {onClose ? (
          <button type="button" className="doedtc-page-header__icon" aria-label={closeLabel} onClick={onClose}>
            <CloseIcon />
          </button>
        ) : (
          <span className="doedtc-page-header__spacer" aria-hidden />
        )}
      </div>
    </header>
  );
}
