"use client";

import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import {
  deleteMatchImageAction,
  getMatchImageAction,
  saveMatchImageAction,
} from "@/app/admin/actions";
import { Modal } from "@/components/ui/modal";
import { compressImage } from "@/lib/image-compress";

const MAX_INPUT_BYTES = 12 * 1024 * 1024;

/**
 * Upload / view / remove a single match-sheet photo. The image is compressed in
 * the browser and stored server-side, so it is visible to any admin on any
 * device — not just this browser.
 */
export function MatchImage({ matchId, hasImage }: { matchId: number; hasImage: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [present, setPresent] = useState(hasImage);
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [viewSrc, setViewSrc] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);

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
        const dataUrl = await compressImage(file);
        const result = await saveMatchImageAction(matchId, dataUrl);
        if (!result.ok) {
          setError(result.error ?? "Upload failed.");
          return;
        }
        setPresent(true);
        // Drop the cached copy so a Replace is re-fetched next time View opens.
        setViewSrc(null);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Upload failed.");
      }
    });
  };

  const openViewer = () => {
    setViewing(true);
    if (viewSrc) {
      return;
    }
    startBusy(async () => {
      const src = await getMatchImageAction(matchId);
      setViewSrc(src);
    });
  };

  const remove = () => {
    startBusy(async () => {
      await deleteMatchImageAction(matchId);
      setPresent(false);
      setViewSrc(null);
      setViewing(false);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid={`admin-match-image-input-${matchId}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleFile(file);
          }
          event.target.value = "";
        }}
      />

      {present ? (
        <button
          type="button"
          onClick={openViewer}
          disabled={busy}
          data-testid={`admin-match-image-view-${matchId}`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[image:var(--grad-soft)] px-3.5 py-2 text-[12px] font-bold leading-none text-foreground transition-colors hover:border-[var(--pink)]"
        >
          <ImageUp className="h-3.5 w-3.5" />
          View sheet
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        data-testid={`admin-match-image-upload-${matchId}`}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-3.5 py-2 text-[12px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageUp className="h-3.5 w-3.5" />}
        {present ? "Replace" : "Upload sheet"}
      </button>

      {present ? (
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label="Remove match sheet"
          data-testid={`admin-match-image-remove-${matchId}`}
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--pink)] hover:text-[var(--pink)] disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}

      {error ? (
        <span className="w-full text-[11.5px] font-semibold text-[var(--pink)]">{error}</span>
      ) : null}

      <Modal
        open={viewing}
        onClose={() => setViewing(false)}
        title="Match sheet"
        description="Uploaded match detail paper."
      >
        <div className="flex flex-col gap-3">
          {viewSrc ? (
            // Stored data URL — a plain <img> is the right tool here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={viewSrc}
              alt="Match detail sheet"
              className="max-h-[70vh] w-full rounded-xl border border-border object-contain"
            />
          ) : (
            <div className="flex items-center justify-center gap-2 py-10 text-[12.5px] font-semibold text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
