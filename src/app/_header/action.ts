"use server";

import { cookies } from "next/headers";

export async function purgeCookies() {
  const cookieStore = await cookies();

  cookieStore.getAll().map((cookie) => cookieStore.delete(cookie.name));
}
