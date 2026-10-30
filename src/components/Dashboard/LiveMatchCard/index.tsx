import Link from "next/link";
import type { Match, Team } from "../../../types/sports";
import { SPORT_LABELS } from "../../../lib/config";
import { TeamBadge } from "../../ui/TeamBadge";

function TeamLine({ team, score }: { team?: Team; score?: number }) {
    if (!team) return null;
    return (
        <div className="flex items-center gap-3">
            <TeamBadge team={team} />
            <span className="min-w-0 flex-1 text-base font-semibold">{team.name}</span>
            <span className="text-[30px] font-extrabold tracking-tight">{score ?? "–"}</span>
        </div>
    );
}

export function LiveMatchCard({ match }: { match: Match }) {
    return (
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted">
                    {SPORT_LABELS[match.sport]} · {match.league}
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
                    <span aria-hidden="true" className="h-1.5 w-1.5 animate-live rounded-full bg-white" />
                    {match.clock ?? "Ao vivo"}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {match.title && !match.home && <p className="text-base font-semibold">{match.title}</p>}
                <TeamLine team={match.home} score={match.homeScore} />
                <TeamLine team={match.away} score={match.awayScore} />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line-soft pt-3.5">
                <span className="text-[13px] text-muted">{match.detail}</span>
                <Link href={`/partidas/${match.id}`} className="whitespace-nowrap text-[13px] font-semibold text-brand hover:text-brand-dark">
                    Detalhes →
                </Link>
            </div>
        </article>
    );
}
