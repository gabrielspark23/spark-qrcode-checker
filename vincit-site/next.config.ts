import type { NextConfig } from "next";

const OS_LOGIN_URL = process.env.NEXT_PUBLIC_OS_LOGIN_URL ?? "https://vincit-os.vercel.app/login";

const nextConfig: NextConfig = {
  experimental: {
    // Duas root layouts (EN e PT) → 404 global com <html> próprio.
    globalNotFound: true,
  },
  async redirects() {
    return [
      { source: "/login", destination: OS_LOGIN_URL, permanent: false },
      { source: "/pt/login", destination: OS_LOGIN_URL, permanent: false },
      { source: "/lander", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
