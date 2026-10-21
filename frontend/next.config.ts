import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      {
        source: "/vacancies",
        destination: "/vacancy-update",
        permanent: true,
      },
      {
        source: "/vacancies/:id",
        destination: "/vacancy-update/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
