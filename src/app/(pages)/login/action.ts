"use server";

import { ProfileDto } from "@/app/_dto/profile.dto";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";

export async function fetchProfile(
  userId: string
): Promise<ProfileDto | undefined> {
  const prisma = GetPrismaClient.getClient();

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
