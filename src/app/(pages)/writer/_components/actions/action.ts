"use server";

import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { putObject } from "@/utils/s3/bucketStorage";

const prisma = GetPrismaClient.getClient();

export async function uploadToS3(blob: Blob) {
  const fileName = crypto.randomUUID();

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const res = putObject.put(fileName, buffer, blob.type);

  return res;
}

export async function getCategory(id: number) {
  const category = await prisma.profile.findMany({
    where: {
      id: id,
    },
    select: {
      ownedCategory: true,
    },
  });

  return category;
}

export async function createCategory(category: string, owner: number) {
  const createdCategory = await prisma.category.create({
    data: { category: category, ownerId: owner },
  });

  return createdCategory;
}

export async function fetchEmojiArray() {
  const emojiArray = await prisma.emojis.findMany();

  return emojiArray;
}
