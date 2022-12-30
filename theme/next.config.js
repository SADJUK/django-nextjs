
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  i18n
}

module.exports = nextConfig
