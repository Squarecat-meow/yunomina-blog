"use server";

import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";

export default async function getCategories() {
  const prisma = GetPrismaClient.getClient();

  const categories = await prisma.category.findMany({
    include: {
      owner: true,
    },
  });

  if (!categories) return null;

  return categories;
}
