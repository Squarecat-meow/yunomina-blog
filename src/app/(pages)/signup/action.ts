"use server";

import { signDto } from "@/app/_dto/sign.dto";
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  const saltRound = 15;

  return new Promise<string>((res) => {
    bcrypt.hash(password, saltRound, async (err, hash) => {
      if (err) {
        console.error("패스워드 해싱 중 에러: " + err);
      }
      res(hash);
    });
  });
}

export async function postSignup({
  invitationCode,
  userId,
  password,
}: signDto) {
  const hashedPasswd = await hashPassword(password);
  const payloadWithHashedPassword: signDto = {
    userId: userId,
    password: hashedPasswd,
    invitationCode: invitationCode,
  };

  return payloadWithHashedPassword;
}
