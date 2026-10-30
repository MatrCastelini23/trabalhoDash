import axios from "axios";
// API para Fórmula 1
const API_FORMULA = process.env.NEXT_PUBLIC_API_FORMULA;
const API_SPORTS_KEY = process.env.NEXT_PUBLIC_API_SPORTS_KEY;

const configFormula = axios.create({
    baseURL: `${API_FORMULA}`,
    timeout: 8000,
    headers: {
        'x-apisports-key': `${API_SPORTS_KEY}`,
    }
});

export interface IApiSportsResponse<T> {
    get: string;
    parameters: Record<string, string>;
    errors: unknown[] | Record<string, string>;
    results: number;
    response: T[];
}

export function hasApiErros(errors: IApiSportsResponse<unknown>["errors"]) {
    return Array.isArray(errors) ? errors.length > 0 : Object.keys(errors ?? {}).length > 0;
}

export async function fetchRaces(params: { season: number; competition?: number; type?: string; next?: number }) {
    const { data } = await configFormula.get<IApiSportsResponse<unknown>>("/races", { params });
    if (hasApiErros(data.errors)) throw new Error(JSON.stringify(data.errors));
    return data.response;
}