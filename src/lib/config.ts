import type { Sport } from "../types/sports";

export const SPORTS: { key: Sport; label: string }[] = [
    { key: "futebol", label: "Futebol" },
    { key: "f1", label: "Fórmula 1" },
    { key: "cs", label: "Counter-Strike" },
];

export const SPORT_LABELS: Record<Sport, string> = {
    futebol: "Futebol",
    f1: "Fórmula 1",
    cs: "Counter-Strike",
};

export const COMPETITIONS = {
    brasileirao: "BSA",
    championsLeague: "CL",
} as const;

export const SOCCER_COMPETITIONS = [COMPETITIONS.brasileirao, COMPETITIONS.championsLeague];

// Janela de datas buscada na API: dá para montar "recentes", "ao vivo" e "próximas" com uma chamada por competição.
export const MATCH_WINDOW_DAYS = { past: 10, future: 14 } as const;

export const LIMITS = {
    upcoming: 8,
    recent: 6,
    standings: 5,
} as const;

/** Intervalo de atualização dos jogos ao vivo (ms). */
export const LIVE_POLL_MS = 30_000;

export const TIMEZONE = "America/Sao_Paulo";
