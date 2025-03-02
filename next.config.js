/** @type {import('next').NextConfig} */

const {
    createVanillaExtractPlugin
  } = require('@vanilla-extract/next-plugin');
  const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  output: 'export',
  distDir: "build",
  // basePath: `/${process.env.GITHUB_REPO_NAME}`,
  // assetPrefix:`/${process.env.GITHUB_REPO_NAME}/` ,
  
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
  }
}

module.exports = withVanillaExtract(nextConfig);
