"use server";

import { cookies } from "next/headers";

export async function getCookie(value: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(value);

  if (cookie) {
    return cookie;
  } else {
    return null;
  }
}
