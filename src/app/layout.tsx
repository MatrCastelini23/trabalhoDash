import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "sportsTrack",
  description: "Placares, jogos anteriores e próximos jogos de futebol, Fórmula 1 e Counter-Strike.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white font-sans text-ink antialiased tabular-nums">
        {children}
      </body>
    </html >
  )
}