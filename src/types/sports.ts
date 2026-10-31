export type Sport = "futebol" | "f1" | "cs";

export type MatchStatus = "live" | "scheduled" | "finished";

export type ApiErrorReason = "live-session";

export interface ApiResult<T> {
    data: T;
    error: boolean;
    reason?: ApiErrorReason;
}

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
    upcoming: Championship[];
}

export interface F1Standings {
    afterRace?: string;
    drivers: StandingRow[];
    teams: StandingRow[];
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

export interface MatchEvent {
    id: string;
    minute?: string;
    kind: "goal" | "yellow" | "red" | "sub";
    team?: string;
    text: string;
}

export interface RaceWeather {
    temperatureC: number;
    /** Código WMO do tempo (0 = céu limpo, 61 = chuva fraca...). */
    code: number;
    rainChance?: number; // %
    windKmh?: number;
}

export interface MatchMap {
    position: number;
    status: "finished" | "running" | "pending";
    winner?: string;
}

export interface MatchStream {
    url: string;
    language: string;
    official: boolean;
}
export interface MatchDetail extends Match {
    venue?: string;
    attendance?: number;
    referee?: string;
    halfTime?: { home: number; away: number };
    events: MatchEvent[]; // futebol
    maps: MatchMap[]; // CS
    streams: MatchStream[]; // CS
}

export interface Race {
    id: string;
    name: string; // "Brazilian Grand Prix"
    circuit: string; // "Interlagos"
    country: string;
    /** Horário da largada da corrida (ISO 8601). */
    startsAt: string;
    weather?: RaceWeather;
}
export interface StandingRow {
    id: string;
    /** Identifica a tabela/ranking (ex.: "BSA", "f1-drivers"). */
    competition: string;
    position: number;
    team: Team;
    played?: number;
    points: number;
    /** Linha de apoio sob o nome (ex.: equipe de um piloto). */
    subtitle?: string;
    won?: number;
    draw?: number;
    lost?: number;
    goalDifference?: number;
}
export interface ApiResult<T> {
    data: T;
    /** true quando a requisição falhou (API fora do ar, timeout etc.). */
    error: boolean;
}
