import { getList } from "../lib/sports/apiSoccer";
import { LIMITS } from "../lib/config";
import type { ApiResult, Match, MatchStatus, Sport } from "../types/sports";



async function fetchMatches(status: MatchStatus, sport?: Sport): Promise<ApiResult<Match[]>> {
    return getList<Match>("/leagues", { status, sport });
}

const byStart = (direction: 1 | -1) => (a: Match, b: Match) =>
    direction * (Date.parse(a.startsAt) - Date.parse(b.startsAt));

export async function getLiveMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = await fetchMatches("live", sport);
    return { ...res, data: [...res.data].sort(byStart(1)) };
}

export async function getUpcomingMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = await fetchMatches("scheduled", sport);
    return { ...res, data: [...res.data].sort(byStart(1)).slice(0, LIMITS.upcoming) };
}

export async function getRecentMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = await fetchMatches("finished", sport);
    return { ...res, data: [...res.data].sort(byStart(-1)).slice(0, LIMITS.recent) };
}
