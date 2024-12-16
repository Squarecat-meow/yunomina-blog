import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { NextRequest, NextResponse } from "next/server";

const prisma = GetPrismaClient.getClient();

export async function POST(req: NextRequest) {
  const address = await req.text();

  const emojiArray = await fetch(`${address}/api/emojis`).then((r) => r.json());

  await prisma.emojis.deleteMany();

  const createMany = await prisma.emojis.createMany({
    data: emojiArray.emojis,
  });

  console.log(createMany);

  return NextResponse.json({}, { status: 200 });
}
