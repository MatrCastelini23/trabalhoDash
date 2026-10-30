import { getList } from "../lib/sports/apiSoccer";
import { LIMITS } from "../lib/config";
import type { ApiResult, StandingRow } from "../types/sports";

/** GET /standings?competition=<slug> — ordenado por posição. */
export async function getStandings(competition: string): Promise<ApiResult<StandingRow[]>> {
    const res = await getList<StandingRow>("/standings", { competition });
    return {
        ...res,
        data: [...res.data].sort((a, b) => a.position - b.position).slice(0, LIMITS.standings),
    };
}
