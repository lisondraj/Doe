type AboutStyleBlankPageContentProps = {
  ariaLabel: string;
};

/** Placeholder center stage — content TBD. */
export function AboutStyleBlankPageContent({ ariaLabel }: AboutStyleBlankPageContentProps) {
  return (
    <div className="about-page-content about-style-blank-page">
      <section className="about-style-blank-page__stage" aria-label={ariaLabel} />
    </div>
  );
}
