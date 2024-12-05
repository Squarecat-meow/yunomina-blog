import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { generateJWT } from "../../functions/generateJwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prisma = new PrismaClient();
  const cookieStore = await cookies();

  if (
    body.invitationCode !== process.env.NEXT_PUBLIC_INVITATION_CODE ||
    !body.invitationCode
  ) {
    return NextResponse.json(
      { message: "초대코드가 일치하지 않습니다!" },
      { status: 401 }
    );
  }

  try {
    await prisma.user.create({
      data: {
        userId: body.userId,
        password: body.password,
        profile: {
          create: {
            avatarUrl: null,
          },
        },
      },
    });

    const jwtToken = await generateJWT(body);

    cookieStore.set("jwtToken", jwtToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 6,
    });

    return NextResponse.json(
      { userId: body.userId, avatarUrl: null },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "회원가입중 에러: " + err },
      { status: 500 }
    );
  }
}
