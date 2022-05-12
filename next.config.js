const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['cullab.s3.ap-south-1.amazonaws.com', 'cullab-dev.s3.ap-south-1.amazonaws.com', '192.168.0.155'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
});
