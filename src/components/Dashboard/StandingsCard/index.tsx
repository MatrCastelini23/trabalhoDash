import type { ApiResult, StandingRow } from "../../../types/sports";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";
import { TeamBadge } from "../../ui/TeamBadge";

interface StandingsCardProps {
    id: string;
    title: string;
    linkLabel: string;
    result: ApiResult<StandingRow[]>;
    /** Mostra a coluna de jogos (J). Rankings sem partidas jogadas omitem. */
    showPlayed?: boolean;
    pointsSuffix?: string;
}

export function StandingsCard({
    id,
    title,
    linkLabel,
    result,
    showPlayed = false,
    pointsSuffix = "",
}: StandingsCardProps) {
    const { data, error } = result;

    return (
        <section aria-labelledby={id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <SectionHeader id={id} title={title} linkLabel={linkLabel} level="card" />

            {data.length === 0 ? (
                <EmptyState error={error} message="Classificação indisponível." />
            ) : (
                <table className="w-full text-sm">
                    <caption className="sr-only">{title}</caption>
                    <thead>
                        <tr className="text-left text-xs font-semibold text-muted">
                            <th scope="col" className="w-5 px-1 pb-2 font-semibold">#</th>
                            <th scope="col" className="pb-2 font-semibold">Equipe</th>
                            {showPlayed && <th scope="col" className="w-7 pb-2 text-right font-semibold">J</th>}
                            <th scope="col" className="pb-2 pl-2 text-right font-semibold">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="border-t border-line-soft">
                                <td className="px-1 py-2 font-bold text-brand">{row.position}</td>
                                <td className="py-2">
                                    <span className="flex items-center gap-2 font-semibold">
                                        <TeamBadge team={row.team} size="sm" />
                                        {row.team.name}
                                    </span>
                                </td>
                                {showPlayed && <td className="py-2 text-right text-muted">{row.played ?? "–"}</td>}
                                <td className="py-2 pl-2 text-right font-extrabold">
                                    {row.points}
                                    {pointsSuffix}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}
