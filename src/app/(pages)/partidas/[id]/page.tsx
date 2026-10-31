import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { DetalhePartidas } from "@/src/components/Partidas/DetalhePartidas";
import { getMatchDetail } from "@/src/services/matchDetail";
import { isValidMatchId } from "@/src/lib/filters";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Detalhes da partida · sportsTrack" };

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!isValidMatchId(id)) notFound();

    const result = await getMatchDetail(id);
    if (!result.data && !result.error) notFound();

    return (
        <>
            <Header />
            <main className="mx-auto max-w-[960px] px-6 pb-12 pt-8">
                <DetalhePartidas result={result} />
            </main>
            <Footer />
        </>
    );
}