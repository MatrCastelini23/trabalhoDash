import type { ApiResult, Match } from "../../../types/sports";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";
import { MatchRow } from "../MatchRow";

export function RecentSection({ result }: { result: ApiResult<Match[]> }) {
    const { data, error } = result;

    return (
        <section aria-labelledby="past-title" className="flex flex-col gap-4">
            <SectionHeader id="past-title" title="Jogos anteriores" linkLabel="Ver histórico" />
            {data.length === 0 ? (
                <EmptyState error={error} message="Nenhum resultado recente." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                    {data.map((match) => (
                        <MatchRow key={match.id} match={match} variant="finished" />
                    ))}
                </div>
            )}
        </section>
    );
}
