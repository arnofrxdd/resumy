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
  webpack: (config, { isServer }) => {
    // onnxruntime-node is for Node.js only. We exclude it from the client-side bundle
    // to prevent syntax errors during the build process.
    if (!isServer) {
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }
    return config;
  },
}

module.exports = nextConfig