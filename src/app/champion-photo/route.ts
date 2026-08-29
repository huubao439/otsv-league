import { getChampionPhoto } from "@/lib/server/league-data";

/**
 * Serves the stored champion photo as a real image response.
 *
 * The photo lives in the KV store as a data URL, but inlining ~1 MB of base64
 * into the home page's HTML would dwarf the rest of the payload. Rendering an
 * `<img src="/champion-photo?v=…">` instead keeps the page small and lets the
 * browser cache the bytes. The `v` query carries the photo's `updatedAt`, so
 * the response can be immutable and a replacement still shows immediately.
 */
export async function GET() {
  const dataUrl = await getChampionPhoto();
  const parsed = dataUrl
    ? /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i.exec(dataUrl)
    : null;

  if (!parsed) {
    return new Response("No champion photo has been uploaded.", { status: 404 });
  }

  const [, contentType, base64] = parsed;
  const bytes = Buffer.from(base64, "base64");
  // Copy out of Buffer's shared pool, otherwise the slice would carry the whole
  // pool's bytes along with it.
  const body = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
