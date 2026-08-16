/** Baked shader backdrop — sync decode + eager load to avoid brown flash before paint. */
export function ShaderBackdropImage({
  src,
  className = "",
  fetchPriority = "high",
}: {
  src: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      loading="eager"
      decoding="sync"
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
