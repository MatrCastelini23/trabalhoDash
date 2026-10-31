import { getNextRace } from "../../../services/races";
import { getF1Standings } from "../../../services/races";
import { NextRaceCard } from "../../Dashboard/NextRaceCard";
import { StandingsCard } from "../../Dashboard/StandingsCard";

export async function FormulaView() {
    const [race, standings] = await Promise.all([getNextRace(), getF1Standings()]);
    const { drivers, teams, afterRace } = standings.data;
    const caption = afterRace ? `Após o ${afterRace}` : undefined;

    return (
        <div className="flex flex-wrap items-start gap-8">
            <div className="min-w-0 flex-[1_1_320px]">
                <NextRaceCard result={race} />
            </div>
            <div className="min-w-0 flex-[1_1_360px]">
                <StandingsCard
                    id="f1-drivers-title"
                    title="Campeonato de Pilotos"
                    caption={caption}
                    nameLabel="Piloto"
                    result={{ data: drivers, error: standings.error }}
                />
            </div>
            <div className="min-w-0 flex-[1_1_360px]">
                <StandingsCard
                    id="f1-teams-title"
                    title="Campeonato de Construtores"
                    caption={caption}
                    result={{ data: teams, error: standings.error }}
                />
            </div>
        </div>
    );
}