/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
