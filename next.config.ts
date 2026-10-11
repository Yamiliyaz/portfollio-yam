import type { NextConfig } from "next";

const config: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
};

export default config;
