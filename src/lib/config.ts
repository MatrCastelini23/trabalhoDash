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

/** Valores do campo `competition` usados nos endpoints /standings. */
export const COMPETITIONS = {
    brasileirao: "brasileirao-serie-a",
    csRanking: "cs-ranking",
} as const;

export const LIMITS = {
    upcoming: 8,
    recent: 6,
    standings: 5,
} as const;

/** Intervalo de atualização dos jogos ao vivo (ms). */
export const LIVE_POLL_MS = 30_000;

export const TIMEZONE = "America/Sao_Paulo";
