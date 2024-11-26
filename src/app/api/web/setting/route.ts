import { FormDataDto } from "@/app/_dto/detailedProfile.dto";
import { checkAuth } from "@/utils/jwt/checkAuth";
import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { sendApiOk } from "@/utils/apiHandler/sendApiOk";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { validateStrict } from "@/utils/validator/strictValidator";
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

function parseFormData(formData: FormData): Record<string, FormDataEntryValue> {
  const data: Record<string, FormDataEntryValue> = {};

  for (let [key, value] of formData.entries()) {
    if (typeof value === "string" && value !== "") {
      data[key] = JSON.parse(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

export async function POST(req: NextRequest) {
  const prisma = GetPrismaClient.getClient();
  const cookie = req.cookies.get("jwtToken");

  if (cookie) {
    try {
      const userId = await checkAuth(cookie.value);
      try {
        const profileData = parseFormData(
          await req.formData()
        ) as unknown as FormDataDto;

        const user = await prisma.user.findUniqueOrThrow({
          where: {
            userId: userId,
          },
        });

        //아바타 사진이 있으면?
        if (typeof profileData.avatar !== "string") {
          const buffer = await fileToBuffer(profileData.avatar);
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

          const avatarAddress = `https://${process.env.BACKBLAZE_BUCKET}.s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com/profile-photo/${fileName}`;

          await prisma.profile.update({
            where: {
              userId: userId,
            },
            data: {
              avatarUrl: avatarAddress,
              introduce: profileData.settings.introduce,
              sentences: profileData.settings.sentences,
              nickname: profileData.settings.nickname,
              user: {
                connect: {
                  userId: userId,
                },
              },
            },
          });
          return NextResponse.json({ avatarUrl: avatarAddress });

          // 아바타 사진이 없으면?
        } else {
          await prisma.profile.update({
            where: {
              userId: userId,
            },
            data: {
              avatarUrl: null,
              introduce: profileData.settings.introduce,
              sentences: profileData.settings.sentences,
              nickname: profileData.settings.nickname,
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
    } catch (err) {
      return sendApiError(400, `${err}`);
    }
  } else {
    return sendApiError(401, "쿠키가 없습니다!");
  }
}
