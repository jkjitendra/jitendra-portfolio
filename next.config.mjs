// /** @type {import('next').NextConfig} */
// const nextConfig = {reactStrictMode: true};
// export default nextConfig;

import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    // Tailored to your layout/sizes usage to reduce variants
    deviceSizes: [360, 400, 640, 768, 1024, 1280],
    imageSizes: [64, 96, 128, 256, 400],
    formats: ['image/avif', 'image/webp'],
    // For remote logos later, add remotePatterns here
    // remotePatterns: [{ protocol: 'https', hostname: '...' }],
    minimumCacheTTL: 60 * 60 * 24, // 1 day for optimizer CDN caches
  },
  async headers() {
    return [
      // Cache all public site images (you’re serving from /public)
      {
        source: '/(blogs|logos|tech|android-chrome-.*|apple-touch-icon\\.png|favicon-.*|.*\\.webp|.*\\.png)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // PDF can be cached but still allow updates via SWR
      {
        source: '/jitendra_resume.pdf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);