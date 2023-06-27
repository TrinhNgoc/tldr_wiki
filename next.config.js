/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  }
}
