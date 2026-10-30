import axios from "axios";
import type { ApiResult } from "@/src/types/sports"
import { getStoredToken } from "@/src/lib/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
// API para futebol
const API_SPORTS = process.env.NEXT_PUBLIC_API_SPORTS;
const API_SPORTS_KEY = process.env.NEXT_PUBLIC_API_SPORTS_KEY;

export const api = axios.create({
    baseURL: API_URL,
    timeout: 8000,
});

const configSoccer = axios.create({
    method: 'get',
    url: `${API_SPORTS}`,
    headers: {
        'x-apisports-key': `${API_SPORTS_KEY}`,
    }
});


// Anexa o JWT (quando existir) nas requisições feitas no navegador.
api.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const ok = <T>(data: T): ApiResult<T> => ({ data, error: false });

/** GET que nunca lança: em caso de falha devolve lista vazia e `error: true`. */
export async function getList<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
): Promise<ApiResult<T[]>> {
    try {
        const { data } = await api.get<T[]>(path, { params });
        return ok(Array.isArray(data) ? data : []);
    } catch {
        return { data: [], error: true };
    }
}
