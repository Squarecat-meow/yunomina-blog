import { signDto } from "@/app/_dto/sign.dto";
import { SignJWT } from "jose";

export async function generateJWT(payload: signDto) {
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
