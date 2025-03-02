/** @type {import('next').NextConfig} */

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const fs = require('fs');
const path = require('path');

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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  async generateStaticParams() {
    const outDir = path.join(__dirname, 'build');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.copyFileSync(path.join(__dirname, 'CNAME'), path.join(outDir, 'CNAME'));
    return [];
  }
};

module.exports = withVanillaExtract(nextConfig);