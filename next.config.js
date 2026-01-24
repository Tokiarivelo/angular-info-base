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
  // Optimize for Vercel deployment
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build output size
  output: 'standalone',
};

export default nextConfig;
