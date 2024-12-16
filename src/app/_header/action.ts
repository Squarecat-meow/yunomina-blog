"use server";

import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { cookies } from "next/headers";

export async function purgeCookies() {
  const cookieStore = await cookies();

  cookieStore.getAll().map((cookie) => cookieStore.delete(cookie.name));
}

export async function getProfile(userId: string) {
  const prisma = GetPrismaClient.getClient();

  try {
    const profile = await prisma.profile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

    return profile;
  } catch (err) {
    throw err;
  }
}
