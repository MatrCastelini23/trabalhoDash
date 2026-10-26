"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/futebol", label: "Futebol" },
    { href: "/couterStrike", label: "CounterStrike" },
    { href: "/formulaUm", label: "Fórmula 1" },
    { href: "/times", label: "Times" },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    function handleLogout() {
        router.push("/login")
    }

    return (
        <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-black border-r-2 border-white text-white">
            <div className="px-6 py-6 border-b-2 border-white">
                <h2 className="text-xl font-bold tracking-wide">SportsTrack</h2>
                <p className="text-sm text-gray-300">Esportes &amp; e-sports</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-2">
                    {links.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(link.href + "/")
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`block rounded-md border-2 border-white px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${active
                                        ? "bg-white text-black"
                                        : "bg-black text-white hover:bg-white hover:text-black"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t-2 border-white">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md border-2 border-white bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                    Sair
                </button>
            </div>
        </aside>
    )
}