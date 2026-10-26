"use client"

import { redirect } from "next/navigation"

export function LoginForm() {

    async function handleSubmit() {
        redirect("/dashboard")
    }

    return (
        <div className="w-full max-w-md border-2 border-white rounded-lg p-8 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            <form action={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="email" className="font-semibold">
                    E-mail
                </label>
                <input
                    type="email"
                    id="email"
                    className="bg-black text-white border-2 border-white rounded-md px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                />

                <label htmlFor="password" className="font-semibold">
                    Senha
                </label>
                <input
                    id="password"
                    type="password"
                    className="bg-black text-white border-2 border-white rounded-md px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                />

                <button
                    type="submit"
                    className="mt-2 bg-white text-black font-bold border-2 border-white rounded-md px-4 py-2 hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                    Entrar
                </button>
            </form>
        </div>
    )
}