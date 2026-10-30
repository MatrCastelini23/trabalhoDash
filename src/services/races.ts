import { fetchRaces } from "../lib/sports/apiFormula";
import type { ApiResult, Race } from "../types/sports";

interface IApiRace {
    id: number;
    competition: { name: string; location?: { city?: string; country?: string } };
    circuit: { name: string };
    date: string;
}

export async function getNextRace(): Promise<ApiResult<Race | undefined>> {
    try {
        const season = new Date().getFullYear();
        const races = (await fetchRaces({ season, type: "Race", next: 1 })) as IApiRace[];
        const r = races[0];

        return {
            data: r && {
                id: String(r.id),
                name: r.competition.name,
                circuit: r.circuit.name,
                startsAt: r.date,
            },
            error: false,
        };
    } catch {
        return { data: undefined, error: true }
    }
}