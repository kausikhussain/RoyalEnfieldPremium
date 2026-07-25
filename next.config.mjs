/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  reactStrictMode: true,
};

export default nextConfig;
