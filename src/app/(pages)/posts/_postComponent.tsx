"use client";

import DialogModalTwoButton from "@/app/_components/modalTwoButton";
import { OverflowMenuVertical } from "@carbon/icons-react";
import { category, post, profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function PostComponent({
  posts,
  isLoggedIn,
}: {
  posts: { author: profile; category: category } & post;
  isLoggedIn: boolean;
}) {
  const postDeleteModalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/web/post?postId=${posts.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(
          `글을 삭제하는데 문제가 발생했어요! ${await res.text()}`
        );
      }
      router.refresh();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div
      className={`card card-bordered min-w-[24rem] min-h-[12rem] hover:shadow transition-shadow my-2 desktop:m-2 ${
        posts.thumbnail && "row-span-2"
      }`}
    >
      <Link href={`/posts/${posts.id}`} key={posts.id} className="h-full">
        {posts.thumbnail && (
          <figure>
            <Image
              src={posts.thumbnail}
              alt="post thumbnail"
              width={384}
              height={192}
              objectFit="cover"
              className="rounded-t-box"
            />
          </figure>
        )}
        <div className="card-body p-4">
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
      </Link>
      {isLoggedIn && (
        <div className="dropdown absolute right-4 bottom-4">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <OverflowMenuVertical size={20} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-24 p-2 shadow"
          >
            <li>
              <a
                className="hover:bg-red-500 active:!bg-red-700"
                onClick={() => postDeleteModalRef.current?.showModal()}
              >
                삭제
              </a>
            </li>
          </ul>
        </div>
      )}
      <DialogModalTwoButton
        title={"글 삭제"}
        body={"정말 글을 지울거야...?"}
        confirmButtonColor="btn-error"
        confirmButtonText={"응!"}
        cancelButtonText={"아니"}
        onClick={handleDeletePost}
        ref={postDeleteModalRef}
      />
    </div>
  );
}
