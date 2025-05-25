import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // Tambahkan domain backend
    // domains: ["localhost", "api.example.com"], // Tambahkan domain backend
  },
};

export default nextConfig;
