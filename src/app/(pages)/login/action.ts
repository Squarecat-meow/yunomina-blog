"use server";

import { ProfileDto } from "@/app/_dto/profile.dto";
import { PrismaClient } from "@prisma/client";

export async function fetchProfile(
  userId: string
): Promise<ProfileDto | undefined> {
  const prisma = new PrismaClient();

  try {
    const profile = await prisma.profile.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
    if (profile) return profile;
  } catch (err) {
    console.error("프로필 불러오기 에러: " + err);
  }
}
