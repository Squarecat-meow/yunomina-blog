"use server";

import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";

const prisma = GetPrismaClient.getClient();

export default async function getCategories() {
  const categories = await prisma.profile.findMany({
    include: {
      ownedCategory: true,
    },
  });

  if (!categories) return null;

  return categories;
}
