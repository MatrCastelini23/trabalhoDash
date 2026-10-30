import Link from "next/link";
import type { Match } from "../../../types/sports";
import { SPORT_LABELS } from "../../../lib/config";
import { formatDay, formatTime } from "../../../lib/format";
import { TeamBadge } from "../../ui/TeamBadge";

interface MatchRowProps {
    match: Match;
    variant: "upcoming" | "finished";
}

function Versus({ match, variant }: MatchRowProps) {
    const { home, away } = match;

    if (!home || !away) {
        return (
            <>
                <span className="text-base font-semibold">{match.title}</span>
                {variant === "finished" && match.podium && match.podium.length > 0 && (
                    <span className="text-sm">{match.podium.map((p, i) => `${i + 1}º ${p}`).join(" · ")}</span>
                )}
            </>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-base">
            <span className="inline-flex items-center gap-2 font-semibold">
                <TeamBadge team={home} size="sm" />
                {home.name}
            </span>
            {variant === "finished" ? (
                <span className="rounded-lg bg-brand-soft px-2.5 py-0.5 font-extrabold text-brand-dark">
                    {match.homeScore ?? "–"} – {match.awayScore ?? "–"}
                </span>
            ) : (
                <span className="font-medium text-muted">×</span>
            )}
            <span className="inline-flex items-center gap-2 font-semibold">
                <TeamBadge team={away} size="sm" />
                {away.name}
            </span>
        </div>
    );
}

export function MatchRow({ match, variant }: MatchRowProps) {
    const isUpcoming = variant === "upcoming";

    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line-soft px-5 py-4 last:border-b-0">
            <div className="flex w-24 flex-none flex-col gap-0.5">
                <span className="text-xs font-semibold text-muted">{formatDay(match.startsAt)}</span>
                {isUpcoming ? (
                    <span className="text-lg font-bold">{formatTime(match.startsAt)}</span>
                ) : (
                    <span className="text-[13px] font-medium text-muted">Encerrado</span>
                )}
            </div>

            <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1.5">
                <Versus match={match} variant={variant} />
                <span className="text-[13px] text-muted">
                    {SPORT_LABELS[match.sport]} · {match.league}
                </span>
            </div>

            {isUpcoming ? (
                <button
                    type="button"
                    aria-label="Seguir esta partida"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-field bg-white text-brand hover:bg-brand-soft"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                    </svg>
                </button>
            ) : (
                <Link href={`/partidas/${match.id}`} className="whitespace-nowrap text-[13px] font-semibold text-brand hover:text-brand-dark">
                    Resumo →
                </Link>
            )}
        </div>
    );
}
