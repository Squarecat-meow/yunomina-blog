import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import PostComponent from "../../_postComponent";

const prisma = GetPrismaClient.getClient();

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const postByCategory = await prisma.post.findMany({
    where: {
      categoryId: parseInt(category),
    },
    include: {
      author: true,
      category: true,
    },
  });

  return (
    <div className="w-full p-2">
      {postByCategory.map((post) => (
        <div key={post.id}>
          <PostComponent posts={post} />
        </div>
      ))}
    </div>
  );
}
