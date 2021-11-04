/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
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
