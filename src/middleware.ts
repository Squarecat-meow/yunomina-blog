import { checkAuth } from "@/utils/jwt/checkAuth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwtToken");

  if (token) {
    const userId = checkAuth(token.value);
    if (!userId) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }
  } else {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/setting/:path*",
};
