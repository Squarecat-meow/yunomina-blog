import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: "놋치미나 블로그의 Outbox",
    type: "OrderedCollection",
    totalItems: 0,
    orderedItems: [],
  });
}
