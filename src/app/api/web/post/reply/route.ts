import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { GetPrismaClient } from "@/utils/getPrismaClient/getPrismaClient";
import { NextRequest, NextResponse } from "next/server";

const prisma = GetPrismaClient.getClient();

export async function POST(req: NextRequest) {
  try {
    const apiUrl = req.headers.get("url");
    const requestId = req.headers.get("id");

    if (!apiUrl || !requestId) return sendApiError(400, "정보가 없어요!");

    const profile = await fetch(apiUrl);

    if (!profile.ok) return sendApiError(404, "정보가 없어요!");

    const fetchedProfile = await profile.json();
    const id = fetchedProfile.id;

    if (id !== parseInt(requestId)) return sendApiError(403, "정보가 없어요!");

    const payload = await req.json();

    console.log(payload);

    if (!payload) return sendApiError(400, "댓글 정보가 확실치 않아요!");

    const replyResult = await prisma.reply.create({
      data: {
        postId: parseInt(payload.postId),
        avatar: payload.avatar ?? null,
        name: payload.name,
        text: payload.reply,
        githubId: payload.githubId,
      },
    });

    return NextResponse.json(replyResult, { status: 200 });
  } catch (error) {
    return sendApiError(500, "댓글을 작성하는 중 에러가 발생했어요!");
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const postId = params.get("id");
    if (!postId) return sendApiError(404, "포스트를 찾을 수 없어요!");
    const replyes = await prisma.reply.findMany({
      where: {
        postId: parseInt(postId),
      },
    });
    return NextResponse.json(replyes, { status: 200 });
  } catch (error) {
    return sendApiError(500, "댓글을 불러오는 중 에러가 발생했어요!");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const replyId = params.get("replyId");
    if (!replyId) return sendApiError(404, "지울 댓글이 없어요!");

    await prisma.reply.delete({
      where: {
        id: parseInt(replyId),
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return sendApiError(500, `댓글을 지우는데 오류가 발생했어요!, ${error}`);
  }
}
