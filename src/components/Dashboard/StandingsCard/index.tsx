import type { ApiResult, StandingRow } from "../../../types/sports";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";
import { TeamBadge } from "../../ui/TeamBadge";

interface StandingsCardProps {
    id: string;
    title: string;
    caption?: string;
    linkLabel?: string;
    linkHref?: string;
    result: ApiResult<StandingRow[]>;
    nameLabel?: string;
    showPlayed?: boolean;
    /** Mostra também V, E, D e SG (tabela de futebol). */
    detailed?: boolean;
    pointsSuffix?: string;
}

export function StandingsCard({
    id, title, caption, linkLabel, linkHref, result,
    nameLabel = "Equipe", showPlayed = false, detailed = false, pointsSuffix = "",
}: StandingsCardProps) {
    const { data, error } = result;
    const num = "w-7 py-2 text-right text-muted";
    const th = "pb-2 text-right font-semibold";

    return (
        <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <SectionHeader id={id} title={title} linkLabel={linkLabel} linkHref={linkHref} level="card" />
            {caption && <p className="-mt-1 text-xs text-muted">{caption}</p>}

            {data.length === 0 ? (
                <EmptyState error={error} message="Classificação indisponível." />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <caption className="sr-only">{title}</caption>
                        <thead>
                            <tr className="text-left text-xs font-semibold text-muted">
                                <th scope="col" className="w-5 px-1 pb-2 font-semibold">#</th>
                                <th scope="col" className="pb-2 font-semibold">{nameLabel}</th>
                                {(showPlayed || detailed) && <th scope="col" className={`${th} w-7`}>J</th>}
                                {detailed && (
                                    <>
                                        <th scope="col" className={`${th} w-7`}>V</th>
                                        <th scope="col" className={`${th} w-7`}>E</th>
                                        <th scope="col" className={`${th} w-7`}>D</th>
                                        <th scope="col" className={`${th} w-9`}>SG</th>
                                    </>
                                )}
                                <th scope="col" className={`${th} pl-2`}>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id} className="border-t border-line-soft">
                                    <td className="px-1 py-2 font-bold text-brand">{row.position}</td>
                                    <td className="py-2">
                                        <span className="flex items-center gap-2 font-semibold">
                                            <TeamBadge team={row.team} size="sm" />
                                            <span className="flex flex-col leading-tight">
                                                {row.team.name}
                                                {row.subtitle && <span className="text-xs font-normal text-muted">{row.subtitle}</span>}
                                            </span>
                                        </span>
                                    </td>
                                    {(showPlayed || detailed) && <td className={num}>{row.played ?? "–"}</td>}
                                    {detailed && (
                                        <>
                                            <td className={num}>{row.won ?? "–"}</td>
                                            <td className={num}>{row.draw ?? "–"}</td>
                                            <td className={num}>{row.lost ?? "–"}</td>
                                            <td className={`${num} w-9`}>{row.goalDifference ?? "–"}</td>
                                        </>
                                    )}
                                    <td className="py-2 pl-2 text-right font-extrabold">
                                        {row.points}
                                        {pointsSuffix}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}