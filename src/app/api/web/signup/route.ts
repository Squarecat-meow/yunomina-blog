import { signupDto } from "@/app/_dto/signup.dto";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prisma = new PrismaClient();

  if (
    body.invitationCode !== process.env.NEXT_PUBLIC_INVITATION_CODE ||
    !body.invitationCode
  ) {
    return NextResponse.json(
      { message: "초대코드가 일치하지 않습니다!" },
      { status: 401 }
    );
  }

  await prisma.user.create({
    data: {
      userId: body.userId,
      password: body.password,
    },
  });

  const jwtToken = await generateJWT(body);

  return NextResponse.json(
    { userId: body.userId },
    {
      status: 200,
      headers: {
        "Set-Cookie": `jwtToken=${jwtToken}; sameSite=strict; httpOnly=true; maxAge=60*60*6`,
      },
    }
  );
}

async function generateJWT(payload: signupDto) {
  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const webUrl = process.env.WEB_URL;
  const jwtToken = await new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(`${webUrl}`)
    .setExpirationTime("6h")
    .sign(secret);

  return jwtToken;
}
