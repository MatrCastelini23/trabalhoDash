import axios from "axios";
import type { ApiResult } from "../../types/sports";
import { cached } from "../cache";

export const apiCs = axios.create({
    baseURL: process.env.API_CS_URL ?? "https://api.pandascore.co",
    timeout: 8000,
    headers: { Authorization: `Bearer ${process.env.API_CS_KEY}` },
});

/** GET que nunca lança. A PandaScore devolve listas direto (não um objeto com `matches`). */
export function getCsList<T>(path: string, params?: Record<string, string | number>): Promise<ApiResult<T[]>> {
    return cached(`cs:${path}?${JSON.stringify(params ?? {})}`, 60_000, async () => {
        try {
            const { data } = await apiCs.get<T[]>(path, { params });
            return { data: Array.isArray(data) ? data : [], error: false };
        } catch (e) {
            // 401 = token inválido, 403 = fora do plano, 429 = limite de requisições
            console.error(
                `[apiCs] ${path}`,
                axios.isAxiosError(e) ? `${e.response?.status} ${JSON.stringify(e.response?.data)}` : e,
            );
            return { data: [], error: true };
        }
    });
}