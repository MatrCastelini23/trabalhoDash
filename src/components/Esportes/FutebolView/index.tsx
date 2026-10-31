import { getStandings } from "../../../services/standings";
import { getUpcomingMatches } from "../../../services/matches";
import { COMPETITIONS, LIMITS } from "../../../lib/config";
import { StandingsCard } from "../../Dashboard/StandingsCard";
import { UpcomingSection } from "../../Dashboard/UpcomingSection";

export async function FutebolView() {
    const [table, upcoming] = await Promise.all([
        getStandings(COMPETITIONS.brasileirao, LIMITS.fullTable),
        getUpcomingMatches("futebol", LIMITS.sportUpcoming),
    ]);

    return (
        <div className="flex flex-wrap items-start gap-8">
            <div className="min-w-0 flex-[1_1_480px]">
                <StandingsCard id="brasileirao-title" title="Brasileirão Série A" result={table} detailed />
            </div>
            <div className="min-w-0 flex-[1_1_480px]">
                <UpcomingSection result={upcoming} title="Próximos jogos · Brasileirão e Champions League" linkLabel="" />
            </div>
        </div>
    );
}