"use client"

import { login } from "@/src/services/authService"
import { redirect } from "next/navigation";
import { useState } from "react"

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const token = await login(email, password);
            localStorage.setItem("token", token);
            alert("Deu Certo")
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao logar"
            )
        }
    }
    return (
        <div className="w-full max-w-md border-2 border-blue-750 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="email" className="font-semibold">
                    E-mail
                </label>
                <input
                    type="email"
                    required
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 max-w-full rounded-xl border border-field bg-surface pl-2.5 pr-3.5 text-sm text-ink"
                />

                <label htmlFor="password" className="font-semibold">
                    Senha
                </label>
                <input
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="h-11 max-w-full rounded-xl border border-field bg-surface pl-2.5 pr-3.5 text-sm text-ink"
                />

                <button
                    type="submit"
                    className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                    Entrar
                </button>
            </form>
        </div>
    )
}