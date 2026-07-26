/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["remotion", "@remotion/player", "@remotion/cli"],
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js", "resend"],
  },
};

module.exports = nextConfig;
