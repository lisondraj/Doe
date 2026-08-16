/** Static shader poster — CSS background paints from preload cache (no WebGL / brown flash). */
export function StoryShaderPosterFill({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`story-shader-poster pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{ backgroundImage: `url("${src}")` }}
      aria-hidden
    />
  );
}
