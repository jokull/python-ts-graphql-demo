/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    // flip `esmExternals` off until @shopify/react-form rebundles after Rollup fix
    // https://github.com/rollup/rollup/pull/4270
    esmExternals: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/graphql",
          destination: "http://localhost:8000/graphql",
        },
      ],
    };
  },
};
