"use client";

import { ProductDesktopView } from "@/components/product/ProductDesktopView";
import { ProductMobileView } from "@/components/product/ProductMobileView";
import { useProductPageVariant } from "@/lib/product/use-product-page-variant";

export function ProductRouter() {
  const variant = useProductPageVariant();

  return variant === "desktop" ? <ProductDesktopView /> : <ProductMobileView />;
}
