/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["img.clerk.com"],
  },
};

module.exports = nextConfig;
