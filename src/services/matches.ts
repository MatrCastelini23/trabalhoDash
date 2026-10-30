import { getData } from "../lib/sports/apiSoccer";
import { LIMITS, MATCH_WINDOW_DAYS, SOCCER_COMPETITIONS, TIMEZONE } from "../lib/config";
import type { ApiResult, Match, MatchStatus, Sport, Team } from "../types/sports";
import { getCsLiveMatches, getCsRecentMatches, getCsUpcomingMatches } from "./cs";

interface ApiTeam { id: number; name: string; shortName?: string; tla?: string; crest?: string }
interface ApiMatch {
    id: number;
    utcDate: string;
    status: string;
    minute?: number | string;
    matchday?: number;
    competition: { name: string };
    homeTeam: ApiTeam;
    awayTeam: ApiTeam;
    score: { fullTime: { home: number | null; away: number | null } };
}

const LIVE = ["IN_PLAY", "PAUSED", "EXTRA_TIME", "PENALTY_SHOOTOUT"];

/** Adiados, cancelados e suspensos ficam de fora (devolve undefined). */
function toStatus(s: string): MatchStatus | undefined {
    if (LIVE.includes(s)) return "live";
    if (s === "FINISHED" || s === "AWARDED") return "finished";
    if (s === "SCHEDULED" || s === "TIMED") return "scheduled";
    return undefined;
}

const toTeam = (t: ApiTeam): Team => ({
    id: String(t.id),
    name: t.name,
    shortName: t.tla ?? t.name.slice(0, 3).toUpperCase(),
    logoUrl: t.crest,
});

function toMatch(m: ApiMatch): Match | undefined {
    const status = toStatus(m.status);
    if (!status) return undefined;

    return {
        id: String(m.id),
        sport: "futebol",
        league: m.competition.name,
        status,
        startsAt: m.utcDate,
        clock:
            status !== "live" ? undefined : m.status === "PAUSED" ? "Intervalo" : m.minute ? `${m.minute}'` : "Ao vivo",
        detail: m.matchday ? `Rodada ${m.matchday}` : undefined,
        home: toTeam(m.homeTeam),
        away: toTeam(m.awayTeam),
        homeScore: m.score.fullTime.home ?? undefined,
        awayScore: m.score.fullTime.away ?? undefined,
    };
}

const dateKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d); // yyyy-MM-dd
const addDays = (days: number) => new Date(Date.now() + days * 86_400_000);

/** Uma chamada por competição; o cache de 60 s faz as três seções da página dividirem o resultado. */
async function loadSoccerMatches(): Promise<ApiResult<Match[]>> {
    const dateFrom = dateKey(addDays(-MATCH_WINDOW_DAYS.past));
    const dateTo = dateKey(addDays(MATCH_WINDOW_DAYS.future + 1)); // dateTo é exclusivo na v4

    const results = await Promise.all(
        SOCCER_COMPETITIONS.map((code) =>
            getData<{ matches: ApiMatch[] }>(`/competitions/${code}/matches`, { dateFrom, dateTo }),
        ),
    );

    return {
        error: results.some((r) => r.error),
        data: results.flatMap((r) => (r.data?.matches ?? []).flatMap((m) => toMatch(m) ?? [])),
    };
}

const byStart = (dir: 1 | -1) => (a: Match, b: Match) =>
    dir * (Date.parse(a.startsAt) - Date.parse(b.startsAt));

const wantsSoccer = (sport?: Sport) => !sport || sport === "futebol";
const wantsCs = (sport?: Sport) => !sport || sport === "cs";
const empty: ApiResult<Match[]> = { data: [], error: false };

async function soccerBy(sport: Sport | undefined, status: MatchStatus): Promise<ApiResult<Match[]>> {
    if (!wantsSoccer(sport)) return empty;
    const res = await loadSoccerMatches();
    return { ...res, data: res.data.filter((m) => m.status === status) };
}

const csBy = (sport: Sport | undefined, load: () => Promise<ApiResult<Match[]>>) =>
    wantsCs(sport) ? load() : Promise.resolve(empty);

const merge = (results: ApiResult<Match[]>[]): ApiResult<Match[]> => ({
    error: results.some((r) => r.error),
    data: results.flatMap((r) => r.data),
});

export async function getLiveMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = merge(await Promise.all([soccerBy(sport, "live"), csBy(sport, getCsLiveMatches)]));
    return { ...res, data: res.data.sort(byStart(1)) };
}

export async function getUpcomingMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = merge(await Promise.all([soccerBy(sport, "scheduled"), csBy(sport, getCsUpcomingMatches)]));
    return { ...res, data: res.data.sort(byStart(1)).slice(0, LIMITS.upcoming) };
}

export async function getRecentMatches(sport?: Sport): Promise<ApiResult<Match[]>> {
    const res = merge(await Promise.all([soccerBy(sport, "finished"), csBy(sport, getCsRecentMatches)]));
    return { ...res, data: res.data.sort(byStart(-1)).slice(0, LIMITS.recent) };
}