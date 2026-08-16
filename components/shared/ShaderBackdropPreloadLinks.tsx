/** Server-rendered `<link rel="preload">` tags for baked shader backdrop PNGs. */
export function ShaderBackdropPreloadLinks({ srcs }: { srcs: readonly string[] }) {
  return (
    <>
      {srcs.map((href) => (
        <link key={href} rel="preload" as="image" href={href} fetchPriority="high" />
      ))}
    </>
  );
}
