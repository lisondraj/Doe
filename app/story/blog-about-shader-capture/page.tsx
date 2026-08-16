import BlogAboutShaderCaptureClient from "./BlogAboutShaderCaptureClient";

export const dynamic = "force-dynamic";

/** Dev-only capture route — one tile per `?only=` query for Playwright export. */
export default function BlogAboutShaderCapturePage() {
  return <BlogAboutShaderCaptureClient />;
}
