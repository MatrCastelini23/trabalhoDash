"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearStoredToken, getStoredToken, isTokenValid } from "@/src/lib/auth";

/** Valida o token guardado e redireciona: sessão válida vai para o dashboard, senão para o login. */
export function AuthGuard() {
    const router = useRouter();

    useEffect(() => {
        const token = getStoredToken();

        if (isTokenValid(token)) {
            router.replace("/dashboard");
            return;
        }

        clearStoredToken(); // remove token expirado ou inválido
        router.replace("/login");
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center text-muted" aria-busy="true">
            <p>Verificando sessão…</p>
        </main>
    );
}