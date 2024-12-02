"use server";

import { putObject } from "@/utils/s3/bucketStorage";

export async function uploadToS3(blob: Blob) {
  const fileName = crypto.randomUUID();

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const res = putObject.put(fileName, buffer, blob.type);

  return res;
}
