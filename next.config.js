require('dotenv').config();
const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  generateSw: false,
  workboxOpts: {
    swSrc: './assets/service-worker.js',
  },
  env: {
    API_URL: process.env.API_URL,
    APP_SERVER_KEY: process.env.APP_SERVER_KEY,
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    HEAP_ID: process.env.HEAP_ID,
  },
};

module.exports = withOffline(withCSS(nextConfig));
