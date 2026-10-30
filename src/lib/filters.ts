import type { Match, Sport } from "../types/sports"
import { SPORTS } from "./config";

export function parseSport(value?: string): Sport | undefined {
    return SPORTS.find((s) => s.key === value)?.key;
}

export function buildHref({ sport, q }: { sport?: Sport; q?: string }): string {
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
}

const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Filtra partidas por nome de time, campeonato ou título. */
export function filterByQuery(matches: Match[], query?: string): Match[] {
    if (!query) return matches;
    const needle = normalize(query);
    return matches.filter((m) =>
        [m.home?.name, m.away?.name, m.league, m.title]
            .filter((v): v is string => Boolean(v))
            .some((v) => normalize(v).includes(needle)),
    );
}
