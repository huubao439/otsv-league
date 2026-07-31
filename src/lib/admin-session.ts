/**
 * Admin session cookie.
 *
 * Replaces HTTP Basic Auth, which cannot be logged out of reliably — browsers
 * cache the credentials for the realm and keep re-sending them. A signed cookie
 * can simply be deleted.
 *
 * The token is `<issuedAt>.<HMAC(issuedAt)>`, keyed on the admin credentials
 * themselves, so no extra secret is needed and changing the password
 * invalidates every existing session. Uses Web Crypto so it runs in the proxy
 * (edge) as well as in server actions (node).
 */
export const ADMIN_COOKIE = "otsv_admin_session";

/** Sessions last a working day. */
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

export type AdminCredentials = { username: string; password: string };

export function getAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_BASIC_AUTH_USERNAME;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  return username && password ? { username, password } : null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, { username, password }: AdminCredentials): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${username}:${password}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return toBase64Url(new Uint8Array(signature));
}

/** Length-safe comparison so a wrong token cannot be probed byte by byte. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createSessionToken(credentials: AdminCredentials): Promise<string> {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${await sign(issuedAt, credentials)}`;
}

export async function isValidSessionToken(
  token: string | undefined,
  credentials: AdminCredentials,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const separator = token.lastIndexOf(".");
  if (separator === -1) {
    return false;
  }

  const issuedAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) {
    return false;
  }
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  return timingSafeEqual(signature, await sign(issuedAt, credentials));
}
