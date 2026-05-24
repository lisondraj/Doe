export type WorkflowBlockVariant = "dark" | "light";

export function workflowBlockTheme(variant: WorkflowBlockVariant) {
  if (variant === "light") {
    return {
      variant,
      shell:
        "bg-white border-neutral-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_20px_rgba(15,23,42,0.05)]",
      headerBorder: "border-neutral-100",
      footerBorder: "border-neutral-100",
      title: "text-neutral-900",
      subtitle: "text-neutral-500",
      icon: "text-neutral-700",
      label: "text-neutral-400",
      bodyLg: "text-neutral-900",
      body: "text-neutral-700",
      bodySecondary: "text-neutral-600",
      bodyMuted: "text-neutral-500",
      mono: "text-neutral-600",
      dotMuted: "text-neutral-400",
      rowNum: "text-neutral-400",
      rowDivider: "divide-neutral-100",
      checkMuted: "text-neutral-400",
      stepText: "text-neutral-600",
      activeText: "text-neutral-800",
      emerald: "text-emerald-700",
      emeraldSoft: "text-emerald-700",
      emeraldDot: "text-neutral-400",
      approvedIcon: "text-emerald-600",
      awaitingIcon: "text-amber-600",
      btn: "border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100",
      btnGhost: "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
      btnPrimary:
        "border-emerald-600/25 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80",
      connectorStroke: "#B8B8B8",
      connectorDot: "#A3A3A3",
      thinkingRing: "border-neutral-300/80",
      thinkingSpin: "border-neutral-500",
    } as const;
  }

  return {
    variant,
    shell: "bg-[#121212] border-white/[0.08]",
    headerBorder: "border-white/[0.06]",
    footerBorder: "border-white/[0.06]",
    title: "text-neutral-100",
    subtitle: "text-neutral-500",
    icon: "text-white",
    label: "text-neutral-600",
    bodyLg: "text-neutral-100",
    body: "text-neutral-300",
    bodySecondary: "text-neutral-400",
    bodyMuted: "text-neutral-500",
    mono: "text-neutral-300",
    dotMuted: "text-neutral-600",
    rowNum: "text-neutral-600",
    rowDivider: "divide-white/[0.05]",
    checkMuted: "text-neutral-500",
    stepText: "text-neutral-400",
    activeText: "text-neutral-300",
    emerald: "text-emerald-400/85",
    emeraldSoft: "text-emerald-400/85",
    emeraldDot: "text-emerald-600/70",
    approvedIcon: "text-emerald-500/95",
    awaitingIcon: "text-amber-500/85",
    btn: "border-white/[0.1] bg-white/[0.03] text-neutral-200 hover:bg-white/[0.06]",
    btnGhost: "border-white/[0.08] bg-transparent text-neutral-200 hover:bg-white/[0.04]",
    btnPrimary:
      "border-emerald-500/35 bg-emerald-500/[0.1] text-emerald-200/95 hover:bg-emerald-500/[0.16]",
    connectorStroke: "#C8C8C8",
    connectorDot: "#C8C8C8",
    thinkingRing: "border-neutral-600/70",
    thinkingSpin: "border-neutral-400",
  } as const;
}

export type WorkflowBlockTheme = ReturnType<typeof workflowBlockTheme>;
