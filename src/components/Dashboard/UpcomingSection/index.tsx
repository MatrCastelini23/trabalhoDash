import type { ApiResult, Match } from "../../../types/sports";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";
import { MatchRow } from "../MatchRow";

export function UpcomingSection({ result }: { result: ApiResult<Match[]> }) {
    const { data, error } = result;

    return (
        <section aria-labelledby="next-title" className="flex flex-col gap-4">
            <SectionHeader id="next-title" title="Próximas partidas" linkLabel="Abrir calendário" />
            {data.length === 0 ? (
                <EmptyState error={error} message="Nenhuma partida agendada." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                    {data.map((match) => (
                        <MatchRow key={match.id} match={match} variant="upcoming" />
                    ))}
                </div>
            )}
        </section>
    );
}
