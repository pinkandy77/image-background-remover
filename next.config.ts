import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["thru-wrestling-brunette-suggestions.trycloudflare.com"],
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
