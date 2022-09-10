module.exports = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'tailwindui.com'],
  },

  // https://nextjs.org/docs/migrating/incremental-adoption#rewrites
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/:path*',
          destination: `http://web:3000/:path*`,
        },
      ],
    }
  },
}
