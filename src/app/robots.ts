import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/writer", "/about"],
    },
    sitemap: `${process.env.WEB_URL}/sitemap.xml`,
  };
}
