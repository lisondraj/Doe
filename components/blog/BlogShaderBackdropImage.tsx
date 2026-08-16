import { ShaderBackdropImage } from "@/components/shared/ShaderBackdropImage";

/** High-res baked shader backdrop — shared by about-style blog pages. */
export function BlogShaderBackdropImage({
  src,
  className = "",
  fetchPriority = "high",
}: {
  src: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    <ShaderBackdropImage
      src={src}
      fetchPriority={fetchPriority}
      className={`blog-shader-backdrop-image pointer-events-none absolute inset-0 h-full w-full ${className}`.trim()}
    />
  );
}
