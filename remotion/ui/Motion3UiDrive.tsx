import type { ReactNode } from "react";

type Motion3UiDriveProps = {
  variant: "summary" | "call" | "agents" | "outro" | "logo";
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
};

export function Motion3UiDrive({ variant, style, className = "", children }: Motion3UiDriveProps) {
  return (
    <div className={`motion3-ui-drive motion3-ui-drive--${variant}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
