import axios from "axios";
import type { ApiResult } from "../../types/sports";

export const apiSoccer = axios.create({
    baseURL: process.env.API_SOCCER_URL,
    timeout: 8000,
    headers: { "X-Auth-Token": process.env.API_SOCCER_KEY },
});

const TTL_MS = 60_000; // o plano gratuito permite 10 requisições por minuto

// Guarda a Promise (não só o resultado): chamadas simultâneas com a mesma chave
// compartilham a mesma requisição.
const cache = new Map<string, { expires: number; promise: Promise<ApiResult<unknown>> }>();

async function request<T>(path: string, params?: Record<string, string | number>): Promise<ApiResult<T | undefined>> {
    try {
        const { data } = await apiSoccer.get<T>(path, { params });
        return { data, error: false };
    } catch (e) {
        // 403 = competição fora do plano, 429 = limite por minuto, 400 = parâmetro inválido
        console.error(
            `[apiSoccer] ${path}`,
            axios.isAxiosError(e) ? `${e.response?.status} ${JSON.stringify(e.response?.data)}` : e,
        );
        return { data: undefined, error: true };
    }
}

/** GET que nunca lança. Devolve o corpo da resposta (um objeto, não uma lista). */
export function getData<T>(path: string, params?: Record<string, string | number>): Promise<ApiResult<T | undefined>> {
    const key = `${path}?${JSON.stringify(params ?? {})}`;
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise as Promise<ApiResult<T | undefined>>;

    const promise = request<T>(path, params);
    cache.set(key, { expires: Date.now() + TTL_MS, promise });
    promise.then((res) => {
        if (res.error) cache.delete(key); // não guarda falhas no cache
    });
    return promise;
}