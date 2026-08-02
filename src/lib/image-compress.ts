"use client";

/**
 * Compresses an image file to a JPEG data URL under a size budget, so a photo
 * of a match sheet stays small enough for the KV store. Scales the longest side
 * down and steps quality until the encoded string fits, then returns the data
 * URL to hand to the upload action.
 */
const MAX_DIMENSION = 1400;
const MAX_CHARS = 1_200_000; // ~900 KB of image data once base64-encoded

export async function compressImage(file: File): Promise<string> {
  const bitmap = await loadBitmap(file);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is unavailable in this browser.");
  }
  context.drawImage(bitmap, 0, 0, width, height);

  for (const quality of [0.82, 0.7, 0.58, 0.45, 0.35]) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= MAX_CHARS) {
      return dataUrl;
    }
  }

  throw new Error("Image is too large — try a smaller photo.");
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> path.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("That file could not be read as an image."));
      image.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}
