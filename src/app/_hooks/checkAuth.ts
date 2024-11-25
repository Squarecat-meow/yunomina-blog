import { jwtVerify, JWTVerifyResult } from "jose";
import { getCookie } from "../_actions/getCookie";

export async function checkAuth() {
  const jwtToken = await getCookie("jwtToken");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (jwtToken) {
    const { payload } = (await jwtVerify(
      jwtToken.value,
      secret
    )) as JWTVerifyResult<{ userId: string }>;
    return payload.userId;
  } else {
    throw new Error("토큰이 없습니다!");
  }
}
