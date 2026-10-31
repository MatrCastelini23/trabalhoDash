import Link from "next/link";
import type { ApiResult, MatchDetail, MatchEvent } from "../../../types/sports";
import { SPORT_LABELS, sportPath } from "../../../lib/config";
import { formatDay, formatTime } from "../../../lib/format";
import { TeamBadge } from "../../ui/TeamBadge";
import { EmptyState } from "../../ui/EmptyState";
import { LiveRefresher } from "../../Dashboard/LiveRefresher";

const KIND_LABEL: Record<MatchEvent["kind"], string> = {
    goal: "Gol",
    yellow: "Cartão amarelo",
    red: "Cartão vermelho",
    sub: "Substituição",
};
const MAP_STATUS = { finished: "Encerrado", running: "Em andamento", pending: "A jogar" } as const;

const statusLabel = (m: MatchDetail) =>
    m.status === "live" ? (m.clock ?? "Ao vivo") : m.status === "finished" ? "Encerrado" : "Agendada";

function Side({ team }: { team: NonNullable<MatchDetail["home"]> }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <TeamBadge team={team} size="md" />
            <span className="text-base font-semibold">{team.name}</span>
        </div>
    );
}

export function DetalhePartidas({ result }: { result: ApiResult<MatchDetail | undefined> }) {
    const m = result.data;
    if (!m) return <EmptyState error message="" />;

    const info = [
        ["Data", formatDay(m.startsAt)],
        ["Horário", formatTime(m.startsAt)],
        m.venue ? ["Local", m.venue] : null,
        m.attendance ? ["Público", m.attendance.toLocaleString("pt-BR")] : null,
        m.referee ? ["Árbitro", m.referee] : null,
        m.halfTime ? ["Intervalo", `${m.halfTime.home} – ${m.halfTime.away}`] : null,
    ].filter((i): i is string[] => i !== null);

    return (
        <div className="flex flex-col gap-6">
            <Link href={sportPath(m.sport)} className="text-sm font-semibold text-brand hover:text-brand-dark">
                ← {SPORT_LABELS[m.sport]}
            </Link>

            <section aria-label="Placar" className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted">
                        {SPORT_LABELS[m.sport]} · {m.league}
                        {m.detail ? ` · ${m.detail}` : ""}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${m.status === "live" ? "bg-brand text-white" : "bg-brand-soft text-brand-dark"}`}>
                        {statusLabel(m)}
                    </span>
                </div>

                {m.home && m.away ? (
                    <div className="flex items-center gap-4">
                        <Side team={m.home} />
                        <div className="text-center text-4xl font-extrabold tracking-tight">
                            {m.status === "scheduled" ? (
                                <span className="text-2xl">{formatTime(m.startsAt)}</span>
                            ) : (
                                <>
                                    {m.homeScore ?? "–"} – {m.awayScore ?? "–"}
                                </>
                            )}
                        </div>
                        <Side team={m.away} />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">{m.title ?? "Partida a definir"}</h1>
                )}
            </section>

            <section aria-label="Informações" className="rounded-2xl border border-line bg-white p-6">
                <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                    {info.map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-xs font-semibold text-muted">{label}</dt>
                            <dd className="text-[15px] font-bold">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {m.sport === "futebol" && m.status !== "scheduled" && (
                <section aria-labelledby="events-title" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
                    <h2 id="events-title" className="text-lg font-bold tracking-tight">Lances da partida</h2>
                    {m.events.length === 0 ? (
                        <p className="text-sm text-muted">Sem eventos registrados para esta partida.</p>
                    ) : (
                        <ol className="flex flex-col">
                            {m.events.map((e) => (
                                <li key={e.id} className="flex items-baseline gap-3 border-t border-line-soft py-2 first:border-t-0">
                                    <span className="w-12 flex-none text-sm font-bold text-brand">{e.minute}</span>
                                    <span className="flex min-w-0 flex-col">
                                        <span className="text-sm font-semibold">{KIND_LABEL[e.kind]}{e.team ? ` · ${e.team}` : ""}</span>
                                        <span className="text-sm text-muted">{e.text}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            )}

            {m.maps.length > 0 && (
                <section aria-labelledby="maps-title" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
                    <h2 id="maps-title" className="text-lg font-bold tracking-tight">Mapas</h2>
                    <ol className="flex flex-col">
                        {m.maps.map((g) => (
                            <li key={g.position} className="flex items-center justify-between gap-3 border-t border-line-soft py-2 first:border-t-0">
                                <span className="text-sm font-semibold">Mapa {g.position}</span>
                                <span className="text-sm text-muted">
                                    {MAP_STATUS[g.status]}
                                    {g.status === "finished" && g.winner ? ` · vencedor: ${g.winner}` : ""}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {m.streams.length > 0 && (
                <section aria-labelledby="streams-title" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
                    <h2 id="streams-title" className="text-lg font-bold tracking-tight">Onde assistir</h2>
                    <ul className="flex flex-wrap gap-2">
                        {m.streams.map((s) => (
                            <li key={s.url}>
                                <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center rounded-xl border border-field px-4 text-sm font-semibold text-brand hover:bg-brand-soft"
                                >
                                    Transmissão ({s.language}){s.official ? " · oficial" : ""}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {m.status === "live" && <LiveRefresher />}
        </div>
    );
}