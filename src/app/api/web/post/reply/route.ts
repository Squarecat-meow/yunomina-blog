import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { NextRequest, NextResponse } from "next/server";

const prisma = GetPrismaClient.getClient();

export async function POST(req: NextRequest) {
  const apiUrl = req.headers.get("url");
  const requestId = req.headers.get("id");

  if (!apiUrl || !requestId) return sendApiError(400, "정보가 없어요!");

  const profile = await fetch(apiUrl);

  if (!profile.ok) return sendApiError(404, "정보가 없어요!");

  const fetchedProfile = await profile.json();
  const id = fetchedProfile.id;

  if (id !== parseInt(requestId)) return sendApiError(403, "정보가 없어요!");

  const reply = await req.json();

  const replyResult = await prisma.reply.createManyAndReturn({
    data: {
      postId: reply.postId,
      avatar: reply.avatar ?? null,
      name: reply.name,
      text: reply.reply,
    },
  });

  return NextResponse.json(replyResult, { status: 200 });
}
