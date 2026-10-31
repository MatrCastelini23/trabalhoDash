import type { ApiResult } from "../types/sports";

const store = new Map<string, { expires: number; promise: Promise<unknown> }>();
const lastGood = new Map<string, { at: number; value: unknown }>();

/**
 * @param staleMs se a busca falhar, serve a última resposta boa de até esse tempo atrás.
 */
export function cached<T>(
    key: string,
    ttlMs: number,
    load: () => Promise<ApiResult<T>>,
    staleMs = 0,
): Promise<ApiResult<T>> {
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise as Promise<ApiResult<T>>;

    const promise = load().then((res) => {
        if (!res.error) {
            lastGood.set(key, { at: Date.now(), value: res });
        } else if (staleMs) {
            const old = lastGood.get(key);
            if (old && Date.now() - old.at <= staleMs) return old.value as ApiResult<T>;
        }
        return res;
    });

    store.set(key, { expires: Date.now() + ttlMs, promise });
    promise.then((res) => {
        if (res.error) store.delete(key); // falhas sem dado antigo não ficam no cache
    });
    return promise;
}