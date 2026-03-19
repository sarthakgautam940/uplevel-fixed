/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "palmettopoolsinc.com",
      },
    ],
  },
};

export default nextConfig;
