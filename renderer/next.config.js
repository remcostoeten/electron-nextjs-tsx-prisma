/** @type {import('next').NextConfig} */
module.exports = {
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  experimental: {
    appDir: false,
  },
} 