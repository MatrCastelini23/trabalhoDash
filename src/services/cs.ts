import { getCsList } from "../lib/sports/apiCs";
import type { ApiResult, CsChampionships, Championship, Match, MatchStatus, Team } from "../types/sports";
import { CS_FEATURED_LEAGUES, CS_VIDEOGAME_TITLE } from "../lib/config";



interface ApiOpponent {
    opponent: { id: number; name: string; acronym?: string | null; image_url?: string | null };
}
interface ApiCsMatch {
    id: number;
    name: string;
    status: string;
    scheduled_at: string | null;
    begin_at: string | null;
    number_of_games: number;
    opponents: ApiOpponent[];
    results: { score: number; team_id: number }[];
    league: { name: string };
    serie: { full_name: string };
    tournament: { name: string };
}
interface ApiSerie {
    id: number;
    full_name: string;
    begin_at: string | null;
    end_at: string | null;
    tier?: string | null;
    league: { name: string; image_url?: string | null };
}

// ---------- campeonatos (séries) ----------
const titleFilter = { "filter[videogame_title]": CS_VIDEOGAME_TITLE };
const TIER_RANK: Record<string, number> = { s: 0, a: 1, b: 2, c: 3, d: 4 };
const rank = (tier?: string | null) => TIER_RANK[tier ?? ""] ?? 9;

const getRunningSeries = () =>
    getCsList<ApiSerie>("/csgo/series/running", { sort: "begin_at", per_page: 100, ...titleFilter });
const getUpcomingSeries = () =>
    getCsList<ApiSerie>("/csgo/series/upcoming", { sort: "begin_at", per_page: 50, ...titleFilter });

const isFeatured = (s: ApiSerie) => CS_FEATURED_LEAGUES.includes(s.league.name);

const bestRunning = (series: ApiSerie[]) => [...series].sort((a, b) => rank(a.tier) - rank(b.tier))[0];

const featuredFirst = (series: ApiSerie[]) =>
    [...series].sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)));


/** A mais próxima entre as de tier S/A; se não houver, a mais próxima de todas. */
const nextRelevant = (series: ApiSerie[]) => series.find((s) => rank(s.tier) <= 1) ?? series[0];

const toChampionship = (s: ApiSerie): Championship => ({
    id: String(s.id),
    name: `${s.league.name} ${s.full_name}`.trim(),
    logoUrl: s.league.image_url ?? undefined,
    startsAt: s.begin_at ?? undefined,
    endsAt: s.end_at ?? undefined,
});

export async function getCsChampionships(): Promise<ApiResult<CsChampionships>> {
    const [running, upcoming] = await Promise.all([getRunningSeries(), getUpcomingSeries()]);
    const next = featuredFirst(upcoming.data)[0];

    return {
        error: running.error || upcoming.error,
        data: {
            running: featuredFirst(running.data).map(toChampionship),
            next: next && toChampionship(next),
        },
    };
}

// ---------- partidas ----------

function toStatus(s: string): MatchStatus | undefined {
    if (s === "running") return "live";
    if (s === "finished") return "finished";
    if (s === "not_started") return "scheduled";
    return undefined; // canceled, postponed
}

const toTeam = (o: ApiOpponent["opponent"]): Team => ({
    id: String(o.id),
    name: o.name,
    shortName: o.acronym ?? o.name.slice(0, 3).toUpperCase(),
    logoUrl: o.image_url ?? undefined,
});

function toMatch(m: ApiCsMatch): Match | undefined {
    const status = toStatus(m.status);
    const startsAt = status === "scheduled" ? (m.scheduled_at ?? m.begin_at) : (m.begin_at ?? m.scheduled_at);
    if (!status || !startsAt) return undefined;

    const [a, b] = m.opponents;
    const home = a && b ? toTeam(a.opponent) : undefined;
    const away = a && b ? toTeam(b.opponent) : undefined;
    const score = (t?: Team) => (t ? m.results.find((r) => String(r.team_id) === t.id)?.score : undefined);

    return {
        id: `cs-${m.id}`,
        sport: "cs",
        league: `${m.league.name} ${m.serie.full_name}`.trim(),
        status,
        startsAt,
        clock: status === "live" ? "Ao vivo" : undefined,
        detail: `${m.tournament.name} · MD${m.number_of_games}`,
        home,
        away,
        homeScore: score(home),
        awayScore: score(away),
        title: home && away ? undefined : m.name,
    };
}

async function fetchMatches(kind: "running" | "upcoming" | "past", sort: string): Promise<ApiResult<Match[]>> {
    const running = await getRunningSeries(); // vem do cache
    const serieIds = running.data.map((s) => s.id).join(",");

    // Sem campeonato em andamento, não há partidas para mostrar
    if (!serieIds) return { data: [], error: running.error };

    const res = await getCsList<ApiCsMatch>(`/csgo/matches/${kind}`, {
        sort,
        per_page: 50,
        ...titleFilter,
        "filter[serie_id]": serieIds,
    });

    return {
        error: res.error || running.error,
        data: res.data.flatMap((m) => toMatch(m) ?? []),
    };
}

export const getCsLiveMatches = () => fetchMatches("running", "begin_at");
export const getCsUpcomingMatches = () => fetchMatches("upcoming", "scheduled_at");
export const getCsRecentMatches = () => fetchMatches("past", "-begin_at");