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

export async function getCategory() {
  const category = await prisma.category.findMany();

  return category;
}

export async function createCategory(category: string) {
  const createdCategory = await prisma.category.create({
    data: { category: category },
  });

  return createdCategory;
}
