import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/:path*",
        destination: "/api/.well-known/:path*",
      },
      {
        source: "/nodeinfo/:path*",
        destination: "/api/nodeinfo/:path*",
      },
      {
        source: "/blog",
        destination: "/api/blog",
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yunomina-blog.s3.us-east-005.backblazeb2.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yuno.mina.house",
        port: "",
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
    mdxRs: true,
  },
};

const withMDX = nextMDX();

export default withMDX(nextConfig);
