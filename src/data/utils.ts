import { type Team, type Player, type Match, type Standing } from "@/lib/types";

const teamLogos = [
  "https://ui-avatars.com/api/?name=TD&background=E91E63&color=fff&size=128&bold=true",
  "https://ui-avatars.com/api/?name=HN&background=2196F3&color=fff&size=128&bold=true",
  "https://ui-avatars.com/api/?name=SG&background=FF9800&color=fff&size=128&bold=true",
  "https://ui-avatars.com/api/?name=DN&background=4CAF50&color=fff&size=128&bold=true",
  "https://ui-avatars.com/api/?name=HC&background=9C27B0&color=fff&size=128&bold=true",
  "https://ui-avatars.com/api/?name=NT&background=00BCD4&color=fff&size=128&bold=true",
];

export { teamLogos };

export function generatePlayers(teams: Team[]): Player[] {
  const surnames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Phan", "Đặng", "Bùi", "Đỗ"];
  const givenNames = ["Văn Minh", "Hùng", "Tuấn Đức", "Hải Long", "Đình Dũng", "Văn Thành", "Quang", "Mạnh", "Kaizer", "Lee"];
  const rosterTemplate: Player["position"][] = ["GK", "DF", "MF", "FW"];
  const players: Player[] = [];
  let uid = 1;
  for (const team of teams) {
    let shirt = 1;
    for (const pos of rosterTemplate) {
      const count = pos === "GK" ? 2 : pos === "DF" ? 5 : pos === "MF" ? 5 : 3;
      for (let i = 0; i < count; i++) {
        const name = surnames[Math.floor(Math.random() * surnames.length)] + " " + givenNames[Math.floor(Math.random() * givenNames.length)];
        players.push({
          id: uid++,
          teamId: team.id,
          name,
          shirtNumber: shirt++,
          position: pos,
          goals: rand(0, 12),
          assists: rand(0, 8),
          yellowCards: rand(0, 4),
          redCards: rand(0, 1),
        });
      }
    }
  }
  return players;
}

export function generateMatches(teams: Team[]): Match[] {
  const mws: { date: string; time: string }[] = [];
  const now = new Date();
  for (let wk = 0; wk < 5; wk++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (4 - wk) * 7);
    d.setHours(18, 0, 0, 0);
    mws.push({
      date: d.toISOString().slice(0, 10),
      time: d.toTimeString().slice(0, 5),
    });
  }
  const pairings: [number, number][] = [
    [0, 1], [2, 3], [4, 5],
    [0, 2], [1, 4], [3, 5],
    [0, 3], [1, 5], [2, 4],
    [0, 4], [1, 3], [2, 5],
    [0, 5], [1, 2], [3, 4],
  ];
  const matches: Match[] = [];
  let mid = 1;
  for (let wk = 0; wk < 5; wk++) {
    for (let p = wk * 3; p < wk * 3 + 3; p++) {
      const [i, j] = pairings[p];
      const status: Match["status"] = wk < 4 ? "finished" : "live";
      matches.push({
        id: mid++,
        homeTeamId: teams[i].id,
        awayTeamId: teams[j].id,
        homeScore: status === "finished" ? rand(0, 4) : rand(0, 2),
        awayScore: status === "finished" ? rand(0, 4) : rand(0, 2),
        date: mws[wk].date,
        time: mws[wk].time,
        status,
        matchWeek: wk + 1,
        videoHighlightUrl: status === "finished" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : undefined,
      });
    }
  }
  return matches;
}

export function calculateStandings(matches: Match[], teams: Team[]): Standing[] {
  const table: Record<number, Standing> = {};
  for (const t of teams) {
    table[t.id] = {
      teamId: t.id,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  }
  for (const m of matches) {
    if (m.status !== "finished" || m.homeScore == null || m.awayScore == null) continue;
    const h = table[m.homeTeamId];
    const a = table[m.awayTeamId];
    h.played++; a.played++;
    h.goalsFor += m.homeScore; h.goalsAgainst += m.awayScore;
    a.goalsFor += m.awayScore; a.goalsAgainst += m.homeScore;
    if (m.homeScore > m.awayScore) { h.won++; a.lost++; h.points += 3; }
    else if (m.awayScore > m.homeScore) { a.won++; h.lost++; a.points += 3; }
    else { h.drawn++; a.drawn++; h.points++; a.points++; }
  }
  return Object.values(table)
    .map((s) => ({ ...s, goalDifference: s.goalsFor - s.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
