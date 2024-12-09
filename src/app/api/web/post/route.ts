import { PostDto } from "@/app/_dto/post.dto";
import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { checkAuth } from "@/utils/jwt/checkAuth";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.BACKBLAZE_BUCKET;
const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_APPLICATION_ID as string,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY as string,
  },
});

const prisma = GetPrismaClient.getClient();

export async function POST(req: NextRequest) {
  const data = (await req.json()) as PostDto;

  const jwtToken = req.cookies.get("jwtToken");
  if (!jwtToken) return sendApiError(401, "권한이 없어요!");

  const userId = await checkAuth(jwtToken.value);
  if (!userId) return sendApiError(401, "권한이 없어요!");

  const user = await prisma.profile.findUnique({ where: { userId: userId } });
  if (!user) return sendApiError(403, "유저 테이블에 유저가 없어요!");

  const postDate = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  const fileName = crypto.randomUUID();
  const markdownWithMetadata = `---
title: ${data.title}
userId: ${userId}
author: ${user?.nickname}
category: ${data.category.category}
postDate: ${postDate}
---

${data.body}
`;

  console.log(markdownWithMetadata);

  const res = await s3.send(
    new PutObjectCommand({
      Bucket,
      Key: `${fileName}.mdx`,
      Body: markdownWithMetadata,
      ContentType: "text/mdx",
    })
  );

  if (res.$metadata.httpStatusCode && res.$metadata.httpStatusCode !== 200) {
    return sendApiError(
      res.$metadata.httpStatusCode,
      "버킷에 업로드를 실패했어요!"
    );
  }

  const postAddress = `https://${process.env.BACKBLAZE_BUCKET}.s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com/${fileName}.mdx`;

  await prisma.post.create({
    data: {
      postUrl: postAddress,
      title: data.title,
      userId: userId,
      thumbnail: data.thumbnail ? data.thumbnail : null,
      categoryId: data.category.id,
    },
  });

  return NextResponse.json({}, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  try {
    const jwtToken = req.cookies.get("jwtToken");
    if (!jwtToken) {
      throw new Error("JWT 토큰이 없어요!");
    }
    const userId = checkAuth(jwtToken.value);
    if (!userId) {
      throw new Error("JWT 인증에 실패했어요!");
    }

    const params = req.nextUrl.searchParams;
    const postId = params.get("postId");
    if (!postId) {
      throw new Error("그런 글은 없어요!");
    }

    const post = await prisma.post.findUniqueOrThrow({
      where: { id: parseInt(postId) },
    });

    const key = new URL(post.postUrl).pathname.replace("/", "");

    const bucketRes = await s3.send(
      new DeleteObjectCommand({
        Bucket: Bucket,
        Key: key,
      })
    );

    if (
      bucketRes.$metadata.httpStatusCode &&
      bucketRes.$metadata.httpStatusCode !== (200 | 204)
    ) {
      throw new Error("버킷에서 글을 지우는데 실패했어요!");
    }

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
