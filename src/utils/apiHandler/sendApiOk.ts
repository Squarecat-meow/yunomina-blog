import { NextResponse } from "next/server";

export function sendApiOk(message: string | string[]) {
  return NextResponse.json({ message: message }, { status: 200 });
}
