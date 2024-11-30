import { PostDto } from "@/app/_dto/post.dto";
import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { checkAuth } from "@/utils/jwt/checkAuth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

export async function POST(req: NextRequest) {
  const data = (await req.json()) as PostDto;
  const prisma = GetPrismaClient.getClient();
  const jwtToken = req.cookies.get("jwtToken");
  if (!jwtToken) return sendApiError(401, "권한이 없어요!");
  const userId = await checkAuth(jwtToken.value);
  if (!userId) return sendApiError(401, "권한이 없어요!");

  const fileName = crypto.randomUUID();
  const markdownWithMetadata = `export const metadata = {
      title: "${data.title}",
      author: "${userId}"
    };

    # ${data.title}

    ${data.body}
    `;

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
    },
  });

  return NextResponse.json({}, { status: 200 });
}
