import axios from "axios";

export async function login(email: string, password: string): Promise<string> {
    try {
        const { data } = await axios.post<{ token: string }>("/api/login", {
            email,
            password,
        });
        return data.token;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error("Não foi possivel logar")
    }
}