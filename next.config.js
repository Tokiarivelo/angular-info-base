//** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Autorise tous les domaines
      },
    ],
  },
  // Disable source maps in production to reduce build size and disk usage
  productionBrowserSourceMaps: false,
  // Optimize webpack configuration for smaller builds
  webpack: (config, { isServer }) => {
    // Disable source maps in production
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
