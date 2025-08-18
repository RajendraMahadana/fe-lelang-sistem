/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000', // jika ada port
        pathname: '/gambar-barang/**', // optional, bisa pakai wildcard
      },
    ],
  },
};

module.exports = nextConfig;
