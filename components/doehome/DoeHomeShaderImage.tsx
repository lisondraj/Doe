import type { ReactNode } from "react";

/** Baked Doe shader PNG — cover-cropped so grain stays sharp on phone and desktop. */
export function DoeHomeShaderImage({
  src,
  className = "",
  priority = false,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "low"}
      sizes="100vw"
      className={`doehome-shader__img${className ? ` ${className}` : ""}`}
    />
  );
}

export function DoeHomeShaderBand({
  src,
  tone = "wide",
  priority = false,
}: {
  src: string;
  tone?: "wide" | "tall";
  priority?: boolean;
}) {
  return (
    <div className={`doehome-shader doehome-shader--${tone}`} aria-hidden="true">
      <DoeHomeShaderImage src={src} priority={priority} />
    </div>
  );
}

export function DoeHomeShaderFrame({
  src,
  children,
  priority = false,
}: {
  src: string;
  children: ReactNode;
  priority?: boolean;
}) {
  return (
    <div className="doehome-shader-frame">
      <DoeHomeShaderImage src={src} priority={priority} />
      <div className="doehome-shader-frame__ui">{children}</div>
    </div>
  );
}
