/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: !isProd,
    remotePatterns: isProd
      ? [
          {
            protocol: "https",
            hostname: "admin.rhfpakistan.com",
            port: "",
            pathname: "/uploads/**",
          },
        ]
      : [
          {
            protocol: "http",
            hostname: "localhost",
            port: "1337",
            pathname: "/uploads/**",
          },
          {
            protocol: "http",
            hostname: "192.168.1.11",
            port: "1337",
            pathname: "/uploads/**",
          },
        ],
  },
};

module.exports = nextConfig;
