/* eslint-disable @next/next/no-img-element */
import type { Team } from "../../../types/sports";

interface TeamBadgeProps {
    team: Team;
    size?: "sm" | "md";
}

const SIZES = {
    sm: "h-6 w-6 text-[8px]",
    md: "h-8 w-8 text-[10px]",
};

/** Escudo do time: usa `logoUrl` quando existe, senão círculo com a sigla. */
export function TeamBadge({ team, size = "md" }: TeamBadgeProps) {
    if (team.logoUrl) {
        return (
            <img
                src={team.logoUrl}
                alt=""
                className={`${SIZES[size].split(" ").slice(0, 2).join(" ")} flex-none object-contain`}
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            className={`${SIZES[size]} flex flex-none items-center justify-center rounded-full bg-brand font-bold text-white`}
            style={team.color ? { backgroundColor: team.color } : undefined}
        >
            {team.shortName}
        </span>
    );
}
