/* eslint-disable @next/next/no-img-element */
import type { ApiResult, Championship, CsChampionships } from "../../../types/sports";
import { daysUntil, formatDayMonth } from "../../../lib/format";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";

function Row({ championship, footer }: { championship: Championship; footer: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            {championship.logoUrl && (
                <img src={championship.logoUrl} alt="" className="h-9 w-9 flex-none object-contain" />
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-bold leading-snug">{championship.name}</span>
                <span className="text-xs text-muted">{footer}</span>
            </div>
        </div>
    );
}

const runningFooter = (c: Championship) => (c.endsAt ? `Até ${formatDayMonth(c.endsAt)}` : "Em andamento");

function nextFooter(c: Championship) {
    if (!c.startsAt) return "Data a confirmar";
    const days = daysUntil(c.startsAt);
    const when = days === 0 ? "Começa hoje" : `Começa em ${days} ${days === 1 ? "dia" : "dias"}`;
    return `${when} · ${formatDayMonth(c.startsAt)}`;
}

const subtitle = "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand";

export function ChampionshipCard({ result }: { result: ApiResult<CsChampionships> }) {
    const { running, next } = result.data;

    return (
        <section aria-labelledby="cs-title" className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
            <SectionHeader id="cs-title" title="Counter-Strike" linkLabel="Ver campeonatos" level="card" />

            {running.length === 0 && !next ? (
                <EmptyState error={result.error} message="Nenhum campeonato encontrado." />
            ) : (
                <>
                    <div className="flex flex-col gap-2">
                        <h3 className={subtitle}>
                            <span aria-hidden="true" className="h-1.5 w-1.5 animate-live rounded-full bg-brand" />
                            Em andamento · {running.length}
                        </h3>
                        {running.length === 0 ? (
                            <p className="text-sm text-muted">Nenhum campeonato em andamento.</p>
                        ) : (
                            <ul
                                tabIndex={0}
                                aria-label="Campeonatos em andamento"
                                className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1"
                            >
                                {running.map((c) => (
                                    <li key={c.id}>
                                        <Row championship={c} footer={runningFooter(c)} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {next && (
                        <div className="flex flex-col gap-2">
                            <h3 className={subtitle}>Próximo campeonato</h3>
                            <Row championship={next} footer={nextFooter(next)} />
                        </div>
                    )}
                </>
            )}
        </section>
    );
}