"use server";

import { cookies } from "next/headers";

export async function handleLogout() {
  const cookieStore = await cookies();

  cookieStore.delete("profile");
}
