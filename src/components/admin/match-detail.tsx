"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { TeamLogo } from "@/components/league/team-logo";
import { saveMatchAction } from "@/app/admin/actions";
import { type FixtureRound } from "@/components/league/fixtures-board";
import { formatKickoff, type MatchWithTeams } from "@/data/league";
import { type MatchEvent, type Player, type Team } from "@/lib/types";

const MAX_GOALS = 10;

const cardLabels: Record<"yellow" | "red", string> = {
  yellow: "Yellow card",
  red: "Red card",
};

const fieldClass =
  "rounded-xl border border-border bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-[var(--pink)]";
const labelClass =
  "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--faint)]";
const addButtonClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[image:var(--grad)] px-3.5 py-2 text-[12px] font-extrabold leading-none text-white transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40";
const entryRowClass = "flex items-center gap-2.5 rounded-lg border border-border px-3 py-2";

function newEventId() {
  return `e${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
}

function EntryList({
  entries,
  squad,
  describe,
  onRemove,
  empty,
}: {
  entries: MatchEvent[];
  squad: Player[];
  describe: (event: MatchEvent) => string;
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (!entries.length) {
    return <p className="m-0 text-[11.5px] font-semibold text-[var(--faint)]">{empty}</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
      {entries.map((event) => {
        const player = squad.find((entry) => entry.id === event.playerId);

        return (
          <li key={event.id} className={entryRowClass}>
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold">
              {player ? player.name : "Unknown player"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">
              {describe(event)}
            </span>
            <button
              type="button"
              aria-label={`Remove entry for ${player ? player.name : "player"}`}
              onClick={() => onRemove(event.id)}
              className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--pink)] hover:text-[var(--pink)]"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Player + number of goals, so a hat-trick is one row rather than three. */
function GoalSide({
  team,
  squad,
  events,
  onChange,
}: {
  team: Team;
  squad: Player[];
  events: MatchEvent[];
  onChange: (next: MatchEvent[]) => void;
}) {
  const [playerId, setPlayerId] = useState("");
  const [count, setCount] = useState("1");

  const add = () => {
    if (!playerId) {
      return;
    }
    onChange([
      ...events,
      { id: newEventId(), playerId: Number(playerId), type: "goal", count: Number(count) },
    ]);
    setPlayerId("");
    setCount("1");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2.5">
        <TeamLogo team={team} size="sm" />
        <span className="truncate text-[13px] font-extrabold leading-tight">{team.name}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className={`${fieldClass} min-w-0 flex-1`}
          value={playerId}
          aria-label={`Goalscorer for ${team.name}`}
          data-testid={`admin-goal-player-${team.id}`}
          onChange={(event) => setPlayerId(event.target.value)}
        >
          <option value="">Select player…</option>
          {squad.map((player) => (
            <option key={player.id} value={player.id}>
              {player.shirtNumber}. {player.name}
            </option>
          ))}
        </select>
        <select
          className={fieldClass}
          value={count}
          aria-label={`Number of goals for ${team.name}`}
          data-testid={`admin-goal-count-${team.id}`}
          onChange={(event) => setCount(event.target.value)}
        >
          {Array.from({ length: MAX_GOALS }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {value} {value === 1 ? "goal" : "goals"}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={!playerId}
          data-testid={`admin-goal-add-${team.id}`}
          className={addButtonClass}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <EntryList
        entries={events}
        squad={squad}
        describe={(event) => `${event.count} ${event.count === 1 ? "goal" : "goals"}`}
        onRemove={(id) => onChange(events.filter((entry) => entry.id !== id))}
        empty="No goals recorded."
      />
    </div>
  );
}

/** Player + card colour, one row per card. */
function CardSide({
  team,
  squad,
  events,
  onChange,
}: {
  team: Team;
  squad: Player[];
  events: MatchEvent[];
  onChange: (next: MatchEvent[]) => void;
}) {
  const [playerId, setPlayerId] = useState("");
  const [type, setType] = useState<"yellow" | "red">("yellow");

  const add = () => {
    if (!playerId) {
      return;
    }
    onChange([...events, { id: newEventId(), playerId: Number(playerId), type, count: 1 }]);
    setPlayerId("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2.5">
        <TeamLogo team={team} size="sm" />
        <span className="truncate text-[13px] font-extrabold leading-tight">{team.name}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className={`${fieldClass} min-w-0 flex-1`}
          value={playerId}
          aria-label={`Booked player for ${team.name}`}
          data-testid={`admin-card-player-${team.id}`}
          onChange={(event) => setPlayerId(event.target.value)}
        >
          <option value="">Select player…</option>
          {squad.map((player) => (
            <option key={player.id} value={player.id}>
              {player.shirtNumber}. {player.name}
            </option>
          ))}
        </select>
        <select
          className={fieldClass}
          value={type}
          aria-label={`Card type for ${team.name}`}
          data-testid={`admin-card-type-${team.id}`}
          onChange={(event) => setType(event.target.value as "yellow" | "red")}
        >
          <option value="yellow">Yellow card</option>
          <option value="red">Red card</option>
        </select>
        <button
          type="button"
          onClick={add}
          disabled={!playerId}
          data-testid={`admin-card-add-${team.id}`}
          className={addButtonClass}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <EntryList
        entries={events}
        squad={squad}
        describe={(event) => cardLabels[event.type as "yellow" | "red"]}
        onRemove={(id) => onChange(events.filter((entry) => entry.id !== id))}
        empty="No cards recorded."
      />
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h4 className="m-0 font-heading text-[16px] uppercase leading-none">{title}</h4>
      <span className="text-[11.5px] font-semibold text-[var(--faint)]">{hint}</span>
    </div>
  );
}

function MatchEditor({
  match,
  roster,
  onDone,
}: {
  match: MatchWithTeams;
  roster: Player[];
  onDone: () => void;
}) {
  const [, startSaving] = useTransition();
  const [homeScore, setHomeScore] = useState(
    match.homeScore === null ? "" : String(match.homeScore),
  );
  const [awayScore, setAwayScore] = useState(
    match.awayScore === null ? "" : String(match.awayScore),
  );
  const [highlightUrl, setHighlightUrl] = useState(match.videoHighlightUrl ?? "");
  const [events, setEvents] = useState<MatchEvent[]>(match.events ?? []);

  const squadOf = (teamId: number) =>
    roster.filter((player) => player.teamId === teamId).sort((a, b) => a.shirtNumber - b.shirtNumber);

  const homeSquad = squadOf(match.homeTeam.id);
  const awaySquad = squadOf(match.awayTeam.id);
  const homeIds = new Set(homeSquad.map((player) => player.id));

  const bySide = (type: (event: MatchEvent) => boolean, home: boolean) =>
    events.filter((event) => type(event) && homeIds.has(event.playerId) === home);

  const isGoal = (event: MatchEvent) => event.type === "goal";
  const isCard = (event: MatchEvent) => event.type !== "goal";

  const homeGoals = bySide(isGoal, true);
  const awayGoals = bySide(isGoal, false);
  const homeCards = bySide(isCard, true);
  const awayCards = bySide(isCard, false);

  const tally = (list: MatchEvent[]) => list.reduce((total, event) => total + event.count, 0);

  const replace = (next: MatchEvent[], kept: MatchEvent[][]) => setEvents([...next, ...kept.flat()]);

  const parsedHome = homeScore === "" ? null : Number(homeScore);
  const parsedAway = awayScore === "" ? null : Number(awayScore);
  const mismatch =
    (parsedHome !== null && parsedHome !== tally(homeGoals)) ||
    (parsedAway !== null && parsedAway !== tally(awayGoals));

  const save = () => {
    startSaving(async () => {
      await saveMatchAction(match.id, {
        homeScore: parsedHome,
        awayScore: parsedAway,
        videoHighlightUrl: highlightUrl,
        events,
      });
    });
    onDone();
  };

  return (
    <div className="flex flex-col gap-5 border-t border-border bg-[var(--surface-2)] px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{match.homeTeam.name} score</span>
          <input
            className={`${fieldClass} w-20`}
            inputMode="numeric"
            value={homeScore}
            data-testid={`admin-home-score-${match.id}`}
            onChange={(event) => setHomeScore(event.target.value.replace(/[^0-9]/g, ""))}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{match.awayTeam.name} score</span>
          <input
            className={`${fieldClass} w-20`}
            inputMode="numeric"
            value={awayScore}
            data-testid={`admin-away-score-${match.id}`}
            onChange={(event) => setAwayScore(event.target.value.replace(/[^0-9]/g, ""))}
          />
        </label>
        <label className="flex min-w-[240px] flex-1 flex-col gap-1.5">
          <span className={labelClass}>Highlight URL</span>
          <input
            className={fieldClass}
            placeholder="https://youtube.com/watch?v=…"
            value={highlightUrl}
            data-testid={`admin-highlight-${match.id}`}
            onChange={(event) => setHighlightUrl(event.target.value)}
          />
        </label>
      </div>

      {mismatch ? (
        <p className="m-0 text-[11.5px] font-semibold text-[var(--pink)]">
          Heads up: the score does not match the recorded goals ({tally(homeGoals)}–
          {tally(awayGoals)}). The score you type is what the table uses.
        </p>
      ) : null}

      <section className="flex flex-col gap-3">
        <SectionHeader title="Goals" hint="Pick a scorer and how many they scored." />
        <div className="grid gap-3 md:grid-cols-2">
          <GoalSide
            team={match.homeTeam}
            squad={homeSquad}
            events={homeGoals}
            onChange={(next) => replace(next, [awayGoals, homeCards, awayCards])}
          />
          <GoalSide
            team={match.awayTeam}
            squad={awaySquad}
            events={awayGoals}
            onChange={(next) => replace(next, [homeGoals, homeCards, awayCards])}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Cards" hint="One entry per card shown." />
        <div className="grid gap-3 md:grid-cols-2">
          <CardSide
            team={match.homeTeam}
            squad={homeSquad}
            events={homeCards}
            onChange={(next) => replace(next, [homeGoals, awayGoals, awayCards])}
          />
          <CardSide
            team={match.awayTeam}
            squad={awaySquad}
            events={awayCards}
            onChange={(next) => replace(next, [homeGoals, awayGoals, homeCards])}
          />
        </div>
      </section>

      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-border px-4.5 py-2.5 text-[12.5px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          data-testid={`admin-save-match-${match.id}`}
          className="rounded-full bg-[image:var(--grad)] px-4.5 py-2.5 text-[12.5px] font-extrabold leading-none text-white shadow-[0_12px_24px_-14px_oklch(0.6_0.24_350/0.9)] transition-transform hover:-translate-y-px"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function RoundBlock({
  round,
  matches,
  roster,
  editingId,
  onEdit,
}: {
  round: number;
  matches: MatchWithTeams[];
  roster: Player[];
  editingId: number | null;
  onEdit: (id: number | null) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[var(--surface-2)] px-4 py-3 sm:px-5">
        <span className="font-heading text-[18px] uppercase leading-none">Round {round}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">
          {matches.length} matches
        </span>
      </div>

      {matches.map((match) => (
        <div key={match.id} className="border-b border-border last:border-b-0">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
            <span className="w-32 shrink-0 font-mono text-[10.5px] leading-none tracking-[0.1em] text-[var(--faint)]">
              {formatKickoff(match.date, match.time)}
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
              <span className="truncate text-right text-[13px] font-extrabold leading-tight">
                {match.homeTeam.name}
              </span>
              <TeamLogo team={match.homeTeam} size="sm" />
            </span>
            <span className="shrink-0 rounded-lg border border-border px-3 py-1.5 font-heading text-sm leading-none">
              {match.homeScore === null || match.awayScore === null
                ? "VS"
                : `${match.homeScore} - ${match.awayScore}`}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <TeamLogo team={match.awayTeam} size="sm" />
              <span className="truncate text-[13px] font-extrabold leading-tight">
                {match.awayTeam.name}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onEdit(editingId === match.id ? null : match.id)}
              aria-expanded={editingId === match.id}
              data-testid={`admin-edit-match-${match.id}`}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-[12px] font-bold leading-none text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>

          {editingId === match.id ? (
            <MatchEditor match={match} roster={roster} onDone={() => onEdit(null)} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function MatchDetail({ rounds, roster }: { rounds: FixtureRound[]; roster: Player[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {rounds.map(({ round, matches }) => (
        <RoundBlock
          key={round}
          round={round}
          matches={matches}
          roster={roster}
          editingId={editingId}
          onEdit={setEditingId}
        />
      ))}
    </div>
  );
}
