"use client";

/** Global shell placeholder — wraps app children (no overlays). */
export function RootChrome({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
