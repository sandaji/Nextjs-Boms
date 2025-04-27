/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
         pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost", // Allow images from localhost with HTTP protocol
      },
      {
        protocol: "https", // Define protocol
        hostname: "images.pexels.com", // Allow images from Pexels domain
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.tronic.co.ke",
      },
    ],
  },
};

export default nextConfig;
