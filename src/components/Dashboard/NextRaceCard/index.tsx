import type { ApiResult, Race } from "../../../types/sports";
import { daysUntil, formatDay, formatTime } from "../../../lib/format";
import { describeWeather, type WeatherIcon } from "../../../lib/weather";

const ICONS: Record<WeatherIcon, React.ReactNode> = {
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </>
    ),
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
    rain: (
        <>
            <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" />
            <path d="M16 14v6M8 14v6M12 16v6" />
        </>
    ),
    storm: (
        <>
            <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
            <path d="m13 12-3 5h4l-3 5" />
        </>
    ),
    snow: (
        <>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01" />
        </>
    ),
    fog: (
        <>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M16 17H7M17 21H9" />
        </>
    ),
};

function WeatherGlyph({ icon }: { icon: WeatherIcon }) {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[icon]}
        </svg>
    );
}

function WeatherBox({ race }: { race: Race }) {
    const { weather } = race;

    if (!weather) {
        // A previsão só existe nos 16 dias anteriores à corrida
        const tooFar = daysUntil(race.startsAt) > 15;
        return (
            <p className="text-sm text-muted">
                {tooFar ? "A previsão fica disponível 16 dias antes da corrida." : "Previsão indisponível no momento."}
            </p>
        );
    }

    const { label, icon } = describeWeather(weather.code);
    const details = [
        weather.rainChance != null ? `Chuva ${weather.rainChance}%` : null,
        weather.windKmh != null ? `Vento ${weather.windKmh} km/h` : null,
    ].filter(Boolean);

    return (
        <div className="flex items-center gap-3">
            <span className="text-brand">
                <WeatherGlyph icon={icon} />
            </span>
            <div className="flex flex-col">
                <span className="text-lg font-extrabold">
                    {weather.temperatureC}°C · {label}
                </span>
                {details.length > 0 && <span className="text-xs text-muted">{details.join(" · ")}</span>}
            </div>
        </div>
    );
}

export function NextRaceCard({ result }: { result: ApiResult<Race | undefined> }) {
    const race = result.data;

    return (
        <section aria-label="Próxima corrida de Fórmula 1" className="flex flex-col gap-4 rounded-2xl bg-brand p-6 text-white">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e3ecff]">Fórmula 1 · Próxima corrida</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 21V4" />
                    <path d="M5 4h13l-2.5 4L18 12H5" />
                </svg>
            </div>

            {race ? (
                <>
                    <div className="flex flex-col gap-1">
                        <span className="text-[26px] font-extrabold leading-tight tracking-tight">{race.name}</span>
                        <span className="text-sm text-[#e3ecff]">
                            {race.circuit} · {race.country}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl bg-white px-3.5 py-3 text-ink">
                            <div className="text-xs font-semibold text-muted">Largada (horário de Brasília)</div>
                            <div className="text-lg font-extrabold">
                                {formatDay(race.startsAt)} · {formatTime(race.startsAt)}
                            </div>
                        </div>
                        <div className="rounded-xl bg-white px-3.5 py-3 text-ink">
                            <div className="mb-1 text-xs font-semibold text-muted">Previsão no local</div>
                            <WeatherBox race={race} />
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-[15px] text-[#e3ecff]" role={result.error ? "alert" : undefined}>
                    {result.error ? "Não foi possível carregar a próxima corrida agora." : "Nenhuma corrida agendada."}
                </p>
            )}
        </section>
    );
}