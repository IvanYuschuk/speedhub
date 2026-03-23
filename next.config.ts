import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Дозволяє всі домени (для розробки ок, але для продакшену краще вказати конкретний домен з картинками)
      },
    ],
  },
};

export default nextConfig;
