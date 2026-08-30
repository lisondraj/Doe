"use client";

type DoeDtcPageHeaderProps = {
  title: string;
};

export function DoeDtcPageHeader({ title }: DoeDtcPageHeaderProps) {
  return (
    <header className="doedtc-page-header">
      <div className="doedtc-page-header__box">
        <h2 className="doedtc-page-header__title">{title}</h2>
      </div>
    </header>
  );
}
