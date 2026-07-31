import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCredentials, isValidSessionToken } from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

/**
 * Guards the admin area with a signed session cookie.
 *
 * This replaced HTTP Basic Auth: browsers cache basic credentials for the realm
 * and re-send them automatically, so there is no reliable way to log out. The
 * login page itself is exempt, otherwise redirecting to it would loop.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH || pathname === `${LOGIN_PATH}/`) {
    return NextResponse.next();
  }

  const credentials = getAdminCredentials();
  if (!credentials) {
    return new NextResponse(
      "Admin auth is not configured: set ADMIN_BASIC_AUTH_USERNAME and ADMIN_BASIC_AUTH_PASSWORD.",
      { status: 500 },
    );
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await isValidSessionToken(token, credentials)) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  // Send the visitor back where they were headed once signed in.
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
