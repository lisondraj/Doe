/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["remotion", "@remotion/player", "@remotion/cli"],
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js", "resend"],
  },
  async redirects() {
    return [
      {
        source: "/blog/the-broader-doe-vision",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/blog/introducing-canvas",
        destination: "/blog/introducing-fabric",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
