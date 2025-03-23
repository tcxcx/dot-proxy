/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  transpilePackages: ['@polkadot/api'],
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: process.env.NEXT_PUBLIC_SQUID_URL || 'http://localhost:4350/graphql',
      },
    ];
  },
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during build for faster builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 