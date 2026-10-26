"use client"

export function LoginForm() {

    async function handleSubmit() {
        localStorage.setItem("isLogon", "yes");
    }

    return (
        <div className="">
            <form
                action={handleSubmit}
            >
                <label htmlFor="email">E-mail</label>
                <input
                    type="text"
                    id="email"
                />
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="text"
                />
                <button
                    type="submit"
                >
                    Entrar
                </button>
            </form>
        </div >
    )
}