
   
/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// }

module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://designious.com/:path*`,
        },
      ],
    }
  },
}