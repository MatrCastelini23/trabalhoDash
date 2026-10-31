import { getFormulaList } from "../lib/sports/F1/apiFormula";
import { geocode, getForecastAt } from "../lib/sports/F1/apiWeather";
import type { ApiErrorReason, ApiResult, F1Standings, Race, StandingRow } from "../types/sports";

interface ApiSession {
    meeting_key: number;
    session_key: number;
    date_start: string;
    location: string;
    country_name: string;
    circuit_short_name: string;
}
interface ApiMeeting {
    meeting_key: number;
    meeting_name: string;
}

interface ApiChampDriver { driver_number: number; points_current: number | null; position_current: number | null }
interface ApiChampTeam { team_name: string; points_current: number | null; position_current: number | null }
interface ApiDriver {
    driver_number: number;
    first_name?: string;
    last_name?: string;
    broadcast_name?: string;
    name_acronym?: string;
    team_name?: string;
    team_colour?: string;
}


const RACE_WINDOW_MS = 3 * 3_600_000; // mantém a corrida no card até 3 h depois da largada
const FORECAST_LIMIT_MS = 15 * 86_400_000; // a Open-Meteo prevê até 16 dias

/** Corrida mais próxima; se a temporada acabou, procura no ano seguinte. */
async function findNextRace(): Promise<{ session?: ApiSession; meetings: ApiMeeting[]; error: boolean; reason?: ApiErrorReason; }> {
    const thisYear = new Date().getFullYear();

    for (const year of [thisYear, thisYear + 1]) {
        const [sessions, meetings] = await Promise.all([
            getFormulaList<ApiSession>("/sessions", { year, session_name: "Race" }),
            getFormulaList<ApiMeeting>("/meetings", { year }),
        ]);
        if (sessions.error) return { meetings: [], error: true, reason: sessions.reason };

        const session = sessions.data
            .filter((s) => Date.parse(s.date_start) + RACE_WINDOW_MS >= Date.now())
            .sort((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start))[0];

        if (session) return { session, meetings: meetings.data, error: false };
    }
    return { meetings: [], error: false };
}

/** Tenta do mais específico ao mais genérico até achar coordenadas. */
async function locate(s: ApiSession) {
    for (const query of [`${s.location}, ${s.country_name}`, s.location, s.country_name]) {
        const res = await geocode(query);
        if (res.data) return res.data;
    }
    return undefined;
}

export async function getNextRace(): Promise<ApiResult<Race | undefined>> {
    const { session, meetings, error, reason } = await findNextRace();
    if (!session) return { data: undefined, error, reason };

    // A previsão só existe para os próximos 16 dias; falha no clima não derruba o card.
    let weather: Race["weather"];
    if (Date.parse(session.date_start) - Date.now() <= FORECAST_LIMIT_MS) {
        const point = await locate(session);
        if (point) weather = (await getForecastAt(point, session.date_start)).data;
    }

    return {
        error: false,
        data: {
            id: String(session.meeting_key),
            name: meetings.find((m) => m.meeting_key === session.meeting_key)?.meeting_name ?? `${session.country_name} Grand Prix`,
            circuit: session.circuit_short_name,
            country: session.country_name,
            startsAt: session.date_start,
            weather,
        },
    };
}

async function findLastFinishedRace(): Promise<{ session?: ApiSession; meetings: ApiMeeting[]; error: boolean; reason?: ApiErrorReason; }> {
    const thisYear = new Date().getFullYear();

    for (const year of [thisYear, thisYear - 1]) {
        const [sessions, meetings] = await Promise.all([
            getFormulaList<ApiSession>("/sessions", { year, session_name: "Race" }),
            getFormulaList<ApiMeeting>("/meetings", { year }),
        ]);
        if (sessions.error) return { meetings: [], error: true, reason: sessions.reason };

        const session = sessions.data
            .filter((s) => Date.parse(s.date_start) + RACE_WINDOW_MS <= Date.now())
            .sort((a, b) => Date.parse(b.date_start) - Date.parse(a.date_start))[0];

        if (session) return { session, meetings: meetings.data, error: false };
    }
    return { meetings: [], error: false };
}

const hex = (c?: string) => (c ? `#${c}` : undefined);

/** Campeonato de pilotos e de construtores após a última corrida (endpoints em beta). */
export async function getF1Standings(): Promise<ApiResult<F1Standings>> {
    const { session, meetings, error, reason } = await findLastFinishedRace();
    if (!session) return { data: { drivers: [], teams: [] }, error, reason };

    const params = { session_key: session.session_key };
    const [champDrivers, champTeams, drivers] = await Promise.all([
        getFormulaList<ApiChampDriver>("/championship_drivers", params),
        getFormulaList<ApiChampTeam>("/championship_teams", params),
        getFormulaList<ApiDriver>("/drivers", params),
    ]);

    const info = new Map(drivers.data.map((d) => [d.driver_number, d]));
    const teamColor = new Map(drivers.data.flatMap((d) => (d.team_name ? [[d.team_name, hex(d.team_colour)] as const] : [])));

    const driverRows: StandingRow[] = champDrivers.data.flatMap((r) => {
        if (r.position_current == null || r.points_current == null) return [];
        const d = info.get(r.driver_number);
        const name = `${d?.first_name ?? ""} ${d?.last_name ?? ""}`.trim() || d?.broadcast_name || `#${r.driver_number}`;
        return [{
            id: `d-${r.driver_number}`,
            competition: "f1-drivers",
            position: r.position_current,
            points: r.points_current,
            subtitle: d?.team_name,
            team: { id: String(r.driver_number), name, shortName: d?.name_acronym ?? String(r.driver_number), color: hex(d?.team_colour) },
        }];
    });

    const teamRows: StandingRow[] = champTeams.data.flatMap((r) => {
        if (r.position_current == null || r.points_current == null) return [];
        return [{
            id: `t-${r.team_name}`,
            competition: "f1-teams",
            position: r.position_current,
            points: r.points_current,
            team: { id: r.team_name, name: r.team_name, shortName: r.team_name.slice(0, 3).toUpperCase(), color: teamColor.get(r.team_name) },
        }];
    });

    return {
        error: champDrivers.error || champTeams.error || drivers.error,
        reason: champDrivers.reason ?? champTeams.reason ?? drivers.reason,
        data: {
            afterRace: meetings.find((m) => m.meeting_key === session.meeting_key)?.meeting_name,
            drivers: driverRows.sort((a, b) => a.position - b.position),
            teams: teamRows.sort((a, b) => a.position - b.position),
        },
    };
}
