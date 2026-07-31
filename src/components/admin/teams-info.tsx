"use client";

import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { CsvImport } from "@/components/admin/csv-import";
import { PlayerFormDialog } from "@/components/admin/player-form-dialog";
import { TeamLogo } from "@/components/league/team-logo";
import { Modal } from "@/components/ui/modal";
import { addPlayerAction, removePlayerAction, updatePlayerAction } from "@/app/admin/actions";
import { type Player, type PlayerDraft, type Team } from "@/lib/types";

const rosterColumns = "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_72px_84px]";

type FormState =
  | { mode: "add"; team: Team }
  | { mode: "edit"; team: Team; player: Player }
  | null;

/** Captain's armband. */
function CaptainBadge() {
  return (
    <span
      title="Team captain"
      aria-label="Team captain"
      className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-heading text-[10px] leading-none text-white"
    >
      C
    </span>
  );
}

export function TeamsInfo({ teams, roster }: { teams: Team[]; roster: Player[] }) {
  // Only one team may be expanded at a time.
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Player | null>(null);
  const [, startSaving] = useTransition();

  const squadOf = (teamId: number) =>
    roster
      .filter((player) => player.teamId === teamId)
      .sort((a, b) => a.shirtNumber - b.shirtNumber);

  const handleSave = (draft: PlayerDraft) => {
    if (!form) {
      return;
    }

    const target = form;
    startSaving(async () => {
      if (target.mode === "add") {
        await addPlayerAction(target.team.id, draft);
      } else {
        await updatePlayerAction(target.player.id, draft);
      }
    });

    setForm(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-border bg-[var(--surface)] px-4 py-3 sm:px-5">
        <span className="text-[12.5px] font-semibold leading-tight text-muted-foreground">
          Add a whole squad at once from a CSV file.
        </span>
        <CsvImport teams={teams} roster={roster} />
      </div>

      {[...teams]
        .sort((a, b) => a.id - b.id)
        .map((team) => {
          const squad = squadOf(team.id);
          const expanded = expandedTeamId === team.id;

          return (
            <div
              key={team.id}
              className="overflow-hidden rounded-[18px] border border-border bg-[var(--surface)]"
            >
              <div
                className={`flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5 ${
                  expanded ? "border-b border-border bg-[var(--surface-2)]" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedTeamId(expanded ? null : team.id)}
                  aria-expanded={expanded}
                  data-testid={`admin-team-row-${team.id}`}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <span className="w-6 shrink-0 font-mono text-[11px] text-[var(--faint)]">
                    {String(team.id).padStart(2, "0")}
                  </span>
                  <TeamLogo team={team} size="md" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-extrabold leading-tight">
                      {team.name}
                    </span>
                    <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">
                      {squad.length} players
                    </span>
                  </span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExpandedTeamId(team.id);
                    setForm({ mode: "add", team });
                  }}
                  data-testid={`admin-add-player-${team.id}`}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[image:var(--grad)] px-3.5 py-2 text-[12px] font-extrabold leading-none text-white transition-transform hover:-translate-y-px"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              {expanded ? (
                <div className="overflow-x-auto px-4 py-3 sm:px-5">
                  <div className="min-w-[440px]">
                    <div
                      className={`grid ${rosterColumns} gap-3 border-b border-border pb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]`}
                    >
                      <span>Player name</span>
                      <span>Jersey name</span>
                      <span className="text-center">Number</span>
                      <span className="text-right">Actions</span>
                    </div>

                    {squad.length ? (
                      squad.map((player) => (
                        <div
                          key={player.id}
                          className={`grid ${rosterColumns} items-center gap-3 border-b border-border/70 py-2.5 last:border-b-0`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-[13px] font-bold leading-tight">
                              {player.name}
                            </span>
                            {player.isCaptain ? <CaptainBadge /> : null}
                          </span>
                          <span className="truncate font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground">
                            {player.jerseyName}
                          </span>
                          <span className="text-center font-heading text-[16px] leading-none">
                            {player.shirtNumber}
                          </span>
                          <span className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setForm({ mode: "edit", team, player })}
                              aria-label={`Edit ${player.name}`}
                              data-testid={`admin-edit-player-${player.id}`}
                              className="grid h-7.5 w-7.5 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingRemoval(player)}
                              aria-label={`Remove ${player.name}`}
                              data-testid={`admin-remove-player-${player.id}`}
                              className="grid h-7.5 w-7.5 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--pink)] hover:text-[var(--pink)]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="m-0 py-5 text-center text-[12.5px] font-semibold text-[var(--faint)]">
                        No players yet — use Add to build the squad.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

      {form ? (
        <PlayerFormDialog
          open
          // Remount per target so the fields reset between add and edit.
          key={form.mode === "edit" ? `edit-${form.player.id}` : `add-${form.team.id}`}
          mode={form.mode}
          teamName={form.team.name}
          squad={squadOf(form.team.id)}
          player={form.mode === "edit" ? form.player : undefined}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      ) : null}

      <Modal
        open={pendingRemoval !== null}
        onClose={() => setPendingRemoval(null)}
        title="Remove player"
        description={
          pendingRemoval
            ? `${pendingRemoval.name} will be removed from the squad. This cannot be undone.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setPendingRemoval(null)}
            className="rounded-full border border-border px-4.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="admin-confirm-remove"
            onClick={() => {
              if (pendingRemoval) {
                const { id } = pendingRemoval;
                startSaving(async () => {
                  await removePlayerAction(id);
                });
              }
              setPendingRemoval(null);
            }}
            className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white transition-transform hover:-translate-y-px"
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
}
