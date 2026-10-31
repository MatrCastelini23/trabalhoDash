import axios from "axios";
import { cached } from "../../cache";
import type { ApiResult, RaceWeather } from "../../../types//sports";

const geocodingApi = axios.create({ baseURL: "https://geocoding-api.open-meteo.com/v1", timeout: 8000 });
const forecastApi = axios.create({ baseURL: "https://api.open-meteo.com/v1", timeout: 8000 });

const HOUR_MS = 3_600_000;

export interface GeoPoint {
    latitude: number;
    longitude: number;
}

function logError(scope: string, e: unknown) {
    console.error(
        `[apiWeather] ${scope}`,
        axios.isAxiosError(e) ? `${e.response?.status} ${JSON.stringify(e.response?.data)}` : e,
    );
}

/** Nome do lugar → coordenadas. Cache de 24 h (o resultado não muda). */
export function geocode(query: string): Promise<ApiResult<GeoPoint | undefined>> {
    return cached(`geo:${query}`, 24 * HOUR_MS, async () => {
        try {
            const { data } = await geocodingApi.get<{ results?: GeoPoint[] }>("/search", {
                params: { name: query, count: 1, language: "en" },
            });
            return { data: data.results?.[0], error: false };
        } catch (e) {
            logError(`geocode ${query}`, e);
            return { data: undefined, error: true };
        }
    });
}

interface ApiForecast {
    hourly?: {
        time: string[];
        temperature_2m: (number | null)[];
        precipitation_probability: (number | null)[];
        weather_code: (number | null)[];
        wind_speed_10m: (number | null)[];
    };
}

/** Previsão para a hora da largada. Sem `timezone`, a Open-Meteo responde em GMT/UTC. */
export function getForecastAt(point: GeoPoint, startsAtIso: string): Promise<ApiResult<RaceWeather | undefined>> {
    const utc = new Date(startsAtIso).toISOString(); // 2026-11-08T17:00:00.000Z
    const day = utc.slice(0, 10);
    const hourKey = `${utc.slice(0, 13)}:00`; // 2026-11-08T17:00 (formato do `hourly.time`)

    return cached(`forecast:${point.latitude},${point.longitude}:${hourKey}`, 30 * 60_000, async () => {
        try {
            const { data } = await forecastApi.get<ApiForecast>("/forecast", {
                params: {
                    latitude: point.latitude,
                    longitude: point.longitude,
                    hourly: "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
                    start_date: day,
                    end_date: day,
                },
            });

            const h = data.hourly;
            const i = h ? h.time.indexOf(hourKey) : -1;
            const temperature = i >= 0 ? h?.temperature_2m[i] : null;
            const code = i >= 0 ? h?.weather_code[i] : null;
            if (!h || temperature == null || code == null) return { data: undefined, error: false };

            return {
                data: {
                    temperatureC: Math.round(temperature),
                    code,
                    rainChance: h.precipitation_probability[i] ?? undefined,
                    windKmh: h.wind_speed_10m[i] != null ? Math.round(h.wind_speed_10m[i]) : undefined,
                },
                error: false,
            };
        } catch (e) {
            logError("forecast", e);
            return { data: undefined, error: true };
        }
    });
}