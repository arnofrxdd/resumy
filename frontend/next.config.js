/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/resumy',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.stripeassets.com',
      },
    ],
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = isDev ? 'http://127.0.0.1:3001' : 'http://resumy-backend:3001';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/resumy',
        basePath: false,
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    // Completely ignore onnxruntime-node in both browser and server bundles.
    // This stops Next.js from trying to parse the faulty .mjs file during build.
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
    };
    return config;
  },
}

module.exports = nextConfig