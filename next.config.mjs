import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'codebundle.jkjitendra.in',
            },
          ],
          destination: '/codebundle',
        },
      ],
    };
  },

  images: {
    deviceSizes: [360, 400, 640, 768, 1024, 1280],
    imageSizes: [64, 96, 128, 256, 400],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
  },

  async headers() {
    return [
      {
        source: '/(blogs|codebundle|logos|tech|android-chrome-.*|apple-touch-icon\\.png|favicon-.*|.*\\.webp|.*\\.png)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
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