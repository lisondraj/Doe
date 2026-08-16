/** High-res baked shader backdrop — shared by about-style blog pages. */
export function BlogShaderBackdropImage({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={`blog-shader-backdrop-image pointer-events-none absolute inset-0 h-full w-full ${className}`.trim()}
    />
  );
}
