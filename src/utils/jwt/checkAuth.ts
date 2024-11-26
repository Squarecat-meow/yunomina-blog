"use server";

import { jwtVerify, JWTVerifyResult } from "jose";

export async function checkAuth(token: string) {
  //const jwtToken = await getCookie("jwtToken");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (token) {
    const { payload } = (await jwtVerify(token, secret)) as JWTVerifyResult<{
      userId: string;
    }>;
    return payload.userId;
  } else {
    throw new Error("토큰이 없습니다!");
  }
}
