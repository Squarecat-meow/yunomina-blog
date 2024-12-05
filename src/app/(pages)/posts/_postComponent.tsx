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
      <div className="card card-bordered hover:shadow transition-shadow my-2 desktop:m-2">
        {posts.thumbnail && (
          <figure>
            <img
              src={posts.thumbnail}
              alt="post thumbnail"
              className="w-[24rem] h-[12rem] object-cover"
            />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">{posts.title}</h2>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Image
                src={posts.author.avatarUrl ?? ""}
                width={24}
                height={24}
                alt="author avatar"
                className="rounded-full"
              />
              <span className="text-lg font-light">
                {posts.author.nickname}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {posts.postAt.toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                })}
              </span>
              <span>{posts.category.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
