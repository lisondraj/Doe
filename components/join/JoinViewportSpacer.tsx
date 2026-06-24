import { DOEPHONE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";
import { JOIN_DESKTOP_VIEWPORT_SPACER } from "@/lib/join/join-layout";

export function JoinViewportSpacer({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") {
    return (
      <section
        className={`${DOEPHONE_VIEWPORT_SECTION} bg-[#F7F6F3]`}
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
        aria-hidden
      />
    );
  }

  return <section className={`${JOIN_DESKTOP_VIEWPORT_SPACER} w-full bg-[#F7F6F3]`} aria-hidden />;
}
