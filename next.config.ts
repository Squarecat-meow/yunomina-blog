import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yunomina-blog.s3.us-east-005.backblazeb2.com",
        port: "",
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

const withMDX = createMDX({
  // 추가적인 마크다운 플러그인 설정 가능
});

export default withMDX(nextConfig);
