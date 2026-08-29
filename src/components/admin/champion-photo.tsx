"use client";

import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import {
  deleteChampionPhotoAction,
  getChampionPhotoAction,
  saveChampionPhotoAction,
} from "@/app/admin/actions";
import { TeamLogo } from "@/components/league/team-logo";
import { compressImageWithSize } from "@/lib/image-compress";
import { type Team } from "@/lib/types";

const MAX_INPUT_BYTES = 12 * 1024 * 1024;

/**
 * Uploads the champion team photo shown in the home page's champion badge.
 * There is one photo for the whole season, so this is a single upload / replace
 * / remove control rather than a list.
 *
 * The preview loads the stored data URL on demand; the public page instead
 * points at /champion-photo, which serves the same bytes as an image.
 */
export function ChampionPhoto({
  champion,
  hasPhoto,
  photoVersion,
  seasonComplete,
}: {
  champion?: Team;
  hasPhoto: boolean;
  photoVersion: number | null;
  seasonComplete: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [present, setPresent] = useState(hasPhoto);
  // Seeded from the server so an already-uploaded photo shows without a round trip.
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    hasPhoto && photoVersion !== null ? `/champion-photo?v=${photoVersion}` : null,
  );
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("Image must be under 12 MB.");
      return;
    }

    startBusy(async () => {
      try {
        const { dataUrl, width, height } = await compressImageWithSize(file);
        const result = await saveChampionPhotoAction(dataUrl, { width, height });
        if (!result.ok) {
          setError(result.error ?? "Upload failed.");
          return;
        }
        setPresent(true);
        // Show what was just compressed — the route's own copy is cached hard.
        setPreviewSrc(dataUrl);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Upload failed.");
      }
    });
  };

  const remove = () => {
    startBusy(async () => {
      await deleteChampionPhotoAction();
      setPresent(false);
      setPreviewSrc(null);
    });
  };

  const reload = () => {
    startBusy(async () => {
      setPreviewSrc(await getChampionPhotoAction());
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-border bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--faint)]">
            Champion badge
          </span>
          <h2 className="m-0 font-heading text-[26px] uppercase leading-none">Champion photo</h2>
          <p className="m-0 max-w-[60ch] text-[12.5px] font-semibold leading-[1.5] text-muted-foreground">
            Shown in the champion badge at the top of the home page. Uploading a photo also
            publishes the badge, so it appears even before the final result is in.
          </p>
        </div>

        {champion ? (
          <span className="flex items-center gap-2.5 rounded-full border border-border bg-[var(--surface-2)] px-3.5 py-2">
            <TeamLogo team={champion} size="sm" shape="bare" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-extrabold leading-none">{champion.name}</span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
                {seasonComplete ? "Champions" : "Table leaders"}
              </span>
            </span>
          </span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid="admin-champion-photo-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleFile(file);
          }
          event.target.value = "";
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          data-testid="admin-champion-photo-upload"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[image:var(--grad)] px-4 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImageUp className="h-3.5 w-3.5" />
          )}
          {present ? "Replace photo" : "Upload champion photo"}
        </button>

        {present ? (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            data-testid="admin-champion-photo-remove"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--pink)] hover:text-[var(--pink)] disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <span className="text-[11.5px] font-semibold text-[var(--pink)]">{error}</span>
      ) : null}

      <div className="relative w-full overflow-hidden rounded-[16px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]">
        {present ? (
          previewSrc ? (
            // Stored data URL or the versioned route — a plain <img> is right here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt="Champion team photo"
              className="block h-auto w-full"
              onError={reload}
            />
          ) : (
            <span className="flex h-[220px] items-center justify-center gap-2 text-[12.5px] font-semibold text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </span>
          )
        ) : (
          <span className="flex h-[220px] flex-col items-center justify-center gap-2 px-6 text-center sm:h-[300px]">
            <ImageUp className="h-6 w-6 text-[var(--faint)]" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--faint)]">
              No photo yet
            </span>
            <span className="text-[12.5px] font-semibold text-muted-foreground">
              A wide, landscape shot of the winning squad works best.
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
