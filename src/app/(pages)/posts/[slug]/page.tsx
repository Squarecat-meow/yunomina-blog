import { FrontmatterDto } from "@/app/_dto/post.dto";
import NotFound from "@/app/not-found";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { compileMDX } from "next-mdx-remote/rsc";
import Image from "next/image";

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

    return (
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
    );
  } else {
    return <NotFound />;
  }
}
