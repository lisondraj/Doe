import { DoeHomeFooter } from "@/components/doehome/DoeHomeFooter";
import { DoeHomeNav } from "@/components/doehome/DoeHomeNav";
import { DoeHomePageContent } from "@/components/doehome/DoeHomePageContent";
import { dmSans } from "@/lib/home/fonts";

export function DoeHomeDesktopView() {
  return (
    <div
      className={`doeinsure-root doeinsure-root--desktop ${dmSans.variable} ${dmSans.className}`}
      data-doeforvc-view="desktop"
    >
      <DoeHomeNav />
      <main>
        <DoeHomePageContent />
      </main>
      <DoeHomeFooter />
    </div>
  );
}
