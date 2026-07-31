"use client";

import { AlertTriangle, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { type ImportResult, importPlayersAction } from "@/app/admin/actions";
import { Modal } from "@/components/ui/modal";
import { type CsvImportPreview, parsePlayerCsv } from "@/lib/csv";
import { type Player, type Team } from "@/lib/types";

const TEMPLATE = "PlayerName,JerseyName,Number,Captain,TeamId";

export function CsvImport({ teams, roster }: { teams: Team[]; roster: Player[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<CsvImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [importing, startImport] = useTransition();

  const teamName = (id: number) => teams.find((team) => team.id === id)?.name ?? `Team ${id}`;

  const handleFile = async (file: File) => {
    setFileError(null);
    setResult(null);

    try {
      const text = await file.text();
      setPreview(parsePlayerCsv(text, new Set(teams.map((team) => team.id)), roster));
    } catch {
      setFileError("That file could not be read.");
    }
  };

  const close = () => {
    setPreview(null);
    setResult(null);
  };

  const runImport = () => {
    if (!preview?.rows.length) {
      return;
    }

    const rows = preview.rows;
    startImport(async () => {
      const outcome = await importPlayersAction(rows);
      setPreview(null);
      setResult(outcome);
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        data-testid="admin-csv-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
          // Allow re-selecting the same filename.
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title={`CSV columns: ${TEMPLATE}`}
        data-testid="admin-csv-button"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-3.5 py-2 text-[12px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
      >
        <Upload className="h-3.5 w-3.5" />
        Import CSV
      </button>

      {fileError ? (
        <span className="text-[11.5px] font-semibold text-[var(--pink)]">{fileError}</span>
      ) : null}

      {/* Preview before committing anything */}
      <Modal
        open={preview !== null}
        onClose={close}
        title="Import players"
        description={
          preview
            ? `${preview.rows.length} row${preview.rows.length === 1 ? "" : "s"} ready${
                preview.issues.length ? `, ${preview.issues.length} skipped` : ""
              }.`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          {preview?.rows.length ? (
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-[var(--surface-2)]">
                  <tr className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                    <th className="px-3 py-2 font-medium">Player</th>
                    <th className="px-3 py-2 font-medium">Jersey</th>
                    <th className="px-3 py-2 text-center font-medium">No.</th>
                    <th className="px-3 py-2 font-medium">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, index) => (
                    <tr key={index} className="border-t border-border/70">
                      <td className="px-3 py-2 text-[12.5px] font-bold">
                        {row.name}
                        {row.isCaptain ? (
                          <span className="ml-1.5 rounded-full bg-[image:var(--grad)] px-1.5 py-0.5 font-mono text-[9px] text-white">
                            C
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] uppercase text-muted-foreground">
                        {row.jerseyName}
                      </td>
                      <td className="px-3 py-2 text-center text-[12.5px] font-semibold">
                        {row.shirtNumber}
                      </td>
                      <td className="px-3 py-2 text-[12.5px] text-muted-foreground">
                        {teamName(row.teamId)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="m-0 text-[12.5px] font-semibold text-[var(--faint)]">
              No usable rows. Expected columns: {TEMPLATE}
            </p>
          )}

          {preview?.issues.length ? (
            <div className="flex max-h-32 flex-col gap-1.5 overflow-y-auto rounded-xl border border-[var(--pink)]/50 bg-[image:var(--grad-soft)] p-3">
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--pink)]">
                <AlertTriangle className="h-3 w-3" />
                Skipped rows
              </span>
              {preview.issues.map((issue, index) => (
                <span key={index} className="text-[11.5px] font-semibold text-muted-foreground">
                  Line {issue.line}: {issue.message}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-border px-4.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={runImport}
              disabled={!preview?.rows.length || importing}
              data-testid="admin-csv-confirm"
              className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            >
              {importing ? "Importing…" : `Import ${preview?.rows.length ?? 0}`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Outcome */}
      <Modal
        open={result !== null}
        onClose={() => setResult(null)}
        title="Import complete"
        description={
          result ? `${result.added} player${result.added === 1 ? "" : "s"} added.` : undefined
        }
      >
        <div className="flex flex-col gap-4">
          {result?.skipped.length ? (
            <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-xl border border-border p-3">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]">
                Not imported
              </span>
              {result.skipped.map((entry, index) => (
                <span key={index} className="text-[11.5px] font-semibold text-muted-foreground">
                  <span className="text-foreground">{entry.row}</span> — {entry.reason}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              data-testid="admin-csv-done"
              onClick={() => setResult(null)}
              className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white transition-transform hover:-translate-y-px"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
