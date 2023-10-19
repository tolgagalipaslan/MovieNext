/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.themoviedb.org",
      "img.youtube.com",
      "image.tmdb.org",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
