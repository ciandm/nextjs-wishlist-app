const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['s.gravatar.com'],
  },
};

export default nextConfig;
