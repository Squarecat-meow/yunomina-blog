import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import Image from "next/image";
import Link from "next/link";

export default async function Posts() {
  const prisma = GetPrismaClient.getClient();
  const posts = await prisma.post.findMany({ include: { author: true } });

  return (
    <div className="w-full p-2">
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <div className="w-full my-2 p-4 border space-y-2 border-base-200 rounded-box hover:shadow transition-shadow">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatarUrl ?? ""}
                width={30}
                height={30}
                alt="author avatar"
                className="rounded-full"
              />
              <span className="text-xl">{post.author.nickname}</span>
            </div>
            <h2 className="text-sm">
              {post.postAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
