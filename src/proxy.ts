import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_REALM = "OTSV Admin";
const ADMIN_PAGE_PATHS = new Set(["/admin", "/admin/"]);

type BasicCredentials = {
  username: string;
  password: string;
};

function unauthorizedResponse(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm=\"${AUTH_REALM}\", charset=\"UTF-8\"`,
    },
  });
}

function parseBasicCredentials(headerValue: string | null): BasicCredentials | null {
  if (!headerValue?.startsWith("Basic ")) {
    return null;
  }

  const encoded = headerValue.slice(6).trim();
  if (!encoded) {
    return null;
  }

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return null;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

export function proxy(request: NextRequest) {
  if (!ADMIN_PAGE_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.ADMIN_BASIC_AUTH_USERNAME;
  const expectedPassword = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Admin basic auth is not configured on the server.", {
      status: 500,
    });
  }

  const credentials = parseBasicCredentials(request.headers.get("authorization"));
  const isValid =
    credentials?.username === expectedUsername &&
    credentials?.password === expectedPassword;

  if (!isValid) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};