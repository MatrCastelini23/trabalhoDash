"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LIVE_POLL_MS } from "../../../lib/config";

/** Reexecuta os server components periodicamente para atualizar placares ao vivo. */
export function LiveRefresher({ intervalMs = LIVE_POLL_MS }: { intervalMs?: number }) {
    const router = useRouter();

    useEffect(() => {
        const id = window.setInterval(() => {
            if (document.visibilityState === "visible") router.refresh();
        }, intervalMs);
        return () => window.clearInterval(id);
    }, [router, intervalMs]);

    return null;
}
