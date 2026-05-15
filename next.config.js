/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/api/quotes/[id]/pdf': ['./node_modules/@sparticuz/chromium/**/*'],
    '/api/quotes/[id]/send': ['./node_modules/@sparticuz/chromium/**/*'],
    '/api/quotes/create-and-send': ['./node_modules/@sparticuz/chromium/**/*'],
    '/api/expenses/export-pdf': ['./node_modules/@sparticuz/chromium/**/*'],
  },
}

module.exports = nextConfig

