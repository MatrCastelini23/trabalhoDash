import { TIMEZONE } from "./config";

const dayKey = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d); // YYYY-MM-DD

const diffInDays = (a: Date, b: Date) =>
    Math.round((Date.parse(dayKey(b)) - Date.parse(dayKey(a))) / 86_400_000);

const clean = (s: string) => s.replace(".", "");
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatTime(iso: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

/** "Hoje", "Amanhã", "Ontem" ou "Sáb, 31 out". */
export function formatDay(iso: string, now: Date = new Date()): string {
    const date = new Date(iso);
    const diff = diffInDays(now, date);
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    if (diff === -1) return "Ontem";

    const parts = new Intl.DateTimeFormat("pt-BR", {
        timeZone: TIMEZONE,
        weekday: "short",
        day: "2-digit",
        month: "short",
    }).formatToParts(date);
    const get = (type: string) => clean(parts.find((p) => p.type === type)?.value ?? "");
    return `${capitalize(get("weekday"))}, ${get("day")} ${get("month")}`;
}

/** "08 nov" */
export function formatDayMonth(iso: string): string {
    const parts = new Intl.DateTimeFormat("pt-BR", {
        timeZone: TIMEZONE,
        day: "2-digit",
        month: "short",
    }).formatToParts(new Date(iso));
    const get = (type: string) => clean(parts.find((p) => p.type === type)?.value ?? "");
    return `${get("day")} ${get("month")}`;
}

/** "Terça-feira, 27 de outubro" */
export function formatLongDate(now: Date = new Date()): string {
    return capitalize(
        new Intl.DateTimeFormat("pt-BR", {
            timeZone: TIMEZONE,
            weekday: "long",
            day: "numeric",
            month: "long",
        }).format(now),
    );
}

export function daysUntil(iso: string, now: Date = new Date()): number {
    return Math.max(0, diffInDays(now, new Date(iso)));
}
