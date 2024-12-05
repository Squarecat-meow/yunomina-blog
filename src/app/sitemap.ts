import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { MetadataRoute } from "next";

const prisma = GetPrismaClient.getClient();

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString().split("T")[0];
  const posts: MetadataRoute.Sitemap = (await prisma.post.findMany()).map(
    (post) => ({
      url: `${process.env.WEB_URL}/posts/${post.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      ...(post.thumbnail && { images: [post.thumbnail] }),
    })
  );

  return [
    {
      url: `${process.env.WEB_URL}`,
      lastModified: now,
    },
    ...posts,
  ];
}
