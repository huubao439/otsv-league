import { type Team } from "@/lib/types";

/**
 * The projects a team is made up of, shown as a muted line under the team name
 * so people can tell which project(s) a team represents. Several teams combine
 * more than one project, so the string can be long — callers pass `truncate`
 * (via className) wherever the row is width-constrained.
 */
export function TeamProjects({
  team,
  className = "",
}: {
  team: Team;
  className?: string;
}) {
  if (!team.projects) {
    return null;
  }

  return (
    <span
      className={`block text-[10px] font-semibold leading-tight text-[var(--faint)] ${className}`}
    >
      {team.projects}
    </span>
  );
}
