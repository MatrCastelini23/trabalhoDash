import Link from "next/link";
import type { ApiResult, Race } from "../../../types/sports";
import { daysUntil, formatDayMonth, formatTime } from "../../../lib/format";

export function NextRaceCard({ result }: { result: ApiResult<Race | undefined> }) {
    const race = result.data;

    return (
        <section aria-label="Próxima corrida de Fórmula 1" className="flex flex-col gap-4 rounded-2xl bg-brand p-6 text-white">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e3ecff]">
                    Fórmula 1 · Próxima corrida
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 21V4" />
                    <path d="M5 4h13l-2.5 4L18 12H5" />
                </svg>
            </div>

            {race ? (
                <>
                    <div className="flex flex-col gap-1">
                        <span className="text-[26px] font-extrabold leading-tight tracking-tight">{race.name}</span>
                        <span className="text-sm text-[#e3ecff]">{race.circuit}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="min-w-30 flex-1 rounded-xl bg-white px-3.5 py-3 text-ink">
                            <div className="text-xs font-semibold text-muted">Largada</div>
                            <div className="text-lg font-extrabold">
                                {formatDayMonth(race.startsAt)} · {formatTime(race.startsAt)}
                            </div>
                        </div>
                        <div className="min-w-30 flex-1 rounded-xl bg-white px-3.5 py-3 text-ink">
                            <div className="text-xs font-semibold text-muted">Faltam</div>
                            <div className="text-lg font-extrabold text-brand">{daysUntil(race.startsAt)} dias</div>
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="inline-flex min-h-11 items-center self-start rounded-xl bg-white px-[18px] text-sm font-bold text-brand hover:bg-brand-soft"
                    >
                        Ver programação
                    </Link>
                </>
            ) : (
                <p className="text-[15px] text-[#e3ecff]" role={result.error ? "alert" : undefined}>
                    {result.error
                        ? "Não foi possível carregar a próxima corrida agora."
                        : "Nenhuma corrida agendada."}
                </p>
            )}
        </section>
    );
}
