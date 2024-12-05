import { category, post, profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function PostComponent({
  posts,
}: {
  posts: { author: profile; category: category } & post;
}) {
  return (
    <Link href={`/posts/${posts.id}`} key={posts.id}>
      <div className="w-full my-2 px-4 py-2 border border-base-200 rounded-box hover:shadow transition-shadow">
        <h1 className="text-2xl font-bold">{posts.title}</h1>
        <div className="flex items-center gap-2">
          <Image
            src={posts.author.avatarUrl ?? ""}
            width={24}
            height={24}
            alt="author avatar"
            className="rounded-full"
          />
          <span className="text-lg font-light">{posts.author.nickname}</span>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm text-slate-400">
            {posts.postAt.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </h2>
          <span>{posts.category.category}</span>
        </div>
      </div>
    </Link>
  );
}
