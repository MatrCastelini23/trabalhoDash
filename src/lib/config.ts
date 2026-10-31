import type { Sport } from "../types/sports";

export const SPORTS: { key: Sport; label: string; slug: string }[] = [
    { key: "futebol", label: "Futebol", slug: "futebol" },
    { key: "f1", label: "Fórmula 1", slug: "formula-1" },
    { key: "cs", label: "Counter-Strike", slug: "counter-strike" },
];

export const sportPath = (key: Sport) => `/esportes/${SPORTS.find((s) => s.key === key)?.slug ?? ""}`;
export const sportFromSlug = (slug: string) => SPORTS.find((s) => s.slug === slug)?.key;

export const SPORT_LABELS: Record<Sport, string> = {
    futebol: "Futebol",
    f1: "Fórmula 1",
    cs: "Counter-Strike",
};

export const CS_VIDEOGAME_TITLE = "cs-2";
export const CS_FEATURED_LEAGUES: string[] = ["PGL Masters"];

export const COMPETITIONS = {
    brasileirao: "BSA",
    championsLeague: "CL",
} as const;

export const SOCCER_COMPETITIONS = [COMPETITIONS.brasileirao, COMPETITIONS.championsLeague];

// Janela de datas buscada na API: dá para montar "recentes", "ao vivo" e "próximas" com uma chamada por competição.
export const MATCH_WINDOW_DAYS = { past: 10, future: 14 } as const;

export const LIMITS = {
    upcoming: 8,
    fullTable: 20,
    sportUpcoming: 12,
    recent: 6,
    standings: 5,
} as const;

/** Intervalo de atualização dos jogos ao vivo (ms). */
export const LIVE_POLL_MS = 30_000;

export const TIMEZONE = "America/Sao_Paulo";
