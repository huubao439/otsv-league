/**
 * PLACEHOLDER ADMIN GATE — login is not built yet.
 *
 * This phase ships the admin workspace unlocked so it can be reviewed, but every
 * entry point already routes through `isAdminSession()`:
 *   - the "Overall" tab in the navbar is only rendered when it returns true
 *   - the /admin route calls notFound() when it returns false, so typing the URL
 *     directly shows nothing either
 *
 * When the real login lands, replace the body of `isAdminSession()` with the
 * session lookup and delete `ADMIN_PREVIEW_UNLOCKED`. Nothing else needs to
 * change — flip this to `false` to see the locked-down behaviour today.
 */
export const ADMIN_PREVIEW_UNLOCKED = true;

export function isAdminSession(): boolean {
  return ADMIN_PREVIEW_UNLOCKED;
}
