import type { ApiResult } from "../types/sports";

const store = new Map<string, { expires: number; promise: Promise<unknown> }>();

export function cached<T>(key: string, ttlMs: number, load: () => Promise<ApiResult<T>>): Promise<ApiResult<T>> {
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise as Promise<ApiResult<T>>;

    const promise = load();
    store.set(key, { expires: Date.now() + ttlMs, promise });
    promise.then((res) => {
        if (res.error) store.delete(key); // falhas não ficam no cache
    });
    return promise;
}