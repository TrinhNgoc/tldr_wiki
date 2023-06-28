/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  }
}
