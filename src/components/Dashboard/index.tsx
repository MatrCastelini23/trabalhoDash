import { formatLongDate } from "../../lib/format";

interface DashboardTitleProps {
    summary: string;
}

export function DashboardTitle({ summary }: DashboardTitleProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-brand">{formatLongDate()}</p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight">Hoje no esporte</h1>
            <p className="text-[15px] text-muted">{summary}</p>
        </div>
    );
}
