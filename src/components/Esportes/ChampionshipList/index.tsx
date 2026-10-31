/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Championship } from "../../../types/sports";
import { formatDayMonth } from "../../../lib/format";
import { SectionHeader } from "../../ui/SectionHeader";
import { EmptyState } from "../../ui/EmptyState";

interface ChampionshipListProps {
    running: Championship[];
    upcoming: Championship[];
    selectedId?: string;
    basePath: string;
    error?: boolean;
}

function Item({ c, href, selected, footer }: { c: Championship; href: string; selected: boolean; footer: string }) {
    return (
        <Link
            href={href}
            scroll={false}
            aria-current={selected ? "true" : undefined}
            className={`flex items-center gap-3 rounded-xl border p-3 transition ${selected ? "border-brand bg-brand-soft" : "border-transparent bg-surface hover:border-field"
                }`}
        >
            {c.logoUrl && <img src={c.logoUrl} alt="" className="h-9 w-9 flex-none object-contain" />}
            <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-bold leading-snug">{c.name}</span>
                <span className="text-xs text-muted">{footer}</span>
            </span>
        </Link>
    );
}

const subtitle = "text-xs font-semibold uppercase tracking-wider text-brand";

export function ChampionshipList({ running, upcoming, selectedId, basePath, error }: ChampionshipListProps) {
    const hrefFor = (c: Championship) => `${basePath}?campeonato=${c.id}`;

    return (
        <section aria-labelledby="cs-list-title" className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line bg-white p-5">
            <SectionHeader id="cs-list-title" title="Campeonatos" level="card" />

            {running.length === 0 && upcoming.length === 0 ? (
                <EmptyState error={error} message="Nenhum campeonato encontrado." />
            ) : (
                <>
                    <div className="flex flex-col gap-2">
                        <h3 className={subtitle}>Em andamento · {running.length}</h3>
                        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
                            {running.map((c) => (
                                <Item key={c.id} c={c} href={hrefFor(c)} selected={c.id === selectedId} footer={c.endsAt ? `Até ${formatDayMonth(c.endsAt)}` : "Em andamento"} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className={subtitle}>Próximos campeonatos · {upcoming.length}</h3>
                        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                            {upcoming.map((c) => (
                                <Item key={c.id} c={c} href={hrefFor(c)} selected={c.id === selectedId} footer={c.startsAt ? `Começa em ${formatDayMonth(c.startsAt)}` : "Data a confirmar"} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}