"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/services/authService";
import { getStoredToken, isTokenValid, setStoredToken } from "@/src/lib/auth";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Quem já tem sessão válida não precisa ver a tela de login
    useEffect(() => {
        if (isTokenValid(getStoredToken())) router.replace("/dashboard");
    }, [router]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const token = await login(email, password);
            setStoredToken(token);
            router.replace("/dashboard");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao entrar");
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md border-2 border-blue-750 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="email" className="font-semibold">E-mail</label>
                <input
                    type="email"
                    required
                    id="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 max-w-full rounded-xl border border-field bg-surface pl-2.5 pr-3.5 text-sm text-ink"
                />

                <label htmlFor="password" className="font-semibold">Senha</label>
                <input
                    id="password"
                    required
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 max-w-full rounded-xl border border-field bg-surface pl-2.5 pr-3.5 text-sm text-ink"
                />

                {error && (
                    <p role="alert" className="text-sm font-semibold text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                    {loading ? "Entrando…" : "Entrar"}
                </button>
            </form>
        </div>
    );
}