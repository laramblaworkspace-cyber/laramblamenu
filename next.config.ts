import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/menu", destination: "/", permanent: true },
      { source: "/qr", destination: "/", permanent: false },
      { source: "/admin", destination: "/", permanent: false },
      { source: "/admin/login", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
