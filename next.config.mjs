/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    inlineCss: true,
  },
  productionBrowserSourceMaps: true,
  compress: true,
  trailingSlash: false,
}

export default nextConfig
