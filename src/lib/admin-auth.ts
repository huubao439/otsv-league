/**
 * Admin routes are protected by HTTP Basic Auth in src/proxy.ts.
 *
 * This helper now controls only whether the admin link is shown in the navbar.
 */
export const ADMIN_PREVIEW_UNLOCKED = true;

export function isAdminSession(): boolean {
  return ADMIN_PREVIEW_UNLOCKED;
}
