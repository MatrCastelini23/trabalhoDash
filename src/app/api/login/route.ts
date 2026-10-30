import { NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import type { User } from "@/src/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const JWT_SECRET = process.env.JWT_SECRET ?? "";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
        return NextResponse.json(
            { message: "Informe e-mail e senha." },
            { status: 400 },
        );
    }

    let usuarios: User[];
    try {
        const { data } = await axios.get<User[]>(`${API_URL}/users`, {
            params: { email },
        });
        usuarios = data;
    } catch {
        return NextResponse.json(
            { message: "Servidor de dados indisponível. O json-server está rodando?" },
            { status: 502 },
        );
    }

    const usuario = usuarios[0];
    if (!usuario || usuario.password !== password) {
        return NextResponse.json(
            { message: "E-mail ou senha incorretos." },
            { status: 401 },
        );
    }

    const token = jwt.sign(
        { name: usuario.name, email: usuario.email },
        JWT_SECRET,
        { subject: String(usuario.id), expiresIn: "1h" },
    );

    return NextResponse.json({ token });
}
