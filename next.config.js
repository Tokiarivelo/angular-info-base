import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build output size
  output: 'standalone',
};

export default withNextIntl(nextConfig);
