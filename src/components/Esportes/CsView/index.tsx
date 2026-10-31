/* eslint-disable @next/next/no-img-element */
import { getCsChampionships, getCsSerieMatches } from "../../../services/cs";
import { sportPath } from "../../../lib/config";
import { formatDayMonth } from "../../../lib/format";
import { EmptyState } from "../../ui/EmptyState";
import { ChampionshipList } from "../ChampionshipList";
import { LiveSection } from "../../Dashboard/LiveSection";
import { UpcomingSection } from "../../Dashboard/UpcomingSection";
import { RecentSection } from "../../Dashboard/RecentSection";

export async function CsView({ selectedId }: { selectedId?: string }) {
    const championships = await getCsChampionships();
    const { running, upcoming } = championships.data;

    const selected = [...running, ...upcoming].find((c) => c.id === selectedId) ?? running[0] ?? upcoming[0];
    const matches = selected ? await getCsSerieMatches(Number(selected.id)) : undefined;
    const error = matches?.error ?? false;

    return (
        <div className="flex flex-wrap items-start gap-8">
            <aside className="min-w-0 flex-[1_1_320px]">
                <ChampionshipList
                    running={running}
                    upcoming={upcoming}
                    selectedId={selected?.id}
                    basePath={sportPath("cs")}
                    error={championships.error}
                />
            </aside>

            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-9">
                {!selected || !matches ? (
                    <EmptyState error={championships.error} message="Selecione um campeonato para ver as partidas." />
                ) : (
                    <>
                        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5">
                            {selected.logoUrl && <img src={selected.logoUrl} alt="" className="h-12 w-12 flex-none object-contain" />}
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-brand">Partidas do campeonato</span>
                                <h2 className="text-xl font-bold tracking-tight">{selected.name}</h2>
                                {selected.startsAt && (
                                    <span className="text-sm text-muted">
                                        {formatDayMonth(selected.startsAt)}
                                        {selected.endsAt ? ` – ${formatDayMonth(selected.endsAt)}` : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        {matches.data.live.length > 0 && <LiveSection result={{ data: matches.data.live, error }} />}
                        <UpcomingSection result={{ data: matches.data.upcoming, error }} title="Próximas partidas" linkLabel="" />
                        <RecentSection result={{ data: matches.data.recent, error }} />
                    </>
                )}
            </div>
        </div>
    );
}