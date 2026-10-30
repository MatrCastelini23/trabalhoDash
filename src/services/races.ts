import { getList } from "../lib/sports/apiSoccer";
import type { ApiResult, Race } from "../types/sports";

/** GET /races — devolve a próxima corrida (a mais próxima a partir de agora). */
export async function getNextRace(): Promise<ApiResult<Race | undefined>> {
    const res = await getList<Race>("/races");
    const now = Date.now();
    const next = res.data
        .filter((race) => Date.parse(race.startsAt) >= now)
        .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
    return { data: next, error: res.error };
}
