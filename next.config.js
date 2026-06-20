/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: "20mb",
  },
};

module.exports = nextConfig;
