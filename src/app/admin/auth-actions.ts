"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminCredentials,
} from "@/lib/admin-session";

export type LoginState = { error?: string };

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return { error: "Admin auth is not configured on the server." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (username !== credentials.username || password !== credentials.password) {
    return { error: "Wrong username or password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(credentials), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  const from = String(formData.get("from") ?? "/admin");
  // Only allow redirects back into the admin area.
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/");
}
