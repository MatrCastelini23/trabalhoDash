import type { ApiResult, Match } from "../../../types/sports";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";
import { LiveMatchCard } from "../LiveMatchCard";
import { LiveRefresher } from "../LiveRefresher";

export function LiveSection({ result }: { result: ApiResult<Match[]> }) {
    const { data, error } = result;

    return (
        <section aria-labelledby="live-title" className="flex flex-col gap-4">
            <SectionHeader id="live-title" title="Ao vivo agora" live linkLabel="Ver todos" />

            {data.length === 0 ? (
                <EmptyState error={error} message="Nenhuma partida ao vivo neste momento." />
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {data.map((match) => (
                        <LiveMatchCard key={match.id} match={match} />
                    ))}
                </div>
            )}

            <LiveRefresher />
        </section>
    );
}
