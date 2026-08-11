"use client";

import { dmSans, suisseIntl } from "@/lib/home/fonts";

export function AdminProductStatStrip({
  items,
  variant = "desktop",
}: {
  items: { label: string; value: number | string; detail?: string }[];
  variant?: "mobile" | "desktop";
}) {
  if (variant === "mobile") {
    return (
      <div className="admin-mobile-stat-grid">
        {items.map((item) => (
          <div key={item.label} className="admin-mobile-stat-card admin-mobile-surface">
            <p className="admin-mobile-stat-card__label">{item.label}</p>
            <p className={`admin-mobile-stat-card__value ${dmSans.className}`}>{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`product-landing-stat-strip product-landing-stat-strip--compact admin-stat-strip ${suisseIntl.className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="product-landing-stat-strip__item">
          <p className={`product-landing-stat-strip__value admin-stat-strip__value ${dmSans.className}`}>
            {item.value}
          </p>
          <p className="product-landing-stat-strip__label admin-stat-strip__label">{item.label}</p>
          {item.detail ? (
            <p className="product-landing-stat-strip__detail admin-stat-strip__detail">{item.detail}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
