import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Sport } from "@/src/types/sports";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { FutebolView } from "@/src/components/Esportes/FutebolView";
import { FormulaView } from "@/src/components/Esportes/FormulaView";
import { CsView } from "@/src/components/Esportes/CsView";
import { SPORT_LABELS, sportFromSlug } from "@/src/lib/config";

export const dynamic = "force-dynamic";

type Params = Promise<{ sport: string }>;
type SearchParams = Promise<{ campeonato?: string }>;

const DESCRIPTIONS: Record<Sport, string> = {
    futebol: "Tabela do Brasileirão e próximos jogos do Brasileirão e da Champions League.",
    f1: "Próxima corrida e classificação de pilotos e construtores.",
    cs: "Campeonatos em andamento e próximos, com as partidas de cada um.",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const sport = sportFromSlug((await params).sport);
    return { title: sport ? `${SPORT_LABELS[sport]} · sportsTrack` : "sportsTrack" };
}

export default async function SportPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
    const sport = sportFromSlug((await params).sport);
    if (!sport) notFound();
    const { campeonato } = await searchParams;

    return (
        <>
            <Header />
            <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 pb-12 pt-8">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight">{SPORT_LABELS[sport]}</h1>
                    <p className="text-[15px] text-muted">{DESCRIPTIONS[sport]}</p>
                </div>

                {sport === "futebol" && <FutebolView />}
                {sport === "f1" && <FormulaView />}
                {sport === "cs" && <CsView selectedId={campeonato} />}
            </main>
            <Footer />
        </>
    );
}