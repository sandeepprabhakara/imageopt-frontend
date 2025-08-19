// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wayjpcdwdbbqluahtrkh.supabase.co', // Your specific Supabase hostname
        port: '',
        pathname: '/storage/v1/object/public/generated-images/**',
      },
    ],
  },
};

export default nextConfig;