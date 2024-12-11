import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import PostComponent from "../../_postComponent";
import { category, post, profile } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = GetPrismaClient.getClient();

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const jwtToken = (await cookies()).get("jwtToken");

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
    <div className="desktop:grid desktop:grid-cols-2">
      {posts.length <= 0 ? (
        <div className="w-full flex justify-center">
          <h2 className="text-2xl font-semibold">글이 없어요!</h2>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostComponent
              isLoggedIn={jwtToken ? true : false}
              posts={post}
              key={post.id}
            />
          ))}
        </>
      )}
    </div>
  );
}
