import Link from "next/link";

interface SectionHeaderProps {
    id: string;
    title: string;
    linkLabel?: string;
    linkHref?: string;
    live?: boolean;
    level?: "section" | "card";
}

export function SectionHeader({
    id,
    title,
    linkLabel,
    linkHref = "#",
    live = false,
    level = "section",
}: SectionHeaderProps) {
    const titleClass =
        level === "section"
            ? "text-[22px] font-bold tracking-tight"
            : "text-lg font-bold tracking-tight";

    return (
        <div className="flex items-center justify-between gap-3">
            <h2 id={id} className={`flex items-center gap-2.5 ${titleClass}`}>
                {live && <span aria-hidden="true" className="h-2.5 w-2.5 animate-live rounded-full bg-brand" />}
                {title}
            </h2>
            {linkLabel && (
                <Link href={linkHref} className="text-sm font-semibold text-brand hover:text-brand-dark">
                    {linkLabel}
                </Link>
            )}
        </div>
    );
}
