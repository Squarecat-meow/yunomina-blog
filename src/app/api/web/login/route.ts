import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateJWT } from "../../functions/generateJwt";

type payloadType = {
  password: string;
  userId: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prisma = new PrismaClient();

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
        return NextResponse.json(
          { passwordMatch: passwordMatch },
          {
            status: 200,
            headers: {
              "Set-Cookie": `jwtToken=${jwtToken}; sameSite=strict; httpOnly=true; maxAge=60*60*6`,
            },
          }
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
