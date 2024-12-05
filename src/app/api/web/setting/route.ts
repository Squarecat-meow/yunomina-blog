import { FormDataDto } from "@/app/_dto/profile.dto";
import { checkAuth } from "@/utils/jwt/checkAuth";
import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { sendApiOk } from "@/utils/apiHandler/sendApiOk";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const prisma = GetPrismaClient.getClient();

const Bucket = process.env.BACKBLAZE_BUCKET;
const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_APPLICATION_ID as string,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY as string,
  },
});

function parseFormData(formData: FormData) {
  const tempArray = [];

  for (const [key, value] of formData.entries()) {
    tempArray.push([key, value]);
  }
  const tempObject = Object.fromEntries(tempArray);

  return tempObject;
}

async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("jwtToken");

  if (cookie) {
    try {
      const userId = await checkAuth(cookie.value);
      try {
        const data = await req.formData();
        const profileData = parseFormData(data) as FormDataDto;

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
              introduce: profileData.introduce,
              sentences: profileData.sentences,
              nickname: profileData.nickname,
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
              introduce: profileData.introduce,
              sentences: profileData.sentences,
              nickname: profileData.nickname,
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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jwtToken");
    if (!token) {
      throw new Error("토큰을 가져오는데 실패했어요!");
    }
    const userId = await checkAuth(token.value);
    if (!userId) {
      throw new Error("토큰을 검증하는데 실패했어요!");
    }

    const profile = await prisma.profile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(profile);
  } catch (err) {
    return sendApiError(500, `GET해오는데 에러가 발생했어요! ${err}`);
  }
}
