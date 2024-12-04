import { FrontmatterDto } from "@/app/_dto/post.dto";
import NotFound from "@/app/not-found";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const prisma = GetPrismaClient.getClient();
  const { slug } = await params;
  const postUrl = await prisma.post.findUnique({
    where: { id: parseInt(slug) },
    select: { postUrl: true },
  });
  if (!postUrl) return <NotFound />;

  const res = await fetch(postUrl.postUrl);
  const markdown = await res.text();
  const { content, frontmatter } = await compileMDX<FrontmatterDto>({
    source: markdown,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "one-dark-pro",
            },
          ],
        ],
      },
    },
  });

  const user = await prisma.profile.findUnique({
    where: {
      userId: frontmatter.userId,
    },
  });

  if (!user) return <NotFound />;

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
    <div className="w-full desktop:w-[80%] prose">
      <div className="flex flex-col justify-center p-4">
        <h1 className="text-5xl mb-2">{frontmatter.title}</h1>
        <div className="flex items-center mb-2">
          <span className="text-sm">
            {frontmatter.postDate.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </span>
          <span className="ml-4">{frontmatter.category}</span>
        </div>
        <div className="h-fit flex items-center gap-2">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              width={50}
              height={50}
              alt="author avatar"
              className="m-0 rounded-full"
            />
          ) : (
            <div className="skeleton w-[50px] h-[50px] rounded-full" />
          )}
          <span className="text-lg">{frontmatter.author}</span>
        </div>
        <div className="text-lg">{content}</div>
      </div>
      <div className="w-full flex justify-between">
        {prevPost[0] ? (
          <div className="flex flex-col rounded-box px-4 py-2 hover:shadow transition-shadow">
            <Link href={`/posts/${prevPost[0].id}`} className="no-underline">
              <span className="text-sm w-full flex justify-end">이전 글</span>
              <div className="flex items-center gap-2">
                <ChevronLeft size={24} />
                <span className="text-2xl font-bold">{prevPost[0].title}</span>
              </div>
            </Link>
          </div>
        ) : (
          <div />
        )}
        {nextPost[0] && (
          <div className="flex flex-col rounded-box px-6 py-2 hover:shadow transition-shadow">
            <Link href={`/posts/${nextPost[0].id}`} className="no-underline">
              <span className="text-sm w-full flex">다음 글</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{nextPost[0].title}</span>
                <ChevronRight size={24} />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
