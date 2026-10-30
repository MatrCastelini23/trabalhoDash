import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { DashboardTitle } from "@/src/components/Dashboard";
import { SportFilter } from "@/src/components/Dashboard/SportFilter";
import { LiveSection } from "@/src/components/Dashboard/LiveSection";
import { UpcomingSection } from "@/src/components/Dashboard/UpcomingSection";
import { NextRaceCard } from "@/src/components/Dashboard/NextRaceCard";
import { StandingsCard } from "@/src/components/Dashboard/StandingsCard";
import { getLiveMatches, getRecentMatches, getUpcomingMatches } from "@/src/services/matches";
import { getNextRace } from "@/src/services/races";
import { getStandings } from "@/src/services/standings";
import { COMPETITIONS } from "@/src/lib/config";
import { filterByQuery, parseSport } from "@/src/lib/filters";
import { RecentSection } from "@/src/components/Dashboard/RecentSection";
import { getCsChampionships } from "@/src/services/cs";
import { ChampionshipCard } from "@/src/components/Dashboard/ChampionshipCard";
// Placares ao vivo: sempre buscar dados novos a cada requisição.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ sport?: string; q?: string }>;

export default async function Dashboard({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const sport = parseSport(params.sport);
  const query = params.q?.trim() || undefined;

  const showF1 = !sport || sport === "f1";
  const showFutebol = !sport || sport === "futebol";
  const showCs = !sport || sport === "cs";

  const [live, upcoming, recent, race, brasileirao, csChampionships] = await Promise.all([
    getLiveMatches(sport),
    getUpcomingMatches(sport),
    getRecentMatches(sport),
    showF1 ? getNextRace() : Promise.resolve({ data: undefined, error: false }),
    showFutebol ? getStandings(COMPETITIONS.brasileirao) : Promise.resolve({ data: [], error: false }),
    showCs ? getCsChampionships() : Promise.resolve({ data: {}, error: false }),
  ]);

  const liveResult = { ...live, data: filterByQuery(live.data, query) };
  const upcomingResult = { ...upcoming, data: filterByQuery(upcoming.data, query) };
  const recentResult = { ...recent, data: filterByQuery(recent.data, query) };

  const liveCount = liveResult.data.length;
  const summary = `${liveCount} ${liveCount === 1 ? "partida ao vivo" : "partidas ao vivo"} agora · ${upcomingResult.data.length} ${upcomingResult.data.length === 1 ? "próxima" : "próximas"}`;

  return (
    <>
      <Header activeSport={sport} query={query} />

      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 pb-12 pt-8">
        <section className="flex flex-wrap items-end justify-between gap-5">
          <DashboardTitle summary={summary} />
          <SportFilter active={sport} query={query} />
        </section>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-9">
            <LiveSection result={liveResult} />
            <UpcomingSection result={upcomingResult} />
            <RecentSection result={recentResult} />
          </div>

          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
            {showF1 && <NextRaceCard result={race} />}
            {showFutebol && (
              <StandingsCard
                id="brasileirao-title"
                title="Brasileirão Série A"
                linkLabel="Tabela completa"
                result={brasileirao}
                showPlayed
              />
            )}
            {showCs && (
              <ChampionshipCard
                result={csChampionships}
              />
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
