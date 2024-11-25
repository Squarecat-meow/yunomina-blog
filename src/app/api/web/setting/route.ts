import { DetailedProfileDto } from "@/app/_dto/detailedProfile.dto";
import { checkAuth } from "@/app/_hooks/checkAuth";
import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { sendApiOk } from "@/utils/apiHandler/sendApiOk";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

const Bucket = process.env.BACKBLAZE_BUCKET;
const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_APPLICATION_ID as string,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY as string,
  },
});

async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

export async function POST(req: NextRequest) {
  const prisma = GetPrismaClient.getClient();
  const userId = await checkAuth();

  try {
    const profileData = await req.formData();
    const avatarObject = profileData.get("avatar") as File;
    const settingsString = profileData.get("settings") as unknown as string;
    const settings = JSON.parse(settingsString) as DetailedProfileDto;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

    // 아바타 사진이 있으면?
    if (avatarObject) {
      const buffer = await fileToBuffer(avatarObject);
      const fileName = crypto.randomUUID();

      const res = await s3.send(
        new PutObjectCommand({
          Bucket,
          Key: `profile-photo/${fileName}`,
          Body: buffer,
          ContentType: "image/png",
        })
      );
      if (res.$metadata.httpStatusCode !== 200) {
        throw new Error(`버킷에 업로드를 실패했어요!`);
      }

      const avatarAddress = `https://${process.env.BACKBLAZE_BUCKET}.s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com/${fileName}`;

      await prisma.profile.update({
        where: {
          userId: userId,
        },
        data: {
          avatarUrl: avatarAddress,
          introduce: settings.introduce,
          sentences: settings.sentences,
          nickname: settings.nickname,
          user: {
            connect: {
              userId: userId,
            },
          },
        },
      });
      return sendApiOk("설정 완료~!");

      // 아바타 사진이 없으면?
    } else {
      await prisma.profile.update({
        where: {
          userId: userId,
        },
        data: {
          avatarUrl: null,
          introduce: settings.introduce,
          sentences: settings.sentences,
          nickname: settings.nickname,
          user: {
            connect: {
              userId: userId,
            },
          },
        },
      });

      return sendApiOk("설정 완료~!");
    }
  } catch (err) {
    return sendApiError(500, `${err}`);
  }
}
