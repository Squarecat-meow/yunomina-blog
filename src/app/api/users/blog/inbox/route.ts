import { NextResponse } from "next/server";
import { parseRequest } from "http-signature";
import { ClientRequest } from "http";

export async function POST(req: ClientRequest) {
  const signature = parseRequest(req);

  console.log(req, signature);

  return NextResponse.json({});
}
