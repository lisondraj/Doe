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
    ];
  },
};

module.exports = nextConfig;
