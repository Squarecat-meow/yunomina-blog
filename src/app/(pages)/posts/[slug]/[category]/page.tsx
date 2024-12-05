import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import PostComponent from "../../_postComponent";
import { category, post, profile } from "@prisma/client";

const prisma = GetPrismaClient.getClient();

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  let posts: ({ category: category; author: profile } & post)[] = [];

  switch (category) {
    case "Yozumina":
      posts = await prisma.post.findMany({
        where: {
          userId: "Yozumina",
        },
        include: { author: true, category: true },
        orderBy: { id: "desc" },
      });
      break;
    case "yunochi":
      posts = await prisma.post.findMany({
        where: {
          userId: "yunochi",
        },
        include: { author: true, category: true },
        orderBy: { id: "desc" },
      });

      break;
    default:
      posts = await prisma.post.findMany({
        where: {
          categoryId: parseInt(category),
        },
        include: {
          author: true,
          category: true,
        },
        orderBy: { id: "desc" },
      });
      break;
  }

  return (
    <div className="desktop:grid desktop:grid-cols-2 p-2">
      {posts.map((post) => (
        <div key={post.id}>
          <PostComponent posts={post} />
        </div>
      ))}
    </div>
  );
}