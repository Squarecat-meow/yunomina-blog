import { FrontmatterDto } from "@/app/_dto/post.dto";
import NotFound from "@/app/not-found";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
import { compileMDX } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Post({ params }: PageProps) {
  const prisma = GetPrismaClient.getClient();
  const { slug } = await params;
  const postUrl = await prisma.post.findUnique({
    where: { id: parseInt(slug) },
    select: { postUrl: true },
  });
  if (postUrl) {
    const res = await fetch(postUrl.postUrl);
    const markdown = await res.text();
    const { content, frontmatter } = await compileMDX<FrontmatterDto>({
      source: markdown,
      options: {
        parseFrontmatter: true,
      },
    });
    const nextPost = await prisma.post.findMany({
      take: 1,
      skip: 1,
      cursor: {
        id: parseInt(slug),
      },
      orderBy: {
        id: "asc",
      },
    });

    const prevPost = await prisma.post.findMany({
      take: 1,
      skip: 1,
      cursor: {
        id: parseInt(slug),
      },
      orderBy: {
        id: "desc",
      },
    });

    return (
      <div>
        <div className="prose flex justify-center p-4">
          <div className="w-full desktop:w-[80%]">
            <h1 className="text-5xl mb-2">{frontmatter.title}</h1>
            <span className="text-sm">
              {frontmatter.postDate.toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            </span>
            <div className="h-fit flex items-center gap-2">
              <Image
                src={frontmatter.avatarUrl}
                width={50}
                height={50}
                alt="author avatar"
                className="m-0 rounded-full"
              />
              <span className="text-lg">{frontmatter.author}</span>
            </div>
            {content}
          </div>
        </div>
        <div className="w-full flex justify-between">
          {prevPost[0] ? (
            <div className="flex flex-col rounded-box px-6 py-2 hover:shadow transition-shadow">
              <Link href={`/posts/${prevPost[0].id}`}>
                <div className="flex items-center gap-2">
                  <ChevronLeft size={24} />
                  <span className="text-xl">이전 글</span>
                </div>
                <span className="text-2xl font-bold">{prevPost[0].title}</span>
              </Link>
            </div>
          ) : (
            <div />
          )}
          {nextPost[0] && (
            <div className="flex flex-col rounded-box px-6 py-2 hover:shadow transition-shadow">
              <Link href={`/posts/${nextPost[0].id}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">다음 글</span>
                  <ChevronRight size={24} />
                </div>
                <span className="text-2xl font-bold">{nextPost[0].title}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
}
