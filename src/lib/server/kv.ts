import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Tiny key/value layer with two backends:
 *
 *  - **Upstash Redis** when UPSTASH_REDIS_REST_URL / _TOKEN are set. Talks the
 *    plain REST API over fetch, so there is no driver dependency and nothing to
 *    pool — which is what makes it safe in serverless functions.
 *  - **A local JSON file** otherwise, so `npm run dev` works with no account.
 *    The file lives in .data/ (gitignored) and is never used on Vercel, whose
 *    filesystem is read-only at runtime.
 */
const REST_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const usingRedis = Boolean(REST_URL && REST_TOKEN);

const LOCAL_FILE = join(process.cwd(), ".data", "store.json");

async function readLocal(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await readFile(LOCAL_FILE, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

async function writeLocal(all: Record<string, string>) {
  await mkdir(dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(all, null, 2), "utf8");
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!usingRedis) {
    const raw = (await readLocal())[key];
    return raw === undefined ? null : (JSON.parse(raw) as T);
  }

  const response = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis GET ${key} failed: ${response.status} ${await response.text()}`);
  }

  const { result } = (await response.json()) as { result: string | null };
  return result === null ? null : (JSON.parse(result) as T);
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  const payload = JSON.stringify(value);

  if (!usingRedis) {
    const all = await readLocal();
    all[key] = payload;
    await writeLocal(all);
    return;
  }

  const response = await fetch(`${REST_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis SET ${key} failed: ${response.status} ${await response.text()}`);
  }
}
