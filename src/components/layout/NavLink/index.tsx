"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const active = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-[10px] px-3.5 py-2.5 text-[15px] ${active ? "bg-brand-soft font-semibold text-brand" : "font-medium text-ink hover:bg-surface"
                }`}
        >
            {children}
        </Link>
    );
}