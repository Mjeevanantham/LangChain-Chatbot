/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude undici from server-side bundling (it's a Node.js internal)
  serverComponentsExternalPackages: ['undici'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude undici from server-side webpack bundling
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('undici');
      } else {
        config.externals = [config.externals, 'undici'];
      }
    } else {
      // For client-side, ignore undici completely
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
      };
    }

    // Ignore parsing undici files (they use private fields syntax)
    config.module.rules.push({
      test: /node_modules[\\/]undici/,
      use: 'ignore-loader',
    });

    return config;
  },
}

module.exports = nextConfig


