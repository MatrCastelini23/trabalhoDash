import { getData } from "../lib/sports/apiSoccer";
import { LIMITS } from "../lib/config";
import type { ApiResult, StandingRow } from "../types/sports";

interface ApiRow {
    position: number;
    team: { id: number; name: string; shortName?: string; tla?: string; crest?: string };
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalDifference: number;
}
interface ApiStandings {
    standings: { type: string; table: ApiRow[] }[];
}

export async function getStandings(code: string, limit: number = LIMITS.standings): Promise<ApiResult<StandingRow[]>> {
    const res = await getData<ApiStandings>(`/competitions/${code}/standings`);
    const groups = res.data?.standings ?? [];
    const table = (groups.find((g) => g.type === "TOTAL") ?? groups[0])?.table ?? [];

    const rows: StandingRow[] = table.map((r) => ({
        id: `${code}-${r.team.id}`,
        competition: code,
        position: r.position,
        team: {
            id: String(r.team.id),
            name: r.team.name,
            shortName: r.team.tla ?? r.team.name.slice(0, 3).toUpperCase(),
            logoUrl: r.team.crest,
        },
        played: r.playedGames,
        won: r.won,
        draw: r.draw,
        lost: r.lost,
        goalDifference: r.goalDifference,
        points: r.points,
    }));

    return { error: res.error, data: rows.sort((a, b) => a.position - b.position).slice(0, limit) };
}