import axios from "axios";
import { cached } from "../../cache";
import type { ApiResult } from "../../../types/sports";

const api = axios.create({ baseURL: "https://api.openf1.org/v1", timeout: 8000 });

const TTL_MS = 60 * 60_000; // o calendário só é atualizado uma vez por dia

/** GET que nunca lança. A OpenF1 devolve a lista direto, sem envelope. */
export function getFormulaList<T>(path: string, params?: Record<string, string | number>): Promise<ApiResult<T[]>> {
    return cached<T[]>(`f1:${path}?${JSON.stringify(params ?? {})}`, TTL_MS, async () => {
        try {
            const { data } = await api.get<T[]>(path, { params });
            return { data: Array.isArray(data) ? data : [], error: false };
        } catch (e) {
            const status = axios.isAxiosError(e) ? e.response?.status : undefined;
            console.error(
                `[apiFormula] ${path}`,
                axios.isAxiosError(e) ? `${status} ${JSON.stringify(e.response?.data)}` : e,
            );
            // não enviamos chave, então 401 aqui é o bloqueio de sessão ao vivo
            return { data: [], error: true, reason: status === 401 ? "live-session" : undefined };
        }
    });
}