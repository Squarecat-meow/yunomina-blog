import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateJWT } from "../../functions/generateJwt";
import { bucketAuth } from "@/app/_actions/bucketAuth";
import { cookies } from "next/headers";

type payloadType = {
  password: string;
  userId: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prisma = new PrismaClient();
  const cookieStore = await cookies();

  const payload: payloadType = {
    password: body.password,
    userId: body.userId,
  };

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "아이디가 없습니다!" },
        { status: 400 }
      );
    } else {
      const passwordMatch = await bcrypt.compare(
        payload.password,
        user.password
      );

      if (passwordMatch) {
        const jwtToken = await generateJWT(body);
        const preDecodedBucketUrl = await bucketAuth();
        const bucketUrl = decodeURIComponent(
          JSON.stringify(preDecodedBucketUrl)
        );

        cookieStore.set("bucketUrl", bucketUrl, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 6,
        });
        cookieStore.set("jwtToken", jwtToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 6,
        });

        return NextResponse.json(
          { passwordMatch: passwordMatch },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { passwordMatch: passwordMatch },
          { status: 401 }
        );
      }
    }
  } catch (err) {
    console.error("로그인 DB 에러: " + err);
    return NextResponse.json(
      { message: "로그인 DB 에러: " + err },
      { status: 500 }
    );
  }
}
