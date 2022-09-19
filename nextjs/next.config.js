module.exports = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'tailwindui.com', 'rails-nextjs.fly.dev'],
  },

  // https://nextjs.org/docs/migrating/incremental-adoption#rewrites
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/:path*',
          destination: `https://rails-nextjs.fly.dev/:path*`,
        },
      ],
    }
  },
}
