import Link from "next/link";
import type { Sport } from "@/src/types/sports";
import { SPORTS, sportPath } from "@/src/lib/config";
import { NavLink } from "../NavLink";

interface HeaderProps {
    activeSport?: Sport;
    query?: string;
}

function Logo() {
    return (
        <Link href="/" aria-label="sportsTrack – início" className="flex items-center gap-2.5 text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,13 7,13 10,5 14,19 17,11 22,11" />
                </svg>
            </span>
            <span className="text-[22px] font-extrabold tracking-tight">
                sports<span className="text-brand">Track</span>
            </span>
        </Link>
    );
}

export function Header({ activeSport, query }: HeaderProps) {
    const linkBase = "rounded-[10px] px-3.5 py-2.5 text-[15px]";
    const active = "bg-brand-soft font-semibold text-brand";
    const idle = "font-medium text-ink hover:bg-surface";

    return (
        <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3.5">
                <Logo />

                <nav aria-label="Principal" className="flex flex-1 flex-wrap gap-x-2 gap-y-1">
                    <NavLink href="/dashboard">Início</NavLink>
                    {SPORTS.map((s) => (
                        <NavLink key={s.key} href={sportPath(s.key)}>{s.label}</NavLink>
                    ))}
                </nav>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Busca via GET: ?q=... é lido pela página (server component). */}
                    <form action="/" method="get" role="search" className="relative flex items-center">
                        {activeSport && <input type="hidden" name="sport" value={activeSport} />}
                        <svg className="pointer-events-none absolute left-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#55627a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.5" y2="16.5" />
                        </svg>
                        <input
                            type="search"
                            name="q"
                            defaultValue={query}
                            aria-label="Buscar times ou campeonatos"
                            placeholder="Buscar times…"
                            className="h-11 w-60 max-w-full rounded-xl border border-field bg-surface pl-9.5 pr-3.5 text-sm text-ink"
                        />
                    </form>
                    <Link
                        href="#"
                        className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                        Entrar
                    </Link>
                </div>
            </div>
        </header>
    );
}
