import { dmSans } from "@/lib/home/fonts";
import { ProductNewDashboard } from "@/components/productnew/ProductNewDashboard";
import "@/lib/productnew/productnew.css";

/** Gabriel-style fintech dashboard with profile share dropdown. */
export function ProductNewView() {
  return (
    <main className={`productnew ${dmSans.className}`}>
      <ProductNewDashboard />
    </main>
  );
}
