import Link from "next/link";
import type { Sport } from "../../../types/sports";
import { SPORTS } from "../../../lib/config";
import { buildHref } from "../../../lib/filters";

interface SportFilterProps {
    active?: Sport;
    query?: string;
}

const ICONS: Record<Sport, React.ReactNode> = {
    futebol: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <polygon points="12,8 15.5,10.6 14.2,14.7 9.8,14.7 8.5,10.6" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="15.5" y1="10.6" x2="20.5" y2="9" />
            <line x1="14.2" y1="14.7" x2="17.5" y2="19" />
            <line x1="9.8" y1="14.7" x2="6.5" y2="19" />
            <line x1="8.5" y1="10.6" x2="3.5" y2="9" />
        </svg>
    ),
    f1: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 21V4" />
            <path d="M5 4h13l-2.5 4L18 12H5" />
        </svg>
    ),
    cs: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="1.5" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="22.5" y2="12" />
        </svg>
    ),
};

export function SportFilter({ active, query }: SportFilterProps) {
    const chip = (on: boolean) =>
        `flex min-h-11 items-center gap-2 rounded-full border px-[18px] text-sm font-semibold ${on ? "border-brand bg-brand text-white" : "border-field bg-white text-ink hover:bg-surface"
        }`;

    return (
        <nav aria-label="Filtrar por esporte" className="flex flex-wrap gap-2">
            <Link href={buildHref({ q: query })} aria-current={!active ? "page" : undefined} className={chip(!active)}>
                Todos
            </Link>
            {SPORTS.map((s) => (
                <Link
                    key={s.key}
                    href={buildHref({ sport: s.key, q: query })}
                    aria-current={active === s.key ? "page" : undefined}
                    className={chip(active === s.key)}
                >
                    {ICONS[s.key]}
                    {s.label}
                </Link>
            ))}
        </nav>
    );
}
