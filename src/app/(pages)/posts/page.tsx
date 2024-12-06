import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import PostComponent from "./_postComponent";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Posts() {
  const prisma = GetPrismaClient.getClient();
  const posts = await prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { id: "desc" },
  });

  const jwtToken = (await cookies()).get("jwtToken");

  return (
    <div className="desktop:grid desktop:grid-cols-2">
      {posts.length !== 0 ? (
        <>
          {posts.map((post) => (
            <PostComponent
              posts={post}
              key={post.id}
              isLoggedIn={jwtToken ? true : false}
            />
          ))}
        </>
      ) : (
        <div className="w-full flex justify-center">
          <span className="text-2xl font-bold">글이 없어요!</span>
        </div>
      )}
    </div>
  );
}
