export type Sport = "futebol" | "f1" | "cs";

export type MatchStatus = "live" | "scheduled" | "finished";

export interface Team {
    id: string;
    name: string;
    /** Sigla exibida no escudo quando não há logo (ex.: "FLA"). */
    shortName: string;
    /** Cor do escudo de fallback (hex). */
    color?: string;
    logoUrl?: string;
}

export interface Championship {
    id: string;
    name: string;
    logoUrl?: string;
    startsAt?: string;
    endsAt?: string;
}

export interface CsChampionships {
    running: Championship[];
    next?: Championship;
}

export interface Match {
    id: string;
    sport: Sport;
    /** Nome do campeonato (ex.: "Brasileirão Série A"). */
    league: string;
    status: MatchStatus;
    /** Data/hora de início em ISO 8601. */
    startsAt: string;
    /** Tempo de jogo ao vivo (ex.: "67'") ou fase (ex.: "Mapa 2"). */
    clock?: string;
    /** Informação extra (estádio, mapa, rodada...). */
    detail?: string;
    home?: Team;
    away?: Team;
    homeScore?: number;
    awayScore?: number;
    /** Para eventos sem dois lados, como sessões de F1. */
    title?: string;
    /** Pódio de uma corrida finalizada, em ordem. */
    podium?: string[];
}

export interface Race {
    id: string;
    name: string;
    circuit: string;
    startsAt: string;
}

export interface StandingRow {
    id: string;
    /** Identifica a tabela/ranking (ex.: "brasileirao-serie-a"). */
    competition: string;
    position: number;
    team: Team;
    played?: number;
    points: number;
}

export interface ApiResult<T> {
    data: T;
    /** true quando a requisição falhou (API fora do ar, timeout etc.). */
    error: boolean;
}
