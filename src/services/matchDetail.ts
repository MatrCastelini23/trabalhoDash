import { getData } from "../lib/sports/apiSoccer";
import { getCsList } from "../lib/sports/apiCs";
import { isValidMatchId } from "../lib/filters";
import { toMatch as toSoccerMatch, type ApiMatch } from "./matches";
import { toMatch as toCsMatch, type ApiCsMatch } from "./cs";
import type { ApiResult, MatchDetail, MatchEvent } from "../types/sports";

// ---------- futebol (football-data.org) ----------

interface Named { name?: string | null }
interface ApiSoccerDetail extends ApiMatch {
    venue?: string | null;
    attendance?: number | null;
    score: ApiMatch["score"] & { halfTime?: { home: number | null; away: number | null } };
    referees?: { name: string; type: string }[];
    goals?: { minute: number; injuryTime?: number | null; type?: string; team?: Named; scorer?: Named; assist?: Named | null }[];
    bookings?: { minute: number; injuryTime?: number | null; team?: Named; player?: Named; card: string }[];
    substitutions?: { minute: number; team?: Named; playerOut?: Named; playerIn?: Named }[];
}

const at = (minute: number, extra?: number | null) => (extra ? `${minute}+${extra}'` : `${minute}'`);

async function getSoccerDetail(id: string): Promise<ApiResult<MatchDetail | undefined>> {
    const res = await getData<ApiSoccerDetail>(`/matches/${id}`);
    const m = res.data;
    const base = m && toSoccerMatch(m);
    if (!m || !base) return { data: undefined, error: res.error };

    type Row = { order: number; event: MatchEvent };
    const goals: Row[] = (m.goals ?? []).map((g, i) => ({
        order: g.minute * 100 + (g.injuryTime ?? 0),
        event: {
            id: `g${i}`,
            minute: at(g.minute, g.injuryTime),
            kind: "goal",
            team: g.team?.name ?? undefined,
            text:
                `${g.scorer?.name ?? "Gol"}` +
                (g.type === "PENALTY" ? " (pênalti)" : g.type === "OWN" ? " (contra)" : "") +
                (g.assist?.name ? ` · assistência: ${g.assist.name}` : ""),
        },
    }));
    const cards: Row[] = (m.bookings ?? []).map((b, i) => ({
        order: b.minute * 100 + (b.injuryTime ?? 0),
        event: {
            id: `b${i}`,
            minute: at(b.minute, b.injuryTime),
            kind: b.card === "YELLOW" ? "yellow" : "red",
            team: b.team?.name ?? undefined,
            text: b.player?.name ?? "Jogador",
        },
    }));
    const subs: Row[] = (m.substitutions ?? []).map((s, i) => ({
        order: s.minute * 100,
        event: {
            id: `s${i}`,
            minute: at(s.minute),
            kind: "sub",
            team: s.team?.name ?? undefined,
            text: `Entra ${s.playerIn?.name ?? "?"} · sai ${s.playerOut?.name ?? "?"}`,
        },
    }));

    const ht = m.score.halfTime;
    return {
        error: res.error,
        data: {
            ...base,
            venue: m.venue ?? undefined,
            attendance: m.attendance ?? undefined,
            referee: m.referees?.find((r) => r.type === "REFEREE")?.name,
            halfTime: ht && ht.home != null && ht.away != null ? { home: ht.home, away: ht.away } : undefined,
            events: [...goals, ...cards, ...subs].sort((a, b) => a.order - b.order).map((r) => r.event),
            maps: [],
            streams: [],
        },
    };
}

// ---------- CS (PandaScore) ----------
// O endpoint de partida única exige plano pago; a lista (aberta) filtrada por id traz o mesmo objeto.

interface ApiCsDetail extends ApiCsMatch {
    games?: { position: number; status: string; winner?: { id: number | null } | null }[];
    streams_list?: { language: string; official: boolean; raw_url: string }[];
}

async function getCsDetail(id: string): Promise<ApiResult<MatchDetail | undefined>> {
    const res = await getCsList<ApiCsDetail>("/csgo/matches", { "filter[id]": id });
    const m = res.data[0];
    const base = m && toCsMatch(m);
    if (!m || !base) return { data: undefined, error: res.error };

    const nameOf = (teamId?: number | null) => m.opponents.find((o) => o.opponent.id === teamId)?.opponent.name;

    return {
        error: res.error,
        data: {
            ...base,
            events: [],
            maps: [...(m.games ?? [])]
                .sort((a, b) => a.position - b.position)
                .map((g) => ({
                    position: g.position,
                    status: g.status === "finished" ? "finished" : g.status === "running" ? "running" : "pending",
                    winner: nameOf(g.winner?.id),
                })),
            // só links https: o endereço vem de terceiros e vai para um href
            streams: (m.streams_list ?? [])
                .filter((s) => s.raw_url.startsWith("https://"))
                .map((s) => ({ url: s.raw_url, language: s.language, official: s.official })),
        },
    };
}

export async function getMatchDetail(id: string): Promise<ApiResult<MatchDetail | undefined>> {
    if (!isValidMatchId(id)) return { data: undefined, error: false };
    return id.startsWith("cs-") ? getCsDetail(id.slice(3)) : getSoccerDetail(id);
}