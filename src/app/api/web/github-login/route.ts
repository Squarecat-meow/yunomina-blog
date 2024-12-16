import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  if (!code) return sendApiError(400, "확인 코드가 확실치 않아요!");

  const tokenRes = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  if (!tokenRes.ok) return sendApiError(tokenRes.status, tokenRes.statusText);

  const token = await tokenRes.json();

  const githubProfileRes = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Token ${token.access_token}`,
      accept: "application/json",
    },
  });
  if (!githubProfileRes.ok)
    return sendApiError(githubProfileRes.status, githubProfileRes.statusText);

  const githubProfile = await githubProfileRes.json();

  return NextResponse.json(githubProfile);
}
