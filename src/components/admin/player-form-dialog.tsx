"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { type Player, type PlayerDraft } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-border bg-[var(--surface-2)] px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors focus:border-[var(--pink)]";
const labelClass =
  "font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]";

type Errors = Partial<Record<keyof PlayerDraft, string>>;

function validate(draft: PlayerDraft, squad: Player[], editingId?: number): Errors {
  const errors: Errors = {};

  if (!draft.name.trim()) {
    errors.name = "Player name is required.";
  }
  if (!draft.jerseyName.trim()) {
    errors.jerseyName = "Jersey name is required.";
  }

  if (!Number.isInteger(draft.shirtNumber) || draft.shirtNumber < 1 || draft.shirtNumber > 99) {
    errors.shirtNumber = "Enter a number between 1 and 99.";
  } else if (
    squad.some(
      (player) => player.id !== editingId && player.shirtNumber === draft.shirtNumber,
    )
  ) {
    errors.shirtNumber = "Another player in this team already wears this number.";
  }

  return errors;
}

export function PlayerFormDialog({
  open,
  mode,
  teamName,
  squad,
  player,
  onSave,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  teamName: string;
  /** Current squad, used to keep shirt numbers unique within the team. */
  squad: Player[];
  player?: Player;
  onSave: (draft: PlayerDraft) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(player?.name ?? "");
  const [jerseyName, setJerseyName] = useState(player?.jerseyName ?? "");
  const [shirtNumber, setShirtNumber] = useState(
    player ? String(player.shirtNumber) : "",
  );
  const [isCaptain, setIsCaptain] = useState(player?.isCaptain ?? false);
  const [errors, setErrors] = useState<Errors>({});

  const existingCaptain = squad.find((entry) => entry.isCaptain && entry.id !== player?.id);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const draft: PlayerDraft = {
      name: name.trim(),
      jerseyName: jerseyName.trim(),
      shirtNumber: Number(shirtNumber),
      isCaptain,
    };

    const found = validate(draft, squad, player?.id);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    onSave(draft);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add player" : "Edit player"}
      description={teamName}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Player name</span>
          <input
            className={fieldClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <span className="text-[11.5px] font-semibold text-[var(--pink)]">{errors.name}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Jersey name</span>
          <input
            className={fieldClass}
            value={jerseyName}
            onChange={(event) => setJerseyName(event.target.value)}
            aria-invalid={Boolean(errors.jerseyName)}
          />
          {errors.jerseyName ? (
            <span className="text-[11.5px] font-semibold text-[var(--pink)]">
              {errors.jerseyName}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Jersey number</span>
          <input
            className={fieldClass}
            value={shirtNumber}
            inputMode="numeric"
            onChange={(event) => setShirtNumber(event.target.value.replace(/[^0-9]/g, ""))}
            aria-invalid={Boolean(errors.shirtNumber)}
          />
          {errors.shirtNumber ? (
            <span className="text-[11.5px] font-semibold text-[var(--pink)]">
              {errors.shirtNumber}
            </span>
          ) : null}
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-[var(--surface-2)] p-3.5">
          <input
            type="checkbox"
            checked={isCaptain}
            onChange={(event) => setIsCaptain(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--pink)]"
          />
          <span className="flex flex-col gap-1">
            <span className="text-[13px] font-bold leading-none">Team captain</span>
            <span className="text-[11.5px] font-semibold leading-[1.4] text-muted-foreground">
              {isCaptain && existingCaptain
                ? `${existingCaptain.name} will no longer be captain.`
                : "Each team can only have one captain."}
            </span>
          </span>
        </label>

        <div className="mt-1 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
