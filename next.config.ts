import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    buildActivityPosition: "top-right",
    appIsrStatus: false,
    buildActivity: true,
  },

  images: {
    domains: ["images.unsplash.com","platform-lookaside.fbsbx.com","firebasestorage.googleapis.com","storage.googleapis.com","fastly.picsum.photos"],
  },
  /* config options here */
};

export default nextConfig;
