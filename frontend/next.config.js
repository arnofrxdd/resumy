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
  experimental: {
    serverComponentsExternalPackages: ['onnxruntime-node', 'onnxruntime-web', '@imgly/background-removal'],
  },
  webpack: (config, { isServer }) => {
    // 1. Tell webpack NOT to parse faulty node-specific files
    config.module.noParse = [
      ...(config.module.noParse || []),
      /ort\.node\.min\.mjs$/,
      /tf\.min\.js$/
    ];

    // 2. Alias node-specific version to false
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
    };

    // 3. Ensure .mjs files are treated as ES modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        module: false,
        perf_hooks: false,
        os: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig