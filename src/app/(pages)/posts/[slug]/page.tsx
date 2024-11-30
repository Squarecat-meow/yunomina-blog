import NotFound from "@/app/not-found";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { MDXRemote } from "next-mdx-remote/rsc";

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

    return (
      <section className="prose w-full">
        <MDXRemote source={markdown} />
      </section>
    );
  } else {
    return <NotFound />;
  }
}
